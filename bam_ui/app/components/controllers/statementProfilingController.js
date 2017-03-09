angular.module('bigSQL.components').controller('statementProfilingController', ['$scope','$rootScope', '$uibModalInstance','MachineInfo', 'PubSubService', function ($scope, $rootScope, $uibModalInstance, MachineInfo, PubSubService) {

	var session;

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
    });

    $scope.hostName = $uibModalInstance.hostName;
    $scope.pgUser = $uibModalInstance.pgUser;
    $scope.pgPass = $uibModalInstance.pgPass;
    $scope.pgDB = $uibModalInstance.pgDB;
    $scope.pgPort = $uibModalInstance.pgPort;
    $scope.enableProfiler = false;
    $scope.comp = $uibModalInstance.comp;

    $scope.generateReport = function (argument) {

        if(!$scope.pgTitle){
            $scope.pgTitle = $scope.comp+':'+$scope.pgDB;
        }
    	session.call('com.bigsql.plprofiler', [
            $scope.hostName, $scope.pgUser,
            $scope.pgPort, $scope.pgDB,
            $scope.pgPass, $scope.pgQuery,
            $scope.pgTitle, $scope.pgDesc,
            'profile_query', $scope.comp
        ]).then(function (sub) {
            $rootScope.$emit('refreshPage');
        	$uibModalInstance.dismiss('cancel');
        });
    };

    $scope.cancel = function () {
        $rootScope.$emit('refreshPage');
        $uibModalInstance.dismiss('cancel');
    };

}]);