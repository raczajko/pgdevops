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


class PublicIPAddressDnsSettings(Model):
    """Contains FQDN of the DNS record associated with the public IP address.

    :param domain_name_label: Gets or sets the Domain name label.The
     concatenation of the domain name label and the regionalized DNS zone make
     up the fully qualified domain name associated with the public IP address.
     If a domain name label is specified, an A DNS record is created for the
     public IP in the Microsoft Azure DNS system.
    :type domain_name_label: str
    :param fqdn: Gets the FQDN, Fully qualified domain name of the A DNS
     record associated with the public IP. This is the concatenation of the
     domainNameLabel and the regionalized DNS zone.
    :type fqdn: str
    :param reverse_fqdn: Gets or Sets the Reverse FQDN. A user-visible, fully
     qualified domain name that resolves to this public IP address. If the
     reverseFqdn is specified, then a PTR DNS record is created pointing from
     the IP address in the in-addr.arpa domain to the reverse FQDN.
    :type reverse_fqdn: str
    """

    _attribute_map = {
        'domain_name_label': {'key': 'domainNameLabel', 'type': 'str'},
        'fqdn': {'key': 'fqdn', 'type': 'str'},
        'reverse_fqdn': {'key': 'reverseFqdn', 'type': 'str'},
    }

    def __init__(self, domain_name_label=None, fqdn=None, reverse_fqdn=None):
        self.domain_name_label = domain_name_label
        self.fqdn = fqdn
        self.reverse_fqdn = reverse_fqdn
