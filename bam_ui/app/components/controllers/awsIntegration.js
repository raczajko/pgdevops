angular.module('bigSQL.components').controller('awsIntegrationController', ['$scope', 'PubSubService', '$state','$interval','$location', '$window', '$rootScope', 'bamAjaxCall', '$cookies', '$uibModal', '$timeout', function ($scope, PubSubService, $state, $interval, $location, $window, $rootScope, bamAjaxCall, $cookies, $uibModal, $timeout) {

	$scope.discoverRds =  function (settingName, disp_name) {
	
		var modalInstance = $uibModal.open({
	        templateUrl: '../app/components/partials/rdsModal.html',
	        controller: 'rdsModalController',
	        keyboard  : false,
	        backdrop  : 'static',
	        windowClass : 'rds-modal',
	        size : 'lg'
	    });
	    modalInstance.lab = settingName;
	    modalInstance.disp_name = disp_name;
	}


	$scope.createNewRds = function(){
        var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/createNewRds.html',
                controller: 'createNewRdsController',
                keyboard  : false,
                windowClass : 'rds-modal',
                backdrop  : 'static',
            });
    }

}])