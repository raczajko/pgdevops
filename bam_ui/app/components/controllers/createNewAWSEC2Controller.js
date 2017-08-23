angular.module('bigSQL.components').controller('createNewAWSEC2Controller', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval','MachineInfo', 'pgcRestApiCall', '$uibModalInstance', '$uibModal', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, pgcRestApiCall, $uibModalInstance, $uibModal) {

    var session;
    $scope.showErrMsg = false;
    $scope.creating = false;


    $scope.loading = true;
    $scope.firstStep = true;
    $scope.secondStep = false;
    $scope.disableInsClass = true;
    $scope.days = {'Monday': 'mon', 'Tuesday': 'tue', 'Wednesday' : 'wed', 'Thursday': 'thu', 'Friday' : 'fri', 'Saturday': 'sat', 'Sunday': 'sun'};

    $scope.data = {
        'region' : '',
        'image_id' : 'ami-aa5ebdd2',
        'instance_type' : 't2.micro',
        'kernal_id' : '',
        'keyname' : '',
        'monitoring' : '',
        'ramdisk_id' : '',
        'subnet_id' : '',
        'user_data' : '',
        'additional_info' : '',
        'client_token' : '',
        'disable_api_termination' : '',
        'dryrun' : '',
        'ebs_optimized' : '',
        'shutdown_behaviour' : '',
        'private_ip_address' : '',
        'db_class': '',
        'storage_type' : 'gp2',
        'volume_size' : 8,
        'instance_count' : 1
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
    });


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

    $scope.createEC2 = function(){
        $scope.creating = true;
        $scope.showErrMsg = false;
        var data = [];
        data.push($scope.data);
        var createEC2 = pgcRestApiCall.getCmdData('create vm --region ' + $scope.data.region + ' --params \'' + JSON.stringify(data) + '\' --cloud aws' )
        createEC2.then(function (data) {
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