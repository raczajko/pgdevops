angular.module('bigSQL.components').controller('createNewRdsController', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval','MachineInfo', 'bamAjaxCall', '$uibModalInstance', '$uibModal', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, bamAjaxCall, $uibModalInstance, $uibModal) {

    var session;
    $scope.showErrMsg = false;
    $scope.creating = false;
    var regions = bamAjaxCall.getCmdData('metalist/aws-regions');
    $scope.data = {};

    regions.then(function(data){
        $scope.regions = data;
        $scope.regionSelect = { region : $scope.regions[0].region};
    });

    var types = bamAjaxCall.getCmdData('metalist/aws-rds')
    types.then(function(data){
        $scope.types = data;
        $scope.typeSelect = {type : $scope.types[0].instance};
    });


    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
        session.subscribe("com.bigsql.onCreateRds", function(data){
          $scope.creating = false;
          var data = JSON.parse(data);
          if(data[0].state == 'error'){
            $scope.showErrMsg = true;
            $scope.errMsg = data[0].msg;
          }else{
            $uibModalInstance.dismiss('cancel');
          }
        })
    });

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.createRDS = function(){
        $scope.creating = true;
        $scope.showErrMsg = false;
        var data = [{
           "dbname": $scope.data.dbName,
           "db_class": $scope.typeSelect.type,
           "instance" : $scope.data.instance,
           "master_user": $scope.data.userName,
           "password": $scope.data.password,
           "subnet_group": $scope.data.sbGroup,
           "port": $scope.data.port,
           "storage_type": $scope.data.storageType,
           "allocated_storage": $scope.data.allocStorage
           }];
        debugger
        session.call('com.bigsql.createRds', ['db', $scope.regionSelect.region, data])
    }


}]);