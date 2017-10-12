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

from msrest.service_client import ServiceClient
from msrest import Serializer, Deserializer
from msrestazure import AzureConfiguration
from ..version import VERSION


class ResourceManagementClientConfiguration(AzureConfiguration):
    """Configuration for ResourceManagementClient
    Note that all parameters used to create this instance are saved as instance
    attributes.

    :param credentials: Credentials needed for the client to connect to Azure.
    :type credentials: :mod:`A msrestazure Credentials
     object<msrestazure.azure_active_directory>`
    :param subscription_id: The ID of the target subscription.
    :type subscription_id: str
    :param str base_url: Service URL
    """

    def __init__(
            self, credentials, subscription_id, base_url=None):

        if credentials is None:
            raise ValueError("Parameter 'credentials' must not be None.")
        if subscription_id is None:
            raise ValueError("Parameter 'subscription_id' must not be None.")
        if not isinstance(subscription_id, str):
            raise TypeError("Parameter 'subscription_id' must be str.")
        if not base_url:
            base_url = 'https://management.azure.com'

        super(ResourceManagementClientConfiguration, self).__init__(base_url)

        self.add_user_agent('resourcemanagementclient/{}'.format(VERSION))
        self.add_user_agent('Azure-SDK-For-Python')

        self.credentials = credentials
        self.subscription_id = subscription_id


class ResourceManagementClient(object):
    """Provides operations for working with resources and resource groups.

    :ivar config: Configuration for client.
    :vartype config: ResourceManagementClientConfiguration

    :param credentials: Credentials needed for the client to connect to Azure.
    :type credentials: :mod:`A msrestazure Credentials
     object<msrestazure.azure_active_directory>`
    :param subscription_id: The ID of the target subscription.
    :type subscription_id: str
    :param str base_url: Service URL
    """

    LATEST_API_VERSION = '2017-05-10'

    def __init__(
            self, credentials, subscription_id, api_version=LATEST_API_VERSION, base_url=None):

        self.config = ResourceManagementClientConfiguration(credentials, subscription_id, base_url)
        self._client = ServiceClient(self.config.credentials, self.config)

        client_models = {k: v for k, v in self.models(api_version).__dict__.items() if isinstance(v, type)}
        self.api_version = api_version
        self._serialize = Serializer(client_models)
        self._deserialize = Deserializer(client_models)

    @classmethod
    def models(cls, api_version=LATEST_API_VERSION):
        if api_version == '2016-02-01':
            from .v2016_02_01 import models
            return models
        elif api_version == '2016-09-01':
            from .v2016_09_01 import models
            return models
        elif api_version == '2017-05-10':
            from .v2017_05_10 import models
            return models
        raise NotImplementedError("APIVersion {} is not available".format(api_version))

    @property
    def deployment_operations(self):
        if self.api_version == '2016-02-01':
            from .v2016_02_01.operations import DeploymentOperations as OperationClass
        elif self.api_version == '2016-09-01':
            from .v2016_09_01.operations import DeploymentOperations as OperationClass
        elif self.api_version == '2017-05-10':
            from .v2017_05_10.operations import DeploymentOperations as OperationClass
        else:
            raise NotImplementedError("APIVersion {} is not available".format(self.api_version))
        return OperationClass(self._client, self.config, self._serialize, self._deserialize)

    @property
    def deployments(self):
        if self.api_version == '2016-02-01':
            from .v2016_02_01.operations import DeploymentsOperations as OperationClass
        elif self.api_version == '2016-09-01':
            from .v2016_09_01.operations import DeploymentsOperations as OperationClass
        elif self.api_version == '2017-05-10':
            from .v2017_05_10.operations import DeploymentsOperations as OperationClass
        else:
            raise NotImplementedError("APIVersion {} is not available".format(self.api_version))
        return OperationClass(self._client, self.config, self._serialize, self._deserialize)

    @property
    def providers(self):
        if self.api_version == '2016-02-01':
            from .v2016_02_01.operations import ProvidersOperations as OperationClass
        elif self.api_version == '2016-09-01':
            from .v2016_09_01.operations import ProvidersOperations as OperationClass
        elif self.api_version == '2017-05-10':
            from .v2017_05_10.operations import ProvidersOperations as OperationClass
        else:
            raise NotImplementedError("APIVersion {} is not available".format(self.api_version))
        return OperationClass(self._client, self.config, self._serialize, self._deserialize)

    @property
    def resource_groups(self):
        if self.api_version == '2016-02-01':
            from .v2016_02_01.operations import ResourceGroupsOperations as OperationClass
        elif self.api_version == '2016-09-01':
            from .v2016_09_01.operations import ResourceGroupsOperations as OperationClass
        elif self.api_version == '2017-05-10':
            from .v2017_05_10.operations import ResourceGroupsOperations as OperationClass
        else:
            raise NotImplementedError("APIVersion {} is not available".format(self.api_version))
        return OperationClass(self._client, self.config, self._serialize, self._deserialize)

    @property
    def resources(self):
        if self.api_version == '2016-02-01':
            from .v2016_02_01.operations import ResourcesOperations as OperationClass
        elif self.api_version == '2016-09-01':
            from .v2016_09_01.operations import ResourcesOperations as OperationClass
        elif self.api_version == '2017-05-10':
            from .v2017_05_10.operations import ResourcesOperations as OperationClass
        else:
            raise NotImplementedError("APIVersion {} is not available".format(self.api_version))
        return OperationClass(self._client, self.config, self._serialize, self._deserialize)

    @property
    def tags(self):
        if self.api_version == '2016-02-01':
            from .v2016_02_01.operations import TagsOperations as OperationClass
        elif self.api_version == '2016-09-01':
            from .v2016_09_01.operations import TagsOperations as OperationClass
        elif self.api_version == '2017-05-10':
            from .v2017_05_10.operations import TagsOperations as OperationClass
        else:
            raise NotImplementedError("APIVersion {} is not available".format(self.api_version))
        return OperationClass(self._client, self.config, self._serialize, self._deserialize)
