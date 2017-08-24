angular.module('bigSQL.components').controller('createNewRdsController', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval','MachineInfo', 'pgcRestApiCall', '$uibModalInstance', '$uibModal', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, pgcRestApiCall, $uibModalInstance, $uibModal) {

    var session;
    $scope.showErrMsg = false;
    $scope.creating = false;


    $scope.loading = true;
    $scope.firstStep = true;
    $scope.secondStep = false;
    $scope.disableInsClass = true;
    $scope.days = {'Monday': 'mon', 'Tuesday': 'tue', 'Wednesday' : 'wed', 'Thursday': 'thu', 'Friday' : 'fri', 'Saturday': 'sat', 'Sunday': 'sun'};

    $scope.data = {
        'engine' : 'postgres',
        'allocated_storage' : 5,
        'port' : 5432,
        'public_accessible' : false,
        'copy_tags' : false,
        'storage_type' : 'gp2',
        'multi_az' : false,
        'vpcGroup' : 'default',
        'backup_retention_period' : 7,
        'enableMon' : false,
        'version_upgrade' : false,
        'storage_encrypted' : false,
        'monitoring_interval' : 60,
        'monitoring_role' : 'default',
        'mainWindow' : 'no',
        'backupWindow' : 'no',
        'mainWindowDay' : 'mon',
        'mainWindowHours': '00',
        'mainWindowMins' : '00',
        'mainWindowDuration': '00',
        'backupWindowHours' : '00',
        'backupWindowMins' : '00',
        'backupWindowDuration' : '00',
        'monitor_arn' : 'Default'
    };


    var regions = pgcRestApiCall.getCmdData('metalist aws-regions');
    regions.then(function(data){
        $scope.loading = false;
        $scope.regions = data;
        $scope.data.region = $scope.regions[0].region;
    });

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
        session.subscribe("com.bigsql.onCreateInstance", function(data){
          $scope.creating = false;
          var data = JSON.parse(data);
          if(data[0].state == 'error'){
            $scope.showErrMsg = true;
            $scope.errMsg = data[0].msg;
          }else{
            $rootScope.$emit("RdsCreated", data[0].msg);
            $uibModalInstance.dismiss('cancel');
          }
          $scope.$apply();
        })

        session.subscribe("com.bigsql.onRdsMetaList", function (data) {
            $scope.loading = false;
            var response = JSON.parse(data[0]);
            if($scope.secondStep && !$scope.data.engine_version){
                $scope.dbEngVersions = response;
                $scope.data.engine_version = $scope.dbEngVersions[0].EngineVersion;
                $scope.versionChange();
            }else if($scope.secondStep && $scope.data.engine_version){
                $scope.types = response;
                $scope.data.db_class = $scope.types[0].DBInstanceClass;
                $scope.disableInsClass = false;
            }else if($scope.thirdStep){
                $scope.networkSec = response;
                $scope.vpc = { select : $scope.networkSec[0].vpc }
                $scope.vpcChange();
            }
            $scope.$apply();
        });
    });

    $scope.versionChange = function(argument){
        $scope.disableInsClass = true;
        $scope.data.db_class = '';
        $scope.dbGroups = [];
        $scope.optionGroups = '';
        $scope.data.db_parameter_group = [];
        $scope.data.optionGroup = '';
        $scope.types = '';
        $scope.data.db_class = [];
        session.call('com.bigsql.rdsMetaList', ['instance-class', '' , $scope.data.region, $scope.data.engine_version, "aws", "db"])
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

    $scope.createRDS = function(){
        $scope.data.maintanance_window = '';
        $scope.data.backup_window = '';
        if(!$scope.data.enableMon){
            $scope.data.monitoring_interval = 0;
            $scope.data.monitor_arn = '';
        }
        if($scope.data.backupWindow=='yes'){
            var backTotalTime = parseInt($scope.data.backupWindowHours) + parseInt($scope.data.backupWindowDuration);
            if(backTotalTime<10){backTotalTime="0"+backTotalTime};
            $scope.data.backup_window = $scope.data.backupWindowHours + ':' + $scope.data.backupWindowMins + '-' + backTotalTime + ':' + $scope.data.backupWindowMins;
        }
        if($scope.data.mainWindow=='yes'){
            var mainTotalTime = parseInt($scope.data.mainWindowHours) + parseInt($scope.data.mainWindowDuration);
            if(mainTotalTime<10){mainTotalTime="0"+mainTotalTime};
            $scope.data.maintanance_window = $scope.data.mainWindowDay + ':' + $scope.data.mainWindowHours + ':' + $scope.data.mainWindowMins + '-' + $scope.data.mainWindowDay + ':' + mainTotalTime + ':' + $scope.data.mainWindowMins;
        }
        $scope.creating = true;
        $scope.showErrMsg = false;
        var data = [];
        data.push($scope.data);
        session.call('com.bigsql.createInstance', ['db', 'aws', data])
    }

    $scope.next = function(region){
        $scope.loading = true;
        if($scope.firstStep){
            session.call('com.bigsql.rdsMetaList', ['rds-versions', '', $scope.data.region, '', "aws", "db"])
            $scope.firstStep = false;
            $scope.secondStep = true;
        }else{
            session.call('com.bigsql.rdsMetaList', ['vpc-list', '', $scope.data.region, '', "aws", "db"])
            $scope.secondStep = false;
            $scope.thirdStep = true;
        }
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