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

from .chaos_event import ChaosEvent


class ValidationFailedChaosEvent(ChaosEvent):
    """Chaos event corresponding to a failure during validation.

    :param time_stamp_utc:
    :type time_stamp_utc: datetime
    :param Kind: Polymorphic Discriminator
    :type Kind: str
    :param reason:
    :type reason: str
    """ 

    _validation = {
        'time_stamp_utc': {'required': True},
        'Kind': {'required': True},
    }

    _attribute_map = {
        'time_stamp_utc': {'key': 'TimeStampUtc', 'type': 'iso-8601'},
        'Kind': {'key': 'Kind', 'type': 'str'},
        'reason': {'key': 'Reason', 'type': 'str'},
    }

    def __init__(self, time_stamp_utc, reason=None):
        super(ValidationFailedChaosEvent, self).__init__(time_stamp_utc=time_stamp_utc)
        self.reason = reason
        self.Kind = 'ValidationFailed'
