angular.module('bigSQL.common').factory('htmlMessages', function ( $q, $filter) {

    var allMessages = {
        'labNotEnabled': 'This is a labs feature, you need to enable this in <a href="#/components/settings">settings.</a>',
        'pwd-or-ssh-msg' : 'Please provide either password or SSH Key',
        'last-update-none' : 'Last Update : None'
    };

    return {
        getMessage: function (msg) {
            return allMessages[msg]
        }
    }

});