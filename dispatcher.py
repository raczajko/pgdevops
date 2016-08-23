

from werkzeug.wsgi import DispatcherMiddleware
from flask import Flask

import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'pgadmin'))

from pgAdmin4 import app as backend
from web import application as frontend
#from webflask import application as backend
import config
import os

application = Flask(__name__)

application.config.from_object(config)


if not os.path.exists(config.SESSION_DB_PATH):
    os.mkdir(config.SESSION_DB_PATH)
    os.chmod(config.SESSION_DB_PATH, int('700', 8))

application.wsgi_app = DispatcherMiddleware(frontend.wsgi_app, {
    '/admin': backend.wsgi_app
})


if __name__ == '__main__':
    application.run()
