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


class PagedServicePartitionInfoList(Model):
    """The list of partition in the cluster for a service. The list is paged when
    all of the results cannot fit in a single message. The next set of
    results can be obtained by executing the same query with the continuation
    token provided in this list.

    :param continuation_token:
    :type continuation_token: str
    :param items:
    :type items: list of :class:`ServicePartitionInfo
     <azure.servicefabric.models.ServicePartitionInfo>`
    """ 

    _attribute_map = {
        'continuation_token': {'key': 'ContinuationToken', 'type': 'str'},
        'items': {'key': 'Items', 'type': '[ServicePartitionInfo]'},
    }

    def __init__(self, continuation_token=None, items=None):
        self.continuation_token = continuation_token
        self.items = items
