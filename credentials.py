####################################################################
#########         Copyright 2016-2017 BigSQL             ###########
####################################################################

from flask import Blueprint, request, jsonify, session
from flask.views import MethodView
from flask_security import login_required, roles_required, current_user
from flask import g

from Components import Components as pgc

credentials = Blueprint('credentials', 'credentials', url_prefix='/api/pgc/credentials')

class CreateCredential(MethodView):
    @login_required
    def post(self):
        json_dict = {}
        if not current_user:
            json_dict['state'] = "error"
            json_dict['msg'] = "Access denied."
            return jsonify(json_dict)
        else:
            args= request.json.get('params')
            cred_type = args.get('type')
            cred_name = args.get('credential_name')
            cred_user = args.get('user')
            cred_pwd = args.get('password')
            ssh_key = args.get('ssh_key')
            cloud_key = args.get('cloud_key')
            ssh_sudo_pwd = args.get('ssh_sudo_pwd')
            cloud_name = args.get('cloud_name')
            cloud_secret = args.get('cloud_secret')
            cloud_key = args.get('cloud_key')
            region = args.get('region')
            cred_uuid = args.get('cred_uuid')
            pgcCmd = "credentials ADD --type \"" + cred_type + "\" --name \"" + cred_name + "\""
            if cred_uuid:
                pgcCmd = "credentials UPDATE --type \"" + cred_type + "\" --name \"" + cred_name + "\" --cred_uuid \"" + cred_uuid + "\""
            if cred_user:
            	pgcCmd = pgcCmd + " --user \"" + cred_user + "\""
            if cred_pwd:
            	pgcCmd = pgcCmd + " --pwd \"" + cred_pwd + "\""
            if ssh_key:
            	pgcCmd = pgcCmd + " --key \"" + ssh_key + "\""
            if cloud_key:
            	pgcCmd = pgcCmd + " --key \"" + cloud_key + "\""
            if ssh_sudo_pwd:
            	pgcCmd = pgcCmd + " --sudo_pwd \"" + ssh_sudo_pwd + "\""
            if cloud_name:
            	pgcCmd = pgcCmd + " --cloud \"" + cloud_name + "\""
            if cloud_secret:
            	pgcCmd = pgcCmd + " --secret \"" + cloud_secret + "\""
            if region:
            	pgcCmd = pgcCmd + " --region \"" + region + "\""
            data = pgc.get_cmd_data(pgcCmd)
        return jsonify(data)


credentials.add_url_rule('/create/', view_func=CreateCredential.as_view('create'))


class ListCredentials(MethodView):
    @login_required
    def get(self):
    	data = pgc.get_cmd_data('credentials --list')
    	return jsonify(data)


credentials.add_url_rule('/list/', view_func=ListCredentials.as_view('list'))

class DeleteCredentials(MethodView):
    @login_required
    def post(self):
    	json_dict = {}
        if not current_user:
            json_dict['state'] = "error"
            json_dict['msg'] = "Access denied."
            return jsonify(json_dict)
        else:
            args= request.json.get('params')
            print('args',args)
            cred_uuids = args.get('cred_uuids')
            print ('cred_uuids',cred_uuids)
            result = {}
            for cred_uuid in cred_uuids:
	            print (cred_uuid)
	            pgcCmd = "credentials DELETE "
	            if cred_uuid:
	            	pgcCmd = pgcCmd + " --cred \"" + cred_uuid + "\""
            		data = pgc.get_cmd_data(pgcCmd)
        return jsonify(data)
    	

credentials.add_url_rule('/delete/', view_func=DeleteCredentials.as_view('delete'))

# class updateCredentials(MethodView):
#     @login_required
#     def post(self):
#     	json_dict = {}
#         if not current_user:
#             json_dict['state'] = "error"
#             json_dict['msg'] = "Access denied."
#             return jsonify(json_dict)
#         else:
#             args= request.json.get('params')
#             cred_uuid = args.get('cred_uuid')
#             pgcCmd = " credentials Update "
#             
#             data = pgc.get_cmd_data(pgcCmd)
#         return jsonify(data)
    	

# credentials.add_url_rule('/update/', view_func=DeleteCredentials.as_view('update'))
