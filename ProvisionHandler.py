####################################################################
#########         Copyright 2016-2017 BigSQL             ###########
####################################################################
import json

from flask import Blueprint, request
from flask.views import MethodView
from flask_security import auth_required

from Components import Components as pgc
from responses import ServerErrorResult, Result
_pgc_provision = Blueprint('pgc_provision', 'pgc_provision', url_prefix='/api/pgc/provision')


class ProvisionHandler(MethodView):
    @auth_required('token', 'session')
    def post(self):
        try:
            json_body = request.json
            pgcCmd = "provision pgha3 "
            if json_body.get("availability"):
                pcgCmd  = pgcCmd + " --availability " + json_body.get("availability")
            if json_body.get("cluster"):
                pcgCmd  = pgcCmd + " --cluster " + json_body.get("cluster")
            if json_body.get("provider"):
                pcgCmd  = pgcCmd + " --provider " + json_body.get("provider")
            if json_body.get("size"):
                pcgCmd  = pgcCmd + " --size " + json_body.get("size")
            if json_body.get("overwrite"):
                pcgCmd  = pgcCmd + " --overwrite "
            data = pgc.get_cmd_data(pgcCmd)
            if len(data) == 0:
                return ServerErrorResult().http_response()
            if data[0]['state'] != 'complete':
                return ServerErrorResult(state=data[0]['state'],message=data[0].get('msg')).http_response()
            return Result(200,'SUCCESS',message=data[0].get('msg')).http_response()
        except Exception as ex:
            return ServerErrorResult(message = str(ex)).http_response()

_pgc_provision.add_url_rule('', view_func=ProvisionHandler.as_view('provision'))