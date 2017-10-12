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


class OSProfile(Model):
    """Describes an OS profile.

    :param computer_name: Specifies the host OS name of the virtual machine.
    :type computer_name: str
    :param admin_username: Specifies the name of the administrator account.
    :type admin_username: str
    :param admin_password: Specifies the password of the administrator
     account.
    :type admin_password: str
    :param custom_data: Specifies a base-64 encoded string of custom data. The
     base-64 encoded string is decoded to a binary array that is saved as a
     file on the Virtual Machine. The maximum length of the binary array is
     65535 bytes
    :type custom_data: str
    :param windows_configuration: The Windows configuration of the OS profile.
    :type windows_configuration: :class:`WindowsConfiguration
     <azure.mgmt.compute.compute.v2015_06_15.models.WindowsConfiguration>`
    :param linux_configuration: The Linux configuration of the OS profile.
    :type linux_configuration: :class:`LinuxConfiguration
     <azure.mgmt.compute.compute.v2015_06_15.models.LinuxConfiguration>`
    :param secrets: The list of certificates for addition to the VM.
    :type secrets: list of :class:`VaultSecretGroup
     <azure.mgmt.compute.compute.v2015_06_15.models.VaultSecretGroup>`
    """

    _attribute_map = {
        'computer_name': {'key': 'computerName', 'type': 'str'},
        'admin_username': {'key': 'adminUsername', 'type': 'str'},
        'admin_password': {'key': 'adminPassword', 'type': 'str'},
        'custom_data': {'key': 'customData', 'type': 'str'},
        'windows_configuration': {'key': 'windowsConfiguration', 'type': 'WindowsConfiguration'},
        'linux_configuration': {'key': 'linuxConfiguration', 'type': 'LinuxConfiguration'},
        'secrets': {'key': 'secrets', 'type': '[VaultSecretGroup]'},
    }

    def __init__(self, computer_name=None, admin_username=None, admin_password=None, custom_data=None, windows_configuration=None, linux_configuration=None, secrets=None):
        self.computer_name = computer_name
        self.admin_username = admin_username
        self.admin_password = admin_password
        self.custom_data = custom_data
        self.windows_configuration = windows_configuration
        self.linux_configuration = linux_configuration
        self.secrets = secrets
