angular.module('bigSQL.components').controller('generateBadgerReportController', ['$scope','$rootScope', '$uibModalInstance', 'PubSubService', 'bamAjaxCall', '$sce', function ($scope, $rootScope, $uibModalInstance, PubSubService, bamAjaxCall, $sce) {

	var session;

    var subscriptions = [];
    var sessionPromise = PubSubService.getSession();

    sessionPromise.then(function (val) {
    	session = val;

        session.subscribe("com.bigsql.badgerReports", function (data) {
            var result = data[0];
            $scope.generatingReportSpinner = false;
            if (result.error == 0) {
                $scope.report_file = result.report_file;
                $scope.report_url = "/reports/" + result.report_file;
            } else {
                $scope.badgerError = result.msg;
                $scope.generatingReportSpinner = false;
            }
            $scope.$apply();

        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        if ($uibModalInstance.selectedFiles.length > 0) {
            $scope.generatingReportSpinner = true;
            session.call('com.bigsql.pgbadger', [
                $uibModalInstance.selectedFiles, $uibModalInstance.pgDB,
                $uibModalInstance.pgJobs, $uibModalInstance.pgLogPrefix,
                $uibModalInstance.pgTitle
            ]);
        }
    });

    $scope.cancel = function () {
        $rootScope.$emit('updateReports');
        $uibModalInstance.dismiss('cancel');
    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });


    
}]);