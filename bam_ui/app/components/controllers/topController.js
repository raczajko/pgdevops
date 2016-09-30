angular.module('bigSQL.components').controller('topController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$http', '$window', '$interval', '$rootScope', 'bamAjaxCall', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $http, $window, $interval, $rootScope, bamAjaxCall) {

    var session;
    var subscriptions = [];
    $scope.components = {};
    $scope.alerts = [];

    var updateSelectedList = [];
    var currentComponent = {};
    var checkUpdates;


    function getTopCmdData() {

        console.log($rootScope.top_host);

        var selectedHost = $rootScope.top_host;
        $scope.loadingSpinner = true;
        $scope.body = false;



        if (selectedHost==""){
            $scope.host= "localhost";
                    var infoData = bamAjaxCall.getCmdData('top');
                } else{
             $scope.host= selectedHost;
                    var infoData = bamAjaxCall.getCmdData('hostcmd/top/'+selectedHost);
                }

        infoData.then(function(data) {
                    $scope.topProcess = data[0];
                });



        $scope.loadingSpinner = false;
        $scope.body = true;

    }


    $interval(getTopCmdData, 5000);
    $scope.cancel = function () {

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

        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }

    });

}]);
