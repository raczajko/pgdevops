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

from .resource import Resource


class ExpressRouteCircuit(Resource):
    """ExpressRouteCircuit resource.

    Variables are only populated by the server, and will be ignored when
    sending a request.

    :param id: Resource Identifier.
    :type id: str
    :ivar name: Resource name.
    :vartype name: str
    :ivar type: Resource type.
    :vartype type: str
    :param location: Resource location.
    :type location: str
    :param tags: Resource tags.
    :type tags: dict
    :param sku: The SKU.
    :type sku: :class:`ExpressRouteCircuitSku
     <azure.mgmt.network.v2015_06_15.models.ExpressRouteCircuitSku>`
    :param circuit_provisioning_state: The CircuitProvisioningState state of
     the resource.
    :type circuit_provisioning_state: str
    :param service_provider_provisioning_state: The
     ServiceProviderProvisioningState state of the resource. Possible values
     are 'NotProvisioned', 'Provisioning', 'Provisioned', and 'Deprovisioning'.
     Possible values include: 'NotProvisioned', 'Provisioning', 'Provisioned',
     'Deprovisioning'
    :type service_provider_provisioning_state: str or
     :class:`ServiceProviderProvisioningState
     <azure.mgmt.network.v2015_06_15.models.ServiceProviderProvisioningState>`
    :param authorizations: The list of authorizations.
    :type authorizations: list of :class:`ExpressRouteCircuitAuthorization
     <azure.mgmt.network.v2015_06_15.models.ExpressRouteCircuitAuthorization>`
    :param peerings: The list of peerings.
    :type peerings: list of :class:`ExpressRouteCircuitPeering
     <azure.mgmt.network.v2015_06_15.models.ExpressRouteCircuitPeering>`
    :param service_key: The ServiceKey.
    :type service_key: str
    :param service_provider_notes: The ServiceProviderNotes.
    :type service_provider_notes: str
    :param service_provider_properties: The ServiceProviderProperties.
    :type service_provider_properties:
     :class:`ExpressRouteCircuitServiceProviderProperties
     <azure.mgmt.network.v2015_06_15.models.ExpressRouteCircuitServiceProviderProperties>`
    :param provisioning_state: Gets the provisioning state of the public IP
     resource. Possible values are: 'Updating', 'Deleting', and 'Failed'.
    :type provisioning_state: str
    :param etag: Gets a unique read-only string that changes whenever the
     resource is updated.
    :type etag: str
    """

    _validation = {
        'name': {'readonly': True},
        'type': {'readonly': True},
    }

    _attribute_map = {
        'id': {'key': 'id', 'type': 'str'},
        'name': {'key': 'name', 'type': 'str'},
        'type': {'key': 'type', 'type': 'str'},
        'location': {'key': 'location', 'type': 'str'},
        'tags': {'key': 'tags', 'type': '{str}'},
        'sku': {'key': 'sku', 'type': 'ExpressRouteCircuitSku'},
        'circuit_provisioning_state': {'key': 'properties.circuitProvisioningState', 'type': 'str'},
        'service_provider_provisioning_state': {'key': 'properties.serviceProviderProvisioningState', 'type': 'str'},
        'authorizations': {'key': 'properties.authorizations', 'type': '[ExpressRouteCircuitAuthorization]'},
        'peerings': {'key': 'properties.peerings', 'type': '[ExpressRouteCircuitPeering]'},
        'service_key': {'key': 'properties.serviceKey', 'type': 'str'},
        'service_provider_notes': {'key': 'properties.serviceProviderNotes', 'type': 'str'},
        'service_provider_properties': {'key': 'properties.serviceProviderProperties', 'type': 'ExpressRouteCircuitServiceProviderProperties'},
        'provisioning_state': {'key': 'properties.provisioningState', 'type': 'str'},
        'etag': {'key': 'etag', 'type': 'str'},
    }

    def __init__(self, id=None, location=None, tags=None, sku=None, circuit_provisioning_state=None, service_provider_provisioning_state=None, authorizations=None, peerings=None, service_key=None, service_provider_notes=None, service_provider_properties=None, provisioning_state=None, etag=None):
        super(ExpressRouteCircuit, self).__init__(id=id, location=location, tags=tags)
        self.sku = sku
        self.circuit_provisioning_state = circuit_provisioning_state
        self.service_provider_provisioning_state = service_provider_provisioning_state
        self.authorizations = authorizations
        self.peerings = peerings
        self.service_key = service_key
        self.service_provider_notes = service_provider_notes
        self.service_provider_properties = service_provider_properties
        self.provisioning_state = provisioning_state
        self.etag = etag
