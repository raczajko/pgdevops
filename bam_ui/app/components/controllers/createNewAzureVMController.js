angular.module('bigSQL.components').controller('createNewAzureVMController', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval','MachineInfo', 'pgcRestApiCall', '$uibModalInstance', '$uibModal', 'htmlMessages', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, pgcRestApiCall, $uibModalInstance, $uibModal, htmlMessages) {

    var session;
    $scope.showErrMsg = false;
    $scope.creating = false;


    $scope.loading = true;
    $scope.firstStep = true;
    $scope.secondStep = false;
    $scope.disableInsClass = true;
    $scope.loadingResGroups = true;
    $scope.days = {'Monday': 'mon', 'Tuesday': 'tue', 'Wednesday' : 'wed', 'Thursday': 'thu', 'Friday' : 'fri', 'Saturday': 'sat', 'Sunday': 'sun'};

    $scope.creatingAzureVM = htmlMessages.getMessage('create-azure-vm');

    $scope.data = {
        'region' : 'southcentralus',
        'group_name' : 'Default-Storage-SouthCentralUS',
        'vm_size' : 'Basic_A0',
        'computer_name' : '',
        'publisher':'',
        'offer' : '',
        'sku': '',
        'version':'latest',
        'admin_username':'',
        'password':''
    };

    $scope.loading = false;
    var regions = pgcRestApiCall.getCmdData('metalist azure-regions');
    regions.then(function(data){
        $scope.loading = false;
        $scope.regionsList = data;
        $scope.data.region = 'southcentralus';
    });

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

    var imagesList = pgcRestApiCall.getCmdData('metalist azure-images');
    imagesList.then(function (argument) {
        $scope.skuMapping = argument;
    });


    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
    });
    
    $scope.publisherChange = function(sku){
        $scope.data['offer'] = sku.offer;
        $scope.data['publisher'] = sku.publisher;
        $scope.data['sku'] = sku.sku;
        $scope.data['version'] = sku.version;
    }


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.createVM = function(){
        $scope.creating = true;
        $scope.showErrMsg = false;
        var data = [];
        data.push($scope.data);
        var requestData = {
            'cloud' : 'azure',
            'type' : 'vm',
            'params' : data
        }
        var createVMResponse = pgcRestApiCall.postData('create',requestData)
        createVMResponse.then(function (data) {
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

    var pwdRegExp = new RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[~$@£!*?&^<>()\\[\\]\\=/{}`|_+,.:;])[A-Za-z0-9~$@£!*?&^<>()\\[\\]\\=/{}`|_+,.:;]{12,72}$(?!.*['%/#-])");
    var InsRegExp = new RegExp("^[a-z0-9-]+$");
    var userNameExp = new RegExp("^[a-zA-Z]+$");
    $scope.pwdValid = false;
    $scope.instanceNameValid = false;
    $scope.userNameValid = false;

    $scope.validationInputPwdText = function(value) {
        if (pwdRegExp.test(value)) {
            $scope.pwdValid = true;
        }else{
            $scope.pwdValid = false
        }
    };

    $scope.validateInsName = function (value) {
        if (InsRegExp.test(value)) {
            $scope.instanceNameValid = true;
        }else{
            $scope.instanceNameValid = false
        }
    }

    $scope.validateUserName = function (value) {
        if (userNameExp.test(value)) {
            $scope.userNameValid = true;
        }else{
            $scope.userNameValid = false
        }
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

    $scope.regionChange();


}]);