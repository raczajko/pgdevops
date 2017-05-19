#########################################################################
#
# pgAdmin 4 - PostgreSQL Tools
#
# Copyright (C) 2013 - 2017, The pgAdmin Development Team
# This software is released under the PostgreSQL Licence
#
##########################################################################

"""Perform the initial setup of the application, by creating the auth
and settings database."""

import os
import sys

from flask import Flask

# We need to include the root directory in sys.path to ensure that we can
# find everything we need when running in the standalone runtime.
root = os.path.dirname(os.path.realpath(__file__))
if sys.path[0] != root:
    sys.path.insert(0, root)

if __name__ == '__main__':
    # Configuration settings
    import config
    from pgadmin.model import db, SCHEMA_VERSION, Server, ServerGroup
    from pgadmin.setup import db_upgrade, create_app_data_directory

    config.SETTINGS_SCHEMA_VERSION = SCHEMA_VERSION

    app = Flask(__name__)

    app.config.from_object(config)

    if config.TESTING_MODE:
        config.SQLITE_PATH = config.TEST_SQLITE_PATH

    create_app_data_directory(config)

    app.config['SQLALCHEMY_DATABASE_URI'] = \
        'sqlite:///' + config.SQLITE_PATH.replace('\\', '/')
    db.init_app(app)

    print(u"pgDevOps - Application Initialisation")
    print(u"======================================\n")

    db_upgrade(app)
    with app.app_context():
        try:
            ## Check if there are any postgres components installed add them to servers list.
            sys.path.append(os.path.join(os.environ.get("PGC_HOME"), "hub", "scripts"))
            import util

            servergroup_id = 1
            user_id = 1
            servergroups = ServerGroup.query.filter_by(
                user_id=user_id
            ).order_by("id")

            if servergroups.count() > 0:
                servergroup = servergroups.first()
                servergroup_id = servergroup.id

            get_pg_instance = util.get_installed_postgres_components()
            for pg in get_pg_instance:
                srv_name = pg[0]
                srv_proj = pg[1]
                srv_port = pg[3]
                srv_datadir = pg[4]
                svr_comment = srv_proj
                if srv_datadir and srv_datadir != "" and srv_datadir != "None" and os.path.exists(srv_datadir):
                    component_server = Server.query.filter_by(
                        name=srv_name,
                        host="localhost"
                    )
                    if component_server.count() == 0:
                        print ("Adding {} to pgdevops metadata ".format(srv_name))
                        svr = Server(user_id=user_id,
                                     servergroup_id=servergroup_id,
                                     name=srv_name,
                                     host='localhost',
                                     port=srv_port,
                                     maintenance_db='postgres',
                                     username="postgres",
                                     ssl_mode='prefer',
                                     comment=svr_comment,
                                     discovery_id="BigSQL PostgreSQL")

                        db.session.add(svr)
                        db.session.commit()
        except Exception as e:
            pass


