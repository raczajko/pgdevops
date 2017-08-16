angular.module('bigSQL.components').controller('addCredentialModalController', ['$rootScope', '$scope', '$uibModal', 'PubSubService', 'MachineInfo', 'UpdateComponentsService', 'bamAjaxCall', '$window', '$cookies', '$sce', 'htmlMessages', '$timeout', '$uibModalInstance', function ($rootScope, $scope, $uibModal, PubSubService, MachineInfo, UpdateComponentsService, bamAjaxCall, $window, $cookies, $sce, htmlMessages, $timeout, $uibModalInstance) {

	$scope.alerts = [];
	
	$scope.types = {'SSH Key' : 'ssh-key', 'Cloud' : 'cloud', 'Password' : 'pwd'};
	// $scope.cloudTypes = {'AWS': 'AWS', 'Azure': 'Azure', 'OpenStack' : 'OpenStack', 'VMware': 'VMware', 'Rackspace':'Rackspace', 'Google':'Google'};

	$scope.title = $uibModalInstance.title;
	$scope.updateCred = $uibModalInstance.updateCred;
	$scope.buttonType = "Add";

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
		
		var getCredentials = bamAjaxCall.getCmdData('pgc/credentials/list/')
		getCredentials.then(function (data) {
			$scope.loading = false;
			$scope.credentialsList = JSON.parse(data[0]);
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
		if ($scope.data.type != 'cloud') {
			$scope.data.cloud_name = '';
			$scope.data.region = '';
		}
		var addCred = bamAjaxCall.postData('/api/pgc/credentials/create/', $scope.data)
		addCred.then(function (data) {
			debugger
			var parseData = JSON.parse(data[0]);
			if (parseData[0].state=='info') {
				$scope.alerts.push({
                    msg: parseData[0].msg,
                    type: 'success'
                });
                $rootScope.$emit('refreshCreds');
                $uibModalInstance.dismiss('cancel');
			}else{
				$scope.alerts.push({
                    msg: data,
                    type: 'error'
                });
			}
		})
	}

	$scope.deleteCredential = function (cred_uuid) {
		var deleteCred = bamAjaxCall.postData('/api/pgc/credentials/delete/', {'cred_uuid' : cred_uuid} )
		deleteCred.then(function (data) {
			credentialsList();
		})
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