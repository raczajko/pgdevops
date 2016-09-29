# #################################################################
#
# pgAdmin 4 - PostgreSQL Tools
#
# Copyright (C) 2013 - 2016, The pgAdmin Development Team
# This software is released under the PostgreSQL Licence
#
# ##################################################################
import json

from pgadmin.utils.route import BaseTestGenerator
from regression import test_utils as utils
from regression import test_server_dict
from pgadmin.browser.server_groups.servers.tests import utils as server_utils
from . import utils as roles_utils


class LoginRoleAddTestCase(BaseTestGenerator):
    """This class has add role scenario"""

    scenarios = [
        # Fetching default URL for roles node.
        ('Check Role Node', dict(url='/browser/role/obj/'))
    ]

    def setUp(self):
        pass

    def runTest(self):
        """This function test the add role scenario"""
        server_id = test_server_dict["server"][0]["server_id"]
        server_response = server_utils.connect_server(self, server_id)
        if not server_response['data']['connected']:
            raise Exception("Server not found to add the role.")

        data = roles_utils.get_role_data(self.server['db_password'])
        self.role_name = data['rolname']
        response = self.tester.post(self.url + str(utils.SERVER_GROUP) + '/'
                                    + str(server_id) + '/',
                                    data=json.dumps(data),
                                    content_type='html/json')
        self.assertEquals(response.status_code, 200)
        response_data = json.loads(response.data.decode('utf-8'))
        role_id = response_data['node']['_id']
        role_dict = {"server_id": server_id, "role_id": role_id}
        utils.write_node_info(role_id, "lrid", role_dict)

    def tearDown(self):
        """This function delete the role from added server"""
        connection = utils.get_db_connection(self.server['db'],
                                             self.server['username'],
                                             self.server['db_password'],
                                             self.server['host'],
                                             self.server['port'])
        roles_utils.delete_role(connection, self.role_name)
