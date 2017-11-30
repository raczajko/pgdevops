####################################################################
#########         Copyright 2016-2017 BigSQL             ###########
####################################################################

from web import cache

from flask import Blueprint
from flask.views import MethodView
from flask_security import auth_required

from Components import Components as pgc


_metalist = Blueprint('metalist', 'metalist', url_prefix='/api/pgc/metalist')


class MetalistHandler(MethodView):

    @auth_required('token', 'session')
    def get(self, cmd):
        data = cache.get('metalist '+cmd)
        if not data:
            data = pgc.get_data('metalist '+cmd)
            cache.set('metalist '+cmd, data)
        else:
            print("Loaded from cache")
        import json
        return json.dumps(data)
_metalist.add_url_rule(' <string:cmd>', view_func=MetalistHandler.as_view('metalist'))