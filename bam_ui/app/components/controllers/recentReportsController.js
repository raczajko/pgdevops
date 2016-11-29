angular.module('bigSQL.components').controller('recentReportsController', ['$scope','$rootScope', '$uibModalInstance', 'PubSubService', 'bamAjaxCall', '$sce', '$http', '$window', function ($scope, $rootScope, $uibModalInstance, PubSubService, bamAjaxCall, $sce, $http, $window) {

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

    $scope.removeFiles = function (files, selectAll) {
        var deleteFiles = [];
        if(selectAll){
            for (var i = files.length - 1; i >= 0; i--) {
                deleteFiles.push(files[i].file);
            }
        }else{
            for (var i = files.length - 1; i >= 0; i--) {
                if(files[i].selected){
                    deleteFiles.push(files[i].file);
                }
            }            
        }
        var removeFiles = $http.post($window.location.origin + '/api/remove_reports/profiler', deleteFiles);
        removeFiles.then(function (data) {
            if(data.data.error == 0){
                $uibModalInstance.dismiss('cancel');
            }
        });   
    }

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