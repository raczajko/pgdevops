angular.module('bigSQL.components').controller('pgdgActionModalController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$uibModal', 'bamAjaxCall', '$http', '$window', '$interval', '$timeout', function ($scope, $uibModalInstance, PubSubService, $rootScope, $uibModal, bamAjaxCall, $http, $window, $interval, $timeout) {

	$scope.pgdgComp = $uibModalInstance.pgdgComp;
    $scope.pgdgRepo = $uibModalInstance.pgdgRepo;
    $scope.procDone = false;
    $scope.registering = false;
    $scope.action = $uibModalInstance.action;

    
    if($uibModalInstance.currentHost == 'localhost' || $uibModalInstance.currentHost == '' ){
        $scope.currentHost = '';
    }else{
        $scope.currentHost = $uibModalInstance.currentHost;
    }

    if ($scope.pgdgComp && $scope.action) {
        $scope.loading = true;
        var args = {
            "component" : $scope.pgdgComp,
            "host" : $scope.currentHost,
            "repo" : $scope.pgdgRepo,
            "action" : $scope.action
        }
        var pgdgCmd = $http.post($window.location.origin + '/api/pgdgAction', args);
        pgdgCmd.then(function (argument) {
            $scope.loading = false;
            getBGStatus(argument.data.process_log_id);
        });
    }

    $scope.register = function (argument) {
        $scope.registering = true;
        var args = {
            "component" : $scope.pgdgComp,
            "host" : $scope.currentHost,
            "repo" : $scope.pgdgRepo,
            "action" : 'register'
        }
        var pgdgCmd = $http.post($window.location.origin + '/api/pgdgAction', args);
        pgdgCmd.then(function (argument) {
            setTimeout(function() {getBGStatus(argument.data.process_log_id)},3000);
        });

    }


    function getBGStatus(process_log_id){
        
        var bgReportStatus = $http.get($window.location.origin + '/api/bgprocess_status/'+ process_log_id);

        bgReportStatus.then(function (ret_data){
            $scope.procId = ret_data.data.pid;
            $scope.error_msg = ''; 
            $scope.taskID = process_log_id;
            $scope.out_data = ret_data.data.out_data;
            $scope.procCmd = ret_data.data.cmd;
            if (ret_data.data.process_completed){ 
                $scope.procDone = false;
                if(ret_data.data.process_failed){
                    $scope.procStatus = "Failed."
                    $scope.error_msg = ret_data.data.error_msg;
                }else{
                    $scope.procDone = true;
                    $scope.registering = false;
                }
            } else{
                setTimeout(function() {getBGStatus(process_log_id) },5000);
            }

            $timeout(function() {
                var scroller = document.getElementById("console");
                console.log(scroller);
                scroller.scrollTop = scroller.scrollHeight;
            }, 0, false);
        });
    }


    $scope.cancel = function () {
        $rootScope.$emit('refreshRepo', $scope.pgdgRepo+'-Installed');
        $uibModalInstance.dismiss('cancel');
    };

}]);