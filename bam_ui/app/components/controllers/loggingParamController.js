angular.module('bigSQL.components').controller('loggingParamController', ['$scope','$rootScope', '$uibModalInstance', 'PubSubService', '$sce', function ($scope, $rootScope, $uibModalInstance, PubSubService, $sce) {

    var session;

    $scope.showResult = false;
    $scope.showStatus =  true;
    $scope.changedVales = {};
    var subscriptions = [];
    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;

        session.call('com.bigsql.get_logging_parameters', [
            $scope.comp
        ]);

        session.subscribe("com.bigsql.logging_settings", function (data) {
            var result = data[0];
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

        if(value != undefined){
            if($scope.changedVales[value]){
                delete $scope.changedVales[value];                
            }else{
                $scope.changedVales[value] = setting;
            }
        }
    }

    $scope.save = function (changedVales, comp) {
        
        if(Object.keys(changedVales).length > 0){
            session.call('com.bigsql.change_log_params', [comp, changedVales] )
        }

        session.subscribe("com.bigsql.on_change_log_params", function (data) {
            $uibModalInstance.dismiss('cancel');
        }).then(function (sub) {
            subscriptions.push(sub);
        });
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