angular.module('bigSQL.components').controller('loggingParamController', ['$scope','$rootScope', '$uibModalInstance', 'PubSubService', '$sce', function ($scope, $rootScope, $uibModalInstance, PubSubService, $sce) {

	var session;

    $scope.showResult = false;
    $scope.showStatus =  true;
    $scope.changedVales = [];
    var subscriptions = [];
    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;

        session.call('com.bigsql.get_logging_parameters', [
            $scope.comp
        ]);

        session.subscribe("com.bigsql.logging_settings", function (data) {
            var result = data[0];
            console.log(result.settings);
            $scope.data = result.settings;
            $scope.$apply();
            if(result.error==0){
                $scope.logging_params=result.settings;

            }else{
                $scope.logging_params="";
            }

        }).then(function (sub) {
            subscriptions.push(sub);
        });

    });

    $scope.comp = $uibModalInstance.comp;


    $scope.changeSetting = function (value, setting) {
        $scope.changedVales[value] = setting;
        console.log($scope.changedVales);
    }

    $scope.save = function (args) {
        //
    }

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