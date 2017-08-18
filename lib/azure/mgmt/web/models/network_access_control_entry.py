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


class NetworkAccessControlEntry(Model):
    """Network access control entry.

    :param action: Action object. Possible values include: 'Permit', 'Deny'
    :type action: str or :class:`AccessControlEntryAction
     <azure.mgmt.web.models.AccessControlEntryAction>`
    :param description: Description.
    :type description: str
    :param order: Order of precedence.
    :type order: int
    :param remote_subnet: Remote subnet.
    :type remote_subnet: str
    """

    _attribute_map = {
        'action': {'key': 'action', 'type': 'AccessControlEntryAction'},
        'description': {'key': 'description', 'type': 'str'},
        'order': {'key': 'order', 'type': 'int'},
        'remote_subnet': {'key': 'remoteSubnet', 'type': 'str'},
    }

    def __init__(self, action=None, description=None, order=None, remote_subnet=None):
        self.action = action
        self.description = description
        self.order = order
        self.remote_subnet = remote_subnet