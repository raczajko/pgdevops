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


class TargetResource(Model):
    """Target resource.

    :param id: The ID of the resource.
    :type id: str
    :param resource_name: The name of the resource.
    :type resource_name: str
    :param resource_type: The type of the resource.
    :type resource_type: str
    """

    _attribute_map = {
        'id': {'key': 'id', 'type': 'str'},
        'resource_name': {'key': 'resourceName', 'type': 'str'},
        'resource_type': {'key': 'resourceType', 'type': 'str'},
    }

    def __init__(self, id=None, resource_name=None, resource_type=None):
        self.id = id
        self.resource_name = resource_name
        self.resource_type = resource_type
