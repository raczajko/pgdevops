angular.module('bigSQL.components').controller('addServerGroupsController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$http', '$window', function ($scope, $uibModalInstance, PubSubService, $rootScope, $http, $window) {

    var session;
	var sessPromise = PubSubService.getSession();
	var subscriptions = [];
	$scope.type = 'Add';
	$scope.CreatingGroup = false;

	$scope.hostName = '';
	$scope.pgcDir = '';
	$scope.userName = '';
	$scope.availableServers = [];
	$scope.groupServers = [];
	if($scope.editGroup){
		$scope.type = 'Edit';
		$scope.name = $scope.editGroup.group;
		$scope.groupId = $scope.editGroup.group_id;
		$scope.groupServers = $uibModalInstance.groupServers;
	}

	$http.get($window.location.origin + '/api/hosts')
	    .success(function (data) {
	    	if($scope.groupServers.length > 0){
	    		for (var i = 0 ; i < data.length; i++) {
	    			for (var j = 0; j < $scope.groupServers.length; j++) {
	    				if($scope.groupServers[j].host_id == data[i].host_id){
	    					data.splice(i, 1);
	    				}
	    			}
	    		}
	    	} 
		    $scope.availableServers = data;	    		
	    	
	    })
	    .error(function (error) {
	        
	    });

	
	$scope.addToGroup = function (argument) {
		for (var i = argument.length - 1; i >= 0; i--) {
			var data = JSON.parse(argument[i])
			$scope.availableServers = $scope.availableServers.filter(function(arg) { 
			   return arg.host_id !== data.host_id;  
			});
			$scope.groupServers.push(data);
		}
	}

	$scope.removeFromGroup = function (argument) {
		for (var i = argument.length - 1; i >= 0; i--) {
			var data = JSON.parse(argument[i])
			$scope.groupServers = $scope.groupServers.filter(function(arg) { 
			   return arg.host_id !== data.host_id;  
			});
			$scope.availableServers.push(data);
		}
	}

    sessPromise.then(function (sessParam) {
        session = sessParam;
        session.subscribe('com.bigsql.onRegisterServerGroup', function (data) {
		    	var jsonData = JSON.parse(data[0][0]);
		    	if(jsonData[0].state == "completed"){
		    		$scope.message = jsonData[0].msg;
		    		$scope.$apply();
		    		$uibModalInstance.dismiss('cancel');
		    		$rootScope.$emit('updateGroups');
		    	}
		    }).then(function (data) {
		    })
    });

    

    $scope.addServerGroup = function(argument) {
		$scope.CreatingGroup = true;
		var hosts_id = [];
		$scope.message = "Creating Group...";
		for (var i =0; i < $scope.groupServers.length ; i++) {
			hosts_id.push(parseInt($scope.groupServers[i].host_id));
		}
		session.call('com.bigsql.registerServerGroup',[argument, hosts_id]);
	}

	$scope.updateServerGroup = function(argument) {
		$scope.updatingGroup = true;
		var hosts_id = [];
		$scope.message = "Updating Group...";
		for (var i =0; i < $scope.groupServers.length ; i++) {
			hosts_id.push(parseInt($scope.groupServers[i].host_id));
		}
		session.call('com.bigsql.updateServerGroup',[argument, hosts_id, $scope.groupId]);
		$uibModalInstance.dismiss('cancel');
		$rootScope.$emit('updateGroups');
	}

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    };

}]);