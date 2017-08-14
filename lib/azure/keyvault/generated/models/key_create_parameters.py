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


class KeyCreateParameters(Model):
    """The key create parameters.

    :param kty: The type of key to create. For valid key types, see
     JsonWebKeyType. Supported JsonWebKey key types (kty) for Elliptic Curve,
     RSA, HSM, Octet. Possible values include: 'EC', 'RSA', 'RSA-HSM', 'oct'
    :type kty: str or :class:`JsonWebKeyType
     <azure.keyvault.generated.models.JsonWebKeyType>`
    :param key_size: The key size in bytes. For example, 1024 or 2048.
    :type key_size: int
    :param key_ops:
    :type key_ops: list of str or :class:`JsonWebKeyOperation
     <azure.keyvault.generated.models.JsonWebKeyOperation>`
    :param key_attributes:
    :type key_attributes: :class:`KeyAttributes
     <azure.keyvault.generated.models.KeyAttributes>`
    :param tags: Application specific metadata in the form of key-value pairs.
    :type tags: dict
    """

    _validation = {
        'kty': {'required': True, 'min_length': 1},
    }

    _attribute_map = {
        'kty': {'key': 'kty', 'type': 'str'},
        'key_size': {'key': 'key_size', 'type': 'int'},
        'key_ops': {'key': 'key_ops', 'type': '[JsonWebKeyOperation]'},
        'key_attributes': {'key': 'attributes', 'type': 'KeyAttributes'},
        'tags': {'key': 'tags', 'type': '{str}'},
    }

    def __init__(self, kty, key_size=None, key_ops=None, key_attributes=None, tags=None):
        self.kty = kty
        self.key_size = key_size
        self.key_ops = key_ops
        self.key_attributes = key_attributes
        self.tags = tags
