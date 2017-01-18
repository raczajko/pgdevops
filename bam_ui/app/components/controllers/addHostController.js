angular.module('bigSQL.components').controller('addHostController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$uibModal', function ($scope, $uibModalInstance, PubSubService, $rootScope, $uibModal) {

    var session;
	var sessPromise = PubSubService.getSession();
	var subscriptions = [];
	$scope.tryToConnect = false;
	$scope.connectionStatus = false;
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
		$scope.connectionName = $scope.editHost.name;
	}

	$scope.firstPhase = true;
	$scope.secondPhase = false;

    sessPromise.then(function (sessParam) {
        session = sessParam;
        $scope.addHost = function () {
        	$scope.connectionError = false;
        	$scope.registerResponse = '';
	        session.call('com.bigsql.registerHost',[$scope.hostName, $scope.pgcDir, $scope.userName, $scope.password, $scope.connectionName]);
	    	$scope.tryToConnect = true;
	    	
	    	session.subscribe("com.bigsql.onRegisterHost", function (data) {
	    		$scope.registerResponse = data[0];
	    		
	    		var jsonData =  JSON.parse(data[0]);
	    		if(jsonData[0].state == 'completed'){
	    			$rootScope.$emit('addedHost'); 
	    			$uibModalInstance.dismiss('cancel');
	    		}else if (jsonData[0].state == 'progress') {
	    			$scope.tryToConnect = false;
	    			$scope.connectionStatus = true;
	    			$scope.message = jsonData[0].msg;
	    		} else if(jsonData[0].state == 'error'){
	    			$scope.tryToConnect = false;
	    			$scope.connectionError = true;
	    			$scope.message = jsonData[0].msg;
	    			// $uibModalInstance.dismiss('cancel');
	    		}
	    		$scope.$apply();
	        }).then(function (subscription) {
	            subscriptions.push(subscription);
	        });
	    }
    });

    $scope.next = function (argument) {
    	if($scope.firstPhase){
    		$scope.firstPhase = false;
    		$scope.secondPhase = true;
    	}else if($scope.secondPhase){
    		$scope.secondPhase = false;
    		$scope.thirdPhase = true;
    	}else if($scope.thirdPhase){
    			$uibModalInstance.dismiss('cancel');
		        var modalInstance = $uibModal.open({
		            templateUrl: '../app/components/partials/pgInitialize.html',
		            controller: 'pgInitializeController',
		        });
		        modalInstance.component = '';
		        modalInstance.autoStartButton = false;
    	}
    }

    $scope.back = function (argument) {
    	if($scope.secondPhase){
    		$scope.secondPhase = false;
    		$scope.firstPhase = true;
    	}else if($scope.thirdPhase){
    		$scope.thirdPhase = false;
    		$scope.secondPhase = true;
    	}
    }

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    };

}]);