angular.module('bigSQL.components').controller('pgInitializeController', ['$scope','$rootScope', '$uibModalInstance','MachineInfo', 'PubSubService', 'bamAjaxCall', function ($scope, $rootScope, $uibModalInstance, MachineInfo, PubSubService, bamAjaxCall) {

	var session;
    var subscriptions = [];

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.comp = $uibModalInstance.component;
    $scope.autoStartButton = $uibModalInstance.autoStartButton;

    function getInfoComp(argument) {
        var infoData = bamAjaxCall.getCmdData('info/' + $scope.comp)
        infoData.then(function(args) {
            var data = args[0];
            if (data.component == $scope.comp) {
                if(data['autostart'] == "on" ){
                    $scope.autostart = true;
                }else if(data['autostart'] == "off" ){
                    $scope.autostart = false;
                }
            }
        });
    }

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
        session.call('com.bigsql.checkOS');
        session.subscribe('com.bigsql.onCheckOS', function (args) {
            if(args[0] != 'Linux'){
                
                session.call('com.bigsql.autostart',['on',$scope.comp]).then(function (argument) {
                    getInfoComp();
                });
                
            }else{
                $scope.autostartDisable = true;
            }
        });
        session.call('com.bigsql.getAvailPort',[$scope.comp,'']);

        var promise = MachineInfo.get(val);
        promise.then(function (data) {
            $scope.dataDir = data.home + '/data/' + $scope.comp;
        });

        $scope.portNumber = '';

        $scope.autostartChange = function (args) {
            var autoStartVal;
            if(args){
                autoStartVal = 'on';
            } else {
                autoStartVal = 'off';       
            }
            session.call('com.bigsql.autostart',[autoStartVal,$scope.comp]);
        }


        session.subscribe('com.bigsql.onPortSelect', 
            function (data) {
                $scope.portNumber = data.join();
            }).then(
            function (subscription){
                subscriptions.push(subscription);
            });
    });

    $scope.init = function() {
    	if(!$scope.portNumber){
            $scope.portNumber = document.getElementById('portNumber').value;
        }
        session.call('com.bigsql.init', [ $scope.comp, $scope.formData.password, $scope.dataDir, $scope.portNumber ] );
	    $rootScope.$emit('initComp', [$scope.comp]);    		
		$uibModalInstance.dismiss('cancel');
    }

    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });

}]);