angular.module('bigSQL.components').controller('confirmOverrideModalController', ['$scope','$rootScope', '$uibModalInstance','MachineInfo', 'PubSubService', '$window', '$http', function ($scope, $rootScope, $uibModalInstance, MachineInfo, PubSubService, $window, $http) {

	var session;

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
    });

    $scope.fileData = $uibModalInstance.fileData;
    $scope.modalTitle = $uibModalInstance.modalTitle;

    $scope.acceptOverride = function(){
        $rootScope.$emit("initStartBackup");
        $scope.cancel();
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);