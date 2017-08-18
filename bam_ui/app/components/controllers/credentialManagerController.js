angular.module('bigSQL.components').controller('credentialManagerController', ['$rootScope', '$scope', '$uibModal','PubSubService', 'MachineInfo', 'UpdateComponentsService', 'bamAjaxCall', '$window', '$cookies', '$sce', 'htmlMessages', '$timeout', 'pgcRestApiCall', function ($rootScope, $scope, $uibModal, PubSubService, MachineInfo, UpdateComponentsService, bamAjaxCall, $window, $cookies, $sce, htmlMessages, $timeout, pgcRestApiCall) {

	$scope.alerts = [];
	$scope.loading = true;
	$scope.types = {'SSH Key' : 'ssh-key', 'Cloud' : 'cloud', 'Password' : 'pwd'};
	// $scope.cloudTypes = {'AWS': 'AWS', 'Azure': 'Azure'};
	
	$scope.data = {
		'type' : '',
		'credential_name' : '',
		'user' : '',
		'password' : '',
		'ssh_key' : '',
		'cloud_key' : '',
		'ssh_sudo_pwd' : '',
		'cloud_name' : 'AWS',
		'cloud_secret' : '',
		'region' : ''
	}


	var credentialsList = function(argument) {
		$scope.loading = true;
		$scope.isAllSelected = false;
		var getCredentials = bamAjaxCall.getCmdData('pgc/credentials/')
		getCredentials.then(function (data) {
			$scope.loading = false;
			$scope.credentialsList = data;
			for (var i = $scope.credentialsList.length - 1; i >= 0; i--) {
				$scope.credentialsList[i].selected = false;
			}
			if ($scope.credentialsList.length == 0) {
				$scope.noCredMsg = $sce.trustAsHtml(htmlMessages.getMessage('no-credentials'));
			}
		})

	}

	var regions = pgcRestApiCall.getCmdData('metalist aws-regions');
    regions.then(function(data){
        $scope.loading = false;
        $scope.regions = data;
        $scope.data.region = $scope.regions[0].region;
    });

	$rootScope.$on('refreshCreds', function (argument) {
		credentialsList();
	});

	credentialsList();

	$scope.addCredential = function () {
		var addCred = bamAjaxCall.postData('/api/pgc/credentials/', $scope.data)
		addCred.then(function (data) {
			var parseData = data;
			if (parseData[0].state=='info') {
				$scope.alerts.push({
                    msg: data,
                    type: 'success'
                });
			}else{
				$scope.alerts.push({
                    msg: data,
                    type: 'error'
                });
			}
		})
	}

	$scope.toggleAll = function() { 
        if($scope.isAllSelected){
            $scope.isAllSelected = false;
        }else{
            $scope.isAllSelected = true;
        }
        angular.forEach($scope.credentialsList, function(itm){ itm.selected = $scope.isAllSelected; });
    }

    $scope.optionToggled = function(name){
    	
    }

    $rootScope.$on('deleteResponse', function(argument, data) {
    	if (data.state == 'error') {
    		$scope.alerts.push({
	    		msg : data.msg,
	    		type : 'error'
	    	})
    	}else{
    		$scope.alerts.push({
	    		msg : data.msg,
	    		type : 'warning'
	    	})
    	}	
    })

	$rootScope.$on('addResponse', function(argument, data) {
    	if (data.state == 'error') {
    		$scope.alerts.push({
	    		msg : data.msg,
	    		type : 'error'
	    	})
    	}else{
    		$scope.alerts.push({
	    		msg : data.msg,
	    		type : 'success'
	    	})
    	}	
    })    

    $scope.checkOptions = function (argument) {
    	$scope.showUpdate = false;
    	$scope.showDeleteReport = false;
    	var selectedCreds = [];
    	$scope.showUsage = false;
    	for (var i = $scope.credentialsList.length - 1; i >= 0; i--) {
			if($scope.credentialsList[i].selected){
				selectedCreds.push($scope.credentialsList[i]);
			}
			if ($scope.credentialsList[i].selected && $scope.credentialsList[i].hosts.length>0) {
				$scope.showUsage = true;
			}
		}
		if (selectedCreds.length==0) {
			$scope.showDeleteReport = false;
			$scope.showUpdate = false;
		}else if(selectedCreds.length == 1){
			$scope.showUpdate = true;
			$scope.showDeleteReport = true;
		}else{
			$scope.showDeleteReport = true;
		}
    }

	$scope.deleteCredential = function (cred_uuid, disabled) {
		if (!disabled) {
			var selectedCreds = [];
			for (var i = $scope.credentialsList.length - 1; i >= 0; i--) {
				if($scope.credentialsList[i].selected){
					selectedCreds.push($scope.credentialsList[i]);
				}
			}
			if (selectedCreds.length>0) {
				var cred_uuids = [];
				for (var i = $scope.credentialsList.length - 1; i >= 0; i--) {
					if($scope.credentialsList[i].selected){
						cred_uuids.push($scope.credentialsList[i].cred_uuid);
					}
				}
				var modalInstance = $uibModal.open({
		            templateUrl: '../app/components/partials/confirmDeletionModal.html',
		            controller: 'confirmDeletionModalController',
		        });
		        modalInstance.deleteFiles = cred_uuids;
		        modalInstance.comp = 'credentials';
		        modalInstance.deleteCred = true;
			}else{
				$scope.alerts.push({
					msg: htmlMessages.getMessage('select-one-cred'),
	                type: 'warning'
	            });
			}
		}
	}

	$scope.addCred = function (title) {
		var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/addCredentialModal.html',
                controller: 'addCredentialModalController',
                keyboard  : false,
                backdrop  : 'static',
            });
		modalInstance.title = title;
	}

	$scope.updateCred = function (title, type) {
		var updateCreds = [];
		for (var i = $scope.credentialsList.length - 1; i >= 0; i--) {
			if($scope.credentialsList[i].selected){
				updateCreds.push($scope.credentialsList[i]);
			}
		}
		if (updateCreds.length == 1) {
			var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/addCredentialModal.html',
                controller: 'addCredentialModalController',
                keyboard  : false,
                backdrop  : 'static',
            });
			modalInstance.title = title;
			modalInstance.updateCred = updateCreds[0];
			modalInstance.type = type;
		}
	}

	$scope.openUsage = function (name, host_list, cred_type, disabled) {
			var selectedCreds = [];
			for (var i = $scope.credentialsList.length - 1; i >= 0; i--) {
				if($scope.credentialsList[i].selected){
					selectedCreds.push($scope.credentialsList[i]);
				}
			}
			if (name || selectedCreds.length>0) {
				var modalInstance = $uibModal.open({
	                templateUrl: '../app/components/partials/credentialUsage.html',
	                controller: 'credentialUsageController',
	                keyboard  : false,
	                backdrop  : 'static',
	            });
				modalInstance.name = name;
				modalInstance.host_list = host_list;
				modalInstance.cred_type = cred_type;
				modalInstance.selectedCreds = selectedCreds;
			}else{
				$scope.alerts.push({
					msg: htmlMessages.getMessage('select-one-cred'),
	                type: 'warning'
	            });
			}
	}

	$scope.closeAlert = function (index) {
	    $scope.alerts.splice(index, 1);
	};

}]);