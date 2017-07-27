angular.module('bigSQL.menus').component('leftMenu', {
    bindings: {},
    controller: function ($scope, PubSubService, $rootScope, bamAjaxCall) {
    	$scope.hideAwsNav = false;
    	var getLablist = bamAjaxCall.getCmdData('lablist');
    	getLablist.then(function (argument) {
    		for (var i = argument.length - 1; i >= 0; i--) {
                if (argument[i].lab == 'aws' && argument[i].enabled == 'on') {
                    $scope.hideAwsNav = true;
                }
            }
    	})
    	$rootScope.$on('hideAwsNav', function (event, value) {
    		if (value == 'on') {
    			$scope.hideAwsNav = true;
    		}else{
    			$scope.hideAwsNav = false;
    		}
    	})

    },
    templateUrl: "../app/menus/partials/leftMenu.html"
});