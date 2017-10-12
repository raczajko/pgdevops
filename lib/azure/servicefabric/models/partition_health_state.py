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

from .entity_health_state import EntityHealthState


class PartitionHealthState(EntityHealthState):
    """Represents the health state of a partition, which contains the partition
    identifier and its aggregated health state.

    :param aggregated_health_state: Possible values include: 'Invalid', 'Ok',
     'Warning', 'Error', 'Unknown'
    :type aggregated_health_state: str
    :param partition_id: The ID of the partition.
    :type partition_id: str
    """ 

    _attribute_map = {
        'aggregated_health_state': {'key': 'AggregatedHealthState', 'type': 'str'},
        'partition_id': {'key': 'PartitionId', 'type': 'str'},
    }

    def __init__(self, aggregated_health_state=None, partition_id=None):
        super(PartitionHealthState, self).__init__(aggregated_health_state=aggregated_health_state)
        self.partition_id = partition_id
