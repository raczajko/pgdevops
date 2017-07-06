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
                templateUrl: '../app/components/partials/landingPage.html',
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
    }).state('components.connections', {
        url: '^/connection-details',
        views: {
            "sub": {
                controller: 'connectionDetailsController',
                templateUrl: '../app/components/partials/connectionDetails.html',
            }
        }
    }).state('components.backupRestoreView', {
        url: '/backupRestore',
        views: {
            "sub": {
                controller: 'ComponentsBackupRestoreController',
                templateUrl: '../app/components/partials/backupRestore.html',
            }
        }
    }).state('components.backgroundProcessList', {
        url: '/jobs',
        views: {
            "sub": {
                controller: 'backgroundProcessListController',
                templateUrl: '../app/components/partials/backgroundProcessList.html',
            }
        }
     })
    .state('components.awsIntegration', {
        url: '/awsIntegration',
        views: {
            "sub": {
                controller: 'awsIntegrationController',
                templateUrl: '../app/components/partials/awsIntegration.html',
            }
        }
    });
}).controller('ComponentsController', ['$scope', function ($scope) {

}]);