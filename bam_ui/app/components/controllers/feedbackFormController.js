angular.module('bigSQL.components').controller('feedbackFormController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$uibModal', 'bamAjaxCall', function ($scope, $uibModalInstance, PubSubService, $rootScope, $uibModal, bamAjaxCall) {

	$scope.lab = $uibModalInstance.lab;
	$scope.disp_name = $uibModalInstance.disp_name;  

	var userInfoData = bamAjaxCall.getCmdData('userinfo');
        userInfoData.then(function(data) {
        	$scope.email = data.email;
        }); 

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);