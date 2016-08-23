from werkzeug.wsgi import DispatcherMiddleware

from flask import Flask, redirect, url_for, session
from pgAdmin4 import app as backend
from flask_security import login_required
from flask_login import current_user

from pgadmin.utils.session import create_session_interface
from pgadmin.model import db, Role, Server, ServerGroup, User, Version
from flask_security import Security, SQLAlchemyUserDatastore
from flask_security.utils import logout_user

import config

application = Flask(__name__)

#application.session_interface = create_session_interface(backend)

application.config.from_object(config)

##########################################################################
# Setup session management
##########################################################################
application.session_interface = create_session_interface(application)

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
# dispatch by path
#application.wsgi_app = DispatcherMiddleware(application.wsgi_app, {
#    '/admin': backend.wsgi_app
#})


@application.route('/')
@login_required
def index():
    if current_user:
        return 'Hello, World! BAM3' + current_user.email
    return "Hello world BAM3"


#@application.after_request
#def remove_if_invalid(response):
##    if "__invalidate__" in session:
#        response.delete_cookie(application.SESSION_COOKIE_NAME)
#    return response


#@application.route('/logout')
##@login_required
#def logout():
#    logout_user()
#    #session["__invalidate__"] = True
#    return redirect(url_for('index'))


if __name__ == '__main__':
    application.run(host=config.DEFAULT_SERVER)
