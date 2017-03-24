angular.module('bigSQL.components').controller('recentReportsController', ['$scope','$rootScope', '$uibModalInstance', 'PubSubService', 'bamAjaxCall', '$sce', '$http', '$window', '$uibModal', function ($scope, $rootScope, $uibModalInstance, PubSubService, bamAjaxCall, $sce, $http, $window, $uibModal) {

    $scope.showResult = false;
    $scope.showStatus =  true;
    $scope.autoSelect = false;
    $scope.logAction = false;
    $scope.showError = false;
    $scope.comp = $uibModalInstance.comp;
    $scope.reportsType = $uibModalInstance.reportsType;

    function getReports(argument) {
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
    }

    getReports();

    $rootScope.$on('refreshReports', function (argument) {
        $uibModalInstance.dismiss('cancel');
        // getReports();
    })

    $scope.toggleAll = function() { 
        if($scope.isAllSelected){
            $scope.isAllSelected = false;
        }else{
            $scope.isAllSelected = true;
        }
        angular.forEach($scope.files_list, function(itm){ itm.selected = $scope.isAllSelected; });
    }
      
    $scope.optionToggled = function(){
        $scope.checked = false;
        angular.forEach($scope.files_list, function (item) {
            if(item.selected){
                $scope.checked = true;
            }
        });
    }

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
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/confirmDeletionModal.html',
            controller: 'confirmDeletionModalController',
        });
        modalInstance.deleteFiles = deleteFiles;
        modalInstance.comp = $scope.comp;
    }

    $scope.cancel = function () {
        $rootScope.$emit('refreshPage');
        $uibModalInstance.dismiss('cancel');
    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        
    });


    
}]);