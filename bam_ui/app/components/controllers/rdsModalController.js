angular.module('bigSQL.components').controller('rdsModalController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$http', '$window', '$interval', '$rootScope', 'bamAjaxCall', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $http, $window, $interval, $rootScope, bamAjaxCall) {

    $scope.loadingSpinner = true;
    $scope.lab = $uibModalInstance.lab;
    $scope.disp_name = $uibModalInstance.disp_name;

    var rdslist = bamAjaxCall.getCmdData('rdslist');
    rdslist.then(function (data) {
        $scope.loadingSpinner = false;
        if (data[0].state=="error") {
            $scope.errMsg = data[0].msg;
            $rootScope.$emit('disableLab', $scope.lab, 'off')
        }else{
            $scope.rdsList = data;
        }
    });

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.cancel = function () {
        $rootScope.$emit('refreshUpdateDate');
        $uibModalInstance.dismiss('cancel');
    };

}]);
