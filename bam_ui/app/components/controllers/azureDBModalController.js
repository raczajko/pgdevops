angular.module('bigSQL.components').controller('azureDBModalController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$http', '$window', '$interval', '$rootScope', 'pgcRestApiCall', 'bamAjaxCall', 'htmlMessages', '$uibModal', '$cookies', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $http, $window, $interval, $rootScope, pgcRestApiCall, bamAjaxCall, htmlMessages, $uibModal, $cookies) {

    $scope.loadingSpinner = true;
    $scope.lab = $uibModalInstance.lab;
    $scope.disp_name = $uibModalInstance.disp_name;
    $scope.instance = $uibModalInstance.instance;
    $scope.availList = [];
    var addList = [];
    $scope.addToMetadata = false;
    $scope.discoverMsg = htmlMessages.getMessage('loading-regions');
    var session;
    $scope.region = '';
    $scope.showUseConn = false;
    var regions = pgcRestApiCall.getCmdData('metalist azure-regions');
    regions.then(function(data){
        $scope.loadingSpinner = false;
        $scope.regions = data;
        var regionCookie = $cookies.get($scope.lab+'-lastSelRegion');
        if(regionCookie){
            $scope.region = regionCookie;
        }
    });

    $scope.regionChange = function (region) {
        $scope.showUseConn = true;
        if (region==null) {
            region = '';
        }
        $cookies.put($scope.lab+'-lastSelRegion', region);
        $scope.availList = [];
        $scope.loadingSpinner = true;
        $scope.noRDS = false;
        $scope.ec2List = [];
        $scope.checked = false;
        $scope.discoverMsg = 'Searching';
        if (region) {
            var cmd = 'instances '+ $scope.instance +' --email '+$scope.userInfo.email+' --region '+region + ' --cloud '+$scope.lab;
        }else{
            var cmd = 'instances '+ $scope.instance +' --email '+$scope.userInfo.email + ' --cloud '+$scope.lab
        }
        var getData = pgcRestApiCall.getCmdData(cmd);
        getData.then(function(data){
            if (data.state == 'info') {
                $scope.discoverMsg = data.message;
            }else if (data.state=="error") {
                $scope.loadingSpinner = false;
                $scope.errMsg = data.message;
                // $rootScope.$emit('disableLab', $scope.lab, 'off')
            }else if(data.state=="completed"){
                $scope.loadingSpinner = false;
                $scope.availList = [];
                if($scope.instance == 'db'){
                    $scope.rdsList = data.data;
                    for (var i = $scope.rdsList.length - 1; i >= 0; i--) {
                        if ($scope.rdsList[i].is_in_pglist == true) {
                            $scope.rdsList[i].selected = true;
                            $scope.checked = true;
                        }
                        $scope.availList.push($scope.rdsList[i]);
                    }
                    $scope.newAvailList = $($scope.availList).filter(function(i,n){ return n.is_in_pglist != true });
                }
                else if($scope.instance == 'vm'){
                    $scope.vmList = data.data;
                }

                if (data.data.length == 0 ) {
                    $scope.noRDS = true;
                    if($scope.instance == 'db'){
                        $scope.noInstanceMsg = htmlMessages.getMessage('no-rds');
                    }else{
                        $scope.noInstanceMsg = htmlMessages.getMessage('no-ec2');
                    }
                }
           }
        });
        /*if (region) {
            session.call('com.bigsql.instancesList', [$scope.instance, $scope.userInfo.email, region, $scope.lab]);
        }else{
            session.call('com.bigsql.instancesList', [$scope.instance, $scope.userInfo.email, '', $scope.lab]);
        }*/
        $scope.region = region;
    }

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;
        var userInfoData = pgcRestApiCall.getCmdData('userinfo');
        userInfoData.then(function(data) {
            $scope.userInfo = data;
            // session.call('com.bigsql.instancesList', [$scope.userInfo.email]);
        });

        session.subscribe('com.bigsql.onInstancesList', function (data) {
            var data = JSON.parse(data[0]);
            if (data[0].state == 'info') {
                $scope.discoverMsg = data[0].msg;
            }else if (data[0].state=="error") {
                $scope.loadingSpinner = false;
                $scope.errMsg = data[0].msg;
                // $rootScope.$emit('disableLab', $scope.lab, 'off')
            }else if(data[0].state=="completed"){
                $scope.loadingSpinner = false;
                $scope.availList = [];
                if($scope.instance == 'db'){
                    $scope.rdsList = data[0].data;
                    for (var i = $scope.rdsList.length - 1; i >= 0; i--) {
                        if ($scope.rdsList[i].is_in_pglist == true) {
                            $scope.rdsList[i].selected = true;
                            $scope.checked = true;
                        }
                        $scope.availList.push($scope.rdsList[i]);
                    }
                    $scope.newAvailList = $($scope.availList).filter(function(i,n){ return n.is_in_pglist != true });
                }
                else if($scope.instance == 'vm'){
                    $scope.vmList = data[0].data;
                }

                if (data[0].data.length == 0 ) {
                    $scope.noRDS = true;
                    if($scope.instance == 'db'){
                        $scope.noInstanceMsg = htmlMessages.getMessage('no-rds');
                    }else{
                        $scope.noInstanceMsg = htmlMessages.getMessage('no-ec2');
                    }
                }
           }
           $scope.$apply();
        });

    });

    // var rdslist = pgcRestApiCall.getCmdData('rdslist');
    // rdslist.then(function (data) {
    //     $scope.loadingSpinner = false;
    //     if (data[0].state=="error") {
    //         $scope.errMsg = data[0].msg;
    //         $rootScope.$emit('disableLab', $scope.lab, 'off')
    //     }else{
    //         $scope.rdsList = data;
    //         for (var i = $scope.rdsList.length - 1; i >= 0; i--) {
    //             if($scope.rdsList[i].status == 'available'){
    //                 $scope.availList.push($scope.rdsList[i]);
    //             }
    //         }
    //         if ($scope.availList.length == 0) {
    //             $scope.noRDS = true;
    //             $scope.noRDSMsg = htmlMessages.getMessage('no-rds');
    //         }
    //     }
    // });

    $scope.createConnPgadmin = function(index){
        debugger
        $scope.addToMetadata = true;
        $scope.addToMetadataMsg = htmlMessages.getMessage('add-to-pgadmin');
        var argsJson = [];
        for (var i = $scope.availList.length - 1; i >= 0; i--) {
            if($scope.availList[i].selected && !$scope.availList[i].is_in_pglist){
                var args = {};
                args['db'] = $scope.availList[i].dbname;
                args['port'] = $scope.availList[i].port;
                args['user'] = $scope.availList[i].user;
                args['host'] = $scope.availList[i].host;
                args['component'] = $scope.availList[i].instance;
                args['project'] = 'azure';
                args['rds'] = true;
                args['region'] = $scope.availList[i].region;
                argsJson.push(args);
            }
        }
        var multiArgs = {'multiple': argsJson}
        var addToMetaData = bamAjaxCall.postData('/api/add_to_metadata', multiArgs );
        addToMetaData.then(function (argument) {
            $window.location = '#/hosts'
            $rootScope.$emit('refreshPgList');
            $rootScope.$emit('refreshUpdateDate');
            $uibModalInstance.dismiss('cancel');
        } );
    };

    $scope.openRDSdetails = function (instance, region, db_class) {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/rdsDetailsModal.html',
            controller: 'rdsDetailsModalController',
            size : 'lg'
        });
        modalInstance.instance = instance;
        modalInstance.region = region;
        modalInstance.db_class = db_class;
    }

    $scope.toggleAll = function() { 
        if($scope.isAllSelected){
            $scope.isAllSelected = false;
        }else{
            $scope.isAllSelected = true;
        }
        angular.forEach($scope.availList, function(itm){ itm.selected = $scope.isAllSelected; });
        angular.forEach($scope.ec2List, function(itm){ itm.selected = $scope.isAllSelected; });
    }

    $scope.optionToggled = function(){
        $scope.checked = false;
        angular.forEach($scope.newAvailList, function (item) {
            if(item.selected){
                $scope.checked = true;
            }
        });
    }


    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.cancel = function () {
        $rootScope.$emit('refreshUpdateDate');
        $uibModalInstance.dismiss('cancel');
    };

}]);
