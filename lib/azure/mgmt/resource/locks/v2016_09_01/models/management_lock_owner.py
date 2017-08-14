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


class ManagementLockOwner(Model):
    """Lock owner properties.

    :param application_id: The application ID of the lock owner.
    :type application_id: str
    """

    _attribute_map = {
        'application_id': {'key': 'applicationId', 'type': 'str'},
    }

    def __init__(self, application_id=None):
        self.application_id = application_id
