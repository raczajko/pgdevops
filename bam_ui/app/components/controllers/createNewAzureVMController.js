angular.module('bigSQL.components').controller('createNewAzureVMController', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval','MachineInfo', 'pgcRestApiCall', '$uibModalInstance', '$uibModal', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, pgcRestApiCall, $uibModalInstance, $uibModal) {

    var session;
    $scope.showErrMsg = false;
    $scope.creating = false;


    $scope.loading = true;
    $scope.firstStep = true;
    $scope.secondStep = false;
    $scope.disableInsClass = true;
    $scope.loadingResGroups = true;
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
        'admin_username':'',
        'password':''
    };
    $scope.loading = false;
    /*var regions = pgcRestApiCall.getCmdData('metalist azure-regions');
    regions.then(function(data){
        $scope.loading = false;
        $scope.regions = data;
        $scope.data.region = $scope.regions[0].region;
    });*/

    $scope.regionChange = function(){
        $scope.loadingResGroups = true;
        if($scope.data.region){
            var resource_groups = pgcRestApiCall.getCmdData('metalist res-group --cloud azure --region '+ $scope.data.region )
        }else{
            var resource_groups = pgcRestApiCall.getCmdData('metalist res-group --cloud azure')
        }
        resource_groups.then(function (data) {
            $scope.res_groups = data;
            $scope.loadingResGroups = false;
        });
    }

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
        })
    }

    var pwdRegExp = new RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[~$@£!%*#?&^<>()\\[\\]\\=/{}`|_+,.:;])[A-Za-z0-9~$@£!%*#?&^<>()\\[\\]\\=/{}`|_+,.:;]{12,72}$(?!.*['/-])");
    $scope.pwdValid = false;

    $scope.validationInputPwdText = function(value) {
        if (pwdRegExp.test(value)) {
            $scope.pwdValid = true;
        }else{
            $scope.pwdValid = false
        }
    };

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

    $scope.regionChange();


}]);