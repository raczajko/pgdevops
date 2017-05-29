angular.module('bigSQL.common').factory('htmlMessages', function ( $q, $filter) {

    var allMessages = {
        'labNotEnabled': 'This is a labs feature, you need to enable this in <a href="#/components/settings">settings.</a>',
        'pwd-or-ssh-msg' : 'Please provide either password or SSH Key',
        'last-update-none' : 'Last Update : None',
        'add-to-pgadmin' : 'Creating connections in pgAdmin4',
        'discover-rds' : 'Discovering available RDS instances',
        'pgc-not-active' : 'Unable to connect PGC.',
        'no-rds' : 'There are no RDS Instances found.',
        'email-response' : 'Thanks for your valuable feedback, we will get back to you shortly.'
    };

    return {
        getMessage: function (msg) {
            return allMessages[msg]
        }
    }

});