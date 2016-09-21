angular.module('bigSQL.components').factory('bamAjaxCall', function ($q, $http, $window) {


    var getCmdData = function (cmd) {

        return $q(function (resolve, reject) {
            $http.get($window.location.origin + '/api/' + cmd)
            .success(function(data) {
                resolve(data);
            }).error(function (data) {
                resolve('error');
            });
            

        });
    }

    return {
        getCmdData: getCmdData,
    }
})
