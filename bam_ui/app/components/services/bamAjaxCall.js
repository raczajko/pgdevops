angular.module('bigSQL.components').factory('bamAjaxCall', function ($q, $http, $window) {


    var getCmdData = function (cmd, params={}) {

        return $q(function (resolve, reject) {
            var config = {}
            if(Object.keys(params).length>0){
                config = {
                params: params,
                headers : {'Accept' : 'application/json'}

                };
            }
            $http.get($window.location.origin + '/api/' + cmd, config)
            .success(function(data) {
                resolve(data);
            }).error(function (data) {
                resolve('error');
            });
            

        });
    };

    return {
        getCmdData: getCmdData,
    }
});
