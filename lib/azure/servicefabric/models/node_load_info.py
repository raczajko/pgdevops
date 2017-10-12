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


class NodeLoadInfo(Model):
    """Information about load on a Service Fabric node. It holds a summary of all
    metrics and their load on a node.

    :param node_name: Name of the node for which the load information is
     provided by this object.
    :type node_name: str
    :param node_load_metric_information: List that contains metrics and their
     load information on this node.
    :type node_load_metric_information: list of
     :class:`NodeLoadMetricInformation
     <azure.servicefabric.models.NodeLoadMetricInformation>`
    """ 

    _attribute_map = {
        'node_name': {'key': 'NodeName', 'type': 'str'},
        'node_load_metric_information': {'key': 'NodeLoadMetricInformation', 'type': '[NodeLoadMetricInformation]'},
    }

    def __init__(self, node_name=None, node_load_metric_information=None):
        self.node_name = node_name
        self.node_load_metric_information = node_load_metric_information
