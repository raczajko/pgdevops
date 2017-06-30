angular.module('bigSQL.common').factory('userInfoService', function ($window, $rootScope, $q, $interval, bamAjaxCall) {

	function getUserInfo(argument) {

		return $q(function (resolve, reject) {
			var userInfoData = bamAjaxCall.getCmdData('userinfo');
	        userInfoData.then(function(data) {
	        	resolve(data);
	        });
    	});
	}

	return {
        getUserInfo: getUserInfo
    }
});