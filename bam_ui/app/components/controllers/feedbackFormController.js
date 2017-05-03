angular.module('bigSQL.components').controller('feedbackFormController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$uibModal', 'bamAjaxCall', function ($scope, $uibModalInstance, PubSubService, $rootScope, $uibModal, bamAjaxCall) {

	$scope.lab = $uibModalInstance.lab;
	$scope.subject = $uibModalInstance.disp_name;  

	var userInfoData = bamAjaxCall.getCmdData('userinfo');
        userInfoData.then(function(data) {
        	$scope.email = data.email;
        }); 

    $scope.sendEmail = function (argument) {
    	$uibModalInstance.dismiss('cancel');
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);