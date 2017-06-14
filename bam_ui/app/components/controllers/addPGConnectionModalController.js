angular.module('bigSQL.components').controller('addPGConnectionModalController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$uibModal', 'bamAjaxCall', 'htmlMessages', '$window', '$http', function ($scope, $uibModalInstance, PubSubService, $rootScope, $uibModal, bamAjaxCall, htmlMessages, $window, $http) {

    var session;
	var sessPromise = PubSubService.getSession();
	var subscriptions = [];
	$scope.pgList = $uibModalInstance.pgList;
	$scope.serverGroup = {};
	for (var i = 0; i < $scope.pgList.length; ++i) {
	    var obj = $scope.pgList[i];
	    if ($scope.serverGroup[obj.server_group] === undefined)
	        $scope.serverGroup[obj.server_group] = [obj.server_group];
	    $scope.serverGroup[obj.server_group].push(obj.DblValue);
	}
	$scope.tryToConnect = false;
	$scope.connectionStatus = false;
	$scope.installingStatus = false;
	$scope.setupError = false;
	$scope.registerResponse;
	$scope.type = 'Add';
	$scope.alerts = [];

	$scope.hostName = '';
	$scope.pgcDir = '';
	$scope.userName = '';

    $scope.create_btn = "Create";
	if($scope.editHost){
		$scope.type = 'Edit';
		$scope.create_btn = "Update";
		$scope.hostName = $scope.editHost.host;
		$scope.pgcDir = $scope.editHost.pgc_home;
		$scope.userName = $scope.editHost.user;
		$scope.connectionName = $scope.editHost.name;
	}

	
    sessPromise.then(function (sessParam) {
        session = sessParam;

    });

    $scope.connect = function (argument) {
    	var data = {
    		component:$scope.connectionName,
    		host: $scope.host,
    		project: $scope.selectedServer[0],
    		port: $scope.port,
    		database: $scope.database,
    		user: $scope.userName
    	};

    	var addToMetaData = $http.post($window.location.origin + '/api/add_to_metadata', data);
            addToMetaData.then(function (argument) {
            });
    }

    
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    };

}]);