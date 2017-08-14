# coding=utf-8
# --------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
#
# Code generated by Microsoft (R) AutoRest Code Generator.
# Changes may cause incorrect behavior and will be lost if the code is
# regenerated.
# --------------------------------------------------------------------------

from msrest.serialization import Model


class ComposeApplicationStatusInfo(Model):
    """Information about a Service Fabric compose application.

    :param name:
    :type name: str
    :param status: Possible values include: 'Invalid', 'Provisioning',
     'Creating', 'Created', 'Unprovisioning', 'Deleting', 'Failed'
    :type status: str
    :param status_details: The status details of compose application
     including failure message.
    :type status_details: str
    """ 

    _attribute_map = {
        'name': {'key': 'Name', 'type': 'str'},
        'status': {'key': 'Status', 'type': 'str'},
        'status_details': {'key': 'StatusDetails', 'type': 'str'},
    }

    def __init__(self, name=None, status=None, status_details=None):
        self.name = name
        self.status = status
        self.status_details = status_details
