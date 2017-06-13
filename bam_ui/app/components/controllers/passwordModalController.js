angular.module('bigSQL.components').controller('passwordModalController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$uibModal', 'bamAjaxCall', '$http', '$window', '$interval', '$timeout', function ($scope, $uibModalInstance, PubSubService, $rootScope, $uibModal, bamAjaxCall, $http, $window, $interval, $timeout) {

    $scope.sid = $uibModalInstance.sid;
    $scope.gid = $uibModalInstance.gid;
    $scope.errorMsg = $uibModalInstance.error;
    $scope.connection = {savePwd : false};

    $scope.submitPassword = function (pwd) {
        $rootScope.$emit('getDBstatus', $scope.sid, $scope.gid, pwd, $scope.connection.savePwd);
        $scope.connect_err = '';
        $scope.connecting = true;
    }
    
    $rootScope.$on('connectionData', function (event, argument) {
        if (argument.state=="error"){
            $scope.connect_err=argument.msg;
            $scope.need_pwd=true;
            $scope.connecting = false;
        } else{
            $uibModalInstance.dismiss('cancel');
        }
    })
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);