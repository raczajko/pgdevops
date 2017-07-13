angular.module('bigSQL.components').controller('createNewRdsController', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval','MachineInfo', 'bamAjaxCall', '$uibModalInstance', '$uibModal', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, bamAjaxCall, $uibModalInstance, $uibModal) {

    var session;
    $scope.showErrMsg = false;
    $scope.creating = false;


    $scope.loading = true;
    $scope.firstStep = true;
    $scope.secondStep = false;

    $scope.data = {
        'allocated_storage' : 5,
        'port' : 5432,
        'publicly' : 'no',
        'storage_type' : 'General Purpose (SSD)',
        'MultiAZ' : 'no',
        'vpcGroup' : 'default',
        'backup_retention' : '7',
        'enableMon' : 'no',
        'autoUpgrade' : 'yes',
        'storage_encrypted' : 'no',
        'granularity' : '60',
        'monitoring_role' : 'default'
    };

    var regions = bamAjaxCall.getCmdData('metalist/aws-regions');
    regions.then(function(data){
        $scope.loading = false;
        $scope.regions = data;
        $scope.data.region = $scope.regions[0].region;
    });

    var types = bamAjaxCall.getCmdData('metalist/aws-rds')
    types.then(function(data){
        $scope.types = data;
        $scope.data.db_class = $scope.types[0].instance;
    });


    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
        session.subscribe("com.bigsql.onCreateRds", function(data){
            debugger
          $scope.creating = false;
          var data = JSON.parse(data);
          if(data[0].state == 'error'){
            $scope.showErrMsg = true;
            $scope.errMsg = data[0].msg;
          }else{
            $uibModalInstance.dismiss('cancel');
          }
        })

        session.subscribe("com.bigsql.onRdsMetaList", function (data) {
            $scope.loading = false;
            var response = JSON.parse(data[0]);
            if($scope.secondStep){
                $scope.dbEngVersions = response;
                $scope.data.EngineVersion = $scope.dbEngVersions[0].EngineVersion;
                $scope.versionChange();
            }else if($scope.thirdStep){
                $scope.networkSec = JSON.parse(data[0])
                $scope.vpc = { select : $scope.networkSec[0].vpc }
                $scope.vpcChange();
            }
        });
    });

    $scope.versionChange = function(argument){
        for(var i = 0; i < $scope.dbEngVersions.length; ++i){
            if($scope.dbEngVersions[i].EngineVersion == $scope.data.EngineVersion){
                $scope.dbGroups = $scope.dbEngVersions[i].DBParameterGroups;
                $scope.optionGroups = $scope.dbEngVersions[i].OptionGroups;
                $scope.data.dbGroup = $scope.dbGroups[0].DBParameterGroupName;
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
                    $scope.data.zone = $scope.availableZones[0].name;
                }
                for (var j = 0; j < $scope.availableZones.length; ++j) {

                }
            };
        }
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.createRDS = function(){
        $scope.creating = true;
        $scope.showErrMsg = false;
        var data = [];
        data.push($scope.data);
        session.call('com.bigsql.createRds', ['db', $scope.data.region, data])
    }

    $scope.next = function(region){
        $scope.loading = true;
        if($scope.firstStep){
            session.call('com.bigsql.rdsMetaList', ['rds-versions', '', $scope.data.region])
            $scope.firstStep = false;
            $scope.secondStep = true;
        }else{
            session.call('com.bigsql.rdsMetaList', ['vpc-list', '', $scope.data.region])
            $scope.secondStep = false;
            $scope.thirdStep = true;
        }
    }

    $scope.previous = function(data){
        if($scope.secondStep){
            $scope.secondStep = false;
            $scope.firstStep = true;
        }else if($scope.thirdStep){
            $scope.thirdStep = false;
            $scope.secondStep = true;
        }
    }


}]);