####################################################################
#########         Copyright 2016-2017 BigSQL             ###########
####################################################################

from flask import Blueprint, request
from flask.views import MethodView

from Components import Components as pgc
from responses import ServerErrorResult, Result, InvalidParameterResult
cloud = Blueprint('cloud', 'cloud', url_prefix='/api/pgc/instance')

class CloudHandler(MethodView):
    def post(self):
        print("In post")
        return "Post"
    def get(self):
        data = request.args
        cmd = "instances"
        errors = []
        if data.get('instanceType'):
            cmd = cmd + ' "'+data.get('instanceType')+'"'
        else:
            errors.append("instanceType is required")
        if data.get('provider'):
            cmd = cmd + ' --cloud "'+data.get('provider')+'"'
        else:
            errors.append("provider is required")
        if data.get('region'):
            cmd = cmd + ' --region "'+data.get('region')+'"'
        if len(errors) > 0:
            return InvalidParameterResult(errors = errors).http_response()
        pg_response = pgc.get_data(cmd)
        if len(pg_response) == 0:
            return ServerErrorResult().http_response()
        if pg_response[0]['state'] != 'completed':
            return ServerErrorResult(state=pg_response[0]['state'],message=pg_response[0].get('msg')).http_response()
        extra_fields = pg_response[0]['data']
        return Result(200,pg_response[0]['state'],'SUCCESS',extra_fields={"data":extra_fields}).http_response()

cloud.add_url_rule('/', view_func=CloudHandler.as_view('instance'))