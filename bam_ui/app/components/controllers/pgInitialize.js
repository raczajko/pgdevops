angular.module('bigSQL.components').controller('pgInitializeController', ['$scope','$rootScope', '$uibModalInstance','MachineInfo', 'PubSubService', 'bamAjaxCall', '$http', '$window', function ($scope, $rootScope, $uibModalInstance, MachineInfo, PubSubService, bamAjaxCall, $http, $window) {

	var session;
    var subscriptions = [];

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.comp = $uibModalInstance.component;
    $scope.autoStartButton = $uibModalInstance.autoStartButton;
    $scope.dataDir = $uibModalInstance.dataDir;
    $scope.host = $uibModalInstance.host;
    $scope.host_name = $uibModalInstance.host_name;
    $scope.userName = $uibModalInstance.userName;
    $scope.userPassword = $uibModalInstance.password;
    $scope.initializing = false;

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
                if (!$scope.autoStartButton) {
                    $scope.autostartChange(true);
                    $scope.autoStartButton = true;
                }else{
                    getInfoComp();
                }
            }else{
                $scope.autostartDisable = true;
            }
        });
        session.call('com.bigsql.getAvailPort',[$scope.comp,'']);
        if($scope.host == 'localhost' || $scope.host == '' || !$scope.host ){
            var hostInfo = bamAjaxCall.getCmdData('info');
        } else{
            var hostInfo = bamAjaxCall.getCmdData('hostcmd/info/' + $scope.host_name);
        }
        hostInfo.then(function (argument) {
            var data = argument[0];
            if(!$scope.dataDir){
                $scope.dataDir = data.home + '/data/' + $scope.comp;      
            }
            if($scope.dataDir.length > 40){
                $scope.dataDir = "..." + $scope.dataDir.substring(17, $scope.dataDir.length)
            }
            $scope.dataDirVal = data.home + '/data/' + $scope.comp;
        });

        $scope.portNumber = '';

        $scope.autostartChange = function (args) {
            var autoStartVal;
            if(args){
                autoStartVal = 'on';
            } else {
                autoStartVal = 'off';       
            }
            if($scope.host == 'localhost' || $scope.host == '' || !$scope.host ){
                session.call('com.bigsql.autostart',[autoStartVal,$scope.comp]).then(function (argument) {
                getInfoComp();
            });
            } else{
                session.call('com.bigsql.autostart',[autoStartVal,$scope.comp, $scope.host_name]).then(function (argument) {
                    getInfoComp();
                });
            }
        }


        session.subscribe('com.bigsql.onPortSelect', 
            function (data) {
                $scope.portNumber = data.join();
            }).then(
            function (subscription){
                subscriptions.push(subscription);
            });

        session.subscribe('com.bigsql.onInit',
        function (data) {
                var compStatus = JSON.parse(data[0]);
                if(compStatus[0].status == 'complete'){
                    $scope.addToMetaData();
                }else{
                    $uibModalInstance.dismiss('cancel');
                }
            }).then(function (subscription){
                subscriptions.push(subscription);
            });
    });

    $scope.addToMetaData = function (comp, remote_host) {
        if($scope.host == 'localhost' || $scope.host == '' || !$scope.host){
            var infoComp = bamAjaxCall.getCmdData('info/' + $scope.comp)
        }else{
            var infoComp = bamAjaxCall.getCmdData('info/' + $scope.comp + '/' + $scope.host_name)
        }
        infoComp.then(function(args) { 
            args[0]['host'] = $scope.host;
            var addToMetaData = $http.post($window.location.origin + '/api/add_to_metadata', args[0]);
            addToMetaData.then(function (argument) {
                $uibModalInstance.dismiss('cancel');                        
            });
        });
    }

    $scope.init = function() {
        $scope.initializing = true;
        if($scope.host == 'localhost' || $scope.host == '' || !$scope.host){
        	if(!$scope.portNumber){
                $scope.portNumber = document.getElementById('portNumber').value;
            }
            session.call('com.bigsql.init', [ $scope.comp, $scope.formData.password, $scope.dataDirVal, $scope.portNumber ] );
        } else {
            if ($scope.userName == undefined || $scope.password == undefined) {
                var event_url =  'initpg/'  + $scope.host_name + '/' + $scope.comp + '/' +$scope.formData.password ;
            }else{
                var event_url =  'initpg/'  + $scope.host_name + '/' + $scope.comp + '/' +$scope.formData.password + '/' + $scope.userName +'/' + $scope.userPassword;
            }
            var eventData = bamAjaxCall.getCmdData(event_url);
            eventData.then(function(data) {
                $scope.addToMetaData();                     
            });
        }

    }

    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });

}]);