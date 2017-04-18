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
                    if (ret_data.data.process_completed){                        
                        $scope.procCompleted = true;
                        if(ret_data.data.process_failed){
                            $scope.procStatus = "Failed."
                            $scope.procEndTime = '';
                            $scope.generatedFile = '';
                            $scope.generatedFileName = '';
                            $scope.out_data = ret_data.data.out_data;
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