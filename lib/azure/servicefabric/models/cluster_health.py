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

from .entity_health import EntityHealth


class ClusterHealth(EntityHealth):
    """Represents the health of the cluster.
    Contains the cluster aggregated health state, the cluster application and
    node health states as well as the health events and the unhealthy
    evaluations.
    .

    :param aggregated_health_state: The HealthState representing the
     aggregated health state of the entity computed by Health Manager.
     The health evaluation of the entity reflects all events reported on the
     entity and its children (if any).
     The aggregation is done by applying the desired health policy.
     . Possible values include: 'Invalid', 'Ok', 'Warning', 'Error', 'Unknown'
    :type aggregated_health_state: str
    :param health_events: The list of health events reported on the entity.
    :type health_events: list of :class:`HealthEvent
     <azure.servicefabric.models.HealthEvent>`
    :param unhealthy_evaluations: The unhealthy evaluations that show why the
     current aggregated health state was returned by Health Manager.
    :type unhealthy_evaluations: list of :class:`HealthEvaluationWrapper
     <azure.servicefabric.models.HealthEvaluationWrapper>`
    :param node_health_states: Cluster node health states as found in the
     health store.
    :type node_health_states: list of :class:`NodeHealthState
     <azure.servicefabric.models.NodeHealthState>`
    :param application_health_states: Cluster application health states as
     found in the health store.
    :type application_health_states: list of :class:`ApplicationHealthState
     <azure.servicefabric.models.ApplicationHealthState>`
    """ 

    _attribute_map = {
        'aggregated_health_state': {'key': 'AggregatedHealthState', 'type': 'str'},
        'health_events': {'key': 'HealthEvents', 'type': '[HealthEvent]'},
        'unhealthy_evaluations': {'key': 'UnhealthyEvaluations', 'type': '[HealthEvaluationWrapper]'},
        'node_health_states': {'key': 'NodeHealthStates', 'type': '[NodeHealthState]'},
        'application_health_states': {'key': 'ApplicationHealthStates', 'type': '[ApplicationHealthState]'},
    }

    def __init__(self, aggregated_health_state=None, health_events=None, unhealthy_evaluations=None, node_health_states=None, application_health_states=None):
        super(ClusterHealth, self).__init__(aggregated_health_state=aggregated_health_state, health_events=health_events, unhealthy_evaluations=unhealthy_evaluations)
        self.node_health_states = node_health_states
        self.application_health_states = application_health_states
