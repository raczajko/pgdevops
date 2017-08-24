angular.module('bigSQL.components').controller('createNewAzureVMController', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval','MachineInfo', 'pgcRestApiCall', '$uibModalInstance', '$uibModal', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, pgcRestApiCall, $uibModalInstance, $uibModal) {

    var session;
    $scope.showErrMsg = false;
    $scope.creating = false;


    $scope.loading = true;
    $scope.firstStep = true;
    $scope.secondStep = false;
    $scope.disableInsClass = true;
    $scope.days = {'Monday': 'mon', 'Tuesday': 'tue', 'Wednesday' : 'wed', 'Thursday': 'thu', 'Friday' : 'fri', 'Saturday': 'sat', 'Sunday': 'sun'};

    $scope.data = {
        'region' : 'southcentralus',
        'group_name' : 'Default-Storage-SouthCentralUS',
        'vm_size' : 'Basic_A0',
        'computer_name' : '',
        'publisher':'OpenLogic',
        'offer' : 'CentOS',
        'sku':'6.5',
        'version':'latest',
        'admin_username':'bigsql',
        'password':'B!gSQL3210123'
    };
    $scope.loading = false;
    /*var regions = pgcRestApiCall.getCmdData('metalist azure-regions');
    regions.then(function(data){
        $scope.loading = false;
        $scope.regions = data;
        $scope.data.region = $scope.regions[0].region;
    });*/

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
    });
    var skuMapping = {
        'CentOS6.5' : {
            'offer': 'CentOS',
            'publisher':'OpenLogic',
            'sku':'6.5',
            'version':'latest'
        },
        'UbuntuServer' : {
            'offer': 'UbuntuServer',
            'publisher':'Canonical',
            'sku':'16.04.0-LTS',
            'version':'latest'
        }
    }
    $scope.publisherChange = function(os){
        var skuTemp = skuMapping[os];
        $scope.data['offer'] = skuTemp['offer'];
        $scope.data['publisher'] = skuTemp['publisher'];
        $scope.data['sku'] = skuTemp['sku'];
        $scope.data['version'] = skuTemp['version'];
    }
    $scope.regionChange = function (region) {
        session.call('com.bigsql.rdsMetaList', ['instance-class', '', $scope.data.region, '9.6.3']);  
        session.call('com.bigsql.rdsMetaList', ['vpc-list', '', $scope.data.region, '']); 
    }

    $scope.versionChange = function(argument){
        $scope.disableInsClass = true;
        $scope.data.db_class = '';
        $scope.dbGroups = [];
        $scope.optionGroups = '';
        $scope.data.db_parameter_group = [];
        $scope.data.optionGroup = '';
        $scope.types = '';
        $scope.data.db_class = [];
        session.call('com.bigsql.rdsMetaList', ['instance-class', '' , $scope.data.region, $scope.data.engine_version])
        for(var i = 0; i < $scope.dbEngVersions.length; ++i){
            if($scope.dbEngVersions[i].EngineVersion == $scope.data.engine_version){
                $scope.dbGroups = $scope.dbEngVersions[i].DBParameterGroups;
                $scope.optionGroups = $scope.dbEngVersions[i].OptionGroups;
                $scope.data.db_parameter_group = $scope.dbGroups[0].DBParameterGroupName;
                $scope.data.optionGroup = $scope.optionGroups[0].OptionGroupName;
            }
        }
    }

    $scope.vpcChange = function(argument){
        for (var i = 0; i < $scope.networkSec.length; ++i) {
            if($scope.networkSec[i].vpc == $scope.vpc.select){
                $scope.data.subnet_group = $scope.networkSec[i].subnet_group;
                $scope.availableZones = $scope.networkSec[i].zones;
                if($scope.availableZones.length > 0){
                    $scope.data.availability_zone = $scope.availableZones[0].name;
                }
                for (var j = 0; j < $scope.availableZones.length; ++j) {

                }
            };
        }
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.createVM = function(){
        $scope.creating = true;
        $scope.showErrMsg = false;
        var data = [];
        data.push($scope.data);
        var createVMResponse = pgcRestApiCall.getCmdData('create vm --params \'' + JSON.stringify(data) + '\' --cloud azure' )
        createVMResponse.then(function (data) {
            $scope.creating = false;
            if(data[0].state == 'error'){
                $scope.showErrMsg = true;
                $scope.errMsg = data[0].msg;
              }else{
                $rootScope.$emit("RdsCreated", data[0].msg);
                $uibModalInstance.dismiss('cancel');
              }
              $scope.$apply();
        })
    }

    $scope.next = function(region){
        $scope.firstStep = false;
        $scope.secondStep = true;
    }

    $scope.previous = function(data){
        if($scope.secondStep){
            $scope.secondStep = false;
            $scope.firstStep = true;
            $scope.dbEngVersions = [];
            $scope.data.engine_version = '';
        }else if($scope.thirdStep){
            $scope.thirdStep = false;
            $scope.secondStep = true;
            $scope.showErrMsg = false;
        }
    }


}]);