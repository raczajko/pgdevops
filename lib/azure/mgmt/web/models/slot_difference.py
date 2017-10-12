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


class SlotDifference(Resource):
    """A setting difference between two deployment slots of an app.

    Variables are only populated by the server, and will be ignored when
    sending a request.

    :ivar id: Resource Id.
    :vartype id: str
    :param name: Resource Name.
    :type name: str
    :param kind: Kind of resource.
    :type kind: str
    :param location: Resource Location.
    :type location: str
    :param type: Resource type.
    :type type: str
    :param tags: Resource tags.
    :type tags: dict
    :ivar slot_difference_type: Type of the difference: Information, Warning
     or Error.
    :vartype slot_difference_type: str
    :ivar setting_type: The type of the setting: General, AppSetting or
     ConnectionString.
    :vartype setting_type: str
    :ivar diff_rule: Rule that describes how to process the setting difference
     during a slot swap.
    :vartype diff_rule: str
    :ivar setting_name: Name of the setting.
    :vartype setting_name: str
    :ivar value_in_current_slot: Value of the setting in the current slot.
    :vartype value_in_current_slot: str
    :ivar value_in_target_slot: Value of the setting in the target slot.
    :vartype value_in_target_slot: str
    :ivar description: Description of the setting difference.
    :vartype description: str
    """

    _validation = {
        'id': {'readonly': True},
        'location': {'required': True},
        'slot_difference_type': {'readonly': True},
        'setting_type': {'readonly': True},
        'diff_rule': {'readonly': True},
        'setting_name': {'readonly': True},
        'value_in_current_slot': {'readonly': True},
        'value_in_target_slot': {'readonly': True},
        'description': {'readonly': True},
    }

    _attribute_map = {
        'id': {'key': 'id', 'type': 'str'},
        'name': {'key': 'name', 'type': 'str'},
        'kind': {'key': 'kind', 'type': 'str'},
        'location': {'key': 'location', 'type': 'str'},
        'type': {'key': 'type', 'type': 'str'},
        'tags': {'key': 'tags', 'type': '{str}'},
        'slot_difference_type': {'key': 'properties.type', 'type': 'str'},
        'setting_type': {'key': 'properties.settingType', 'type': 'str'},
        'diff_rule': {'key': 'properties.diffRule', 'type': 'str'},
        'setting_name': {'key': 'properties.settingName', 'type': 'str'},
        'value_in_current_slot': {'key': 'properties.valueInCurrentSlot', 'type': 'str'},
        'value_in_target_slot': {'key': 'properties.valueInTargetSlot', 'type': 'str'},
        'description': {'key': 'properties.description', 'type': 'str'},
    }

    def __init__(self, location, name=None, kind=None, type=None, tags=None):
        super(SlotDifference, self).__init__(name=name, kind=kind, location=location, type=type, tags=tags)
        self.slot_difference_type = None
        self.setting_type = None
        self.diff_rule = None
        self.setting_name = None
        self.value_in_current_slot = None
        self.value_in_target_slot = None
        self.description = None
