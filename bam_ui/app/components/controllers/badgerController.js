angular.module('bigSQL.components').controller('badgerController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', '$http', '$location', 'bamAjaxCall', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, $http, $location, bamAjaxCall) {

    $scope.alerts = [];
    $scope.checkedFirst = false;

    var subscriptions = [];
    $scope.components = {};
    $scope.disableLog = true;
    $scope.generatingReportSpinner = false;
    $scope.autoSelectLogFile;
    $scope.selectedCurrentLogfile;
    $scope.refreshMsg= false;

    var session;
    $scope.updateSettings;
    $scope.loading = true;
    $scope.retry = false;
    $scope.disableShowInstalled = false;
    $scope.badgerInstalled = false;


    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
        });
    });

    $rootScope.$emit('refreshPgbadger',function (argument) {
        $window.location.reload();
    } );

    var compStatus = bamAjaxCall.getCmdData('status/pgbadger');
        compStatus.then(function (data) {
            if (data.state == "Installed") {
                $scope.badgerInstalled = true;
                var noPostgresRunning = false;
                var serverStatus = bamAjaxCall.getCmdData('status');
                serverStatus.then(function (data) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        if (data[i].state == "Running") {
                            noPostgresRunning = true;
                        }
                    }
                    if(!noPostgresRunning){
                        $scope.alerts.push({
                            msg:  "No Postgres component Installed/ Initialized.",
                            type: 'danger',
                            pgComp: true
                        });
                    }
                });
            } else{
                $scope.alerts.push({
                    msg:  'pgBadger is not Installed yet. ',
                    type: 'danger',
                    pgComp: false
                });
            }
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

    function getReports(argument) {
        
        var infoData = bamAjaxCall.getCmdData('getrecentreports/badger');
        infoData.then(function (data) {
            var files_list = data.data;
            if(files_list.length == 0){
                $scope.showReports = false;
            }else{
                $scope.files_list=files_list; 
                $scope.showReports = true;               
            }
        });

    }

    getReports();

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;
        
        session.call('com.bigsql.checkLogdir');

        session.subscribe("com.bigsql.onCheckLogdir", function (components) {
            $scope.components = JSON.parse(components[0]);
            if($scope.components.length == 1){
                $scope.selectComp = $scope.components[0].component;
                $scope.onSelectChange($scope.selectComp);
            }
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


    $scope.openGenerateModal = function (argument) {
        $scope.report_file = "";
        $scope.report_url = "";
        var selectedFiles = [];
        var selectLog = document.getElementsByName("selectLog");
        for (var i=0;i<selectLog.length; i++){
            if(selectLog[i].checked){
                selectedFiles.push(selectLog[i].value);
            }
        }
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/generateBadgerReport.html',
            controller: 'generateBadgerReportController',
            windowClass: 'switch-modal-window',
            backdrop  : 'static',
            keyboard  : false
        });
        modalInstance.selectedFiles = selectedFiles;
        modalInstance.pgTitle = $scope.pgTitle;
        modalInstance.pgDB = $scope.pgDB;
        modalInstance.pgJobs = $scope.pgJobs;
        modalInstance.pgLogPrefix = $scope.pgLogPrefix;
    };

    $scope.deleteReports = function (files, selectAll) {
        var deleteFiles = [];
        if(selectAll){
            for (var i = files.length - 1; i >= 0; i--) {
                deleteFiles.push(files[i].file);
            }
        }else{
            for (var i = files.length - 1; i >= 0; i--) {
                if(files[i].selected){
                    deleteFiles.push(files[i].file);
                }
            }            
        }
        var removeFiles = $http.post($window.location.origin + '/api/remove_reports/badger', deleteFiles);
        removeFiles.then(function (data) {
            if(data.data.error == 0){
                getReports();
            }
        });
    }

    $scope.refreshLogfiles = function (comp) {
        $scope.refreshMsg = true;
        $timeout(function() {
            session.call('com.bigsql.get_log_files_list', [comp]);
            $scope.refreshMsg = false;
        }, 1000);
    }

    $rootScope.$on('switchLogfile', function (argument, fileName, comp) {
        $scope.autoSelectLogFile = fileName;
        session.call('com.bigsql.get_log_files_list', [comp]);
    });

    $rootScope.$on('updateReports', function (argument) {
        getReports();
    })

    $rootScope.$on('switchLogfileError', function (argument, error) {
        $scope.badgerError = error.status;
    });

    $scope.openDetailsModal = function (comp) {
        $scope.alerts.splice(0, 1);
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/details.html',
            windowClass: 'comp-details-modal',
            controller: 'ComponentDetailsController',
            keyboard  : false,
            backdrop  : 'static',
        });
        modalInstance.component = 'pgbadger';
        modalInstance.isExtension = true;
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);

