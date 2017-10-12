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

from .service_type_description import ServiceTypeDescription


class StatefulServiceTypeDescription(ServiceTypeDescription):
    """Describes a stateful service type defined in the service manifest of a
    provisioned application type.

    :param is_stateful: Indicates whether the service type is a stateful
     service type or a stateless service type. This property is true if the
     service type is a stateful service type, false otherwise.
    :type is_stateful: bool
    :param service_type_name: Name of the service type.
    :type service_type_name: str
    :param placement_constraints: The placement constraint to be used when
     instantiating this service in a Service Fabric cluster.
    :type placement_constraints: str
    :param service_placement_policies:
    :type service_placement_policies: list of
     :class:`ServicePlacementPolicyDescription
     <azure.servicefabric.models.ServicePlacementPolicyDescription>`
    :param extensions:
    :type extensions: list of :class:`ServiceTypeExtensionDescription
     <azure.servicefabric.models.ServiceTypeExtensionDescription>`
    :param Kind: Polymorphic Discriminator
    :type Kind: str
    :param has_persisted_state: A flag indicating whether this is a
     persistent service which stores states on the local disk. If it is then
     the value of this property is true, if not it is false.
    :type has_persisted_state: bool
    """ 

    _validation = {
        'Kind': {'required': True},
    }

    _attribute_map = {
        'is_stateful': {'key': 'IsStateful', 'type': 'bool'},
        'service_type_name': {'key': 'ServiceTypeName', 'type': 'str'},
        'placement_constraints': {'key': 'PlacementConstraints', 'type': 'str'},
        'service_placement_policies': {'key': 'ServicePlacementPolicies', 'type': '[ServicePlacementPolicyDescription]'},
        'extensions': {'key': 'Extensions', 'type': '[ServiceTypeExtensionDescription]'},
        'Kind': {'key': 'Kind', 'type': 'str'},
        'has_persisted_state': {'key': 'HasPersistedState', 'type': 'bool'},
    }

    def __init__(self, is_stateful=None, service_type_name=None, placement_constraints=None, service_placement_policies=None, extensions=None, has_persisted_state=None):
        super(StatefulServiceTypeDescription, self).__init__(is_stateful=is_stateful, service_type_name=service_type_name, placement_constraints=placement_constraints, service_placement_policies=service_placement_policies, extensions=extensions)
        self.has_persisted_state = has_persisted_state
        self.Kind = 'Stateful'
