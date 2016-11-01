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
            var result=data[0];
            if (result.error == 0) {

                $scope.report_file = result.report_file;
                $scope.report_url = "/reports/" + result.report_file;
                $scope.$apply();
                //$scope.message = data;
            } else {
                alert(result.msg);
            }

        }).then(function (subscription) {
            subscriptions.push(subscription);
        });
    });


    $scope.generateReport = function () {
        $scope.report_file = "";
        $scope.report_url = "";
        var dataObj = {};
        dataObj['hostName'] = $scope.hostName;
        dataObj['pgUser'] = $scope.pgUser;
        dataObj['pgPass'] = $scope.pgPass;
        dataObj['pgPort'] = $scope.pgPort;
        dataObj['pgQuery'] = $scope.pgQuery;
        dataObj['pgTitle'] = $scope.pgTitle;
        dataObj['pgDesc'] = $scope.pgDesc;
        dataObj['pgDB'] = $scope.pgDB;


        session.call('com.bigsql.plprofiler', [
            $scope.hostName, $scope.pgUser,
            $scope.pgPort, $scope.pgDB,
            $scope.pgPass, $scope.pgQuery,
            $scope.pgTitle, $scope.pgDesc
        ]);



    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);

