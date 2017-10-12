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

from .http_authentication import HttpAuthentication


class BasicAuthentication(HttpAuthentication):
    """BasicAuthentication.

    :param type: Gets or sets the HTTP authentication type. Possible values
     include: 'NotSpecified', 'ClientCertificate', 'ActiveDirectoryOAuth',
     'Basic'
    :type type: str or :class:`HttpAuthenticationType
     <azure.mgmt.scheduler.models.HttpAuthenticationType>`
    :param username: Gets or sets the username.
    :type username: str
    :param password: Gets or sets the password, return value will always be
     empty.
    :type password: str
    """

    _attribute_map = {
        'type': {'key': 'type', 'type': 'HttpAuthenticationType'},
        'username': {'key': 'username', 'type': 'str'},
        'password': {'key': 'password', 'type': 'str'},
    }

    def __init__(self, type=None, username=None, password=None):
        super(BasicAuthentication, self).__init__(type=type)
        self.username = username
        self.password = password
