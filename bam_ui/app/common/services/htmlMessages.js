angular.module('bigSQL.common').factory('htmlMessages', function ( $q, $filter) {

    var allMessages = {
        'labNotEnabled': 'This is a labs feature, you need to enable {{lab}} lab in <a href="#/components/settings">settings.</a>',
        'pwd-or-ssh-msg' : 'Please provide either password or SSH Key',
        'last-update-none' : 'Last Update : None',
        'add-to-pgadmin' : 'Creating connections in pgAdmin4',
        'discover-rds' : 'Discovering available RDS instances',
        'loading-regions': 'Loading Regions List',
        'pgc-not-active' : 'Unable to connect PGC.',
        'no-rds' : 'There are no RDS Instances found.',
        'no-ec2' : 'There are no EC2 Instances found',
        'email-response' : 'Thanks for your valuable feedback, we will get back to you shortly.',
        'pgDevOps-rds-init-msg' : 'pgDevOps detected that you are in AWS environment.<br> Do you want us to discover your RDS instances if there are any?',
        'unable-to-connect' : 'Unable to connect SSH host due to session timeout.',
        'remote-pgc-ver-compatible' : 'PGC version on SSH server <strong>{{host}}</strong> is {{remote_pgc_ver}} and on pgDevOps is {{local_pgc_ver}}',
        'pgc-ver-incompatible' : 'PGC version incompatible',
        'rds-not-available' : 'Instances is not available',
        'update-pgc-host-msg' : 'Updating PGC on host {{host}}',
        'update-pgc-host-completed' : 'PGC update completed successfully',
        'coming-soon': 'Coming Soon',
        'no-credentials': 'You haven\'t added any credentials.',
        'select-one-cred' : 'You must select only one credential.',
        'no-usage-creds' : 'Selected credential(s) are currently not in use.',
        'loading-azure-pg' : 'Loading...',
        'create-azure-db' : 'Creating Postgres instance, this may take couple of minutes.',
        'create-azure-vm' : 'Creating VM, this may take couple of minutes.'
    };

    return {
        getMessage: function (msg) {
            return allMessages[msg]
        }
    }

});