angular.module('bigSQL.components').controller('confirmDeletionModalController', ['$scope','$rootScope', '$uibModalInstance','MachineInfo', 'PubSubService', '$window', '$http', function ($scope, $rootScope, $uibModalInstance, MachineInfo, PubSubService, $window, $http) {

	var session;

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
    });

    var deleteFiles = $uibModalInstance.deleteFiles;

    $scope.removeReports = function (argument) {
        var removeFiles = $http.post($window.location.origin + '/api/remove_reports/badger', deleteFiles);
        removeFiles.then(function (data) {
            if(data.data.error == 0){
                $rootScope.$emit("updateReports");
                $uibModalInstance.dismiss('cancel');
            }
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);