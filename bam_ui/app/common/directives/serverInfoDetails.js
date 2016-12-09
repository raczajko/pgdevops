angular.module('bigSQL.common').directive('serverInfoDetails', function (bamAjaxCall, $rootScope) {


    return {
        scope: {
            title: '@'
        },
        restrict: 'E',
        templateUrl: '../app/common/partials/hostInfo.html',
        //template: '<div class="components-update-title-wrapper">  <h1><strong>{{title}}</strong> : {{data.host}} </h1>  <h3><strong> OS </strong> : {{data.os}} &nbsp; <strong>HW </strong>: {{data.mem}} GB, {{data.cores}} x {{data.cpu}} &nbsp; <strong>PGC</strong> : {{data.version}}</h3></div>',
        controller: ['$scope', '$http', '$window', '$cookies', function serverInfoDetailsController($scope, $http, $window, $cookies) {

            function gethostInfo(selectedHost) {
                selectedHost = typeof selectedHost !== 'undefined' ? selectedHost : "";

                if (selectedHost == "" || selectedHost == 'localhost') {
                    var infoData = bamAjaxCall.getCmdData('info');
                } else {
                    var infoData = bamAjaxCall.getCmdData('hostcmd/info/' + selectedHost);
                }

                infoData.then(function (data) {
                    $scope.data = data[0];
                });
            }

            var remote_host = $cookies.get('remote_host');
            remote_host = typeof remote_host !== 'undefined' ? remote_host : "";
            if (remote_host == "" || remote_host == undefined) {
                $scope.selecthost = 'localhost';    
            } else {
                $scope.selecthost = remote_host;
            }
            

            var hostsList = bamAjaxCall.getCmdData('hosts');

            hostsList.then(function (data) {
                if (data.length > 0 && data[0].status == "error") {
                    $scope.hosts = [];
                } else {
                    $scope.hosts = data;
                }
            });

            gethostInfo($cookies.get('remote_host'));

            $scope.hostChange = function (host) {
                $rootScope.$emit('refreshData', host);
                // $rootScope.$emit('topMenuEvent', host);
                $rootScope.remote_host = host;
                $cookies.put('remote_host', host);
                gethostInfo(host);
                // $scope.$parent.refreshData(host);
            }
        }]
    }
});