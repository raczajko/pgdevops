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


class VirtualMachineStatusCodeCount(Model):
    """The status code and count of the virtual machine scale set instance view
    status summary.

    Variables are only populated by the server, and will be ignored when
    sending a request.

    :ivar code: The instance view status code.
    :vartype code: str
    :ivar count: The number of instances having a particular status code.
    :vartype count: int
    """

    _validation = {
        'code': {'readonly': True},
        'count': {'readonly': True},
    }

    _attribute_map = {
        'code': {'key': 'code', 'type': 'str'},
        'count': {'key': 'count', 'type': 'int'},
    }

    def __init__(self):
        self.code = None
        self.count = None
