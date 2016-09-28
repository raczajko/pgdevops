angular.module('bigSQL.components').controller('addHostController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', function ($scope, $uibModalInstance, PubSubService, $rootScope) {

    var session;
	var sessPromise = PubSubService.getSession();
	var subscriptions = [];
	$scope.tryToConnect = false;
	$scope.registerResponse;

    sessPromise.then(function (sessParam) {
        session = sessParam;
        $scope.addHost = function () {
        	$scope.registerResponse = '';
	        session.call('com.bigsql.registerHost',[$scope.hostName, $scope.pgcDir, $scope.userName, $scope.password]);
	    	$scope.tryToConnect = true;
	    	
	    	session.subscribe("com.bigsql.onRegisterHost", function (data) {
	    		$scope.registerResponse = data[0][0];
	    		$scope.tryToConnect = false;
	    		if(data[0][0] == 'PGC HOME exists \n'){
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