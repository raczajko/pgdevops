angular.module('bigSQL.components').controller('addHostController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$uibModal', 'bamAjaxCall', 'htmlMessages', function ($scope, $uibModalInstance, PubSubService, $rootScope, $uibModal, bamAjaxCall, htmlMessages) {

    var session;
	var sessPromise = PubSubService.getSession();
	var subscriptions = [];
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
	$scope.root_pgc_path="";

    $scope.create_btn = "Create";
    $scope.sudo_password = {text: ''};
	if($scope.editHost){
		$scope.type = 'Edit';
		$scope.create_btn = "Update";
		$scope.hostName = $scope.editHost.host;
		$scope.pgcDir = $scope.editHost.pgc_home;
		$scope.userName = $scope.editHost.user;
		$scope.connectionName = $scope.editHost.name;
	}

	$scope.firstPhase = true;
	$scope.secondPhase = false;

	$scope.refreshHostManager = function (argument) {
		$rootScope.$emit('addedHost');
	}

    sessPromise.then(function (sessParam) {
        session = sessParam;
        $scope.addHost = function () {
        	$scope.connectionError = false;
        	$scope.registerResponse = '';
        	if ($scope.pgcDir.indexOf('~/') > -1) {
        		$scope.pgcDir = $scope.pgcDir.split('~/')[1];
        	}
	        if(!$scope.editHost){
	        	session.call('com.bigsql.registerHost',[$scope.hostName, $scope.pgcDir, $scope.userName, $scope.connectionName, $scope.password, $scope.ssh_key, $scope.sudo_password.text]);
	    	}else{
	    		session.call('com.bigsql.registerHost',[$scope.hostName, $scope.pgcDir, $scope.userName, $scope.connectionName, $scope.password, $scope.ssh_key, $scope.sudo_password.text, $scope.editHost.host_id]);
	    	}
	    	$scope.tryToConnect = true;



	    	session.subscribe("com.bigsql.onRegisterHost", function (data) {
	    		$scope.registerResponse = data[0];
	    		
	    		var jsonData =  JSON.parse(data[0]);
	    		if(jsonData[0].state == 'completed'){
	    			$rootScope.$emit('addedHost');
	    			$scope.message = "Checking if any postgres components installed ...";
	    			var data = {
                        remotehost:$scope.connectionName,
                        rds : false
                    };
                    $rootScope.$emit('comparePGVersion', $scope.connectionName);
                    var addToMetaData = bamAjaxCall.postData('/api/add_to_metadata', data);
                        addToMetaData.then(function (argument) {
                            $rootScope.$emit('refreshPgList');
                            $uibModalInstance.dismiss('cancel');
                        });

	    			// var listData = bamAjaxCall.getCmdData('hostcmd/list/'+$scope.hostName);
	    			// listData.then(function(data) {
	    			// 	$scope.tryToConnect = false;
	    			// 	$scope.connectionStatus = false;
	    			// 	var comps = $(data).filter(function(i,n){ return n.category == 1 });
	    			// 	$scope.availablePgComps = [];
	    			// 	for (var i = comps.length - 1; i >= 0; i--) {
	    			// 		$scope.availablePgComps.push(comps[i]);
	    			// 	}
	    			// 	// $scope.availablePgComps = pgComps;
	    			// 	$scope.selectedPgComp = $scope.availablePgComps[0];
	    			// 	$scope.secondPhase = false;
    				// 	$scope.thirdPhase = true;
	    			// })
	    		}else if (jsonData[0].state == 'progress') {
	    			$scope.tryToConnect = false;
	    			$scope.connectionStatus = true;
	    			$scope.message = jsonData[0].msg;
	    		} else if(jsonData[0].state == 'error'){
	    			$scope.setupError = true
	    			$scope.connectionStatus = false;
					$scope.installingStatus = false;
	    			$scope.tryToConnect = false;
	    			$scope.message = jsonData[0].msg;
	    		}
	    		$scope.$apply();
	        }).then(function (subscription) {
	            subscriptions.push(subscription);
	        });
	    }
    });

    $scope.next = function (argument) {
    $scope.auth_err="";
    $scope.not_sudoer="";
    $scope.sudo_password.text="";
    	if($scope.firstPhase){
    		var data = {
             hostname:$scope.hostName,
             username:$scope.userName
            };
            if ($scope.password){
             data.password=$scope.password;
            }

            if ($scope.ssh_key){
             data.ssh_key=$scope.ssh_key;
            }

            if ($scope.password && $scope.ssh_key) {
            	var msg = htmlMessages.getMessage('pwd-or-ssh-msg');
            	$scope.alerts.push({
	                msg : msg,
	                type : 'danger'
	            });
            }else{
            	$scope.tryToConnect = true;
    			$scope.connectionError = false;
            	var checkUser = bamAjaxCall.getCmdData('checkUser', data);
	    		checkUser.then(function (argument) {
	    			var jsonData = JSON.parse(argument)[0];
	    			if (jsonData.state == 'success') {
	    				$scope.isSudo =  jsonData.isSudo;
	    				$scope.pgcDir = jsonData.pgc_path;
	    				$scope.pgcVersion = jsonData.pgc_version;
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
    	}else if($scope.secondPhase){
    		$scope.secondPhase = false;
    		$scope.thirdPhase = true;
    	}else if($scope.thirdPhase){
    			$scope.installingStatus = true;
    			$scope.thirdPhase = false;
    			var event_url =  'install/' + $scope.selectedPgComp.component + '/' + $scope.hostName ;
	            var eventData = bamAjaxCall.getCmdData(event_url);
	            eventData.then(function(data) {
	            	$scope.installingStatus = false;
	                $uibModalInstance.dismiss('cancel');
			        var modalInstance = $uibModal.open({
			            templateUrl: '../app/components/partials/pgInitialize.html',
			            controller: 'pgInitializeController',
			        });
			        modalInstance.component = $scope.selectedPgComp.component;
			        modalInstance.dataDir = $scope.pgcDir + '/data/' + $scope.selectedPgComp.component;
			        modalInstance.autoStartButton = false;
			        modalInstance.host = $scope.hostName;
			        modalInstance.userName = $scope.userName;
			        modalInstance.password = $scope.password;
	            });
    	}
    }

    $scope.verify = function (argument) {
    $scope.root_pgc_path="";
    $scope.not_sudoer="";
    $scope.auth_err="";
    		var data = {
             hostname:$scope.hostName,
             username:$scope.userName
            };
            if ($scope.password){
             data.password=$scope.password;
            }

            if ($scope.ssh_key){
             data.ssh_key=$scope.ssh_key;
            }

            if($scope.sudo_password.text){
                data.sudo_pwd = $scope.sudo_password.text;
            }

            if ($scope.password && $scope.ssh_key) {
            	var msg = htmlMessages.getMessage('pwd-or-ssh-msg');
            	$scope.alerts.push({
	                msg : msg,
	                type : 'danger'
	            });
            }else{
            	$scope.tryToConnect = true;
    			$scope.connectionError = false;
            	var checkUser = bamAjaxCall.getCmdData('checkUser', data);
	    		checkUser.then(function (argument) {
	    			var jsonData = JSON.parse(argument)[0];
	    			if (jsonData.state == 'success') {
	    				$scope.isSudo =  jsonData.isSudo;
	    				$scope.pgcDir = jsonData.pgc_path;
	    				$scope.pgcVersion = jsonData.pgc_version;
	    				$scope.root_pgc_path=jsonData.root_pgc_path;
	    				$scope.auth_err=jsonData.auth_err;
	    				$scope.not_sudoer=jsonData.not_sudoer
	    				if($scope.auth_err){
	    				    $scope.sudo_password.text="";
	    				    $scope.sudo_password_auth_err="Authentication Failed.";
	    				}
	    				if($scope.not_sudoer){
	    				    $scope.sudo_password.text="";
	    				}
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

    }

    $scope.back = function (argument) {
    	if($scope.secondPhase){
    		$scope.secondPhase = false;
    		$scope.firstPhase = true;
    		$scope.setupError = false;
    	}else if($scope.thirdPhase){
    		$scope.thirdPhase = false;
    		$scope.secondPhase = true;
    	}
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