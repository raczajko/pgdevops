angular.module('bigSQL.components').controller('ComponentsSettingsController', ['$rootScope', '$scope', '$uibModal', 'PubSubService', 'MachineInfo', 'UpdateComponentsService', '$window', 'bamAjaxCall', '$cookies', function ($rootScope, $scope, $uibModal, PubSubService, MachineInfo, UpdateComponentsService, $window, bamAjaxCall, $cookies) {
    $scope.alerts = [];

    var session;
    var subscriptions = [];
    $scope.updateSettings;
    $scope.components = {};
    $scope.currentHost;
    $scope.showPgDgFeature = false;
    $scope.settingsOptions = [{name:'Weekly'},{name:'Daily'},{name:'Monthly'}]

    $scope.open = function (manual) {
        UpdateComponentsService.set('');
        if (manual == "manual") {
            UpdateComponentsService.setCheckUpdatesManual();
        } else {
            UpdateComponentsService.setCheckUpdatesAuto();
        }

        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/updateModal.html',
            windowClass: 'comp-details-modal',
            controller: 'ComponentsUpdateController',
        });
    };

    // var infoData = bamAjaxCall.getCmdData('info')
    // infoData.then(function(data) {
    //     $scope.pgcInfo = data[0];
    //     if (data[0].last_update_utc) {
    //         $scope.lastUpdateStatus = new Date(data[0].last_update_utc.replace(/-/g, '/') + " UTC").toString().split(' ',[5]).splice(1).join(' ');
    //     }
    //     if (MachineInfo.getUpdationMode() == "manual") {
    //         $scope.settingType = 'manual';
    //     } else {
    //         $scope.settingType = 'auto';
    //         session.call('com.bigsql.get_host_settings');
    //     }

    // });

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        $rootScope.$emit('topMenuEvent');
        session = val;

        session.call('com.bigsql.getBetaFeatureSetting', ['hostManager']);
        session.call('com.bigsql.getBetaFeatureSetting', ['pgdg']);

        session.subscribe("com.bigsql.onGetBeataFeatureSetting", function (settings) {
            if(settings[0].setting == 'hostManager'){
                if (settings[0].value == '0' || !settings[0].value) {
                    $scope.hostManager = false; 
                }else{
                    $scope.hostManager = true;
                }
            }else if(settings[0].setting == 'pgdg'){
                if (settings[0].value == '0' || !settings[0].value) {
                    $scope.pgdg = false; 
                }else{
                    $scope.pgdg = true;
                }
            }
           $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        $scope.updateManualSettings = function () {
            session.call('com.bigsql.update_host_settings', ['localhost', "None", '']).then(
                function (subscription) {
                    session.call('com.bigsql.get_host_settings').then(
                        function (sub) {
                            MachineInfo.setUpdationMode(sub);
                            var data = "Update settings has been set to Manual";
                            $scope.alerts.push({
                                msg: data
                            });
                            $scope.$apply();
                        });
                });
        };

        $scope.onAutomaticOptionSelection = function (value) {
            session.call('com.bigsql.update_host_settings', ['localhost', $scope.automaticSettings.name, '']).then(
                function (subscription) {
                    session.call('com.bigsql.get_host_settings').then(
                        function (sub) {
                            MachineInfo.setUpdationMode(sub);
                            var data = "Update settings has been set to " + sub.interval + ", next update is on " + sub.next_update_utc;
                            $scope.alerts.push({
                                msg: data
                            });
                            $scope.$apply();
                        });
                });
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.changeBetaFeature = function (name, setting) {
            var value, msg, type;
            if(setting){
                value = '1';
                msg = name + " feature is enabled.";
                type = 'success';
            }else{
                value = '0';
                msg = name + " feature is disabled.";
                type = 'warning';
            }
            session.call('com.bigsql.setBetaFeatureSetting', [name, value]);
            $scope.alerts.push({
                msg : msg,
                type : type
            });
        }

    });

    function getInfo(argument) {
        argument = typeof argument !== 'undefined' ? argument : "";
        $scope.currentHost = argument;
        if (argument=="" || argument == 'localhost'){
            var infoData = bamAjaxCall.getCmdData('info');
            var checkpgdgSupport = bamAjaxCall.getCmdData('info');
        } else{
            var infoData = bamAjaxCall.getCmdData('hostcmd/info/'+argument);
            var checkpgdgSupport = bamAjaxCall.getCmdData('hostcmd/info/'+argument);
        }

        infoData.then(function(data) {
            $scope.pgcInfo = data[0];
            if (data[0].last_update_utc) {
                var l_date = new Date(data[0].last_update_utc.replace(/-/g, '/') + " UTC").toString().split(' ',[5]).splice(1).join(' ');
                $scope.lastUpdateStatus = l_date.split(' ')[0] + ' ' + l_date.split(' ')[1].replace(/^0+/, '') + ', ' + l_date.split(' ')[2] + ' ' + l_date.split(' ')[3]
            }
            if (MachineInfo.getUpdationMode() == "manual") {
                $scope.settingType = 'manual';
            } else {
                $scope.settingType = 'auto';
                session.call('com.bigsql.get_host_settings');
            }
        });
        checkpgdgSupport.then(function (argument) {
            var data = argument[0];
            if(data.os.split(' ')[0] == 'CentOS'){
                $scope.showPgDgFeature = true;
            }
        })
    };

    $rootScope.$on('refreshUpdateDate', function (argument) {
       $window.location.reload(); 
    });

    getInfo($cookies.get('remote_host'));

    $scope.refreshData=function(hostArgument){
        $scope.currentHost = hostArgument;
        getInfo(hostArgument);
    };

    /**
     Unsubscribe to all the apis on the template and scope destroy
     **/
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }

    });

}]);