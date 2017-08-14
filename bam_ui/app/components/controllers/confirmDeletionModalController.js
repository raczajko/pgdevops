angular.module('bigSQL.components').controller('confirmDeletionModalController', ['$scope','$rootScope', '$uibModalInstance','MachineInfo', 'PubSubService', '$window', '$http', 'bamAjaxCall', function ($scope, $rootScope, $uibModalInstance, MachineInfo, PubSubService, $window, $http, bamAjaxCall) {

	var session;

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
    });

    var deleteFiles = $uibModalInstance.deleteFiles;
    $scope.comp = $uibModalInstance.comp;
    $scope.deleteCred = $uibModalInstance.deleteCred;

    $scope.removeReports = function (argument) {
        if($scope.comp == 'pgbadger'){
            var removeFiles = $http.post($window.location.origin + '/api/remove_reports/badger', deleteFiles);
            removeFiles.then(function (data) {
                if(data.data.error == 0){
                    $rootScope.$emit("updateReports");
                    $uibModalInstance.dismiss('cancel');
                }
            });    
        }else{
            var removeFiles = $http.post($window.location.origin + '/api/remove_reports/profiler', deleteFiles);
            removeFiles.then(function (data) {
                if(data.data.error == 0){
                    $rootScope.$emit('refreshPage');
                    $uibModalInstance.dismiss('cancel');
                }
            });
        }
    }

    $scope.removeCreds = function (argument) {
        var deleteCred = bamAjaxCall.postData('/api/pgc/credentials/delete/', {'cred_uuids' : deleteFiles} )
        deleteCred.then(function (data) {
            $rootScope.$emit('refreshCreds');
            $uibModalInstance.dismiss('cancel');
        })
    }

    $scope.deleteFilesLength = deleteFiles.length;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);