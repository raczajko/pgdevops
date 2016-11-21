angular.module('bigSQL.components').controller('whatsNewController', ['$scope','$rootScope', '$uibModalInstance', 'PubSubService', '$sce', function ($scope, $rootScope, $uibModalInstance, PubSubService, $sce) {

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    var subscriptions = [];
    $scope.components = {};

    var session;

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;
        session.call('com.bigsql.getRelNotes', [$uibModalInstance.component, '' ]);

        session.subscribe('com.bigsql.onGetRelNotes', function (argument) {
            $scope.whatsNewText = $sce.trustAsHtml(argument[0]);
            $scope.$apply();
        }).then(function (sub) {
            subscriptions.push(sub);
        });

    });

    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);