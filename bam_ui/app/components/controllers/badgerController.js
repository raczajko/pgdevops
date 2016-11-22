angular.module('bigSQL.components').controller('badgerController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', '$http', '$location', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, $http, $location) {

    $scope.alerts = [];
    $scope.checkedFirst = false;

    var subscriptions = [];
    $scope.components = {};
    $scope.disableLog = true;
    $scope.generatingReportSpinner = false;
    $scope.autoSelectLogFile;
    $scope.selectedCurrentLogfile;

    var session;
    $scope.updateSettings;
    $scope.loading = true;
    $scope.retry = false;
    $scope.disableShowInstalled = false;


    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
        });
    });


    $scope.onSelectChange = function (comp) {
        if(comp){
            session.call('com.bigsql.get_log_files_list', [comp]);
            session.call('com.bigsql.infoComponent', [comp]);
            session.subscribe('com.bigsql.onInfoComponent', function (args) {
                $scope.logDir = JSON.parse(args[0][0])[0].logdir;
                $scope.$apply();
            });    
        }else{
            $scope.logfiles = [];
            $scope.logDir = '';
        }
        
    };

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;
        
        session.call('com.bigsql.checkLogdir');

        session.subscribe("com.bigsql.onCheckLogdir", function (components) {
            $scope.components = JSON.parse(components[0]);
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        session.subscribe("com.bigsql.log_files_list", function (data) {
            $scope.logfiles = JSON.parse(data[0]);
            if($scope.autoSelectLogFile){

                $scope.checkedFirst = true;

            }
            $scope.disableLog = false;
            $scope.apply();

        });
        session.subscribe("com.bigsql.badgerReports", function (data) {
            var result = data[0];
            $scope.generatingReportSpinner = false;
            if (result.error == 0) {
                $scope.report_file = result.report_file;
                $scope.report_url = "/reports/" + result.report_file;
                $scope.$apply();
            } else {
                $scope.badgerError = result.msg;
                $scope.generatingReportSpinner = false;
            }
            $scope.$apply();

        }).then(function (subscription) {
            subscriptions.push(subscription);
        });
    });

    $scope.openLoggingParam = function (argument) {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/loggingParam.html',
            controller: 'loggingParamController',
            windowClass: 'app-modal-window'
        });
        modalInstance.comp=$scope.selectComp;
    };

    $scope.openSwitchlog = function (argument) {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/switchLogfile.html',
            controller: 'switchLogfileController',
            windowClass: 'switch-modal-window'
        });
        modalInstance.comp=$scope.selectComp;
        modalInstance.currentLogfile = $scope.logfiles[0].file;
    };


    $scope.openRecentReports = function (argument) {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/recentReports.html',
            controller: 'recentReportsController',
            windowClass: 'switch-modal-window'
        });
        modalInstance.reportsType="badger";
    };

    $scope.generateReport = function () {
        $scope.report_file = "";
        $scope.report_url = "";
        var selectedFiles = [];
        $scope.badgerError = '';
        
        var selectLog = document.getElementsByName("selectLog");
        for (var i=0;i<selectLog.length; i++){
            if(selectLog[i].checked){
                selectedFiles.push(selectLog[i].value);
            }
        }
        
        if (selectedFiles.length > 0) {
            $scope.generatingReportSpinner = true;
            session.call('com.bigsql.pgbadger', [
                selectedFiles, $scope.pgDB,
                $scope.pgJobs, $scope.pgLogPrefix,
                $scope.pgTitile
            ]);
        }
        
    };

    $rootScope.$on('switchLogfile', function (argument, fileName, comp) {
        $scope.autoSelectLogFile = fileName;
        session.call('com.bigsql.get_log_files_list', [comp]);
    });

    $rootScope.$on('switchLogfileError', function (argument, error) {
        $scope.badgerError = error.status;
    });

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);

