angular.module('bigSQL.common').directive('serverInfoDetails', function (bamAjaxCall, $rootScope) {


    return {
        scope: {
            title: '@'
        },
        restrict: 'E',
        templateUrl: '../app/common/partials/hostInfo.html',
        //template: '<div class="components-update-title-wrapper">  <h1><strong>{{title}}</strong> : {{data.host}} </h1>  <h3><strong> OS </strong> : {{data.os}} &nbsp; <strong>HW </strong>: {{data.mem}} GB, {{data.cores}} x {{data.cpu}} &nbsp; <strong>PGC</strong> : {{data.version}}</h3></div>',
        controller: ['$scope', '$http', '$window', function serverInfoDetailsController($scope, $http, $window) {

            function gethostInfo(selectedHost) {

                selectedHost = typeof selectedHost !== 'undefined' ? selectedHost : "";


                if (selectedHost == "") {
                    var infoData = bamAjaxCall.getCmdData('info');
                } else {
                    var infoData = bamAjaxCall.getCmdData('hostcmd/info/' + selectedHost);
                }

                infoData.then(function (data) {
                    $scope.data = data[0];
                });
            }

            var remote_host = $rootScope.remote_host;
            remote_host = typeof remote_host !== 'undefined' ? remote_host : "";
            $scope.selecthost = remote_host;

            var hostsList = bamAjaxCall.getCmdData('hosts');

            hostsList.then(function (data) {
                if (data[0].status == "error") {
                    $scope.hosts = [];

                } else {
                    $scope.hosts = data;

                }
            });

            gethostInfo(remote_host);

            $scope.hostChange = function (host) {
                $rootScope.remote_host = host;
                gethostInfo(host);
                $scope.$parent.refreshData(host);
            }
        }]
    }
});