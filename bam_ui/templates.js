//HEAD 
(function(module) {
try { app = angular.module("templates"); }
catch(err) { app = angular.module("templates", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("../app/components/components.html","<div ui-view=\"sub\"></div>")

$templateCache.put("../app/components/partials/bamUpdate.html","<!-- <div ng-click=\"cancel()\" class=\"close-modal\" data-dismiss=\"modal\" aria-hidden=\"true\">\n" +
    "                <div class=\"lr\">\n" +
    "                    <div class=\"rl\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div> -->\n" +
    "\n" +
    "<div class=\"modal-header\">\n" +
    "    <!-- <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button> -->\n" +
    "    <img src=\"../assets/img/logoBIG.png\" alt=\"\">\n" +
    "    <h4 class=\"modal-title\" id=\"updateModalLabel\">BigSQL Manager update</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "        <p ng-hide=\"bamUpdateIntiated\">WE NEED TO SUSPEND THE GUI MANAGER WHILE WE UPDATE. THIS SHOULD TAKE A FEW MINUTES. <br /> CLICK THE BUTTON BELOW TO START THE PROCESS.</p>\n" +
    "        <div ng-show=\"updatingStatus\" style=\"width:600px; margin:0 auto;\">BigSQL Manager Updating {{currentVersion}} to {{updateVersion}} </div>\n" +
    "        <br />\n" +
    "        <img ng-show=\"updatingStatus\" style=\"width:100px;\" src=\"/assets/loaders/loader.gif\" />\n" +
    "        <button class=\"btn btn-default\" ng-hide=\"bamUpdateIntiated\" ng-click=\"action($event)\">Update BigSQL Manager Version {{currentVersion}} to {{updateVersion}} </button>\n" +
    "        <button class=\"btn btn-default\" ng-show=\"bamUpdatedStatus\" ng-click=\"redirect()\"> BigSQL Manager has been updated, Click to launch</button>\n" +
    "        <button class=\"btn btn-default\" ng-show=\"bamNotUpdatedStatus\" ng-click=\"redirect()\"> BigSQL Manager not updated</button>\n" +
    "    \n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <!-- <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\">Update Now</button> -->\n" +
    "</div>\n" +
    "")

$templateCache.put("../app/components/partials/details.html","<!-- Content Header (Page header) -->\n" +
    "<section class=\"content-header\">\n" +
    "    <h1>\n" +
    "        Component Details\n" +
    "    </h1>\n" +
    "    <uib-alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" dismiss-on-timeout=\"8000\" close=\"closeAlert()\" class=\"uib-text\">{{alert.msg}}</uib-alert>\n" +
    "</section>\n" +
    "\n" +
    "<!-- Main content -->\n" +
    "<section class=\"content\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-4 col-xs-4 col-sm-12\">\n" +
    "            <!-- Profile Image -->\n" +
    "            <div class=\"box box-primary\">\n" +
    "                <div class=\"box-body box-profile\">\n" +
    "                    <img class=\"profile-user-img img-responsive\" id=\"component-logo\" ng-src=\"assets/img/component-logos/{{ component.component }}.png\"  err-src=\"assets/img/component-logos/no_img.png\" alt=\"\">\n" +
    "                    <h3 class=\"profile-username text-center\" ng-bind=\"component.component\" id=\"comp_name\"></h3>\n" +
    "                    <ul class=\"list-group list-group-unbordered\" id=\"comp_details\">\n" +
    "                        <li class=\"list-group-item\" ng-show=\"component.version != '' && component.version != undefined\">\n" +
    "                            <span class=\"pull-left\"><b>Version</b></span> <span class=\"pull-right\" ng-bind=\"component.version\" id=\"comp_version\"></span>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" ng-show=\"component.home_url != '' && component.home_url != undefined || component.doc_url != '' && component.doc_url != undefined\">\n" +
    "                            <span class=\"pull-left\"><a ng-show=\"component.home_url != ''\" href=\"{{component.home_url}}\" target='_blank'> Homepage <i class=\"fa fa-external-link\"></i> </a></span> <span class=\"pull-right\"> <a ng-show=\"component.doc_url != ''\" href=\"{{component.doc_url}}\" target='_blank'> Documentation <i class=\"fa fa-external-link\"></i> </a> </span>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" ng-show=\"component.port != '' && component.port != undefined && component.port != 0 && component.port != 1\">\n" +
    "                            <span class=\"pull-left\"><b>Port</b></span> <span class=\"pull-right\" ng-bind=\"component.port\"></span>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" ng-show=\"component.up_time != '' && component.up_time != undefined\">\n" +
    "                            <span class=\"pull-left\"><b>Uptime</b></span> <span class=\"pull-right\" ng-bind=\"component.up_time\"></span>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" ng-show=\"component.connections != '' && component.connections != undefined\">\n" +
    "                            <span class=\"pull-left\"><b>Connections</b></span>\n" +
    "                            <a class=\"pull-right\" ng-bind=\"component.connections\" id=\"home_url\"></a>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" ng-show=\"component.datadir != '' && component.datadir != undefined\">\n" +
    "                            <span class=\"pull-left\"><b>Data Dir</b></span>\n" +
    "                            <span class=\"pull-right\" ng-bind=\"component.datadir\" id=\"comp_doc\"></span>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" id=\"li-pointer\" ng-show=\"component.logdir != '' && component.logdir != undefined\">\n" +
    "                            <span class=\"pull-left\"><b>Log Dir</b></span>\n" +
    "                            <span href=\"{{component.logdir}}\" class=\"pull-right\" ng-bind=\"component.logdir\" id=\"dt_added\"></span>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" id=\"li-pointer\" ng-show=\"component.data_size != '' && component.data_size != undefined\">\n" +
    "                            <span class=\"pull-left\"><b>Data Size</b></span>\n" +
    "                            <a class=\"pull-right\" ng-bind=\"component.data_size\" id=\"dt_added\"></a>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" id=\"li-pointer\" ng-show=\"component.status != '' && component.status != undefined && component.port != 1\">\n" +
    "                            <span class=\"pull-left\"><b>State</b></span>\n" +
    "                            <span class=\"pull-right\" style=\"margin-top: -4px;\"><i ng-class=\"statusColors[component.status]\" class=\"fa fa-stop fa-2x\"></i>\n" +
    "                                <div style=\"margin-left: 30px; margin-top: -24px;\"> {{component.status}}</div>\n" +
    "                            </span>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                    <div id=\"button-act\" ng-click=\"action($event)\">\n" +
    "                        <a ng-show=\"component.status == undefined && component.is_installed == 0\" action=\"install\" class=\"btn btn-default\" ng-disabled=\" component.installation != undefined\">Install</a>\n" +
    "                        <a ng-show=\"component.status == 'Stopped' && component.port != 1\" action=\"start\" class=\"btn btn-default\" ng-disabled=\" component.spinner != undefined\">Start</a>\n" +
    "                        <a ng-show=\"(component.status == 'Stopped' && component.is_installed) || (component.is_installed == 1 && component.status == undefined)\" action=\"remove\" class=\"btn btn-default\" ng-disabled=\" component.spinner != undefined\">Remove</a>\n" +
    "                        <div ng-show=\"component.status == 'NotInitialized'\">\n" +
    "                            <a class=\"btn btn-danger\" action=\"init\" ng-disabled=\" component.spinner != undefined\">Initialize</a>\n" +
    "                            <a class=\"btn btn-warning\" action=\"remove\" ng-disabled=\" component.spinner != undefined\">Remove</a>\n" +
    "                        </div>\n" +
    "                        <div ng-show=\"component.status == 'Running'\">\n" +
    "                            <a class=\"btn btn-default\" action=\"stop\" ng-disabled=\" component.spinner != undefined\">Stop</a>\n" +
    "                            <a class=\"btn btn-default\" action=\"restart\" ng-disabled=\" component.spinner != undefined\">Restart</a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div id=\"dep_stats\">\n" +
    "                        <div ng-show=\"component.installation != undefined || component.spinner \" style=\"width:100%;height:auto\">\n" +
    "                            <div>\n" +
    "                                <span ng-show=\"component.spinner\"><i class='fa fa-spinner fa-2x  fa-pulse'></i> <b>{{component.spinner}}</b></span>\n" +
    "                                <div style=\"margin-left:10px;margin-top:20px\" ng-show=\"component.installationDependents != undefined\"><i class=\"fa fa-refresh fa-spin\" style='margin-right:2px'></i><b> Installing dependencies...</b></div>\n" +
    "                                <br />\n" +
    "                                <div style=\"margin-left:10px;margin-top:-10px\" ng-show=\"component.installationStart.status =='start' && component.installationStart.state == 'unpack'\"><i class=\"fa fa-circle-o-notch fa-spin\" style='margin-right:2px'></i><b> Unpacking </b></div>\n" +
    "                                <div style=\"margin-left:10px;margin-top:20px\" ng-show=\"component.installationStart.status =='start' && component.installationStart.state == 'download'\"><i class=\"fa fa-circle-o-notch fa-spin\" style='margin-right:2px'></i><b> Downloading </b></div>\n" +
    "                                </br>\n" +
    "                                <div ng-show=\"component.installationRunning != undefined\" class=\"col-md-4 col-xs-4\">\n" +
    "                                    file:<br \\>{{component.installationStart.file}}\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-4 col-xs-4\" ng-show=\"component.installationRunning != undefined\">\n" +
    "                                    <progressbar value=\"component.progress\"></progressbar>\n" +
    "                                    <button class=\"btn btn-default btn-xs center-block\" ng-click=\"cancelInstallation('cancelInstall') \">Cancel</button>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2 col-xs-2\" ng-show=\"component.installationRunning != undefined\">\n" +
    "                                    {{component.installationRunning.pct}}%\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2 col-xs-2\" ng-show=\"component.installationRunning != undefined\">\n" +
    "                                    {{component.installationRunning.mb}}\n" +
    "                                </div>\n" +
    "                                \n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div id=\"stats\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- /.box-body -->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "</section>")

$templateCache.put("../app/components/partials/detailspg95.html","<!-- Content Header (Page header) -->\n" +
    "<section class=\"content-header\">\n" +
    "    <h1>\n" +
    "        Component Details\n" +
    "    </h1>\n" +
    "    \n" +
    "</section>\n" +
    "<uib-alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" dismiss-on-timeout=\"8000\" close=\"closeAlert()\" class=\"uib-text\">{{alert.msg}}</uib-alert>\n" +
    "<!-- Main content -->\n" +
    "<section class=\"content\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-3 col-sm-4 col-xs-12\">\n" +
    "            <!-- Profile Image -->\n" +
    "            <div class=\"box box-primary\">\n" +
    "                <div class=\"box-body box-profile\">\n" +
    "                    <div class=\"comp-det-top\">\n" +
    "                        <div class=\"col-md-4\"><img class=\"img-responsive comp-logo-img\" id=\"component-logo\" ng-src=\"assets/img/component-logos/{{ component.component }}.png\" err-src=\"assets/img/component-logos/no_img.png\" alt=\"\">\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3\">\n" +
    "                            <h3 class=\"comp-name\" ng-bind=\"component.component\" id=\"comp_name\"></h3>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-5 version-wrapper\">v.\n" +
    "                            <span class=\"\" ng-bind=\"component.version\" id=\"comp_version\"></span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <span class=\"clearfix\"></span>\n" +
    "                    <ul class=\"list-group list-group-unbordered\" id=\"comp_details\">\n" +
    "                        <li class=\"list-group-item\" ng-show=\"component.up_time\">\n" +
    "                            <span class=\"pull-left\"><b>Uptime</b></span> <span class=\"pull-right\" ng-bind=\"component.up_time\" id=\"comp_version\"></span>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" ng-show=\"component.datadir || component.logdir\">\n" +
    "                            <span class=\"pull-left\"><span style=\"cursor: pointer;\" tooltip-append-to-body=\"true\" uib-tooltip=\"{{ component.datadir }}\" ng-show=\"component.datadir != ''\" tooltip-class=\"logDataDirHover\"> Data Dir <i class=\"fa fa-archive\"></i> </span></span>\n" +
    "                            <span class=\"pull-right\"> <a tooltip-append-to-body=\"true\" uib-tooltip=\"{{ component.logdir }}\" ng-show=\"component.logdir != ''\" ui-sref=\"components.componentLog({component:component.component})\" ng-click=\"logdir(component.logdir) ; logdirSelect()\" tooltip-class=\"logDataDirHover\"> Log Dir <i class=\"fa fa-list-alt\"></i> </a> </span>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" id=\"li-pointer\" ng-show=\"component.data_size\">\n" +
    "                            <span class=\"pull-left\"><b>Data Size</b></span> \n" +
    "                            <span class=\"pull-right\" ng-bind=\"component.data_size\" id=\"dt_added\"></span>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" id=\"li-pointer\" ng-show=\"component.is_installed == 1 \">\n" +
    "                            <span class=\"pull-left\"><b>Auto Start</b></span> \n" +
    "                            <span class=\"pull-right\">\n" +
    "                                <input type=\"checkbox\" ng-model=\"component.autostart\" ng-change=\"autostartChange(component.autostart)\">\n" +
    "                            </span>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" id=\"li-pointer\" ng-show=\"component.is_installed == 1 \">\n" +
    "                            <span class=\"pull-left\"><b>Refresh Interval </b>(sec)</span>\n" +
    "                            <span class=\"pull-right\"><select class=\"form-control\" id=\"select-refresh-interval\" ng-change=\"changeOption()\" ng-model=\"opt.interval\">\n" +
    "                            <option ng-repeat=\"option in optionList\" value=\"{{option.value}}\">{{option.label}}</option></select>\n" +
    "                            </span>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                    <div ng-show=\"component.status === 'Running'\" class=\"comp-status-wrap text-center\">\n" +
    "                        <i ng-class=\"statusColors[component.status]\" class=\"fa fa-stop fa-4x\"></i>\n" +
    "                        <h4>{{component.status}} <br /><small><span ng-show=\"component.status === 'Running'\">on port {{component.port}} </span></small></h4>\n" +
    "                    </div>\n" +
    "                    <div ng-show=\"component.status === 'Stopped'\" class=\"comp-status-wrap comp-stop-status-wrap text-center\">\n" +
    "                        <i ng-class=\"statusColors[component.status]\" class=\"fa fa-stop fa-4x\"></i>\n" +
    "                        <h4>{{component.status}}</h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"clearfix\"></div>\n" +
    "                    <div id=\"button-act\" ng-click=\"action($event)\">\n" +
    "                        <a ng-show=\"component.status == undefined\" action=\"install\" class=\"btn btn-default\" ng-disabled=\" component.installation != undefined\">Install</a>\n" +
    "                        <a ng-show=\"component.status == 'Stopped'\" action=\"start\" class=\"btn btn-success\" ng-disabled=\" component.spinner != undefined\">Start</a>\n" +
    "                        <a ng-show=\"component.status == 'Stopped'\" action=\"remove\" class=\"btn btn-warning\" ng-disabled=\" component.spinner != undefined\">Remove</a>\n" +
    "                        <div ng-show=\"component.status == 'NotInitialized'\">\n" +
    "                            <a class=\"btn btn-danger\" action=\"init\" ng-disabled=\" component.spinner != undefined\">Initialize</a>\n" +
    "                            <a class=\"btn btn-warning\" action=\"remove\" ng-disabled=\" component.spinner != undefined\">Remove</a>\n" +
    "                        </div>\n" +
    "                        <div ng-show=\"component.status == 'Running'\">\n" +
    "                            <a class=\"btn btn-danger\" action=\"stop\" ng-disabled=\" component.spinner != undefined\">Stop</a>\n" +
    "                            <a class=\"btn btn-warning\" action=\"restart\" ng-disabled=\" component.spinner != undefined\">Restart</a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <br />\n" +
    "                    <div id=\"dep_stats\">\n" +
    "                        <div ng-show=\"component.installation != undefined || component.spinner\" style=\"width:100%;height:auto\">\n" +
    "                            <div>\n" +
    "                                <span ng-show=\"component.spinner\"><i class='fa fa-spinner fa-2x  fa-pulse'></i> <b>{{component.spinner}}</b></span>\n" +
    "                                <div style=\"margin-left:10px;margin-top:20px\" ng-show=\"component.installationDependents != undefined\"><i class=\"fa fa-refresh fa-spin\" style='margin-right:2px'></i><b> Installing dependencies...</b></div>\n" +
    "                                <br />\n" +
    "                                <div style=\"margin-left:10px;margin-top:-10px\" ng-show=\"component.installationStart.status =='start' && component.installationStart.state == 'unpack'\"><i class=\"fa fa-circle-o-notch fa-spin\" style='margin-right:2px'></i><b> Unpacking </b></div>\n" +
    "                                <div style=\"margin-left:10px;margin-top:20px\" ng-show=\"component.installationStart.status =='start' && component.installationStart.state == 'download'\"><i class=\"fa fa-circle-o-notch fa-spin\" style='margin-right:2px'></i><b> Downloading </b></div>\n" +
    "                                </br>\n" +
    "                                <div ng-show=\"component.installationRunning != undefined\" class=\"col-md-4 col-xs-4\">\n" +
    "                                    file:<br \\>{{component.installationStart.file}}\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-4 col-xs-4\" ng-show=\"component.installationRunning != undefined\">\n" +
    "                                    <progressbar value=\"component.progress\"></progressbar>\n" +
    "                                    <button class=\"btn btn-default btn-xs center-block\" ng-click=\"cancelInstallation('cancelInstall') \">Cancel</button>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2 col-xs-2\" ng-show=\"component.installationRunning != undefined\">\n" +
    "                                    {{component.installationRunning.pct}}%\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-2 col-xs-2\" ng-show=\"component.installationRunning != undefined\">\n" +
    "                                    {{component.installationRunning.mb}}\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div id=\"stats\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- /.box-body -->\n" +
    "            </div>\n" +
    "            <!-- /.box -->\n" +
    "            <div ng-show=\"component.category == 1\" class=\"box box-primary\">\n" +
    "                <div class=\"box-header with-border\">\n" +
    "                    <h3 class=\"box-title\">Project Details</h3>\n" +
    "                    <div class=\"box-tools pull-right\">\n" +
    "                        <button type=\"button\" ng-click=\"isCollapsed2 = !isCollapsed2\" class=\"btn btn-box-tool\">\n" +
    "                        <div ng-if=\"isCollapsed2\">\n" +
    "                        <i class=\"fa fa-plus\"></i>\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"!isCollapsed2\">\n" +
    "                        <i class=\"fa fa-minus\"></i>\n" +
    "                        </div>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"box-body box-profile\" uib-collapse=\"isCollapsed2\" id=\"collapseClusterDetails\">\n" +
    "                    <ul class=\"list-group list-group-unbordered\">\n" +
    "                        <li class=\"list-group-item\" ng-show=\"component.svcname\">\n" +
    "                            <span class=\"pull-left\"><b>Description</b></span> <span class=\"pull-right\" ng-bind=\"component.svcname\" id=\"home_url\"></span>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" ng-show=\"component.home_url != '' && component.home_url != undefined || component.doc_url != '' && component.doc_url != undefined\">\n" +
    "                            <span class=\"pull-left\"><a ng-show=\"component.home_url != ''\" href=\"{{component.home_url}}\" target='_blank'> Homepage <i class=\"fa fa-external-link\"></i> </a></span> <span class=\"pull-right\"> <a ng-show=\"component.doc_url != ''\" href=\"{{component.doc_url}}\" target='_blank'> Documentation <i class=\"fa fa-external-link\"></i> </a> </span>\n" +
    "                        </li>\n" +
    "                        <li class=\"list-group-item\" id=\"li-pointer\" ng-show=\"component.release_date\">\n" +
    "                            <span class=\"pull-left\"><b>Release</b></span> <span class=\"pull-right\" ng-bind=\"component.release_date\" id=\"dt_added\">20160114</span>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"component.category == 1\" class=\"col-md-9 col-sm-8 col-xs-12\">\n" +
    "\n" +
    "       \n" +
    "            <div class=\"nav-tabs-custom\" id=\"comp-details-tabs-wrapper\" ng-controller=\"graphsTabController\">\n" +
    "                <uib-tabset>\n" +
    "                    <uib-tab heading=\"Overview\" select=\"tabClick($event)\">\n" +
    "                        <div class=\"row tab-content graphsTab\" style=\"padding: 15px;\">\n" +
    "                        <div class=\"row\"> \n" +
    "                        <div class=\"col-md-12 col-xs-12\">\n" +
    "                            <div class=\"box\" ng-if=\"showGraphs\">\n" +
    "                                <uib-accordion>\n" +
    "                                    <uib-accordion-group is-open=\"uibStatus.tpsChartCollapsed\" is-disabled=\"component.status != 'Running'\">\n" +
    "                                      <uib-accordion-heading>\n" +
    "                                        <span ng-click=\"tabClick()\">Transactions per Second\n" +
    "                                            <i class=\"pull-right glyphicon\" \n" +
    "                                ng-class=\"{'fa fa-plus': !uibStatus.tpsChartCollapsed, 'fa fa-minus': uibStatus.tpsChartCollapsed}\"></i>\n" +
    "                                        </span>\n" +
    "                                      </uib-accordion-heading>\n" +
    "                                        <div>\n" +
    "                                            <nvd3 options=\"transctionsPerSecondChart\" data=\"commitRollbackData\"></nvd3>\n" +
    "                                        </div>\n" +
    "                                    </uib-accordion-group>    \n" +
    "                                 </uib-accordion>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                        <div class=\"col-md-12 col-xs-12\">\n" +
    "                            <div class=\"box\" ng-if=\"showGraphs\">\n" +
    "                                <uib-accordion>\n" +
    "                                    <uib-accordion-group is-open=\"uibStatus.rpsChartCollapsed\" is-disabled=\"component.status != 'Running'\">\n" +
    "                                      <uib-accordion-heading>\n" +
    "                                        <span ng-click=\"tabClick()\">Rows per Second\n" +
    "                                        <i class=\"pull-right glyphicon\" \n" +
    "                                ng-class=\"{'fa fa-plus': !uibStatus.rpsChartCollapsed, 'fa fa-minus': uibStatus.rpsChartCollapsed}\"></i> \n" +
    "                                        </span> \n" +
    "                                      </uib-accordion-heading>\n" +
    "                                        <div>\n" +
    "                                            <nvd3 options=\"rowsChart\" data=\"rowsData\"></nvd3>\n" +
    "                                        </div>\n" +
    "                                    </uib-accordion-group>    \n" +
    "                                 </uib-accordion>\n" +
    "                            </div>\n" +
    "                        </div>  \n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                        <div class=\"col-md-12 col-xs-12\">\n" +
    "                            <div class=\"box\" ng-if=\"showGraphs\">\n" +
    "                                <uib-accordion>\n" +
    "                                    <uib-accordion-group is-open=\"uibStatus.connectionsCollapsed\" is-disabled=\"component.status != 'Running'\">\n" +
    "                                      <uib-accordion-heading>\n" +
    "                                        <span ng-click=\"tabClick()\">Connections\n" +
    "                                        <i class=\"pull-right glyphicon\" \n" +
    "                                ng-class=\"{'fa fa-plus': !uibStatus.connectionsCollapsed, 'fa fa-minus': uibStatus.connectionsCollapsed}\"></i>\n" +
    "                                        </span> \n" +
    "                                      </uib-accordion-heading>\n" +
    "                                        <div>\n" +
    "                                            <nvd3 options=\"connectionsChart\" data=\"connectionsData\"></nvd3>\n" +
    "                                        </div>\n" +
    "                                    </uib-accordion-group>    \n" +
    "                                 </uib-accordion>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                        <div class=\"col-md-12 col-xs-12\">\n" +
    "                            <div class=\"box\" ng-if=\"showGraphs\">\n" +
    "                                <uib-accordion>\n" +
    "                                    <uib-accordion-group is-open=\"uibStatus.cpuChartCollapsed\">\n" +
    "                                      <uib-accordion-heading>\n" +
    "                                        <span ng-click=\"tabClick()\">Server CPU Load\n" +
    "                                        <i class=\"pull-right glyphicon\" \n" +
    "                                ng-class=\"{'fa fa-plus': !uibStatus.cpuChartCollapsed, 'fa fa-minus': uibStatus.cpuChartCollapsed}\"></i>\n" +
    "                                        </span>\n" +
    "                                      </uib-accordion-heading>\n" +
    "                                        <div>\n" +
    "                                            <nvd3 options=\"cpuChart\" data=\"cpuData\"></nvd3>\n" +
    "                                        </div>\n" +
    "                                    </uib-accordion-group>    \n" +
    "                                 </uib-accordion>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                        <div class=\"col-md-12 col-xs-12\">\n" +
    "                            <div class=\"box\" ng-if=\"showGraphs\">\n" +
    "                                <uib-accordion>\n" +
    "                                    <uib-accordion-group is-open=\"uibStatus.diskChartCollapsed\">\n" +
    "                                      <uib-accordion-heading>\n" +
    "                                        <span ng-click=\"tabClick()\">Server Disk I/O \n" +
    "                                        <i class=\"pull-right glyphicon\" \n" +
    "                                ng-class=\"{'fa fa-plus': !uibStatus.diskChartCollapsed, 'fa fa-minus': uibStatus.diskChartCollapsed}\"></i>\n" +
    "                                        </span> \n" +
    "                                      </uib-accordion-heading>\n" +
    "                                        <div>\n" +
    "                                            <nvd3 options=\"diskIOChart\" data=\"diskIOData\"></nvd3>\n" +
    "                                        </div>\n" +
    "                                    </uib-accordion-group>    \n" +
    "                                 </uib-accordion>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-12 col-xs-12\" style=\"height: 100%; text-align: center;\" ng-if=\"!showGraphs\">\n" +
    "                            <p style=\"margin: 50px 0\">\n" +
    "                                <i class=\"fa fa-spinner fa-pulse fa-3x fa-fw\"></i>\n" +
    "                                <span class=\"sr-only\">Loading...</span>\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab heading=\"Activity\" disable=\"component.status != 'Running'\">\n" +
    "                        <div class=\"row tab-content\" style=\"padding: 10px;\">\n" +
    "                            <div class=\"col-md-12 col-sm-12 col-xs-12\">\n" +
    "                                <div class=\"box\" id=\"activityTab\">\n" +
    "                                    <div class=\"box-header\">\n" +
    "                                        <h3 class=\"box-title\">PG_STAT_ACTIVITY</h3>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"box-body table-responsive no-padding\">\n" +
    "                                        <table class=\"table table-hover\">\n" +
    "                                            <thead>\n" +
    "                                                <tr>\n" +
    "                                                    <th class=\"col-md-1 col-xs-1\"><b>PID</b></th>\n" +
    "                                                    <th class=\"col-md-5 col-xs-5\"><b>Query</b></th>\n" +
    "                                                    <th class=\"col-md-2 col-xs-2\"><b>Query Time</b></th>\n" +
    "                                                    <th class=\"col-md-2 col-xs-2\"><b>DB</b></th>\n" +
    "                                                    <th class=\"col-md-1 col-xs-1\"><b>User</b></th>\n" +
    "                                                    <th class=\"col-md-1 col-xs-1\"><b>Cl. Addr.</b></th>\n" +
    "                                                    \n" +
    "                                                    \n" +
    "                                                </tr>\n" +
    "                                            </thead>\n" +
    "                                            <tbody ng-show=\"noActivities == false\">\n" +
    "                                                <tr ng-repeat=\" activity in activities\">\n" +
    "                                                    <!-- <div class=\"row component_box\"> -->\n" +
    "                                                    <td>{{activity.pid}}</td>\n" +
    "                                                    <td>{{activity.query}}</td>\n" +
    "                                                    <td>{{activity.query_time}}</td>\n" +
    "                                                    <td>{{activity.datname}}</td>\n" +
    "                                                    <td>{{activity.usename}}</td>\n" +
    "                                                    <td>{{activity.client_addr}}</td>\n" +
    "                                                    \n" +
    "                                                    \n" +
    "                                                    <!-- </div> -->\n" +
    "                                                </tr>\n" +
    "                                            </tbody>\n" +
    "                                            <tbody ng-show=\"noActivities == true\">\n" +
    "                                                <tr>\n" +
    "                                                    <td colspan=\"6\">\n" +
    "                                                        <p class=\"lead\">No Database Activity.</p>\n" +
    "                                                    </td>\n" +
    "                                                </tr>\n" +
    "                                            </tbody>\n" +
    "                                        </table>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab heading=\"Configure\" ng-click=\"configureTabEvent()\" disable=\"component.status != 'Running'\">\n" +
    "                        <div ng-if=\"gridSettings\">\n" +
    "                            <div class=\"gridStyle\" ui-grid-expandable  ui-grid=\"gridSettings\" class=\"col-md-12 col-sm-12 col-xs-12\"></div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab heading=\"Databases\" ng-click=\"dataBaseTabEvent()\" disable=\"component.status != 'Running'\">\n" +
    "                        <div ng-if=\"gridOptions\">\n" +
    "                            <div class=\"gridStyle\" ui-grid=\"gridOptions\" class=\"col-md-12 col-sm-12 col-xs-12\"></div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab heading=\"Security\" ng-click=\"securityTabEvent()\" disable=\"component.status != 'Running'\">\n" +
    "                    <div class=\"gridStyle\">\n" +
    "                        <div class=\"box box-primary\">\n" +
    "                            <!-- <div class=\"box-header with-border\">\n" +
    "                                <h3 class=\"box-title\"> PG hba Configuration </h3> \n" +
    "                            </div> -->\n" +
    "                            <div class=\"box-body\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div class=\"col-md-12 col-xs-12\">\n" +
    "                                        <span class=\"pull-left\"><a href=\"https://www.bigsql.org/docs/security/index.jsp\" target='_blank'> Documentation <i class=\"fa fa-external-link\"></i></a></span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div class=\"col-md-12 col-xs-12\">\n" +
    "                                        <span class=\"securityTabStyle\">\n" +
    "                                            {{securityTabContent}}\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    </uib-tab>\n" +
    "                </uib-tabset>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>\n" +
    "")

$templateCache.put("../app/components/partials/loading.html","<section class=\"content\">\n" +
    "    <div ng-if=\"bamLoading\" style=\"position: absolute;width: 100px; height: 50px; top: 50%;left: 50%; margin-left: -50px; margin-top: -25px;\">\n" +
    "        <i class=\"fa fa-cog fa-spin fa-5x fa-fw margin-bottom\"></i>\n" +
    "        <span><h3>Loading...</h3></span>\n" +
    "    </div>\n" +
    "</section>")

$templateCache.put("../app/components/partials/log.html","<section class=\"content-header\">\n" +
    "    <h1>\n" +
    "        Log Tailer\n" +
    "     </h1>\n" +
    "</section>\n" +
    "<section class=\"content\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12 col-sm-12 col-xs-12\">\n" +
    "            <div class=\"box\">\n" +
    "                <div class=\"box-body\">\n" +
    "                    <form id=\"log-tail-filters\" class=\"form-horizontal\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <div class=\"col-sm-4\">\n" +
    "                            <label class=\"comp-select\" for=\"select-component-log\">Component:</label>\n" +
    "                            <div class=\"col-sm-8\">\n" +
    "                            <select class=\"form-control\" id=\"logComponents\" ng-change=\"onLogCompChange()\" ng-model=\"selectComp\">\n" +
    "                                 <option value=\"#/log/pgcli\">pgcli</option>\n" +
    "                                 <option value=\"#/log/{{c.component}}\" ng-repeat=\"c in components\">{{c.component}}</option>\n" +
    "                            </select>\n" +
    "                            </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-sm-6\">\n" +
    "                            <div id=\"log-lines\">\n" +
    "                            <p class=\"log-lines-label\"><strong>Log Lines: </strong></p>\n" +
    "                            <ul class=\"nav nav-pills\">\n" +
    "                                <li ng-class=\"{active:isSet(100)}\">\n" +
    "                                    <a href ng-click=\"setTab(100) ; action(100)\">{{ 100 | number:0 }}</a>\n" +
    "                                </li>\n" +
    "                                <li ng-class=\"{active:isSet(1000)}\">\n" +
    "                                    <a href ng-click=\"setTab(1000); action(1000)\">{{ 1000 | number:0 }}</a>\n" +
    "                                </li>\n" +
    "                                <li ng-class=\"{active:isSet(10000)}\">\n" +
    "                                    <a href ng-click=\"setTab(10000); action(10000)\">{{ 10000 | number:0 }}</a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-sm-2\">\n" +
    "                            <input type=\"checkbox\" value=\"checked\" ng-model=\"checked\" ng-checked=\"true\" ng-click=\"stopScrolling($event)\"> Auto Scroll</input>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <strong> Log File :</strong>&nbsp;&nbsp;<span>{{selectedLog}}</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "                    \n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"box\">\n" +
    "                <div class=\"box-body\" style=\"overflow: auto;\">\n" +
    "                    <div style=\"background-color: #fff; height: 400px; overflow: auto;\" id=\"logviewer\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- /.box-body -->\n" +
    "            </div>\n" +
    "            <!-- /.box -->\n" +
    "            <!-- /.box -->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>\n" +
    "")

$templateCache.put("../app/components/partials/settings.html","<script type=\"text/ng-template\" id=\"alert.html\">\n" +
    "    <div class=\"alert\" style=\"background-color:#fa39c3;color:white;\" role=\"alert\">\n" +
    "        <div ng-transclude></div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "<uib-alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" dismiss-on-timeout=\"8000\" close=\"closeAlert($index)\" class=\"uib-text\">{{alert.msg}}</uib-alert>\n" +
    "<section class=\"content-header\">\n" +
    "    <h1>\n" +
    "        Settings\n" +
    "     </h1>\n" +
    "    <div id=\"pgcInfoText\" class=\"pull-left\"></div>\n" +
    "</section>\n" +
    "<section class=\"content\">\n" +
    "    <div class=\"box\">\n" +
    "        <div class=\"box-header with-border\">\n" +
    "            <h4>Check for updates</h4>\n" +
    "        </div>\n" +
    "        <div class=\"box-body\">\n" +
    "            <form class=\"form-horizontal\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-sm-10\">\n" +
    "                        <div class=\"radio\">\n" +
    "                            <label>\n" +
    "                                <input type=\"radio\" ng-checked=\"settingType == 'manual'\" ng-model=\"settingType\" value=\"manual\" ng-change=\"updateManualSettings()\" /> Manually\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-sm-10\">\n" +
    "                        <div class=\"radio\">\n" +
    "                            <label>\n" +
    "                                <input type=\"radio\" ng-checked=\"settingType == 'auto'\" ng-model=\"settingType\" ng-change=\"onAutomaticOptionSelection()\"  value=\"auto\" /> Automatically\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-sm-6\">\n" +
    "                        <label for=\"inputPassword3\" class=\"col-sm-4 control-label\">Check for Updates</label>\n" +
    "                        <div class=\"col-sm-4\">\n" +
    "                            <select class=\"form-control\" name=\"singleSelect\" id=\"automaticSettings\" ng-change=\"onAutomaticOptionSelection()\" ng-model=\"automaticSettings\" ng-init=\"automaticSettings = settingsOptions[0]\"  ng-disabled=\"settingType=='manual' || settingType==undefined && settingType != 'auto'\" disabled=\"disable\" ng-options=\"option.name for option in settingsOptions\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "\n" +
    "                    <div class=\"col-sm-6 col-md-8 col-xs-8\">\n" +
    "                    <p class=\"col-md-9 col-xs-9\" style=\"margin-top: 8px\" ng-show=\"lastUpdateStatus\">The last time you checked for updates was at {{lastUpdateStatus}}</p>\n" +
    "                        <button type=\"button\" class=\"btn btn-default\" id=\"checkNow\" ng-click=\"open('manual')\">Check now</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"box\">\n" +
    "        <div class=\"box-header with-border\">\n" +
    "            <h4>PGC Server Info</h4></div>\n" +
    "        <div class=\"box-body\">\n" +
    "            <div class=\"col-sm-12\">\n" +
    "                <table class=\"table table-condensed settings-table-pgc-info\">\n" +
    "                    <thead>\n" +
    "                        <tr>\n" +
    "                            <td class=\"col-md-1 col-xs-1\"></td>\n" +
    "                            <td class=\"col-md-11 col-xs-11\"></td>\n" +
    "                        </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <h5>PGC:</h5></td>\n" +
    "                            <td>\n" +
    "                                <p>{{pgcInfo.version}}</p>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <h5>User &amp; Host:</h5></td>\n" +
    "                            <td>\n" +
    "                                <p>{{pgcInfo.user}} &nbsp; {{pgcInfo.host}} </p>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <h5>OS:</h5></td>\n" +
    "                            <td>\n" +
    "                                <p>{{pgcInfo.os}}</p>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <h5>Hardware:</h5></td>\n" +
    "                            <td>\n" +
    "                                <p>{{pgcInfo.mem}} GB, {{pgcInfo.cpu}}</p>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <h5>Repo URL:</h5></td>\n" +
    "                            <td>\n" +
    "                                <p>{{pgcInfo.repo}}</p>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>\n" +
    "")

$templateCache.put("../app/components/partials/status.html","<section class=\"content-header\">\n" +
    "    <h1>\n" +
    "        Server Status\n" +
    "    </h1>\n" +
    "    <div></div>\n" +
    "    <div id=\"pgcInfoText\" class=\"pull-left\"><span><b>OS:&nbsp;&nbsp;</b>{{pgcInfo.os}}&nbsp;&nbsp;</span><span><b>Cores:&nbsp;&nbsp;</b></span>{{pgcInfo.cores}}&nbsp;&nbsp;<span><b>CPU:&nbsp;</b></span>{{pgcInfo.cpu}}&nbsp;&nbsp;<span><b>Memory:&nbsp;</b></span>{{pgcInfo.mem}} GB</div>\n" +
    "</section>\n" +
    "<uib-alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" dismiss-on-timeout=\"8000\" close=\"closeAlert()\" class=\"uib-text\">{{alert.msg}}</uib-alert>\n" +
    "<div id=\"pgcInfoText\" class=\"pull-left\"></div>\n" +
    "<span class=\"clearfix\"></span>\n" +
    "<section class=\"content\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-6 col-sm-12 col-xs-12\">\n" +
    "            <div ng-if=\"showMsg\" class=\"jumbotron\" style=\"background-color: #fff; margin-top: 15px; text-align: center;\"> \n" +
    "                <h4> No PostgreSQL or server components installed.<br \\> Visit the <a ui-sref=\"components.view\">Update Manager</a> to install components.</h4>\n" +
    "            </div>\n" +
    "            <div class=\"box\" ng-if='showMsg == false'>\n" +
    "                <div class=\"box-header with-border\">\n" +
    "                    <h3 class=\"box-title\">Services</h3>\n" +
    "                </div>\n" +
    "                <!-- /.box-header -->\n" +
    "                <div class=\"box-body\">\n" +
    "                    <table class=\"table\" id=\"serversTable\">\n" +
    "                        <thead>\n" +
    "                            <tr>\n" +
    "                                <th class=\"col-md-3 col-xs-3\">Component</th>\n" +
    "                                <th class=\"col-md-5 col-xs-5\">Status</th>\n" +
    "                                <th class=\"col-md-1 col-xs-1\"></th>\n" +
    "                                <th class=\"col-md-3 col-xs-3\">Actions</th>\n" +
    "                            </tr>\n" +
    "                        </thead>\n" +
    "                        <tbody id=\"serversTableBody\">\n" +
    "                            <tr ng-repeat=\"comp in comps\" ng-if=\"comp.component != 'bam2'\">\n" +
    "                                <td class=\"col-md-3 col-xs-3\">\n" +
    "                                    <div ng-if=\"comp.category != 1\">\n" +
    "                                         <a ui-sref=\"components.detailsView({component:comp.component}) \">\n" +
    "                                                {{comp.component}}\n" +
    "                                            </a>\n" +
    "                                    </div>\n" +
    "                                    <div ng-if=\"comp.category == 1\">\n" +
    "                                         <a ui-sref=\"components.detailspg95({component:comp.component}) \">\n" +
    "                                                {{comp.component}}\n" +
    "                                            </a>\n" +
    "                                    </div>\n" +
    "                                </td>\n" +
    "                                <td class=\"col-md-5 col-xs-5\"><i ng-class=\"statusColors[comp.state]\" style=\"margin-top:2px;margin-right:10px\" class=\"fa fa-stop fa-2x pull-left\"></i>\n" +
    "                                    <div style=\"margin-top: 5px\" ng-show=\"comp.port\">{{comp.state}} on port {{comp.port}}</div>\n" +
    "                                    <div style=\"margin-top: 5px\" ng-show=\"!comp.port\">{{comp.state}}</div>\n" +
    "                                </td>\n" +
    "                                <td class=\"col-md-1 col-xs-1\">\n" +
    "                                    <span ng-show=\"comp.showingSpinner\"><i class='fa fa-spinner fa-2x  fa-pulse'></i></span>\n" +
    "                                </td>\n" +
    "                                <td class=\"col-md-3 col-xs-3\" value=\"{{comp.component}}\" ng-click=\"action($event)\">\n" +
    "                                    <a class=\"btn btn-default\" ng-show=\"comp.state =='Not Initialized' \" ng-disabled=\" comp.showingSpinner != undefined\">Initialize</a>\n" +
    "                                    <a class=\"btn btn-default\" id=\"install\" ng-show=\"comp.state =='Stopped'\" ng-disabled=\" comp.showingSpinner != undefined\">Start</a>\n" +
    "                                    <div class=\"btn-group\" uib-dropdown ng-show=\"comp.state =='Running'\" >\n" +
    "                                        <button id=\"split-button\" type=\"button\" class=\"btn btn-default\" ng-disabled=\"{{comp.component=='bam2'}}\">Action</button>\n" +
    "                                        <button type=\"button\" class=\"btn btn-default\" uib-dropdown-toggle ng-disabled=\"{{comp.component=='bam2'}}\">\n" +
    "                                            <span class=\"caret\"></span>\n" +
    "                                            <span class=\"sr-only\">Split button!</span>\n" +
    "                                        </button>\n" +
    "                                        <ul uib-dropdown-menu role=\"menu\" aria-labelledby=\"split-button\">\n" +
    "                                            <li role=\"menuitem\"><a>Stop</a></li>\n" +
    "                                            <li role=\"menuitem\"><a>Restart</a></li>\n" +
    "                                        </ul>\n" +
    "                                    </div>\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                        </tbody>\n" +
    "                    </table>\n" +
    "                </div>\n" +
    "                <!-- /.box-body -->\n" +
    "            </div>\n" +
    "            <!-- /.box -->\n" +
    "            <!-- /.box -->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12 col-sm-12 col-xs-12\">\n" +
    "            <div class=\"box\">\n" +
    "            <div class=\"box-header with-border\">\n" +
    "                    <h3 class=\"box-title\">CPU Load</h3>\n" +
    "                </div>\n" +
    "            <nvd3 options=\"cpuChart\" data=\"cpuData\"></nvd3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12 col-sm-12 col-xs-12\">\n" +
    "            <div class=\"box\">\n" +
    "            <div class=\"box-header with-border\">\n" +
    "                    <h3 class=\"box-title\">Disk IO</h3>\n" +
    "                </div>\n" +
    "            <nvd3 options=\"ioChart\" data=\"diskIO\"></nvd3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>")

$templateCache.put("../app/components/partials/updateModal.html","<div class=\"modal-header\">\n" +
    "    <h2 class=\"modal-title\" id=\"updateModalLabel\">Updates</h2>\n" +
    "</div>\n" +
    "<div class=\"container-fluid\" ng-show=\"loadingSpinner\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12 col-xs-12\">\n" +
    "            <div class=\"well\">\n" +
    "                <i class=\"fa fa-spinner fa-2x  fa-pulse\"></i>&#160;&#160;&#160;Checking for updates..\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-body\" ng-show=\"body\">\n" +
    "    <p ng-hide=\"noUpdates\">Select the components you want to update. (Or All)</p>\n" +
    "    <div class=\"container-fluid\">\n" +
    "        <!-- /.box-header -->\n" +
    "        <div class=\"row\" id=\"updatesTable\" ng-hide=\"noUpdates\">\n" +
    "            <div style=\"border-bottom: 2px solid #f4f4f4;width: 100%;height: 30px;vertical-align: middle;\">\n" +
    "                <div class=\"col-md-2 col-xs-2\"></div>\n" +
    "                <div class=\"col-md-4 col-xs-4\"><b>Component</b></div>\n" +
    "                <div class=\"col-md-5 col-xs-5\"><b>Description</b></div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 col-xs-12\" id=\"updatesTableTbody \" ng-repeat=\"(key, value) in components\" ng-if=\"value.updates>0 && value.component != 'bam2'\">\n" +
    "                <div class=\"component_box\" id=\"{{value.component}}\">\n" +
    "                    <div class=\"col-md-2 col-xs-2\">\n" +
    "                        <input type=\"checkbox\" ng-model=\"value.selected\" ng-checked=\"selectedComp.component == value.component\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 col-xs-4\">\n" +
    "                        <a ui-sref=\"components.detailsView({component:value.component}) \">\n" +
    "                                    {{value.component}}\n" +
    "                                </a>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-5 col-xs-5\">update {{value.version}} to {{value.current_version}}</div>\n" +
    "                </div>\n" +
    "                <div class=\"row\" ng-show=\"value.installation != undefined\" style=\"width:100%;height:50px\">\n" +
    "                    <div>\n" +
    "                        <div ng-show=\"value.installationRunning != undefined\" class=\"col-md-4 col-xs-4\">\n" +
    "                            {{value.installationStart.msg}}\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4 col-xs-4\" ng-show=\"value.installationRunning != undefined\">\n" +
    "                            <progressbar value=\"value.progress\"></progressbar>\n" +
    "                            <button class=\"btn btn-default btn-xs center-block\" ng-click=\"cancelInstallation('cancelInstall') \">Cancel</button>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-1 col-xs-1\" ng-show=\"value.installationRunning != undefined\">\n" +
    "                            {{value.installationRunning.pct}}%\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-3 col-xs-3\" ng-show=\"value.installationRunning != undefined\">\n" +
    "                            {{value.installationRunning.mb}}\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\" ng-show=\"noUpdates\">\n" +
    "        <div class=\"well\">\n" +
    "            <p class=\"lead\">All components are up-to-date. </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-primary\" type=\"button\" ng-click=\"selectedUpdate()\" ng-hide=\"noUpdates\">Update</button>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"box-header with-border\">\n" +
    "                <strong> New Components </strong>\n" +
    "            </div>\n" +
    "            <div class=\"box-body\">\n" +
    "                <div class=\"col-md-4 col-xs-4\"><strong>Release Date</strong></div>\n" +
    "                <div class=\"col-md-4 col-xs-4\"><strong>Component Type</strong></div>\n" +
    "                <div class=\"col-md-4 col-xs-4\"><strong>Component</strong></div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 col-xs-12\" id=\"updatesTableTbody \" ng-repeat=\"(key, value) in components\" ng-if=\"value.is_new == 1 && value.component != 'bam2' \">\n" +
    "                <div class=\"component_box\" id=\"{{value.component}}\">\n" +
    "                    <div class=\"col-md-4 col-xs-4\">\n" +
    "                        {{value.release_date}}\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 col-xs-4\">\n" +
    "                        {{value.category_desc}}\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 col-xs-4\">\n" +
    "                        {{value.component}}-{{value.version}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\" ng-hide=\"hideLatestInstalled\">\n" +
    "            <div class=\"box-header with-border\">\n" +
    "                <strong>Components Installed/ Updated in last 30 days</strong>\n" +
    "            </div>\n" +
    "            <div class=\"box-body\">\n" +
    "                <div class=\"col-md-4 col-xs-4\"><strong>Release Date</strong></div>\n" +
    "                <div class=\"col-md-4 col-xs-4\"><strong>Component Type</strong></div>\n" +
    "                <div class=\"col-md-4 col-xs-4\"><strong>Component</strong></div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 col-xs-12\" id=\"updatesTableTbody \" ng-repeat=\"(key, value) in components\" ng-if=\"value.is_updated == 1  && value.component != 'bam2' \">\n" +
    "                <div class=\"component_box\" id=\"{{value.component}}\">\n" +
    "                    <div class=\"col-md-4 col-xs-4\">\n" +
    "                        {{value.release_date}}\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 col-xs-4\">\n" +
    "                        {{value.category_desc}}\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 col-xs-4\">\n" +
    "                        {{value.component}}-{{value.version}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- /.box -->\n" +
    "        <!-- /.box -->\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "")

$templateCache.put("../app/components/partials/view.html","<section class=\"content-header\">\n" +
    "    <h1 class=\"components-update-title-wrapper\">\n" +
    "        Update Manager\n" +
    "     </h1>\n" +
    "  \n" +
    "    <div class=\"components-update-button-wrapper\">\n" +
    "        <input type=\"checkbox\" ng-model=\"isList\" ng-click=\"setTest()\">&nbsp; Show test components</input>\n" +
    "        &nbsp;\n" +
    "        &nbsp;\n" +
    "        <input type=\"checkbox\" ng-model=\"showInstalled\" ng-disabled=\"disableShowInstalled\" ng-click=\"installedComps()\"></input> Show installed only\n" +
    "        &nbsp;\n" +
    "        &nbsp;\n" +
    "        <button ng-click=\"open('manual')\" class=\"btn btn-default\" type=\"button\" ng-if=\"updateSettings == 'manual'\"> Check for updates now</button>         \n" +
    "    </div>\n" +
    "    <uib-alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" dismiss-on-timeout=\"8000\" close=\"closeAlert()\" class=\"uib-text\">{{alert.msg}}</uib-alert>\n" +
    "</section>\n" +
    "\n" +
    "<span id=\"components\"></span>\n" +
    "<section class=\"content\">\n" +
    "    <div ng-if=\"loading\" style=\"position: absolute;width: 100px; height: 50px; top: 50%;left: 50%; margin-left: -50px; margin-top: -25px;\">\n" +
    "        <i class=\"fa fa-cog fa-spin fa-5x fa-fw margin-bottom\"></i>\n" +
    "        <span><h3>Loading...</h3></span>\n" +
    "    </div>\n" +
    "    <span ng-if=\"retry\" style=\"text-align: center;\"> <h4>Cannot connect to PGC. Retrying connection ... </h4> </span>\n" +
    "    <div ng-if=\"nothingInstalled\" class=\"jumbotron\" style=\"background-color: #fff; margin-top: 15px; text-align: center;\"> <h3> You haven't installed anything yet</h3></div>\n" +
    "    <div class=\"masonry\">\n" +
    "        <div ng-repeat=\"(key, value) in components | groupBy: 'category_desc'\" class=\"item\">\n" +
    "            <div class=\"box\">\n" +
    "                <div class=\"box-header with-border\">\n" +
    "                    <h3 class=\"box-title\" ng-bind=\"key\"></h3>\n" +
    "                </div>\n" +
    "                <!-- /.box-header -->\n" +
    "                <div class=\"box-body\">\n" +
    "                    <div id=\"serversTable\">\n" +
    "                        <div class=\"row component_head_box\">\n" +
    "                            <div class=\"col-md-6 col-sm-6 col-xs-6\"><strong>Component</strong></div>\n" +
    "                            <div class=\"col-md-3 col-sm-3 col-xs-3\"><strong>Installed</strong></div>\n" +
    "                            <div class=\"col-md-3 col-sm-3 col-xs-3\"><strong>Actions</strong></div>\n" +
    "\n" +
    "                        </div>\n" +
    "                        <div id=\"serversTableTbody \" ng-repeat=\"c in value \">\n" +
    "                            <div ng-if=\"c.component != 'bam2'\" class= \"row component_box\">\n" +
    "                                <div class=\"col-md-6 col-sm-6 col-xs-6\">\n" +
    "                                    <div class=\"comp-name\" ng-if=\"c.category !=  1 \">\n" +
    "                                        <a class=\"serversTableTbody-component--link\" tooltip-append-to-body=\"true\" uib-tooltip=\"{{ c.short_desc }}\" ui-sref=\"components.detailsView({component:c.component}) \" ng-bind = \"(c.component)+'-'+(c.version)\">    \n" +
    "                                        </a>\n" +
    "                                        <span class=\"badge new-comp-wrapper\" ng-if=\"c.is_new == 1 && c.status == 'NotInstalled'\" tooltip-append-to-body=\"true\" uib-tooltip=\"Release date: {{ c.release_date }}\">New</span>\n" +
    "                                        <span class=\"update-component-arrow-wrapper\" tooltip-append-to-body=\"true\" uib-tooltip=\"New version available: {{c.current_version}}\" ng-if=\"c.updates>0\">\n" +
    "                                            <i class=\"fa fa-arrow-circle-down\" id=\"updateIcon\" style=\"color: #FF8A21\"></i>\n" +
    "                                        </span>\n" +
    "                                        <span class=\"test-comp-icon\" ng-if=\"c.stage != 'prod'\" tooltip-append-to-body=\"true\" uib-tooltip=\"Test Component\"></span>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"comp-name\" ng-if=\"c.category ==  1\">\n" +
    "                                        <a class=\"serversTableTbody-component--link\" tooltip-append-to-body=\"true\" uib-tooltip=\"{{ c.short_desc }}\" ui-sref=\"components.detailspg95({component:c.component}) \" ng-bind = \"(c.component)+'-'+(c.version)\">\n" +
    "                                        </a>\n" +
    "                                        <span class=\"badge new-comp-wrapper\" ng-if=\"c.is_new == 1 && c.status == 'NotInstalled'\" tooltip-append-to-body=\"true\" uib-tooltip=\"Release date: {{ c.release_date }}\">New</span>\n" +
    "                                        <span class=\"update-component-arrow-wrapper\" tooltip-append-to-body=\"true\" uib-tooltip=\"New version available: {{c.current_version}}\" ng-if=\"c.updates>0\">\n" +
    "                                            <i class=\"fa fa-arrow-circle-down\" id=\"updateIcon\" style=\"color: #FF8A21\"></i>\n" +
    "                                        </span>\n" +
    "                                        <span class=\"test-comp-icon\" ng-if=\"c.stage != 'prod'\" tooltip-append-to-body=\"true\" uib-tooltip=\"Test Component\"></span>\n" +
    "                                    </div>\n" +
    "                                    \n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-3 col-sm-3 col-xs-3\">\n" +
    "                                <i style=\"color:green; \" class=\"fa fa-check-circle-o fa-2x \" ng-if=\"c.status == 'Installed' && c.removing == undefined || c.status == 'NotInitialized' && c.removing == undefined && c.init == undefined \"></i><i class='fa fa-spinner fa-2x  fa-pulse' ng-if=\"c.removing || c.init\">\n" +
    "                                </i>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-3 col-sm-3 col-xs-3\" style=\"padding-left: 10px;\">\n" +
    "                                    <a class=\"btn btn-default\" ng-click=\"compAction( 'install', c.component) \" id=\"install\" ng-if=\"c.status == 'NotInstalled'\" ng-disabled=\" c.installation != undefined\">Install</a>\n" +
    "                                    <a class=\"btn btn-default\" ng-click=\"compAction( 'remove', c.component) \" id=\"install\" ng-if=\"c.status == 'Installed' && c.updates == 0\" ng-disabled=\" c.installation != undefined\">Remove</a>\n" +
    "                                     <div class=\"btn-group \" uib-dropdown id=\"install\" ng-if=\"c.status == 'NotInitialized'\" ng-disabled=\"c.installation != undefined\">\n" +
    "                                    <button id=\"split-button \" type=\"button\" ng-click=\"compAction('init', c.component)\" class=\"btn btn-default \">Initialize</button>\n" +
    "                                        <button type=\"button \" class=\"btn btn-default \" uib-dropdown-toggle>\n" +
    "                                            <span class=\"caret \"></span>\n" +
    "                                            <span class=\"sr-only \">Split button!</span>\n" +
    "                                        </button>\n" +
    "                                        <ul uib-dropdown-menu role=\"menu \" aria-labelledby=\"split-button \">\n" +
    "                                            <li role=\"menuitem \"><a ng-click=\"compAction( 'remove', c.component) \" href=\"\" ng-hide=\"{{c.component=='bam2'}}\">Remove</a></li>\n" +
    "                                        </ul>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"btn-group\" uib-dropdown ng-if=\"c.updates > 0\">\n" +
    "                                        <button id=\"split-button \" type=\"button \" class=\"btn btn-default\" ng-click=\"compAction( 'update', c.component) \">Update</button>\n" +
    "                                        <button type=\"button \" class=\"btn btn-default\" uib-dropdown-toggle>\n" +
    "                                            <span class=\"caret \"></span>\n" +
    "                                            <span class=\"sr-only \">Split button!</span>\n" +
    "                                        </button>\n" +
    "                                        <ul uib-dropdown-menu role=\"menu \" aria-labelledby=\"split-button \">\n" +
    "                                            <li role=\"menuitem \"><a ng-click=\"compAction( 'remove', c.component) \" href=\"\">Remove</a></li>\n" +
    "                                        </ul>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"row\" ng-if=\"c.installation != undefined\" >\n" +
    "                                <div>\n" +
    "\n" +
    "                                    <div style=\"margin-left:10px;margin-top:20px\" ng-if=\"c.installationDependents != undefined\"><i class=\"fa fa-refresh fa-spin\" style='margin-right:2px'></i><strong> Installing dependencies...</strong> &nbsp;<button class=\"btn btn-default btn-xs\" ng-click=\"cancelInstallation('cancelInstall') \" >Cancel</button></div>\n" +
    "                                    <div style=\"margin-left:10px;margin-top:20px\" ng-if=\"c.installationStart.status =='start' && c.installationStart.state == 'unpack'\"><i class=\"fa fa-circle-o-notch fa-spin\" style='margin-right:2px'></i><strong> Unpacking </strong></div>\n" +
    "                                    <div style=\"margin-left:10px;margin-top:20px\" ng-if=\"c.installationStart.status =='start' && c.installationStart.state == 'download'\"><i class=\"fa fa-circle-o-notch fa-spin\" style='margin-right:2px'></i><strong> Downloading </strong></div>\n" +
    "\n" +
    "                                    <br />\n" +
    "                                    <div ng-if=\"c.installationRunning != undefined && c.installationStart.file\" class=\"col-md-4 col-xs-4\">\n" +
    "                                        file:{{c.installationStart.file || c.installationStart.msg}}\n" +
    "                                    </div>\n" +
    "                                    <div ng-if=\"c.installationRunning != undefined && c.installationStart.msg && c.installationStart.state=='update'\" class=\"col-md-4 col-xs-4\">\n" +
    "                                        {{c.installationStart.msg}}\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-4 col-xs-4\" ng-if=\"c.installationRunning != undefined\">\n" +
    "                                        <progressbar value=\"c.progress\"></progressbar>\n" +
    "                                        <button class=\"btn btn-default center-block btn-xs\" ng-click=\"cancelInstallation('cancelInstall') \">Cancel</button>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-1 col-xs-1\" ng-if=\"c.installationRunning != undefined\">\n" +
    "                                        {{c.installationRunning.pct}}%\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-3 col-xs-3\" ng-if=\"c.installationRunning != undefined\">\n" +
    "                                        {{c.installationRunning.mb}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- /.box -->\n" +
    "                <!-- /.box -->\n" +
    "            </div>\n" +
    "        </div>\n" +
    "</section>")

$templateCache.put("../app/menus/partials/bamHeaderUpdate.html","<div ng-show=\"bamUpdate\">\n" +
    "    <div class=\"bamUpdateVisor\">\n" +
    "    	<span>An update to the BigSQL Manager is available. Click the button to continue </span><button class=\"btn btn-default\" ng-click=\"open()\">Update</button>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("../app/menus/partials/leftMenu.html","<aside class=\"main-sidebar\">\n" +
    "    <!-- sidebar: style can be found in sidebar.less -->\n" +
    "    <section class=\"sidebar\">\n" +
    "        <!-- search form -->\n" +
    "        <form action=\"#\" method=\"get\" class=\"sidebar-form\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\" name=\"q\" class=\"form-control\" placeholder=\"Search...\">\n" +
    "                <span class=\"input-group-btn\">\n" +
    "                <button type=\"submit\" name=\"search\" id=\"search-btn\" class=\"btn btn-flat\"><i class=\"fa fa-search\"></i>\n" +
    "                </button>\n" +
    "              </span>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "        <!-- /.search form -->\n" +
    "        <!-- sidebar menu: : style can be found in sidebar.less -->\n" +
    "        <ul class=\"sidebar-menu\">\n" +
    "            <li class=\"header\">MAIN NAVIGATION</li>\n" +
    "            <li>\n" +
    "                <a ui-sref=\"components.view\">\n" +
    "                    <i class=\"fa fa-th\"></i> <span>Update Manager</span>\n" +
    "                    <!-- <i class=\"fa fa-angle-left pull-right\"></i> -->\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ui-sref=\"components.status\">\n" +
    "                    <i class=\"fa fa-dashboard\"></i> <span>Server Status</span>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ui-sref=\"components.componentLog({component:'pgcli'})\">\n" +
    "                    <i class=\"fa fa-file-text-o\"></i> <span>Log Tailer</span>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ui-sref=\"components.settingsView\">\n" +
    "                    <i class=\"fa fa-cog\"></i> <span>Settings</span>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </section>\n" +
    "    <!-- /.sidebar -->\n" +
    "</aside>")

$templateCache.put("../app/menus/partials/topMenu.html","<header class=\"main-header\">\n" +
    "    <!-- Logo -->\n" +
    "    <a href=\"/\" class=\"logo\">\n" +
    "        <!-- mini logo for sidebar mini 50x50 pixels -->\n" +
    "        <span class=\"logo-mini\"></span>\n" +
    "        <!-- logo for regular state and mobile devices -->\n" +
    "        <span class=\"logo-lg\"></span>\n" +
    "    </a>\n" +
    "    <!-- Header Navbar: style can be found in header.less -->\n" +
    "    <nav class=\"navbar navbar-static-top\" role=\"navigation\">\n" +
    "        <!-- Sidebar toggle button-->\n" +
    "        <!--  <a href=\"#\" class=\"sidebar-toggle\" data-toggle=\"offcanvas\" role=\"button\">\n" +
    "                    <span class=\"sr-only\">Toggle navigation</span>\n" +
    "                </a> -->\n" +
    "        <!-- Navbar Right Menu -->\n" +
    "        <h1 id=\"pgc-logo\">BigSQL Manager III</h1>\n" +
    "        <div class=\"navbar-custom-menu\">\n" +
    "            <ul class=\"nav navbar-nav\">\n" +
    "                <!-- Notifications: style can be found in dropdown.less -->\n" +
    "                <li>\n" +
    "                    \n" +
    "                </li>\n" +
    "                <li ng-click=\"open()\" id=\"updatesAvailable\" ng-if=\"updates\">\n" +
    "                    <a href=\"\">\n" +
    "                        <div>\n" +
    "                            <small class=\"label bg-orange\"><i class=\"fa fa-arrow-circle-down\"></i> {{updates}} Updates Available</small>\n" +
    "                        </div>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <div id=\"pgcHost\">\n" +
    "                        {{pgcInfo.host_short}}\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <a class=\"feedback-link\" target=\"_blank\" href=\"https://www.bigsql.org/feedback/index.jsp\" tooltip-placement=\"bottom-right\" uib-tooltip=\"Give Your Feedback\">\n" +
    "                        <i class=\"fa fa-comments-o\" aria-hidden=\"true\"></i>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                <!-- Control Sidebar Toggle Button -->\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "</header>")
}]);
})();