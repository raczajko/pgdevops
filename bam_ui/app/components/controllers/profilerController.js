angular.module('bigSQL.components').controller('profilerController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', '$http', '$location', 'bamAjaxCall', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, $http, $location, bamAjaxCall) {

    $scope.alerts = [];

    var subscriptions = [];
    $scope.components = {};

    var session;
    $scope.updateSettings;
    $scope.loading = true;
    $scope.retry = false;
    $scope.disableShowInstalled = false;

    $scope.statusColors = {
        "Stopped": "orange",
        "Not Initialized": "yellow",
        "Running": "green"
    };




    $scope.loadHostsInfo = function (idx) {

            var remote_host = $scope.hostsList[idx].host;
            var info_url = 'hostcmd/info/' + remote_host;

            if (remote_host == "localhost") {
                info_url = 'info';
                remote_host = "";
            }

            var infoData = bamAjaxCall.getCmdData(info_url);
            infoData.then(function(data) {
                $scope.hostsList[idx].hostInfo = data[0];
            });
    };



    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
        });
    });


    $scope.generateReport = function () {
        $scope.report_file="";
        $scope.report_url="";
        //console.log($scope.hostName);
        //console.log($scope.pgUser);
        var dataObj = {};
        dataObj['hostName'] = $scope.hostName;
        dataObj['pgUser'] = $scope.pgUser;
        dataObj['pgPass'] = $scope.pgPass;
        dataObj['pgPort'] = $scope.pgPort;
        dataObj['pgQuery'] = $scope.pgQuery;
        dataObj['pgTitle'] = $scope.pgTitle;
        dataObj['pgDesc'] = $scope.pgDesc;
        dataObj['pgDB'] = $scope.pgDB;
        var res = $http.post('/api/generate_profiler_reports', {'data':dataObj});
		res.success(function(data, status, headers, config) {
            //console.log(data);
            if (data.error==0){
                $scope.report_file=data.report_file;
                $scope.report_url = "/reports/"+data.report_file;
			    //$scope.message = data;
            } else{
                alert(data.msg);
            }

		});
		res.error(function(data, status, headers, config) {
			alert( "failure message: " + JSON.stringify({data: data}));
		});



    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);

