angular.module('bigSQL.components').controller('addHostController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', function ($scope, $uibModalInstance, PubSubService, $rootScope) {

    var session;
	var sessPromise = PubSubService.getSession();
	var subscriptions = [];
	$scope.tryToConnect = false;
	$scope.registerResponse;
	$scope.type = 'Add';

	$scope.hostName = '';
	$scope.pgcDir = '';
	$scope.userName = '';

	if($scope.editHost){
		$scope.type = 'Edit';
		$scope.hostName = $scope.editHost.host;
		$scope.pgcDir = $scope.editHost.pgc_home;
		$scope.userName = $scope.editHost.user;
	}

    sessPromise.then(function (sessParam) {
        session = sessParam;
        $scope.addHost = function () {
        	$scope.registerResponse = '';
	        session.call('com.bigsql.registerHost',[$scope.hostName, $scope.pgcDir, $scope.userName, $scope.password]);
	    	$scope.tryToConnect = true;
	    	
	    	session.subscribe("com.bigsql.onRegisterHost", function (data) {
	    		$scope.registerResponse = data[0];
	    		$scope.tryToConnect = false;
	    		if(data[0] == 'PGC HOME exists '){
	    			$rootScope.$emit('addedHost'); 
	    			$uibModalInstance.dismiss('cancel');
	    		}
	    		$scope.$apply();
	        }).then(function (subscription) {
	            subscriptions.push(subscription);
	        });
	    }
    });

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    };

}]);