angular.module('bigSQL.components').controller('globalProfilingController', ['$scope','$rootScope', '$uibModalInstance','MachineInfo', 'PubSubService', '$window', '$location', function ($scope, $rootScope, $uibModalInstance, MachineInfo, PubSubService, $window, $location) {

	var session;

    $scope.showResult = false;
    $scope.showStatus =  true;
    var subscriptions = [];
    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;

        session.call('com.bigsql.plprofiler', [
            $scope.hostName, $scope.pgUser,
            $scope.pgPort, $scope.pgDB,
            $scope.pgPass, $scope.pgQuery,
            $scope.pgTitle, $scope.pgDesc,
            "check"
        ]);

        session.subscribe("com.bigsql.profilerReports", function (data) {

            $scope.generatingReportSpinner=false;
            if(data[0].action == 'check'){
                $scope.status = data[0];
            } else{
                $scope.result=data[0];
            }
            $scope.showResult = true;
            $scope.$apply();

        }).then(function (sub) {
            subscriptions.push(sub);
        });

    });

    $scope.hostName = $uibModalInstance.hostName;
    $scope.pgUser = $uibModalInstance.pgUser;
    $scope.pgPass = $uibModalInstance.pgPass;
    $scope.pgDB = $uibModalInstance.pgDB;
    $scope.pgPort = $uibModalInstance.pgPort;
    $scope.enableProfiler = false;

    $scope.enableProfiler = function (argument) {
        $scope.showStatus = false;
    	session.call('com.bigsql.plprofiler', [
            $scope.hostName, $scope.pgUser,
            $scope.pgPort, $scope.pgDB,
            $scope.pgPass, $scope.pgQuery,
            $scope.pgTitle, $scope.pgDesc,
            "enable"

        ]).then(function (argument) {
            session.call('com.bigsql.plprofiler', [
                $scope.hostName, $scope.pgUser,
                $scope.pgPort, $scope.pgDB,
                $scope.pgPass, $scope.pgQuery,
                $scope.pgTitle, $scope.pgDesc,
                "check"
            ]);
        }) ;
    };



    $scope.disableProfiler = function (argument) {
        $scope.showStatus = false;
    	session.call('com.bigsql.plprofiler', [
            $scope.hostName, $scope.pgUser,
            $scope.pgPort, $scope.pgDB,
            $scope.pgPass, $scope.pgQuery,
            $scope.pgTitle, $scope.pgDesc,
            "disable"

        ]).then(function (argument) {
            session.call('com.bigsql.plprofiler', [
                $scope.hostName, $scope.pgUser,
                $scope.pgPort, $scope.pgDB,
                $scope.pgPass, $scope.pgQuery,
                $scope.pgTitle, $scope.pgDesc,
                "check"
            ]);
        });
    };

    $scope.resetProfiler = function (argument) {
    	session.call('com.bigsql.plprofiler', [
            $scope.hostName, $scope.pgUser,
            $scope.pgPort, $scope.pgDB,
            $scope.pgPass, $scope.pgQuery,
            $scope.pgTitle, $scope.pgDesc,
            "reset"
        ]);
    };

    $scope.generateReport = function (argument) {
    	session.call('com.bigsql.plprofiler', [
            $scope.hostName, $scope.pgUser,
            $scope.pgPort, $scope.pgDB,
            $scope.pgPass, $scope.pgQuery,
            $scope.pgTitle, $scope.pgDesc,
            "generate"
        ]).then(function (sub) {
            $uibModalInstance.dismiss('cancel');
        });
    };


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });

}]);