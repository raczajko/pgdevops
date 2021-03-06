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


class LoadMetricReportInfo(Model):
    """Information about load reported by replica.

    :param name: The name of the metric.
    :type name: str
    :param value: The value of the load for the metric..
    :type value: int
    :param last_reported_utc: The UTC time when the load is reported.
    :type last_reported_utc: datetime
    """ 

    _attribute_map = {
        'name': {'key': 'Name', 'type': 'str'},
        'value': {'key': 'Value', 'type': 'int'},
        'last_reported_utc': {'key': 'LastReportedUtc', 'type': 'iso-8601'},
    }

    def __init__(self, name=None, value=None, last_reported_utc=None):
        self.name = name
        self.value = value
        self.last_reported_utc = last_reported_utc
