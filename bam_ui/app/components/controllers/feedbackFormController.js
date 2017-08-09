angular.module('bigSQL.components').controller('feedbackFormController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$uibModal', 'bamAjaxCall', '$http', 'htmlMessages', '$cookies', function ($scope, $uibModalInstance, PubSubService, $rootScope, $uibModal, bamAjaxCall, $http, htmlMessages, $cookies) {

	$scope.lab = $uibModalInstance.lab;
	$scope.to_email = 'bigsql-feedback@openscg.com';
	$scope.sendingEmail = false;
	$scope.showSendbtn = true;
	$scope.alerts = [];
    $scope.try_count = 1;
	if($uibModalInstance.disp_name){
		$scope.subject = $uibModalInstance.disp_name + ' Lab';
	}

	var userInfoData = bamAjaxCall.getCmdData('userinfo');
        userInfoData.then(function(data) {
        	$scope.from_email = data.email;
        }); 

    $scope.sendEmail = function (argument) {
        var auth_token = $cookies.get('auth_token');
        if(auth_token){

        }else{
            $scope.getAuthToken();
            auth_token = $cookies.get('auth_token');
        }
        var headers = {
            'authentication_token':auth_token
        }
        var config = {
            'headers':headers
        }
    	$scope.sendingEmail = true;
    	var args = {
            'text' : $scope.feedback,
            'subject' : $scope.subject,
            'from_email' : $scope.from_email,
            'to' : $scope.to_email
    	};
    	var sendFeedback = $http.post('https://www.openscg.com/bigsql/api/email/feedback/',args,config)
    	sendFeedback.then(function (argument) {
    		if (argument.status == 200) {
    		    if(argument.data.code == 401){
    		        console.log("Get new auth token");
    		        $scope.getAuthToken();
    		    }
    		    $rootScope.$emit('emailSucessMsg', htmlMessages.getMessage('email-response'), 'success');
    			$scope.showSendbtn = true;
    			$uibModalInstance.dismiss('cancel');
    		}else{
    			$scope.sendingEmail = false;
                $rootScope.$emit('emailSucessMsg', data.msg, 'danger');
    		}
    	})
    	$uibModalInstance.dismiss('cancel');
    }

    $scope.getAuthToken = function(){
        var args = {
            'email':'naveen.koppula@openscg.com',
            'password':'6442naveen'
        };
        var config = { 'headers' :{
                'Content-Type':'application/json'
            }
        }
        var authResponse = $http.post('https://www.openscg.com/bigsql/api/login/',args,config)
        authResponse.then(function (argument){
            if (argument.status == 200) {
                if(argument.data.code == 200){
                    $cookies.put('auth_token',argument.data.authentication_token);
                    $scope.sendEmail();
                }
            }
            else{
                $scope.sendingEmail = false;
                $rootScope.$emit('emailSucessMsg', data.msg, 'danger');
            }
        });
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);