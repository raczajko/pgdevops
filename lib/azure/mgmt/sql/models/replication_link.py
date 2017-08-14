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

from .sub_resource import SubResource


class ReplicationLink(SubResource):
    """Represents a database replication link.

    Variables are only populated by the server, and will be ignored when
    sending a request.

    :ivar name: Resource name
    :vartype name: str
    :ivar id: The resource ID.
    :vartype id: str
    :ivar location: Location of the server that contains this firewall rule.
    :vartype location: str
    :ivar type: Type of resource this is.
    :vartype type: str
    :ivar is_termination_allowed: Legacy value indicating whether termination
     is allowed.  Currently always returns true.
    :vartype is_termination_allowed: bool
    :ivar replication_mode: Replication mode of this replication link.
    :vartype replication_mode: str
    :ivar partner_server: The name of the server hosting the partner database.
    :vartype partner_server: str
    :ivar partner_database: The name of the partner database.
    :vartype partner_database: str
    :ivar partner_location: The Azure Region of the partner database.
    :vartype partner_location: str
    :ivar role: The role of the database in the replication link. Possible
     values include: 'Primary', 'Secondary', 'NonReadableSecondary', 'Source',
     'Copy'
    :vartype role: str or :class:`ReplicationRole
     <azure.mgmt.sql.models.ReplicationRole>`
    :ivar partner_role: The role of the partner database in the replication
     link. Possible values include: 'Primary', 'Secondary',
     'NonReadableSecondary', 'Source', 'Copy'
    :vartype partner_role: str or :class:`ReplicationRole
     <azure.mgmt.sql.models.ReplicationRole>`
    :ivar start_time: The start time for the replication link.
    :vartype start_time: datetime
    :ivar percent_complete: The percentage of seeding complete for the
     replication link.
    :vartype percent_complete: int
    :ivar replication_state: The replication state for the replication link.
     Possible values include: 'PENDING', 'SEEDING', 'CATCH_UP', 'SUSPENDED'
    :vartype replication_state: str or :class:`ReplicationState
     <azure.mgmt.sql.models.ReplicationState>`
    """

    _validation = {
        'name': {'readonly': True},
        'id': {'readonly': True},
        'location': {'readonly': True},
        'type': {'readonly': True},
        'is_termination_allowed': {'readonly': True},
        'replication_mode': {'readonly': True},
        'partner_server': {'readonly': True},
        'partner_database': {'readonly': True},
        'partner_location': {'readonly': True},
        'role': {'readonly': True},
        'partner_role': {'readonly': True},
        'start_time': {'readonly': True},
        'percent_complete': {'readonly': True},
        'replication_state': {'readonly': True},
    }

    _attribute_map = {
        'name': {'key': 'name', 'type': 'str'},
        'id': {'key': 'id', 'type': 'str'},
        'location': {'key': 'location', 'type': 'str'},
        'type': {'key': 'type', 'type': 'str'},
        'is_termination_allowed': {'key': 'properties.isTerminationAllowed', 'type': 'bool'},
        'replication_mode': {'key': 'properties.replicationMode', 'type': 'str'},
        'partner_server': {'key': 'properties.partnerServer', 'type': 'str'},
        'partner_database': {'key': 'properties.partnerDatabase', 'type': 'str'},
        'partner_location': {'key': 'properties.partnerLocation', 'type': 'str'},
        'role': {'key': 'properties.role', 'type': 'ReplicationRole'},
        'partner_role': {'key': 'properties.partnerRole', 'type': 'ReplicationRole'},
        'start_time': {'key': 'properties.startTime', 'type': 'iso-8601'},
        'percent_complete': {'key': 'properties.percentComplete', 'type': 'int'},
        'replication_state': {'key': 'properties.replicationState', 'type': 'str'},
    }

    def __init__(self):
        super(ReplicationLink, self).__init__()
        self.location = None
        self.type = None
        self.is_termination_allowed = None
        self.replication_mode = None
        self.partner_server = None
        self.partner_database = None
        self.partner_location = None
        self.role = None
        self.partner_role = None
        self.start_time = None
        self.percent_complete = None
        self.replication_state = None
