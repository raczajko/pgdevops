####################################################################
#########         Copyright 2016-2017 BigSQL             ###########
####################################################################

from flask import Flask, render_template, url_for, request, session

import os
from flask_triangle import Triangle
from flask_restful import reqparse, abort, Api, Resource

import json
from Components import Components as pgc

from flask_security import login_required, roles_required, current_user
# from flask_login import current_user
from flask_mail import Mail
from flask_babel import Babel, gettext
from pgadmin.utils.session import create_session_interface
from pgadmin.model import db, Role, User, Server, ServerGroup, Process
from flask_security import Security, SQLAlchemyUserDatastore
from pgadmin.utils.sqliteSessions import SqliteSessionInterface
import config
from flask_restful import reqparse
from datetime import datetime
import dateutil
import hashlib
import time
import pytz
import psutil
from pickle import dumps, loads
import csv

parser = reqparse.RequestParser()
#parser.add_argument('data')



config.APP_NAME = "pgDevOps by BigSQL"
config.LOGIN_NAME = "pgDevOps"
application = Flask(__name__)

babel = Babel(application)

Triangle(application)
api = Api(application)
application.config.from_object(config)

current_path = os.path.dirname(os.path.realpath(__file__))

reports_path = os.path.join(current_path, "reports")


##########################################################################
# Setup session management
##########################################################################
application.session_interface = SqliteSessionInterface(config.SESSION_DB_PATH)

application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{0}?timeout={1}'.format(
    config.SQLITE_PATH.replace('\\', '/'),
    getattr(config, 'SQLITE_TIMEOUT', 500)
)

application.config['WTF_CSRF_ENABLED'] = False

application.config['SECURITY_RECOVERABLE'] = True
application.config['SECURITY_CHANGEABLE'] = True

db.init_app(application)
Mail(application)
import pgadmin.utils.paths as paths

paths.init_app(application)

# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(application, user_datastore)

PGC_HOME = os.getenv("PGC_HOME", "")
PGC_LOGS = os.getenv("PGC_LOGS", "")

db_session = db.session

class pgcApi(Resource):
    def get(self, pgc_command):
        # if 'credentials' in session:
        data = pgc.get_data(pgc_command)
        return data


api.add_resource(pgcApi, '/api/<string:pgc_command>')


class pgcApiCom(Resource):
    def get(self, cmd, comp, pgc_host=None, password=None):
        data = pgc.get_data(cmd, comp,pgc_host=pgc_host)
        return data


api.add_resource(pgcApiCom, '/api/<string:cmd>/<string:comp>', '/api/<string:cmd>/<string:comp>/<string:pgc_host>')


class pgcApiRelnotes(Resource):
    def get(self, cmd, comp=None, pgc_host=None):
        data = pgc.get_data(cmd, comp, relnotes='relnotes', pgc_host=pgc_host)
        return data


api.add_resource(pgcApiRelnotes, '/api/relnotes/<string:cmd>/<string:comp>', '/api/relnotes/<string:cmd>', '/api/relnotes/<string:cmd>/<string:comp>/<string:pgc_host>')


class pgcApiListRelnotes(Resource):
    def get(self, cmd, pgc_host=None):
        data = pgc.get_data(cmd, relnotes='relnotes', pgc_host=pgc_host)
        return data


api.add_resource(pgcApiListRelnotes, '/api/relnotes/<string:cmd>/<string:pgc_host>')


class pgcApiHosts(Resource):
    def get(self):
        data = pgc.get_data('register HOST --list --json')
        return data


api.add_resource(pgcApiHosts, '/api/hosts')


class pgcApiGroups(Resource):
    def get(self):
        data = pgc.get_data('register GROUP --list --json')
        return data


api.add_resource(pgcApiGroups, '/api/groups')


class pgcApiExtensions(Resource):
    def get(self, comp, pgc_host=None):
        if pgc_host:
            data = pgc.get_data('list --extensions', comp, pgc_host=pgc_host)
        else:    
            data = pgc.get_data('list --extensions', comp)
        return data


api.add_resource(pgcApiExtensions, '/api/extensions/<string:comp>', '/api/extensions/<string:comp>/<string:pgc_host>')


class pgcUtilRelnotes(Resource):
    def get(self, comp, version=None):
        json_dict = {}
        v=version
        import mistune, util, sys
        if version == None:
            rel_notes = unicode(str(util.get_relnotes (comp)),sys.getdefaultencoding(),errors='ignore').strip()
        else:
            rel_notes=unicode(str(util.get_relnotes (comp, version)),sys.getdefaultencoding(),errors='ignore').strip()
        json_dict['component'] = comp
        json_dict['relnotes'] = mistune.markdown(rel_notes)
        # # json_dict['plainText'] = rel_notes
        data = json.dumps([json_dict])
        return data


api.add_resource(pgcUtilRelnotes, '/api/utilRelnotes/<string:comp>','/api/utilRelnotes/<string:comp>/<string:version>')


class pgcApiHostCmd(Resource):
    def get(self, pgc_cmd, host_name):
        data = pgc.get_data(pgc_cmd + ' --host '+ host_name)
        return data


api.add_resource(pgcApiHostCmd, '/api/hostcmd/<string:pgc_cmd>/<string:host_name>')


class pgdgCommand(Resource):
    def get(self, repo_id, pgc_cmd, host=None): 
        if host:
            data = pgc.get_pgdg_data(repo_id, pgc_cmd, host)
        else:
            data = pgc.get_pgdg_data(repo_id, pgc_cmd)
        return data


api.add_resource(pgdgCommand, '/api/pgdg/<string:repo_id>/<string:pgc_cmd>','/api/pgdg/<string:repo_id>/<string:pgc_cmd>/<string:host>')

class pgdgHostCommand(Resource):
    def get(self, repo_id, pgc_cmd, comp=None, host=None):
        if host:
            data = pgc.get_pgdg_data(repo_id, pgc_cmd, comp, host)
        else:
            data = pgc.get_pgdg_data(repo_id, comp, pgc_cmd)
        return data


api.add_resource(pgdgHostCommand, '/api/pgdghost/<string:repo_id>/<string:pgc_cmd>/<string:comp>','/api/pgdghost/<string:repo_id>/<string:pgc_cmd>/<string:comp>/<string:host>')


class checkUser(Resource):
    def get(self, host, username, password):
        from PgcRemote import PgcRemote
        json_dict = {}
        try:
            remote = PgcRemote(host, username, password)
            remote.connect()
            is_sudo = remote.has_sudo()
            remote.disconnect()
            json_dict['state'] = "success"
            json_dict['isSudo'] = is_sudo
            data = json.dumps([json_dict])
        except Exception as e:
            errmsg = "ERROR: Cannot connect to " + host + "@" + username + " - " + str(e.args[0])
            json_dict['state'] = "error"
            json_dict['msg'] = errmsg
            data = json.dumps([json_dict])
        return data

api.add_resource(checkUser, '/api/checkUser/<string:host>/<string:username>/<string:password>')


class initPGComp(Resource):
    def get(self, host, comp, pgpasswd, username=None, password=None):
        from PgcRemote import PgcRemote
        json_dict = {}
        try:
            if password == None or username == None:
                import util
                [home, username, password] = util.get_pgc_host(host)
            remote = PgcRemote(host, username, password)
            remote.connect()
            is_file_added = remote.add_file('/tmp/.pgpass', pgpasswd)
            remote.disconnect()
            data = pgc.get_data("init", comp, host, '/tmp/.pgpass')
        except Exception as e:
            errmsg = "ERROR: Cannot connect to " + host + "@" + username + " - " + str(e.args[0])
            json_dict['state'] = "error"
            json_dict['msg'] = errmsg
            data = json.dumps([json_dict])
        return data

api.add_resource(initPGComp, '/api/initpg/<string:host>/<string:comp>/<string:pgpasswd>','/api/initpg/<string:host>/<string:comp>/<string:pgpasswd>/<string:username>/<string:password>')


class bamUserInfo(Resource):
    def get(self):
        userInfo = {}
        if current_user.is_authenticated:
            userInfo['email'] = current_user.email
            userInfo['isAdmin'] = current_user.has_role("Administrator")
            email_md5=hashlib.md5( current_user.email.lower() ).hexdigest()
            gravtar_url="https://www.gravatar.com/avatar/"+ email_md5 + "?d=retro"
            userInfo['gravatarImage']=gravtar_url
        return userInfo


api.add_resource(bamUserInfo, '/api/userinfo')


class getRecentReports(Resource):
    def get(self, report_type):
        recent_reports_path = os.path.join(reports_path, report_type)
        jsonDict = {}
        jsonList = []
        if os.path.isdir(recent_reports_path):
            mtime = lambda f: os.stat(os.path.join(recent_reports_path, f)).st_mtime
            sorted_list=sorted(os.listdir(recent_reports_path),
                                        key=mtime, reverse=True)
            for d in sorted_list:
                if d.endswith(".html"):
                    jsonDict = {}
                    html_file_path = os.path.join(recent_reports_path, d)
                    jsonDict['file']=d
                    jsonDict["file_link"] = "reports/"+report_type+"/"+d
                    mtime=os.stat(html_file_path).st_mtime
                    mdate=datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M:%S')
                    jsonDict['mtime']=mdate
                    jsonList.append(jsonDict)
        return {'data':jsonList}


api.add_resource(getRecentReports, '/api/getrecentreports/<string:report_type>')


class GenerateReports(Resource):
    def post(self):
        args = request.json['data']
        from ProfilerReport import ProfilerReport
        try:
            plReport = ProfilerReport(args)
            report_file = plReport.generateSQLReports(args.get('pgQuery'),
                                                      args.get('pgTitle'),
                                                      args.get('pgDesc'))
            result = {}
            result['report_file'] = report_file
            result['error'] = 0
        except Exception as e:
            #import traceback
            #print traceback.format_exc()
            #print e
            result = {}
            result['error'] = 1
            result['msg'] = str(e)
        return result


api.add_resource(GenerateReports, '/api/generate_profiler_reports')


class RemoveReports(Resource):
    def post(self,report_type):
        from ProfilerReport import ProfilerReport
        try:
            recent_reports_path = os.path.join(reports_path, report_type)
            for fileName in request.json:
                os.remove(os.path.join(recent_reports_path, fileName))
            result = {}
            result['msg'] = 'success'
            result['error'] = 0
        except Exception as e:
            result = {}
            result['error'] = 1
            result['msg'] = str(e)
            print e
        return result


api.add_resource(RemoveReports, '/api/remove_reports/<string:report_type>')


class GetEnvFile(Resource):
    def get(self, comp):
        import util
        try:
            result = dict()
            util.read_env_file(comp)
            result['PGUSER'] = os.environ['PGUSER']
            result['PGDATABASE'] = os.environ['PGDATABASE']
            result['PGPORT'] = os.environ['PGPORT']
        except Exception as e:
            result = {}
            result['error'] = 1
            result['msg'] = str(e)
        return result

api.add_resource(GetEnvFile, '/api/read/env/<string:comp>')


class AddtoMetadata(Resource):
    def post(self):
        result = {}
        result['error'] = 0
        args = request.json
        component_name = args.get("component")
        component_port = args.get("port",5432)
        component_host = args.get("host","localhost")
        component_proj = args.get("project")
        servergroup_id = 1
        try:
            user_id=current_user.id
            servergroups = ServerGroup.query.filter_by(
                user_id=user_id
            ).order_by("id")

            if servergroups.count() > 0:
                servergroup = servergroups.first()
                servergroup_id = servergroup.id


            component_server = Server.query.filter_by(
                name=component_name,
                host=component_host
            )
            if component_server.count()==0:
                svr = Server(user_id=user_id,
                            servergroup_id=servergroup_id,
                            name=component_name + "(%s)" %component_host,
                            host=component_host,
                            port=component_port,
                            maintenance_db='postgres',
                            username="postgres",
                            ssl_mode='prefer',
                            comment=component_proj,
                            discovery_id="BigSQL PostgreSQL")

                db.session.add(svr)
                db.session.commit()
        except Exception as e:
            result = {}
            result['error'] = 1
            result['msg'] = str(e)

        return result


api.add_resource(AddtoMetadata, '/api/add_to_metadata')


def get_process_status(process_log_dir):
    process_dict = {}
    status_file = os.path.join(process_log_dir, "status")
    if os.path.exists(status_file):
        with open(status_file) as data_file:
            data = json.load(data_file)
            process_dict = data
            err_file = os.path.join(process_log_dir, "err")
            out_file = os.path.join(process_log_dir, "out")
            exit_code = process_dict.get("exit_code", None)
            err_data_content = None
            out_data_content = None
            process_dict['out_data'] = ""
            with open(err_file) as err_data:
                err_data_content = err_data.readlines()
                err_data_content = "".join(err_data_content).replace("\r", "\n").strip()
            with open(out_file) as out_data:
                out_data_content = out_data.readlines()
                out_data_content = "".join(out_data_content).replace("\r", "\n").strip()
            if err_data_content and out_data_content:
                process_dict['out_data'] = '\n'.join([err_data_content, out_data_content])
            elif err_data_content:
                process_dict['out_data'] = err_data_content
            elif out_data_content:
                process_dict['out_data'] = out_data_content



    return process_dict


def get_current_time(format='%Y-%m-%d %H:%M:%S.%f %z'):
    """
    Generate the current time string in the given format.
    """
    return datetime.utcnow().replace(
        tzinfo=pytz.utc
    ).strftime(format)


class GenerateBadgerReports(Resource):
    def post(self):
        result = {}
        args = request.json
        log_files=args.get("log_files")
        db=args.get("db")
        jobs=args.get("jobs")
        log_prefix=args.get("log_prefix")
        title=args.get("title")
        try:
            from BadgerReport import BadgerReport
            ctime = get_current_time(format='%y%m%d%H%M%S%f')
            badgerRpts = BadgerReport()
            pid_file_path = os.path.join(config.SESSION_DB_PATH,"process_logs", ctime)
            report_file = badgerRpts.generateReports(log_files, db, jobs, log_prefix, title, ctime, pid_file_path)
            process_log_dir = report_file['log_dir']
            report_status = get_process_status(process_log_dir)
            result['pid'] = report_status.get('pid')
            result['exit_code'] = report_status.get('exit_code')
            result['process_log_id'] = report_file["process_log_id"]
            if report_status.get('exit_code') is None:
                result['in_progress'] = True
                try:
                    j = Process(
                        pid=int(report_file["process_log_id"]), command=report_file['cmd'],
                        logdir=process_log_dir, desc=dumps("pgBadger Report"), user_id=current_user.id
                    )
                    db_session.add(j)
                    db_session.commit()
                except Exception as e:
                    print str(e)
                    pass
                """bg_process={}
                bg_process['process_type'] = "badger"
                bg_process['cmd'] = report_file['cmd']
                bg_process['file'] = report_file['file']
                bg_process['report_file'] = report_file['report_file']
                bg_process['process_log_id'] = report_file["process_log_id"]"""
            if report_file['error']:
                result['error'] = 1
                result['msg'] = report_file['error']
            else:
                result['error'] = 0
                result['report_file'] = report_file['file']
                report_file_path = os.path.join(reports_path, report_file['file'])
                if not os.path.exists(report_file_path):
                    result['error'] = 1
                    result['msg'] = "Check the parameters provided."
        except Exception as e:
            import traceback
            result = {}
            result['error'] = 1
            result['msg'] = str(e)
        time.sleep(2)
        return result

api.add_resource(GenerateBadgerReports, '/api/generate_badger_reports')


class GetBgProcessList(Resource):
    @login_required
    def get(self, process_type=None):
        result={}
        processes = Process.query.filter_by(user_id=current_user.id, desc=dumps("pgBadger Report"))
        clean_up_old_process=False
        for p in processes:
            result['process'] = []
            proc_log_dir = os.path.join(config.SESSION_DB_PATH,
                                        "process_logs",
                                        p.pid)
            if os.path.exists(proc_log_dir):
                proc_status = get_process_status(proc_log_dir)
                if p.acknowledge or proc_status.get("end_time") or p.end_time:
                    clean_up_old_process=True
                    db_session.delete(p)
                    try:
                        import shutil
                        shutil.rmtree(proc_log_dir, True)
                    except Exception as e:
                        pass
                    continue
                proc_status['process_failed'] = False
                proc_status['process_completed'] = True
                if proc_status.get("exit_code") is None:
                    proc_status['process_completed'] = False
                    if not psutil.pid_exists(proc_status.get('pid')):
                        proc_status['process_completed'] = True
                        proc_status['process_failed'] = True
                        proc_status['error_msg'] = "Background process terminated unexpectedly."
                elif proc_status.get("exit_code") != 0:
                    proc_status['process_failed'] = True
                proc_status['process_log_id'] = p.pid
                proc_status['process_type'] = "badger"
                if proc_status.get('report_file'):
                    proc_status['file'] = "badger/" + proc_status.get('report_file')
                    proc_status['report_file'] = proc_status.get('report_file')
                result['process'].append(proc_status)
        if clean_up_old_process:
            db_session.commit()
        return result

api.add_resource(GetBgProcessList, '/api/bgprocess_list', '/api/bgprocess_list/<string:process_type>')


class GetBgProcessStatus(Resource):
    def get(self,process_log_id):
        result={}
        proc_log_dir = os.path.join(config.SESSION_DB_PATH,
                                    "process_logs",
                                    process_log_id)
        proc_status = get_process_status(proc_log_dir)
        p = Process.query.filter_by(
            pid=process_log_id, user_id=current_user.id
        ).first()
        if p.start_time is None or p.end_time is None:
            p.start_time = proc_status['start_time']
            if 'exit_code' in proc_status and \
                            proc_status['exit_code'] is not None:
                p.exit_code = proc_status['exit_code']

                # We can't have 'end_time' without the 'exit_code'.
                if 'end_time' in proc_status and proc_status['end_time']:
                    p.end_time = proc_status['end_time']
            db_session.commit()

        stime = dateutil.parser.parse(proc_status.get("start_time"))
        etime = dateutil.parser.parse(proc_status.get("end_time") or get_current_time())

        execution_time = (etime - stime).total_seconds()

        proc_status['execution_time'] = execution_time
        proc_status['error_msg']=""
        proc_status['process_log_id'] = process_log_id
        proc_status['process_failed'] = False
        proc_status['process_completed'] = True
        proc_status['process_type'] = "badger"
        if proc_status.get("exit_code") is None:
            proc_status['process_completed'] = False
            if proc_status.get('pid'):
                if not psutil.pid_exists(proc_status.get('pid')):
                    proc_status['process_completed'] = True
                    proc_status['process_failed'] = True
                    proc_status['error_msg'] = "Background process terminated unexpectedly."
        elif proc_status.get("exit_code") != 0:
            proc_status['process_failed'] = True
            proc_status['error_msg'] = "Background process terminated unexpectedly."
        if proc_status.get('report_file'):
            proc_status['file'] = "badger/" + proc_status.get('report_file')
            proc_status['report_file'] = proc_status.get('report_file')

        result=proc_status
        return result

api.add_resource(GetBgProcessStatus, '/api/bgprocess_status/<string:process_log_id>')


@application.route('/list')
def list():
    """
    Method to get the list of components available.
    :return: It yields json string for the list of components.
    """
    data = pgc.get_data("list")
    if request.is_xhr:
        return json.loads(data)
    return render_template('status.html', data=data)


@application.route('/details/<component>')
def details(component):
    """
    Method to get the list of components available.
    :return: It yields json string for the list of components.
    """
    data = pgc.get_data("info", component)
    if request.is_xhr:
        return json.dumps(data)
    return render_template('status.html', data=data)


@application.route('/status')
def status():
    """
    Method to get the list of components available.
    :return: It yields json string for the list of components.
    """
    data = pgc.get_data("status")
    return render_template('status.html', data=data)


@application.route('/')
@login_required
def home():
    return render_template('index.html',
                           user=current_user,
                           is_admin=current_user.has_role("Administrator"))
