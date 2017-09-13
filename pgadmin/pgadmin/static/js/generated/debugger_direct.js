define(["translations","pgadmin.browser.endpoints","pgadmin.browser.utils","pgadmin.browser.messages"], function(__WEBPACK_EXTERNAL_MODULE_44__, __WEBPACK_EXTERNAL_MODULE_45__, __WEBPACK_EXTERNAL_MODULE_77__, __WEBPACK_EXTERNAL_MODULE_96__) { return webpackJsonp([2,3],{

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

//////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, _, S) {

  var check_node_visibility = function check_node_visibility(pgBrowser, node_type) {
    if (_.isUndefined(node_type) || _.isNull(node_type)) {
      return true;
    }

    // Target actual node instead of collection.
    // If node is disabled then there is no meaning of
    // adding collection node menu
    if (S.startsWith(node_type, "coll-")) {
      node_type = node_type.replace("coll-", "");
    }

    // Exclude non-applicable nodes
    var nodes_not_supported = ["server_group", "server", "catalog_object_column"];
    if (_.indexOf(nodes_not_supported, node_type) >= 0) {
      return true;
    }

    var preference = pgBrowser.get_preference("browser", 'show_node_' + node_type);

    if (preference) {
      return preference.value;
    } else {
      return true;
    }
  };

  return check_node_visibility;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(5), __webpack_require__(0), __webpack_require__(1), __webpack_require__(4), __webpack_require__(17), __webpack_require__(3), __webpack_require__(6), __webpack_require__(10), __webpack_require__(13), __webpack_require__(29), __webpack_require__(16), __webpack_require__(98), __webpack_require__(30), __webpack_require__(24), __webpack_require__(28)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, url_for, $, _, S, Alertify, pgAdmin, pgBrowser, Backbone, Backgrid, codemirror, Backform, debug_function_again) {

  var CodeMirror = codemirror.default;
  if (pgAdmin.Browser.tree != null) {
    pgAdmin = pgAdmin || window.pgAdmin || {};
  }

  var pgTools = pgAdmin.Tools = pgAdmin.Tools || {};

  if (pgTools.DirectDebug) return pgTools.DirectDebug;

  var controller = new function () {}();

  _.extend(controller, Backbone.Events, {
    enable: function enable(btn, _enable) {
      // trigger the event and change the button view to enable/disable the buttons for debugging
      this.trigger('pgDebugger:button:state:' + btn, _enable);
    },

    /*
      Function to set the breakpoint and send the line no. which is set to server
      trans_id :- Unique Transaction ID, line_no - line no. to set the breakpoint, set_type = 0 - clear , 1 - set
    */
    set_breakpoint: function set_breakpoint(trans_id, line_no, set_type) {
      var self = this;

      // Make ajax call to set/clear the break point by user
      var baseUrl = url_for('debugger.set_breakpoint', {
        'trans_id': trans_id,
        'line_no': line_no,
        'set_type': set_type
      });
      $.ajax({
        url: baseUrl,
        method: 'GET',
        success: function success(res) {
          if (res.data.status) {
            // Breakpoint has been set by the user
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while setting debugging breakpoint.');
        }
      });
    },

    // Function to get the latest breakpoint information and update the gutters of codemirror
    UpdateBreakpoint: function UpdateBreakpoint(trans_id) {
      var self = this;

      var br_list = self.GetBreakpointInformation(trans_id);

      // If there is no break point to clear then we should return from here.
      if (br_list.length == 1 && br_list[0].linenumber == -1) return;

      var breakpoint_list = new Array();

      for (var i = 0; i < br_list.length; i++) {
        if (br_list[i].linenumber != -1) {
          breakpoint_list.push(br_list[i].linenumber);
        }
      }

      for (var i = 0; i < breakpoint_list.length; i++) {
        var info = pgTools.DirectDebug.editor.lineInfo(breakpoint_list[i] - 1);

        if (info.gutterMarkers != undefined) {
          pgTools.DirectDebug.editor.setGutterMarker(breakpoint_list[i] - 1, "breakpoints", null);
        } else {
          pgTools.DirectDebug.editor.setGutterMarker(breakpoint_list[i] - 1, "breakpoints", function () {
            var marker = document.createElement("div");
            marker.style.color = "#822";
            marker.innerHTML = "●";
            return marker;
          }());
        }
      }
    },

    // Function to get the breakpoint information from the server
    GetBreakpointInformation: function GetBreakpointInformation(trans_id) {
      var self = this;
      var result = '';

      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.execute_query', {
        'trans_id': trans_id,
        'query_type': 'get_breakpoints'
      });
      $.ajax({
        url: baseUrl,
        method: 'GET',
        async: false,
        success: function success(res) {
          if (res.data.status === 'Success') {
            result = res.data.result;
          } else if (res.data.status === 'NotConnected') {
            Alertify.alert('Debugger Error', 'Error while fetching breakpoint information.');
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while fetching breakpoint information.');
        }
      });

      return result;
    },

    // Function to start the executer and execute the user requested option for debugging
    start_execution: function start_execution(trans_id, port_num) {
      var self = this;
      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.start_execution', {
        'trans_id': trans_id,
        'port_num': port_num
      });
      $.ajax({
        url: baseUrl,
        method: 'GET',
        success: function success(res) {
          if (res.data.status === 'Success') {
            // If status is Success then find the port number to attach the executer.
            self.execute_query(trans_id);
          } else if (res.data.status === 'NotConnected') {
            Alertify.alert('Debugger Error', 'Error while starting debugging session.');
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while starting debugging session.');
        }
      });
    },

    // Execute the query and get the first functions debug information from the server
    execute_query: function execute_query(trans_id) {
      var self = this;
      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.execute_query', {
        'trans_id': trans_id,
        'query_type': 'wait_for_breakpoint'
      });
      $.ajax({
        url: baseUrl,
        method: 'GET',
        success: function success(res) {
          if (res.data.status === 'Success') {
            // set the return code to the code editor text area
            if (res.data.result[0].src != null && res.data.result[0].linenumber != null) {
              pgTools.DirectDebug.editor.setValue(res.data.result[0].src);
              var active_line_no = self.active_line_no = res.data.result[0].linenumber - 2;
              pgTools.DirectDebug.editor.addLineClass(res.data.result[0].linenumber - 2, 'wrap', 'CodeMirror-activeline-background');
            }

            // Call function to create and update local variables ....
            self.GetStackInformation(trans_id);
            if (pgTools.DirectDebug.debug_type) {
              self.poll_end_execution_result(trans_id);
            }
          } else if (res.data.status === 'NotConnected') {
            Alertify.alert('Debugger Error', 'Error while executing requested debugging information.');
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while executing requested debugging information.');
        }
      });
    },

    // Get the local variable information of the functions and update the grid
    GetLocalVariables: function GetLocalVariables(trans_id) {
      var self = this;

      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.execute_query', {
        'trans_id': trans_id,
        'query_type': 'get_variables'
      });
      $.ajax({
        url: baseUrl,
        method: 'GET',
        success: function success(res) {
          if (res.data.status === 'Success') {
            // Call function to create and update local variables
            self.AddLocalVariables(res.data.result);
            self.AddParameters(res.data.result);
            // If debug function is restarted then again start listener to read the updated messages.
            if (pgTools.DirectDebug.debug_restarted) {
              if (pgTools.DirectDebug.debug_type) {
                self.poll_end_execution_result(trans_id);
              }
              pgTools.DirectDebug.debug_restarted = false;
            }
          } else if (res.data.status === 'NotConnected') {
            Alertify.alert('Debugger Error', 'Error while fetching variable information.');
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while fetching variable information.');
        }
      });
    },

    // Get the stack information of the functions and update the grid
    GetStackInformation: function GetStackInformation(trans_id) {
      var self = this;

      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.execute_query', {
        'trans_id': trans_id,
        'query_type': 'get_stack_info'
      });
      $.ajax({
        url: baseUrl,
        method: 'GET',
        success: function success(res) {
          if (res.data.status === 'Success') {
            // Call function to create and update stack information
            self.AddStackInformation(res.data.result);
            self.GetLocalVariables(pgTools.DirectDebug.trans_id);
          } else if (res.data.status === 'NotConnected') {
            Alertify.alert('Debugger Error', 'Error while fetching stack information.');
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while fetching stack information.');
        }
      });
    },

    /*
      poll the actual result after user has executed the "continue", "step-into", "step-over" actions and get the
      other updated information from the server.
    */
    poll_result: function poll_result(trans_id) {
      var self = this;

      // Do we need to poll?
      if (!pgTools.DirectDebug.is_polling_required) {
        return;
      }

      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.poll_result', { 'trans_id': trans_id });

      /*
        During the execution we should poll the result in minimum seconds but once the execution is completed
        and wait for the another debugging session then we should decrease the polling frequency.
      */
      if (pgTools.DirectDebug.polling_timeout_idle) {
        // poll the result after 1 second
        var poll_timeout = 1000;
      } else {
        // poll the result after 200 ms
        var poll_timeout = 200;
      }

      setTimeout(function () {
        $.ajax({
          url: baseUrl,
          method: 'GET',
          beforeSend: function beforeSend(jqXHR, settings) {
            // set cursor to progress before every poll.
            $('.debugger-container').addClass('show_progress');
          },
          success: function success(res) {
            // remove progress cursor
            $('.debugger-container').removeClass('show_progress');

            if (res.data.status === 'Success') {
              // If no result then poll again to wait for results.
              if (res.data.result == null || res.data.result.length == 0) {
                self.poll_result(trans_id);
              } else {
                if (res.data.result[0].src != undefined || res.data.result[0].src != null) {
                  pgTools.DirectDebug.polling_timeout_idle = false;
                  pgTools.DirectDebug.docker.finishLoading(50);
                  pgTools.DirectDebug.editor.setValue(res.data.result[0].src);
                  self.UpdateBreakpoint(trans_id);
                  pgTools.DirectDebug.editor.removeLineClass(self.active_line_no, 'wrap', 'CodeMirror-activeline-background');
                  pgTools.DirectDebug.editor.addLineClass(res.data.result[0].linenumber - 2, 'wrap', 'CodeMirror-activeline-background');
                  self.active_line_no = res.data.result[0].linenumber - 2;

                  // Update the stack, local variables and parameters information
                  self.GetStackInformation(trans_id);
                } else if (!pgTools.DirectDebug.debug_type && !pgTools.DirectDebug.first_time_indirect_debug) {
                  pgTools.DirectDebug.docker.finishLoading(50);
                  if (self.active_line_no != undefined) {
                    pgTools.DirectDebug.editor.removeLineClass(self.active_line_no, 'wrap', 'CodeMirror-activeline-background');
                  }
                  self.clear_all_breakpoint(trans_id);
                  self.execute_query(trans_id);
                  pgTools.DirectDebug.first_time_indirect_debug = true;
                  pgTools.DirectDebug.polling_timeout_idle = false;
                } else {
                  pgTools.DirectDebug.polling_timeout_idle = false;
                  pgTools.DirectDebug.docker.finishLoading(50);
                  // If the source is really changed then only update the breakpoint information
                  if (res.data.result[0].src != pgTools.DirectDebug.editor.getValue()) {
                    pgTools.DirectDebug.editor.setValue(res.data.result[0].src);
                    self.UpdateBreakpoint(trans_id);
                  }

                  pgTools.DirectDebug.editor.removeLineClass(self.active_line_no, 'wrap', 'CodeMirror-activeline-background');
                  pgTools.DirectDebug.editor.addLineClass(res.data.result[0].linenumber - 2, 'wrap', 'CodeMirror-activeline-background');
                  self.active_line_no = res.data.result[0].linenumber - 2;

                  // Update the stack, local variables and parameters information
                  self.GetStackInformation(trans_id);
                }

                // Enable all the buttons as we got the results
                self.enable('stop', true);
                self.enable('step_over', true);
                self.enable('step_into', true);
                self.enable('continue', true);
                self.enable('toggle_breakpoint', true);
                self.enable('clear_all_breakpoints', true);
              }
            } else if (res.data.status === 'Busy') {
              pgTools.DirectDebug.polling_timeout_idle = true;
              // If status is Busy then poll the result by recursive call to the poll function
              if (!pgTools.DirectDebug.debug_type) {
                pgTools.DirectDebug.docker.startLoading(gettext('Waiting for another session to invoke the target...'));

                // As we are waiting for another session to invoke the target,disable all the buttons
                self.enable('stop', false);
                self.enable('step_over', false);
                self.enable('step_into', false);
                self.enable('continue', false);
                self.enable('toggle_breakpoint', false);
                self.enable('clear_all_breakpoints', false);
                pgTools.DirectDebug.first_time_indirect_debug = false;
                self.poll_result(trans_id);
              } else {
                self.poll_result(trans_id);
              }
            } else if (res.data.status === 'NotConnected') {
              Alertify.alert('Debugger Error', 'Error while polling result.');
            }
          },
          error: function error(e) {
            Alertify.alert('Debugger Error', 'Error while polling result.');
          }
        });
      }, poll_timeout);
    },

    // This function will update messages tab
    update_messages: function update_messages(msg) {
      // To prevent xss
      msg = _.escape(msg);

      var old_msgs = '',
          new_msgs = '';
      old_msgs = pgTools.DirectDebug.messages_panel.$container.find('.messages').html();
      if (old_msgs) {
        new_msgs = (old_msgs + '\n' + msg).replace(/(?:\r\n|\r|\n)/g, '<br />') // Newlines with <br>
        .replace(/(<br\ ?\/?>)+/g, '<br />'); // multiple <br> with single <br>
      } else {
        new_msgs = msg;
      }
      pgTools.DirectDebug.messages_panel.$container.find('.messages').html(new_msgs);
    },

    /*
      For the direct debugging, we need to check weather the functions execution is completed or not. After completion
      of the debugging, we will stop polling the result  until new execution starts.
    */
    poll_end_execution_result: function poll_end_execution_result(trans_id) {
      var self = this;

      // Do we need to poll?
      if (!pgTools.DirectDebug.is_polling_required) {
        return;
      }

      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.poll_end_execution_result', { 'trans_id': trans_id });

      /*
        During the execution we should poll the result in minimum seconds but once the execution is completed
        and wait for the another debugging session then we should decrease the polling frequency.
      */
      if (pgTools.DirectDebug.polling_timeout_idle) {
        // poll the result to check that execution is completed or not after 1200 ms
        var poll_end_timeout = 1200;
      } else {
        // poll the result to check that execution is completed or not after 350 ms
        var poll_end_timeout = 250;
      }

      setTimeout(function () {
        $.ajax({
          url: baseUrl,
          method: 'GET',
          success: function success(res) {
            if (res.data.status === 'Success') {
              if (res.data.result == undefined) {
                /*
                 "result" is undefined only in case of EDB procedure. As Once the EDB procedure execution is completed
                 then we are not getting any result so we need ignore the result.
                */
                pgTools.DirectDebug.editor.removeLineClass(self.active_line_no, 'wrap', 'CodeMirror-activeline-background');
                pgTools.DirectDebug.direct_execution_completed = true;
                pgTools.DirectDebug.polling_timeout_idle = true;

                //Set the alertify message to inform the user that execution is completed.
                Alertify.success(res.info, 3);

                // Update the message tab of the debugger
                if (res.data.status_message) {
                  self.update_messages(res.data.status_message);
                }

                // remove progress cursor
                $('.debugger-container').removeClass('show_progress');

                // Execution completed so disable the buttons other than "Continue/Start" button because user can still
                // start the same execution again.
                self.enable('stop', false);
                self.enable('step_over', false);
                self.enable('step_into', false);
                self.enable('toggle_breakpoint', false);
                self.enable('clear_all_breakpoints', false);
                self.enable('continue', true);
                // Stop further polling
                pgTools.DirectDebug.is_polling_required = false;
              } else {
                // Call function to create and update local variables ....
                if (res.data.result != null) {
                  pgTools.DirectDebug.editor.removeLineClass(self.active_line_no, 'wrap', 'CodeMirror-activeline-background');
                  self.AddResults(res.data.col_info, res.data.result);
                  pgTools.DirectDebug.results_panel.focus();
                  pgTools.DirectDebug.direct_execution_completed = true;
                  pgTools.DirectDebug.polling_timeout_idle = true;

                  //Set the alertify message to inform the user that execution is completed.
                  Alertify.success(res.info, 3);

                  // Update the message tab of the debugger
                  if (res.data.status_message) {
                    self.update_messages(res.data.status_message);
                  }

                  // remove progress cursor
                  $('.debugger-container').removeClass('show_progress');

                  // Execution completed so disable the buttons other than "Continue/Start" button because user can still
                  // start the same execution again.
                  self.enable('stop', false);
                  self.enable('step_over', false);
                  self.enable('step_into', false);
                  self.enable('toggle_breakpoint', false);
                  self.enable('clear_all_breakpoints', false);
                  self.enable('continue', true);

                  // Stop further pooling
                  pgTools.DirectDebug.is_polling_required = false;
                }
              }
            } else if (res.data.status === 'Busy') {
              // If status is Busy then poll the result by recursive call to the poll function
              self.poll_end_execution_result(trans_id);
              // Update the message tab of the debugger
              if (res.data.status_message) {
                self.update_messages(res.data.status_message);
              }
            } else if (res.data.status === 'NotConnected') {
              Alertify.alert('Debugger poll end execution error', res.data.result);
            } else if (res.data.status === 'ERROR') {
              pgTools.DirectDebug.direct_execution_completed = true;
              pgTools.DirectDebug.editor.removeLineClass(self.active_line_no, 'wrap', 'CodeMirror-activeline-background');

              //Set the Alertify message to inform the user that execution is completed with error.
              if (!pgTools.DirectDebug.is_user_aborted_debugging) {
                Alertify.error(res.info, 3);
              }

              // Update the message tab of the debugger
              if (res.data.status_message) {
                self.update_messages(res.data.status_message);
              }

              pgTools.DirectDebug.messages_panel.focus();

              // remove progress cursor
              $('.debugger-container').removeClass('show_progress');

              // Execution completed so disable the buttons other than
              // "Continue/Start" button because user can still start the
              // same execution again.
              self.enable('stop', false);
              self.enable('step_over', false);
              self.enable('step_into', false);
              self.enable('toggle_breakpoint', false);
              self.enable('clear_all_breakpoints', false);
              // If debugging is stopped by user then do not enable
              // continue/restart button
              if (!pgTools.DirectDebug.is_user_aborted_debugging) {
                self.enable('continue', true);
                pgTools.DirectDebug.is_user_aborted_debugging = false;
              }

              // Stop further pooling
              pgTools.DirectDebug.is_polling_required = false;
            }
          },
          error: function error(e) {
            Alertify.alert('Debugger Error', 'Error while polling result.');
          }
        });
      }, poll_end_timeout);
    },

    Restart: function Restart(trans_id) {

      var self = this,
          baseUrl = url_for('debugger.restart', { 'trans_id': trans_id });
      self.enable('stop', false);
      self.enable('step_over', false);
      self.enable('step_into', false);
      self.enable('toggle_breakpoint', false);
      self.enable('clear_all_breakpoints', false);
      self.enable('continue', false);

      // Clear msg tab
      pgTools.DirectDebug.messages_panel.$container.find('.messages').html('');

      $.ajax({
        url: baseUrl,
        success: function success(res) {
          // Restart the same function debugging with previous arguments
          var restart_dbg = res.data.restart_debug ? 1 : 0;

          // Start pooling again
          pgTools.DirectDebug.polling_timeout_idle = false;
          pgTools.DirectDebug.is_polling_required = true;
          self.poll_end_execution_result(trans_id);
          self.poll_result(trans_id);

          if (restart_dbg) {
            pgTools.DirectDebug.debug_restarted = true;
          }

          /*
           Need to check if restart debugging really require to open the input dialog ?
           If yes then we will get the previous arguments from database and populate the input dialog
           If no then we should directly start the listener.
          */
          if (res.data.result.require_input) {
            var res_val = debug_function_again(res.data.result, restart_dbg);
          } else {
            // Debugging of void function is started again so we need to start the listener again
            var baseUrl = url_for('debugger.start_listener', { 'trans_id': trans_id });

            $.ajax({
              url: baseUrl,
              method: 'GET',
              success: function success(res) {
                if (pgTools.DirectDebug.debug_type) {
                  self.poll_end_execution_result(trans_id);
                }
              },
              error: function error(e) {
                Alertify.alert('Debugger Error', 'Error while polling result.');
              }
            });
          }
        },
        error: function error(xhr, status, _error) {
          try {
            var err = $.parseJSON(xhr.responseText);
            if (err.success == 0) {
              Alertify.alert(err.errormsg);
            }
          } catch (e) {}
        }
      });
    },

    // Continue the execution until the next breakpoint
    Continue: function Continue(trans_id) {
      var self = this;
      self.enable('stop', false);
      self.enable('step_over', false);
      self.enable('step_into', false);
      self.enable('toggle_breakpoint', false);
      self.enable('clear_all_breakpoints', false);
      self.enable('continue', false);

      //Check first if previous execution was completed or not
      if (pgTools.DirectDebug.direct_execution_completed && pgTools.DirectDebug.direct_execution_completed == pgTools.DirectDebug.polling_timeout_idle) {
        self.Restart(trans_id);
      } else {
        // Make ajax call to listen the database message
        var baseUrl = url_for('debugger.execute_query', {
          'trans_id': trans_id,
          'query_type': 'continue'
        });
        $.ajax({
          url: baseUrl,
          method: 'GET',
          success: function success(res) {
            if (res.data.status) {
              self.poll_result(trans_id);
            } else {
              Alertify.alert('Debugger Error', 'Error while executing continue in debugging session.');
            }
          },
          error: function error(e) {
            Alertify.alert('Debugger Error', 'Error while executing continue in debugging session.');
          }
        });
      }
    },

    Step_over: function Step_over(trans_id) {
      var self = this;
      self.enable('stop', false);
      self.enable('step_over', false);
      self.enable('step_into', false);
      self.enable('toggle_breakpoint', false);
      self.enable('clear_all_breakpoints', false);
      self.enable('continue', false);

      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.execute_query', {
        'trans_id': trans_id,
        'query_type': 'step_over'
      });
      $.ajax({
        url: baseUrl,
        method: 'GET',
        success: function success(res) {
          if (res.data.status) {
            self.poll_result(trans_id);
          } else {
            Alertify.alert('Debugger Error', 'Error while executing step over in debugging session.');
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while executing step over in debugging session.');
        }
      });
    },

    Step_into: function Step_into(trans_id) {
      var self = this;
      self.enable('stop', false);
      self.enable('step_over', false);
      self.enable('step_into', false);
      self.enable('toggle_breakpoint', false);
      self.enable('clear_all_breakpoints', false);
      self.enable('continue', false);

      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.execute_query', {
        'trans_id': trans_id,
        'query_type': 'step_into'
      });
      $.ajax({
        url: baseUrl,
        method: 'GET',
        success: function success(res) {
          if (res.data.status) {
            self.poll_result(trans_id);
          } else {
            Alertify.alert('Debugger Error', 'Error while executing step into in debugging session.');
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while executing step into in debugging session.');
        }
      });
    },

    Stop: function Stop(trans_id) {
      var self = this;
      self.enable('stop', false);
      self.enable('step_over', false);
      self.enable('step_into', false);
      self.enable('toggle_breakpoint', false);
      self.enable('clear_all_breakpoints', false);
      self.enable('continue', false);

      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.execute_query', {
        'trans_id': trans_id,
        'query_type': 'abort_target'
      });
      $.ajax({
        url: baseUrl,
        method: 'GET',
        success: function success(res) {
          if (res.data.status) {
            // Call function to create and update local variables ....
            pgTools.DirectDebug.editor.removeLineClass(self.active_line_no, 'wrap', 'CodeMirror-activeline-background');
            pgTools.DirectDebug.direct_execution_completed = true;
            pgTools.DirectDebug.is_user_aborted_debugging = true;

            // Stop further pooling
            pgTools.DirectDebug.is_polling_required = false;

            // Restarting debugging in the same transaction do not work
            // We will give same behaviour as pgAdmin3 and disable all buttons
            self.enable('continue', false);

            // Set the Alertify message to inform the user that execution
            // is completed.
            Alertify.success(res.info, 3);
          } else if (res.data.status === 'NotConnected') {
            Alertify.alert('Debugger Error', 'Error while executing stop in debugging session.');
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while executing stop in debugging session.');
        }
      });
    },

    toggle_breakpoint: function toggle_breakpoint(trans_id) {
      var self = this;
      self.enable('stop', false);
      self.enable('step_over', false);
      self.enable('step_into', false);
      self.enable('toggle_breakpoint', false);
      self.enable('clear_all_breakpoints', false);
      self.enable('continue', false);

      var info = pgTools.DirectDebug.editor.lineInfo(self.active_line_no);
      var baseUrl = '';

      // If gutterMarker is undefined that means there is no marker defined previously
      // So we need to set the breakpoint command here...
      if (info.gutterMarkers == undefined) {
        baseUrl = url_for('debugger.set_breakpoint', {
          'trans_id': trans_id,
          'line_no': self.active_line_no + 1,
          'set_type': '1'
        });
      } else {
        baseUrl = url_for('debugger.set_breakpoint', {
          'trans_id': trans_id,
          'line_no': self.active_line_no + 1,
          'set_type': '0'
        });
      }

      $.ajax({
        url: baseUrl,
        method: 'GET',
        success: function success(res) {
          if (res.data.status) {
            // Call function to create and update local variables ....
            var info = pgTools.DirectDebug.editor.lineInfo(self.active_line_no);

            if (info.gutterMarkers != undefined) {
              pgTools.DirectDebug.editor.setGutterMarker(self.active_line_no, "breakpoints", null);
            } else {
              pgTools.DirectDebug.editor.setGutterMarker(self.active_line_no, "breakpoints", function () {
                var marker = document.createElement("div");
                marker.style.color = "#822";
                marker.innerHTML = "●";
                return marker;
              }());
            }
            self.enable('stop', true);
            self.enable('step_over', true);
            self.enable('step_into', true);
            self.enable('toggle_breakpoint', true);
            self.enable('clear_all_breakpoints', true);
            self.enable('continue', true);
          } else if (res.data.status === 'NotConnected') {
            Alertify.alert('Debugger Error', 'Error while toggling breakpoint.');
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while toggling breakpoint.');
        }
      });
    },

    clear_all_breakpoint: function clear_all_breakpoint(trans_id) {
      var self = this,
          br_list = self.GetBreakpointInformation(trans_id);

      // If there is no break point to clear then we should return from here.
      if (br_list.length == 1 && br_list[0].linenumber == -1) return;

      self.enable('stop', false);
      self.enable('step_over', false);
      self.enable('step_into', false);
      self.enable('toggle_breakpoint', false);
      self.enable('clear_all_breakpoints', false);
      self.enable('continue', false);

      var breakpoint_list = new Array();

      for (var i = 0; i < br_list.length; i++) {
        if (br_list[i].linenumber != -1) {
          breakpoint_list.push(br_list[i].linenumber);
        }
      }

      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.clear_all_breakpoint', { 'trans_id': trans_id });

      $.ajax({
        url: baseUrl,
        method: 'POST',
        data: { 'breakpoint_list': breakpoint_list.join() },
        success: function success(res) {
          if (res.data.status) {
            for (var i = 0; i < breakpoint_list.length; i++) {
              var info = pgTools.DirectDebug.editor.lineInfo(breakpoint_list[i] - 1);

              if (info) {
                if (info.gutterMarkers != undefined) {
                  pgTools.DirectDebug.editor.setGutterMarker(breakpoint_list[i] - 1, "breakpoints", null);
                }
              }
            }
          }
          self.enable('stop', true);
          self.enable('step_over', true);
          self.enable('step_into', true);
          self.enable('toggle_breakpoint', true);
          self.enable('clear_all_breakpoints', true);
          self.enable('continue', true);
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while clearing all breakpoint.');
        }
      });
    },

    AddStackInformation: function AddStackInformation(result) {
      var self = this;

      // Remove the existing created grid and update the stack values
      if (self.stack_grid) {
        self.stack_grid.remove();
        self.stack_grid = null;
      }

      var DebuggerStackModel = Backbone.Model.extend({
        defaults: {
          name: undefined,
          value: undefined,
          line_no: undefined
        }
      });

      // Collection which contains the model for function informations.
      var StackCollection = Backbone.Collection.extend({
        model: DebuggerStackModel
      });

      var stackGridCols = [{ name: 'name', label: 'Name', type: 'text', editable: false, cell: 'string' }, { name: 'value', label: 'Value', type: 'text', editable: false, cell: 'string' }, { name: 'line_no', label: 'Line No.', type: 'text', editable: false, cell: 'string' }];

      var my_obj = [];
      if (result.length != 0) {
        for (var i = 0; i < result.length; i++) {
          my_obj.push({ "name": result[i].targetname, "value": result[i].args, "line_no": result[i].linenumber });
        }
      }

      var stackColl = this.stackColl = new StackCollection(my_obj);
      this.stackColl.on('backgrid:row:selected', self.select_frame, self);

      // Initialize a new Grid instance
      var stack_grid = this.stack_grid = new Backgrid.Grid({
        columns: stackGridCols,
        row: Backgrid.Row.extend({
          highlightColor: "#D9EDF7",
          disabledColor: "#F1F1F1",
          events: {
            click: "rowClick"
          },
          rowClick: function rowClick(e) {
            //Find which row is selected and depending on that send the frame id
            for (var i = 0; i < this.model.collection.length; i++) {
              if (this.model.collection.models[i].get('name') == this.model.get('name')) {
                self.frame_id_ = i;
                break;
              }
            }
            this.model.trigger('backgrid:row:selected', this);
            self.stack_grid.$el.find("td").css("background-color", this.disabledColor);
            this.$el.find("td").css("background-color", this.highlightColor);
          }
        }),
        collection: stackColl,
        className: "backgrid table-bordered"
      });

      stack_grid.render();

      // Render the stack grid into stack panel
      pgTools.DirectDebug.stack_pane_panel.$container.find('.stack_pane').append(stack_grid.el);
    },

    AddResults: function AddResults(columns, result) {
      var self = this;

      // Remove the existing created grid and update the result values
      if (self.result_grid) {
        self.result_grid.remove();
        self.result_grid = null;
      }

      var DebuggerResultsModel = Backbone.Model.extend({
        defaults: {
          name: undefined
        }
      });

      // Collection which contains the model for function informations.
      var ResultsCollection = Backbone.Collection.extend({
        model: DebuggerResultsModel
      });

      var resultGridCols = [];
      if (_.size(columns)) {
        _.each(columns, function (c) {
          var column = {
            type: 'text',
            editable: false,
            cell: 'string'
          };
          column['name'] = column['label'] = c.name;
          resultGridCols.push(column);
        });
      }

      // Initialize a new Grid instance
      var result_grid = this.result_grid = new Backgrid.Grid({
        columns: resultGridCols,
        collection: new ResultsCollection(result),
        className: "backgrid table-bordered"
      });

      result_grid.render();

      // Render the result grid into result panel
      pgTools.DirectDebug.results_panel.$container.find('.debug_results').append(result_grid.el);
    },

    AddLocalVariables: function AddLocalVariables(result) {
      var self = this;

      // Remove the existing created grid and update the variables values
      if (self.variable_grid) {
        self.variable_grid.remove();
        self.variable_grid = null;
      }

      var DebuggerVariablesModel = Backbone.Model.extend({
        defaults: {
          name: undefined,
          type: undefined,
          value: undefined
        }
      });

      // Collection which contains the model for function informations.
      var VariablesCollection = Backbone.Collection.extend({
        model: DebuggerVariablesModel
      });

      var gridCols = [{ name: 'name', label: 'Name', type: 'text', editable: false, cell: 'string' }, { name: 'type', label: 'Type', type: 'text', editable: false, cell: 'string' }, { name: 'value', label: 'Value', type: 'text', cell: 'string' }];

      var my_obj = [];
      if (result.length != 0) {
        for (var i = 0; i < result.length; i++) {
          if (result[i].varclass == 'L') {
            my_obj.push({ "name": result[i].name, "type": result[i].dtype, "value": result[i].value });
          }
        }
      }

      // Initialize a new Grid instance
      var variable_grid = this.variable_grid = new Backgrid.Grid({
        columns: gridCols,
        collection: new VariablesCollection(my_obj),
        className: "backgrid table-bordered"
      });

      variable_grid.render();

      // Render the variables grid into local variables panel
      pgTools.DirectDebug.local_variables_panel.$container.find('.local_variables').append(variable_grid.el);
    },

    AddParameters: function AddParameters(result) {
      var self = this;

      // Remove the existing created grid and update the parameter values
      if (self.param_grid) {
        self.param_grid.remove();
        self.param_grid = null;
      }

      var DebuggerParametersModel = Backbone.Model.extend({
        defaults: {
          name: undefined,
          type: undefined,
          value: undefined
        }
      });

      // Collection which contains the model for function informations.
      var ParametersCollection = self.ParametersCollection = Backbone.Collection.extend({
        model: DebuggerParametersModel
      });

      self.ParametersCollection.prototype.on('change', self.deposit_parameter_value, self);

      var paramGridCols = [{ name: 'name', label: 'Name', type: 'text', editable: false, cell: 'string' }, { name: 'type', label: 'Type', type: 'text', editable: false, cell: 'string' }, { name: 'value', label: 'Value', type: 'text', cell: 'string' }];

      var param_obj = [];
      if (result.length != 0) {
        for (var i = 0; i < result.length; i++) {
          if (result[i].varclass == 'A') {
            param_obj.push({ "name": result[i].name, "type": result[i].dtype, "value": result[i].value });
          }
        }
      }

      // Initialize a new Grid instance
      var param_grid = this.param_grid = new Backgrid.Grid({
        columns: paramGridCols,
        collection: new ParametersCollection(param_obj),
        className: "backgrid table-bordered"
      });

      param_grid.render();

      // Render the parameters grid into parameter panel
      pgTools.DirectDebug.parameters_panel.$container.find('.parameters').append(param_grid.el);
    },

    deposit_parameter_value: function deposit_parameter_value(model) {
      var self = this;

      // variable name and value list that is changed by user
      var name_value_list = [];

      name_value_list.push({ 'name': model.get('name'), 'type': model.get('type'), 'value': model.get('value') });

      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.deposit_value', {
        'trans_id': pgTools.DirectDebug.trans_id
      });
      $.ajax({
        url: baseUrl,
        method: 'POST',
        data: { 'data': JSON.stringify(name_value_list) },
        success: function success(res) {
          if (res.data.status) {
            // Get the updated variables value
            self.GetLocalVariables(pgTools.DirectDebug.trans_id);
            // Show the message to the user that deposit value is success or failure
            if (res.data.result) {
              Alertify.success(res.data.info, 3);
            } else {
              Alertify.error(res.data.info, 3);
            }
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while depositing variable value.');
        }
      });
    },

    select_frame: function select_frame(model, selected) {
      var self = this;

      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.select_frame', {
        'trans_id': pgTools.DirectDebug.trans_id,
        'frame_id': self.frame_id_
      });
      $.ajax({
        url: baseUrl,
        method: 'GET',
        success: function success(res) {
          if (res.data.status) {
            pgTools.DirectDebug.editor.setValue(res.data.result[0].src);
            self.UpdateBreakpoint(pgTools.DirectDebug.trans_id);
            //active_line_no = self.active_line_no = (res.data.result[0].linenumber - 2);
            pgTools.DirectDebug.editor.addLineClass(res.data.result[0].linenumber - 2, 'wrap', 'CodeMirror-activeline-background');

            // Call function to create and update local variables ....
            self.GetLocalVariables(pgTools.DirectDebug.trans_id);
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while selecting frame.');
        }
      });
    }
  });

  /*
    Debugger tool var view to create the button toolbar and listen to the button click event and inform the
    controller about the click and controller will take the action for the specified button click.
  */
  var DebuggerToolbarView = Backbone.View.extend({
    el: '#btn-toolbar',
    initialize: function initialize() {
      controller.on('pgDebugger:button:state:stop', this.enable_stop, this);
      controller.on('pgDebugger:button:state:step_over', this.enable_step_over, this);
      controller.on('pgDebugger:button:state:step_into', this.enable_step_into, this);
      controller.on('pgDebugger:button:state:continue', this.enable_continue, this);
      controller.on('pgDebugger:button:state:toggle_breakpoint', this.enable_toggle_breakpoint, this);
      controller.on('pgDebugger:button:state:clear_all_breakpoints', this.enable_clear_all_breakpoints, this);
    },
    events: {
      'click .btn-stop': 'on_stop',
      'click .btn-clear-breakpoint': 'on_clear_all_breakpoint',
      'click .btn-toggle-breakpoint': 'on_toggle_breakpoint',
      'click .btn-continue': 'on_continue',
      'click .btn-step-over': 'on_step_over',
      'click .btn-step-into': 'on_step_into'
    },
    enable_stop: function enable_stop(enable) {
      var $btn = this.$el.find('.btn-stop');

      if (enable) {
        $btn.prop('disabled', false);
        $btn.removeAttr('disabled');
      } else {
        $btn.prop('disabled', true);
        $btn.attr('disabled', 'disabled');
      }
    },
    enable_step_over: function enable_step_over(enable) {
      var $btn = this.$el.find('.btn-step-over');

      if (enable) {
        $btn.prop('disabled', false);
        $btn.removeAttr('disabled');
      } else {
        $btn.prop('disabled', true);
        $btn.attr('disabled', 'disabled');
      }
    },
    enable_step_into: function enable_step_into(enable) {
      var $btn = this.$el.find('.btn-step-into');

      if (enable) {
        $btn.prop('disabled', false);
        $btn.removeAttr('disabled');
      } else {
        $btn.prop('disabled', true);
        $btn.attr('disabled', 'disabled');
      }
    },
    enable_continue: function enable_continue(enable) {
      var $btn = this.$el.find('.btn-continue');

      if (enable) {
        $btn.prop('disabled', false);
        $btn.removeAttr('disabled');
      } else {
        $btn.prop('disabled', true);
        $btn.attr('disabled', 'disabled');
      }
    },
    enable_toggle_breakpoint: function enable_toggle_breakpoint(enable) {
      var $btn = this.$el.find('.btn-toggle-breakpoint');

      if (enable) {
        $btn.prop('disabled', false);
        $btn.removeAttr('disabled');
      } else {
        $btn.prop('disabled', true);
        $btn.attr('disabled', 'disabled');
      }
    },
    enable_clear_all_breakpoints: function enable_clear_all_breakpoints(enable) {
      var $btn = this.$el.find('.btn-clear-breakpoint');

      if (enable) {
        $btn.prop('disabled', false);
        $btn.removeAttr('disabled');
      } else {
        $btn.prop('disabled', true);
        $btn.attr('disabled', 'disabled');
      }
    },

    on_stop: function on_stop() {
      controller.Stop(pgTools.DirectDebug.trans_id);
    },
    on_clear_all_breakpoint: function on_clear_all_breakpoint() {
      controller.clear_all_breakpoint(pgTools.DirectDebug.trans_id);
    },
    on_toggle_breakpoint: function on_toggle_breakpoint() {
      controller.toggle_breakpoint(pgTools.DirectDebug.trans_id);
    },
    on_continue: function on_continue() {
      controller.Continue(pgTools.DirectDebug.trans_id);
    },
    on_step_over: function on_step_over() {
      controller.Step_over(pgTools.DirectDebug.trans_id);
    },
    on_step_into: function on_step_into() {
      controller.Step_into(pgTools.DirectDebug.trans_id);
    }
  });

  /*
    Function is responsible to create the new wcDocker instance for debugger and initialize the debugger panel inside
    the docker instance.
  */
  var DirectDebug = function DirectDebug() {};

  _.extend(DirectDebug.prototype, {
    init: function init(trans_id, debug_type) {
      /* We should get the transaction id from the server during initialization here */
      // We do not want to initialize the module multiple times.

      var self = this;
      _.bindAll(pgTools.DirectDebug, 'messages');

      if (this.initialized) return;

      this.initialized = true;
      this.trans_id = trans_id;
      this.debug_type = debug_type;
      this.first_time_indirect_debug = false;
      this.direct_execution_completed = false;
      this.polling_timeout_idle = false;
      this.debug_restarted = false;
      this.is_user_aborted_debugging = false;
      this.is_polling_required = true; // Flag to stop unwanted ajax calls

      var docker = this.docker = new wcDocker('#container', {
        allowContextMenu: false,
        allowCollapse: false,
        themePath: url_for('static', { 'filename': 'css' }),
        theme: 'webcabin.overrides.css'
      });

      this.panels = [];

      // Below code will be executed for indirect debugging
      // indirect debugging - 0  and for direct debugging - 1
      if (trans_id != undefined && !debug_type) {
        // Make ajax call to execute the and start the target for execution
        var baseUrl = url_for('debugger.start_listener', { 'trans_id': trans_id });

        $.ajax({
          url: baseUrl,
          method: 'GET',
          success: function success(res) {
            if (res.data.status) {
              self.intializePanels();
              controller.poll_result(trans_id);
            }
          },
          error: function error(e) {
            Alertify.alert('Debugger Error', 'Error while starting debugging listener.');
          }
        });
      } else if (trans_id != undefined && debug_type) {
        // Make ajax call to execute the and start the target for execution
        var baseUrl = url_for('debugger.start_listener', { 'trans_id': trans_id });

        $.ajax({
          url: baseUrl,
          method: 'GET',
          success: function success(res) {
            if (res.data.status) {
              self.messages(trans_id);
            }
          },
          error: function error(e) {
            Alertify.alert('Debugger Error', 'Error while starting debugging listener.');
          }
        });
      } else this.intializePanels();
    },

    // Read the messages of the database server and get the port ID and attach the executer to that port.
    messages: function messages(trans_id) {
      var self = this;
      // Make ajax call to listen the database message
      var baseUrl = url_for('debugger.messages', { 'trans_id': trans_id });

      $.ajax({
        url: baseUrl,
        method: 'GET',
        success: function success(res) {
          if (res.data.status === 'Success') {
            self.intializePanels();
            // If status is Success then find the port number to attach the executer.
            //self.start_execution(trans_id, res.data.result);
            controller.start_execution(trans_id, res.data.result);
          } else if (res.data.status === 'Busy') {
            // If status is Busy then poll the result by recursive call to the poll function
            self.messages(trans_id);
          } else if (res.data.status === 'NotConnected') {
            Alertify.alert('Not connected to server or connection with the server has been closed.', res.data.result);
          }
        },
        error: function error(e) {
          Alertify.alert('Debugger Error', 'Error while fetching messages information.');
        }
      });
    },

    // Callback function when user click on gutters of codemirror to set/clear the breakpoint
    onBreakPoint: function onBreakPoint(cm, m, gutter) {
      var self = this;

      // If breakpoint gutter is clicked and execution is not completed then only set the breakpoint
      if (gutter == "breakpoints" && !pgTools.DirectDebug.polling_timeout_idle) {
        // We may want to check, if break-point is allowed at this moment or not
        var info = cm.lineInfo(m);

        // If gutterMarker is undefined that means there is no marker defined previously
        // So we need to set the breakpoint command here...
        if (info.gutterMarkers == undefined) {
          controller.set_breakpoint(self.trans_id, m + 1, 1); //set the breakpoint
        } else {
          if (info.gutterMarkers.breakpoints == undefined) {
            controller.set_breakpoint(self.trans_id, m + 1, 1); //set the breakpoint
          } else {
            controller.set_breakpoint(self.trans_id, m + 1, 0); //clear the breakpoint
          }
        }

        // If line folding is defined then gutterMarker will be defined so
        // we need to find out 'breakpoints' information
        var markers = info.gutterMarkers;
        if (markers != undefined && info.gutterMarkers.breakpoints == undefined) markers = info.gutterMarkers.breakpoints;

        cm.setGutterMarker(m, "breakpoints", markers ? null : function () {
          var marker = document.createElement("div");

          marker.style.color = "#822";
          marker.innerHTML = "●";

          return marker;
        }());
      }
    },

    // Create the debugger layout with splitter and display the appropriate data received from server.
    intializePanels: function intializePanels() {
      var self = this;
      this.registerPanel('code', false, '100%', '50%', function (panel) {

        // Create the parameters panel to display the arguments of the functions
        var parameters = new pgAdmin.Browser.Panel({
          name: 'parameters',
          title: gettext('Parameters'),
          width: '100%',
          height: '100%',
          isCloseable: false,
          isPrivate: true,
          content: '<div id ="parameters" class="parameters"></div>'
        });

        // Create the Local variables panel to display the local variables of the function.
        var local_variables = new pgAdmin.Browser.Panel({
          name: 'local_variables',
          title: gettext('Local variables'),
          width: '100%',
          height: '100%',
          isCloseable: false,
          isPrivate: true,
          content: '<div id ="local_variables" class="local_variables"></div>'
        });

        // Create the messages panel to display the message returned from the database server
        var messages = new pgAdmin.Browser.Panel({
          name: 'messages',
          title: gettext('Messages'),
          width: '100%',
          height: '100%',
          isCloseable: false,
          isPrivate: true,
          content: '<div id="messages" class="messages"></div>'
        });

        // Create the result panel to display the result after debugging the function
        var results = new pgAdmin.Browser.Panel({
          name: 'results',
          title: gettext('Results'),
          width: '100%',
          height: '100%',
          isCloseable: false,
          isPrivate: true,
          content: '<div id="debug_results" class="debug_results"></div>'
        });

        // Create the stack pane panel to display the debugging stack information.
        var stack_pane = new pgAdmin.Browser.Panel({
          name: 'stack_pane',
          title: gettext('Stack'),
          width: '100%',
          height: '100%',
          isCloseable: false,
          isPrivate: true,
          content: '<div id="stack_pane" class="stack_pane"></div>'
        });

        // Load all the created panels
        parameters.load(self.docker);
        local_variables.load(self.docker);
        messages.load(self.docker);
        results.load(self.docker);
        stack_pane.load(self.docker);
      });

      self.code_editor_panel = self.docker.addPanel('code', wcDocker.DOCK.TOP);

      self.parameters_panel = self.docker.addPanel('parameters', wcDocker.DOCK.BOTTOM, self.code_editor_panel);
      self.local_variables_panel = self.docker.addPanel('local_variables', wcDocker.DOCK.STACKED, self.parameters_panel, {
        tabOrientation: wcDocker.TAB.TOP
      });
      self.messages_panel = self.docker.addPanel('messages', wcDocker.DOCK.STACKED, self.parameters_panel);
      self.results_panel = self.docker.addPanel('results', wcDocker.DOCK.STACKED, self.parameters_panel);
      self.stack_pane_panel = self.docker.addPanel('stack_pane', wcDocker.DOCK.STACKED, self.parameters_panel);

      var editor_pane = $('<div id="stack_editor_pane" class="full-container-pane info"></div>');
      var code_editor_area = $('<textarea id="debugger-editor-textarea"></textarea>').append(editor_pane);
      self.code_editor_panel.layout().addItem(code_editor_area);

      // To show the line-number and set breakpoint marker details by user.
      var editor = self.editor = CodeMirror.fromTextArea(code_editor_area.get(0), {
        lineNumbers: true,
        foldOptions: {
          widget: '\u2026'
        },
        foldGutter: {
          rangeFinder: CodeMirror.fold.combine(CodeMirror.pgadminBeginRangeFinder, CodeMirror.pgadminIfRangeFinder, CodeMirror.pgadminLoopRangeFinder, CodeMirror.pgadminCaseRangeFinder)
        },
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "breakpoints"],
        mode: "text/x-pgsql",
        readOnly: true,
        extraKeys: pgAdmin.Browser.editor_shortcut_keys,
        tabSize: pgAdmin.Browser.editor_options.tabSize,
        lineWrapping: pgAdmin.Browser.editor_options.wrapCode,
        autoCloseBrackets: pgAdmin.Browser.editor_options.insert_pair_brackets,
        matchBrackets: pgAdmin.Browser.editor_options.brace_matching
      });

      // On loading the docker, register the callbacks
      var onLoad = function onLoad() {
        self.docker.finishLoading(100);
        self.docker.off(wcDocker.EVENT.LOADED);
        // Register the callback when user set/clear the breakpoint on gutter area.
        self.editor.on("gutterClick", self.onBreakPoint.bind(self), self);
      };

      self.docker.startLoading(gettext('Loading...'));
      self.docker.on(wcDocker.EVENT.LOADED, onLoad);

      // Create the toolbar view for debugging the function
      this.toolbarView = new DebuggerToolbarView();
    },

    // Register the panel with new debugger docker instance.
    registerPanel: function registerPanel(name, title, width, height, onInit) {
      var self = this;

      this.docker.registerPanelType(name, {
        title: title,
        isPrivate: true,
        onCreate: function onCreate(panel) {
          self.panels[name] = panel;
          panel.initSize(width, height);
          if (!title) panel.title(false);else panel.title(title);
          panel.closeable(false);
          panel.layout().addItem($('<div>', { 'class': 'pg-debugger-panel' }));
          if (onInit) {
            onInit.apply(self, [panel]);
          }
        }
      });
    }
  });

  pgTools.DirectDebug = new DirectDebug();
  pgTools.DirectDebug['jquery'] = $;

  return pgTools.DirectDebug;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(44)], __WEBPACK_AMD_DEFINE_RESULT__ = function (translations) {

  /***
   * This method behaves as a drop-in replacement for flask translation rendering.
   * It uses the same translation file under the hood and uses flask to determine the language.
   *
   * ex. translate("some %(adjective)s text", {adjective: "cool"})
   *
   * @param {String} text
   * @param {Object} substitutions
   */
  return function gettext(text, substitutions) {

    var rawTranslation = translations[text] ? translations[text] : text;

    // captures things of the form %(substitutionName)s
    var substitutionGroupsRegExp = /([^%]*)%\(([^\)]+)\)s(.*)/;
    var matchFound;

    var interpolated = rawTranslation;
    do {
      matchFound = false;
      interpolated = interpolated.replace(substitutionGroupsRegExp, function (_, textBeginning, substitutionName, textEnd) {
        matchFound = true;
        return textBeginning + substitutions[substitutionName] + textEnd;
      });
    } while (matchFound);

    return interpolated;
  };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _codemirror = __webpack_require__(14);

var _codemirror2 = _interopRequireDefault(_codemirror);

__webpack_require__(52);

__webpack_require__(85);

__webpack_require__(86);

__webpack_require__(75);

__webpack_require__(87);

__webpack_require__(88);

__webpack_require__(89);

__webpack_require__(90);

__webpack_require__(53);

__webpack_require__(91);

__webpack_require__(76);

__webpack_require__(92);

__webpack_require__(93);

__webpack_require__(94);

__webpack_require__(95);

__webpack_require__(38);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _codemirror2.default;

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    factory();
  }
})(function () {
  var pgAdmin = window.pgAdmin = window.pgAdmin || {};

  // Reference:
  // https://github.com/heygrady/Units/blob/master/Length.min.js
  // Changed it to save the function in pgAdmin object.
  (function (t, e, o) {
    "use strict";
    function r(t, e, r, p) {
      r = r || "width";var n,
          l,
          m,
          c = (e.match(s) || [])[2],
          f = "px" === c ? 1 : d[c + "toPx"],
          u = /r?em/i;if (f || u.test(c) && !p) t = f ? t : "rem" === c ? i : "fontSize" === r ? t.parentNode || t : t, f = f || parseFloat(a(t, "fontSize")), m = parseFloat(e) * f;else {
        n = t.style, l = n[r];try {
          n[r] = e;
        } catch (x) {
          return 0;
        }m = n[r] ? parseFloat(a(t, r)) : 0, n[r] = l !== o ? l : null;
      }return m;
    }function a(t, e) {
      var o,
          n,
          i,
          l,
          d,
          c = /^top|bottom/,
          f = ["paddingTop", "paddingBottom", "borderTop", "borderBottom"],
          u = 4;if (o = m ? m(t)[e] : (n = t.style["pixel" + e.charAt(0).toUpperCase() + e.slice(1)]) ? n + "px" : "fontSize" === e ? r(t, "1em", "left", 1) + "px" : t.currentStyle[e], i = (o.match(s) || [])[2], "%" === i && p) {
        if (c.test(e)) {
          for (l = (d = t.parentNode || t).offsetHeight; u--;) {
            l -= parseFloat(a(d, f[u]));
          }o = parseFloat(o) / 100 * l + "px";
        } else o = r(t, o);
      } else ("auto" === o || i && "px" !== i) && m ? o = 0 : i && "px" !== i && !m && (o = r(t, o) + "px");return o;
    }var p,
        n = e.createElement("test"),
        i = e.documentElement,
        l = e.defaultView,
        m = l && l.getComputedStyle,
        s = /^(-?[\d+\.\-]+)([a-z]+|%)$/i,
        d = {},
        c = [1 / 25.4, 1 / 2.54, 1 / 72, 1 / 6],
        f = ["mm", "cm", "pt", "pc", "in", "mozmm"],
        u = 6;for (i.appendChild(n), m && (n.style.marginTop = "1%", p = "1%" === m(n).marginTop); u--;) {
      d[f[u] + "toPx"] = c[u] ? c[u] * d.inToPx : r(n, "1" + f[u]);
    }i.removeChild(n), n = o, t.toPx = r;
  })(pgAdmin, window.document);

  // Reference:
  // https://github.com/javve/natural-sort/blob/master/index.js
  // Changed it to save the function in pgAdmin object.
  pgAdmin.natural_sort = function (a, b, options) {
    var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
        sre = /(^[ ]*|[ ]*$)/g,
        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        hre = /^0x[0-9a-f]+$/i,
        ore = /^0/,
        options = options || {},
        i = function i(s) {
      return options.insensitive && ('' + s).toLowerCase() || '' + s;
    },

    // convert all to strings strip whitespace
    x = i(a).replace(sre, '') || '',
        y = i(b).replace(sre, '') || '',

    // chunk/tokenize
    xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
        yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),

    // numeric, hex or date detection
    xD = parseInt(x.match(hre)) || xN.length !== 1 && x.match(dre) && Date.parse(x),
        yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
        oFxNcL,
        oFyNcL,
        mult = options.desc ? -1 : 1;

    // first try and sort Hex codes or Dates
    if (yD) if (xD < yD) return -1 * mult;else if (xD > yD) return 1 * mult;

    // natural sorting through split numeric strings and default strings
    for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
      // find floats not starting with '0', string or 0 if not defined (Clint Priest)
      oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
      oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
      // handle numeric vs string comparison - number < string - (Kyle Adams)
      if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
        return (isNaN(oFxNcL) ? 1 : -1) * mult;
      }
      // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
      else if ((typeof oFxNcL === 'undefined' ? 'undefined' : _typeof(oFxNcL)) !== (typeof oFyNcL === 'undefined' ? 'undefined' : _typeof(oFyNcL))) {
          oFxNcL += '';
          oFyNcL += '';
        }
      if (oFxNcL < oFyNcL) return -1 * mult;
      if (oFxNcL > oFyNcL) return 1 * mult;
    }
    return 0;
  };

  return pgAdmin;
});

/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (mod) {
  if (( false ? "undefined" : _typeof(exports)) == "object" && ( false ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(__webpack_require__(14));else if (true) // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(14)], __WEBPACK_AMD_DEFINE_FACTORY__ = (mod),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  CodeMirror.pgadminKeywordRangeFinder = function (cm, start, startTkn, endTkn) {
    var line = start.line,
        lineText = cm.getLine(line);
    var at = lineText.length,
        startChar,
        tokenType;
    for (; at > 0;) {
      var found = lineText.lastIndexOf(startTkn, at);
      var startToken = startTkn;
      var endToken = endTkn;
      if (found < start.ch) {
        var found = lineText.lastIndexOf("[", at);
        if (found < start.ch) break;
        var startToken = '[';
        var endToken = ']';
      }

      tokenType = cm.getTokenAt(CodeMirror.Pos(line, found + 1)).type;
      if (!/^(comment|string)/.test(tokenType)) {
        startChar = found;break;
      }
      at = found - 1;
    }
    if (startChar == null || lineText.lastIndexOf(startToken) > startChar) return;
    var count = 1,
        lastLine = cm.lineCount(),
        end,
        endCh;
    outer: for (var i = line + 1; i < lastLine; ++i) {
      var text = cm.getLine(i),
          pos = 0;
      for (;;) {
        var nextOpen = text.indexOf(startToken, pos),
            nextClose = text.indexOf(endToken, pos);
        if (nextOpen < 0) nextOpen = text.length;
        if (nextClose < 0) nextClose = text.length;
        pos = Math.min(nextOpen, nextClose);
        if (pos == text.length) break;
        if (cm.getTokenAt(CodeMirror.Pos(i, pos + 1)).type == tokenType) {
          if (pos == nextOpen) ++count;else if (! --count) {
            end = i;
            endCh = pos;
            break outer;
          }
        }
        ++pos;
      }
    }
    if (end == null || end == line + 1) return;
    return { from: CodeMirror.Pos(line, startChar + startTkn.length),
      to: CodeMirror.Pos(end, endCh) };
  };

  CodeMirror.pgadminBeginRangeFinder = function (cm, start) {
    var startToken = 'BEGIN';
    var endToken = 'END;';
    var fromToPos = CodeMirror.pgadminKeywordRangeFinder(cm, start, startToken, endToken);
    return fromToPos;
  };

  CodeMirror.pgadminIfRangeFinder = function (cm, start) {
    var startToken = 'IF';
    var endToken = 'END IF';
    var fromToPos = CodeMirror.pgadminKeywordRangeFinder(cm, start, startToken, endToken);
    return fromToPos;
  };

  CodeMirror.pgadminLoopRangeFinder = function (cm, start) {
    var startToken = 'LOOP';
    var endToken = 'END LOOP';
    var fromToPos = CodeMirror.pgadminKeywordRangeFinder(cm, start, startToken, endToken);
    return fromToPos;
  };

  CodeMirror.pgadminCaseRangeFinder = function (cm, start) {
    var startToken = 'CASE';
    var endToken = 'END CASE';
    var fromToPos = CodeMirror.pgadminKeywordRangeFinder(cm, start, startToken, endToken);
    return fromToPos;
  };
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(46)(module)))

/***/ }),

/***/ 44:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_44__;

/***/ }),

/***/ 45:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_45__;

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(45)], __WEBPACK_AMD_DEFINE_RESULT__ = function (endpoints) {
  /***
   * This method behaves as a drop-in replacement for flask url_for function.
   * It uses the exposed URLs file under the hood, and replace the substitions provided by the modules.
   *
   * ex.
   * url_for("help.static", {filename: "server_dialog.html"}) will produce the
   * output string '/help/help/server_dialog.html' from the url ->
   * '/help/help/<path:filename>'.
   *
   * @param {String} text
   * @param {Object} substitutions
   */
  return function url_for(endpoint, substitutions) {

    var rawURL = endpoints[endpoint];

    // captures things of the form <path:substitutionName>
    var substitutionGroupsRegExp = /([<])([^:^>]*:)?([^>]+)([>])/g;
    var matchFound;

    var interpolated = rawURL;

    if (!rawURL) return rawURL;

    interpolated = interpolated.replace(substitutionGroupsRegExp, function (_origin, _1, _2, substitutionName) {
      if (substitutionName in substitutions) {
        return substitutions[substitutionName];
      }
      return _origin;
    });

    return interpolated;
  };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 77:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_77__;

/***/ }),

/***/ 96:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_96__;

/***/ }),

/***/ 97:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _underscore = __webpack_require__(1);

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generate_url(baseUrl, treeInfo, actionType, nodeType, pickFunction, itemDataID) {
  var ref = '';
  _underscore2.default.each(_underscore2.default.sortBy(_underscore2.default.pick(treeInfo, pickFunction), function (treeInfoItems) {
    return treeInfoItems.priority;
  }), function (treeInfoItems) {
    ref = ref + '/' + encodeURI(treeInfoItems._id);
  });
  ref = itemDataID ? ref + '/' + itemDataID : ref + '/';

  return '' + baseUrl + nodeType + '/' + actionType + ref;
}

module.exports = {
  generate_url: generate_url
};

/***/ }),

/***/ 98:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(5), __webpack_require__(0), __webpack_require__(1), __webpack_require__(4), __webpack_require__(8), __webpack_require__(3), __webpack_require__(6), __webpack_require__(10), __webpack_require__(13), __webpack_require__(14), __webpack_require__(16), __webpack_require__(30), __webpack_require__(24), __webpack_require__(28), __webpack_require__(157)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, url_for, $, _, S, Alertify, pgAdmin, pgBrowser, Backbone, Backgrid, CodeMirror, Backform) {

  /*
   * Function used to return the respective Backgrid control based on the data type
   * of function input argument.
   */
  var cellFunction = function cellFunction(model) {
    var self = this,
        variable_type = model.get("type");

    // if variable type is an array then we need to render the custom control to take the input from user.
    if (variable_type.indexOf("[]") != -1) {
      if (variable_type.indexOf("integer") != -1) {
        return Backgrid.Extension.InputIntegerArrayCell;
      }
      return Backgrid.Extension.InputStringArrayCell;
    }

    switch (variable_type) {
      case "bool":
        return Backgrid.BooleanCell;
        break;

      case "integer":
        // As we are getting this value as text from sqlite database so we need to type cast it.
        if (model.get('value') != undefined) {
          model.set({ 'value': parseInt(model.get('value')) }, { silent: true });
        }

        return Backgrid.IntegerCell;
        break;

      case "real":
        // As we are getting this value as text from sqlite database so we need to type cast it.
        if (model.get('value') != undefined) {
          model.set({ 'value': parseFloat(model.get('value')) }, { silent: true });
        }
        return Backgrid.NumberCell;
        break;

      case "string":
        return Backgrid.StringCell;
        break;
      case "date":
        return Backgrid.DateCell;
        break;
      default:
        return Backgrid.Cell;
        break;
    }
  };

  /*
   * Function used to return the respective Backgrid string or boolean control based on the data type
   * of function input argument.
   */
  var cellExprControlFunction = function cellExprControlFunction(model) {
    var self = this,
        variable_type = model.get("type");
    if (variable_type.indexOf("[]") != -1) {
      return Backgrid.StringCell;
    }
    return Backgrid.BooleanCell;
  };

  /**
   *  DebuggerInputArgsModel used to represent input parameters for the function to debug
   *  for function objects.
   **/
  var DebuggerInputArgsModel = Backbone.Model.extend({
    defaults: {
      name: undefined,
      type: undefined,
      is_null: undefined,
      expr: undefined,
      value: undefined,
      use_default: undefined,
      default_value: undefined
    },
    validate: function validate() {
      if (_.isUndefined(this.get('value')) || _.isNull(this.get('value')) || String(this.get('value')).replace(/^\s+|\s+$/g, '') == '') {
        var msg = gettext('Please enter a value for the parameter.');
        this.errorModel.set('value', msg);
        return msg;
      } else {
        this.errorModel.unset('value');
      }
      return null;
    }
  });

  // Collection which contains the model for function informations.
  var DebuggerInputArgCollections = Backbone.Collection.extend({
    model: DebuggerInputArgsModel
  });

  // function will enable/disable the use_default column based on the value received.
  var disableDefaultCell = function disableDefaultCell(d) {
    if (d instanceof Backbone.Model) {
      return d.get('use_default');
    }
    return false;
  };

  // Enable/Disable the control based on the array data type of the function input arguments
  var disableExpressionControl = function disableExpressionControl(d) {
    var argType = d.get('type');
    if (d instanceof Backbone.Model) {
      var argType = d.get('type');
      if (argType.indexOf("[]") != -1) {
        return false;
      }
      return true;
    }
  };

  var res = function res(args, restart_debug) {
    if (!Alertify.debuggerInputArgsDialog) {
      Alertify.dialog('debuggerInputArgsDialog', function factory() {
        return {
          main: function main(title, data, restart_debug) {
            this.set('title', title);
            this.data = data;
            this.restart_debug = restart_debug;

            // Variables to store the data sent from sqlite database
            var func_args_data = this.func_args_data = [];

            // As we are not getting pgBrowser.tree when we debug again so tree info will be updated from the server data
            if (restart_debug == 0) {
              var t = pgBrowser.tree,
                  i = t.selected(),
                  d = i && i.length == 1 ? t.itemData(i) : undefined,
                  node = d && pgBrowser.Nodes[d._type];

              if (!d) return;

              var treeInfo = node.getTreeNodeHierarchy.apply(node, [i]);

              if (d._type == "function") {
                // Get the existing function parameters available from sqlite database
                var _Url = url_for('debugger.get_arguments', {
                  'sid': treeInfo.server._id,
                  'did': treeInfo.database._id,
                  'scid': treeInfo.schema._id,
                  'func_id': treeInfo.function._id
                });
              } else if (d._type == "procedure") {
                // Get the existing function parameters available from sqlite database
                var _Url = url_for('debugger.get_arguments', {
                  'sid': treeInfo.server._id,
                  'did': treeInfo.database._id,
                  'scid': treeInfo.schema._id,
                  'func_id': treeInfo.procedure._id
                });
              } else if (d._type == "edbfunc") {
                // Get the existing function parameters available from sqlite database
                var _Url = url_for('debugger.get_arguments', {
                  'sid': treeInfo.server._id,
                  'did': treeInfo.database._id,
                  'scid': treeInfo.schema._id,
                  'func_id': treeInfo.edbfunc._id
                });
              } else if (d._type == "edbproc") {
                // Get the existing function parameters available from sqlite database
                var _Url = url_for('debugger.get_arguments', {
                  'sid': treeInfo.server._id,
                  'did': treeInfo.database._id,
                  'scid': treeInfo.schema._id,
                  'func_id': treeInfo.edbproc._id
                });
              }
            } else {
              // Get the existing function parameters available from sqlite database
              var _Url = url_for('debugger.get_arguments', {
                'sid': this.data.server_id,
                'did': this.data.database_id,
                'scid': this.data.schema_id,
                'func_id': this.data.function_id
              });
            }
            $.ajax({
              url: _Url,
              method: 'GET',
              async: false,
              success: function success(res) {
                if (res.data.args_count != 0) {
                  for (i = 0; i < res.data.result.length; i++) {
                    // Below will format the data to be stored in sqlite database
                    func_args_data.push({
                      'arg_id': res.data.result[i]['arg_id'],
                      'is_null': res.data.result[i]['is_null'],
                      'is_expression': res.data.result[i]['is_expression'],
                      'use_default': res.data.result[i]['use_default'],
                      'value': res.data.result[i]['value']
                    });
                  }
                }
              },
              error: function error(e) {
                Alertify.alert('Debugger Set arguments error');
              }
            });

            var argname, argtype, argmode, default_args_count, default_args, arg_cnt;

            var value_header = Backgrid.HeaderCell.extend({
              // Add fixed width to the "value" column
              className: 'width_percent_25'
            });

            var def_val_list = [],
                gridCols = [{ name: 'name', label: 'Name', type: 'text', editable: false, cell: 'string' }, { name: 'type', label: 'Type', type: 'text', editable: false, cell: 'string' }, { name: 'is_null', label: 'Null?', type: 'boolean', cell: 'boolean' }, { name: 'expr', label: 'Expression?', type: 'boolean', cellFunction: cellExprControlFunction, editable: disableExpressionControl }, { name: 'value', label: 'Value', type: 'text', editable: true, cellFunction: cellFunction, headerCell: value_header }, { name: 'use_default', label: 'Use Default?', type: 'boolean', cell: "boolean", editable: disableDefaultCell }, { name: 'default_value', label: 'Default value', type: 'text', editable: false, cell: 'string' }];

            var my_obj = [];
            var func_obj = [];

            // Below will calculate the input argument id required to store in sqlite database
            var input_arg_id = this.input_arg_id = [];
            if (this.data['proargmodes'] != null) {
              var argmode_1 = this.data['proargmodes'].split(",");
              for (var k = 0; k < argmode_1.length; k++) {
                if (argmode_1[k] == 'i' || argmode_1[k] == 'b') {
                  input_arg_id.push(k);
                }
              }
            } else {
              var argtype_1 = this.data['proargtypenames'].split(",");
              for (var k = 0; k < argtype_1.length; k++) {
                input_arg_id.push(k);
              }
            }

            argtype = this.data['proargtypenames'].split(",");

            if (this.data['proargmodes'] != null) {
              argmode = this.data['proargmodes'].split(",");
            }

            if (this.data['pronargdefaults']) {
              default_args_count = this.data['pronargdefaults'];
              default_args = this.data['proargdefaults'].split(",");
              arg_cnt = default_args_count;
            }

            if (this.data['proargnames'] != null) {
              argname = this.data['proargnames'].split(",");

              // It will assign default values to "Default value" column
              for (var j = argname.length - 1; j >= 0; j--) {
                if (this.data['proargmodes'] != null) {
                  if (arg_cnt && (argmode[j] == 'i' || argmode[j] == 'b')) {
                    arg_cnt = arg_cnt - 1;
                    def_val_list[j] = default_args[arg_cnt];
                  } else {
                    def_val_list[j] = "<No default value>";
                  }
                } else {
                  if (arg_cnt) {
                    arg_cnt = arg_cnt - 1;
                    def_val_list[j] = default_args[arg_cnt];
                  } else {
                    def_val_list[j] = "<No default value>";
                  }
                }
              }

              if (argtype.length != 0) {
                for (i = 0; i < argtype.length; i++) {
                  if (this.data['proargmodes'] != null) {
                    if (argmode[i] == 'i' || argmode[i] == 'b') {
                      var use_def_value = false;
                      if (def_val_list[i] != "<No default value>") {
                        use_def_value = true;
                      }
                      my_obj.push({ "name": argname[i], "type": argtype[i], "use_default": use_def_value, "default_value": def_val_list[i] });
                    }
                  } else {
                    var use_def_value = false;
                    if (def_val_list[i] != "<No default value>") {
                      use_def_value = true;
                    }
                    my_obj.push({ "name": argname[i], "type": argtype[i], "use_default": use_def_value, "default_value": def_val_list[i] });
                  }
                }
              }

              // Need to update the func_obj variable from sqlite database if available
              if (func_args_data.length != 0) {
                for (i = 0; i < func_args_data.length; i++) {
                  var index = func_args_data[i]['arg_id'];
                  var values = [];
                  if (argtype[index].indexOf("[]") != -1) {
                    var vals = func_args_data[i]['value'].split(",");
                    if (argtype[index].indexOf("integer") != -1) {
                      _.each(vals, function (val) {
                        values.push({ 'value': parseInt(val) });
                      });
                    }
                    _.each(vals, function (val) {
                      values.push({ 'value': val });
                    });
                  } else {
                    values = func_args_data[i]['value'];
                  }

                  func_obj.push({ "name": argname[index], "type": argtype[index], "is_null": func_args_data[i]['is_null'] ? true : false, "expr": func_args_data[i]['is_expression'] ? true : false, "value": values, "use_default": func_args_data[i]['use_default'] ? true : false, "default_value": def_val_list[index] });
                }
              }
            } else {
              /*
               Generate the name parameter if function do not have arguments name
               like dbgparam1, dbgparam2 etc.
              */
              var myargname = [];

              for (i = 0; i < argtype.length; i++) {
                myargname[i] = "dbgparam" + (i + 1);
              }

              // If there is no default arguments
              if (!this.data['pronargdefaults']) {
                for (i = 0; i < argtype.length; i++) {
                  my_obj.push({ "name": myargname[i], "type": argtype[i], "use_default": false, "default_value": "<No default value>" });
                  def_val_list[i] = "<No default value>";
                }
              } else {
                // If there is default arguments
                //Below logic will assign default values to "Default value" column
                for (var j = myargname.length - 1; j >= 0; j--) {
                  if (this.data['proargmodes'] == null) {
                    if (arg_cnt) {
                      arg_cnt = arg_cnt - 1;
                      def_val_list[j] = default_args[arg_cnt];
                    } else {
                      def_val_list[j] = "<No default value>";
                    }
                  } else {
                    if (arg_cnt && (argmode[j] == 'i' || argmode[j] == 'b')) {
                      arg_cnt = arg_cnt - 1;
                      def_val_list[j] = default_args[arg_cnt];
                    } else {
                      def_val_list[j] = "<No default value>";
                    }
                  }
                }

                for (i = 0; i < argtype.length; i++) {
                  if (this.data['proargmodes'] == null) {
                    var use_def_value = false;
                    if (def_val_list[i] != "<No default value>") {
                      use_def_value = true;
                    }
                    my_obj.push({ "name": myargname[i], "type": argtype[i], "use_default": use_def_value, "default_value": def_val_list[i] });
                  } else {
                    if (argmode[i] == 'i' || argmode[i] == 'b') {
                      var use_def_value = false;
                      if (def_val_list[i] != "<No default value>") {
                        use_def_value = true;
                      }
                      my_obj.push({ "name": myargname[i], "type": argtype[i], "use_default": use_def_value, "default_value": def_val_list[i] });
                    }
                  }
                }
              }

              // Need to update the func_obj variable from sqlite database if available
              if (func_args_data.length != 0) {
                for (i = 0; i < func_args_data.length; i++) {
                  var index = func_args_data[i]['arg_id'];
                  var values = [];
                  if (argtype[index].indexOf("[]") != -1) {
                    var vals = func_args_data[i]['value'].split(",");
                    if (argtype[index].indexOf("integer") != -1) {
                      _.each(vals, function (val) {
                        values.push({ 'value': parseInt(val) });
                      });
                    }
                    _.each(vals, function (val) {
                      values.push({ 'value': val });
                    });
                  } else {
                    values = func_args_data[i]['value'];
                  }
                  func_obj.push({ "name": myargname[index], "type": argtype[index], "is_null": func_args_data[i]['is_null'] ? true : false, "expr": func_args_data[i]['is_expression'] ? true : false, "value": values, "use_default": func_args_data[i]['use_default'] ? true : false, "default_value": def_val_list[index] });
                }
              }
            }

            // Check if the arguments already available in the sqlite database then we should use the existing arguments
            if (func_args_data.length == 0) {
              var debuggerInputArgsColl = this.debuggerInputArgsColl = new DebuggerInputArgCollections(my_obj);
            } else {
              var debuggerInputArgsColl = this.debuggerInputArgsColl = new DebuggerInputArgCollections(func_obj);
            }

            // Initialize a new Grid instance
            if (this.grid) {
              this.grid.remove();
              this.grid = null;
            }
            var grid = this.grid = new Backgrid.Grid({
              columns: gridCols,
              collection: debuggerInputArgsColl,
              className: "backgrid table-bordered"
            });

            grid.render();
            $(this.elements.content).html(grid.el);
          },
          setup: function setup() {
            return {
              buttons: [{ text: "Debug", key: 13, className: "btn btn-primary" }, { text: "Cancel", key: 27, className: "btn btn-primary" }],
              options: { modal: 0, resizable: true }
            };
          },
          // Callback functions when click on the buttons of the Alertify dialogs
          callback: function callback(e) {
            if (e.button.text === "Debug") {

              // Initialize the target once the debug button is clicked and
              // create asynchronous connection and unique transaction ID
              var self = this;

              // If the debugging is started again then treeInfo is already stored in this.data so we can use the same.
              if (self.restart_debug == 0) {
                var t = pgBrowser.tree,
                    i = t.selected(),
                    d = i && i.length == 1 ? t.itemData(i) : undefined,
                    node = d && pgBrowser.Nodes[d._type];

                if (!d) return;

                var treeInfo = node.getTreeNodeHierarchy.apply(node, [i]);
              }

              var args_value_list = [];
              var sqlite_func_args_list = this.sqlite_func_args_list = [];
              var int_count = 0;

              this.grid.collection.each(function (m) {

                // Check if value is set to NULL then we should ignore the value field
                if (m.get('is_null')) {
                  args_value_list.push({ 'name': m.get('name'),
                    'type': m.get('type'),
                    'value': 'NULL' });
                } else {
                  // Check if default value to be used or not
                  if (m.get('use_default')) {
                    args_value_list.push({ 'name': m.get('name'),
                      'type': m.get('type'),
                      'value': m.get('default_value') });
                  } else {
                    args_value_list.push({ 'name': m.get('name'),
                      'type': m.get('type'),
                      'value': m.get('value') });
                  }
                }

                if (self.restart_debug == 0) {
                  var f_id;
                  if (d._type == "function") {
                    f_id = treeInfo.function._id;
                  } else if (d._type == "procedure") {
                    f_id = treeInfo.procedure._id;
                  } else if (d._type == "edbfunc") {
                    f_id = treeInfo.edbfunc._id;
                  } else if (d._type == "edbproc") {
                    f_id = treeInfo.edbproc._id;
                  }

                  // Below will format the data to be stored in sqlite database
                  sqlite_func_args_list.push({
                    'server_id': treeInfo.server._id,
                    'database_id': treeInfo.database._id,
                    'schema_id': treeInfo.schema._id,
                    'function_id': f_id,
                    'arg_id': self.input_arg_id[int_count],
                    'is_null': m.get('is_null') ? 1 : 0,
                    'is_expression': m.get('expr') ? 1 : 0,
                    'use_default': m.get('use_default') ? 1 : 0,
                    'value': m.get('value')
                  });
                } else {
                  // Below will format the data to be stored in sqlite database
                  sqlite_func_args_list.push({
                    'server_id': self.data.server_id,
                    'database_id': self.data.database_id,
                    'schema_id': self.data.schema_id,
                    'function_id': self.data.function_id,
                    'arg_id': self.input_arg_id[int_count],
                    'is_null': m.get('is_null') ? 1 : 0,
                    'is_expression': m.get('expr') ? 1 : 0,
                    'use_default': m.get('use_default') ? 1 : 0,
                    'value': m.get('value')
                  });
                }

                int_count = int_count + 1;
              });

              // If debugging is not started again then we should initialize the target otherwise not
              if (self.restart_debug == 0) {
                var baseUrl;
                if (d._type == "function") {
                  baseUrl = url_for('debugger.initialize_target_for_function', {
                    'debug_type': 'direct',
                    'sid': treeInfo.server._id,
                    'did': treeInfo.database._id,
                    'scid': treeInfo.schema._id,
                    'func_id': treeInfo.function._id
                  });
                } else if (d._type == "procedure") {
                  baseUrl = url_for('debugger.initialize_target_for_function', {
                    'debug_type': 'direct',
                    'sid': treeInfo.server._id,
                    'did': treeInfo.database._id,
                    'scid': treeInfo.schema._id,
                    'func_id': treeInfo.procedure._id
                  });
                } else if (d._type == "edbfunc") {
                  baseUrl = url_for('debugger.initialize_target_for_function', {
                    'debug_type': 'direct',
                    'sid': treeInfo.server._id,
                    'did': treeInfo.database._id,
                    'scid': treeInfo.schema._id,
                    'func_id': treeInfo.edbfunc._id
                  });
                } else if (d._type == "edbproc") {
                  baseUrl = url_for('debugger.initialize_target_for_function', {
                    'debug_type': 'direct',
                    'sid': treeInfo.server._id,
                    'did': treeInfo.database._id,
                    'scid': treeInfo.schema._id,
                    'func_id': treeInfo.edbproc._id
                  });
                }

                $.ajax({
                  url: baseUrl,
                  method: 'POST',
                  data: { 'data': JSON.stringify(args_value_list) },
                  success: function success(res) {

                    var url = url_for('debugger.direct', { 'trans_id': res.data.debuggerTransId });

                    if (res.data.newBrowserTab) {
                      window.open(url, '_blank');
                    } else {
                      pgBrowser.Events.once('pgadmin-browser:frame:urlloaded:frm_debugger', function (frame) {
                        frame.openURL(url);
                      });

                      // Create the debugger panel as per the data received from user input dialog.
                      var dashboardPanel = pgBrowser.docker.findPanels('properties'),
                          panel = pgBrowser.docker.addPanel('frm_debugger', wcDocker.DOCK.STACKED, dashboardPanel[0]);

                      panel.focus();

                      // Panel Closed event
                      panel.on(wcDocker.EVENT.CLOSED, function () {
                        var closeUrl = url_for('debugger.close', { 'trans_id': res.data.debuggerTransId });
                        $.ajax({
                          url: closeUrl,
                          method: 'DELETE'
                        });
                      });
                    }

                    if (d._type == "function") {
                      var _Url = url_for('debugger.set_arguments', {
                        'sid': treeInfo.server._id,
                        'did': treeInfo.database._id,
                        'scid': treeInfo.schema._id,
                        'func_id': treeInfo.function._id
                      });
                    } else if (d._type == "procedure") {
                      var _Url = url_for('debugger.set_arguments', {
                        'sid': treeInfo.server._id,
                        'did': treeInfo.database._id,
                        'scid': treeInfo.schema._id,
                        'func_id': treeInfo.procedure._id
                      });
                    } else if (d._type == "edbfunc") {
                      // Get the existing function parameters available from sqlite database
                      var _Url = url_for('debugger.set_arguments', {
                        'sid': treeInfo.server._id,
                        'did': treeInfo.database._id,
                        'scid': treeInfo.schema._id,
                        'func_id': treeInfo.edbfunc._id
                      });
                    } else if (d._type == "edbproc") {
                      // Get the existing function parameters available from sqlite database
                      var _Url = url_for('debugger.set_arguments', {
                        'sid': treeInfo.server._id,
                        'did': treeInfo.database._id,
                        'scid': treeInfo.schema._id,
                        'func_id': treeInfo.edbproc._id
                      });
                    }

                    $.ajax({
                      url: _Url,
                      method: 'POST',
                      data: { 'data': JSON.stringify(sqlite_func_args_list) },
                      success: function success(res) {},
                      error: function error(e) {
                        Alertify.alert('Debugger Set arguments error');
                      }
                    });
                  },
                  error: function error(e) {
                    Alertify.alert('Debugger target Initialize Error', e.responseJSON.errormsg);
                  }
                });
              } else {
                // If the debugging is started again then we should only set the arguments and start the listener again
                var baseUrl = url_for('debugger.start_listener', { 'trans_id': self.data.trans_id });

                $.ajax({
                  url: baseUrl,
                  method: 'POST',
                  data: { 'data': JSON.stringify(args_value_list) },
                  success: function success(res) {},
                  error: function error(e) {
                    Alertify.alert('Debugger listener starting error', e.responseJSON.errormsg);
                  }
                });

                // Set the new input arguments given by the user during debugging
                var _Url = url_for('debugger.set_arguments', {
                  'sid': self.data.server_id,
                  'did': self.data.database_id,
                  'scid': self.data.schema_id,
                  'func_id': self.data.function_id
                });
                $.ajax({
                  url: _Url,
                  method: 'POST',
                  data: { 'data': JSON.stringify(sqlite_func_args_list) },
                  success: function success(res) {},
                  error: function error(e) {
                    Alertify.alert('Debugger Set arguments error');
                  }
                });
              }

              return true;
            }

            if (e.button.text === "Cancel") {
              //close the dialog...
              return false;
            }
          },
          build: function build() {},
          prepare: function prepare() {
            /*
             If we already have data available in sqlite database then we should enable the debug button otherwise
             disable the debug button.
            */
            if (this.func_args_data.length == 0) {
              this.__internal.buttons[0].element.disabled = true;
            } else {
              this.__internal.buttons[0].element.disabled = false;
            }

            /*
             Listen to the grid change event so that if any value changed by user then we can enable/disable the
             debug button.
            */
            this.grid.listenTo(this.debuggerInputArgsColl, "backgrid:edited", function (obj) {

              return function () {

                var self = this;
                var enable_btn = false;

                for (var i = 0; i < this.collection.length; i++) {

                  // TODO: Need to check the "NULL" and "Expression" column value to enable/disable the "Debug" button
                  if (this.collection.models[i].get('value') == "" || this.collection.models[i].get('value') == null || this.collection.models[i].get('value') == undefined) {
                    enable_btn = true;

                    if (this.collection.models[i].get('use_default')) {
                      obj.__internal.buttons[0].element.disabled = false;
                    } else {
                      obj.__internal.buttons[0].element.disabled = true;
                      break;
                    }
                  }
                }
                if (!enable_btn) obj.__internal.buttons[0].element.disabled = false;
              };
            }(this));
          }
        };
      });
    }

    Alertify.debuggerInputArgsDialog('Debugger', args, restart_debug).resizeTo('60%', '60%');
  };

  return res;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

},[160])["default"]});;
//# sourceMappingURL=debugger_direct.js.map