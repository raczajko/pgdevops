angular.module('bigSQL.components').controller('feedbackFormController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$uibModal', 'bamAjaxCall', '$http', function ($scope, $uibModalInstance, PubSubService, $rootScope, $uibModal, bamAjaxCall, $http) {

	$scope.lab = $uibModalInstance.lab;
	$scope.to_email = 'bigsql-feedback@openscg.com';
	if($uibModalInstance.disp_name){
		$scope.subject = $uibModalInstance.disp_name + ' Lab';
	}

	var userInfoData = bamAjaxCall.getCmdData('userinfo');
        userInfoData.then(function(data) {
        	$scope.from_email = data.email;
        }); 

    $scope.sendEmail = function (argument) {

    	var args = {
    		'text' : $scope.feedback,
    		'subject' : $scope.subject,
    		'from_email' : $scope.from_email,
    		'to' : $scope.to_email
    	}
    	
    	var sendFeedback = $http.post('https://bigsql.org/email-feedback/',args)
    	sendFeedback.then(function (argument) {	
    	})
    	$uibModalInstance.dismiss('cancel');
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);