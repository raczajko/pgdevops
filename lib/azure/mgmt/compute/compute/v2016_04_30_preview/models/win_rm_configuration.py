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


class WinRMConfiguration(Model):
    """Describes Windows Remote Management configuration of the VM.

    :param listeners: The list of Windows Remote Management listeners
    :type listeners: list of :class:`WinRMListener
     <azure.mgmt.compute.compute.v2016_04_30_preview.models.WinRMListener>`
    """

    _attribute_map = {
        'listeners': {'key': 'listeners', 'type': '[WinRMListener]'},
    }

    def __init__(self, listeners=None):
        self.listeners = listeners
