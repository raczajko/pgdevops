angular.module('bigSQL.components').controller('confirmOverrideModalController', ['$scope','$rootScope', '$uibModalInstance','MachineInfo', 'PubSubService', '$window', '$http', function ($scope, $rootScope, $uibModalInstance, MachineInfo, PubSubService, $window, $http) {

	var session;

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
    });

    $scope.modelBody = $uibModalInstance.modelBody;
    $scope.modalTitle = $uibModalInstance.modalTitle;
    $scope.acceptMethod = $uibModalInstance.acceptMethod;
    $scope.successText = $uibModalInstance.successText;
    $scope.failText = $uibModalInstance.failText;

    $scope.acceptOverride = function(){
        $rootScope.$emit($scope.acceptMethod);
        $scope.cancel();
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);