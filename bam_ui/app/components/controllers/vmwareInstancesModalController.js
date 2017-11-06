angular.module('bigSQL.components').controller('vmwareInstancesModalController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$http', '$window', '$interval', '$rootScope', 'pgcRestApiCall', 'bamAjaxCall', 'htmlMessages', '$uibModal', '$cookies', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $http, $window, $interval, $rootScope, pgcRestApiCall, bamAjaxCall, htmlMessages, $uibModal, $cookies) {

    $scope.loadingSpinner = true;
    $scope.lab = $uibModalInstance.lab;
    $scope.disp_name = $uibModalInstance.disp_name;
    $scope.instance = $uibModalInstance.instance;
    $scope.availList = [];
    var addList = [];
    $scope.addToMetadata = false;
    $scope.discoverMsg = htmlMessages.getMessage('loading-azure-pg');
    var session;
    $scope.region = '';
    $scope.showUseConn = false;

    var userInfoData = pgcRestApiCall.getCmdData('userinfo');
    userInfoData.then(function(data) {
        $scope.userInfo = data;
        var cmd = 'instances '+ $scope.instance +' --email '+$scope.userInfo.email + ' --cloud '+$scope.lab
        var getData = pgcRestApiCall.getCmdData(cmd);
        getData.then(function(data){
            if (data.state == 'info') {
                $scope.discoverMsg = data.message;
            }else if (data.state=="error") {
                $scope.loadingSpinner = false;
                $scope.errMsg = data.message;
                // $rootScope.$emit('disableLab', $scope.lab, 'off')
            }else if(data.state=="completed"){
                $scope.loadingSpinner = false;
                $scope.showUseConn = true;
                $scope.availList = [];
                if($scope.instance == 'vm'){
                    $scope.vmList = data.data;
                    for (var i = $scope.vmList.length - 1; i >= 0; i--) {
                        if($scope.vmList[i].private_ips.length > 0){
                            var  RegE = /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/ ;
                            if($scope.vmList[i].private_ips[0].match(RegE)) {
                                   $scope.vmList[i].private_ipv4 = $scope.vmList[i].private_ips[0];
                            }
                        }
                    }
                }
           }
        });
    });


    $scope.toggleAll = function() { 
        if($scope.isAllSelected){
            $scope.isAllSelected = false;
        }else{
            $scope.isAllSelected = true;
        }
        angular.forEach($scope.availList, function(itm){ itm.selected = $scope.isAllSelected; });
        angular.forEach($scope.vmList, function(itm){ itm.selected = $scope.isAllSelected; });
    }

    $scope.optionToggled = function(){
        $scope.checked = false;
        angular.forEach($scope.newAvailList, function (item) {
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
