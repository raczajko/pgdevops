angular.module('bigSQL.components').controller('addCredentialModalController', ['$rootScope', '$scope', '$uibModal', 'PubSubService', 'MachineInfo', 'UpdateComponentsService', 'bamAjaxCall', '$window', '$cookies', '$sce', 'htmlMessages', '$timeout', '$uibModalInstance', function ($rootScope, $scope, $uibModal, PubSubService, MachineInfo, UpdateComponentsService, bamAjaxCall, $window, $cookies, $sce, htmlMessages, $timeout, $uibModalInstance) {

	$scope.alerts = [];
	
	$scope.types = {'SSH Key' : 'ssh-key', 'Cloud' : 'cloud', 'Password' : 'pwd'};
	// $scope.cloudTypes = {'AWS': 'AWS', 'Azure': 'Azure', 'OpenStack' : 'OpenStack', 'VMware': 'VMware', 'Rackspace':'Rackspace', 'Google':'Google'};

	$scope.title = $uibModalInstance.title;
	$scope.updateCred = $uibModalInstance.updateCred;
	$scope.buttonType = "Add";
	$scope.adding = false;

	$scope.data = {
		'type' : '',
		'credential_name' : '',
		'user' : '',
		'password' : '',
		'ssh_key' : '',
		'cloud_key' : '',
		'ssh_sudo_pwd' : '',
		'cloud_name' : '',
		'cloud_secret' : '',
		'region' : ''
	}

	$scope.cloudTypeChange = function (type) {
		if (['Azure', 'AWS'].indexOf($scope.data.cloud_name) == -1) {
			$scope.alerts.push({
                    msg: 'Coming Soon',
                    type: 'warning'
                });
		}
	}

	var getCloudList = bamAjaxCall.getCmdData('cloudlist');
	getCloudList.then(function (data) {
		$scope.cloudTypes = data;
	})

	$scope.refreshData = function (argument) {
		// $scope.data.cloud_name = 'AWS';
	}

	var credentialsList = function(argument) {
		
		var getCredentials = bamAjaxCall.getCmdData('pgc/credentials/')
		getCredentials.then(function (data) {
			$scope.loading = false;
			$scope.credentialsList = data;
		})

	}

	var regions = bamAjaxCall.getCmdData('metalist/aws-regions');
    regions.then(function(data){
        $scope.loading = false;
        $scope.regions = data;
        $scope.data.region = $scope.regions[0].region;
    });


    if ($scope.updateCred) {
    	$scope.buttonType = "Update"
		$scope.loading = false;
		$scope.data.type = $scope.updateCred.cred_type;
		$scope.data.credential_name = $scope.updateCred.cred_name;
		$scope.data.user = $scope.updateCred.ssh_user;
		$scope.data.cred_uuid = $scope.updateCred.cred_uuid;
	}else{
		$scope.loading = true;
		credentialsList();
	}

	$scope.addCredential = function () {
		$scope.adding = true;
		if ($scope.data.type != 'cloud') {
			$scope.data.cloud_name = '';
			$scope.data.region = '';
		}
		if ($scope.data.cred_uuid) {
			var addCred = bamAjaxCall.putData('/api/pgc/credentials/', $scope.data)
		}else{
			var addCred = bamAjaxCall.postData('/api/pgc/credentials/', $scope.data)
		}
		addCred.then(function (data) {
			$scope.adding = false;
			if (data.state == 'error') {
				$scope.alerts.push({
		    		msg : data.msg,
		    		type : 'error'
		    	})
			}else{
				$rootScope.$emit('addResponse', data[0]);
	            $rootScope.$emit('refreshCreds');
	            $uibModalInstance.dismiss('cancel');
			}
		})
	}

	$scope.testCred = function (host, ) {
			var testData = {
				'name' : $scope.data.user,
				'password' : $scope.data.password
			}
        	var checkUser = bamAjaxCall.getCmdData('testConn', testData);
    		checkUser.then(function (argument) {
    			var jsonData = argument ;
    			if (jsonData.state == 'success') {
    				$scope.isSudo =  jsonData.isSudo;
    				$scope.pgcDir = jsonData.pgc_path;
    				$scope.pgcVersion = jsonData.pgc_version;
    				if($scope.pgcVersion && !$scope.editHost){
    				    $scope.create_btn = "Associate";
    				}
    				$scope.root_pgc_path=jsonData.root_pgc_path;
    				$scope.auth_err=jsonData.auth_err;
    				$scope.not_sudoer=jsonData.not_sudoer;
    				/*if(!$scope.pgcDir){
	    				if($scope.isSudo){
	    					//$scope.serviceUser = 'Postgres';
	    					$scope.pgcDir = '/opt'
	    				}else{
	    					//$scope.serviceUser = $scope.userName;
	    					$scope.pgcDir = '~/bigsql'
	    				}
	    			}*/
    				$scope.tryToConnect = false;
    				$scope.firstPhase = false;
    				$scope.secondPhase = true;
    			} else{
	    			$scope.connectionError = true;
	    			$scope.tryToConnect = false;
    				$scope.message = jsonData.msg;
    			}
    		})
    	}

	$scope.testCredential = function () {
		var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/testConnection.html',
                controller: 'testConnectionController',
                keyboard  : false,
                backdrop  : 'static',
            });
		modalInstance.user = $scope.data.user;
		modalInstance.password = $scope.data.password;
		modalInstance.ssh_key = $scope.data.ssh_key;
		modalInstance.ssh_sudo_pwd = $scope.data.ssh_sudo_pwd;
	}

	$scope.openUsage = function (name) {
		var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/credentialUsage.html',
                controller: 'credentialUsageController',
                keyboard  : false,
                backdrop  : 'static',
                // size : 'lg'
            });
		modalInstance.name = name;
	}

	$scope.closeAlert = function (index) {
	    $scope.alerts.splice(index, 1);
	};

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);