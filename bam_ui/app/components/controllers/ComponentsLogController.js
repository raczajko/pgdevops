angular.module('bigSQL.components').controller('ComponentsLogController', ['$scope', 'PubSubService', '$state','$interval','$location', '$window', '$rootScope', function ($scope, PubSubService, $state, $interval, $location, $window, $rootScope) {

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
