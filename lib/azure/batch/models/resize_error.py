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


class ResizeError(Model):
    """An error that occurred when resizing a pool.

    :param code: An identifier for the pool resize error. Codes are invariant
     and are intended to be consumed programmatically.
    :type code: str
    :param message: A message describing the pool resize error, intended to be
     suitable for display in a user interface.
    :type message: str
    :param values: A list of additional error details related to the pool
     resize error.
    :type values: list of :class:`NameValuePair
     <azure.batch.models.NameValuePair>`
    """

    _attribute_map = {
        'code': {'key': 'code', 'type': 'str'},
        'message': {'key': 'message', 'type': 'str'},
        'values': {'key': 'values', 'type': '[NameValuePair]'},
    }

    def __init__(self, code=None, message=None, values=None):
        self.code = code
        self.message = message
        self.values = values