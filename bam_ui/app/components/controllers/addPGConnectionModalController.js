angular.module('bigSQL.components').controller('addPGConnectionModalController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$uibModal', 'bamAjaxCall', 'htmlMessages', '$window', '$http', function ($scope, $uibModalInstance, PubSubService, $rootScope, $uibModal, bamAjaxCall, htmlMessages, $window, $http) {

    var session;
	var sessPromise = PubSubService.getSession();
	var subscriptions = [];
	$scope.pgList = $uibModalInstance.pgList;
	$scope.editConnData = $uibModalInstance.editConnData;
	$scope.servers = [];
	$scope.port = 5432;

	for (var i = 0; i < $scope.pgList.length; ++i) {
	    var obj = $scope.pgList[i];
	    if ($scope.servers.indexOf(obj.server_group)<0) {
		   	$scope.servers.push(obj.server_group)	    	
	    }
	}
	if ($scope.servers.length < 1) {
		$scope.servers = ['Servers'];
	}
	$scope.selectedServer = $scope.servers[0];
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
		$scope.selectedServer = $scope.editConnData.server_group;
	}

	
    sessPromise.then(function (sessParam) {
        session = sessParam;

    });

    $scope.connect = function (argument) {
    	if ($scope.pgList.length > 0) {
			$scope.gid = parseInt($($scope.pgList).filter(function(i,n){ return n.server_group ==  $scope.selectedServer})[0].gid);    		
    	}else{
    		$scope.gid = "1";
    	}
    	var data = {
    		component:$scope.connectionName,
    		host: $scope.host,
    		port: $scope.port,
    		database: $scope.database,
    		user: $scope.userName,
    		gid: $scope.gid,
    		rds : false
    	};
    	if ($scope.sid) {
    		data.sid=$scope.sid;
    	}
    	var addToMetaData = $http.post($window.location.origin + '/api/add_to_metadata', data);
            addToMetaData.then(function (argument) {
            	if(!$scope.sid){
            		$scope.sid = argument.data.sid;
            	}
            	if ($scope.savePassword) {
            		$rootScope.$emit('getDBstatus', $scope.sid, $scope.gid, $scope.password, true);
			        $scope.connect_err = '';
			        $scope.connecting = true;
            	}else{
            		$rootScope.$emit('getDBstatus', $scope.sid, $scope.gid, $scope.password, false);
			        $scope.connect_err = '';
			        $scope.connecting = true;
            	}
            	$rootScope.$emit('refreshPgList');
            	$uibModalInstance.dismiss('cancel');
            	$rootScope.$emit('closePasswordModal');
            });
    }

    
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $rootScope.$emit('closePasswordModal');
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    };

}]);