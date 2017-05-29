angular.module('bigSQL.components').controller('rdsModalController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$http', '$window', '$interval', '$rootScope', 'bamAjaxCall', 'htmlMessages', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $http, $window, $interval, $rootScope, bamAjaxCall, htmlMessages) {

    $scope.loadingSpinner = true;
    $scope.lab = $uibModalInstance.lab;
    $scope.disp_name = $uibModalInstance.disp_name;
    $scope.availList = [];
    var addList = [];
    $scope.addToMetadata = false;
    $scope.discoverMsg = htmlMessages.getMessage('discover-rds');

    var rdslist = bamAjaxCall.getCmdData('rdslist');
    rdslist.then(function (data) {
        $scope.loadingSpinner = false;
        if (data[0].state=="error") {
            $scope.errMsg = data[0].msg;
            $rootScope.$emit('disableLab', $scope.lab, 'off')
        }else{
            $scope.rdsList = data;
            for (var i = $scope.rdsList.length - 1; i >= 0; i--) {
                if($scope.rdsList[i].status == 'available'){
                    $scope.availList.push($scope.rdsList[i]);
                }
            }
            if ($scope.availList.length == 0) {
                $scope.noRDS = true;
                $scope.noRDSMsg = htmlMessages.getMessage('no-rds');
            }
        }
    });

    $scope.createConnPgadmin = function(index){
        $scope.addToMetadata = true;
        $scope.addToMetadataMsg = htmlMessages.getMessage('add-to-pgadmin');
        for (var i = $scope.availList.length - 1; i >= 0; i--) {
            if($scope.availList[i].selected){
                var args = {};
                args['db'] = $scope.availList[i].dbname;
                args['port'] = $scope.availList[i].port;
                args['user'] = $scope.availList[i].master_user;
                args['host'] = $scope.availList[i].address;
                args['component'] = $scope.availList[i].instance;
                args['project'] = 'aws-rds';
                args['rds'] = true;
                args['region'] = $scope.availList[i].region;
                var addToMetaData = $http.post($window.location.origin + '/api/add_to_metadata', args);
            }
        }
        $rootScope.$emit('refreshUpdateDate');
        $uibModalInstance.dismiss('cancel');
    };

    $scope.toggleAll = function() { 
        if($scope.isAllSelected){
            $scope.isAllSelected = false;
        }else{
            $scope.isAllSelected = true;
        }
        angular.forEach($scope.availList, function(itm){ itm.selected = $scope.isAllSelected; });
    }

    $scope.optionToggled = function(){
        $scope.checked = false;
        angular.forEach($scope.availList, function (item) {
            if(item.selected){
                $scope.checked = true;
            }
        });
    }


    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.cancel = function () {
        $rootScope.$emit('refreshUpdateDate');
        $uibModalInstance.dismiss('cancel');
    };

}]);
