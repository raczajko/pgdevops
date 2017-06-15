angular.module('bigSQL.components').controller('addPGConnectionModalController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$uibModal', 'bamAjaxCall', 'htmlMessages', '$window', '$http', function ($scope, $uibModalInstance, PubSubService, $rootScope, $uibModal, bamAjaxCall, htmlMessages, $window, $http) {

    var session;
	var sessPromise = PubSubService.getSession();
	var subscriptions = [];
	$scope.pgList = $uibModalInstance.pgList;
	$scope.editConnData = $uibModalInstance.editConnData;
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
	if($scope.editConnData){
		$scope.type = 'Edit';
		$scope.create_btn = "Update";
		$scope.host = $scope.editConnData.host;
		$scope.port = parseInt($scope.editConnData.port);
		$scope.userName = $scope.editConnData.db_user;
		$scope.database = $scope.editConnData.db;
		$scope.connectionName = $scope.editConnData.server_name;
		$scope.sid = $scope.editConnData.sid;
	}

	
    sessPromise.then(function (sessParam) {
        session = sessParam;

    });

    $scope.connect = function (argument) {
    	var data = {
    		component:$scope.connectionName,
    		host: $scope.host,
    		port: $scope.port,
    		database: $scope.database,
    		user: $scope.userName,
    		gid: parseInt($($scope.pgList).filter(function(i,n){ return n.server_group ==  $scope.selectedServer[0]})[0].gid)
    	};
    	if ($scope.sid) {
    		data.sid=$scope.sid;
    	}
    	var addToMetaData = $http.post($window.location.origin + '/api/add_to_metadata', data);
            addToMetaData.then(function (argument) {
            	$rootScope.$emit('refreshPgList');
            	$uibModalInstance.dismiss('cancel');
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