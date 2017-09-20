angular.module('bigSQL.components').controller('createNewAzureDBController', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval','MachineInfo', 'bamAjaxCall', '$uibModalInstance', '$uibModal', 'pgcRestApiCall', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, bamAjaxCall, $uibModalInstance, $uibModal, pgcRestApiCall) {

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
        'master_user' : '',
        'instance' : '',
        'password' : '',
        'engine_version' : '',
        'group_name' : '',
        'ssl_mode' : "Disabled",
        'start_ip':"0.0.0.0",
        'end_ip':"255.255.255.255"
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
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.createVM = function(){
        $scope.creating = true;
        $scope.showErrMsg = false;
        if ($scope.data.publicly_accessible) {
            $scope.data.publicly_accessible = "Yes";
        }else{
            $scope.data.publicly_accessible = "No";
        }
        var data = [];
        data.push($scope.data);
        var createAzureDB = pgcRestApiCall.getCmdData('create db --params \'' + JSON.stringify(data) + '\' --cloud azure' )
        createAzureDB.then(function (data) {
            $scope.creating = false;
            if(data[0].state == 'error'){
                $scope.showErrMsg = true;
                $scope.errMsg = data[0].msg;
              }else{
                $rootScope.$emit("AzureDBCreated", data[0].msg);
                $uibModalInstance.dismiss('cancel');
              }
        })
    }

    var pwdRegExp = new RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[~$@£!%*#?&^<>()\\[\\]\\=/{}`|_+,.:;])[A-Za-z0-9~$@£!%*#?&^<>()\\[\\]\\=/{}`|_+,.:;]{12,72}$(?!.*['/-])");
    var InsRegExp = new RegExp("^[a-z0-9]+$");
    $scope.pwdValid = false;
    $scope.instanceNameValid = false;

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

    $scope.regionChange();


}]);