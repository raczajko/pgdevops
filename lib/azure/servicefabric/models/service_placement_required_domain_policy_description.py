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

from .service_placement_policy_description import ServicePlacementPolicyDescription


class ServicePlacementRequiredDomainPolicyDescription(ServicePlacementPolicyDescription):
    """Describes the policy to be used for placement of a Service Fabric service
    where the instances or replicas of that service must be placed in a
    particular domain.

    :param Type: Polymorphic Discriminator
    :type Type: str
    :param domain_name: The name of the domain that should used for placement
     as per this policy.
    :type domain_name: str
    """ 

    _validation = {
        'Type': {'required': True},
    }

    _attribute_map = {
        'Type': {'key': 'Type', 'type': 'str'},
        'domain_name': {'key': 'DomainName', 'type': 'str'},
    }

    def __init__(self, domain_name=None):
        super(ServicePlacementRequiredDomainPolicyDescription, self).__init__()
        self.domain_name = domain_name
        self.Type = 'RequireDomain'
