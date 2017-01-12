//All the modules will be created him , all the developers would have create there modules here
"use strict";

angular.module('bigSQL.common', []);
angular.module('bigSQL.components', ['bigSQL.common', 'nvd3', 'ui.grid', 'ui.grid.expandable', 'ngCookies']);
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
    }).state('components.hosts', {
        url: '^/hosts',
        views: {
            "sub": {
                controller: 'HostsController',
                templateUrl: '../app/components/partials/hosts.html',
            }
        }
    }).state('components.profiler', {
        url: '^/profiler',
        views: {
            "sub": {
                controller: 'profilerController',
                templateUrl: '../app/components/partials/profiler.html',
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
    }).state('components.badger', {
        url: '^/badger',
        views: {
            "sub": {
                controller: 'badgerController',
                templateUrl: '../app/components/partials/badger.html',
            }
        }
    });
}).controller('ComponentsController', ['$scope', function ($scope) {

}]);
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
angular.module('bigSQL.common').directive('serverInfoDetails', function (bamAjaxCall, $rootScope) {


    return {
        scope: {
            title: '@'
        },
        restrict: 'E',
        templateUrl: '../app/common/partials/hostInfo.html',
        //template: '<div class="components-update-title-wrapper">  <h1><strong>{{title}}</strong> : {{data.host}} </h1>  <h3><strong> OS </strong> : {{data.os}} &nbsp; <strong>HW </strong>: {{data.mem}} GB, {{data.cores}} x {{data.cpu}} &nbsp; <strong>PGC</strong> : {{data.version}}</h3></div>',
        controller: ['$scope', '$http', '$window', '$cookies', function serverInfoDetailsController($scope, $http, $window, $cookies) {

            function gethostInfo(selectedHost) {
                selectedHost = typeof selectedHost !== 'undefined' ? selectedHost : "";

                if (selectedHost == "" || selectedHost == 'localhost') {
                    var infoData = bamAjaxCall.getCmdData('info');
                } else {
                    var infoData = bamAjaxCall.getCmdData('hostcmd/info/' + selectedHost);
                }

                infoData.then(function (data) {
                    $scope.data = data[0];
                });
            }

            var remote_host = $cookies.get('remote_host');
            remote_host = typeof remote_host !== 'undefined' ? remote_host : "";
            if (remote_host == "" || remote_host == undefined) {
                $scope.selecthost = 'localhost';    
            } else {
                $scope.selecthost = remote_host;
            }
            

            var hostsList = bamAjaxCall.getCmdData('hosts');

            hostsList.then(function (data) {
                if (data.length > 0 && data[0].status == "error") {
                    $scope.hosts = [];
                } else {
                    $scope.hosts = data;
                }
            });

            gethostInfo($cookies.get('remote_host'));

            $scope.hostChange = function (host) {
                $rootScope.$emit('refreshData', host);
                // $rootScope.$emit('topMenuEvent', host);
                $rootScope.remote_host = host;
                $cookies.put('remote_host', host);
                gethostInfo(host);
                // $scope.$parent.refreshData(host);
            }
        }]
    }
});
angular.module('bigSQL.common').directive('userDetailsRow', function () {
	
	return {
        scope: {
            value: "=",
            roles: "="
        },
        restrict: 'E',
        templateUrl: '../app/components/partials/userForm.html',
        controller: ['$scope', '$rootScope', '$window', '$http', function userDetailsRowController($scope, $rootScope, $window, $http) {
			var count = 1;

			$scope.deleteUser = function (user_id) {
		        var delete_url = $window.location.origin + '/admin/user_management/user/' + user_id;

		        $http.delete(delete_url)
		            .success(function (data) {
		                $rootScope.$emit('callGetList');
		            })
		            .error(function (data, status, header, config) {

		            });

		    };

		    $scope.updateRole = function() {
		    	if(!$scope.value.new){
		    		var updateData = {};
            		updateData.id = $scope.value.id;
			        updateData.role = $scope.value.role;
	            	$rootScope.$emit('updateUser', updateData);
		    	}
			}

			$scope.updateActive = function() {
		    	if(!$scope.value.new){
		    		var updateData = {};
            		updateData.id = $scope.value.id;
			        updateData.active = $scope.value.active;
	            	$rootScope.$emit('updateUser', updateData);
		    	}
			}

            $scope.formSave = function () {
            	
            	if($scope.passwordValid && count == 1 ) {
            		var userData = {};
            		userData.id = $scope.value.id;
			        userData.email = $scope.value.email;
			        userData.active = $scope.value.active;
			        userData.role = $scope.value.role;
			        userData.newPassword = $scope.userForm.password_c.$viewValue;
			        userData.confirmPassword = $scope.userForm.password_c.$viewValue;
	            	$rootScope.$emit('saveUser', userData);
	            	count += 1; 
            	}
		    }
        }]
    }

})
angular.module('bigSQL.common').directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.initForm.password.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
}).directive('validPort', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var invalidLen = parseInt(viewValue) < 1000 || parseInt(viewValue) > 9999
                ctrl.$setValidity('invalidLen', !invalidLen)
                scope.portGood = !invalidLen
            })
        }
    }
}).directive('validUserPassword', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var invalidLen = viewValue.length < 6
                ctrl.$setValidity('invalidLen', !invalidLen)
            })
        }
    }
}).directive('confirmPassword', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var invalidLen = viewValue.length < 6
                var noMatch = viewValue != scope.userForm.password.$viewValue
                ctrl.$setValidity('invalidLen', !invalidLen)
                ctrl.$setValidity('noMatch', !noMatch)
                scope.passwordValid = !invalidLen && !noMatch 
            })
        }
    }
});
angular.module('bigSQL.components').controller('ComponentDetailsController', ['$scope', '$stateParams', 'PubSubService','$rootScope', '$window', '$interval', 'bamAjaxCall', '$sce', '$cookies', function ($scope, $stateParams, PubSubService, $rootScope, $window, $interval, bamAjaxCall, $sce, $cookies) {

    var subscriptions = [];
    var session;
    $scope.loading = true;
    var dependentCount = 0;
    $scope.currentHost;

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
        if(action == 'start'){
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
        var remote_host = $cookies.get('remote_host');
        $scope.currentHost = remote_host;
        remote_host = typeof remote_host !== 'undefined' ? remote_host : "";
        $scope.currentHost = remote_host;
        if (remote_host == "" || remote_host == "localhost") {
            var infoData = bamAjaxCall.getCmdData('info/' + $stateParams.component);
        } else {
            var infoData = bamAjaxCall.getCmdData('info/' + $stateParams.component + "/" + remote_host);
        }

        //var infoData = bamAjaxCall.getCmdData('info/' + $stateParams.component);
        infoData.then(function(data) {
            $scope.loading = false;
            if(window.location.href.split('/').pop(-1) == data[0].component){
                $scope.component = data[0];
                var relnotes = bamAjaxCall.getCmdData('relnotes/' + $stateParams.component + '/' +$scope.component.version)
                relnotes.then(function (data) {
                    $scope.relnotes = $sce.trustAsHtml(data);
                });
            }
        });
    };

    function callStatus(argument) {
        var statusData = bamAjaxCall.getCmdData('status')
        statusData.then(function(data) {
            componentStatus = getCurrentObject($stateParams.component);
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

        $scope.action = function (event) {
            if (event.target.tagName === "A" && event.target.attributes.action != undefined) {
                if(event.target.attributes.action.value == 'start'){
                    $scope.component.spinner = 'Starting..';
                }else if(event.target.attributes.action.value == 'stop'){
                    $scope.component.spinner = 'Stopping..';
                }else if(event.target.attributes.action.value == 'remove'){
                    $scope.component.spinner = 'Removing..';
                }
                // var sessionKey = "com.bigsql." + event.target.attributes.action.value;
                // session.call(sessionKey, [$scope.component.component]);
                if($scope.currentHost == 'localhost'){
                    var sessionKey = "com.bigsql." + event.target.attributes.action.value;
                    session.call(sessionKey, [$scope.component.component]);
                }else {
                    if(event.target.attributes.action.value == 'install'){
                        $scope.component.spinner = 'installing..';
                    }
                    var event_url = event.target.attributes.action.value + '/' + $scope.component.component + '/' + $scope.currentHost ;
                    var eventData = bamAjaxCall.getCmdData(event_url);
                    eventData.then(function(data) {
                        callInfo($scope.currentHost);
                    });
                }
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

    $rootScope.$on('refreshData', function (argument, host) {
        $scope.loading = true;
        callInfo(host);
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
angular.module('bigSQL.components').controller('ComponentDetailsPg95Controller', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval', 'MachineInfo', '$window', 'bamAjaxCall', '$uibModal', '$sce', '$cookies', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, $window, bamAjaxCall, $uibModal, $sce, $cookies) {

    $scope.alerts = [];
    var subscriptions = [];
    var session = PubSubService.getSession();
    $scope.loading = true;

    var infoRefreshRate;
    var dependentCount = 0;
    $scope.currentHost;

    var componentStatus = 0;

    var activityTab = angular.element(document.querySelector('#activityTab'));

    function compAction(action) {
        if (action == 'init') {
            $scope.component.spinner = 'Initializing..';
        } else if (action == 'start') {
            $scope.component.spinner = 'Starting..';
        } else if (action == 'stop') {
            $scope.component.spinner = 'Stopping..';
        } else if (action == 'remove') {
            $scope.component.spinner = 'Removing..';
        } else if (action == 'restart') {
            $scope.component.spinner = 'Restarting..';
        }
        var sessionKey = "com.bigsql." + action;
        session.call(sessionKey, [$scope.component.component]).then(function (argument) {
            callInfo();
        })
    }

    function callInfo(argument) {
        var remote_host = $cookies.get('remote_host');
        remote_host = typeof remote_host !== 'undefined' ? remote_host : "";
        $scope.currentHost = remote_host;
        if (remote_host == "" || remote_host == "localhost") {
            var infoData = bamAjaxCall.getCmdData('info/' + $stateParams.component);
        } else {
            var infoData = bamAjaxCall.getCmdData('info/' + $stateParams.component + "/" + remote_host);
        }

        //var infoData = bamAjaxCall.getCmdData('info/' + $stateParams.component);
        infoData.then(function (data) {
            $scope.loading = false;
            if (data[0]['autostart'] == "on") {
                data[0]['autostart'] = true;
            } else {
                data[0]['autostart'] = false;
            }
            if (window.location.href.split('/').pop(-1) == data[0].component) {
                $scope.component = data[0];
                if ($scope.component.status != "Running") {
                    $scope.uibStatus = {
                        tpsChartCollapsed: false,
                        rpsChartCollapsed: false,
                        diskChartCollapsed: true,
                        cpuChartCollapsed: true,
                        connectionsCollapsed: false
                    };
                } else {
                    $scope.uibStatus = {
                        tpsChartCollapsed: true,
                        rpsChartCollapsed: true,
                        diskChartCollapsed: false,
                        cpuChartCollapsed: true,
                        connectionsCollapsed: false
                    };
                }
            }
        });
    };

    function callStatus(argument) {
        var remote_host = $cookies.get('remote_host');
        remote_host = typeof remote_host !== 'undefined' ? remote_host : "";

        if (remote_host == "" || remote_host == "localhost") {
            var statusData = bamAjaxCall.getCmdData('status');
        } else {
            var statusData = bamAjaxCall.getCmdData('hostcmd/status/'+ remote_host);
        }

        // var statusData = bamAjaxCall.getCmdData('status');
        statusData.then(function (data) {
            componentStatus = getCurrentObject(data, $stateParams.component);
            $rootScope.$emit('componentStatus', componentStatus);
            if (componentStatus != undefined && componentStatus.state != $scope.component.status) {
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
        {label: "Off", value: "0"},
        {label: "5", value: ""},
        {label: "10", value: "10000"},
        {label: "15", value: "15000"},
        {label: "30", value: "30000"}
    ]

    $scope.opt = {
        interval: ''
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

        $scope.changeOption = function (value) {
            $rootScope.$emit('refreshRateVal', $scope.opt.interval);
        };

        $scope.autostartChange = function (args) {
            var autoStartVal;
            if (args) {
                autoStartVal = 'on';
            } else {
                autoStartVal = 'off';
            }
            session.call('com.bigsql.autostart', [autoStartVal, $stateParams.component]).then(
                function (sub) {
                    callInfo();
                });
        }

        $scope.dataBaseTabEvent = function (args) {
            if ($scope.component.status == "Running") {
                session.call('com.bigsql.db_list', [$stateParams.component]);
            }
        };

        $scope.cancelInstallation = function (action) {
            session.call("com.bigsql.cancelInstall");
        }

        $scope.openInitPopup = function (comp) {
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/pgInitialize.html',
                controller: 'pgInitializeController',
            });
            modalInstance.component = comp;
        };

        session.subscribe('com.bigsql.ondblist', function (data) {
            if (data[0].component == $stateParams.component) {
                $scope.myData = data[0].list;
                $scope.gridOptions = {
                    data: 'myData', columnDefs: [{
                        field: "datname", displayName: "Database"
                    }, {
                        field: 'owner', displayName: "Owner"
                    }, {
                        field: 'size',
                        displayName: "Size (MB)",
                        cellClass: 'numberCell',
                        headerTooltip: 'This is the total disk space used by the database, which includes all the database objects like Tables and Indexes within that database',
                        sort: {direction: 'desc', priority: 0}
                    }], enableColumnMenus: false
                };
                $scope.$apply();
            }
        });

        $scope.configureTabEvent = function (args) {
            if ($scope.component.status == "Running") {
                session.call('com.bigsql.pg_settings', [$stateParams.component]);
            }
        };

        session.subscribe('com.bigsql.onPGsettings', function (data) {
            if (data[0].component == $stateParams.component) {
                $scope.settingsData = data[0].list;
                $scope.gridSettings = {
                    expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height: 140px"></div>',
                };

                $scope.gridSettings.columnDefs = [
                    {field: "name", displayName: 'Category'}
                ];

                $scope.gridSettings.enableColumnMenus = false;

                data = data[0].list;
                for (var i = 0; i < data.length; i++) {
                    data[i].subGridOptions = {
                        columnDefs: [
                            {
                                field: "name",
                                displayName: "Parameter",
                                cellTemplate: '<div class="ui-grid-cell-contents" title="{{row.entity.short_desc}}"><a>{{ COL_FIELD }}</a></div>'
                            },
                            {field: "setting", displayName: "value"},
                            {field: "short_desc", visible: false}],
                        data: data[i].settings,
                        enableColumnMenus: false
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
            if (data[0].component == $stateParams.component) {
                $scope.securityTabContent = data[0].contents;
                $scope.$apply();
            }
        });

        session.subscribe('com.bigsql.onAutostart', function (data) {
            var res = JSON.parse(data[0])[0];
            if (res['status'] == "error") {
                $scope.alerts.push({
                    msg: res['msg'],
                    type: "danger"
                });
            } else if (res['status'] == "completed") {
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
            }
        };

        session.subscribe('com.bigsql.onRemove', onRemove).then(
            function (sub) {
                subscriptions.push(sub);
            });


        session.subscribe('com.bigsql.onInit', function (data) {
            var res = JSON.parse(data[0])[0];
            if (res['status'] == 'error') {
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

        $scope.releaseTabEvent = function (argument) {
            var relnotes = bamAjaxCall.getCmdData('relnotes/' + $stateParams.component + '/' +$scope.component.version)
            relnotes.then(function (data) {
                $scope.relnotes = $sce.trustAsHtml(data);
            });
        }

        session.subscribe('com.bigsql.onActivity', function (data) {
            if (data[0].component == $stateParams.component) {
                var parseData = data[0].activity;
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

        $scope.openWhatsNew = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/whatsNew.html',
            controller: 'whatsNewController',
            size: 'lg',
        });
        modalInstance.component = $stateParams.component;
        modalInstance.version = $scope.component.version;
    }

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
                    session.call('com.bigsql.infoComponent', [$stateParams.component]);
                    $scope.component.status = 'NotInitialized';
                    $scope.openInitPopup($stateParams.component);
                }

                if (data.status == "cancelled") {
                    $scope.alerts.push({
                        msg: data.msg,
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

    $rootScope.$on('refreshData', function (argument, host) {
        $scope.loading = true;
        callInfo(host);
    });

    $scope.action = function (event) {
        if (event.target.tagName === "A" && event.target.attributes.action != undefined) {
            if (event.target.attributes.action.value == 'init') {
                $scope.component.spinner = 'Initializing..';
            } else if (event.target.attributes.action.value == 'start') {
                $scope.component.spinner = 'Starting..';
            } else if (event.target.attributes.action.value == 'stop') {
                $scope.component.spinner = 'Stopping..';
            } else if (event.target.attributes.action.value == 'remove') {
                $scope.component.spinner = 'Removing..';
            } else if (event.target.attributes.action.value == 'restart') {
                $scope.component.spinner = 'Restarting..';
            }
            if($scope.currentHost == '' || $scope.currentHost == 'localhost'){
                var sessionKey = "com.bigsql." + event.target.attributes.action.value;
                session.call(sessionKey, [$scope.component.component]);
            }else {
                var event_url = event.target.attributes.action.value + '/' + $scope.component.component + '/' + $scope.currentHost ;
                var eventData = bamAjaxCall.getCmdData(event_url);
                eventData.then(function(data) {
                    callInfo($scope.currentHost);
                });
            }
        }
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $rootScope.$on('initComp', function (event, comp) {
        $scope.component.spinner = 'Initializing..';
    });

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
        $interval.cancel(infoRefreshRate);
    });

}]);
angular.module('bigSQL.components').controller('ComponentDevopsUpdateController', ['$rootScope', '$scope', '$stateParams', 'PubSubService', '$state', '$uibModalInstance', 'MachineInfo', 'UpdateBamService','$window', 'bamAjaxCall', function ($rootScope, $scope, $stateParams, PubSubService, $state, $uibModalInstance, MachineInfo, UpdateBamService,$window, bamAjaxCall) {

    var subscriptions = [];
    var session;
    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;
    });

    var infoData = bamAjaxCall.getCmdData('info/devops');
        infoData.then(function(info) {
            var data = info[0];
            $scope.updateVersion = data.current_version;
            $scope.currentVersion = data.version;
        });

    function updateComponents(val) {

        session = val;
        $scope.component = {};

        $scope.redirect = function () {
            $uibModalInstance.dismiss('cancel');
            $window.location.reload(true);
            $rootScope.$emit("bamUpdated");
        };

        $scope.action = function (event) {

            session.call('com.bigsql.update', ['devops']).then(
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
angular.module('bigSQL.components').controller('ComponentsLogController', ['$scope', 'PubSubService', '$state','$interval','$location', '$window', '$rootScope', 'bamAjaxCall', function ($scope, PubSubService, $state, $interval, $location, $window, $rootScope, bamAjaxCall) {

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

    var infoData = bamAjaxCall.getCmdData('info')
    infoData.then(function(data) {
        $scope.pgcInfo = data[0];
    });

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

angular.module('bigSQL.components').controller('ComponentsSettingsController', ['$rootScope', '$scope', '$uibModal', 'PubSubService', 'MachineInfo', 'UpdateComponentsService', '$window', 'bamAjaxCall', '$cookies', function ($rootScope, $scope, $uibModal, PubSubService, MachineInfo, UpdateComponentsService, $window, bamAjaxCall, $cookies) {
    $scope.alerts = [];

    var session;
    var subscriptions = [];
    $scope.updateSettings;
    $scope.components = {};
    $scope.currentHost
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
            windowClass: 'bam-update-modal modal',
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

    function getInfo(argument) {
        argument = typeof argument !== 'undefined' ? argument : "";
        $scope.currentHost = argument;
        if (argument=="" || argument == 'localhost'){
            var infoData = bamAjaxCall.getCmdData('info');
        } else{
            var infoData = bamAjaxCall.getCmdData('hostcmd/info/'+argument);
        }

        infoData.then(function(data) {
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
    };

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
angular.module('bigSQL.components').controller('ComponentsStatusController', ['$scope', 'PubSubService', 'MachineInfo', '$interval', '$rootScope', '$window', 'bamAjaxCall','$uibModal', function ($scope, PubSubService, MachineInfo, $interval, $rootScope, $window, bamAjaxCall, $uibModal) {

    var subscriptions = [];
    $scope.comps = {};
    var session;
    var refreshRate;
    var currentComponent = {};
    var graphData = [0, 1, 2, 3, 4, 5, 6, 8, 9, 10];

    function callStatus(argument) {
        var statusData = bamAjaxCall.getCmdData('status');
        statusData.then(function(data) {
            $scope.comps = data;
            if($scope.comps.length == 0){
                $scope.showMsg = true;
            } else{
                $scope.showMsg = false;
            }
        });
    }

    function callInfo(argument) {
        var infoData = bamAjaxCall.getCmdData('info');
        infoData.then(function(data) {
            $scope.pgcInfo = data[0];
        });
    }

    function compAction(action, comp) {
        var sessionKey = "com.bigsql." + action;
        session.call(sessionKey, [comp]).then(function (argument) {
            callInfo();
        })
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

        $rootScope.$on('initComp', function (event, comp) {
            currentComponent = getCurrentComponent(comp);
            currentComponent.showingSpinner = true;
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
                currentComponent = getCurrentComponent(res['component']);
                compAction('start', res['component']);
            // currentComponent.showingSpinner = false;
            }
        }).then(function (sub) {
            subscriptions.push(sub);
        }); 

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

    });

    $scope.openInitPopup = function (comp) {
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/pgInitialize.html',
                controller: 'pgInitializeController',
            });
            modalInstance.component = comp;
        };

    $scope.action = function (event) {
        var showingSpinnerEvents = [ 'Start', 'Stop'];
        if(showingSpinnerEvents.indexOf(event.target.innerText) >= 0 ){
            currentComponent = getCurrentComponent(event.currentTarget.getAttribute('value'));
            currentComponent.showingSpinner = true;
        }
        if (event.target.tagName == "A" && event.target.attributes.action != undefined) {
            session.call(apis[event.target.innerText], [event.currentTarget.getAttribute('value')]);
        }
        ;
    };

    function handleVisibilityChange() {
      if (document.visibilityState == "hidden") {
        $interval.cancel(refreshRate);
      } else if(document.visibilityState == "visible"){
        session.call("com.bigsql.initial_graphs");
        refreshRate = $interval(callGraphs,5000);
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange, false);

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
angular.module('bigSQL.components').controller('ComponentsUpdateController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$window', 'bamAjaxCall', '$rootScope', '$cookies', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $window, bamAjaxCall, $rootScope, $cookies) {

    var session;
    var subscriptions = [];
    $scope.components = {};

    var updateSelectedList = [];
    var currentComponent = {};
    var checkUpdates;
    $scope.currentHost = $cookies.get('remote_host');

    function getList(argument) {
        argument = typeof argument !== 'undefined' ? argument : "";
        $scope.currentHost = argument;
        if (argument=="localhost" || argument == ''){
            var listData = bamAjaxCall.getCmdData('list');
        } else{
            var listData = bamAjaxCall.getCmdData('hostcmd/list/'+argument);
        }
        listData.then(function(data) {
            $scope.loadingSpinner = false;
            $scope.body = true;
            $scope.noUpdates = true;
            $scope.components = data;
            $scope.hideLatestInstalled = true;


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

                if ($scope.noUpdates) {
                    $scope.uibStatus = {
                        newComponents : true,
                        installedComponents : true
                    }
                }else{
                    $scope.uibStatus = {
                        newComponents : false,
                        installedComponents : false
                    }
                }
            }
        });
    };

    var hostsList = bamAjaxCall.getCmdData('hosts');

    hostsList.then(function (data) {
        if (data.length > 0 && data[0].status == "error") {
            $scope.hosts = [];
        } else {
            $scope.hosts = data;
        }
    });

    $scope.selecthost = $cookies.get('remote_host');

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
            getList($scope.currentHost);
        } else {
            $scope.loadingSpinner = true;
            $scope.body = false;
            session.call('com.bigsql.updatesCheck').then(
                function (sub) {
                    $scope.loadingSpinner = false;
                    $scope.body = true;
                    getList($scope.currentHost);
                });
        }

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

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
                selUpdatedComp.splice(0,1);
                if (selUpdatedComp.length > 0) {
                    $scope.compAction('update', selUpdatedComp[0].component);
                } else {
                    // session.call("com.bigsql.getBamConfig");
                    $uibModalInstance.dismiss('cancel');
                    $rootScope.$emit('updatesCheck');
                }
            }
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        $scope.compAction = function (action, compName) {
            var sessionKey = "com.bigsql." + action;
            if($scope.currentHost == 'localhost'){
                session.call(sessionKey, [compName]);
            }else {
                currentComponent = getCurrentComponent(compName);
                currentComponent.init = true;
                var event_url = action + '/' + compName + '/' + $scope.currentHost ;
                var eventData = bamAjaxCall.getCmdData(event_url);
                eventData.then(function(data) {
                    getList($scope.currentHost);
                });
            }
        };

        var selUpdatedComp = [];

        $scope.selectedUpdate = function (val) {
            for (var i = 0; i < $scope.components.length; i++) {
                if ($scope.components[i].selected && $scope.components[i].current_version) {
                    selUpdatedComp.push($scope.components[i]);
                }
            }
            if (selUpdatedComp.length > 1) {
                var popComp = selUpdatedComp[0].component;
                $scope.compAction('update', popComp);
            } else {
                $scope.compAction('update', selUpdatedComp[0].component);
                // session.call('com.bigsql.update', [selUpdatedComp[0].component]).then(function (sub) {
                //     $uibModalInstance.dismiss('cancel');
                // }, function (err) {
                //     throw new Error('failed to update comp', err);
                // });
            }
            console.log(selUpdatedComp.length);
        };

    });

    $scope.hostChange = function (host) {
        $scope.loadingSpinner = true;
        $scope.body = false;
        getList(host);
    };

    $scope.cancelInstallation = function (action) {
        session.call("com.bigsql.cancelInstall");
    }

    /**
     Unsubscribe to all the apis on the template and scope destroy
     **/
    $scope.$on('$destroy', function () {
        $rootScope.$emit('topMenuEvent');
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }

    });

}]);

angular.module('bigSQL.components').controller('ComponentsViewController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', 'bamAjaxCall', '$http', '$cookies', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, bamAjaxCall, $http, $cookies) {

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
    $scope.currentHost;
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
        argument = typeof argument !== 'undefined' ? argument : "";
        $scope.currentHost = argument;
        if (argument=="" || argument == 'localhost'){
            var listData = bamAjaxCall.getCmdData('list');
        } else{
            var listData = bamAjaxCall.getCmdData('hostcmd/list/'+argument);
        }

        listData.then(function (data) {
            $rootScope.$emit('showUpdates');
            if(data == "error"){
                $timeout(wait, 5000);
                $scope.loading = false;
                $scope.retry = true;
            } else {
                $scope.nothingInstalled = false;
                if ($scope.showInstalled) {
                    $scope.components = changePostgresOrder($(data).filter(function(i,n){ return n.status != "NotInstalled" && n.component != 'bam2' ;}));
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
            }
        });
        
        // $http.get($window.location.origin + '/api/list')
        // .success(function(data) {
        //     $scope.nothingInstalled = false;
        //     if ($scope.showInstalled) {
        //         $scope.components = changePostgresOrder($(data).filter(function(i,n){ return n.status != "NotInstalled" ;}));
        //         if($scope.components.length == 0){
        //             $scope.components = [];
        //             $scope.nothingInstalled = true;
        //         }
        //     } else{
        //             $scope.components = changePostgresOrder(data);
        //     }
        //     $scope.loading = false;
        //     for (var i = 0; i < $scope.components.length; i++) {
        //         $scope.components[i].progress = 0;
        //     }
        //     var Checkupdates = 0;
        //     for (var i = 0; i < $scope.components.length; i++) {
        //         Checkupdates += $scope.components[i].updates;
        //     }
        // })
        // .error(function(error) {
        //     $timeout(wait, 5000);
        //     $scope.loading = false;
        //     $scope.retry = true;
        // });
    };
    
    getList($cookies.get('remote_host'));

    $rootScope.$on('refreshData', function (argument, host) {
        $scope.loading = true;
        $scope.currentHost = host;
        getList(host);
    });

    // $scope.refreshData=function(hostArgument){
        
    // };

    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
        });
    });

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;

        // session.call('com.bigsql.info');

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
                windowClass: 'bam-update-modal modal',
                controller: 'ComponentsUpdateController',
            });
        };

        $scope.openInitPopup = function (comp) {
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/pgInitialize.html',
                controller: 'pgInitializeController',
            });
            modalInstance.component = comp;
        };

        session.call('com.bigsql.getBamConfig', ['showInstalled']);
        session.subscribe("com.bigsql.onGetBamConfig", function (settings) {
           $scope.showInstalled = settings[0];
           $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

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

        var infoData = bamAjaxCall.getCmdData('info');
        infoData.then(function (data) {
            $scope.machineInfo =  data[0];
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
            session.call('com.bigsql.',[param]);
            getList();
            // session.call('com.bigsql.list');
        };

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
                        // getList();
                        $scope.openInitPopup(data.component);
                        // $scope.compAction('init', data.component);
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
                delete currentComponent.installation;
                $scope.disableShowInstalled = false;
                if (data.state == "update") {
                    currentComponent.updates -= 1;
                    // getList();
                    $rootScope.$emit('updatesCheck');
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
                delete parentComponent.installation;
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
        getList($scope.currentHost); 
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
        if($scope.currentHost == 'localhost' || $scope.currentHost == ''){
            session.call(sessionKey, [compName]);
        }else {
            currentComponent = getCurrentComponent(compName);
            currentComponent.init = true;
            var event_url = action + '/' + compName + '/' + $scope.currentHost ;
            var eventData = bamAjaxCall.getCmdData(event_url);
            eventData.then(function(data) {
                getList($scope.currentHost);
            });
        }
        if (action == 'update' && compName == 'bam2') {
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/bamUpdateModal.html',
                windowClass: 'bam-update-modal modal',
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

    $rootScope.$on('initComp', function (event, comp) {
        currentComponent = getCurrentComponent(comp);
        currentComponent.init = true;
    });

    function wait() {
        $window.location.reload();
    };

    $timeout(function() {
        if ($scope.loading) {
            $window.location.reload();
        };
    }, 10000);

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);
angular.module('bigSQL.components').controller('HostsController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', '$http', '$location', 'bamAjaxCall', '$interval', '$cookies', '$cookieStore', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, $http, $location, bamAjaxCall, $interval, $cookies, $cookieStore) {

    $scope.alerts = [];

    var subscriptions = [];
    $scope.components = {};

    var currentComponent = {};
    var parentComponent = {};
    var dependentCount = 0;
    var depList = [];
    var session;
    var pid;
    var stopStatusCall;
    var getListCmd = false;
    $scope.updateSettings;
    $scope.loading = true;
    $scope.retry = false;
    $scope.disableShowInstalled = false;
    var previousTopData = "";
    $scope.openedHostIndex = '';
    $scope.openedGroupIndex = '';

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

    var host_info ;

    $scope.cpuChart = {
        chart: {
            type: 'lineChart',
            height: 150,
            margin: {
                top: 20,
                right: 40,
                bottom: 40,
                left: 55
            },
            x: function (d) {
                return d.x;
            },
            y: function (d) {
                return d.y;
            },
            noData: "Loading...",
            interactiveLayer: {
                tooltip: {
                    headerFormatter: function (d) {
                        var point = new Date(d);
                        return d3.time.format('%Y/%m/%d %H:%M:%S')(point);
                    },
                    gravity : 'n',
                },
            },
            xAxis: {
                xScale: d3.time.scale(),
                tickFormat: function (d) {
                    var point = new Date(d);
                    return d3.time.format('%H:%M:%S')(point)
                },
            },
            yAxis: {
                tickFormat: function (d) {
                    return d3.format(',')(d);
                }
            },
            showLegend: false,
            forceY: [0, 100],
            useInteractiveGuideline: true,
            duration: 500
        }
    };
    $scope.ioChart = angular.copy($scope.cpuChart);
    $scope.networkChart = angular.copy($scope.cpuChart);
    $scope.cpuChart.chart.type = "stackedAreaChart";
    $scope.cpuChart.chart.showControls = false;

    $scope.cpuData = [{
        values: [],
        key: 'CPU System %',
        color: '#006994',
        area: true
    }, {
        values: [],
        key: 'CPU User %',
        color: '#FF5733',
        area: true
    }
    ];

    $scope.diskIO = [{
        values: [],
        key: 'Read Bytes (kB)',
        color: '#FF5733'
    }, {
        values: [],
        key: 'Write Bytes (kB)',
        color: '#006994'
    }];

    $scope.NetworkIO = [{
        values: [],
        key: 'Sent Bytes (kB)',
        color: '#FF5733'
    }, {
        values: [],
        key: 'Received Bytes (kB)',
        color: '#006994'
    }];

    var sessionPromise = PubSubService.getSession();

    sessionPromise.then(function (val) {
        session = val;
    });

    var getCurrentComponent = function (name, host) {
        for (var i = 0; i < $scope.hostsList.length; i++) {
            if($scope.hostsList[i].host == host){
                for (var j = 0; j < $scope.hostsList[i].comps.length; j++) {
                    if ($scope.hostsList[i].comps[j].component == name) {
                        currentComponent = $scope.hostsList[i].comps[j];
                        return currentComponent;
                    }
                }
            }
        }
    };

    function changePostgresOrder(data) {
        var comps = data;
        var pgComps = [];
        var nonPgComps = [];

        for (var i = 0; i < comps.length; i++) {
            if (comps[i]['category_desc'] == 'PostgreSQL') {
                pgComps.push(comps[i]);
            } else {
                nonPgComps.push(comps[i]);
            }
            ;
        }
        return pgComps.reverse().concat(nonPgComps);
    }

    $scope.updateComps =  function (p_idx, idx) {
        var remote_host = $scope.groupsList[p_idx].hosts[idx].host;
        var status_url = 'hostcmd/status/' + remote_host;

        if (remote_host == "localhost") {
            status_url = 'status';
            remote_host = "";
        }

        var statusData = bamAjaxCall.getCmdData(status_url);
        statusData.then(function(data) {
                $scope.groupsList[p_idx].hosts[idx].comps = data;
                if ($scope.groupsList[p_idx].hosts[idx].comps.length == 0) {
                    $scope.groupsList[p_idx].hosts[idx].showMsg = true;
                } else {
                    $scope.groupsList[p_idx].hosts[idx].showMsg = false;
                }
            });
    }

    $scope.getGraphValues = function (remote_host) {
        if (remote_host == "localhost" || remote_host == "") {
            var infoData = bamAjaxCall.getCmdData('top');
        } else {
            var infoData = bamAjaxCall.getCmdData('hostcmd/top/' + remote_host);
        }

        infoData.then(function (data) {

            if (previousTopData != "") {
                var diff = data[0].current_timestamp - previousTopData.current_timestamp;
                var kb_read_diff = data[0].kb_read - previousTopData.kb_read;
                var kb_write_diff = data[0].kb_write - previousTopData.kb_write;
                var kb_sent_diff = data[0].kb_sent - previousTopData.kb_sent;
                var kb_recv_diff = data[0].kb_recv - previousTopData.kb_recv;

                var read_bytes = Math.round(kb_read_diff / diff);

                var write_bytes = Math.round(kb_write_diff / diff);

                var kb_sent = Math.round(kb_sent_diff / diff);
                var kb_recv = Math.round(kb_recv_diff / diff);

                if ($scope.cpuData[0].values.length > 20) {
                    $scope.cpuData[0].values.shift();
                    $scope.cpuData[1].values.shift();
                    $scope.diskIO[0].values.shift();
                    $scope.diskIO[1].values.shift();
                    $scope.NetworkIO[0].values.shift();
                    $scope.NetworkIO[1].values.shift();
                }

                var timeVal = new Date(data[0].current_timestamp*1000) ;
                var offset = new Date().getTimezoneOffset();
                timeVal.setMinutes(timeVal.getMinutes() - offset);
                if (read_bytes > 0 ) {
                    $scope.cpuData[0].values.push({x: timeVal, y: parseFloat(data[0].cpu_system)});
                    $scope.cpuData[1].values.push({x: timeVal, y: parseFloat(data[0].cpu_user)});

                    $scope.diskIO[0].values.push({x: timeVal, y: read_bytes});
                    $scope.diskIO[1].values.push({x: timeVal, y: write_bytes});

                    $scope.NetworkIO[0].values.push({x: timeVal, y: kb_sent});
                    $scope.NetworkIO[1].values.push({x: timeVal, y: kb_recv});
                }
            }
            previousTopData = data[0];
        });

    }

    function clear() {
        previousTopData = '';
        $scope.cpuData[0].values.splice(0, $scope.cpuData[0].values.length);
        $scope.cpuData[1].values.splice(0, $scope.cpuData[1].values.length);
        
        $scope.NetworkIO[0].values.splice(0, $scope.NetworkIO[0].values.length);
        $scope.NetworkIO[1].values.splice(0, $scope.NetworkIO[1].values.length);
        
        $scope.diskIO[0].values.splice(0, $scope.diskIO[0].values.length);
        $scope.diskIO[1].values.splice(0, $scope.diskIO[1].values.length);
    }

    $scope.loadHost = function (p_idx, idx, refresh) {
        $scope.openedHostIndex = idx;
        $scope.openedGroupIndex = p_idx;
        $scope.hostsList = $scope.groupsList[p_idx].hosts;
        previousTopData = '';
        $interval.cancel(stopStatusCall);
        $scope.hostsList[idx].comps = '';
        var isOpened = false;
        if (typeof $scope.hostsList[idx].open == "undefined") {
            isOpened = true;

        } else if ($scope.hostsList[idx].open) {
            isOpened = false;

        } else {
            isOpened = true;
        }
        if (refresh) {
            isOpened = refresh;
        }
        if($scope.cpuData[0].values.length > 0){
            clear();
        }

        if (isOpened) {
            var remote_host = $scope.hostsList[idx].host;
            var status_url = 'hostcmd/status/' + remote_host;


            if (remote_host == "localhost") {
                status_url = 'status';
                remote_host = "";
            }

            var statusData = bamAjaxCall.getCmdData(status_url);
            statusData.then(function(data) {
                    $scope.groupsList[p_idx].hosts[idx].comps = data;
                    if ($scope.groupsList[p_idx].hosts[idx].comps.length == 0) {
                        $scope.groupsList[p_idx].hosts[idx].showMsg = true;
                    } else {
                        $scope.groupsList[p_idx].hosts[idx].showMsg = false;
                    }
                });
            $interval.cancel(stopStatusCall);
            stopStatusCall = $interval(function (){
                $scope.updateComps(p_idx, idx);
                $scope.getGraphValues(remote_host);
            }, 5000);
        }
    };

    $scope.UpdateManager = function (idx) {
        var remote_host = $scope.hostsList[idx].host;
        if (remote_host == "localhost") {
            remote_host = "";
        }
        $cookies.put('remote_host', remote_host);
        $rootScope.remote_host = remote_host;
        $location.path('/components/view');


    };

    $scope.openInitPopup = function (comp) {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/pgInitialize.html',
            controller: 'pgInitializeController',
        });
        modalInstance.component = comp;
    };

    $scope.changeHost = function (host) {
        $cookies.put('remote_host', host);
    }

    $scope.deleteHost = function (idx) {
        $interval.cancel(stopStatusCall);
        var hostToDelete = $scope.hostsList[idx].host;
        if($cookies.get('remote_host') == hostToDelete){
            $cookies.put('remote_host', 'localhost');
        }
        session.call('com.bigsql.deleteHost', [hostToDelete]);
        session.subscribe("com.bigsql.onDeleteHost", function (data) {
            getGroupsList();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });
    }

    $scope.deleteGroup = function (idx){
        $interval.cancel(stopStatusCall);
        var groupToDelete = $scope.groupsList[idx].group;
        session.call('com.bigsql.deleteGroup', [groupToDelete]);
        session.subscribe("com.bigsql.onDeleteGroup", function (data) {
            getGroupsList();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });
    }

    function hostsInfo(){
        $scope.hostsInfoData = [];
        for (var i = $scope.hostsList.length - 1; i >= 0; i--) {
            $scope.loadHostsInfo(i);
        }
    }

    function getGroupsList(argument) {
        $http.get($window.location.origin + '/api/groups')
            .success(function (data) {
                $scope.groupsList = data;
                $rootScope.$emit('hideUpdates');
                $scope.nothingInstalled = false;
                $scope.loading = false;
            })
            .error(function (error) {
                $timeout(wait, 5000);
                $scope.loading = false;
                $scope.retry = true;
            });

    };

    getGroupsList();

    $rootScope.$on('addedHost', function () {
        getGroupsList();
    });

    $scope.action = function ( event, host) {
        var showingSpinnerEvents = ['Initialize', 'Start', 'Stop'];
        if(showingSpinnerEvents.indexOf(event.target.innerText) >= 0 ){
            currentComponent = getCurrentComponent( event.currentTarget.getAttribute('value'), host);
            currentComponent.showingSpinner = true;
        }
        if (event.target.tagName == "A") {
            if(host == 'localhost'){
                if(event.target.innerText.toLowerCase() != 'initialize'){
                    session.call(apis[event.target.innerText], [event.currentTarget.getAttribute('value')]); 
                }
            }else{
                var cmd = event.target.innerText.toLowerCase();
                if( cmd == 'initialize'){
                    cmd = 'init';
                }
                var event_url = cmd + '/' + event.currentTarget.getAttribute('value') + '/' + host;
                var eventData = bamAjaxCall.getCmdData(event_url);
            }
        }
        ;
    };

    $scope.installedComps = function (event) {
        session.call('com.bigsql.setBamConfig', ['showInstalled', $scope.showInstalled]);
    };


    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $timeout(function () {
        if ($scope.loading) {
            $window.location.reload();
        }
        ;
    }, 5000);

    function wait() {
        $window.location.reload();
    };

    $scope.open = function (p_idx, idx) {
            $scope.editHost = '';
            if(idx >= 0){
                $scope.editHost = $scope.groupsList[p_idx].hosts[idx];
            }

            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/addHostModal.html',
                windowClass: 'modal',
                controller: 'addHostController',
                scope: $scope,
            });
        };

    $scope.openGroupsModal = function (idx) {

            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/addServerGroupsModal.html',
                windowClass: 'modal',
                controller: 'addServerGroupsController',
                scope: $scope,
            });
            $scope.editGroup = '';
            if(idx){
                $scope.editGroup = $scope.groupsList[idx];
                for (var i = $scope.groupsList.length - 1; i >= 0; i--) {
                    if($scope.groupsList[i].group == $scope.editGroup.group){
                        modalInstance.groupServers = $scope.groupsList[i].hosts;
                    }
                }
            }
        };

    $scope.showTop = function (idx) {
        var remote_host = $scope.hostsList[idx].host;
        if (remote_host == "localhost") {
            remote_host = "";
        }

        $scope.top_host = remote_host;
        $scope.host_info = $scope.hostsList[idx].hostInfo;


        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/topModal.html',
            windowClass: 'modal',
            size: 'lg',
            controller: 'topController',
            scope : $scope
        });
    };

    $scope.openGraphModal = function (chartName) {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/hostGraphModal.html',
            windowClass: 'modal',
            size: 'lg',
            controller: 'hostGraphModalController',
            scope : $scope
        });
        if(chartName == 'CPU Load'){
            modalInstance.data = $scope.cpuData;
            modalInstance.chart = angular.copy($scope.cpuChart);
        } else if(chartName == 'Disk IO'){
            modalInstance.data = $scope.diskIO;
            modalInstance.chart = angular.copy($scope.ioChart);
        } else {
            modalInstance.data = $scope.NetworkIO;
            modalInstance.chart = angular.copy($scope.networkChart);
        }
        modalInstance.chartName = chartName;
        modalInstance.hostName = $scope.hostsList[$scope.openedHostIndex].host;
    }

    $rootScope.$on('updateGroups', function (argument) {
        getGroupsList();
    })
    
    // Handle page visibility change events
    function handleVisibilityChange() {
        if (document.visibilityState == "hidden") {
            $interval.cancel(stopStatusCall);
            clear();
        } else if (document.visibilityState == "visible") {
            clear();
            $scope.loadHost($scope.openedGroupIndex, $scope.openedHostIndex, true);
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange, false);

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        $interval.cancel(stopStatusCall);
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);


angular.module('bigSQL.components').controller('addHostController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', function ($scope, $uibModalInstance, PubSubService, $rootScope) {

    var session;
	var sessPromise = PubSubService.getSession();
	var subscriptions = [];
	$scope.tryToConnect = false;
	$scope.connectionStatus = false;
	$scope.registerResponse;
	$scope.type = 'Add';

	$scope.hostName = '';
	$scope.pgcDir = '';
	$scope.userName = '';

	if($scope.editHost){
		$scope.type = 'Edit';
		$scope.hostName = $scope.editHost.host;
		$scope.pgcDir = $scope.editHost.pgc_home;
		$scope.userName = $scope.editHost.user;
		$scope.connectionName = $scope.editHost.name;
	}

    sessPromise.then(function (sessParam) {
        session = sessParam;
        $scope.addHost = function () {
        	$scope.connectionError = false;
        	$scope.registerResponse = '';
	        session.call('com.bigsql.registerHost',[$scope.hostName, $scope.pgcDir, $scope.userName, $scope.password, $scope.connectionName]);
	    	$scope.tryToConnect = true;
	    	
	    	session.subscribe("com.bigsql.onRegisterHost", function (data) {
	    		$scope.registerResponse = data[0];
	    		
	    		var jsonData =  JSON.parse(data[0]);
	    		if(jsonData[0].state == 'completed'){
	    			$rootScope.$emit('addedHost'); 
	    			$uibModalInstance.dismiss('cancel');
	    		}else if (jsonData[0].state == 'progress') {
	    			$scope.tryToConnect = false;
	    			$scope.connectionStatus = true;
	    			$scope.message = jsonData[0].msg;
	    		} else if(jsonData[0].state == 'error'){
	    			$scope.tryToConnect = false;
	    			$scope.connectionError = true;
	    			$scope.message = jsonData[0].msg;
	    			// $uibModalInstance.dismiss('cancel');
	    		}
	    		$scope.$apply();
	        }).then(function (subscription) {
	            subscriptions.push(subscription);
	        });
	    }
    });

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    };

}]);
angular.module('bigSQL.components').controller('addServerGroupsController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$http', '$window', function ($scope, $uibModalInstance, PubSubService, $rootScope, $http, $window) {

    var session;
	var sessPromise = PubSubService.getSession();
	var subscriptions = [];
	$scope.type = 'Add';
	$scope.CreatingGroup = false;

	$scope.hostName = '';
	$scope.pgcDir = '';
	$scope.userName = '';
	$scope.availableServers = [];
	$scope.groupServers = [];
	if($scope.editGroup){
		$scope.type = 'Edit';
		$scope.name = $scope.editGroup.group;
		$scope.groupId = $scope.editGroup.group_id;
		$scope.groupServers = $uibModalInstance.groupServers;
	}

	$http.get($window.location.origin + '/api/hosts')
	    .success(function (data) {
	    	if($scope.groupServers.length > 0){
	    		for (var i = 0 ; i < data.length; i++) {
	    			for (var j = 0; j < $scope.groupServers.length; j++) {
	    				if($scope.groupServers[j].host_id == data[i].host_id){
	    					data.splice(i, 1);
	    				}
	    			}
	    		}
	    	} 
		    $scope.availableServers = data;	    		
	    	
	    })
	    .error(function (error) {
	        
	    });

	
	$scope.addToGroup = function (argument) {
		for (var i = argument.length - 1; i >= 0; i--) {
			var data = JSON.parse(argument[i])
			$scope.availableServers = $scope.availableServers.filter(function(arg) { 
			   return arg.host_id !== data.host_id;  
			});
			$scope.groupServers.push(data);
		}
	}

	$scope.removeFromGroup = function (argument) {
		for (var i = argument.length - 1; i >= 0; i--) {
			var data = JSON.parse(argument[i])
			$scope.groupServers = $scope.groupServers.filter(function(arg) { 
			   return arg.host_id !== data.host_id;  
			});
			$scope.availableServers.push(data);
		}
	}

    sessPromise.then(function (sessParam) {
        session = sessParam;
        session.subscribe('com.bigsql.onRegisterServerGroup', function (data) {
		    	var jsonData = JSON.parse(data[0][0]);
		    	if(jsonData[0].state == "completed"){
		    		$scope.message = jsonData[0].msg;
		    		$scope.$apply();
		    		$uibModalInstance.dismiss('cancel');
		    		$rootScope.$emit('updateGroups');
		    	}
		    }).then(function (data) {
		    })
    });

    

    $scope.addServerGroup = function(argument) {
		$scope.CreatingGroup = true;
		var hosts_id = [];
		$scope.message = "Creating Group...";
		for (var i =0; i < $scope.groupServers.length ; i++) {
			hosts_id.push(parseInt($scope.groupServers[i].host_id));
		}
		session.call('com.bigsql.registerServerGroup',[argument, hosts_id]);
	}

	$scope.updateServerGroup = function(argument) {
		$scope.updatingGroup = true;
		var hosts_id = [];
		$scope.message = "Updating Group...";
		for (var i =0; i < $scope.groupServers.length ; i++) {
			hosts_id.push(parseInt($scope.groupServers[i].host_id));
		}
		session.call('com.bigsql.updateServerGroup',[argument, hosts_id, $scope.groupId]);
		$uibModalInstance.dismiss('cancel');
		$rootScope.$emit('updateGroups');
	}

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    };

}]);
angular.module('bigSQL.components').controller('badgerController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', '$http', '$location', 'bamAjaxCall', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, $http, $location, bamAjaxCall) {

    $scope.alerts = [];
    $scope.checkedFirst = false;

    var subscriptions = [];
    $scope.components = {};
    $scope.disableLog = true;
    $scope.generatingReportSpinner = false;
    $scope.autoSelectLogFile;
    $scope.selectedCurrentLogfile;
    $scope.refreshMsg= false;

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


    $scope.onSelectChange = function (comp) {
        if(comp){
            session.call('com.bigsql.get_log_files_list', [comp]);
            session.call('com.bigsql.infoComponent', [comp]);
            session.subscribe('com.bigsql.onInfoComponent', function (args) {
                $scope.logDir = JSON.parse(args[0][0])[0].logdir;
                $scope.$apply();
            });    
        }else{
            $scope.logfiles = [];
            $scope.logDir = '';
        }
        
    };

    function getReports(argument) {
        
        var infoData = bamAjaxCall.getCmdData('getrecentreports/badger');
        infoData.then(function (data) {
            var files_list = data.data;
            if(files_list.length == 0){
                $scope.showReports = false;
            }else{
                $scope.files_list=files_list; 
                $scope.showReports = true;               
            }
        });

    }

    getReports();

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;
        
        session.call('com.bigsql.checkLogdir');

        session.subscribe("com.bigsql.onCheckLogdir", function (components) {
            $scope.components = JSON.parse(components[0]);
            if($scope.components.length == 1){
                $scope.selectComp = $scope.components[0].component;
                $scope.onSelectChange($scope.selectComp);
            }
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        session.subscribe("com.bigsql.log_files_list", function (data) {
            $scope.logfiles = JSON.parse(data[0]);
            if($scope.autoSelectLogFile){
                $scope.checkedFirst = true;
            }
            $scope.disableLog = false;
            $scope.apply();

        });
    });

    $scope.openLoggingParam = function (argument) {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/loggingParam.html',
            controller: 'loggingParamController',
            windowClass: 'app-modal-window'
        });
        modalInstance.comp=$scope.selectComp;
    };

    $scope.openSwitchlog = function (argument) {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/switchLogfile.html',
            controller: 'switchLogfileController',
            windowClass: 'switch-modal-window'
        });
        modalInstance.comp=$scope.selectComp;
        modalInstance.currentLogfile = $scope.logfiles[0].file;
    };


    $scope.openGenerateModal = function (argument) {
        $scope.report_file = "";
        $scope.report_url = "";
        var selectedFiles = [];
        var selectLog = document.getElementsByName("selectLog");
        for (var i=0;i<selectLog.length; i++){
            if(selectLog[i].checked){
                selectedFiles.push(selectLog[i].value);
            }
        }
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/generateBadgerReport.html',
            controller: 'generateBadgerReportController',
            windowClass: 'switch-modal-window',
            backdrop  : 'static',
            keyboard  : false
        });
        modalInstance.selectedFiles = selectedFiles;
        modalInstance.pgTitle = $scope.pgTitle;
        modalInstance.pgDB = $scope.pgDB;
        modalInstance.pgJobs = $scope.pgJobs;
        modalInstance.pgLogPrefix = $scope.pgLogPrefix;
    };

    $scope.deleteReports = function (files, selectAll) {
        var deleteFiles = [];
        if(selectAll){
            for (var i = files.length - 1; i >= 0; i--) {
                deleteFiles.push(files[i].file);
            }
        }else{
            for (var i = files.length - 1; i >= 0; i--) {
                if(files[i].selected){
                    deleteFiles.push(files[i].file);
                }
            }            
        }
        var removeFiles = $http.post($window.location.origin + '/api/remove_reports/badger', deleteFiles);
        removeFiles.then(function (data) {
            if(data.data.error == 0){
                getReports();
            }
        });
    }

    $scope.refreshLogfiles = function (comp) {
        $scope.refreshMsg = true;
        $timeout(function() {
            session.call('com.bigsql.get_log_files_list', [comp]);
            $scope.refreshMsg = false;
        }, 1000);
    }

    $rootScope.$on('switchLogfile', function (argument, fileName, comp) {
        $scope.autoSelectLogFile = fileName;
        session.call('com.bigsql.get_log_files_list', [comp]);
    });

    $rootScope.$on('updateReports', function (argument) {
        getReports();
    })

    $rootScope.$on('switchLogfileError', function (argument, error) {
        $scope.badgerError = error.status;
    });

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
              $scope.$apply();
         			// var components = $(JSON.parse(args[0])).filter(function(i,n){ return n.category === 1;});
          		// if(components.length != 0){
          		// 	$window.location.href = "#/details-pg/" + components[0].component;
          		// 	$rootScope.$emit('topMenuEvent');
          		// } else {
          		// 	$window.location.href = "#/components/view";	
          		// }
	        }).then(function (subscription) {
	            subscriptions.push(subscription);
	        });
        });

	$timeout(function() {
        if ($scope.bamLoading) {
            $window.location.reload();
        };
    }, 10000);

	$scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    });

}]);
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

    function clear() {
        $scope.rowsData[0].values.splice(0, $scope.rowsData[0].values.length);
        $scope.rowsData[1].values.splice(0, $scope.rowsData[1].values.length);
        $scope.rowsData[2].values.splice(0, $scope.rowsData[2].values.length);
        $scope.rowsData[3].values.splice(0, $scope.rowsData[3].values.length);


        $scope.commitRollbackData[0].values.splice(0, $scope.commitRollbackData[0].values.length);
        $scope.commitRollbackData[1].values.splice(0, $scope.commitRollbackData[1].values.length);


        $scope.connectionsData[0].values.splice(0, $scope.connectionsData[0].values.length);
        $scope.connectionsData[1].values.splice(0, $scope.connectionsData[1].values.length);
        $scope.connectionsData[2].values.splice(0, $scope.connectionsData[2].values.length);

        $scope.cpuData[0].values.splice(0, $scope.cpuData[0].values.length);
        $scope.cpuData[1].values.splice(0, $scope.cpuData[1].values.length);

        $scope.diskIOData[0].values.splice(0, $scope.diskIOData[0].values.length);
        $scope.diskIOData[1].values.splice(0, $scope.diskIOData[1].values.length);
    }

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

        // Handle page visibility change events
        function handleVisibilityChange() {
            if (document.visibilityState == "hidden") {
                $interval.cancel(refreshRate);
                clear();
            } else if (document.visibilityState == "visible") {
                clear();
                session.call('com.bigsql.initial_dbstats', [$stateParams.component]);
                session.call("com.bigsql.initial_graphs");
                refreshRate = $interval(callStatus, 5000);
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange, false);
	});

	//need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
        clear();
        $interval.cancel(refreshRate);
    });

}]);
angular.module('bigSQL.components').controller('hostGraphModalController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$http', '$window', '$interval', '$rootScope', 'bamAjaxCall', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $http, $window, $interval, $rootScope, bamAjaxCall) {

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.chartName = $uibModalInstance.chartName;
    $scope.data = $uibModalInstance.data;
    $scope.hostName = $uibModalInstance.hostName;

    var chart = $uibModalInstance.chart;
    chart.chart['showLegend'] = true;
    $scope.chart = chart;

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
    
}]);

angular.module('bigSQL.components').controller('loggingParamController', ['$scope','$rootScope', '$uibModalInstance', 'PubSubService', '$sce', function ($scope, $rootScope, $uibModalInstance, PubSubService, $sce) {

    var session;

    $scope.showResult = false;
    $scope.showStatus =  true;
    $scope.changedVales = {};
    $scope.initialValues = {};
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
            for (var i = $scope.data.length - 1; i >= 0; i--) {
                $scope.initialValues[$scope.data[i].name] = $scope.data[i].setting;
            }
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
            $scope.changedVales[value] = setting;
        }
        
    }

    $scope.save = function (changedVales, comp) {
        if(Object.keys(changedVales).length > 0 && $scope.initialValues != $scope.changedVales){
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
angular.module('bigSQL.components').controller('pgInitializeController', ['$scope','$rootScope', '$uibModalInstance','MachineInfo', 'PubSubService', 'bamAjaxCall', function ($scope, $rootScope, $uibModalInstance, MachineInfo, PubSubService, bamAjaxCall) {

	var session;
    var subscriptions = [];

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.comp = $uibModalInstance.component;

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
angular.module('bigSQL.components').controller('profilerController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', '$http', '$location', 'bamAjaxCall', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, $http, $location, bamAjaxCall) {

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

    var statusData = bamAjaxCall.getCmdData('status');
    statusData.then(function(info) {
        if(info.length > 0 && localStorage.length == 0){
            var infoData = bamAjaxCall.getCmdData('read/env/' + info[0].component)
            infoData.then(function(info) {
                $scope.hostName = 'localhost';
                $scope.pgUser = info.PGUSER;
                $scope.pgDB = info.PGDATABASE;
                $scope.pgPort = info.PGPORT; 
            });
        } 
    });

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;

        session.subscribe("com.bigsql.profilerReports", function (data) {
            $scope.generatingReportSpinner=false;
            var result=data[0];
            if (result.error == 0) {

                if(result.action == "profile_query" || result.action == "generate"){
                    $scope.report_file = result.report_file;
                    $scope.report_url = "/reports/" + result.report_file;
                }
                else{
                    $scope.errorMsg = result.msg;
                    $scope.report_file = '';
                }

                //$scope.report_file = result.report_file;
                //$scope.report_url = "/reports/" + result.report_file;
                // $window.open("http://localhost:8050/reports/" + result.report_file);
                //$scope.$apply();
                //$scope.message = data;
            } else {
                $scope.errorMsg = result.msg;
                $scope.report_file = '';
            }
            $scope.$apply();

        }).then(function (subscription) {
            subscriptions.push(subscription);
        });
    });

    $scope.hostName = localStorage.getItem('hostName');
    $scope.pgUser = localStorage.getItem('pgUser');
    $scope.pgDB = localStorage.getItem('pgDB');
    $scope.pgPort = localStorage.getItem('pgPort');



    $scope.generateReport = function () {
        $scope.report_file = "";
        $scope.report_url = "";

        $scope.generatingReportSpinner=true;


        session.call('com.bigsql.plprofiler', [
            $scope.hostName, $scope.pgUser,
            $scope.pgPort, $scope.pgDB,
            $scope.pgPass, $scope.pgQuery,
            $scope.enableProfiler, $scope.enableProfiler,
            $scope.pgTitle, $scope.pgDesc
        ]);

    };

    $scope.openRecentReports = function (argument) {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/recentReports.html',
            controller: 'recentReportsController',
            windowClass: 'switch-modal-window'
        });
        modalInstance.reportsType="profiler";
    };

    $scope.queryProfiler = function (hostName, pgUser, pgPass, pgDB, pgPort) {

        localStorage.setItem('hostName',hostName);
        localStorage.setItem('pgUser',pgUser);
        localStorage.setItem('pgDB',pgDB);
        localStorage.setItem('pgPort',pgPort);


        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/statementProfilingModal.html',
            controller: 'statementProfilingController',
        });
        modalInstance.hostName = hostName;
        modalInstance.pgUser = pgUser;
        modalInstance.pgPass = pgPass;
        modalInstance.pgDB = pgDB;
        modalInstance.pgPort = pgPort;
    };

    $scope.globalProfiling = function (hostName, pgUser, pgPass, pgDB, pgPort) {

        localStorage.setItem('hostName',hostName);
        localStorage.setItem('pgUser',pgUser);
        localStorage.setItem('pgDB',pgDB);
        localStorage.setItem('pgPort',pgPort);

        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/globalProfilingModal.html',
            controller: 'globalProfilingController',
        });
        modalInstance.hostName = hostName;
        modalInstance.pgUser = pgUser;
        modalInstance.pgPass = pgPass;
        modalInstance.pgDB = pgDB;
        modalInstance.pgPort = pgPort;
    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);


angular.module('bigSQL.components').controller('recentReportsController', ['$scope','$rootScope', '$uibModalInstance', 'PubSubService', 'bamAjaxCall', '$sce', '$http', '$window', function ($scope, $rootScope, $uibModalInstance, PubSubService, bamAjaxCall, $sce, $http, $window) {

	var session;

    $scope.showResult = false;
    $scope.showStatus =  true;
    $scope.autoSelect = false;
    $scope.logAction = false;
    $scope.showError = false;
    $scope.logFile = 'pgbadger-%Y%m%d_%H.log';
    var subscriptions = [];
    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;

        var reportsType = $scope.reportsType;
        var infoData = bamAjaxCall.getCmdData('getrecentreports/' + reportsType);
        infoData.then(function (data) {
            var files_list = data.data;
            if(files_list.length == 0){
                $scope.showError = true;
            }else{
                $scope.files_list=files_list;                
            }
        });



    });

    $scope.reportsType = $uibModalInstance.reportsType;

    $scope.removeFiles = function (files, selectAll) {
        var deleteFiles = [];
        if(selectAll){
            for (var i = files.length - 1; i >= 0; i--) {
                deleteFiles.push(files[i].file);
            }
        }else{
            for (var i = files.length - 1; i >= 0; i--) {
                if(files[i].selected){
                    deleteFiles.push(files[i].file);
                }
            }            
        }
        var removeFiles = $http.post($window.location.origin + '/api/remove_reports/profiler', deleteFiles);
        removeFiles.then(function (data) {
            if(data.data.error == 0){
                $uibModalInstance.dismiss('cancel');
            }
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
angular.module('bigSQL.components').controller('statementProfilingController', ['$scope','$rootScope', '$uibModalInstance','MachineInfo', 'PubSubService', function ($scope, $rootScope, $uibModalInstance, MachineInfo, PubSubService) {

	var session;

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;
    });

    $scope.hostName = $uibModalInstance.hostName;
    $scope.pgUser = $uibModalInstance.pgUser;
    $scope.pgPass = $uibModalInstance.pgPass;
    $scope.pgDB = $uibModalInstance.pgDB;
    $scope.pgPort = $uibModalInstance.pgPort;
    $scope.enableProfiler = false;

    $scope.generateReport = function (argument) {
    	session.call('com.bigsql.plprofiler', [
            $scope.hostName, $scope.pgUser,
            $scope.pgPort, $scope.pgDB,
            $scope.pgPass, $scope.pgQuery,
            $scope.pgTitle, $scope.pgDesc,
            'profile_query'
        ]).then(function (sub) {
        	$uibModalInstance.dismiss('cancel');
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
angular.module('bigSQL.components').controller('switchLogfileController', ['$scope','$rootScope', '$uibModalInstance', 'PubSubService', '$sce', function ($scope, $rootScope, $uibModalInstance, PubSubService, $sce) {

	var session;

    $scope.showResult = false;
    $scope.showStatus =  true;
    $scope.autoSelect = false;
    $scope.logAction = false;
    $scope.logFile = 'pgbadger-%Y%m%d_%H.log';
    var subscriptions = [];
    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
    	session = val;

    });

    $scope.comp = $uibModalInstance.comp;
    $scope.currentLogfile = $uibModalInstance.currentLogfile;

    $scope.switchFile = function (fileName) {
        session.call('com.bigsql.switch_log_file', [
            $scope.comp, fileName
        ]);

        session.subscribe("com.bigsql.onSwitchLogfile", function (data) {
            var result = data[0];
            
            if(result.error == 0){
                $scope.logAction = true;
                $scope.$apply()
                window.setTimeout(function() {
                    $rootScope.$emit('switchLogfile', fileName, $scope.comp);
                }, 2000);
            }else{
                $rootScope.$emit('switchLogfileError', result);
                $uibModalInstance.dismiss('cancel');
            }

        }).then(function (sub) {
            subscriptions.push(sub);
        }); 

        session.subscribe("com.bigsql.log_files_list", function (data) {
            $uibModalInstance.dismiss('cancel');
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
angular.module('bigSQL.components').controller('topController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$http', '$window', '$interval', '$rootScope', 'bamAjaxCall', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $http, $window, $interval, $rootScope, bamAjaxCall) {

    var session;
    var subscriptions = [];
    $scope.components = {};
    $scope.alerts = [];

    var updateSelectedList = [];
    var currentComponent = {};
    var checkUpdates;

    var topRefresh;

    var previousTopData = "";

    function getTopCmdData() {

        //console.log($scope.top_host);

        var selectedHost = $scope.top_host;
        $scope.loadingSpinner = true;
        $scope.body = false;
        $scope.hostinfo = $scope.host_info;


        if (selectedHost == "") {
            $scope.host = "localhost";
            var infoData = bamAjaxCall.getCmdData('top');
        } else {
            $scope.host = selectedHost;
            var infoData = bamAjaxCall.getCmdData('hostcmd/top/' + selectedHost);
        }

        infoData.then(function (data) {
            $scope.topProcess = data[0];
            $scope.topProcess.kb_read_sec = 0;
            $scope.topProcess.kb_write_sec = 0;
        });


        $scope.loadingSpinner = false;
        $scope.body = true;

    }


    topRefresh = $interval(getTopCmdData, 2000);
    $scope.cancel = function () {
        $interval.cancel(topRefresh);
        $uibModalInstance.dismiss('cancel');
    };


    var sessionPromise = PubSubService.getSession();

    sessionPromise.then(function (val) {
        getTopCmdData();
    });

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
    /**
     Unsubscribe to all the apis on the template and scope destroy
     **/
    $scope.$on('$destroy', function () {
        $interval.cancel(topRefresh);

        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }

    });

}]);

angular.module('bigSQL.components').controller('usersController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$http', '$window', '$interval', '$rootScope', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $http, $window, $interval, $rootScope) {

    var session;
    var subscriptions = [];
    $scope.components = {};
    $scope.alerts = [];

    var updateSelectedList = [];
    var currentComponent = {};
    var checkUpdates;
    $scope.users;

    // new user url = /admin/user_management/user/
    // post data format {email: "test@test.com", active: true, role: "2", newPassword: "password", confirmPassword: "password"}
    // reponse : {"active": true, "role": 2, "id": 4, "email": "tt@tt.com"}

    //delete a user : http://localhost:8050/admin/user_management/user/4
    // responce : {"info": "User Deleted.", "errormsg": "", "data": {}, "result": null, "success": 1}

    //update password : /admin/user_management/user/1
    // request method : PUT
    // data for password : {id: 1, newPassword: "123456", confirmPassword: "123456"}
    // data for status change : {id: 2, active: false}
    // data for role change : {id: 2, role: "1"}
    //response {"active": true, "role": 1, "id": 1, "email": "mahesh.balumuri@openscg.com"}

    function getList() {

        $scope.loadingSpinner = true;
        $scope.body = false;

        $http.get($window.location.origin + '/admin/user_management/role/')
            .success(function (data) {
                $scope.roles = data;

            });

        $http.get($window.location.origin + '/admin/user_management/user/')
            .success(function (data) {
                $scope.users = data;

            });

        $scope.loadingSpinner = false;
        $scope.body = true;

    }

    // $interval(saveUser, 10000);

    $http.get($window.location.origin + '/api/userinfo')
                .success(function(data) {
                    $scope.userInfo = data;

                });

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');

    };

    $scope.addAuserForm = function () {
        if ($scope.users[$scope.users.length - 1].email || $scope.users.length == 1) {
            var newUser = {
                id : $scope.users.length + 1,
                active: true,
                email: '',
                role: 2,
                new: true,
            };
        $scope.users.push(newUser);
        }
    };

    $scope.deleteUser = function (user_id) {

        var delete_url = $window.location.origin + '/admin/user_management/user/' + user_id;

        $http.delete(delete_url)
            .success(function (data) {
                getList();
            })
            .error(function (data, status, header, config) {

            });

    };

    $rootScope.$on('updateUser' ,function (event, updateData) {

        var url = $window.location.origin + '/admin/user_management/user/' + updateData.id;
        $http.put(url, updateData)
            .success(function (data) {
                $scope.alerts.push({
                    msg: data.email + " updated sucessfully."
                });
                getList();
            })
            .error(function (data, status, header, config) {
                $scope.alerts.push({
                    msg: JSON.stringify({data: data})
                });
            });

    });

    $rootScope.$on('saveUser', function(event, userData) {

        var isUpdate = true;

        //checking new filed in $scope.user for new users
        for(var i=0; i < $scope.users.length ; i++){
            if($scope.users[i].new){
                isUpdate = false;
                var res = $http.post($window.location.origin + '/admin/user_management/user/', userData);

                res.success(function (data, status, headers, config) {

                    $scope.statusMsg = data;
                    $scope.alerts.push({
                        msg: data.email + " has been added sucessfully."

                    });
                    getList();

                });

                res.error(function (data, status, headers, config) {
                    $scope.statusMsg = data;
                    $scope.alerts.push({
                        msg: JSON.stringify({data: data})
                    });
                });
            }
        }

        //update already exists user
        if(isUpdate){
            var url = $window.location.origin + '/admin/user_management/user/' + userData.id;
            $http.put(url, userData)
            .success(function (data) {
                $scope.alerts.push({
                    msg: data.email + " updated sucessfully."
                });
                getList();
            })
            .error(function (data, status, header, config) {
                $scope.alerts.push({
                    msg: JSON.stringify({data: data})
                });
            });

        }

    });

    $rootScope.$on('callGetList', function(event) {
        getList();
    })

    var sessionPromise = PubSubService.getSession();

    sessionPromise.then(function (val) {
        getList();
    });

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
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

angular.module('bigSQL.components').controller('whatsNewController', ['$scope','$rootScope', '$uibModalInstance', 'PubSubService', '$sce', 'bamAjaxCall', function ($scope, $rootScope, $uibModalInstance, PubSubService, $sce, bamAjaxCall) {

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    var whatNew = bamAjaxCall.getCmdData('relnotes/' + $uibModalInstance.component )
    whatNew.then(function (data) {
        $scope.whatsNewText = $sce.trustAsHtml(data);
    });

}]);
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
        });
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
angular.module('bigSQL.components').directive('bigsqlInstallComponent', function () {
    var directive = {};

    directive.restrict = 'E';
    /* restrict this directive to elements */
    directive.transclude = true;
    directive.template = "<div class='bigsqlInstallComponent' ng-transclude></div>";

    return directive;
});
angular.module('bigSQL.components').factory('UpdateBamService', function (PubSubService, $q) {

    var bamUpdateInfo;
    var info;


    var getBamUpdateInfo = function () {

        return $q(function (resolve, reject) {

            var subscription;
            var sessionPromise = PubSubService.getSession();
            sessionPromise.then(function (session) {
                session.call('com.bigsql.infoComponent', ['devops']);

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

angular.module('bigSQL.components').factory('bamAjaxCall', function ($q, $http, $window) {


    var getCmdData = function (cmd) {

        return $q(function (resolve, reject) {
            $http.get($window.location.origin + '/api/' + cmd)
            .success(function(data) {
                resolve(data);
            }).error(function (data) {
                resolve('error');
            });
            

        });
    };

    return {
        getCmdData: getCmdData,
    }
});

angular.module('bigSQL.menus').component('devOpsUpdate', {
    bindings: {},
    controller: function ($rootScope, $scope, PubSubService, MachineInfo, $uibModal, UpdateComponentsService, UpdateBamService, bamAjaxCall) {

        var subscriptions = [];

        var session;

        /**Below function is for displaying update badger on every page.
         **/
        var infoData = bamAjaxCall.getCmdData('info/devops');
        infoData.then(function(info) {
            var data = info[0];
            if ( data.component == "devops" && data.is_current == 0 && data.current_version ) {
                $scope.bamUpdate = true;
            } else {
                $scope.bamUpdate = false;
            }
        });

        $scope.open = function () {

            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/devOpsUpdate.html',
                windowClass: 'bam-update-modal modal',
                controller: 'ComponentDevopsUpdateController',
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
    controller: function ($rootScope, $scope, $uibModal, UpdateComponentsService, bamAjaxCall, $cookies) {

        /**Below function is for displaying update badger on every page.
         **/

        $scope.hideUpdates = false;
        $scope.currentHost = $cookies.get('remote_host');
        function callList(argument) {
            argument = typeof argument !== 'undefined' ? argument : "";

            $scope.currentHost = argument;
            // var listData = bamAjaxCall.getCmdData('list');
            if (argument=="" || argument == 'localhost'){
                var listData = bamAjaxCall.getCmdData('list');
            } else{
                var listData = bamAjaxCall.getCmdData('hostcmd/list/'+argument);
            }
            listData.then(function(data) {
                var Checkupdates = 0;
                $scope.components = data;
                for (var i = 0; i < $scope.components.length; i++) {
                    if ($scope.components[i].component != 'devops') {
                        Checkupdates += $scope.components[i].updates;
                    }
                }
                if(!$scope.hideUpdates){
                    $scope.updates = Checkupdates;
                }else{
                    $scope.updates = '';
                }
            });
        }
        
        // callList($scope.currentHost);

        $rootScope.$on('refreshData', function (argument, host) {
            callList(host);
        });

        $rootScope.$on('updatesCheck', function (argument, host) {
            callList(host);
        });

        $rootScope.$on('hideUpdates', function (argument, host) {
            $scope.hideUpdates = true;
            callList($scope.currentHost);
        });

        $rootScope.$on('showUpdates', function (argument) {
            $scope.hideUpdates = false; 
            callList($scope.currentHost);   
        });

        var infoData = bamAjaxCall.getCmdData('info');
        infoData.then(function(data) {
            $scope.pgcInfo = data[0];
        });

        var userInfoData = bamAjaxCall.getCmdData('userinfo');
        userInfoData.then(function(data) {
            $scope.userInfo = data;
        });

        $scope.open = function () {

            UpdateComponentsService.setCheckUpdatesAuto();

            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/updateModal.html',
                windowClass: 'bam-update-modal modal',
                controller: 'ComponentsUpdateController',
            });
        };

        $scope.usersPopup = function () {

            UpdateComponentsService.setCheckUpdatesAuto();

            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/usersModal.html',
                windowClass: 'modal',
                size: 'lg',
                controller: 'usersController',
            });
        };

    },
    templateUrl: "../app/menus/partials/topMenu.html"
});