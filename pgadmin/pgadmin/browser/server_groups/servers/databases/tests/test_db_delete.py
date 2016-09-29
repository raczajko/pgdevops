# #################################################################
#
# pgAdmin 4 - PostgreSQL Tools
#
# Copyright (C) 2013 - 2016, The pgAdmin Development Team
# This software is released under the PostgreSQL Licence
#
# ##################################################################
import uuid

from pgadmin.utils.route import BaseTestGenerator
from regression import test_utils as utils
from regression import test_server_dict
from pgadmin.browser.server_groups.servers.tests import utils as server_utils


class DatabaseDeleteTestCase(BaseTestGenerator):
    """ This class will delete the database under last added server. """
    scenarios = [
        # Fetching default URL for database node.
        ('Check Databases Node URL', dict(url='/browser/database/obj/'))
    ]

    def setUp(self):
        self.db_name = "db_delete_%s" % str(uuid.uuid4())[1:4],
        self.db_id = utils.create_database(self.server, self.db_name)

    def runTest(self):
        """ This function will delete the database."""
        server_id = test_server_dict["server"][0]["server_id"]
        server_response = server_utils.connect_server(self, server_id)
        if server_response["data"]["connected"]:
            db_id = self.db_id
            response = self.tester.delete(
                self.url + str(utils.SERVER_GROUP) + '/' +
                str(server_id) + '/' + str(db_id),
                follow_redirects=True)
            self.assertEquals(response.status_code, 200)
        else:
            raise Exception("Could not connect to server to delete the "
                            "database.")

    def tearDown(self):
        """This function drop the added database"""
        connection = utils.get_db_connection(self.server['db'],
                                             self.server['username'],
                                             self.server['db_password'],
                                             self.server['host'],
                                             self.server['port'])
        utils.drop_database(connection, self.db_name)
