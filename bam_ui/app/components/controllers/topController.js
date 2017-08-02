angular.module('bigSQL.components').controller('topController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$sce', '$timeout', '$interval', '$rootScope', 'bamAjaxCall', 'htmlMessages', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $sce, $timeout, $interval, $rootScope, bamAjaxCall, htmlMessages) {

    var session;
    var subscriptions = [];
    $scope.components = {};
    $scope.alerts = [];

    var updateSelectedList = [];
    var currentComponent = {};
    var checkUpdates;

    var topRefresh;
    $scope.hostActive = {state: true};
    var previousTopData = "";
    $scope.loading = true;

    function getTopCmdData() {

        var selectedHost = $scope.top_host;
        $scope.loadingSpinner = true;
        $scope.body = false;
        $scope.hostinfo = $scope.host_info;


        if (selectedHost == "") {
            $scope.host = "localhost";
            var infoData = bamAjaxCall.getCmdData('top');
        } else {
            $scope.host = selectedHost;
            var infoData = bamAjaxCall.getCmdData('hostcmd/top/' + $scope.host_name);
        }

        infoData.then(function (data) {
            $scope.loading = false;
            if (data.length > 0 && data[0].state) {
                $scope.errorMsg = data[0].msg;
                $scope.hostActive.state = false;
                $interval.cancel(topRefresh);
            }else{
                $scope.hostActive.state = true;
                $scope.topProcess = data[0];
            }   

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


    $timeout(function() {
        if ($scope.loading) {
            $scope.loading=false;
            $scope.timeoutMsg = $sce.trustAsHtml(htmlMessages.getMessage('unable-to-connect'));
        };
    }, 20000);
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
