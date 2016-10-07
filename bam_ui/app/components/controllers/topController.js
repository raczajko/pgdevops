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


            if (previousTopData != "") {
                var diff = data[0].current_timestamp - previousTopData.current_timestamp;
                var kb_read_diff = data[0].kb_read - previousTopData.kb_read;
                var kb_write_diff = data[0].kb_write - previousTopData.kb_write;
                var kb_sent_diff = data[0].kb_sent - previousTopData.kb_sent;
                var kb_recv_diff = data[0].kb_recv - previousTopData.kb_recv;

                var read_bytes = Math.round(kb_read_diff / diff);

                $scope.topProcess.kb_read_sec = read_bytes;


                var write_bytes = Math.round(kb_write_diff / diff);
                $scope.topProcess.kb_write_sec = write_bytes;

                var kb_sent = Math.round(kb_sent_diff / diff);
                var kb_recv = Math.round(kb_recv_diff / diff);


                var timeVal =  Math.round(new Date(data[0].current_timestamp*1000).getTime());

                if ($scope.cpuData[0].values.length > 60) {
                    $scope.cpuData[0].values.shift();
                    $scope.cpuData[1].values.shift();
                    $scope.diskIO[0].values.shift();
                    $scope.diskIO[1].values.shift();
                    $scope.NetworkIO[0].values.shift();
                    $scope.NetworkIO[1].values.shift();
                }


                //var timeVal = data[0].current_timestamp;
                $scope.cpuData[0].values.push({x: timeVal, y: parseFloat(data[0].cpu_system)});
                $scope.cpuData[1].values.push({x: timeVal, y: parseFloat(data[0].cpu_user)});

                $scope.diskIO[0].values.push({x: timeVal, y: read_bytes});
                $scope.diskIO[1].values.push({x: timeVal, y: write_bytes});

                $scope.NetworkIO[0].values.push({x: timeVal, y: kb_sent});
                $scope.NetworkIO[1].values.push({x: timeVal, y: kb_recv});


            }
            previousTopData = data[0];
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
