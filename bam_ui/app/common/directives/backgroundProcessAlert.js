angular.module('bigSQL.common').directive('backgroundProcessAlert', function (bamAjaxCall, $rootScope) {


    return {
        scope: {
            title: '@'
        },
        restrict: 'E',
        templateUrl: '../app/common/partials/backgroundProcessAlert.html',
        controller: ['$scope', '$http', '$window', '$cookies', '$rootScope', function backgroundProcessAlertController($scope, $http, $window, $cookies, $rootScope) {
            
            $scope.isbgProcessStarted = false;
            // $scope.cancelbgProcess = false;
            function getBGStatus(process_log_id){

            var bgReportStatus = $http.get($window.location.origin + '/api/bgprocess_status/'+ process_log_id);

                bgReportStatus.then(function (ret_data){
                    $scope.procId = ret_data.data.pid;
                    $scope.procStartTime = new Date(ret_data.data.start_time).toString();
                    $scope.taskID = process_log_id;
                    $scope.out_data = ret_data.data.out_data;
                    $scope.procCmd = ret_data.data.cmd;
                    if (ret_data.data.process_completed){                        
                        $scope.procCompleted = true;
                        if(ret_data.data.process_failed){
                            $scope.procStatus = "Failed."
                            $scope.procEndTime = '';
                            $scope.generatedFile = '';
                            $scope.generatedFileName = '';
                            $scope.error_msg = ret_data.data.error_msg;
                        }else{
                            $scope.procStatus = "Completed."
                            $scope.generatedFile = ret_data.data.file;
                            $scope.generatedFileName = ret_data.data.report_file;
                            $scope.procEndTime = new Date(ret_data.data.end_time).toString();
                        }
                        $rootScope.$emit("refreshBadgerReports");
                    } else{
                        $scope.procEndTime = '';
                        $scope.generatedFile = '';
                        $scope.generatedFileName = '';
                        $scope.procCompleted = false;
                        $scope.procStatus = "Running...."
                        setTimeout(function() {getBGStatus(process_log_id) },5000);
                    }

                });
            }

            //for console toggle 

            document.getElementById('btask-tab-pullout').onclick = function() {
                 this.__toggle = !this.__toggle;
                 var target = document.getElementById('btask-console-hidden');
                 if( this.__toggle) {
                     target.style.display = "block";
                     this.style.backgroundPosition = "-42px 0";
                 }
                 else {
                     target.style.display = "none";
                     this.style.backgroundPosition = "0 0";
                 }
             }

            $scope.cancel = function (argument) {
                $rootScope.$emit('hidebgProcess');
                // $scope.cancelbgProcess = true;
            }

            $rootScope.$on('backgroundProcessStarted', function (argument, pid) {
                getBGStatus(pid);

            });
            
        }]
    }
});