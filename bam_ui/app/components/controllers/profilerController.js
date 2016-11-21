angular.module('bigSQL.components').controller('profilerController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', '$http', '$location', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, $http, $location) {

    $scope.alerts = [];

    var subscriptions = [];
    $scope.components = {};

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
    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;
        session.subscribe("com.bigsql.profilerReports", function (data) {
            $scope.generatingReportSpinner=false;
            var result=data[0];
            if (result.error == 0) {

                if(result.action == "profile_query" || result.action == "generate"){
                    $scope.report_file = result.report_file;
                    $scope.report_url = "/reports/" + result.report_file;
                }
                else{
                    $scope.errorMsg = result.msg;
                    $scope.report_file = '';
                }

                //$scope.report_file = result.report_file;
                //$scope.report_url = "/reports/" + result.report_file;
                // $window.open("http://localhost:8050/reports/" + result.report_file);
                //$scope.$apply();
                //$scope.message = data;
            } else {
                $scope.errorMsg = result.msg;
                $scope.report_file = '';
            }
            $scope.$apply();

        }).then(function (subscription) {
            subscriptions.push(subscription);
        });
    });

    $scope.hostName = localStorage.getItem('hostName');
    $scope.pgUser = localStorage.getItem('pgUser');
    $scope.pgDB = localStorage.getItem('pgDB');
    $scope.pgPort = localStorage.getItem('pgPort');



    $scope.generateReport = function () {
        $scope.report_file = "";
        $scope.report_url = "";

        $scope.generatingReportSpinner=true;


        session.call('com.bigsql.plprofiler', [
            $scope.hostName, $scope.pgUser,
            $scope.pgPort, $scope.pgDB,
            $scope.pgPass, $scope.pgQuery,
            $scope.enableProfiler, $scope.enableProfiler,
            $scope.pgTitle, $scope.pgDesc
        ]);

    };

    $scope.openRecentReports = function (argument) {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/recentReports.html',
            controller: 'recentReportsController',
            windowClass: 'switch-modal-window'
        });
        modalInstance.reportsType="profiler";
    };

    $scope.queryProfiler = function (hostName, pgUser, pgPass, pgDB, pgPort) {

        localStorage.setItem('hostName',hostName);
        localStorage.setItem('pgUser',pgUser);
        localStorage.setItem('pgDB',pgDB);
        localStorage.setItem('pgPort',pgPort);


        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/statementProfilingModal.html',
            controller: 'statementProfilingController',
        });
        modalInstance.hostName = hostName;
        modalInstance.pgUser = pgUser;
        modalInstance.pgPass = pgPass;
        modalInstance.pgDB = pgDB;
        modalInstance.pgPort = pgPort;
    };

    $scope.globalProfiling = function (hostName, pgUser, pgPass, pgDB, pgPort) {

        localStorage.setItem('hostName',hostName);
        localStorage.setItem('pgUser',pgUser);
        localStorage.setItem('pgDB',pgDB);
        localStorage.setItem('pgPort',pgPort);

        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/globalProfilingModal.html',
            controller: 'globalProfilingController',
        });
        modalInstance.hostName = hostName;
        modalInstance.pgUser = pgUser;
        modalInstance.pgPass = pgPass;
        modalInstance.pgDB = pgDB;
        modalInstance.pgPort = pgPort;
    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);

