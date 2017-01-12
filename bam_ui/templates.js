//HEAD 
(function(module) {
try { app = angular.module("templates"); }
catch(err) { app = angular.module("templates", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("../app/components/components.html","<div ui-view=\"sub\"></div>")

$templateCache.put("../app/common/partials/hostInfo.html","<div class=\"components-update-title-wrapper\">\n" +
    "    <h1 style=\"float:left; display: inline; padding-right: 10px;\"><strong>{{ title }}</strong></h1>\n" +
    "    <form class=\"form form-inline \">\n" +
    "            <select class=\"form-control\" ng-change=\"hostChange(selecthost)\" ng-model=\"selecthost\">\n" +
    "            <option ng-repeat=\"host in hosts\" value=\"{{ host.host }}\">{{ host.host }}</option> </select>\n" +
    "        </form>\n" +
    "    <h3>\n" +
    "        <strong> OS </strong> : {{ data.os }} &nbsp;\n" +
    "        <strong>HW </strong>: {{ data.mem }} GB, {{ data.cores }} x {{ data.cpu }} &nbsp;\n" +
    "        <strong>PGC</strong> : {{ data.version }}\n" +
    "    </h3>\n" +
    "</div>\n" +
    "")

$templateCache.put("../app/components/partials/addHostModal.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"> {{type}} PGC SSH Server </h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "    <div ng-if=\"tryToConnect\">\n" +
    "        <i class=\"fa fa-spinner fa-pulse fa-2x\"></i> &nbsp;<strong> Trying to connect {{hostName}} </strong>\n" +
    "    </div>\n" +
    "    <div ng-if=\"connectionStatus\">\n" +
    "        <i class=\"fa fa-spinner fa-pulse fa-2x\"></i> &nbsp;<strong>{{message}} </strong>\n" +
    "    </div>\n" +
    "    <div ng-if=\"connectionError\">\n" +
    "        <strong>{{message}}</strong>\n" +
    "    </div>\n" +
    "    <div ng-hide=\"tryToConnect || connectionStatus\">\n" +
    "        <form>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"requiredSymbol\">*</div>\n" +
    "                <input type=\"text\" ng-model=\"hostName\" class=\"form-control\" placeholder=\"Host\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"requiredSymbol\">*</div>\n" +
    "                <input type=\"text\" ng-model=\"pgcDir\" class=\"form-control\" placeholder=\"PGC_HOME Directory\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"requiredSymbol\">*</div>\n" +
    "                <input type=\"text\" ng-model=\"userName\" class=\"form-control\" placeholder=\"Username\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"requiredSymbol\">*</div>\n" +
    "                <input type=\"password\" ng-model=\"password\" class=\"form-control\" placeholder=\"password\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"requiredSymbol\">*</div>\n" +
    "                <input type=\"text\" ng-model=\"connectionName\" class=\"form-control\" placeholder=\"Name\">\n" +
    "            </div>\n" +
    "            <div class=\"text-left\">\n" +
    "                <span style=\"color:red;\">*</span> Required Field\n" +
    "            </div>\n" +
    "            <div class=\"form-actions\">\n" +
    "                <div class=\"text-right\">\n" +
    "                    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"!(hostName && pgcDir && userName && password && connectionName)\" ng-click=\"addHost(hostName, pgcDir, userName, password, connectionName)\">Save</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("../app/components/partials/addServerGroupsModal.html","<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\"> {{type}} Group </h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "    <div ng-if=\"tryToConnect\">\n" +
    "        <i class=\"fa fa-spinner fa-pulse fa-2x\"></i> &nbsp;<strong> Trying to connect {{hostName}} </strong>\n" +
    "    </div>\n" +
    "    <div ng-show=\"CreatingGroup\">\n" +
    "        <i class=\"fa fa-spinner fa-pulse fa-2x\"></i> &nbsp;<strong>{{message}} </strong>\n" +
    "    </div>\n" +
    "    <div ng-if=\"status\">\n" +
    "        <strong>{{message}}</strong>\n" +
    "    </div>\n" +
    "    <div ng-hide=\"CreatingGroup\">\n" +
    "        <form>\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"requiredSymbol\">*</div>\n" +
    "                <input type=\"text\" ng-model=\"name\" class=\"form-control\" placeholder=\"Name\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" ng-model=\"desc\" class=\"form-control\" placeholder=\"Description\">\n" +
    "            </div>\n" +
    "            <br />\n" +
    "            <h4 class=\"modal-title\">Add Remote Servers to Group</h4>\n" +
    "            <br />\n" +
    "            <div class=\"form-group col-md-12\">\n" +
    "                <div class=\"col-md-5\">\n" +
    "                    <strong>Available Servers</strong>\n" +
    "                    <select style=\"width: 100%; height: 150px\" ng-model=\"selectedServers\" multiple>\n" +
    "                        <option ng-repeat=\"server in availableServers\" value=\"{{ server }}\">{{ server.host }}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-2\">\n" +
    "                    <div style=\"margin-left: 15px; margin-top: 15px\" >\n" +
    "                        <i class=\"fa fa-caret-right fa-5x\" aria-hidden=\"true\" ng-click=\"addToGroup(selectedServers)\"></i>\n" +
    "                    </div>\n" +
    "                    <div style=\"margin-left: 20px; margin-top: -25px\" >\n" +
    "                        <i class=\"fa fa-caret-left fa-5x\" aria-hidden=\"true\" ng-click=\"removeFromGroup(deselectServers)\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-5\">\n" +
    "                    <strong>Group Servers</strong>\n" +
    "                    <select style=\"width: 100%; height: 150px\" ng-model=\"deselectServers\" multiple>\n" +
    "                        <option ng-repeat=\"server in groupServers\" value=\"{{server}}\"> \n" +
    "                        {{server.host}}\n" +
    "                        </option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"text-left\">\n" +
    "                <span style=\"color:red;\">*</span> Required Field\n" +
    "            </div>\n" +
    "            <div class=\"form-actions\">\n" +
    "                <div class=\"text-right\">\n" +
    "                    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary\" ng-if=\"type != 'Edit'\" ng-disabled=\"!name\" ng-click=\"addServerGroup(name)\">Save</button>\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary\" ng-if=\"type == 'Edit'\" ng-disabled=\"!name\" ng-click=\"updateServerGroup(name)\">Update</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>")

$templateCache.put("../app/components/partials/badger.html","<section class=\"content-header\">\n" +
    "    <h1 class=\"components-update-title-wrapper\">\n" +
    "        pgBadger Console\n" +
    "    </h1>\n" +
    "</section>\n" +
    "\n" +
    "<section class=\"content\">\n" +
    "     <div class=\"row\">\n" +
    "    <div class=\"col-md-6 col-sm-6 col-xs-12\">\n" +
    "        <div class=\"box\">\n" +
    "            <div class=\"box-header with-border\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <strong> Settings</strong>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"box-body\">\n" +
    "                <form class=\"form plProfiler-form\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"col-md-3 col-sm-3 col-xs-3\">\n" +
    "                            <select class=\"form-control\" id=\"logComponents\" ng-model=\"selectComp\" ng-change=\"onSelectChange(selectComp)\">\n" +
    "                                <option value=\"\">Select DB</option>\n" +
    "                                <option value=\"{{c.component}}\" ng-repeat=\"c in components\">{{c.component}}</option>\n" +
    "                            </select>\n" +
    "                            <span class=\"required-pgbadger-form\">*</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4 col-sm-4 col-xs-4\">\n" +
    "                            <button class=\"btn btn-default pull-right\" ng-click=\"openSwitchlog()\" ng-disabled=\"disableLog\">Switch log file</button>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-5 col-sm-5 col-xs-5\">\n" +
    "                            <button class=\"btn btn-default pull-right\" ng-click=\"openLoggingParam()\" ng-disabled=\"disableLog\">\n" +
    "                            Change logging parameters\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                        <br />\n" +
    "                        <br />\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <input type=\"text\" ng-model=\"logDir\" class=\"form-control\" placeholder=\"Log Dir\" ng-disabled=\"true\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <div class=\"pull-left\"> Select log files &nbsp;<span class=\"required-symbol\">*</span> </div>\n" +
    "                            <div class=\"pull-right\" ng-click=\"refreshLogfiles(selectComp)\"> <i class=\"fa fa-refresh fa-fw\"></i></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <div class=\"pg-badger-select-log\" ng-model=\"selectLog\">\n" +
    "                                <div ng-if=\"refreshMsg\"><i class=\"fa fa-refresh fa-spin fa-fw\"></i>Refreshing..</div>\n" +
    "                                <div ng-repeat=\"c in logfiles\" ng-if=\"!refreshMsg\">\n" +
    "                                    <label>\n" +
    "                                        <input type=\"checkbox\" name=\"selectLog\" ng-if=\"$index == 0\" ng-checked=\"true\" value=\"{{c.log_file}}\">\n" +
    "                                        <input type=\"checkbox\" name=\"selectLog\" ng-if=\"$index != 0\" ng-checked=\"logFileChecked()\" value=\"{{c.log_file}}\">\n" +
    "                                        <span>&nbsp;{{c.file}}</span>\n" +
    "                                    </label>\n" +
    "                                    <span class=\"pull-right\">{{c.file_size}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{c.mtime}}</span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"text-left col-md-12\">\n" +
    "                        <span class=\"required-symbol\">*</span> Required Field\n" +
    "                    </div>\n" +
    "                    \n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"box\">\n" +
    "            <div class=\"box-body\">\n" +
    "                <form>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <input type=\"text\" ng-model=\"pgTitle\"  class=\"form-control\" placeholder=\"Badger Title\">\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <input type=\"text\" ng-model=\"pgJobs\"  class=\"form-control\" placeholder=\"Number of jobs\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"form-actions\">\n" +
    "                            <div class=\"text-right\">\n" +
    "                                <button type=\"submit\" class=\"btn btn-primary\"\n" +
    "                                        ng-disabled=\"generatingReportSpinner\"\n" +
    "                                        ng-click=\"openGenerateModal()\">Generate\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6 col-sm-6 col-xs-12\">\n" +
    "        <div class=\"box\" ng-if=\"showReports\">\n" +
    "            <div class=\"box-header\">\n" +
    "                <span><label>Report</label></span>\n" +
    "                <span class=\"pull-right\"><label>Created on</label></span>                \n" +
    "            </div>\n" +
    "            <div class=\"box-body\">\n" +
    "                <div class=\"col-md-12 recent-report-list\">\n" +
    "                    <div ng-repeat=\"c in files_list\">\n" +
    "                        <label>\n" +
    "                        <input type=\"checkbox\" name=\"\" ng-model=\"c.selected\"/>\n" +
    "                            <span>&nbsp;{{ c.file }}</span>\n" +
    "                        </label>&nbsp;&nbsp;<a target=\"_blank\" href=\"{{ c.file_link }}\"><i class=\"fa fa-external-link\"></i></a>\n" +
    "                        <span class=\"pull-right\">{{ c.mtime }}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"box-footer\">\n" +
    "            <button class=\"btn btn-default pull-left\" ng-click=\"deleteReports(files_list, true)\">Delete all</button>\n" +
    "            <button class=\"btn btn-default pull-right\" ng-click=\"deleteReports(files_list, false)\">Delete</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    " </div>\n" +
    "</section>")

$templateCache.put("../app/components/partials/details.html","<!-- Content Header (Page header) -->\n" +
    "<section class=\"content-header\">\n" +
    "    <server-info-details title=\"Component Details\"></server-info-details>\n" +
    "    <uib-alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" dismiss-on-timeout=\"8000\" close=\"closeAlert()\" class=\"uib-text\">{{alert.msg}}</uib-alert>\n" +
    "</section>\n" +
    "\n" +
    "<!-- Main content -->\n" +
    "<section class=\"content\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-if=\"loading\" style=\"position: absolute;width: 100px; height: 50px; top: 50%;left: 50%; margin-left: -50px; margin-top: -25px;\">\n" +
    "            <i class=\"fa fa-cog fa-spin fa-5x fa-fw margin-bottom\"></i>\n" +
    "            <span><h3>Loading...</h3></span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 col-xs-4 col-sm-12\" ng-if=\"!loading\">\n" +
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
    "        <div class=\"col-md-9 col-xs-8 col-sm-12\" ng-if=\"!loading\">\n" +
    "            <div class=\"box\" ng-if=\"relnotes\">\n" +
    "                <div class=\"box-header with-border\">\n" +
    "                    <h3 class=\"box-title\">\n" +
    "                        Release Notes \n" +
    "                    </h3>         \n" +
    "                </div>\n" +
    "                <div class=\"box-body\">\n" +
    "                   <span ng-bind-html=\"relnotes\"></span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "</section>")

$templateCache.put("../app/components/partials/detailspg95.html","<!-- Content Header (Page header) -->\n" +
    "<section class=\"content-header\">\n" +
    "    <server-info-details title=\"Component Details\"></server-info-details>\n" +
    "\n" +
    "</section>\n" +
    "<uib-alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" dismiss-on-timeout=\"8000\" close=\"closeAlert()\" class=\"uib-text\">{{alert.msg}}</uib-alert>\n" +
    "<!-- Main content -->\n" +
    "<section class=\"content\">\n" +
    "    <div class=\"row\">\n" +
    "        <div ng-if=\"loading\" style=\"position: absolute;width: 100px; height: 50px; top: 50%;left: 50%; margin-left: -50px; margin-top: -25px;\">\n" +
    "            <i class=\"fa fa-cog fa-spin fa-5x fa-fw margin-bottom\"></i>\n" +
    "            <span><h3>Loading...</h3></span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 col-sm-4 col-xs-12\" ng-if=\"!loading\">\n" +
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
    "                    <div style=\"text-align: center; padding-bottom: 25px;\"><b><a href=\"\" tooltip-append-to-body=\"true\" uib-tooltip=\"Check out the new features of {{ component.component }}\" ng-click=\"openWhatsNew()\"> What's New</a></b></div>\n" +
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
    "                            <a class=\"btn btn-danger\" ng-click=\"openInitPopup(component.component)\" ng-disabled=\" component.spinner != undefined\">Initialize</a>\n" +
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
    "            <div ng-show=\"component.category == 1\" class=\"box box-primary\" ng-if=\"!loading\">\n" +
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
    "        <div ng-show=\"component.category == 1\" class=\"col-md-9 col-sm-8 col-xs-12\" ng-if=\"!loading\">\n" +
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
    "                    <uib-tab heading=\"Performance\" disable=\"component.status != 'Running'\">\n" +
    "                    <div class=\"gridStyle\">\n" +
    "                        <div class=\"box box-primary\">\n" +
    "                            <div class=\"box-body\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div style=\"padding-top: 20px;\" class=\"col-md-12 col-sm-12 col-xs-1\">\n" +
    "                                        <a style=\"margin-right: 10px;\" class=\"btn btn-lg btn-default\" tooltip-append-to-body=\"true\" uib-tooltip=\"{{ component.logdir }}\" ng-show=\"component.logdir != ''\" ui-sref=\"components.componentLog({component:component.component})\" ng-click=\"logdir(component.logdir) ; logdirSelect()\" tooltip-class=\"logDataDirHover\">\n" +
    "                                            <i class=\"fa fa-file-text-o fa-2x pull-left\"></i>\n" +
    "                                            Log Tailer\n" +
    "                                        </a>\n" +
    "\n" +
    "                                        <a style=\"margin-right: 10px;\" class=\"btn btn-lg btn-default\" ui-sref=\"components.profiler\">\n" +
    "                                            <i class=\"bgs bgs-lg bgs-plprofiler pull-left\"></i> plProfiler\n" +
    "                                        </a>\n" +
    "\n" +
    "                                        <a class=\"btn btn-lg btn-default\" ui-sref=\"components.badger\">\n" +
    "                                            <i class=\"bgs bgs-lg bgs-pgbadger pull-left\"></i> \n" +
    "                                            pgBadger\n" +
    "                                        </a>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    </uib-tab>\n" +
    "                    <uib-tab heading=\"Release Notes\" ng-click=\"releaseTabEvent()\">\n" +
    "                        <div class=\"gridStyle\">\n" +
    "                            <div class=\"box box-primary\">\n" +
    "                                <div class=\"box-body\">\n" +
    "                                    <div class=\"col-md-12 col-xs-12\">\n" +
    "                                        <span ng-bind-html=\"relnotes\"></span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </uib-tab>\n" +
    "                </uib-tabset>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</section>\n" +
    "")

$templateCache.put("../app/components/partials/devOpsUpdate.html","<div class=\"modal-header\">\n" +
    "    <img src=\"../assets/img/logoBIG.png\" alt=\"\">\n" +
    "    <h4 class=\"modal-title\" id=\"updateModalLabel\">BigSQL Ops Manager update</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "        <p ng-hide=\"bamUpdateIntiated\">WE NEED TO SUSPEND THE GUI MANAGER WHILE WE UPDATE. THIS SHOULD TAKE A FEW MINUTES. <br /> CLICK THE BUTTON BELOW TO START THE PROCESS.</p>\n" +
    "        <div ng-show=\"updatingStatus\" style=\"width:600px; margin:0 auto;\">BigSQL Ops Manager Updating {{currentVersion}} to {{updateVersion}} </div>\n" +
    "        <br />\n" +
    "        <img ng-show=\"updatingStatus\" style=\"width:100px;\" src=\"/assets/loaders/loader.gif\" />\n" +
    "        <button class=\"btn btn-default\" ng-hide=\"bamUpdateIntiated\" ng-click=\"action($event)\">Update BigSQL Ops Manager Version {{currentVersion}} to {{updateVersion}} </button>\n" +
    "        <button class=\"btn btn-default\" ng-show=\"bamUpdatedStatus\" ng-click=\"redirect()\"> BigSQL Ops Manager has been updated, Click to launch</button>\n" +
    "        <button class=\"btn btn-default\" ng-show=\"bamNotUpdatedStatus\" ng-click=\"redirect()\"> BigSQL Ops Manager not updated</button>\n" +
    "    \n" +
    "</div>")

$templateCache.put("../app/components/partials/generateBadgerReport.html","<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">&nbsp;</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\" style=\"text-align: center;\">\n" +
    "    <div ng-if=\"generatingReportSpinner\" style=\"\"> <i class='fa fa-spinner fa-2x  fa-pulse'></i> Generating badger report</div>\n" +
    "    <div ng-if=\"!badgerError && !generatingReportSpinner\">\n" +
    "        <h5 style=\"font-size: 1.4rem; font-weight: 500;\">\n" +
    "        Report {{report_file}} generated.\n" +
    "        </h5>\n" +
    "        <br />\n" +
    "        <span ng-if=\"report_file\">\n" +
    "        <a class=\"btn btn-default btn-lg\" href=\"/reports/{{ report_file }}\" target=\"_blank\" ng-click=\"cancel()\">    View Report</a>\n" +
    "        </span>\n" +
    "        <br />\n" +
    "        <p style=\"font-style: italic; font-size: 1.0rem; padding-top: 20px;\"> (Opens a new tab)</p>\n" +
    "    </div>\n" +
    "    <div ng-if=\"badgerError\">\n" +
    "        {{badgerError}}\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-disabled=\"switchBtn\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>")

$templateCache.put("../app/components/partials/globalProfilingModal.html","<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">Global Profiling</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<div ng-if=\"showStatus\">Global Profiling is {{status.status}}</div>\n" +
    "<br />\n" +
    "<form class=\"form plProfiler-form\" action=\"#\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <a class=\"btn btn-lg btn-default\" ng-click=\"enableProfiler()\" ng-disabled=\"status.enabled\">\n" +
    "            <i class=\"fa fa-check fa-2x pull-left\"></i> Enable\n" +
    "        </a>\n" +
    "        <a class=\"btn btn-lg btn-default\" ng-click=\"disableProfiler()\" ng-disabled=\"!status.enabled\">\n" +
    "            <i class=\"fa fa-ban fa-2x pull-left\"></i> Disable\n" +
    "        </a>\n" +
    "        <a class=\"btn btn-lg btn-default\" ng-click=\"resetProfiler()\" uib-tooltip=\"Reset Global Profiling Statistics\">\n" +
    "            <i class=\"fa fa-refresh fa-2x pull-left\"></i> Reset\n" +
    "        </a>\n" +
    "        <a class=\"btn btn-lg btn-default\" ng-click=\"generateReport()\">\n" +
    "            <i class=\"fa fa-newspaper-o fa-2x pull-left\"></i> View Report\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <div ng-class=\"{ 'alert alert-success' : result.action == 'enable', 'alert alert-danger' : result.action == 'disable', 'alert alert-warning' : result.action == 'reset'  }\" role=\"alert\" ng-if=\"showResult\">\n" +
    "            {{result.msg}}\n" +
    "        </div> \n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"text\" ng-model=\"pgTitle\" required class=\"form-control\" placeholder=\"Report Title (Optional)\">\n" +
    "    </div>\n" +
    "     <div class=\"form-group\">\n" +
    "        <input type=\"text\" ng-model=\"pgDesc\" class=\"form-control\" placeholder=\"Report Desc (Optional)\">\n" +
    "    </div>\n" +
    "</form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>")

$templateCache.put("../app/components/partials/hostGraphModal.html","<div class=\"modal-header\">\n" +
    "    <h2 class=\"modal-title\" id=\"updateModalLabel\"> {{chartName}} ({{hostName}})</h2>\n" +
    "</div>\n" +
    "<div ng-click=\"cancel()\" class=\"close-modal\" data-dismiss=\"modal\" aria-hidden=\"true\">\n" +
    "    <div class=\"lr\">\n" +
    "        <div class=\"rl\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "    <nvd3 options=\"chart\" data=\"data\" showLegend=\"true\"></nvd3>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-danger\" type=\"button\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>")

$templateCache.put("../app/components/partials/hosts.html","<section class=\"content-header\">\n" +
    "    <h1 class=\"components-update-title-wrapper\">\n" +
    "        CLOUD HOST MANAGER\n" +
    "    </h1>\n" +
    "    <div class=\"btn-group pull-right \" uib-dropdown >\n" +
    "        <button type=\"button\" class=\"btn btn-default\" uib-dropdown-toggle>\n" +
    "            <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\n" +
    "        </button>\n" +
    "        <ul uib-dropdown-menu role=\"menu \" aria-labelledby=\"split-button \">\n" +
    "            <li><a href=\"\" ng-click=\"openGroupsModal()\">Add Group</a></li>\n" +
    "            <li><a href=\"\" ng-click=\"open()\">Add Host</a></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</section>\n" +
    "\n" +
    "<span id=\"components\"></span>\n" +
    "<section class=\"content\">\n" +
    "    <div ng-if=\"loading\"\n" +
    "         style=\"position: absolute;width: 100px; height: 50px; top: 50%;left: 50%; margin-left: -50px; margin-top: -25px;\">\n" +
    "        <i class=\"fa fa-cog fa-spin fa-5x fa-fw margin-bottom\"></i>\n" +
    "        <span><h3>Loading...</h3></span>\n" +
    "    </div>\n" +
    "    <span ng-if=\"retry\" style=\"text-align: center;\"> <h4>Cannot connect to PGC. Retrying connection ... </h4> </span>\n" +
    "\n" +
    "    <div ng-if=\"nothingInstalled\" class=\"jumbotron\"\n" +
    "         style=\"background-color: #fff; margin-top: 15px; text-align: center;\"><h3> You haven't registered any\n" +
    "        hosts.</h3></div>\n" +
    "\n" +
    "    <div class=\"hostmanager-accordian-wrapper\" ng-if=\"!loading\">\n" +
    "        <div class=\"box\">\n" +
    "            <uib-accordion close-others=\"true\">\n" +
    "                <uib-accordion-group ng-repeat=\"group in groupsList\" is-open=\"group.open\"  ng-init=\"parentIndex = $index\">\n" +
    "                    <uib-accordion-heading>\n" +
    "                        <span ng-if=\"group.group == 'default'\">\n" +
    "                            <i class=\"pull-left glyphicon\" ng-class=\"{'fa fa-plus': !group.open, 'fa fa-minus': group.open}\"></i> &nbsp;All Hosts\n" +
    "                        </span>\n" +
    "                        <span ng-if=\"group.group != 'default'\">\n" +
    "                            <i class=\"pull-left glyphicon\" ng-class=\"{'fa fa-plus': !group.open, 'fa fa-minus': group.open}\"></i>&nbsp; {{group.group}}\n" +
    "                        </span>\n" +
    "                            <div class=\"pull-right\" style=\"margin-top: -10px\">\n" +
    "                                &nbsp;\n" +
    "                                <div class=\"btn-group\" uib-dropdown >\n" +
    "                                    <button id=\"split-button \" type=\"button\" ng-click=\"$event.stopPropagation();$event.preventDefault();openNewLocation(); openGroupsModal($index)\" class=\"btn btn-default \" ng-disabled=\"group.group=='default'\" >Edit Group</button>\n" +
    "                                    <button type=\"button\" ng-click=\"$event.stopPropagation();$event.preventDefault();openNewLocation()\" class=\"btn btn-default \" ng-disabled=\"group.group=='default'\"  uib-dropdown-toggle>\n" +
    "                                        <span class=\"caret \"></span>\n" +
    "                                        <span class=\"sr-only \">Split button!</span>\n" +
    "                                    </button>\n" +
    "                                    <ul uib-dropdown-menu role=\"menu \" aria-labelledby=\"split-button \">\n" +
    "                                        <li><a  ng-click=\"$event.stopPropagation();$event.preventDefault();openNewLocation(); deleteGroup($index)\" href=\"\">Delete</a></li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                    </uib-accordion-heading>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div ng-if=\"group.hosts.length == 0\">There are no servers added in this group.</div>\n" +
    "                        <uib-accordion close-others=\"true\" >\n" +
    "                            <uib-accordion-group ng-repeat=\"host in group.hosts\" is-open=\"host.open\">\n" +
    "                                <uib-accordion-heading>\n" +
    "                                        <span ng-click=\"loadHost(parentIndex, $index, false)\" ng-if=\"host.host != 'localhost' && host.name != host.host\"> &nbsp; {{host.name}} &nbsp; ({{ host.host }})\n" +
    "                                            &nbsp; &nbsp; &nbsp;\n" +
    "                                            {{host.hostInfo.os}} {{ host.hostInfo.mem }} GB, {{ host.hostInfo.cores }} x {{host.hostInfo.cpu}}\n" +
    "                                            <i class=\"pull-left glyphicon\" ng-class=\"{'fa fa-plus': !host.open, 'fa fa-minus': host.open}\"></i>\n" +
    "                                        </span>\n" +
    "                                        <span ng-click=\"loadHost(parentIndex, $index, false)\" ng-if=\"host.host == 'localhost' || host.name == host.host\"> &nbsp; {{host.host}}  \n" +
    "                                            &nbsp; &nbsp; &nbsp;\n" +
    "                                            {{host.hostInfo.os}} {{ host.hostInfo.mem }} GB, {{ host.hostInfo.cores }} x {{host.hostInfo.cpu}}\n" +
    "                                            <i class=\"pull-left glyphicon\" ng-class=\"{'fa fa-plus': !host.open, 'fa fa-minus': host.open}\"></i>\n" +
    "                                        </span>\n" +
    "                                        <div class=\"pull-right\" style=\"margin-top: -10px\">\n" +
    "                                            &nbsp;\n" +
    "                                            <button type=\"button\" ng-click=\"$event.stopPropagation();$event.preventDefault();openNewLocation(); loadHost(parentIndex,$index,true)\" class=\"btn btn-default\" ng-if=\"host.open\">Refresh</button>&nbsp;\n" +
    "                                            <button type=\"button\" ng-click=\"$event.stopPropagation();$event.preventDefault();openNewLocation(); UpdateManager($index)\" class=\"btn btn-default\" ng-if=\"host.open\" class=\"ng-binding\" href=\"\" >Components</button>&nbsp;\n" +
    "                                            <button type=\"button\" ng-click=\"$event.stopPropagation();$event.preventDefault();openNewLocation(); showTop($index)\" class=\"btn btn-default\" ng-if=\"host.open\" class=\"ng-binding\" href=\"\">Top</button>&nbsp;\n" +
    "                                            <div class=\"btn-group\" uib-dropdown >\n" +
    "                                                <button id=\"split-button \" type=\"button\" ng-click=\"$event.stopPropagation();$event.preventDefault();openNewLocation(); open(parentIndex, $index)\" class=\"btn btn-default \" ng-disabled=\"host.host=='localhost'\" >Edit Host</button>\n" +
    "                                                <button type=\"button\" ng-click=\"$event.stopPropagation();$event.preventDefault();openNewLocation()\" class=\"btn btn-default \" ng-disabled=\"host.host=='localhost'\"  uib-dropdown-toggle>\n" +
    "                                                    <span class=\"caret \"></span>\n" +
    "                                                    <span class=\"sr-only \">Split button!</span>\n" +
    "                                                </button>\n" +
    "                                                <ul uib-dropdown-menu role=\"menu \" aria-labelledby=\"split-button \">\n" +
    "                                                    <li><a  ng-click=\"$event.stopPropagation();$event.preventDefault();openNewLocation(); deleteHost($index)\" href=\"\">Delete</a></li>\n" +
    "                                                </ul>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                </uib-accordion-heading>\n" +
    "\n" +
    "                                <div class=\"col-md-6 col-sm-12 col-xs-12\" ng-if=\"host.hostInfo.home\">\n" +
    "\n" +
    "                                    <!-- <span style=\"float: right;\" ng-click=\"loadHost(parentIndex, $index,true)\">\n" +
    "\n" +
    "\n" +
    "                                    </span> -->\n" +
    "\n" +
    "                                    <p><strong>PGC : </strong>{{ host.hostInfo.version }} {{ host.hostInfo.home }}</p>\n" +
    "\n" +
    "                                    <p>\n" +
    "                                    <div style=\"padding:0;\" class=\"col-md-4 col-sm-6 col-xs-12\" ng-click=\"openGraphModal('CPU Load')\">\n" +
    "                                        <div class=\"host-perf-viz\">\n" +
    "                                                <h5>CPU Load</h5>\n" +
    "                                            <nvd3 options=\"cpuChart\" data=\"cpuData\" showLegend=\"false\"></nvd3>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div style=\"padding:0;\" class=\"col-md-4 col-sm-6 col-xs-12\" ng-click=\"openGraphModal('Disk IO')\">\n" +
    "                                        <div class=\"host-perf-viz\">\n" +
    "                                                <h5>Disk IO</h5>\n" +
    "                                            <nvd3 options=\"ioChart\" data=\"diskIO\" showLegend=\"false\"></nvd3>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div style=\"padding:0;\" class=\"col-md-4 col-sm-6 col-xs-12\" ng-click=\"openGraphModal('Network IO')\">\n" +
    "                                        <div class=\"host-perf-viz\">\n" +
    "                                                <h5>Network IO</h5>\n" +
    "                                            <nvd3 options=\"networkChart\" data=\"NetworkIO\" showLegend=\"false\"></nvd3>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    </p>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div ng-if=\"!host.comps\">\n" +
    "                                    <i class=\"fa fa-cog fa-spin fa-5x fa-fw margin-bottom\"></i>\n" +
    "                                    <span><h3>Loading...</h3></span>\n" +
    "                                </div> \n" +
    "\n" +
    "                                <div class=\"col-md-6 col-sm-12 col-xs-12\" ng-if=\"host.comps\">\n" +
    "                                    <div ng-if=\"host.showMsg\" class=\"jumbotron\"\n" +
    "                                         style=\"background-color: #fff; margin-top: 15px; text-align: center;\">\n" +
    "                                        <h4> No PostgreSQL or server components installed.<br \\> Visit the <a ng-click=\"UpdateManager($index)\" href=\"\">Update\n" +
    "                                            Manager</a> to install components.</h4>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"box\" ng-if='host.showMsg == false'>\n" +
    "                                        <div class=\"box-header with-border\">\n" +
    "                                            <h3 class=\"box-title\">Services</h3>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"box-body\">\n" +
    "                                            <table class=\"table\" id=\"serversTable\">\n" +
    "                                                <thead>\n" +
    "                                                <tr>\n" +
    "                                                    <th class=\"col-md-3 col-xs-3\">Component</th>\n" +
    "                                                    <th class=\"col-md-5 col-xs-5\">Status</th>\n" +
    "                                                    <th class=\"col-md-1 col-xs-1\"></th>\n" +
    "                                                    <th class=\"col-md-3 col-xs-3\">Actions</th>\n" +
    "                                                </tr>\n" +
    "                                                </thead>\n" +
    "                                                <tbody id=\"serversTableBody\">\n" +
    "                                                <tr ng-repeat=\"comp in host.comps\" ng-if=\"comp.component != 'devops'\">\n" +
    "                                                    <td class=\"col-md-3 col-xs-3\">\n" +
    "                                                        <div ng-if=\"comp.category != 1\">\n" +
    "                                                            <a ui-sref=\"components.detailsView({component:comp.component}) \" ng-click=\"changeHost(host.host)\">\n" +
    "                                                                {{ comp.component }}\n" +
    "                                                            </a>\n" +
    "                                                        </div>\n" +
    "                                                        <div ng-if=\"comp.category == 1\">\n" +
    "                                                            <a ui-sref=\"components.detailspg95({component:comp.component}) \" ng-click=\"changeHost(host.host)\">\n" +
    "                                                                {{ comp.component }}\n" +
    "                                                            </a>\n" +
    "                                                        </div>\n" +
    "                                                    </td>\n" +
    "                                                    <td class=\"col-md-5 col-xs-5\"><i ng-class=\"statusColors[comp.state]\"\n" +
    "                                                                                     style=\"margin-top:2px;margin-right:10px\"\n" +
    "                                                                                     class=\"fa fa-stop fa-2x pull-left\"></i>\n" +
    "\n" +
    "                                                        <div style=\"margin-top: 5px\" ng-show=\"comp.port\">{{ comp.state }} on\n" +
    "                                                            port {{ comp.port }}</div>\n" +
    "                                                        <div style=\"margin-top: 5px\" ng-show=\"!comp.port\">{{ comp.state }}</div>\n" +
    "                                                    </td>\n" +
    "                                                    <td class=\"col-md-1 col-xs-1\">\n" +
    "                                                        <span ng-show=\"comp.showingSpinner\"><i\n" +
    "                                                                class='fa fa-spinner fa-2x  fa-pulse'></i></span>\n" +
    "                                                    </td>\n" +
    "                                                    <td class=\"col-md-3 col-xs-3\" value=\"{{ comp.component }}\" ng-click=\"action( $event, host.host)\">\n" +
    "                                                        <a class=\"btn btn-default\" ng-show=\"comp.state =='Not Initialized' \" ng-click=\"openInitPopup(comp.component)\"\n" +
    "                                                           ng-disabled=\" comp.showingSpinner != undefined\">Initialize</a>\n" +
    "                                                        <a class=\"btn btn-default\" id=\"install\" ng-show=\"comp.state =='Stopped'\"\n" +
    "                                                           ng-disabled=\" comp.showingSpinner != undefined\">Start</a>\n" +
    "\n" +
    "                                                        <div class=\"btn-group\" uib-dropdown ng-show=\"comp.state =='Running'\">\n" +
    "                                                            <button id=\"split-button\" type=\"button\" class=\"btn btn-default\"\n" +
    "                                                                    ng-disabled=\"{{ comp.component=='devops' }}\">Action\n" +
    "                                                            </button>\n" +
    "                                                            <button type=\"button\" class=\"btn btn-default\" uib-dropdown-toggle\n" +
    "                                                                    ng-disabled=\"{{ comp.component=='devops' }}\">\n" +
    "                                                                <span class=\"caret\"></span>\n" +
    "                                                                <span class=\"sr-only\">Split button!</span>\n" +
    "                                                            </button>\n" +
    "                                                            <ul uib-dropdown-menu role=\"menu\" aria-labelledby=\"split-button\">\n" +
    "                                                                <li role=\"menuitem\"><a>Stop</a></li>\n" +
    "                                                                <li role=\"menuitem\"><a>Restart</a></li>\n" +
    "                                                            </ul>\n" +
    "                                                        </div>\n" +
    "                                                    </td>\n" +
    "                                                </tr>\n" +
    "                                                </tbody>\n" +
    "                                            </table>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </uib-accordion-group>\n" +
    "                        </uib-accordion>\n" +
    "                    </div>\n" +
    "                </uib-accordion-group>\n" +
    "            </uib-accordion>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</section>")

$templateCache.put("../app/components/partials/loading.html","<section class=\"content\">\n" +
    "    <div ng-if=\"bamLoading\" style=\"position: absolute;width: 100px; height: 50px; top: 50%;left: 50%; margin-left: -50px; margin-top: -25px;\">\n" +
    "        <i class=\"fa fa-cog fa-spin fa-5x fa-fw margin-bottom\"></i>\n" +
    "        <span><h3>Loading...</h3></span>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!bamLoading\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-2 col-sm-3 col-xs-6\">\n" +
    "                <a ui-sref=\"components.hosts\" class=\"thumbnail\">\n" +
    "                    <img src=\"assets/img/sloni.png\" alt=\"\">\n" +
    "                    <div class=\"caption\">\n" +
    "                        <h4 style=\"text-align:center;\">pg96</h4>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 col-sm-3 col-xs-6\">\n" +
    "                <a href=\"/admin\" class=\"thumbnail\">\n" +
    "                    <img src=\"assets/img/logoBIG.png\" alt=\"\">\n" +
    "                    <div class=\"caption\">\n" +
    "                        <h4 style=\"text-align:center;\">pgAdmin4 Web</h4>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 col-sm-3 col-xs-6\">\n" +
    "                <a ui-sref=\"components.profiler\" class=\"thumbnail\">\n" +
    "                    <img src=\"assets/img/pl-profiler-opt-1.png\" alt=\"\">\n" +
    "                    <div class=\"caption\">\n" +
    "                        <h4 style=\"text-align:center;\">plProfiler</h4>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 col-sm-3 col-xs-6\">\n" +
    "                <a ui-sref=\"components.badger\" class=\"thumbnail\">\n" +
    "                    <img src=\"assets/img/pgbadger-lg.png\" alt=\"\">\n" +
    "                    <div class=\"caption\">\n" +
    "                        <h4 style=\"text-align:center;\">pgBadger</h4>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 col-sm-3 col-xs-6\">\n" +
    "                <a ui-sref=\"components.hosts\" class=\"thumbnail\">\n" +
    "                    <img src=\"assets/img/cloud-mgr-lg.png\" alt=\"\">\n" +
    "                    <div class=\"caption\">\n" +
    "                        <h4 style=\"text-align:center;\">Cloud Manager</h4>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    <hr style=\"background-color: #fff; border-top: 1px solid #8c8b8b; margin-top: 90px;\">\n" +
    "\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <h3>Recently Released</h3>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <h3>Documentation</h3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</section>\n" +
    "")

$templateCache.put("../app/components/partials/log.html","<section class=\"content-header\">\n" +
    "    <server-info-details title=\"Log Tailer\"></server-info-details>\n" +
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

$templateCache.put("../app/components/partials/loggingParam.html","<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">Set Logging Parameters</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <table class=\"table table-striped\">\n" +
    "      <thead>\n" +
    "        <tr>\n" +
    "          <th><h4 style=\"font-weight: bold;\">Parameter</h4></th>\n" +
    "          <th><h4 style=\"font-weight: bold;\">Setting</h4></th>\n" +
    "        </tr>\n" +
    "      </thead>\n" +
    "      <tbody>\n" +
    "        <tr ng-repeat=\"(key, value) in data\" ng-if=\"$index < 3\">\n" +
    "            <td><h4 style=\"font-weight: bold;\">{{value.name}}</h4></td>\n" +
    "            <td>\n" +
    "                <div>\n" +
    "                    <label> \n" +
    "                        <input type=\"radio\" value=\"on\" name=\"{{value.name}}\" ng-checked=\"(value.setting == 0)\" ng-click=\"changeSetting(value.name, '0' )\">&nbsp; Enable all\n" +
    "                    </label>\n" +
    "                    &nbsp;\n" +
    "                    <label>\n" +
    "                        <input type=\"radio\" value=\"off\" name=\"{{value.name}}\" ng-checked=\"(value.setting == -1)\" ng-click=\"changeSetting(value.name, '-1' )\"> &nbsp; Disable all\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                <label>\n" +
    "                <input type=\"radio\" class=\"pull-left\" name=\"{{value.name}}\" ng-checked=\"(value.setting > 0)\"> \n" +
    "                &nbsp;\n" +
    "                <span ng-if=\"value.name == 'log_min_duration_statement'\">Log statements</span>\n" +
    "                <span ng-if=\"value.name == 'log_autovacuum_min_duration'\">Log autovacuum</span>\n" +
    "                <span ng-if=\"value.name == 'log_temp_files'\">Log temp files</span> \n" +
    "                >=\n" +
    "                </label>\n" +
    "                <span ng-if=\"value.name != 'log_temp_files'\">\n" +
    "                <input ng-model=\"value.setting\" type=\"text\" id=\"{{value.name}}\" ng-blur=\"changeSetting(value.name,value.setting )\" style=\"width: 20%\" > &nbsp;duration milliseconds</span>\n" +
    "                <span ng-if=\"value.name == 'log_temp_files'\">\n" +
    "                    <input ng-model=\"value.setting\" type=\"text\" id=\"{{value.name}}\" ng-blur=\"changeSetting(value.name, value.setting )\" style=\"width: 15%\"> &nbsp;size KB\n" +
    "                </span>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        <tr ng-repeat=\"(key, value) in data \" ng-if=\"$index > 2\">\n" +
    "            <td><h4 style=\"font-weight: bold;\">{{value.name}}</h4></td>\n" +
    "            <td>\n" +
    "                <div>\n" +
    "                    <label> \n" +
    "                        <input type=\"radio\" value=\"on\" name=\"{{value.name}}\" ng-checked=\"(value.setting == 'on')\" ng-click=\"changeSetting(value.name, 'on' )\">&nbsp; Enable all\n" +
    "                    </label>\n" +
    "                    &nbsp;\n" +
    "                    <label>\n" +
    "                        <input type=\"radio\" value=\"off\" name=\"{{value.name}}\" ng-checked=\"(value.setting == 'off')\" ng-click=\"changeSetting(value.name, 'off' )\"> &nbsp; Disable all\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </td>     \n" +
    "        </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"save(changedVales, comp)\">Save & Reload</button>\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>")

$templateCache.put("../app/components/partials/pgInitialize.html","<div class=\"modal-header\">\n" +
    "    <h2 class=\"modal-title\" id=\"updateModalLabel\">Setup {{comp}}</h2>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "	Please provide a password for the superuser (postgres) database user\n" +
    "	<br>\n" +
    "	<br>\n" +
    "	<form class=\"form-horizontal\" name=\"initForm\">\n" +
    "	  <div class=\"form-group\">\n" +
    "	    <label for=\"password\" class=\"col-sm-4 control-label\">Password</label>\n" +
    "	    <div class=\"col-sm-6\">\n" +
    "	      <input type=\"password\"  class=\"form-control\" id=\"password\" name=\"password\" ng-model=\"formData.password\" required />\n" +
    "	    </div>\n" +
    "	  </div>\n" +
    "	  <div class=\"form-group\">\n" +
    "	    <label for=\"password_c\" class=\"col-sm-4 control-label\">Retype Password</label>\n" +
    "	    <div class=\"col-sm-6\">\n" +
    "	      <input type=\"password\" class=\"form-control\" id=\"password_c\" name=\"password_c\" ng-model=\"formData.password_c\" valid-password-c required  />\n" +
    "	      <span ng-show=\"!initForm.password_c.$error.required && initForm.password_c.$error.noMatch && initForm.password.$dirty\">Passwords do not match.</span>\n" +
    "	    </div>\n" +
    "	  </div>\n" +
    "	  <div class=\"form-group\">\n" +
    "	  	<label for=\"dataDir\" class=\"col-sm-4 control-label\">Data Directory</label>\n" +
    "	  	<div class=\"col-sm-6\">\n" +
    "	  		<input type=\"text\" class=\"form-control\" name=\"dataDir\" ng-disabled=\"true\" ng-model=\"dataDir\" value=\"{{dataDir}}\" />\n" +
    "	  	</div>\n" +
    "	  </div>\n" +
    "	  <div class=\"form-group\">\n" +
    "	  		<label for=\"portNumber\" class=\"col-sm-4 control-label\">Port Number</label>\n" +
    "	  		<div class=\"col-sm-6\">\n" +
    "	  			<input type=\"text\" class=\"form-control\" id=\"portNumber\" name=\"portNumber\" ng-model=\"portNumber\" value=\"{{initForm.portNumber.$viewValue}}\" valid-port />\n" +
    "	  			<span ng-show=\"!!initForm.portNumber.$error.invalidLen\">Port must be between 1000 and 9999.</span>\n" +
    "	  		</div>\n" +
    "	  </div>\n" +
    "	  <div class=\"form-group\">\n" +
    "	  		<label for=\"autoStart\" class=\"col-sm-4 control-label\">Auto Start</label>\n" +
    "	  		<div class=\"col-sm-6 autostart-input\">\n" +
    "	  			<input type=\"checkbox\" ng-model=\"autostart\" ng-disabled=\"autostartDisable\" ng-change=\"autostartChange(autostart)\" />\n" +
    "	  		</div>\n" +
    "	  </div>\n" +
    "	  <div class=\"form-group\">\n" +
    "	    <div class=\"col-sm-offset-8 col-sm-10\">\n" +
    "	    	<button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "			<button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"!(initForm.password.$valid && initForm.password.$viewValue == initForm.password_c.$viewValue)\" ng-click=\"init() \">Start</button>\n" +
    "	    </div>\n" +
    "	  </div>\n" +
    "	</form>\n" +
    "</div>")

$templateCache.put("../app/components/partials/profiler.html","<section class=\"content-header\">\n" +
    "    <h1 class=\"components-update-title-wrapper\">\n" +
    "        plProfiler Console\n" +
    "    </h1>\n" +
    "</section>\n" +
    "\n" +
    "<section class=\"content\">\n" +
    "    <div class=\"row\">\n" +
    "    <div class=\"col-md-3 col-sm-6 col-xs-12\">\n" +
    "        <div class=\"box\">\n" +
    "            <div class=\"box-header with-border\">\n" +
    "                <strong>Connection Information</strong>\n" +
    "            </div>\n" +
    "            <div class=\"box-body\">\n" +
    "                <form class=\"form plProfiler-form\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" ng-model=\"hostName\" required class=\"form-control\" placeholder=\"Hostname\">\n" +
    "                        <span class=\"required-plprofiler-form\">*</span>\n" +
    "                    </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" ng-model=\"pgUser\" required class=\"form-control\" placeholder=\"DB User\">\n" +
    "                        <span class=\"required-plprofiler-form\">*</span>\n" +
    "                    </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"password\" ng-model=\"pgPass\" class=\"form-control\" placeholder=\"DB Password\">\n" +
    "                    </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" ng-model=\"pgDB\" required class=\"form-control\" placeholder=\"DB Name\">\n" +
    "                        <span class=\"required-plprofiler-form\">*</span>\n" +
    "                    </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" ng-model=\"pgPort\" required class=\"form-control\" placeholder=\"DB Port\">\n" +
    "                        <span class=\"required-plprofiler-form\">*</span>\n" +
    "                    </div>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "                <div class=\"text-left col-md-12\">\n" +
    "                   <span class=\"required-symbol\">*</span> Required Field\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <button class=\"btn btn-default pull-left\" ng-disabled=\"!(hostName && pgUser && pgDB && pgPort)\" ng-click=\"queryProfiler(hostName, pgUser, pgPass, pgDB, pgPort, pgTitle, pgDesc)\"> Statement Profiling </button>\n" +
    "        <button class=\"btn btn-default pull-right\" ng-disabled=\"!(hostName && pgUser && pgDB && pgPort)\" ng-click=\"globalProfiling(hostName, pgUser, pgPass, pgDB, pgPort, pgTitle, pgDesc)\"> Global Profiling </button>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-9 col-sm-6 col-xs-12\">\n" +
    "        <div ng-if=\"generatingReportSpinner\">\n" +
    "            <span>\n" +
    "                <i class=\"fa fa-cog fa-spin fa-3x fa-fw margin-bottom\"></i>Generating...\n" +
    "            </span>\n" +
    "        </div>\n" +
    "        <span ng-if=\"report_file\"><a href=\"/reports/{{ report_file }}\" target=\"_blank\">Click here to see the report in new tab</a>\n" +
    "        </span>\n" +
    "        <a class=\"btn btn-default pull-right\" ng-click=\"openRecentReports()\">\n" +
    "                            Recent Reports\n" +
    "                            </a>\n" +
    "        <iframe ng-if=\"report_file\" ng-src=\"{{ report_url }}\" width=\"100%\" height=\"500px\">\n" +
    "        </iframe>\n" +
    "        <span ng-if=\"!report_file\" ng-bind=\"errorMsg\"></span>\n" +
    "    </div>\n" +
    " </div>\n" +
    "</section>")

$templateCache.put("../app/components/partials/recentReports.html","<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">Recent Reports</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <div ng-if=\"!showError\">\n" +
    "            <span><label>Report</label></span>\n" +
    "            <span class=\"pull-right\"><label>Created on</label></span>\n" +
    "            <div ng-repeat=\"c in files_list\">\n" +
    "                <label>\n" +
    "                    <input type=\"checkbox\" name=\"report_file\" ng-model=\"c.selected\" value=\"{{ c.file_link }}\">\n" +
    "                    <span>&nbsp;{{ c.file }}</span>\n" +
    "                </label>&nbsp;&nbsp;<a target=\"_blank\" href=\"{{ c.file_link }}\"><i class=\"fa fa-external-link\"></i></a>\n" +
    "                <span class=\"pull-right\">{{ c.mtime }}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"showError\">\n" +
    "            You haven't generate any reports yet.\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default pull-left\" ng-click=\"removeFiles(files_list, true)\" ng-if=\"!showError\">Delete all</button>&nbsp;\n" +
    "    <button class=\"btn btn-default pull-left\" ng-click=\"removeFiles(files_list, false)\" ng-if=\"!showError\">Delete</button>\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-disabled=\"switchBtn\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>")

$templateCache.put("../app/components/partials/settings.html","<script type=\"text/ng-template\" id=\"alert.html\">\n" +
    "    <div class=\"alert\" style=\"background-color:#fa39c3;color:white;\" role=\"alert\">\n" +
    "        <div ng-transclude></div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "<uib-alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" dismiss-on-timeout=\"8000\" close=\"closeAlert($index)\" class=\"uib-text\">{{alert.msg}}</uib-alert>\n" +
    "<section class=\"content-header\">\n" +
    "     <server-info-details title=\"Settings\"></server-info-details>\n" +
    "    <div id=\"pgcInfoText\" class=\"pull-left\"></div>\n" +
    "</section>\n" +
    "<section class=\"content\">\n" +
    "    <div class=\"box\">\n" +
    "        <div class=\"box-header with-border\">\n" +
    "            <h4><strong> Check for updates </strong></h4>\n" +
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
    "            <h4><strong> PGC Server Info </strong></h4></div>\n" +
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
    "                                <h5><strong>PGC:</strong></h5></td>\n" +
    "                            <td>\n" +
    "                                <p>{{pgcInfo.version}}</p>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <h5><strong>User &amp; Host:</strong></h5></td>\n" +
    "                            <td>\n" +
    "                                <p>{{pgcInfo.user}} &nbsp; {{pgcInfo.host}} </p>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <h5><strong>OS:</strong></h5></td>\n" +
    "                            <td>\n" +
    "                                <p>{{pgcInfo.os}}</p>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <h5><strong>Hardware:</strong></h5></td>\n" +
    "                            <td>\n" +
    "                                <p>{{pgcInfo.mem}} GB, {{pgcInfo.cpu}}</p>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td>\n" +
    "                                <h5><strong>Repo URL:</strong></h5></td>\n" +
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

$templateCache.put("../app/components/partials/statementProfilingModal.html","<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">Statement Profiling</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<form class=\"form plProfiler-form\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <textarea ng-model=\"pgQuery\" class=\"form-control\" placeholder=\"select statement_to_profile(param_1, param_2)\"></textarea>\n" +
    "        <span class=\"required-plprofiler-form\">*</span>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"text\" ng-model=\"pgTitle\" required class=\"form-control\" placeholder=\"Report Title (Optional)\">\n" +
    "    </div>\n" +
    "     <div class=\"form-group\">\n" +
    "        <input type=\"text\" ng-model=\"pgDesc\" class=\"form-control\" placeholder=\"Report Desc (Optional)\">\n" +
    "    </div>\n" +
    "</form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "    <button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"!pgQuery\" ng-click=\"generateReport()\">Execute</button>\n" +
    "</div>")

$templateCache.put("../app/components/partials/status.html","<section class=\"content-header\">\n" +
    "    <server-info-details title=\"Server Status\"></server-info-details>\n" +
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
    "                            <tr ng-repeat=\"comp in comps\" ng-if=\"comp.component != 'devops'\">\n" +
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
    "                                    <a class=\"btn btn-default\" ng-show=\"comp.state =='Not Initialized' \" ng-click=\"openInitPopup(comp.component)\">Initialize</a>\n" +
    "                                    <a class=\"btn btn-default\" id=\"install\" ng-show=\"comp.state =='Stopped'\" ng-disabled=\" comp.showingSpinner != undefined\">Start</a>\n" +
    "                                    <div class=\"btn-group\" uib-dropdown ng-show=\"comp.state =='Running'\" >\n" +
    "                                        <button id=\"split-button\" type=\"button\" class=\"btn btn-default\" ng-disabled=\"{{comp.component=='devops'}}\">Action</button>\n" +
    "                                        <button type=\"button\" class=\"btn btn-default\" uib-dropdown-toggle ng-disabled=\"{{comp.component=='devops'}}\">\n" +
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

$templateCache.put("../app/components/partials/switchLogfile.html","<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">Switch log file</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <form class=\"form-horizontal\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <label class=\"col-sm-4 control-label\">Current log file :</label>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "            {{currentLogfile}}\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"password_c\" class=\"col-sm-4 control-label\">New log file name :</label>\n" +
    "        <div class=\"col-sm-5\">\n" +
    "          <input type=\"text\" class=\"form-control\" ng-model=\"logFile\" required />\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-3\">\n" +
    "            <button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"logAction\" ng-model=\"switchBtn\" ng-click=\"switchFile(logFile)\">Switch</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div ng-if=\"logAction\" style=\"text-align: center;\"> \n" +
    "        <i class=\"fa fa-pulse fa-3x fa-fw fa-spinner\"></i>Switching log file...\n" +
    "    </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-success pull-left\" ng-disabled=\"logAction\" type=\"button\" ng-click=\"switchFile('')\">Reset to default</button>\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-disabled=\"switchBtn\" ng-click=\"cancel()\">Close</button> \n" +
    "</div>")

$templateCache.put("../app/components/partials/topModal.html","<div class=\"modal-header\">\n" +
    "    <h2 class=\"modal-title\" id=\"updateModalLabel\"> Top ({{ host }}) </h2>\n" +
    "</div>\n" +
    "<div ng-click=\"cancel()\" class=\"close-modal\" data-dismiss=\"modal\" aria-hidden=\"true\">\n" +
    "    <div class=\"lr\">\n" +
    "        <div class=\"rl\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<uib-alert ng-repeat=\"alert in alerts\" type=\"{{ alert.type }}\" dismiss-on-timeout=\"8000\" close=\"closeAlert()\"\n" +
    "           class=\"uib-text\">{{ alert.msg }}</uib-alert>\n" +
    "\n" +
    "<div class=\"container-fluid\" ng-show=\"loadingSpinner\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12 col-xs-12\">\n" +
    "            <div class=\"well\">\n" +
    "                <i class=\"fa fa-spinner fa-2x  fa-pulse\"></i>&#160;&#160;&#160;Checking for Top Process..\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "    <div class=\"container-fluid\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h5>\n" +
    "                    <strong> OS </strong> : {{ hostinfo.os }} &nbsp;\n" +
    "                    <strong>HW </strong>: {{ hostinfo.mem }} GB, {{ hostinfo.cores }} x {{ hostinfo.cpu }} &nbsp;\n" +
    "                    <strong>PGC</strong> : {{ hostinfo.version }}\n" +
    "                </h5>\n" +
    "\n" +
    "                <h5 ng-if=\"topProcess.cpu_user\">\n" +
    "                    <strong> CPU Usage </strong>: {{ topProcess.cpu_user }} %user &nbsp; {{ topProcess.cpu_system }} %sys &nbsp;\n" +
    "                    {{ topProcess.cpu_idle }} %idle &nbsp; <span ng-if=\"topProcess.iowait\">{{ topProcess.iowait }} %wait &nbsp;</span>\n" +
    "                </h5>\n" +
    "                <h5>\n" +
    "                    <strong>DISK </strong>: kB_read {{ topProcess.kb_read_sec }}/sec &nbsp; ,\n" +
    "                    kB_written {{ topProcess.kb_write_sec }}/sec &nbsp;\n" +
    "                </h5>\n" +
    "                <h5 ng-if=\"topProcess.load_avg\"><strong>Load Average </strong>: {{ topProcess.load_avg }} &nbsp;\n" +
    "                    <strong>Uptime </strong>: {{ topProcess.uptime }} &nbsp;\n" +
    "                </h5>\n" +
    "\n" +
    "                <table class=\"table table-condensed table-bordered\">\n" +
    "                    <thead>\n" +
    "                        <tr>\n" +
    "                            <th class=\"col-md-1\">PID</th>\n" +
    "                            <th class=\"col-md-1\">User</th>\n" +
    "                            <th class=\"col-md-1\">%CPU</th>\n" +
    "                            <th class=\"col-md-1\">%MEM</th>\n" +
    "                            <th class=\"col-md-2\">TIME+</th>\n" +
    "                            <th class=\"col-md-6\">COMMAND</th>\n" +
    "                        </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                        <tr ng-repeat=\"(key, value) in topProcess.top\">\n" +
    "                            <td class=\"col-md-1\">{{ value.pid }}</td>\n" +
    "                            <td class=\"col-md-1\">{{ value.username }}</td>\n" +
    "                            <td class=\"col-md-1\">{{ value.cpu_percent }}</td>\n" +
    "                            <td class=\"col-md-1\">{{ value.memory_percent }}</td>\n" +
    "                            <td class=\"col-md-2\">{{ value.ctime }}</td>\n" +
    "                            <td class=\"col-md-6\">{{ value.name }}</td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-danger\" type=\"button\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>")

$templateCache.put("../app/components/partials/updateModal.html","<div class=\"updateModal\">\n" +
    "<div class=\"modal-header\">\n" +
    "    <form class=\"form-inline\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <h2 class=\"col-sm-6 modal-title control-label\">Updates</h2>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "            <select class=\"form-control\" ng-change=\"hostChange(selecthost)\" ng-model=\"selecthost\">\n" +
    "                <option ng-repeat=\"host in hosts\" value=\"{{ host.host }}\">{{ host.host }}</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      </form>\n" +
    "</div>\n" +
    "<div ng-click=\"cancel()\" class=\"close-modal\" data-dismiss=\"modal\" aria-hidden=\"true\">\n" +
    "    <div class=\"lr\">\n" +
    "        <div class=\"rl\">\n" +
    "        </div>\n" +
    "    </div>\n" +
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
    "                <div class=\"col-md-4 col-xs-4\"><strong>Component</strong></div>\n" +
    "                <div class=\"col-md-5 col-xs-5\"><strong>Description</strong></div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 col-xs-12\" id=\"updatesTableTbody \" ng-repeat=\"(key, value) in components\" ng-if=\"value.updates>0 && value.component != 'bam2'\">\n" +
    "                <div class=\"component_box\" id=\"{{value.component}}\">\n" +
    "                    <div class=\"col-md-2 col-xs-2\">\n" +
    "                        <input type=\"checkbox\" ng-model=\"value.selected\" ng-checked=\"selectedComp.component == value.component\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4 col-xs-4\">\n" +
    "                        <a ng-if=\"value.category != 1\" ui-sref=\"components.detailsView({component:value.component}) \" ng-click=\"cancel()\">\n" +
    "                                    {{value.component}}\n" +
    "                                </a>\n" +
    "                        <a ng-if=\"value.category == 1\" ui-sref=\"components.detailspg95({component:value.component}) \" ng-click=\"cancel()\">\n" +
    "                                    {{value.component}}\n" +
    "                                </a>\n" +
    "\n" +
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
    "        <div class=\"row components-update-msg\" ng-show=\"noUpdates\">\n" +
    "        <div class=\"well\">\n" +
    "            <p class=\"lead\">All installed components are up-to-date. </p>\n" +
    "        </div>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-primary\" type=\"button\" ng-click=\"selectedUpdate()\" ng-hide=\"noUpdates\">Update</button>\n" +
    "        </div>\n" +
    "        <div class=\"row\" ng-hide=\"hideLatestInstalled\">\n" +
    "            <uib-accordion>\n" +
    "                <uib-accordion-group is-open=\"uibStatus.newComponents\">\n" +
    "                  <uib-accordion-heading>\n" +
    "                    <span> Components installed/updated in last 30 days\n" +
    "                    <i class=\"pull-right glyphicon\" ng-class=\"{'fa fa-plus': !uibStatus.newComponents, 'fa fa-minus': uibStatus.newComponents}\"></i>\n" +
    "                    </span> \n" +
    "                  </uib-accordion-heading>\n" +
    "            \n" +
    "                <div class=\"box-body update-modal-table-header\">\n" +
    "                    <div class=\"col-md-4 col-xs-4\"><strong>Installed/Updated Date</strong></div>\n" +
    "                    <div class=\"col-md-4 col-xs-4\"><strong>Component Type</strong></div>\n" +
    "                    <div class=\"col-md-4 col-xs-4\"><strong>Component</strong></div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12 col-xs-12 update-modal-table\" id=\"updatesTableTbody \" ng-repeat=\" value in components | toArray:false | orderBy : 'install_date' : true\" ng-if=\"value.is_updated == 1  && value.component != 'bam2' \">\n" +
    "                    <div class=\"component_box\" id=\"{{value.component}}\">\n" +
    "                        <div class=\"col-md-4 col-xs-4\">\n" +
    "                            <span>{{value.install_date}}</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4 col-xs-4\">\n" +
    "                            <span>{{value.category_desc}}</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4 col-xs-4\">\n" +
    "                            <a ng-if=\"value.category != 1\" ui-sref=\"components.detailsView({component:value.component}) \" ng-click=\"cancel()\">\n" +
    "                                {{value.component}}-{{value.version}}\n" +
    "                            </a>\n" +
    "                            <a ng-if=\"value.category == 1\" ui-sref=\"components.detailspg95({component:value.component}) \" ng-click=\"cancel()\">\n" +
    "                                {{value.component}}-{{value.version}}\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                </uib-accordion-group>    \n" +
    "            </uib-accordion>\n" +
    "\n" +
    "        </div>\n" +
    "        <div class=\"row components-update-msg\" ng-hide=\"!hideLatestInstalled\">\n" +
    "        <div class=\"well\">\n" +
    "            <p class=\"lead\">No components installed/updated in the last 30 days </p>\n" +
    "        </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\" ng-if=\"hideNewComponents\">\n" +
    "            <uib-accordion>\n" +
    "                <uib-accordion-group is-open=\"uibStatus.installedComponents\">\n" +
    "                  <uib-accordion-heading>\n" +
    "                    <span> New components released in the last 30 days \n" +
    "                    <i class=\"pull-right glyphicon\" ng-class=\"{'fa fa-plus': !uibStatus.installedComponents, 'fa fa-minus': uibStatus.installedComponents}\"></i>\n" +
    "                    </span> \n" +
    "                  </uib-accordion-heading>\n" +
    "                    <div class=\"box-body update-modal-table-header\">\n" +
    "                        <div class=\"col-md-4 col-xs-4\"><strong>Release Date</strong></div>\n" +
    "                        <div class=\"col-md-4 col-xs-4\"><strong>Component Type</strong></div>\n" +
    "                        <div class=\"col-md-4 col-xs-4\"><strong>Component</strong></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 col-xs-12 update-modal-table\" id=\"updatesTableTbody \" ng-repeat=\"(key, value) in components | toArray:false | orderBy : 'release_date' : true\" ng-if=\"value.is_new == 1 && value.component != 'bam2' \">\n" +
    "                        <div class=\"component_box\" id=\"{{value.component}}\">\n" +
    "                            <div class=\"col-md-4 col-xs-4\">\n" +
    "                                <span>{{value.release_date}}</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-4 col-xs-4\">\n" +
    "                                <span>{{value.category_desc}}</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-4 col-xs-4\">\n" +
    "                                <a ng-if=\"value.category != 1\" ui-sref=\"components.detailsView({component:value.component}) \" ng-click=\"cancel()\">\n" +
    "                                    {{value.component}}-{{value.version}}\n" +
    "                                </a> \n" +
    "                                <a ng-if=\"value.category == 1\" ui-sref=\"components.detailspg95({component:value.component}) \" ng-click=\"cancel()\">\n" +
    "                                {{value.component}}-{{value.version}}\n" +
    "                                </a>                   \n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </uib-accordion-group>    \n" +
    "             </uib-accordion>\n" +
    "\n" +
    "        <!-- /.box -->\n" +
    "        <!-- /.box -->\n" +
    "    </div>\n" +
    "    <div class=\"row components-update-msg\" ng-if=\"!hideNewComponents\">\n" +
    "        <div class=\"well\">\n" +
    "            <p class=\"lead\">No new components released in the last 30 days </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>\n" +
    "</div>")

$templateCache.put("../app/components/partials/userForm.html","<form class=\"form\" name=\"userForm\">\n" +
    "    <div class=\"col-md-1\">\n" +
    "        <button class=\"btn btn-default\" ng-model=\"value.id\" ng-disabled=\"value.id == 1\" ng-click=\"deleteUser(value.id)\"> \n" +
    "            <i class=\"fa fa-trash\"></i>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input type=\"email\" ng-disabled=\"!value.new\" ng-model=\"value.email\" name=\"email\" class=\"form-control\" ng-model=\"main.email\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n" +
    "            <span ng-show = \"userForm.email.$error.email\"> Invalid Email</span>\n" +
    "            <!-- ngMessages goes here -->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <select class=\"form-control form-control-sm\" ng-disabled=\"value.id == 1\" ng-model=\"value.role\" ng-change=\"updateRole()\" ng-options=\"role.id as role.name for (key, role) in roles\" required>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-1\">\n" +
    "        <label>\n" +
    "            <input type=\"checkbox\" ng-model=\"value.active\" ng-disabled=\"value.id == 1\" ng-change=\"updateActive()\" ng-checked=\"value.active\">\n" +
    "            <span class=\"custom-control-indicator\"></span>\n" +
    "        </label>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" ng-disabled=\"!value.email && value.id != 1\" type=\"password\" id=\"inputPassword\" name=\"password\" ng-model=\"formdata.password\" valid-user-password required />\n" +
    "            <span ng-show=\"!!userForm.password.$error.invalidLen\">Must be 6 characters.</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" ng-disabled=\"!value.email && value.id != 1\" type=\"password\" id=\"password_c\" name=\"password_c\" ng-model=\"formdata.password_c\" confirm-password required/>\n" +
    "        </div>\n" +
    "        <span ng-show=\"!userForm.password_c.$error.required && userForm.password_c.$error.noMatch && userForm.password.$dirty\">Passwords do not match.</span>\n" +
    "    </div>\n" +
    "    <span class=\"form-actions\" ng-show=\"formSave()\">\n" +
    "    </span>\n" +
    "</form>")

$templateCache.put("../app/components/partials/usersModal.html","<div class=\"modal-header\">\n" +
    "    <h2 class=\"modal-title\" id=\"updateModalLabel\"> User Management</h2>\n" +
    "</div>\n" +
    "<div ng-click=\"cancel()\" class=\"close-modal\" data-dismiss=\"modal\" aria-hidden=\"true\">\n" +
    "    <div class=\"lr\">\n" +
    "        <div class=\"rl\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<uib-alert ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" dismiss-on-timeout=\"8000\" close=\"closeAlert()\" class=\"uib-text\">{{alert.msg}}</uib-alert>\n" +
    "\n" +
    "<div class=\"container-fluid\" ng-show=\"loadingSpinner\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12 col-xs-12\">\n" +
    "            <div class=\"well\">\n" +
    "                <i class=\"fa fa-spinner fa-2x  fa-pulse\"></i>&#160;&#160;&#160;Checking for users..\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "            <div class=\"row\">\n" +
    "                <span class=\"pull-right\" ng-click=\"addAuserForm()\">\n" +
    "                    <i class=\"fa fa-user-plus\" aria-hidden=\"true\"></i>  \n" +
    "                    <strong>Add User</strong> &nbsp;&nbsp;\n" +
    "                </span>     \n" +
    "            </div>\n" +
    "            <br />\n" +
    "            <div class=\"row\" >\n" +
    "                <div class=\"col-md-1 col-xs-1\"><strong></strong></div>\n" +
    "                <div class=\"col-md-4 col-xs-4\"><strong>Email</strong></div>\n" +
    "                <div class=\"col-md-2 col-xs-2\"><strong>Role</strong></div>\n" +
    "                <div class=\"col-md-1 col-xs-1\"><strong>Active</strong></div>\n" +
    "                <div class=\"col-md-2 col-xs-2\"><strong>New Password</strong></div>\n" +
    "                <div class=\"col-md-2 col-xs-2\"><strong>Confirm Password</strong></div>\n" +
    "            </div>\n" +
    "            <div class=\"row\" id=\"updatesTableTbody \" ng-repeat=\"(key, value) in users\">\n" +
    "                \n" +
    "                <user-details-row roles=\"roles\" value=\"value\"></user-details-row> \n" +
    "                \n" +
    "            </div>\n" +
    "\n" +
    "        <!-- /.box -->\n" +
    "        <!-- /.box -->\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-danger\" type=\"button\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>")

$templateCache.put("../app/components/partials/view.html","<section class=\"content-header\">\n" +
    "    <server-info-details title=\"Components\"></server-info-details>\n" +
    "    <div class=\"components-update-button-wrapper\">\n" +
    "        <label>\n" +
    "            <input type=\"checkbox\" ng-model=\"isList\" ng-click=\"setTest()\">&nbsp; Show test components</input>\n" +
    "        </label>\n" +
    "        &nbsp;\n" +
    "        &nbsp;\n" +
    "        <label>\n" +
    "            <input type=\"checkbox\" ng-model=\"showInstalled\" ng-disabled=\"disableShowInstalled\" ng-click=\"installedComps()\"></input> Show installed only\n" +
    "        </label>\n" +
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
    "    <div class=\"masonry\" ng-if=\"!loading && !retry\">\n" +
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
    "                            <div ng-if=\"c.component != 'devops'\" class= \"row component_box\">\n" +
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
    "                                    <a class=\"btn btn-default\" ng-click=\"compAction( 'remove', c.component) \" id=\"install\" ng-if=\"c.status == 'Installed' && c.updates == 0 \" ng-disabled=\" c.removing != undefined\">Remove</a>\n" +
    "                                    <div class=\"btn-group \" uib-dropdown id=\"install\" ng-if=\"c.status == 'NotInitialized'\">\n" +
    "                                    <button id=\"split-button \" type=\"button\" ng-click=\"openInitPopup(c.component)\" ng-disabled=\"c.init != undefined || c.removing != undefined\" class=\"btn btn-default \">Initialize</button>\n" +
    "                                        <button type=\"button \" class=\"btn btn-default \" uib-dropdown-toggle ng-disabled=\"c.init != undefined || c.removing != undefined\">\n" +
    "                                            <span class=\"caret \"></span>\n" +
    "                                            <span class=\"sr-only \">Split button!</span>\n" +
    "                                        </button>\n" +
    "                                        <ul uib-dropdown-menu role=\"menu \" aria-labelledby=\"split-button \">\n" +
    "                                            <li ng-if=\"c.updates > 0\" role=\"menuitem \"><a  ng-click=\"compAction( 'update', c.component) \" href=\"\" ng-hide=\"{{c.component=='devops'}}\">Update</a></li>\n" +
    "                                            <li role=\"menuitem \"><a ng-click=\"compAction( 'remove', c.component) \" href=\"\" ng-hide=\"{{c.component=='devops'}}\">Remove</a></li>\n" +
    "                                        </ul>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"btn-group\" uib-dropdown ng-if=\"c.updates > 0 && c.status != 'NotInitialized'\">\n" +
    "                                            <button id=\"split-button \" type=\"button \" class=\"btn btn-default\" ng-click=\"compAction( 'update', c.component) \" ng-disabled=\"c.installation != undefined || c.removing != undefined\">Update</button>\n" +
    "                                            <button type=\"button \" class=\"btn btn-default\" uib-dropdown-toggle ng-disabled=\"c.installation != undefined || c.removing != undefined\">\n" +
    "                                                <span class=\"caret \"></span>\n" +
    "                                                <span class=\"sr-only \">Split button!</span>\n" +
    "                                            </button>\n" +
    "                                            <ul uib-dropdown-menu role=\"menu \" aria-labelledby=\"split-button \">\n" +
    "                                                <li role=\"menuitem \"><a ng-click=\"compAction( 'remove', c.component) \" href=\"\">Remove</a></li>\n" +
    "                                            </ul>\n" +
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

$templateCache.put("../app/components/partials/whatsNew.html","<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">What's New</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <span ng-bind-html=\"whatsNewText\"></span>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>")

$templateCache.put("../app/menus/partials/bamHeaderUpdate.html","<div ng-show=\"bamUpdate\">\n" +
    "    <div class=\"bamUpdateVisor\">\n" +
    "    	<span>An update to the BigSQL Ops Manager is available. Click the button to continue </span><button class=\"btn btn-default\" ng-click=\"open()\">Update</button>\n" +
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
    "                <a href=\"/\">\n" +
    "                    <i class=\"fa fa-home\"></i> <span>Home</span>\n" +
    "                    <!-- <i class=\"fa fa-angle-left pull-right\"></i> -->\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ui-sref=\"components.hosts\">\n" +
    "                    <i class=\"fa fa-cloud\"></i> <span>Hosts</span>\n" +
    "                    <!-- <i class=\"fa fa-angle-left pull-right\"></i> -->\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ui-sref=\"components.view\">\n" +
    "                    <i class=\"fa fa-th\"></i> <span>Components</span>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <!--<li>\n" +
    "                <a ui-sref=\"components.status\">\n" +
    "                    <i class=\"fa fa-dashboard\"></i> <span>Server Status</span>\n" +
    "                </a>\n" +
    "            </li> -->\n" +
    "            <!--<li>\n" +
    "                <a ui-sref=\"components.componentLog({component:'pgcli'})\">\n" +
    "                    <i class=\"fa fa-file-text-o\"></i> <span>Log Tailer</span>\n" +
    "                </a>\n" +
    "            </li>-->\n" +
    "            <li>\n" +
    "                <a ui-sref=\"components.badger\">\n" +
    "                    <i class=\"bgs bgs-sm bgs-pgbadger-menu\">&nbsp;&nbsp;&nbsp;&nbsp;</i> <span>pgBadger</span>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ui-sref=\"components.profiler\">\n" +
    "                    <i class=\"bgs bgs-sm bgs-plprofiler-menu\">&nbsp;&nbsp;&nbsp;&nbsp;</i> <span>plProfiler</span>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <!-- <li>\n" +
    "                <a href=\"/admin\">\n" +
    "                    <i class=\"fa fa-paw\"></i> <span>Dev Manager </span>\n" +
    "                </a>\n" +
    "            </li> -->\n" +
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
    "    <div class=\"btn-group pull-left hamburger-menu\" uib-dropdown>\n" +
    "        <a class=\"btn btn-dropdown sidebar-toggle\" uib-dropdown-toggle>\n" +
    "            <span class=\"icon-bar\"></span>\n" +
    "            <span class=\"icon-bar\"></span>\n" +
    "            <span class=\"icon-bar\"></span>        \n" +
    "        </a>\n" +
    "        <ul uib-dropdown-menu role=\"menu\" style=\"margin-top: 0px\" \n" +
    "            aria-labelledby=\"btn-append-to-single-button\" >\n" +
    "            <li role=\"menuitem\"><a href=\"/admin\">pgAdmin4</a></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <!-- Logo -->\n" +
    "    <!-- <a href=\"/\" class=\"logo\"> -->\n" +
    "        <!-- mini logo for sidebar mini 50x50 pixels -->\n" +
    "        <!-- <span class=\"logo-mini\"></span> -->\n" +
    "        <!-- logo for regular state and mobile devices -->\n" +
    "        <!-- <span class=\"logo-lg\"></span> -->\n" +
    "    <!-- </a> -->\n" +
    "    <!-- Header Navbar: style can be found in header.less -->\n" +
    "    <nav class=\"navbar navbar-static-top\" role=\"navigation\">\n" +
    "        <!-- Sidebar toggle button-->\n" +
    "        <!--  <a href=\"#\" class=\"sidebar-toggle\" data-toggle=\"offcanvas\" role=\"button\">\n" +
    "                    <span class=\"sr-only\">Toggle navigation</span>\n" +
    "                </a> -->\n" +
    "        <!-- Navbar Right Menu -->\n" +
    "        <a href=\"/\" class=\"logo\"></a>\n" +
    "        <h1 id=\"pgc-logo\">DevOps by BigSQL</h1>\n" +
    "\n" +
    "        <div class=\"navbar-custom-menu\">\n" +
    "            <ul class=\"nav navbar-nav\">\n" +
    "                <!-- Notifications: style can be found in dropdown.less -->\n" +
    "                <li>\n" +
    "\n" +
    "                </li>\n" +
    "                <li ng-click=\"open()\" id=\"updatesAvailable\" ng-if=\"updates\">\n" +
    "                    <a href=\"\">\n" +
    "                        <div>\n" +
    "                            <small class=\"label bg-orange\"><i class=\"fa fa-arrow-circle-down\"></i> {{ updates }} Updates\n" +
    "                                Available\n" +
    "                            </small>\n" +
    "                        </div>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <div class=\"btn-group userinfo-btn\" uib-dropdown>\n" +
    "\n" +
    "                        <button id=\"btn-append-to-single-button\" type=\"button\" class=\"btn btn-dropdown\"\n" +
    "                                uib-dropdown-toggle>\n" +
    "                            <img\n" +
    "                            src=\"{{ userInfo.gravatarImage }}\" width=\"18\" height=\"18\"\n" +
    "                            alt=\"Gravatar image for {{ userInfo.email }}\">\n" +
    "                            {{ userInfo.email }} <span class=\"caret\"></span>\n" +
    "                        </button>\n" +
    "                        <ul class=\"dropdown-menu\" uib-dropdown-menu role=\"menu\"\n" +
    "                            aria-labelledby=\"btn-append-to-single-button\">\n" +
    "                            <li role=\"menuitem\"><a href=\"/change\">Change Password</a></li>\n" +
    "                            <li role=\"menuitem\" ng-if=\"userInfo.isAdmin\" ng-click=\"usersPopup('lg')\">\n" +
    "                                <a href=\"\">Users</a>\n" +
    "                            </li>\n" +
    "                            <li role=\"menuitem\"><a href=\"/logout\">Logout</a></li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                    <!--<div id=\"pgcHost\">\n" +
    "                        {{userInfo.email}}\n" +
    "                    </div>-->\n" +
    "                </li>\n" +
    "                <!--<li>\n" +
    "                    <a class=\"feedback-link\" target=\"_blank\" href=\"https://www.bigsql.org/feedback/index.jsp\"\n" +
    "                       tooltip-placement=\"bottom-right\" uib-tooltip=\"Give Your Feedback\">\n" +
    "                        <i class=\"fa fa-comments-o\" aria-hidden=\"true\"></i>\n" +
    "                    </a>\n" +
    "                </li>-->\n" +
    "                <!-- Control Sidebar Toggle Button -->\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "</header>")
}]);
})();