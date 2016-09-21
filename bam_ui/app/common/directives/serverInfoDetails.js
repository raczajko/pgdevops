angular.module('bigSQL.common').directive('serverInfoDetails', function (bamAjaxCall) {

    return {
        scope: {
            title : '@'
        },
        restrict: 'E',
        template: '<div class="components-update-title-wrapper">  <h1><strong>{{title}}</strong> : {{data.host}} </h1>  <h3><strong> OS </strong> : {{data.os}} &nbsp; <strong>HW </strong>: {{data.mem}} GB, {{data.cores}} x {{data.cpu}} &nbsp; <strong>PGC</strong> : {{data.version}}</h3></div>',
        controller: ['$scope', '$http', '$window', function serverInfoDetailsController($scope, $http, $window) {
            
            var infoData = bamAjaxCall.getCmdData('info')
            infoData.then(function(data) {
                $scope.data = data[0];
            });
        }]
    }
});