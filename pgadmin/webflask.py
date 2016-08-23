from flask import Flask

from flask_security import login_required, roles_required, current_user
#from flask_login import current_user
from pgadmin.utils.session import create_session_interface
from pgadmin.model import db, Role, User
from flask_security import Security, SQLAlchemyUserDatastore
import config

application = Flask(__name__)

application.config.from_object(config)

##########################################################################
# Setup session management
##########################################################################
application.session_interface = create_session_interface(application)
#application.secret_key=config.SECRET_KEY

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

@application.route('/')
@login_required
def index():
    if current_user:
        return 'Hello, World! BAM4' + current_user.email
    return "Hello world BAM4"



if __name__ == '__main__':
    application.run(host=config.DEFAULT_SERVER)
