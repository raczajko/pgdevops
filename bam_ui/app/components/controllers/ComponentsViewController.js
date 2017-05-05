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
    $scope.extensionsList = [];
    $scope.showPgDgTab = false;
    $scope.gettingPGDGdata = false;

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
            if(comps[i]['category_desc'] == 'PostgreSQL' && comps[i]['stage'] == 'prod'){
                pgComps.push(comps[i]);
            }else if(comps[i]['category_desc'] != 'PostgreSQL'){
                nonPgComps.push(comps[i]);
            };
        }
        if(comps.length > 0 && comps[0]['component'] == 'pg10' && comps[0]['stage'] == 'test'){
            pgComps.push(comps[0]);
        }
        return  pgComps.reverse().concat(nonPgComps);
    }

    $scope.getExtensions = function( comp, idx) {
        if ($scope.components[idx].extensionOpened) {
            $window.location = '#/details-pg/' + comp
        }
        $cookies.putObject('openedExtensions', {'component': comp, 'index': idx});
        for (var i = 0; i < $scope.components.length; i++) {
            $scope.components[i].extensionOpened = false;           
        }
        $scope.components[idx].extensionOpened = true;
        if ($scope.currentHost=="" || $scope.currentHost == 'localhost'){
            var extensionsList = bamAjaxCall.getCmdData('extensions/' + comp);
        } else{
            var extensionsList = bamAjaxCall.getCmdData('extensions/' + comp + '/' + $scope.currentHost);
        }
        // var extensionsList = bamAjaxCall.getCmdData('extensions/' + comp);
        extensionsList.then(function (argument) {
            if (argument[0].state != 'error') {
                $scope.extensionsList = argument;
                if ($scope.showInstalled) {
                    $scope.extensionsList = $($scope.extensionsList).filter(function(i,n){ return n.status != "NotInstalled" ;})   
                }
                for (var i = $scope.extensionsList.length - 1; i >= 0; i--) {
                    $scope.extensionsList[i].modifiedName = $scope.extensionsList[i].component.split('-')[0].replace(/[0-9]/g,'');
                }
            }
        })   
    }

    function getList(argument) {
        argument = typeof argument !== 'undefined' ? argument : "";
        $scope.currentHost = argument;
        if (argument=="" || argument == 'localhost'){
            var listData = bamAjaxCall.getCmdData('list');
            var checkpgdgSupport = bamAjaxCall.getCmdData('info');
        } else{
            var listData = bamAjaxCall.getCmdData('hostcmd/list/'+argument);
            var checkpgdgSupport = bamAjaxCall.getCmdData('hostcmd/info/'+argument);
        }

        listData.then(function (data) {
            // $rootScope.$emit('showUpdates');
            session.call('com.bigsql.getTestSetting');
            if(data == "error" || data[0].state == 'error'){
                $timeout(wait, 5000);
                $scope.loading = false;
                $scope.retry = true;
                $cookies.remove('remote_host');
            } else {
                $scope.nothingInstalled = false;
                data = $(data).filter(function(i,n){ return n.component != 'bam2' && n.component != 'pgdevops'});
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
                    $scope.components[i].extensionOpened = false;                    
                }
                var Checkupdates = 0;
                for (var i = 0; i < $scope.components.length; i++) {
                    Checkupdates += $scope.components[i].updates;
                } 
            }
            if($cookies.get('openedExtensions')){
                var extensionCookie = JSON.parse($cookies.get('openedExtensions'));
                $scope.getExtensions( extensionCookie.component, extensionCookie.index);
            }else{
                $scope.getExtensions( $scope.components[0].component, 0);                
            }
        });
        checkpgdgSupport.then(function (argument) {
            var data = argument[0];
            if(data.os.split(' ')[0] == 'CentOS'){
                $scope.showPgDgTab = true;
            }
        })
    };

    getList($cookies.get('remote_host'));

    $rootScope.$on('updatePackageManager', function (argument) {
        getList($cookies.get('remote_host'));
    });

    $rootScope.$on('refreshData', function (argument, host) {
        $scope.loading = true;
        $scope.currentHost = host;
        getList(host);
        $scope.selectPgDg();
    });

    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
        });
    });

    var getLabList = bamAjaxCall.getCmdData('lablist');
    $scope.showPG10 = false;
    $scope.checkpgdgSetting = false;
    getLabList.then(function (argument) {
        for (var i = argument.length - 1; i >= 0; i--) {
            if(argument[i].lab == "pg10-beta" && argument[i].enabled == "on"){
                $scope.showPG10 = true;
            }
            if(argument[i].lab == "pgdg-repos" && argument[i].enabled == "on"){
                $scope.checkpgdgSetting = true;
            }
        }
    })

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;

        // session.call('com.bigsql.info');

        // session.call('com.bigsql.getBetaFeatureSetting', ['pgdg']);

        // session.subscribe("com.bigsql.onGetBeataFeatureSetting", function (settings) {
        //     if(settings[0].setting == 'pgdg'){
        //         if(settings[0].value == '0' || !settings[0].value){
        //             $scope.checkpgdgSetting = false;
        //         }else{
        //             $scope.checkpgdgSetting = true;
        //         }
        //     }
        //    $scope.$apply();
        // }).then(function (subscription) {
        //     subscriptions.push(subscription);
        // });

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
                windowClass: 'comp-details-modal',
                controller: 'ComponentsUpdateController',
            });
        };

        $scope.openInitPopup = function (comp) {
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/pgInitialize.html',
                controller: 'pgInitializeController',
            });
            modalInstance.component = comp;
            modalInstance.autoStartButton = true;
            modalInstance.dataDir = '';
            modalInstance.host = $scope.currentHost;

        };

        $scope.openDetailsModal = function (comp) {
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/details.html',
                // windowClass: 'comp-details-modal',
                size: 'lg',
                controller: 'ComponentDetailsController',
                keyboard  : false,
                backdrop  : 'static',
            });
            modalInstance.component = comp;
            modalInstance.isExtension = true;
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
    
        $scope.setTest = function (event) {
            var param;
            if($scope.isList){
                param = 'prod';
            }else{
                param = 'test'
            }
            session.call('com.bigsql.setTestSetting',[param]);
            getList();
            // session.call('com.bigsql.list');
        };

    });

    $scope.installedComps = function (event) {
        if ($scope.showInstalled) {
            $scope.showInstalled = false;
        }else{
            $scope.showInstalled = true;
        }
        session.call('com.bigsql.setBamConfig',['showInstalled', $scope.showInstalled]);
        getList($scope.currentHost); 
        // session.call('com.bigsql.list');
    }

    $scope.selectedBigsqlRepo = function (argument) {
        $scope.loading = true;
        $scope.components = '';
        getList($scope.currentHost);
    }

    $scope.repoChange = function (repo, status) {
        if (repo && repo != "undefined") {
            localStorage.setItem('cacheRepo', repo);
            var isInstalled = false;
            for (var i = $scope.pgdgRepoList.length - 1; i >= 0; i--) {
                if($scope.pgdgRepoList[i].repo == repo && $scope.pgdgRepoList[i].status=="Installed"){
                    isInstalled = true;
                }
            }
            
            $scope.selectRepo = repo;
            if (status == "Installed" || isInstalled) {
                $scope.noRepoSelected = false;
                $scope.gettingPGDGdata = true;
                $scope.repoNotRegistered = false;
                if ($scope.currentHost == 'localhost' || $scope.currentHost == '') {
                    var getRepoList =  bamAjaxCall.getCmdData('pgdg/'+ repo + '/list');
                }else{
                    var getRepoList = bamAjaxCall.getCmdData('pgdg/'+ repo + '/list/' + $scope.currentHost)
                }        
                getRepoList.then(function (argument) {
                    $scope.gettingPGDGdata = false;
                    if(argument[0].state == 'error' || argument == 'error'){
                        $scope.errorMsg = argument[0].msg;
                        if(!$scope.errorMsg){
                            $scope.errorMsg = "Selected Repository is not registered."
                        }
                        $scope.repoNotRegistered = true;
                    }else{
                        for (var i = $scope.pgdgRepoList.length - 1; i >= 0; i--) {
                            if($scope.pgdgRepoList[i].repo == $scope.selectRepo){
                                $scope.pgdgRepoList[i].status = "Installed";
                            }
                        }
                        $scope.repoNotRegistered = false;
                        $scope.repoList = argument;
                        $scope.showRepoList = true;
                    }
                }) 
            }else{
                $scope.repoNotRegistered = true;
                $scope.registerRepo(repo);
            }
        }else{
            $scope.noRepoSelected = true;
        }    
    }


    $scope.showPGDGExtraComps = function (argument) {
        $scope.repoChange(argument);
    }

    $scope.refreshRepoList = function (repo) {
        if ($scope.currentHost == 'localhost' || $scope.currentHost == '') {
            var getRepoList =  bamAjaxCall.getCmdData('pgdg/'+ repo + '/list');
        }else{
            var getRepoList = bamAjaxCall.getCmdData('pgdg/'+ repo + '/list/' + $scope.currentHost)
        }
        getRepoList.then(function (argument) {
            if(argument != 'error' || argument != 'error'){
                $scope.repoList = argument;
            }
        }) 
    }

    $scope.selectPgDg = function (argument) {
        $scope.noRepoFound = false;
        $scope.gettingPGDGdata = true;
        $scope.showRepoList = false;
        $scope.repoNotRegistered = false;
        if ($scope.currentHost == 'localhost' || $scope.currentHost == '') {
            var pgdgComps = bamAjaxCall.getCmdData('repolist')
        }else{
            var pgdgComps = bamAjaxCall.getCmdData('hostcmd/repolist/'+$scope.currentHost)
        }
        pgdgComps.then(function (data) {
            $scope.gettingPGDGdata = false;
            $scope.showRepoList = true;
            $scope.pgdgRepoList = [];
            $scope.pgdgInstalledRepoList = [];
            // for (var i = data.length - 1; i >= 0; i--) {
            //     if (data[i].status == 'Installed') {
            //         $scope.pgdgInstalledRepoList.push(data[i]);                    
            //     }
            // }
            $scope.pgdgRepoList = data;
            var selectedRepo, cookieData;
            cookieData = localStorage.getItem('cacheRepo');
            if (cookieData){
                selectedRepo = cookieData;
                $scope.selectRepo = selectedRepo;
                $scope.repoChange(selectedRepo);
                $scope.noRepoSelected = false;
            }else{
                $scope.noRepoSelected = true;
            }
            // if ($scope.pgdgInstalledRepoList.length < 1) {
            //     $scope.noRepoFound = true;
            //     $scope.availRepos = data;
            //     $scope.selectAvailRepo = data[0].repo;
            //     localStorage.setItem('cacheRepo', '');
            // }else{
            //     $scope.noRepoFound = false;
            //     var selectedRepo, cookieData;
            //     cookieData = localStorage.getItem('cacheRepo');
            //     if (cookieData){
            //         selectedRepo = cookieData;
            //         $scope.selectRepo = selectedRepo;
            //         $scope.repoChange(selectedRepo);
            //         $scope.noRepoSelected = false;
            //     }else{
            //         $scope.noRepoSelected = true;
            //     }
            // }
        })
    }

    $scope.registerRepo = function (repo) {
        
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/pgdgActionModal.html',
            controller: 'pgdgActionModalController',
            size: 'lg'
        });
        modalInstance.pgdgRepo = repo;
        modalInstance.pgdgComp = '';
        modalInstance.host = $cookies.get('remote_host');
    };


    // $scope.registerRepo = function (argument) {
    //     $scope.registeringRepo = true;
    //     var registerRepository = bamAjaxCall.getCmdData('pgdg/' + argument + '/register' )
    //     registerRepository.then(function (data) {
    //         $scope.registeringRepo = false;
    //         $scope.repoNotRegistered = false;
    //         // localStorage.setItem('cacheRepo', '');
    //        $scope.selectPgDg(); 
    //     });
    // }

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


    $scope.pgdgAction = function (action, compName, repo) {
        var cur_comp = {};
        for (var i = 0; i < $scope.repoList.length; i++) {
            if ($scope.repoList[i].component == compName) {
                $scope.repoList[i].showingSpinner = true;
            }
        }
        // if($scope.currentHost == 'localhost' || $scope.currentHost == ''){
        //     var pgdgCompAction = bamAjaxCall.getCmdData('pgdghost/' + $scope.selectRepo + '/'+ action + '/' + compName);
        // } else{
        //     var pgdgCompAction = bamAjaxCall.getCmdData('pgdghost/' + $scope.selectRepo + '/'+ action + '/' + compName + '/' + $scope.currentHost);
        // }
        // pgdgCompAction.then(function (argument) {
        //     $scope.refreshRepoList($scope.selectRepo);
        // })

        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/pgdgActionModal.html',
            controller: 'pgdgActionModalController',
            size: 'lg'
        });
        modalInstance.pgdgRepo = repo;
        modalInstance.pgdgComp = compName;
        modalInstance.action = action;
        modalInstance.host = $cookies.get('remote_host');
    }

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $rootScope.$on('initComp', function (event, comp) {
        currentComponent = getCurrentComponent(comp);
        currentComponent.init = true;
    });

    $rootScope.$on('refreshRepo', function (event, repo, status) {
        $scope.repoChange(repo, status);
    })

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