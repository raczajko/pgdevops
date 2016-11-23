angular.module('bigSQL.components').controller('recentReportsController', ['$scope','$rootScope', '$uibModalInstance', 'PubSubService', 'bamAjaxCall', '$sce', function ($scope, $rootScope, $uibModalInstance, PubSubService, bamAjaxCall, $sce) {

	var session;

    $scope.showResult = false;
    $scope.showStatus =  true;
    $scope.autoSelect = false;
    $scope.logAction = false;
    $scope.showError = false;
    $scope.logFile = 'pgbadger-%Y%m%d_%H.log';
    var subscriptions = [];
    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;

        var reportsType = $scope.reportsType;
        var infoData = bamAjaxCall.getCmdData('getrecentreports/' + reportsType);
        infoData.then(function (data) {
            var files_list = data.data;
            if(files_list.length == 0){
                $scope.showError = true;
            }else{
                $scope.files_list=files_list;                
            }
        });



    });

    $scope.reportsType = $uibModalInstance.reportsType;


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });


    
}]);