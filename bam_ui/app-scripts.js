//All the modules will be created him , all the developers would have create there modules here
"use strict";

angular.module('bigSQL.common', []);
angular.module('bigSQL.components', ['bigSQL.common', 'nvd3', 'ui.grid', 'ui.grid.expandable']);
angular.module('bigSQL.menus', ['bigSQL.common']);
angular.module('bigSQL', ['templates', 'angular.filter', 'ui.router', 'ui.bootstrap', 'bigSQL.common', 'bigSQL.menus', 'bigSQL.components']);

angular.module('bigSQL').run(function (PubSubService, $state, $window, $rootScope, $stateParams) {
    //Callback added for session creation
    var sessionCreated = function (session) {
        $rootScope.$emit('sessionCreated',session);
    };

    $window.onbeforeunload = function () {
        PubSubService.closeConnection();
    };

    PubSubService.initConnection();
    PubSubService.openConnection(sessionCreated);

});

angular.module('bigSQL').config(function ($urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
});

angular.module('bigSQL').controller('BigSqlController', ['$scope', '$rootScope', '$uibModal', 'PubSubService', 'MachineInfo', '$state', '$window', function ($scope, $rootScope, $uibModal, PubSubService, MachineInfo, $state, $window) {


}]);
"use strict";

angular.module('bigSQL.common');
angular.module('bigSQL.components').config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('components', {
        url: '/components',
        views: {
            "main": {
                controller: 'ComponentsController',
                templateUrl: '../app/components/components.html'
            }
        }

    }).state('components.view', {
        url: '/view',
        views: {
            "sub": {
                controller: 'ComponentsViewController',
                templateUrl: '../app/components/partials/view.html',
            }
        }

    }).state('components.status', {
        url: '/status',
        views: {
            "sub": {
                controller: 'ComponentsStatusController',
                templateUrl: '../app/components/partials/status.html',

            }
        }
    }).state('components.log', {
        url: '/log/',
        views: {
            "sub": {
                controller: 'ComponentsLogController',
                templateUrl: '../app/components/partials/log.html',

            }
        }
    }).state('components.detailsView', {
        url: '^/details/{component}',
        views: {
            "sub": {
                controller: 'ComponentDetailsController',
                templateUrl: '../app/components/partials/details.html',
            }
        }
    }).state('components.settingsView', {
        url: '/settings',
        views: {
            "sub": {
                controller: 'ComponentsSettingsController',
                templateUrl: '../app/components/partials/settings.html',
            }
        }
    }).state('components.detailspg95', {
        url: '^/details-pg/{component}',
        views: {
            "sub": {
                controller: 'ComponentDetailsPg95Controller',
                templateUrl: '../app/components/partials/detailspg95.html',
            }
        }
    }).state('components.componentLog', {
        url: '^/log/{component}',
        views: {
            "sub": {
                controller: 'ComponentsLogController',
                templateUrl: '../app/components/partials/log.html',
            }
        }
    }).state('components.loading', {
        url: '^/',
        views: {
            "sub": {
                controller: 'bamLoading',
                templateUrl: '../app/components/partials/loading.html',
            }
        }
    });
}).controller('ComponentsController', ['$scope', function ($scope) {

}]);
angular.module('bigSQL.menus').component('bamUpdate', {
    bindings: {},
    controller: function ($rootScope, $scope, PubSubService, MachineInfo, $uibModal, UpdateComponentsService, UpdateBamService) {

        var subscriptions = [];

        var session;

        /**Below function is for displaying update badger on every page.
         **/
        function updateComponents(sessParam) {
            var bamUpdatePromise = UpdateBamService.getBamUpdateInfo();
            bamUpdatePromise.then(function (info) {
                if ( info.component == "bam2" && info.is_current == 0 && info.current_version ) {
                    $scope.bamUpdate = true;
                } else {
                    $scope.bamUpdate = false;
                }
            }, function () {
                throw new Error('failed to subscribe to topic updateComponents', err);
            })


        }


        $rootScope.$on('topMenuEvent', function () {
            var sessPromise = PubSubService.getSession();
            sessPromise.then(function (sessionParam) {
                updateComponents(sessionParam);
            });
        });


        $scope.open = function () {

            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/bamUpdate.html',
                windowClass: 'bam-update-modal modal',
                controller: 'ComponentBamUpdateController',
            });
        };

        /**
         Unsubscribe to all the apis on the template and scope destroy
         **/
        $scope.$on('$destroy', function () {
            for (var i = 0; i < subscriptions.length; i++) {
                session.unsubscribe(subscriptions[i]);
            }
        });


    },
    templateUrl: "../app/menus/partials/bamHeaderUpdate.html"
});
angular.module('bigSQL.menus').component('leftMenu', {
    bindings: {},
    controller: function ($scope, PubSubService) {
    },
    templateUrl: "../app/menus/partials/leftMenu.html"
});
angular.module('bigSQL.menus').component('topMenu', {
    bindings: {},
    controller: function ($rootScope, $scope, PubSubService, $uibModal, UpdateComponentsService, MachineInfo, $http, $window) {

        var subscriptions = [];

        /**Below function is for displaying update badger on every page.
         **/
        
        // $rootScope.$on('topMenuEvent',function () {

            var sessPromise = PubSubService.getSession();

            sessPromise.then(function (session) {
                $http.get($window.location.origin + '/api/list')
                .success(function(data) {
                    var Checkupdates = 0;
                    $scope.components = data;
                    for (var i = 0; i < $scope.components.length; i++) {
                        if ($scope.components[i].component != 'bam2') {
                            Checkupdates += $scope.components[i].updates;
                        }
                    }
                    $scope.updates = Checkupdates;
                });

                $http.get($window.location.origin + '/api/info')
                .success(function(data) {
                    $scope.pgcInfo = data[0];
                });

                $http.get($window.location.origin + '/api/userinfo')
                .success(function(data) {
                        $scope.userInfo = data;
                });


            });

            $scope.open = function () {

                UpdateComponentsService.setCheckUpdatesAuto();

                var modalInstance = $uibModal.open({
                    templateUrl: '../app/components/partials/updateModal.html',
                    controller: 'ComponentsUpdateController',
                });
            };
        // });
    },
    templateUrl: "../app/menus/partials/topMenu.html"
});
angular.module('bigSQL.common').directive('errSrc', function () {

    return {
    link: function(scope, element, attrs) {

      scope.$watch(function() {
          return attrs['ngSrc'];
        }, function (value) {
          if (!value) {
            element.attr('src', attrs.errSrc);  
          }
      });

      element.bind('error', function() {
        element.attr('src', attrs.errSrc);
      });
    }
  }
});
angular.module('bigSQL.common').directive('progressbar', function () {

    return {
        scope: {
            value: "="
        },
        restrict: 'E',
        template: "<div class='progressBar'><div></div></div>",
        link: function (scope, elem, attr) {

            var progressbar = jQuery(elem).contents();
            var bar = progressbar.find('div');
            scope.$watch('value', function (newVal) {
                if (newVal != undefined) {
                    var progressBarWidth = newVal * progressbar.width() / 100;
                    bar.width(progressBarWidth);
                }
            });
        }
    }
});
angular.module('bigSQL.common').factory('MachineInfo', function (PubSubService, $q, $filter) {
    var machineInfo;
    var logdir;

    //manual or auto 
    var updationMode = "";

    //Need to revise this
    var fetchDataFromService = function () {
        var subscription;
        var session = PubSubService.getSession();
        session.subscribe('com.bigsql.onInfo', function (data) {
            machineInfo = JSON.parse(data[0][0])[0];
            session.unsubscribe(subscription);
        }).then(function (sub) {
            subscription = sub;
        })
        session.call('com.bigsql.info');
    };

    var setUpdationMode = function (machineInfo) {

        try {
            var currentDate = new Date();
            var today = new Date(currentDate);
            var sevenDaysBackDate = new Date();
            sevenDaysBackDate = sevenDaysBackDate.setDate(today.getDate() - 7);
            sevenDaysBackDate = $filter('date')(sevenDaysBackDate, 'yyyy-MM-dd');
            if (machineInfo.interval == null || !machineInfo.interval) {
                updationMode = 'manual'; 
            } else {
                updationMode = 'auto';
            }
        } catch (err) {
            throw new Error(err);
        }
    };

    var getUpdationMode = function () {
        return updationMode;
    };


    var get = function (session) {
        return $q(function (resolve, reject) {
            var subscription;
            session.subscribe('com.bigsql.onInfo', function (data) {
                if (data == null || data == undefined) {
                    reject("No Data Available");
                }
                machineInfo = JSON.parse(data[0][0])[0];
                session.unsubscribe(subscription);
                setUpdationMode(machineInfo);
                resolve(machineInfo);
            }).then(function (sub) {
                subscription = sub;
            });
            session.call('com.bigsql.info');        
        });
    };


    var set = function (info) {
        machineInfo = info;
    };

    return {
        get: get,
        set: set,
        getUpdationMode: getUpdationMode,
        setUpdationMode: setUpdationMode
    }

});
'use strict';

angular.module('bigSQL.common').factory('PubSubService', function ($window, $rootScope, $q, $interval) {
    var connection;
    var session;
    var wsuri;
    var httpUri;

    if ($window.location.origin == "file://") {
        wsuri = "ws://127.0.0.1:8080";

    } else {
        wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
            document.location.host + "/ws";
    }

    //wsuri = "ws://192.168.10.56:8050/ws";

    function getConnection() {
        return connection;
    };

    function initConnection() {
        if (connection == undefined) {
            connection = new autobahn.Connection({
                transports: [
                    {
                        'type': 'websocket',
                        'url': wsuri
                    }
                ],
                realm: "realm1"
            });
        }
    };
    /**
     Opens a connection
     **/
    function openConnection(sessionCreated) {
        connection.open();
        connection.onopen = function (sessionObj) {
            session = sessionObj;
            sessionCreated(session);
        }
    }

    function closeConnection() {
        connection.close('closed', "Connection Closed");
        connection.onclose = function () {
            connection = undefined;
            session = undefined;
        }
    }

    function getSession() {
        return $q(function (resolve, reject) {
            if (session === undefined) {
                if (connection == undefined) {
                    connection = initConnection();
                    resolve(openConnection());
                } else if (connection.session != undefined && connection.session != null) {
                    if (connection.session.isOpen) {
                        session = connection.session;
                        resolve(session);
                    } else {

                        try {
                            var count = 0;
                            var interval = $interval(function () {
                                count++;

                                if (connection.session.isOpen) {
                                    $interval.cancel(interval);
                                    resolve(connection.session);

                                } else if (!connection.session.isOpen && count > 20) {
                                    $interval.cancel(interval);
                                    reject("connection has failed");
                                }

                            }, 100);
                        } catch (err) {
                            throw new Error(err);
                        }
                    }
                }

            } else {
                resolve(session);
                // return session;
            }

        });


    }

    return {
        getConnection: getConnection,
        initConnection: initConnection,
        openConnection: openConnection,
        getSession: getSession,
        closeConnection: closeConnection

    }

});
angular.module('bigSQL.components').controller('ComponentBamUpdateController', ['$rootScope', '$scope', '$stateParams', 'PubSubService', '$state', '$uibModalInstance', 'MachineInfo', 'UpdateBamService','$window', function ($rootScope, $scope, $stateParams, PubSubService, $state, $uibModalInstance, MachineInfo, UpdateBamService,$window) {

    var subscriptions = [];
    var session;
    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;
    });
    function updateComponents(val) {

        session = val;
        $scope.component = {};
        var bamUpdatePromise = UpdateBamService.getBamUpdateInfo();
        bamUpdatePromise.then(function (info) {
            $scope.updateVersion = info.current_version;
            $scope.currentVersion = info.version;
        }, function () {
            throw new Error('failed to subscribe to topic updateComponents', err);
        });


        $scope.redirect = function () {
            $uibModalInstance.dismiss('cancel');
            $window.location.reload(true);
            $rootScope.$emit("bamUpdated");
        };

        $scope.action = function (event) {

            session.call('com.bigsql.update', ['bam2']).then(
                function (sub) {
                    $scope.bamUpdateIntiated = true;
                    $scope.updatingStatus = true;
                    $scope.$apply()
                }, function (err) {
                    throw new Error('failed to install comp', err);
                });
        }

    };


    updateComponents();


    $rootScope.$on('sessionCreated', function () {

        var bamUpdatePromise = UpdateBamService.getBamUpdateInfo();
        bamUpdatePromise.then(function (info) {
            if (info.is_current == 1) {
                $scope.bamUpdatedStatus = true;
            } else {
                $scope.bamNotUpdatedStatus = true;
            }
            $scope.updatingStatus = false;
        }, function () {
            throw new Error('failed to subscribe to topic updateComponents', err);
        });


    }, function (failObj) {
        throw new Error(failObj);
    });


    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    });

}]);
angular.module('bigSQL.components').controller('ComponentDetailsController', ['$scope', '$stateParams', 'PubSubService','$rootScope', '$http', '$window', '$interval', function ($scope, $stateParams, PubSubService, $rootScope, $http, $window, $interval) {

    var subscriptions = [];
    var session;

    var dependentCount = 0;

    var componentStatus = 0;

    $scope.alerts = [];

    $scope.statusColors = {
        "Stopped": "orange",
        "NotInitialized": "yellow",
        "Running": "green"
    }

    var getCurrentObject = function (list, name) {
        var currentObject;
        for (var i = 0; i < list.length; i++) {
            if (list[i].component == name) {
                currentObject = list[i];
                return currentObject;
            }
        }
    };

    function compAction(action) {
            if(action == 'init'){
                $scope.component.spinner = 'Initializing..';
            }else if(action == 'start'){
                $scope.component.spinner = 'Starting..';
            }else if(action == 'stop'){
                $scope.component.spinner = 'Stopping..';
            }else if(action == 'remove'){
                $scope.component.spinner = 'Removing..';
            }else if(action == 'restart'){
                $scope.component.spinner = 'Restarting..';
            }
            var sessionKey = "com.bigsql." + action;
            session.call(sessionKey, [$scope.component.component]);
    };

    function callInfo(argument) {
        $http.get($window.location.origin + '/api/info/' + $stateParams.component)
        .success(function(data) {
            if(data[0]['autostart']== "on" ){
                data[0]['autostart']=true;
            }else{
                data[0]['autostart']=false;
            }
            if(window.location.href.split('/').pop(-1) == data[0].component){
                $scope.component = data[0];
                if($scope.component.status != "Running"){
                    $scope.uibStatus = {
                        tpsChartCollapsed : false,
                        rpsChartCollapsed : false,
                        diskChartCollapsed : true,
                        cpuChartCollapsed : true,
                        connectionsCollapsed : false
                    };
                } else {
                    $scope.uibStatus = {
                        tpsChartCollapsed : true,
                        rpsChartCollapsed : true,
                        diskChartCollapsed : false,
                        cpuChartCollapsed : true,
                        connectionsCollapsed : false
                    };
                }
            }
        });
    };

    function callStatus(argument) {
        $http.get($window.location.origin + '/api/status')
        .success(function(data) {
            componentStatus = getCurrentObject(data, $stateParams.component);
            $rootScope.$emit('componentStatus', componentStatus);
            if (componentStatus.state != $scope.component.status) {
                callInfo();
            }
        });
    }

    callInfo();
    callStatus();

    $interval(callStatus, 5000);

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;
        $scope.component = {};
        // session.call('com.bigsql.infoComponent', [$stateParams.component]);

        // session.subscribe('com.bigsql.status', function (data) {
        //     var list = JSON.parse(data[0]);
        //     componentStatus = getCurrentObject(list, $stateParams.component)
        //     if (componentStatus.state != $scope.component.status) {
        //         session.call('com.bigsql.infoComponent', [$stateParams.component]);
        //     }
        // }).then(function (sub) {
        //     subscriptions.push(sub);
        // });

        var onRemove = function (response) {
            var data = JSON.parse(response[0])[0];
            if (data.status == "error") {
                var alertObj = {
                    msg: data.msg,
                    type: "danger"
                }
                $scope.alerts.push(alertObj);
                $scope.$apply();
            }
            if (data.status == "complete") {
                // session.call('com.bigsql.infoComponent', [$stateParams.component]);
                callInfo();
            }
        };

        session.subscribe('com.bigsql.onRemove', onRemove).then(
            function (sub) {
                subscriptions.push(sub);
            });

        session.subscribe('com.bigsql.onInit', function (data) {
            var res = JSON.parse(data[0])[0];
            if(res['status'] == 'error'){
                $scope.alerts.push({
                    msg: res['msg'],
                    type: "danger"
                });
            } else {
                $scope.alerts.push({
                    msg: res['msg']
                });
                $scope.component.spinner = res['msg'];
                compAction('start');
            }
            $scope.$apply();
        }).then(function (sub) {
            subscriptions.push(sub);
        });
        
        session.subscribe('com.bigsql.onInfoComponent', function (args) {
            var jsonD = JSON.parse(args[0][0]);
            if(window.location.href.split('/').pop(-1) == jsonD[0].component){
                $scope.component = jsonD[0];
                $scope.$apply();
            }
        }).then(function (sub) {
            $rootScope.$emit('topMenuEvent');
            subscriptions.push(sub);
        });
        $scope.isCollapsed2 = true;

        $scope.action = function (event) {
            if (event.target.tagName === "A") {
                if(event.target.attributes.action.value == 'init'){
                    $scope.component.spinner = 'Initializing..';
                }else if(event.target.attributes.action.value == 'start'){
                    $scope.component.spinner = 'Starting..';
                }else if(event.target.attributes.action.value == 'stop'){
                    $scope.component.spinner = 'Stopping..';
                }else if(event.target.attributes.action.value == 'remove'){
                    $scope.component.spinner = 'Removing..';
                }
                var sessionKey = "com.bigsql." + event.target.attributes.action.value;
                session.call(sessionKey, [$scope.component.component]);
            }
        };

        session.subscribe('com.bigsql.onInstall', function (response) {
            var data = JSON.parse(response[0])[0];

            if (data.state == "deplist") {
                if (data.deps.length > 1) {
                    dependentCount = data.deps.length;
                    $scope.component.installationDependents = true;
                }
            } else if (data.status == "start") {
                $scope.component.installationStart = data;
                $scope.component.installation = true;
                if ($stateParams.component == data.component) {
                    delete $scope.component.installationDependents;
                } else {
                    $scope.component.installationDependents = true;   
                }
            } else if (data.status == "wip") {
                $scope.component.installationRunning = data;
                $scope.component.progress = data.pct;
            } else if (data.status == "complete" || data.status == "cancelled") {
                
                if (data.state == 'unpack') {
                    // session.call('com.bigsql.infoComponent', [$stateParams.component])
                    callInfo();
                    compAction('init');
                } 
                if (data.status == "cancelled") {
                        $scope.alerts.push({
                            msg:  data.msg,
                            type: 'danger'
                        });
                }

                delete $scope.component.installationStart;
                delete $scope.component.installationRunning;
                // delete $scope.component.installation;

            }

            if (data.state == "error") {
                $scope.alerts.push({
                    msg: data.msg,
                    type: 'danger'
                });
                delete $scope.component.installation;
            }
            $scope.$apply();
        }).then(function (sub) {
            subscriptions.push(sub);
        });

    });

    $scope.cancelInstallation = function (action) {
        session.call("com.bigsql.cancelInstall");
    }

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    });

}]);
angular.module('bigSQL.components').controller('ComponentDetailsPg95Controller', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval','MachineInfo', '$http', '$window', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, $http, $window) {

    $scope.alerts = [];
    var subscriptions = [];
    var session = PubSubService.getSession();

    var infoRefreshRate;
    var dependentCount = 0;

    var componentStatus = 0;

    var activityTab = angular.element( document.querySelector( '#activityTab' ) );

    function compAction(action) {
        if(action == 'init'){
            $scope.component.spinner = 'Initializing..';
        }else if(action == 'start'){
            $scope.component.spinner = 'Starting..';
        }else if(action == 'stop'){
            $scope.component.spinner = 'Stopping..';
        }else if(action == 'remove'){
            $scope.component.spinner = 'Removing..';
        }else if(action == 'restart'){
            $scope.component.spinner = 'Restarting..';
        }
        var sessionKey = "com.bigsql." + action;
        session.call(sessionKey, [$scope.component.component]).then(function(argument) {
            callInfo();
        })
    }

    function callInfo(argument) {
        $http.get($window.location.origin + '/api/info/' + $stateParams.component)
        .success(function(data) {
            if(data[0]['autostart']== "on" ){
                data[0]['autostart']=true;
            }else{
                data[0]['autostart']=false;
            }
            if(window.location.href.split('/').pop(-1) == data[0].component){
                $scope.component = data[0];
                if($scope.component.status != "Running"){
                    $scope.uibStatus = {
                        tpsChartCollapsed : false,
                        rpsChartCollapsed : false,
                        diskChartCollapsed : true,
                        cpuChartCollapsed : true,
                        connectionsCollapsed : false
                    };
                } else {
                    $scope.uibStatus = {
                        tpsChartCollapsed : true,
                        rpsChartCollapsed : true,
                        diskChartCollapsed : false,
                        cpuChartCollapsed : true,
                        connectionsCollapsed : false
                    };
                }
            }
        });
    };

    function callStatus(argument) {
        $http.get($window.location.origin + '/api/status')
        .success(function(data) {
            componentStatus = getCurrentObject(data, $stateParams.component);
            $rootScope.$emit('componentStatus', componentStatus);
            if (componentStatus.state != $scope.component.status) {
                callInfo();
            }
        });
    }

    callInfo();
    callStatus();

    $interval(callStatus, 5000);

    $scope.statusColors = {
        "Stopped": "orange",
        "NotInitialized": "yellow",
        "Running": "green"
    };

    $scope.optionList = [ 
        {label :"Off", value: "0"},
        {label :"5", value: ""},
        {label :"10", value: "10000"},
        {label :"15", value: "15000"},
        {label :"30", value: "30000"}
    ]

    $scope.opt = {
        interval : ''
    }

    var getCurrentObject = function (list, name) {
        var currentObject;
        for (var i = 0; i < list.length; i++) {
            if (list[i].component == name) {
                currentObject = list[i];
                return currentObject;
            }
        }
    };

    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
            $rootScope.$emit('topMenuEvent');
        });
    });

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    session = val;
    infoRefreshRate = $interval(callInfo, 60000);
    $scope.component = {};
    callInfo();
    // session.call('com.bigsql.infoComponent', [$stateParams.component]);

    // session.subscribe('com.bigsql.status', function (data) {
    //     var list = JSON.parse(data[0]);
    //     componentStatus = getCurrentObject(list, $stateParams.component);
    //     $rootScope.$emit('componentStatus', componentStatus);
    //     if (componentStatus.state != $scope.component.status) {
    //         callInfo();
    //         session.call('com.bigsql.infoComponent', [$stateParams.component]);
    //     }
    // }).then(function (sub) {
    //     subscriptions.push(sub);
    // });

    $scope.changeOption = function (value) {
        $rootScope.$emit('refreshRateVal',$scope.opt.interval);
    };

    $scope.autostartChange = function (args) {
        var autoStartVal;
        if(args){
            autoStartVal = 'on';
        } else {
            autoStartVal = 'off';       
        }
        session.call('com.bigsql.autostart',[autoStartVal,$stateParams.component]).then(
            function (sub) {
                callInfo();
                // session.call('com.bigsql.infoComponent', [$stateParams.component]); 
            });
    }

    $scope.dataBaseTabEvent = function (args) {
        if ($scope.component.status == "Running"){
            session.call('com.bigsql.db_list', [$stateParams.component]);
        }
    };

    $scope.cancelInstallation = function (action) {
        session.call("com.bigsql.cancelInstall");
    }

    session.subscribe('com.bigsql.ondblist', function (data) {
        if(data[0].component == $stateParams.component){
            $scope.myData = data[0].list;
            $scope.gridOptions = { data : 'myData', columnDefs: [{
                field: "datname", displayName: "Database"
            },{
                field:'owner', displayName: "Owner"
            },{
                field: 'size', displayName: "Size (MB)", cellClass:'numberCell',headerTooltip: 'This is the total disk space used by the database, which includes all the database objects like Tables and Indexes within that database' , sort: { direction: 'desc', priority: 0 }
            }], enableColumnMenus: false
        };
            $scope.$apply();
        }
    });

    $scope.configureTabEvent = function (args) {
        if ($scope.component.status == "Running"){
            session.call('com.bigsql.pg_settings', [$stateParams.component]);
        }
    };

    session.subscribe('com.bigsql.onPGsettings', function (data) {
        if(data[0].component == $stateParams.component){
            $scope.settingsData = data[0].list;
            $scope.gridSettings = {
                expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height: 140px"></div>',
            };

            $scope.gridSettings.columnDefs = [
                { field:"name", displayName:'Category'}
              ];

            $scope.gridSettings.enableColumnMenus = false;

            data = data[0].list;
            for(var i = 0; i < data.length; i++){
                data[i].subGridOptions = {
                  columnDefs: [ 
                  { field: "name", displayName: "Parameter", cellTemplate: '<div class="ui-grid-cell-contents" title="{{row.entity.short_desc}}"><a>{{ COL_FIELD }}</a></div>'},
                  { field:"setting", displayName:"value"},
                  { field:"short_desc", visible: false}],
                  data: data[i].settings,
                  enableColumnMenus : false
                }
            }
            $scope.gridSettings.data = data;

            $scope.$apply();
        }
    });

    $scope.securityTabEvent = function (args) {
        session.call('com.bigsql.read_pg_hba_conf', [$stateParams.component]);
    };

    session.subscribe('com.bigsql.onPGhba', function (data) {
        if(data[0].component == $stateParams.component){
            $scope.securityTabContent = data[0].contents;
            $scope.$apply();
        }
    });

    session.subscribe('com.bigsql.onAutostart', function (data) {
        var res = JSON.parse(data[0])[0];
        if(res['status'] == "error"){
            $scope.alerts.push({
                msg: res['msg'],
                type: "danger"
            });
        }else if(res['status'] == "completed"){
           $scope.alerts.push({
                msg: res['msg']
            }); 
        }
        $scope.$apply();
    }).then(function (sub) {
        subscriptions.push(sub);
    });

    var onRemove = function (response) {
        var data = JSON.parse(response[0])[0];
        if (data.status == "error") {
            var alertObj = {
                msg: data.msg,
                type: "danger"
            }
            $scope.alerts.push(alertObj);
            $scope.$apply();
        }
        if (data.status == "complete") {
            callInfo();
            // session.call('com.bigsql.infoComponent', [$stateParams.component]);
        }
    };

    session.subscribe('com.bigsql.onRemove', onRemove).then(
        function (sub) {
            subscriptions.push(sub);
        });


    session.subscribe('com.bigsql.onInit', function (data) {
        var res = JSON.parse(data[0])[0];
        if(res['status'] == 'error'){
            $scope.alerts.push({
                msg: res['msg'],
                type: "danger"
            });
        } else {
            $scope.alerts.push({
                msg: res['msg']
            });
            compAction('start');
        }
        $scope.$apply();
    }).then(function (sub) {
        subscriptions.push(sub);
    });

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    // function callInfo() {
        // session.call('com.bigsql.infoComponent', [$stateParams.component]);
    // }

    session.subscribe('com.bigsql.onActivity', function (data) {
        if(data[0].component == $stateParams.component){
            var parseData =  data[0].activity;
            if (parseData === undefined || parseData.length == 0) {
                $scope.activities = '';
                $scope.noActivities = true;
                activityTab.empty();
            } else {
                $scope.noActivities = false;
                $scope.activities = parseData;
            }
        }
    }).then(function (sub) {
        subscriptions.push(sub);
    });

    // session.subscribe('com.bigsql.onInfoComponent', function (args) {
    //     var jsonD = JSON.parse(args[0][0]);
    //     if(jsonD[0]['autostart']== "on" ){
    //         jsonD[0]['autostart']=true;
    //     }else{
    //         jsonD[0]['autostart']=false;
    //     }
    //     if(window.location.href.split('/').pop(-1) == jsonD[0].component){
    //         $scope.component = jsonD[0];
    //         if($scope.component.status != "Running"){
    //             $scope.uibStatus = {
    //                 tpsChartCollapsed : false,
    //                 rpsChartCollapsed : false,
    //                 diskChartCollapsed : true,
    //                 cpuChartCollapsed : true,
    //                 connectionsCollapsed : false
    //             };
    //         } else {
    //             $scope.uibStatus = {
    //                 tpsChartCollapsed : true,
    //                 rpsChartCollapsed : true,
    //                 diskChartCollapsed : false,
    //                 cpuChartCollapsed : true,
    //                 connectionsCollapsed : false
    //             };
    //         }
    //         $scope.$apply();
    //     }
    // }).then(function (sub) {
    //     subscriptions.push(sub);
    // });

    $scope.logdirSelect = function () {
        $interval.cancel(infoRefreshRate);
    }

    session.subscribe('com.bigsql.onInstall', function (response) {
        var data = JSON.parse(response[0])[0];
        if (data.state == "deplist") {
            if (data.deps.length > 1) {
                dependentCount = data.deps.length;
                $scope.component.installationDependents = true;
            }
        }
        if (data.status == "start") {
            $scope.component.installationStart = data;
            $scope.component.installation = true;
        }
        if (data.status == "wip") {
            $scope.component.installationRunning = data;
            $scope.component.progress = data.pct;
        }

        if (data.status == "complete" || data.status == "cancelled") {
            if (data.state == 'unpack') {
                // session.call('com.bigsql.infoComponent', [$stateParams.component]);
                compAction('init');
            }

            if (data.status == "cancelled") {
                $scope.alerts.push({
                    msg:  data.msg,
                    type: 'danger'
                });
            }

            if (dependentCount != 0) {
                dependentCount = dependentCount - 1;
                if (dependentCount == 0) {
                    delete $scope.component.installationDependents;
                }
            }

            delete $scope.component.installationStart;
            delete $scope.component.installationRunning;
            // delete $scope.component.installation;

        }
        if (data.state == "error") {
            $scope.alerts.push({
                msg: data.msg,
                type: 'danger'
            });
            delete $scope.component.installationStart;
            delete $scope.component.installationRunning;
            delete $scope.component.installation;
        }
        $scope.$apply();
    }).then(function (sub) {
        subscriptions.push(sub);
    });
    });

    $scope.action = function (event) {
        if (event.target.tagName === "A") {
            if(event.target.attributes.action.value == 'init'){
                $scope.component.spinner = 'Initializing..';
            }else if(event.target.attributes.action.value == 'start'){
                $scope.component.spinner = 'Starting..';
            }else if(event.target.attributes.action.value == 'stop'){
                $scope.component.spinner = 'Stopping..';
            }else if(event.target.attributes.action.value == 'remove'){
                $scope.component.spinner = 'Removing..';
            }else if(event.target.attributes.action.value == 'restart'){
                $scope.component.spinner = 'Restarting..';
            }
            var sessionKey = "com.bigsql." + event.target.attributes.action.value;
            session.call(sessionKey, [$scope.component.component]);
        }
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
        $interval.cancel(infoRefreshRate);
    });

}]);
angular.module('bigSQL.components').controller('ComponentsLogController', ['$scope', 'PubSubService', '$state','$interval','$location', '$http', '$window', '$rootScope', function ($scope, PubSubService, $state, $interval, $location, $http, $window, $rootScope) {

    var subscriptions = [];
    var count = 1;
    $scope.components = {};
    var autoScroll = true;
    $scope.logfile;
    $scope.intervalPromise = null;

    var session;
    var logviewer = angular.element( document.querySelector( '#logviewer' ) );

    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
            $rootScope.$emit('topMenuEvent');
        });
    });

    function callInfo(argument) {
        $http.get($window.location.origin + '/api/info')
        .success(function(data) {
            $scope.pgcInfo = data[0];
        });
    }


    callInfo();
    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;
        var logComponent = $location.path().split('log/').pop(-1);
        $scope.selectComp = "#"+$location.path();
        if (logComponent != 'pgcli'){
            session.call('com.bigsql.infoComponent',[logComponent]);
        } else {
            $scope.logfile = 'pgcli';
            $scope.intervalPromise;
            session.call('com.bigsql.selectedLog',['pgcli']);  
        }
        
        session.subscribe('com.bigsql.onInfoComponent', function (args) {
            if (count == 1) {
                var jsonD = JSON.parse(args[0][0]);
                if(window.location.href.split('/').pop(-1) == jsonD[0].component){
                    if(jsonD[0].current_logfile){
                        $scope.logfile = jsonD[0].current_logfile;
                    } 
                    session.call('com.bigsql.selectedLog',[$scope.logfile]);
                    $scope.intervalPromise;
                }
                count += 1;
            }
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        session.subscribe("com.bigsql.pgcliDir", function (dir) {
            $scope.selectedLog = dir[0];
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        session.call('com.bigsql.checkLogdir');

        session.subscribe("com.bigsql.onCheckLogdir", function (components) {
            $scope.components = JSON.parse(components[0]);
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        session.subscribe("com.bigsql.log", function (lg) {
            on_log(lg);
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        session.subscribe("com.bigsql.logError", function (err) {
            $("#logviewer").empty();
            $("#logviewer").append("<h4><br />" + err[0] + "</h4>");
        }).then(function (sub) {
            subscriptions.push(sub);
        });

        $scope.intervalPromise = $interval(function(){
                                    if($scope.logfile != undefined){
                                        session.call('com.bigsql.liveLog',[$scope.logfile]);                                        
                                    }
                                 },5000);

        var tab = 1000;

        $scope.setTab = function (tabId) {
            tab = tabId;
        };

        $scope.isSet = function (tabId) {
            return tab === tabId;
        };

        $scope.selectedButton;

        $scope.selectButton = function(id) {
            $scope.selectedButton = id;
        }

    });

    $scope.isAutoScroll = function () {
        return autoScroll;
    }

    $scope.stopScrolling = function (event) {
        if (event.target.value == "checked"){
            event.target.value = "unchecked";
            $scope.checked = false;
            autoScroll = false;
        } else{
            event.target.value = "checked";
            autoScroll = true; 
        }      
    }

    function on_log(args) {
        $("#logviewer").append("<br />" + args[0]);
        if(autoScroll){
            tailScroll();
        }           
    };

    function tailScroll() {
        var height = $("#logviewer").get(0).scrollHeight;
        $("#logviewer").animate({
            scrollTop: height
        }, 5);
    };



    $scope.action = function (event) {
        logviewer.empty();
        session.call('com.bigsql.logIntLines',[event, $scope.logfile]);
    };

    $scope.onLogCompChange = function () {
        $interval.cancel($scope.intervalPromise);
        $window.location.href = $scope.selectComp;
    }

    /**
     Unsubscribe to all the apis on the template and scope destroy
     **/
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    });

}]);

angular.module('bigSQL.components').controller('ComponentsSettingsController', ['$rootScope', '$scope', '$uibModal', 'PubSubService', 'MachineInfo', 'UpdateComponentsService', '$http', '$window', function ($rootScope, $scope, $uibModal, PubSubService, MachineInfo, UpdateComponentsService, $http, $window) {
    $scope.alerts = [];

    var session;
    var subscriptions = [];
    $scope.updateSettings;
    $scope.components = {};
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
            controller: 'ComponentsUpdateController',
        });
    };

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        $rootScope.$emit('topMenuEvent');
        session = val;

        function callInfo(argument) {
            $http.get($window.location.origin + '/api/info')
            .success(function(data) {
                $scope.pgcInfo = data[0];
                if (data[0].last_update_utc) {
                    $scope.lastUpdateStatus = new Date(data[0].last_update_utc.replace(/-/g, '/') + " UTC").toString().split(' ',[5]).splice(1).join(' ');
                }
                if (MachineInfo.getUpdationMode() == "manual") {
                    $scope.settingType = 'manual';
                } else {
                    $scope.settingType = 'auto';
                    session.call('com.bigsql.get_host_settings');
                }

            });
        }
        callInfo();
        // var promise = MachineInfo.get(session);
        // promise.then(function (data) {
        //     $scope.pgcInfo = data;
            
        // });
        
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

    });

    function callInfo(argument) {
        $http.get($window.location.origin + '/api/info')
        .success(function(data) {
            $scope.pgcInfo = data[0];
        });
    }


    callInfo();

    /**
     Unsubscribe to all the apis on the template and scope destroy
     **/
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }

    });

}]);
angular.module('bigSQL.components').controller('ComponentsStatusController', ['$scope', 'PubSubService', 'MachineInfo', '$interval', '$rootScope', '$http', '$window', function ($scope, PubSubService, MachineInfo, $interval, $rootScope, $http, $window) {

    var subscriptions = [];
    $scope.comps = {};
    var session;
    var refreshRate;
    var currentComponent = {};
    var graphData = [0, 1, 2, 3, 4, 5, 6, 8, 9, 10];

    function callStatus(argument) {
        $http.get($window.location.origin + '/api/status')
        .success(function(data) {
            $scope.comps = data;
            if($scope.comps.length == 0){
                $scope.showMsg = true;
            } else{
                $scope.showMsg = false;
            }
        });
    }

    function callInfo(argument) {
        $http.get($window.location.origin + '/api/info')
        .success(function(data) {
            $scope.pgcInfo = data[0];
        });
    }


    callStatus();
    callInfo();

    $interval(callStatus, 5000);

    $scope.alerts = [];
    $scope.init = false;
    $scope.statusColors = {
        "Stopped": "orange",
        "Not Initialized": "yellow",
        "Running": "green"
    };


    var apis = {
        "Stop": "com.bigsql.stop",
        "Restart": "com.bigsql.restart",
        "Initialize": "com.bigsql.init",
        "Start": "com.bigsql.start",
        "Remove": "com.bigsql.remove"
    };

    var getCurrentComponent = function (name) {
        for (var i = 0; i < $scope.comps.length; i++) {
            if ($scope.comps[i].component == name) {
                currentComponent = $scope.comps[i];
                return currentComponent;
            }
        }
    };
    
    $scope.cpuChart = {
        chart: {
            type: 'lineChart',
            height: 150,
            margin : {
                top: 20,
                right: 40,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            noData:"Loading...",
            interactiveLayer : {
                tooltip: {
                    headerFormatter: function (d) { 
                        var point = new Date(d);
                        return d3.time.format('%Y/%m/%d %H:%M:%S')(point); 
                    },
                },
            },
            xAxis: {
                xScale: d3.time.scale(),
                    tickFormat: function(d) { 
                        var point = new Date(d); 
                        return d3.time.format('%H:%M:%S')(point) 
                    },
                },
            yAxis: {
                tickFormat: function(d) { 
                    return d3.format(',')(d);
                }
            },
            forceY: [0,100],
            useInteractiveGuideline: true,
            duration: 500
        }
    };
    $scope.ioChart = angular.copy($scope.cpuChart);
    $scope.cpuChart.chart.type = "stackedAreaChart";
    $scope.cpuChart.chart.showControls = false;

    $scope.cpuData = [{
            values: [],      
            key: 'CPU System %', 
            color: '#006994' ,
            area: true 
        },{
            values: [],      
            key: 'CPU User %', 
            color: '#FF5733',
            area: true
        }
        ];

    $scope.diskIO = [{
        values: [],
        key: 'Read Bytes (MB)',
        color: '#FF5733'
    },{
        values: [],
        key: 'Write Bytes (MB)',
        color: '#006994'
    }];

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        $rootScope.$emit('topMenuEvent');
        session = val;
        // var promise = MachineInfo.get(session);
        // promise.then(function (data) {
        //     $scope.pgcInfo = data;
        // }, function (msg) {
        //     throw new Error(msg);
        // });


        // session.subscribe("com.bigsql.onServerStatus", function (components) {
        //     $scope.comps = JSON.parse(components[0]);
        //     if($scope.comps.length == 0){
        //         $scope.showMsg = true;
        //     } else{
        //         $scope.showMsg = false;
        //     }
        // }).then(function (subscription) {
        //     subscriptions.push(subscription);
        // });

        // session.subscribe("com.bigsql.status", function (components) {
        //     $scope.comps = JSON.parse(components[0]);
        //     if($scope.comps.length == 0){
        //         $scope.showMsg = true;
        //     }else{
        //         $scope.showMsg = false;
        //     }
        // }).then(function (subscription) {
        //     subscriptions.push(subscription);
        // });

        session.subscribe("com.bigsql.graphs", function (data) {
            if($scope.cpuData[0].values.length > 60){
                $scope.cpuData[0].values.shift();
                $scope.cpuData[1].values.shift();
                $scope.diskIO[0].values.shift();
                $scope.diskIO[1].values.shift();             
            }
            var timeVal = Math.round( (new Date(data[0]['time'] + ' UTC')).getTime() )
            $scope.cpuData[0].values.push({x:timeVal, y:data[0]['cpu_per']['system']});
            $scope.cpuData[1].values.push({x:timeVal, y:data[0]['cpu_per']['user']});
            $scope.diskIO[0].values.push({x:timeVal,y:data[0]['io']['read_bytes']});
            $scope.diskIO[1].values.push({x:timeVal,y:data[0]['io']['write_bytes']});
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        session.subscribe("com.bigsql.initgraphs", function (data) {
            var graph_data = data[0];
            $scope.cpuData[1].values.length = 0;
            $scope.cpuData[0].values.length = 0;
            $scope.diskIO[0].values.length = 0;
            $scope.diskIO[1].values.length = 0;
            for (var i=0;i<graph_data.length;i=i+1){
                var timeVal = Math.round( (new Date( graph_data[i]['time'] + ' UTC')).getTime() );
                $scope.cpuData[0].values.push({x:timeVal, y:graph_data[i]['cpu_per']['system']});
                $scope.cpuData[1].values.push({x:timeVal, y:graph_data[i]['cpu_per']['user']});
                $scope.diskIO[0].values.push({ x: timeVal,  y: graph_data[i]['io']['read_bytes']});
                $scope.diskIO[1].values.push({ x: timeVal,  y: graph_data[i]['io']['write_bytes']})
            }
            if( $scope.cpuData.length <= 2){
                $scope.cpuChart.chart.noData = "No Data Available."
            }
            if( $scope.diskIO.length <= 2){
                $scope.ioChart.chart.noData = "No Data Available."
            }

        }).then(function (subscription) {
            subscriptions.push(subscription);
             refreshRate = $interval(callGraphs,5000);
        });

        // session.call("com.bigsql.serverStatus");

        session.call("com.bigsql.initial_graphs");



        session.subscribe('com.bigsql.onInit', function (data) {
            var res = JSON.parse(data[0])[0];
            if(res['status'] == 'error'){
                $scope.alerts.push({
                    msg: res['msg'],
                    type: "danger"
                });
            } else {
                $scope.alerts.push({
                    msg: res['msg']
                });
            currentComponent.showingSpinner = false;
            }
        }).then(function (sub) {
            subscriptions.push(sub);
        }); 

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

    });


    $scope.action = function (event) {
        var showingSpinnerEvents = ['Initialize', 'Start', 'Stop'];
        if(showingSpinnerEvents.indexOf(event.target.innerText) >= 0 ){
            currentComponent = getCurrentComponent(event.currentTarget.getAttribute('value'));
            currentComponent.showingSpinner = true;
        }
        if (event.target.tagName == "A") {
            session.call(apis[event.target.innerText], [event.currentTarget.getAttribute('value')]);
        }
        ;
    };


    function callGraphs() {
        session.call('com.bigsql.live_graphs');
    }


    /**
     Unsubscribe to all the apis on the template and scope destroy
     **/
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        };
        $interval.cancel(refreshRate);
    });


}]);
angular.module('bigSQL.components').controller('ComponentsUpdateController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$http', '$window', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $http, $window) {

    var session;
    var subscriptions = [];
    $scope.components = {};

    var updateSelectedList = [];
    var currentComponent = {};
    var checkUpdates;   

    function getList(argument) {
        $http.get($window.location.origin + '/api/list')
        .success(function(data) {
            $scope.noUpdates = true;
            $scope.components = data;
            $scope.hideLatestInstalled = false;


            for (var i = 0; i < $scope.components.length; i++) {
                if($scope.components[i].is_current == 0 && $scope.components[i].current_version){
                    $scope.noUpdates = false;
                }
                if($scope.components[i].is_new == 1){
                    $scope.hideNewComponents = true;
                }
                if($scope.components[i].is_updated == 1){
                    $scope.hideLatestInstalled = false;
                }
                try{
                    if (UpdateComponentsService.get().component == $scope.components[i].component) {
                        $scope.components[i]['selected'] = true;
                    } else {
                        $scope.components[i]['selected'] = false;
                    }
                } catch(err){}
            }
        });
    };

    if (UpdateComponentsService.get()) {
        $scope.selectedComp = UpdateComponentsService.get();
    }
    ;

    if (UpdateComponentsService.getCheckUpdates()) {
        checkUpdates = true;
    } else {
        checkUpdates = false;
    }
    
    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        $scope.updateSettings = MachineInfo.getUpdationMode();
        session = val;
        if (!checkUpdates) {
            $scope.body = true;
            // session.call('com.bigsql.list');
            getList();
        } else {
            $scope.loadingSpinner = true;
            $scope.body = false;
            session.call('com.bigsql.updatesCheck').then(
                function (sub) {
                    $scope.loadingSpinner = false;
                    $scope.body = true;
                    getList();
                    // session.call('com.bigsql.list');
                });
        }

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        // session.subscribe("com.bigsql.onList", function (components) {
        //     $scope.noUpdates = true;
        //     $scope.components = JSON.parse(components[0][0]);

        //     for (var i = 0; i < $scope.components.length; i++) {
        //         if($scope.components[i].is_current == 0 && $scope.components[i].current_version){
        //             $scope.noUpdates = false;
        //         }
        //         try{
        //             if (UpdateComponentsService.get().component == $scope.components[i].component) {
        //                 $scope.components[i]['selected'] = true;
        //             } else {
        //                 $scope.components[i]['selected'] = false;
        //             }
        //         } catch(err){}
        //     }
            
        //     $scope.$apply();
        // }).then(function (subscription) {
        //     subscriptions.push(subscription);
        // });

        var getCurrentComponent = function (name) {
            for (var i = 0; i < $scope.components.length; i++) {
                if ($scope.components[i].component == name) {
                    currentComponent = $scope.components[i];
                    return currentComponent;
                }
            }
        };

        session.subscribe("com.bigsql.onInstall", function (installStream) {
            var data = JSON.parse(installStream[0])[0];
            if (data.status == "start") {
                currentComponent = getCurrentComponent(data.component);
                currentComponent.installationStart = data;
                currentComponent.installation = true;
            } else if (data.status == "wip") {
                currentComponent = getCurrentComponent(data.component);
                currentComponent.installationRunning = data;
                currentComponent.progress = data.pct;
            } else if (data.status == "complete" && data.state == "download") {
                currentComponent = getCurrentComponent(data.component);
                delete currentComponent.installationStart;
                delete currentComponent.installationRunning;
                delete currentComponent.installation;
            } else if (data.status == "complete" && data.state == "update") {
                delete currentComponent.installationStart;
                delete currentComponent.installationRunning;
                delete currentComponent.installation;
                angular.element(document.querySelector('#' + currentComponent.component)).remove();
                if (selUpdatedComp.length > 0) {
                    var popListComp = selUpdatedComp.pop();
                    $scope.compAction('update', popListComp.component);
                } else {
                    session.call("com.bigsql.getBamConfig");
                    $uibModalInstance.dismiss('cancel');
                }
            }
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        $scope.compAction = function (action, compName) {
            var sessionKey = "com.bigsql." + action;
            session.call(sessionKey, [compName]);
        };

        var selUpdatedComp = [];

        $scope.selectedUpdate = function (val) {
            for (var i = 0; i < $scope.components.length; i++) {
                if ($scope.components[i].selected && $scope.components[i].current_version) {
                    selUpdatedComp.push($scope.components[i]);
                }
            }
            if (selUpdatedComp.length > 1) {
                var popComp = selUpdatedComp.pop().component;
                $scope.compAction('update', popComp);
            } else {
                session.call('com.bigsql.update', [selUpdatedComp[0].component]).then(function (sub) {
                    // session.call("com.bigsql.list");
                    $uibModalInstance.dismiss('cancel');
                }, function (err) {
                    throw new Error('failed to update comp', err);
                });
            }
        };

    });

    $scope.cancelInstallation = function (action) {
        session.call("com.bigsql.cancelInstall");
    }

    /**
     Unsubscribe to all the apis on the template and scope destroy
     **/
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }

    });

}]);

angular.module('bigSQL.components').controller('ComponentsViewController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', '$http', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, $http) {

    $scope.alerts = [];

    var subscriptions = [];
    $scope.components = {};

    var currentComponent = {};
    var parentComponent = {};
    var dependentCount = 0;
    var depList = [];
    var session;
    var pid;
    var getListCmd = false;
    $scope.updateSettings;
    $scope.loading = true;
    $scope.retry = false;
    $scope.disableShowInstalled = false;

    var getCurrentComponent = function (name) {
        for (var i = 0; i < $scope.components.length; i++) {
            if ($scope.components[i].component == name) {
                currentComponent = $scope.components[i];
                return currentComponent;
            }
        }
    };

    function changePostgresOrder(data) {
        var comps = data;
        var pgComps = [];
        var nonPgComps = [];

        for (var i = 0; i < comps.length; i++) {
            if(comps[i]['category_desc'] == 'PostgreSQL'){
                pgComps.push(comps[i]);
            }else{
                nonPgComps.push(comps[i]);
            };
        }
        return  pgComps.reverse().concat(nonPgComps);
    }

    function getList(argument) {
        $http.get($window.location.origin + '/api/list')
        .success(function(data) {
            $scope.nothingInstalled = false;
            if ($scope.showInstalled) {
                $scope.components = changePostgresOrder($(data).filter(function(i,n){ return n.status != "NotInstalled" ;}));
                if($scope.components.length == 0){
                    $scope.components = [];
                    $scope.nothingInstalled = true;
                }
            } else{
                    $scope.components = changePostgresOrder(data);
            }
            $scope.loading = false;
            for (var i = 0; i < $scope.components.length; i++) {
                $scope.components[i].progress = 0;
            }
            var Checkupdates = 0;
            for (var i = 0; i < $scope.components.length; i++) {
                Checkupdates += $scope.components[i].updates;
            }
        })
        .error(function(error) {
            $timeout(wait, 5000);
            $scope.loading = false;
            $scope.retry = true;
        });
    };

    function callInfo(argument) {
        $http.get($window.location.origin + '/api/info')
        .success(function(data) {
            $scope.pgcInfo = data[0];
        });
    }


    callInfo();

    getList();

    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
        });
    });

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;

        session.call('com.bigsql.info');

        $scope.open = function (manual) {

            try {
                UpdateComponentsService.set(this.c);
            } catch (err) {};

            if (manual == "manual") {
                UpdateComponentsService.setCheckUpdatesManual();
            } else {
                UpdateComponentsService.setCheckUpdatesAuto();
            }
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/updateModal.html',
                controller: 'ComponentsUpdateController',
            });
        };

        session.call('com.bigsql.getBamConfig', ['showInstalled']);
        session.subscribe("com.bigsql.onGetBamConfig", function (settings) {
           $scope.showInstalled = settings[0];
           $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        // session.call('com.bigsql.list').then(
        //     function (subscribe) {
        //         $rootScope.$emit('topMenuEvent');
        //     }, function (error) {
        //         $timeout(wait, 5000);
        //         $scope.loading = false;
        //         $scope.retry = true;
        //     }
        // );

        session.call('com.bigsql.getTestSetting');
        session.subscribe("com.bigsql.onGetTestSetting", function (settings) {
            if(settings[0] == "test"){
               $scope.isList = true;
            }else{
                $scope.isList = false;
            }
           $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        function wait() {
            $window.location.reload();
        };

        session.subscribe("com.bigsql.onList", function (components) {
            $scope.nothingInstalled = false;
            if ($scope.showInstalled) {
                $scope.components = $(JSON.parse(components[0][0])).filter(function(i,n){ return n.status != "NotInstalled" ;});
                if($scope.components.length == 0){
                    $scope.components = [];
                    $scope.nothingInstalled = true;
                }
            } else{
                $scope.components = JSON.parse(components[0][0]);                
            }
            $scope.loading = false;
            for (var i = 0; i < $scope.components.length; i++) {
                $scope.components[i].progress = 0;
            }
            var Checkupdates = 0;
            for (var i = 0; i < $scope.components.length; i++) {
                Checkupdates += $scope.components[i].updates;
            }
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        session.subscribe("com.bigsql.onInfo", function (machineInfo) {
            $scope.machineInfo = JSON.parse(machineInfo[0][0]);
            var myDate = new Date();
            var previousDay = new Date(myDate);
            previousDay.setDate(myDate.getDate() - 7);
            $scope.prevWeek = $filter('date')(previousDay, 'yyyy-MM-dd');
            for (var i = 0; i < $scope.machineInfo.length; i++) {
                if ($scope.machineInfo[i].interval == null) {
                    if ($scope.machineInfo[i].last_update_utc == null || $scope.machineInfo[i].last_update_utc < $scope.prevWeek) {
                        $scope.updateBtn = true;
                    }
                }
            }
            if ($scope.machineInfo.interval == null || !$scope.machineInfo.interval) {
                $scope.updateSettings = 'manual'; 
            } else {
                $scope.updateSettings = 'auto';
            }
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        session.subscribe('com.bigsql.onInit', function (data) {
            var res = JSON.parse(data[0])[0];
            if(res['status'] == 'error'){
                $scope.alerts.push({
                    msg: res['msg'],
                    type: "danger"
                });
                delete currentComponent.init;
                $scope.disableShowInstalled = false;
            } else {
                $scope.alerts.push({
                    msg: res['msg']
                });
                currentComponent = getCurrentComponent(res['component']);
                currentComponent.status = "Installed";
                currentComponent.init = false;
                $scope.disableShowInstalled = false;
                $scope.compAction('start', res['component']);
            }
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });
    
        $scope.setTest = function (event) {
            var param;
            if($scope.isList){
                param = 'test';
            }else{
                param = 'prod'
            }
            session.call('com.bigsql.setTestSetting',[param]);
            getList();
            // session.call('com.bigsql.list');
        }

        session.subscribe("com.bigsql.onInstall", function (installStream) {

            var data = JSON.parse(installStream[0])[0];
            if (data.state == "deplist") {
                if (data.deps.length > 1) {
                    parentComponent = getCurrentComponent(data.component[0]);
                    parentComponent.installationDependents = data;
                    dependentCount = data.deps.length;
                    depList = data.deps;
                    currentComponent.installation = true;
                    parentComponent.installation = true;
                }
            } else if (data.status == "start") {
                currentComponent = getCurrentComponent(data.component);
                currentComponent.installationStart = data;
                currentComponent.installation = true;
                if (depList[depList.length-1] == currentComponent.component) {
                    delete parentComponent.installationDependents;
                }
            } else if (data.status == "wip") {
                currentComponent.installationRunning = data;
                currentComponent.progress = data.pct;
            } else if (data.status == "complete" || data.status == "cancelled") {
                if (data.state == 'unpack' && data.status == "complete") {
                    if(["pg96","pg95","pg94","pg93","pg92"].indexOf(data.component) >= 0){
                        currentComponent.status = 'NotInitialized';
                        getList();
                        $scope.compAction('init', data.component);
                        // session.call('com.bigsql.list');
                    }else{
                        currentComponent.status = 'Installed';
                    }
                } 
                if(data.state == "install"){
                    currentComponent = getCurrentComponent(data.component);
                } 
                if (data.status == "cancelled") {

                    if (dependentCount == 0) {
                         $scope.alerts.push({
                            msg: data.component +" "+data.msg,
                            type: "danger"
                        });
                    } else {
                        delete parentComponent.installation;
                        $scope.alerts.push({
                            msg: parentComponent.component +" >>  "+data.msg,
                            type: "danger"
                        });
                    }
                    dependentCount = 0;
                }
                
                delete currentComponent.installationStart;
                delete currentComponent.installationRunning;
                // delete currentComponent.installation;
                $scope.disableShowInstalled = false;
                if (data.state == "update") {
                    currentComponent.updates -= 1;
                    getList();
                    // session.call('com.bigsql.list');
                };


            } 
            // Need to be status here
            if (data.state == "error") {
                $scope.alerts.push({
                    msg: data.msg,
                    type: 'danger'
                });
                delete parentComponent.installationDependents;
                delete currentComponent.installationStart;
                delete currentComponent.installationRunning;
                delete currentComponent.installation;
                $scope.disableShowInstalled = false;
            }
            else if (data.state == "locked") {
                $scope.alerts.push({
                    msg: data.msg,
                    type: 'danger'
                });
            }
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        var onRemove = function (response) {
            var data = JSON.parse(response[0])[0];

            if (data.status == "error" || data.state == "locked") {
                delete currentComponent.removing;
                $scope.disableShowInstalled = false;
                $scope.alerts.push({
                    msg: data.msg,
                    type: "danger"
                });
            }
            if (data.status == "complete") {
                delete currentComponent.removing;
                currentComponent.status = "NotInstalled";
                $scope.disableShowInstalled = false;
                getList();
                // session.call('com.bigsql.list');
            }
            $scope.$apply();
        };


        session.subscribe('com.bigsql.onRemove', onRemove).then(
            function (subscription){
                subscriptions.push(subscription);
            });

    });

    $scope.installedComps = function (event) {
        session.call('com.bigsql.setBamConfig',['showInstalled', $scope.showInstalled]);
        getList(); 
        // session.call('com.bigsql.list');
    }

    $scope.compAction = function (action, compName) {
        var sessionKey = "com.bigsql." + action;
        $scope.disableShowInstalled = true;
        if(action == "init"){
            currentComponent = getCurrentComponent(compName);
            currentComponent.init = true;
        } else if(action == "remove"){
            currentComponent = getCurrentComponent(compName);
            currentComponent.removing = true;
        }
        session.call(sessionKey, [compName]);
        if (action == 'update' && compName == 'bam2') {
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/bamUpdateModal.html',
                controller: 'bamUpdateModalController',
            });
        }

    };

    $scope.cancelInstallation = function (action) {
        session.call("com.bigsql.cancelInstall");
    }

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $timeout(function() {
        if ($scope.loading) {
            $window.location.reload();
        };
    }, 5000);

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);
angular.module('bigSQL.components').controller('bamLoading', ['$scope', 'PubSubService', '$rootScope', '$window', '$timeout',function ($scope, PubSubService, $rootScope, $window, $timeout) {

	$scope.bamLoading = true;
	var subscriptions = [];
	var session;

        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessPram) {
        	session = sessPram;
        	session.call('com.bigsql.serverStatus');
            session.subscribe("com.bigsql.onServerStatus", function (args) {
            	$scope.bamLoading = false;
       			var components = $(JSON.parse(args[0])).filter(function(i,n){ return n.category === 1;});
          		if(components.length != 0){
          			$window.location.href = "#/details-pg/" + components[0].component;
          			$rootScope.$emit('topMenuEvent');
          		} else {
          			$window.location.href = "#/components/view";	
          		}
	        }).then(function (subscription) {
	            subscriptions.push(subscription);
	        });
        });

	$timeout(function() {
        if ($scope.bamLoading) {
            $window.location.reload();
        };
    }, 5000);

	$scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    });

}]);
angular.module('bigSQL.components').controller('graphsTabController', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval','MachineInfo', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo) {
	var session, subscriptions=[], componentStatus, refreshRate;
    $scope.showGraphs = false;

    $scope.transctionsPerSecondChart = {
        chart: {
            type: 'lineChart',
            height: 150,
            margin : {
                top: 20,
                right: 40,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            noData:"Loading...",
            interactiveLayer : {
                tooltip: {
                    headerFormatter: function (d) { 
                        var point = new Date(d);
                        return d3.time.format('%Y/%m/%d %H:%M:%S')(point); 
                    },
                },
            },

            xAxis: {
                xScale: d3.time.scale(),
                    tickFormat: function(d) { 
                        var point = new Date(d);
                        return d3.time.format('%H:%M:%S')(point) 
                    },
                },
            yAxis: {
                tickFormat: function(d) { 
                    return d3.format(',')(d);
                }
            },
            forceY: [0,5],
            useInteractiveGuideline: true,
            legend: { margin : {
                top: 10, right: 0, left: 0, bottom: 0
            }}
        }
    };


    $scope.cpuChart = angular.copy($scope.transctionsPerSecondChart);
    $scope.cpuChart.chart['forceY'] = [0,100];
    $scope.cpuChart.chart.type = "stackedAreaChart";
    $scope.cpuChart.chart.showControls = false;

    $scope.rowsChart = angular.copy($scope.transctionsPerSecondChart);
    $scope.rowsChart.chart['forceY'] = [0,1000];

    $scope.connectionsChart = angular.copy($scope.transctionsPerSecondChart);
    $scope.connectionsChart.chart.type = "stackedAreaChart";
    $scope.connectionsChart.chart.showControls = false;

    $scope.diskIOChart = angular.copy($scope.transctionsPerSecondChart);
    $scope.transctionsPerSecondChart.chart['forceY'] = [0,50];

    $scope.commitRollbackData = [
        {
            values: [],
            key: 'Commit',
            color: '#FF5733'
        },
        {
            values: [],      
            key: 'Rollback', 
            color: '#006994'  
        }];

    $scope.cpuData = [{
            values: [],      
            key: 'CPU System %', 
            color: '#FF5733',
        },
        {
            values: [],      
            key: 'CPU User %', 
            color: '#006994' ,
        }];

    $scope.diskIOData = [{
        values: [],
        key: 'Read Bytes (MB)',
        color: '#FF5733'
    },{
        values: [],
        key: 'Write Bytes (MB)',
        color: '#006994'
    }];

    $scope.rowsData = [{
        values: [],
        key: 'Insert',
        color: '#006400'
    },{
        values: [],
        key: 'Update',
        color: '#FF5733'
    },{
        values: [],
        key: 'Delete',
        color: '#006994'
    },{
        values: [],
        key: 'Select',
        color: '#9932CC'
    }]

    $scope.connectionsData = [{
            values: [],      
            key: 'Active', 
            color: '#FF5733',
        },{
            values: [],
            key: 'Idle',
            color: '#006994',
        },{
            values: [],
            key: 'Idle Transactions',
            color: '#9932CC',
        }];

    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
            $rootScope.$emit('topMenuEvent');
        });
    });

    $rootScope.$on('componentStatus', function (argument) {
    	componentStatus = arguments[1];
    })

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
    	session.call('com.bigsql.initial_dbstats',[$stateParams.component]);
	    session.call("com.bigsql.initial_graphs");

	    $scope.tabClick = function (argument) {
	        session.call('com.bigsql.live_graphs');
	        session.call('com.bigsql.live_dbstats', [$stateParams.component]);
	    }

	    session.subscribe("com.bigsql.initdbstats", function (data) {
        var graph_data = data[0];
        if(graph_data['component'] == $stateParams.component){
            $scope.commitRollbackData[0].values.length = 0;
            $scope.commitRollbackData[1].values.length = 0;
            $scope.rowsData[0].values.length = 0;
            $scope.rowsData[1].values.length = 0;
            $scope.rowsData[2].values.length = 0;
            $scope.rowsData[3].values.length = 0;
            $scope.connectionsData[0].values.length = 0;
            $scope.connectionsData[1].values.length = 0;
            $scope.connectionsData[2].values.length = 0;
	        for (var i=0;i<graph_data.stats.length;i=i+1){
	            var timeData = Math.round( (new Date( graph_data.stats[i]['time'] + ' UTC')).getTime() );
	            $scope.commitRollbackData[0].values.push({ x: timeData,  y: graph_data.stats[i]['xact_commit']});
	            $scope.commitRollbackData[1].values.push({ x: timeData,  y: graph_data.stats[i]['xact_rollback']});
	            $scope.connectionsData[0].values.push({ x: timeData, y: graph_data.stats[i]['connections']['active']});
                $scope.connectionsData[1].values.push({ x: timeData, y: graph_data.stats[i]['connections']['idle']});
	            $scope.connectionsData[2].values.push({x: timeData, y: graph_data.stats[i]['connections']['idle in transaction']});
                $scope.rowsData[0].values.push({x:timeData, y:graph_data.stats[i]['tup_inserted']});
	            $scope.rowsData[1].values.push({x:timeData, y:graph_data.stats[i]['tup_updated']});
	            $scope.rowsData[2].values.push({x:timeData, y:graph_data.stats[i]['tup_deleted']});
	            $scope.rowsData[3].values.push({x:timeData, y:graph_data.stats[i]['tup_fetched']});
	        }
            $scope.connectionsChart.chart['forceY'] = [0, graph_data.stats[1]['connections']['max']];
	        $scope.$apply();
	    }
	    }).then(function (subscription) {
	        subscriptions.push(subscription);
	    });

	    session.subscribe('com.bigsql.dbstats', function (data) {
	    	if(data[0].component == $stateParams.component){
		        if($scope.commitRollbackData[0].values.length > 60){
		            $scope.commitRollbackData[0].values.shift();
		            $scope.commitRollbackData[1].values.shift();
		            $scope.rowsData[0].values.shift();
		            $scope.rowsData[1].values.shift();
		            $scope.rowsData[2].values.shift();
		            $scope.rowsData[3].values.shift();
                    $scope.connectionsData[0].values.shift();
                    $scope.connectionsData[1].values.shift();
                    $scope.connectionsData[2].values.shift();         
		        }
		        var timeVal = Math.round( (new Date(data[0].stats['time'] + ' UTC')).getTime())
		        $scope.commitRollbackData[0].values.push({ x: timeVal,  y: data[0].stats['xact_commit']});
		        $scope.commitRollbackData[1].values.push({ x: timeVal,  y: data[0].stats['xact_rollback']});
		        $scope.connectionsData[0].values.push({ x: timeVal, y: data[0].stats['connections']['active']});
		        $scope.connectionsData[1].values.push({x: timeVal, y: data[0].stats['connections']['idle']});
                $scope.connectionsData[2].values.push({x : timeVal, y: data[0].stats['connections']['idle in transaction']});
                $scope.rowsData[0].values.push({x: timeVal, y: data[0].stats['tup_inserted']});
		        $scope.rowsData[1].values.push({x: timeVal, y: data[0].stats['tup_updated']});
		        $scope.rowsData[2].values.push({x: timeVal, y: data[0].stats['tup_deleted']});
		        $scope.rowsData[3].values.push({x: timeVal, y: data[0].stats['tup_fetched']});
                $scope.$apply();
	    	}

	    });


	    function callStatus(argument) {
		    session.call('com.bigsql.live_graphs');
	        if($scope.commitRollbackData.length <= 2){
	            $scope.transctionsPerSecondChart.chart.noData = "No Data Available."
	        }
	        if($scope.connectionsData.length <= 3){
	            $scope.connectionsChart.chart.noData = "No Data Available."
	        }
	        if($scope.rowsData.length <= 4){
	            $scope.rowsChart.chart.noData = "No Data Available."
	        }
	        if(componentStatus == undefined){
	        }else if (componentStatus.state == "Running"){
	            session.call("com.bigsql.live_dbstats",[$stateParams.component]);
                session.call('com.bigsql.activity',[$stateParams.component]);
	        }
    	};

	    refreshRate = $interval(callStatus, 5000);

	    $rootScope.$on('refreshRateVal', function () {
	    	$interval.cancel(refreshRate);
	    	if(arguments[1] == "" || arguments[1] == undefined){
	    		refreshRate = $interval(callStatus, 5000);
	    	} else if (arguments[1] == '0'){
                $interval.cancel(refreshRate);
            } else {
		    	refreshRate = $interval(callStatus, arguments[1]);    		
	    	}
	    });

        session.subscribe("com.bigsql.initgraphs", function (data) {
	        var graph_data = data[0];
            $scope.cpuData[0].values.length = 0;
            $scope.cpuData[1].values.length = 0;
            $scope.diskIOData[0].values.length = 0;
            $scope.diskIOData[1].values.length = 0;
	        for (var i=0;i<graph_data.length;i=i+1){
	            var timeVal = Math.round( (new Date( graph_data[i]['time'] + ' UTC')).getTime() );
	            $scope.cpuData[0].values.push({x: timeVal, y: graph_data[i]['cpu_per']['system']});
	            $scope.cpuData[1].values.push({x: timeVal, y: graph_data[i]['cpu_per']['user']});
	            $scope.diskIOData[0].values.push({x: timeVal, y: graph_data[i]['io']['read_bytes']});
	            $scope.diskIOData[1].values.push({x: timeVal, y: graph_data[i]['io']['write_bytes']});
	        }
	        if($scope.cpuData.length <= 2){
	            $scope.cpuChart.chart.noData = "No Data Available."
	        }
	        if($scope.diskIOData.length <= 2){
	            $scope.diskIOChart.chart.noData = "No Data Available."
	        }
	       	$scope.$apply();
	    }).then(function (subscription) {
	        subscriptions.push(subscription);
	    });

	    session.subscribe("com.bigsql.graphs", function (data) {
	        if($scope.cpuData[0].values.length > 60){
	            $scope.cpuData[0].values.shift();
	            $scope.cpuData[1].values.shift(); 
	            $scope.diskIOData[0].values.shift();
	            $scope.diskIOData[1].values.shift();    
	        }
	        var timeVal = Math.round( (new Date(data[0]['time'] + ' UTC')).getTime() )
	        $scope.cpuData[0].values.push({x: timeVal, y: data[0]['cpu_per']['system']});
	        $scope.cpuData[1].values.push({x: timeVal, y: data[0]['cpu_per']['user']});
	        $scope.diskIOData[0].values.push({x:timeVal,y:data[0]['io']['read_bytes']});
            $scope.diskIOData[1].values.push({x:timeVal,y:data[0]['io']['write_bytes']});
	        $scope.showGraphs = true;
            $scope.$apply();
	    }).then(function (subscription) {
	        subscriptions.push(subscription);
	    });
	});

	//need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
        $interval.cancel(refreshRate);
    });

}]);
angular.module('bigSQL.components').factory('UpdateBamService', function (PubSubService, $q) {

    var bamUpdateInfo;
    var info;


    var getBamUpdateInfo = function () {

        return $q(function (resolve, reject) {

            var subscription;
            var sessionPromise = PubSubService.getSession();
            sessionPromise.then(function (session) {
                session.call('com.bigsql.infoComponent', ['bam2']);

                session.subscribe("com.bigsql.onInfoComponent", function (components) {
                    var components = JSON.parse(components[0][0]);
                    session.unsubscribe(subscription);
                    resolve(components[0]);

                }).then(function (sub) {
                    subscription = sub;
                }, function (msg) {
                    reject();
                });
            });

        });
    }

    return {
        getBamUpdateInfo: getBamUpdateInfo,
    }
})

angular.module('bigSQL.components').factory('UpdateComponentsService', function () {
    var components = [];
    var manualUpdateSettings;

    var set = function (comp) {
        components = comp;
    }

    var get = function () {
        return components;
    }

    var setCheckUpdatesManual = function () {
        manualUpdateSettings = true;
    }

    var setCheckUpdatesAuto = function () {
        manualUpdateSettings = false;
    }

    var getCheckUpdates = function () {
        return manualUpdateSettings;
    }


    return {
        get: get,
        set: set,
        setCheckUpdatesManual: setCheckUpdatesManual,
        getCheckUpdates: getCheckUpdates,
        setCheckUpdatesAuto: setCheckUpdatesAuto
    }
})

angular.module('bigSQL.components').directive('bigsqlInstallComponent', function () {
    var directive = {};

    directive.restrict = 'E';
    /* restrict this directive to elements */
    directive.transclude = true;
    directive.template = "<div class='bigsqlInstallComponent' ng-transclude></div>";

    return directive;
});