####################################################################
#########            Copyright 2016 BigSQL               ###########
####################################################################

from flask import Flask, render_template, url_for, request, session

import os
from flask_triangle import Triangle
from flask_restful import reqparse, abort, Api, Resource

import json
from Components import Components as pgc

from flask_security import login_required, roles_required, current_user
# from flask_login import current_user
from flask_babel import Babel, gettext
from pgadmin.utils.session import create_session_interface
from pgadmin.model import db, Role, User
from flask_security import Security, SQLAlchemyUserDatastore
from pgadmin.utils.pickleSessions import PickleSessionInterface
from pgadmin.utils.sqliteSessions import SqliteSessionInterface
import config
from flask_restful import reqparse

parser = reqparse.RequestParser()
#parser.add_argument('data')

config.APP_NAME = "BigSQL Manager 4"
config.LOGIN_NAME = "BigSQL"
application = Flask(__name__)

babel = Babel(application)

Triangle(application)
api = Api(application)

application.config.from_object(config)


##########################################################################
# Setup session management
##########################################################################
#application.session_interface = PickleSessionInterface(config.SESSION_DB_PATH)
application.session_interface = SqliteSessionInterface(config.SESSION_DB_PATH)
# application.session_interface = ItsdangerousSessionInterface()
# application.secret_key=config.SECRET_KEY

application.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{0}?timeout={1}'.format(
    config.SQLITE_PATH.replace('\\', '/'),
    getattr(config, 'SQLITE_TIMEOUT', 500)
)

application.config['SECURITY_RECOVERABLE'] = True
application.config['SECURITY_CHANGEABLE'] = True

db.init_app(application)
import pgadmin.utils.paths as paths

paths.init_app(application)

# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(application, user_datastore)

PGC_HOME = os.getenv("PGC_HOME", "")
PGC_LOGS = os.getenv("PGC_LOGS", "")


class pgcApi(Resource):
    def get(self, pgc_command):
        # if 'credentials' in session:
        data = pgc.get_data(pgc_command)
        return data


api.add_resource(pgcApi, '/api/<string:pgc_command>')


class pgcApiCom(Resource):
    def get(self, cmd, comp, pgc_host=None):
        data = pgc.get_data(cmd, comp,pgc_host=pgc_host)
        return data


api.add_resource(pgcApiCom, '/api/<string:cmd>/<string:comp>', '/api/<string:cmd>/<string:comp>/<string:pgc_host>')


class pgcApiHosts(Resource):
    def get(self):
        data = pgc.get_data('register --list')
        return data


api.add_resource(pgcApiHosts, '/api/hosts')

class pgcApiRelnotes(Resource):
    def get(self, comp, version):
        print comp, version
        v=version
        import mistune, util, sys
        rel_notes=unicode(str(util.get_relnotes (comp, v)),sys.getdefaultencoding(),errors='ignore').strip()
        markdown_text=mistune.markdown(rel_notes)
        return markdown_text


api.add_resource(pgcApiRelnotes, '/api/relnotes/<string:comp>/<string:version>')


class pgcApiHostCmd(Resource):
    def get(self, pgc_cmd, host_name):
        data = pgc.get_data(pgc_cmd + ' --host '+ host_name)
        return data


api.add_resource(pgcApiHostCmd, '/api/hostcmd/<string:pgc_cmd>/<string:host_name>')


class bamUserInfo(Resource):
    def get(self):
        userInfo = {}
        if current_user.is_authenticated:
            userInfo['email'] = current_user.email
            userInfo['isAdmin'] = current_user.has_role("Administrator")
        return userInfo


api.add_resource(bamUserInfo, '/api/userinfo')


class GenerateReports(Resource):
    def post(self):
        args = request.json['data']
        from ProfilerReport import ProfilerReport
        #print args.get('hostName')
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
