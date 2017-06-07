from flask import Blueprint, request, jsonify, session
from flask.views import MethodView
from flask_security import login_required, roles_required, current_user
from pgadmin.model import db, Role, User, Server, ServerGroup, Process
from pgadmin.browser.server_groups.servers.types import ServerType
from flask import g
from config import PG_DEFAULT_DRIVER
from pgadmin.utils.driver import get_driver
from pgadmin.utils.crypto import encrypt, decrypt, pqencryptpassword
from pgadmin.utils.driver.psycopg2 import ServerManager
from pgqueries import *
from datetime import datetime

pgstats = Blueprint('pgstats', 'pgstats', url_prefix='/pgstats')


class ConnectAPI(MethodView):
    def post(self):
        json_dict = {}
        if not current_user:
            json_dict['state'] = "error"
            json_dict['msg'] = "Access denied."
            return jsonify(json_dict)
        else:
            args= request.json.get('params')
            sid = args.get('sid')
            gid = args.get('gid')
            pwd = args.get('pwd')
            try:
                manager = get_driver(PG_DEFAULT_DRIVER).connection_manager(int(sid))
                conn = manager.connection()
                if conn.connected():
                    try:
                        cur = conn.conn.cursor()
                        cur.execute("SELECT version()")
                        x = cur.fetchone()[0]
                        cur.close()
                        json_dict['version'] = x.split(",")[0]
                        json_dict['state'] = "success"
                        json_dict['msg'] = "Already Connected."
                        return jsonify(json_dict)
                    except Exception as e:
                        pass
                pg_server = Server.query.filter_by(
                    id=sid,
                    servergroup_id=gid,
                    user_id=current_user.id
                ).first()
                if not pg_server:
                    json_dict['state'] = "error"
                    json_dict['msg'] = "Server not available in metadata."
                    return jsonify(json_dict)

                password = ""
                if pwd:
                    password = pwd
                    try:
                        password = encrypt(password, current_user.password)
                    except Exception as e:
                        errmsg = "ERROR: " + str(e)
                        json_dict['state'] = "error"
                        json_dict['msg'] = errmsg
                        return jsonify(json_dict)
                else:
                    if pg_server.password:
                        password=pg_server.password
                    else:
                        json_dict['state'] = "error"
                        json_dict['need_pwd'] = True
                        json_dict['msg'] = "password required."
                        return jsonify(json_dict)
                status = True
                try:
                    status, errmsg = conn.connect(
                        password=password,
                        server_types=ServerType.types()
                    )
                except Exception as e:
                    errmsg = "ERROR: " + str(e)
                    json_dict['state'] = "error"
                    json_dict['msg'] = errmsg
                    return jsonify(json_dict)
                if not status:
                    if hasattr(str, 'decode'):
                        errmsg = errmsg.decode('utf-8')
                    json_dict['state'] = "error"
                    json_dict['msg'] = errmsg
                    return jsonify(json_dict)
                else:
                    manager.update_session()
                    cur = conn.conn.cursor()
                    cur.execute("SELECT version()")
                    x = cur.fetchone()[0]
                    cur.close()
                    json_dict['version'] = x
                    json_dict['msg'] = "connected sucessfully"

            except Exception as e:
                errmsg = "ERROR: " + str(e)
                json_dict['state'] = "error"
                json_dict['msg'] = errmsg
            return jsonify(json_dict)


pgstats.add_url_rule('/connect/', view_func=ConnectAPI.as_view('connect'))


class ConnStatusAPI(MethodView):
    def get(self):
        if not current_user:
            return jsonify({'msg': 'Not Authorised',
                            'state': "error"})
        else:
            sid = request.args.get('sid')
            gid = request.args.get('gid')
            json_dict = {}
            try:
                manager = get_driver(PG_DEFAULT_DRIVER).connection_manager(int(sid))
                conn = manager.connection()
                if conn.connected():
                    try:
                        cur = conn.conn.cursor()
                        cur.execute("SELECT version()")
                        x = cur.fetchone()[0]
                        cur.close()
                        json_dict['version'] = x.split(",")[0]
                        json_dict['state'] = "success"
                        json_dict['msg'] = "Already Connected."
                        return jsonify(json_dict)
                    except Exception as e:
                        json_dict['state'] = "error"
                        json_dict['msg'] = str(e)
                        return jsonify(json_dict)
                else:
                    json_dict['state'] = "error"
                    json_dict['msg'] = "Not connected."
                    return jsonify(json_dict)

            except Exception as e:
                errmsg = "ERROR: " + str(e)
                json_dict['state'] = "error"
                json_dict['msg'] = errmsg
            return jsonify(json_dict)


pgstats.add_url_rule('/conn_status/', view_func=ConnStatusAPI.as_view('conn_status'))



class StatsAPI(MethodView):

    def get(self):
        sid = request.args.get('sid')
        gid = request.args.get('gid')
        manager = get_driver(PG_DEFAULT_DRIVER).connection_manager(int(sid))
        conn = manager.connection()

        json_dict = {}
        if not conn.connected():
            return jsonify({'message': 'db is not connected', 'state':"error"})
        else:
            try:
                stats_timestamp = datetime.utcnow()
                stats_time = stats_timestamp.strftime('%Y/%m/%d %H:%M:%S')
                cur = conn.conn.cursor()
                cur.execute(connection_query)
                columns = [desc[0] for desc in cur.description]
                result = []
                for res in cur:
                    result.append(dict(zip(columns, res)))
                cur.close()
                json_dict['time'] = stats_time
                json_dict['connections'] = {}
                for r in result:
                    json_dict['connections'][str(r['state'])] = r['count']
            except Exception as e:
                errmsg = "ERROR: " + str(e)
                json_dict['state'] = "error"
                json_dict['msg'] = errmsg
            return jsonify(json_dict)

pgstats.add_url_rule('/stats/', view_func=StatsAPI.as_view('stats'))


class ConfigAPI(MethodView):

    def get(self):
        sid = request.args.get('sid')
        gid = request.args.get('gid')
        manager = get_driver(PG_DEFAULT_DRIVER).connection_manager(int(sid))
        conn = manager.connection()

        json_dict = {}
        if not conn.connected():
            return jsonify({'message': 'db is not connected', 'state': "error"})
        else:
            try:
                cur = conn.conn.cursor()
                cur.execute("SELECT version()")
                x = cur.fetchone()[0]
                json_dict['x'] = str(x)
            except Exception as e:
                errmsg = "ERROR: " + str(e)
                json_dict['state'] = "error"
                json_dict['msg'] = errmsg
            return jsonify(json_dict)

pgstats.add_url_rule('/config/', view_func=ConfigAPI.as_view('config'))


class DBCloseAPI(MethodView):

    def get(self):
        sid = request.args.get('sid')
        gid = request.args.get('gid')
        manager = get_driver(PG_DEFAULT_DRIVER).connection_manager(int(sid))
        conn = manager.connection()
        if not conn.connected():
            return jsonify({'message': 'db is not connected', 'state': "error"})
        else:
            conn.conn.close()
            manager.update_session()
            return jsonify({'message': 'db was closed succesfully', 'state': "success"})

pgstats.add_url_rule('/disconnect/', view_func=DBCloseAPI.as_view('disconnect'))


class CloseAllDBSessionsAPI(MethodView):
    def get(self):
        managers = session.get('__pgsql_server_managers')
        for sess in managers:
            sess_mgr = managers[sess]
            for mgr in [m for m in sess_mgr if isinstance(m, ServerManager)]:
                mgr.release()
        return jsonify({"msg": "All Connection released", 'state': "success"})

pgstats.add_url_rule('/disconnectall/', view_func=CloseAllDBSessionsAPI.as_view('disconnectall'))