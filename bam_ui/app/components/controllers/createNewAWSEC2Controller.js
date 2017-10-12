angular.module('bigSQL.components').controller('createNewAWSEC2Controller', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval','MachineInfo', 'pgcRestApiCall', '$uibModalInstance', '$uibModal', '$cookies', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, pgcRestApiCall, $uibModalInstance, $uibModal, $cookies) {

    var session;
    $scope.showErrMsg = false;
    $scope.creating = false;


    $scope.loading = true;
    $scope.firstStep = true;
    $scope.secondStep = false;
    $scope.disableInsClass = true;
    $scope.days = {'Monday': 'mon', 'Tuesday': 'tue', 'Wednesday' : 'wed', 'Thursday': 'thu', 'Friday' : 'fri', 'Saturday': 'sat', 'Sunday': 'sun'};
    $scope.instance = { 'name': '' };
    $scope.shutDownBehaviours = {'Stop':'stop', 'Terminate':'terminate'}

    $scope.data = {
        'region' : '',
        'image_id' : 'ami-ae7bfdb8',
        'instance_type' : 't2.micro',
        'kernel_id' : '',
        'key_name' : '',
        'monitoring' : '',
        'ram_disk_id' : '',
        'subnet_id' : '',
        'user_data' : '',
        'additional_info' : '',
        'client_token' : '',
        'disable_api_termination' : '',
        'dry_run' : '',
        'ebs_optimized' : '',
        'shutdown_behaviour' : '',
        'private_ip_address' : '',
        'storage_type' : 'gp2',
        'volume_size' : 8,
        'instance_count' : 1,
        'tags' : {}
    };


    var regions = pgcRestApiCall.getCmdData('metalist aws-regions');
    regions.then(function(data){
        $scope.loading = false;
        $scope.regions = data;
        $scope.data.region = $scope.regions[0].region;
    });

    $scope.getVpc = function (argument) {
        var vpc_subnet = pgcRestApiCall.getCmdData('metalist vpc-list --region=' + $scope.data.region + ' --type=vm --cloud=aws');
        vpc_subnet.then(function(data){
            $scope.subnets = data;
        });
    }

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
    });

    // $scope.changeSubnet = function (argument) {
    //     if ($scope.data.network_name) {
    //         for (var i = $scope.subnets.length - 1; i >= 0; i--) {
    //            if($scope.subnets[i].vpc == $scope.data.network_name){
    //             $scope.data.subnet_name = $scope.subnets[i].subnet_group;
    //            }
    //         }
    //     }else{
    //         $scope.data.subnet_name = '';
    //     }
    // }


    $scope.regionChange = function (region) {
        session.call('com.bigsql.rdsMetaList', ['instance-class', '', $scope.data.region, '9.6.3']);  
        session.call('com.bigsql.rdsMetaList', ['vpc-list', '', $scope.data.region, '']); 
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
        $scope.data.tags['Name'] = $scope.instance.name;
        $scope.creating = true;
        $scope.showErrMsg = false;
        var data = [];
        $cookies.put('lastSelRegion', $scope.data.region);
        data.push($scope.data);
        var requestData = {
            'cloud' : 'aws',
            'type' : 'vm',
            'params' : data
        }
        var createEC2 = pgcRestApiCall.postData('create',requestData)
        createEC2.then(function (data) {
            $scope.creating = false;
            if(data.code != 200){
                $scope.showErrMsg = true;
                $scope.errMsg = data.message;
              }else{
                $rootScope.$emit("RdsCreated", data.message);
                $uibModalInstance.dismiss('cancel');
              }
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