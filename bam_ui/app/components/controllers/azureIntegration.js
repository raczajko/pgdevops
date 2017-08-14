angular.module('bigSQL.components').controller('azureIntegrationController', ['$scope', 'PubSubService', '$state','$interval','$location', '$window', '$rootScope', 'bamAjaxCall', '$cookies', '$uibModal', '$timeout', 'htmlMessages', function ($scope, PubSubService, $state, $interval, $location, $window, $rootScope, bamAjaxCall, $cookies, $uibModal, $timeout, htmlMessages) {

	$scope.alerts = [];
	$scope.discover =  function (settingName, disp_name, instance) {

		var modalInstance = $uibModal.open({
	        templateUrl: '../app/components/partials/azureDBModal.html',
	        controller: 'azureDBModalController',
	        keyboard  : false,
	        backdrop  : 'static',
	        windowClass : 'rds-modal',
	        size : 'lg'
	    });
	    modalInstance.lab = settingName;
	    modalInstance.disp_name = disp_name;
	    modalInstance.instance = instance;
	}

	$scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

	$rootScope.$on('AzureDBCreated', function (argument, data) {
        $scope.alerts.push({
                    msg: data,
                    type: 'success'
                });
    })

    $scope.comingSoon = function (argument) {
    	$scope.alerts.push({
                    msg: htmlMessages.getMessage('coming-soon'),
                    type: 'warning'
                });
    }

	$scope.createNewAzureDb = function(){
        var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/createNewAzureDB.html',
                controller: 'createNewAzureDBController',
                keyboard  : false,
                windowClass : 'rds-modal',
                backdrop  : 'static',
            });
    }

}])