angular.module('bigSQL.common').factory('htmlMessages', function ( $q, $filter) {

    var allMessages = {
        "labNotEnabled": 'This is a labs feature, you need to enable this in <a href="#/components/settings">settings.</a>'
    };

    return {
        getMessage: function (msg) {
            return allMessages[msg]
        }
    }

});