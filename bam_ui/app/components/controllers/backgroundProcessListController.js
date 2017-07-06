angular.module('bigSQL.components').controller('backgroundProcessListController', ['$rootScope', '$scope', '$uibModal', 'PubSubService', 'MachineInfo', 'UpdateComponentsService', '$window', 'bamAjaxCall', '$cookies', '$sce', 'htmlMessages','$http', function ($rootScope, $scope, $uibModal, PubSubService, MachineInfo, UpdateComponentsService, $window, bamAjaxCall, $cookies, $sce, htmlMessages,$http) {
    $scope.processList = [];
    $scope.loading = true;
    $scope.showBackupBgProcess = false;
    $scope.showBackupProcess = true;
    $scope.processType = 'all';
    $scope.jobTypes = [{
                'type':'All Jobs',
                'type_value': 'all'
            },
            {
                'type':'Backup',
                'type_value': 'backup'
            },
            {
                'type':'Restore',
                'type_value': 'restore'
            },
            {
                'type':'Badger',
                'type_value': 'pgBadger Report'
            }];
    function getBGprocessList(type) {
        var getbgProcess = bamAjaxCall.getCmdData('bgprocess_list'+type);
        getbgProcess.then(function (argument) {
            if (argument.process) {
                debugger
                $scope.processList = argument.process;
                $scope.loading = false;
            }
        })
    };
    getBGprocessList('');

    $scope.getProcessStatus = function(process_failed, process_completed) {
        var status = "Running";
        if(process_completed){
            status = "Completed";
        }
        return status;
    };

    $scope.jobTypeChange = function(type){
        debugger
        if(type == "all"){
            getBGprocessList('');
        }
        else{
            getBGprocessList('/'+type);
        }
    };
    $scope.getTruncatedCmd = function(cmd){
        if(cmd.indexOf("pgc ") != -1 || cmd.indexOf("pgbadger ") != -1){
            var cmd_list = cmd.split(" ");
            var index = -1;
            if(cmd.indexOf("pgc ") != -1){
                index = $scope.is_in_array("pgc",cmd_list)
                cmd_list[index] = "pgc";
            }
            else if(cmd.indexOf("pgbadger ") != -1){
                index = $scope.is_in_array("pgbadger",cmd_list)
                cmd_list[index] = "pgbadger";
            }
        return cmd_list.join(" ");
        }
        return cmd;
    };
    $scope.is_in_array = function(s,data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].toLowerCase().indexOf(s) != -1) return i;
        }
        return -1;
    }
    $scope.showConsoleOutput = function(log_id){
        $scope.showBackupBgProcess = false;
        $scope.showBackupBgProcess = true;
        $rootScope.$emit('backgroundProcessStarted', log_id);
    };

    $rootScope.$on('hidebgProcess', function (argument) {
        $scope.showBackupBgProcess = false;
    });
}]);