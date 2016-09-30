angular.module('bigSQL.components').controller('topController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$http', '$window', '$interval', '$rootScope', 'bamAjaxCall', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $http, $window, $interval, $rootScope, bamAjaxCall) {

    var session;
    var subscriptions = [];
    $scope.components = {};
    $scope.alerts = [];

    var updateSelectedList = [];
    var currentComponent = {};
    var checkUpdates;

    var topRefresh;

    var previousTopData = "";

    function getTopCmdData() {

        console.log($scope.top_host);

        var selectedHost = $scope.top_host;
        $scope.loadingSpinner = true;
        $scope.body = false;
        $scope.hostinfo = $scope.host_info;


        if (selectedHost == "") {
            $scope.host = "localhost";
            var infoData = bamAjaxCall.getCmdData('top');
        } else {
            $scope.host = selectedHost;
            var infoData = bamAjaxCall.getCmdData('hostcmd/top/' + selectedHost);
        }

        infoData.then(function (data) {
            $scope.topProcess = data[0];
            $scope.topProcess.kb_read_sec = 0;
            $scope.topProcess.kb_write_sec = 0;


            if (previousTopData != "") {
                var diff = data[0].current_timestamp - previousTopData.current_timestamp;
                var kb_read_diff = data[0].kb_read - previousTopData.kb_read;
                var kb_write_diff = data[0].kb_write - previousTopData.kb_write;


                $scope.topProcess.kb_read_sec = Math.round(kb_read_diff / diff);


                $scope.topProcess.kb_write_sec = Math.round(kb_write_diff / diff);

            }
            previousTopData = data[0];
        });


        $scope.loadingSpinner = false;
        $scope.body = true;

    }


    topRefresh = $interval(getTopCmdData, 2000);
    $scope.cancel = function () {
        $interval.cancel(topRefresh);
        $uibModalInstance.dismiss('cancel');
    };


    var sessionPromise = PubSubService.getSession();

    sessionPromise.then(function (val) {
        getTopCmdData();
    });

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
    /**
     Unsubscribe to all the apis on the template and scope destroy
     **/
    $scope.$on('$destroy', function () {
        $interval.cancel(topRefresh);

        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }

    });

}]);
