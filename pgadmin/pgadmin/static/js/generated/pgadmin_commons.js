webpackJsonp([6],{

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(3), __webpack_require__(30)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, pgAdmin) {

  var pgBrowser = pgAdmin.Browser = pgAdmin.Browser || {};

  pgAdmin.Browser.Panel = function (options) {
    var defaults = ['name', 'title', 'width', 'height', 'showTitle', 'isCloseable', 'isPrivate', 'content', 'icon', 'events', 'onCreate', 'elContainer', 'canHide', 'limit'];
    _.extend(this, _.pick(options, defaults));
  };

  _.extend(pgAdmin.Browser.Panel.prototype, {
    name: '',
    title: '',
    width: 300,
    height: 600,
    showTitle: true,
    isCloseable: true,
    isPrivate: false,
    content: '',
    icon: '',
    panel: null,
    onCreate: null,
    elContainer: false,
    limit: null,
    load: function load(docker, title) {
      var that = this;
      if (!that.panel) {
        docker.registerPanelType(that.name, {
          title: that.title,
          isPrivate: that.isPrivate,
          limit: that.limit,
          onCreate: function onCreate(myPanel) {
            $(myPanel).data('pgAdminName', that.name);
            myPanel.initSize(that.width, that.height);

            if (!that.showTitle) myPanel.title(false);else {
              myPanel.title(title || that.title);
              if (that.icon != '') myPanel.icon(that.icon);
            }

            var $container = $('<div>', {
              'class': 'pg-panel-content'
            }).append($(that.content));

            myPanel.closeable(!!that.isCloseable);
            myPanel.layout().addItem($container);
            that.panel = myPanel;
            if (that.events && _.isObject(that.events)) {
              _.each(that.events, function (v, k) {
                if (v && _.isFunction(v)) {
                  myPanel.on(k, v);
                }
              });
            }
            _.each([wcDocker.EVENT.UPDATED, wcDocker.EVENT.VISIBILITY_CHANGED, wcDocker.EVENT.BEGIN_DOCK, wcDocker.EVENT.END_DOCK, wcDocker.EVENT.GAIN_FOCUS, wcDocker.EVENT.LOST_FOCUS, wcDocker.EVENT.CLOSED, wcDocker.EVENT.BUTTON, wcDocker.EVENT.ATTACHED, wcDocker.EVENT.DETACHED, wcDocker.EVENT.MOVE_STARTED, wcDocker.EVENT.MOVE_ENDED, wcDocker.EVENT.MOVED, wcDocker.EVENT.RESIZE_STARTED, wcDocker.EVENT.RESIZE_ENDED, wcDocker.EVENT.RESIZED, wcDocker.EVENT.SCROLLED], function (ev) {
              myPanel.on(ev, that.eventFunc.bind(myPanel, ev));
            });

            if (that.onCreate && _.isFunction(that.onCreate)) {
              that.onCreate.apply(that, [myPanel, $container]);
            }

            if (that.elContainer) {
              myPanel.pgElContainer = $container;
              $container.addClass('pg-el-container');
              _.each([wcDocker.EVENT.RESIZED, wcDocker.EVENT.ATTACHED, wcDocker.EVENT.DETACHED, wcDocker.EVENT.VISIBILITY_CHANGED], function (ev) {
                myPanel.on(ev, that.resizedContainer.bind(myPanel));
              });
              that.resizedContainer.apply(myPanel);
            }

            // Bind events only if they are configurable
            if (that.canHide) {
              _.each([wcDocker.EVENT.CLOSED, wcDocker.EVENT.VISIBILITY_CHANGED], function (ev) {
                myPanel.on(ev, that.handleVisibility.bind(myPanel, ev));
              });
            }
          }
        });
      }
    },
    eventFunc: function eventFunc(eventName) {
      var name = $(this).data('pgAdminName');

      try {
        pgBrowser.Events.trigger('pgadmin-browser:panel', eventName, this, arguments);
        pgBrowser.Events.trigger('pgadmin-browser:panel:' + eventName, this, arguments);

        if (name) {
          pgBrowser.Events.trigger('pgadmin-browser:panel-' + name, eventName, this, arguments);
          pgBrowser.Events.trigger('pgadmin-browser:panel-' + name + ':' + eventName, this, arguments);
        }
      } catch (e) {
        console.log(e);
      }
    },
    resizedContainer: function resizedContainer() {
      var p = this;

      if (p.pgElContainer && !p.pgResizeTimeout) {
        if (!p.isVisible()) {
          clearTimeout(p.pgResizeTimeout);
          p.pgResizeTimeout = null;

          return;
        }
        p.pgResizeTimeout = setTimeout(function () {
          var w = p.width();
          p.pgResizeTimeout = null;

          if (w <= 480) {
            w = 'xs';
          } else if (w < 600) {
            w = 'sm';
          } else if (w < 768) {
            w = 'md';
          } else {
            w = 'lg';
          }

          p.pgElContainer.attr('el', w);
        }, 100);
      }
    },
    handleVisibility: function handleVisibility(eventName) {
      // Currently this function only works with dashboard panel but
      // as per need it can be extended
      if (this._type != 'dashboard' || _.isUndefined(pgAdmin.Dashboard)) return;

      if (eventName == 'panelClosed') {
        pgBrowser.save_current_layout(pgBrowser);
        pgAdmin.Dashboard.toggleVisibility(false);
      } else if (eventName == 'panelVisibilityChanged') {
        if (pgBrowser.tree) {
          pgBrowser.save_current_layout(pgBrowser);
          var selectedNode = pgBrowser.tree.selected();
          // Discontinue this event after first time visible
          this.off(wcDocker.EVENT.VISIBILITY_CHANGED);
          if (!_.isUndefined(pgAdmin.Dashboard)) pgAdmin.Dashboard.toggleVisibility(true);
          // Explicitly trigger tree selected event when we add the tab.
          pgBrowser.Events.trigger('pgadmin-browser:tree:selected', selectedNode, pgBrowser.tree.itemData(selectedNode), pgBrowser.Node);
        }
      }
    }

  });

  return pgAdmin.Browser.Panel;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($, _) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(8), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, alertify, S) {
  alertify.defaults.transition = "zoom";
  alertify.defaults.theme.ok = "btn btn-primary";
  alertify.defaults.theme.cancel = "btn btn-danger";
  alertify.defaults.theme.input = "form-control";
  alertify.pgIframeDialog || alertify.dialog('pgIframeDialog', function () {
    var iframe;
    return {
      // dialog constructor function, this will be called when the user calls
      // alertify.pgIframeDialog(message)
      main: function main(message) {
        //set the videoId setting and return current instance for chaining.
        return this.set({
          'pg_msg': message
        });
      },
      // we only want to override two options (padding and overflow).
      setup: function setup() {
        return {
          options: {
            //disable both padding and overflow control.
            padding: !1,
            overflow: !1
          }
        };
      },
      // This will be called once the DOM is ready and will never be invoked
      // again. Here we create the iframe to embed the video.
      build: function build() {
        // create the iframe element
        iframe = document.createElement('iframe');

        iframe.src = "";
        iframe.frameBorder = "no";
        iframe.width = "100%";
        iframe.height = "100%";

        // add it to the dialog
        this.elements.content.appendChild(iframe);

        //give the dialog initial height (half the screen height).
        this.elements.body.style.minHeight = screen.height * .5 + 'px';
      },
      // dialog custom settings
      settings: {
        pg_msg: undefined
      },
      // listen and respond to changes in dialog settings.
      settingUpdated: function settingUpdated(key, oldValue, newValue) {
        switch (key) {
          case 'pg_msg':
            var doc = iframe.contentWindow || iframe.contentDocument;
            if (doc.document) {
              doc = doc.document;
            }

            doc.open();
            doc.write(newValue);
            doc.close();

            break;
        }
      },
      // listen to internal dialog events.
      hooks: {
        // triggered when a dialog option gets update.
        // warning! this will not be triggered for settings updates.
        onupdate: function onupdate(option, oldValue, newValue) {
          switch (option) {
            case 'resizable':
              if (newValue) {
                this.elements.content.removeAttribute('style');
                iframe && iframe.removeAttribute('style');
              } else {
                this.elements.content.style.minHeight = 'inherit';
                iframe && (iframe.style.minHeight = 'inherit');
              }
              break;
          }
        }
      }
    };
  });
  alertify.pgNotifier = function (type, xhr, promptmsg, onJSONResult) {
    var msg = xhr.responseText,
        contentType = xhr.getResponseHeader('Content-Type');

    if (xhr.status == 0) {
      msg = gettext('Connection to the server has been lost.');
      promptmsg = gettext('Connection Lost');
    } else {
      if (contentType) {
        try {
          if (contentType.indexOf('application/json') == 0) {
            var resp = $.parseJSON(msg);

            if (resp.result != null && (!resp.errormsg || resp.errormsg == '') && onJSONResult && typeof onJSONResult == 'function') {
              return onJSONResult(resp.result);
            }
            msg = _.escape(resp.result) || _.escape(resp.errormsg) || "Unknown error";
          }
          if (contentType.indexOf('text/html') == 0) {
            var alertMessage = promptmsg;
            if (type === 'error') {
              alertMessage = '\
                  <div class="media font-red-3 text-14">\
                    <div class="media-body media-middle">\
                      <div class="alert-text">' + promptmsg + '</div><br/>\
                      <div class="alert-text">' + gettext('Click for details.') + '</div>\
                    </div>\
                  </div>';
            }

            alertify.notify(alertMessage, type, 0, function () {
              alertify.pgIframeDialog().show().set({ frameless: false }).set('pg_msg', msg);
            });
            return;
          }
        } catch (e) {
          alertify.alert().show().set('message', e.message).set('title', "Error");
        }
      }
    }
    alertify.alert().show().set('message', msg.replace(new RegExp('\r?\n', 'g'), '<br />')).set('title', promptmsg);
  };

  var alertifyDialogResized = function alertifyDialogResized(stop) {
    var self = this;

    if (stop) {
      self.pgResizeRecursion = false;
    }

    if (self.pgResizeTimeout) {
      return;
    }

    self.pgResizeTimeout = setTimeout(function () {
      var $el = $(this.elements.dialog),
          w = $el.width();

      this.pgResizeTimeout = null;

      if (w <= 480) {
        w = 'xs';
      } else if (w < 600) {
        w = 'sm';
      } else if (w < 768) {
        w = 'md';
      } else {
        w = 'lg';
      }

      $el.attr('el', w);
    }.bind(self), 100);
  };

  var alertifyDialogStartResizing = function alertifyDialogStartResizing(start) {
    var self = this;

    if (start) {
      self.pgResizeRecursion = true;
    }

    setTimeout(function () {
      alertifyDialogResized.apply(self);

      if (self.pgResizeRecursion) {
        alertifyDialogStartResizing.apply(self, [false]);
      }
    }, 100);
  };

  alertify.pgDialogBuild = function () {
    this.set('onshow', function () {
      this.elements.dialog.classList.add('pg-el-container');
      alertifyDialogResized.apply(this, arguments);
    });
    this.set('onresize', alertifyDialogStartResizing.bind(this, true));
    this.set('onresized', alertifyDialogResized.bind(this, true));
    this.set('onmaximized', alertifyDialogResized);
    this.set('onrestored', alertifyDialogResized);
  };

  alertify.pgHandleItemError = function (xhr, error, message, args) {
    var pgBrowser = window.pgAdmin.Browser;

    if (!xhr || !pgBrowser) {
      return;
    }

    var msg = xhr.responseText,
        contentType = xhr.getResponseHeader('Content-Type'),
        msg = xhr.responseText,
        jsonResp = contentType && contentType.indexOf('application/json') == 0 && $.parseJSON(xhr.responseText);

    if (jsonResp && (xhr.status == 503 ? jsonResp.info == 'CONNECTION_LOST' && 'server' in args.info && jsonResp.data.sid >= 0 && jsonResp.data.sid == args.info.server._id : xhr.status == 428 && jsonResp.errormsg && jsonResp.errormsg == gettext("Connection to the server has been lost."))) {
      if (args.preHandleConnectionLost && typeof args.preHandleConnectionLost == 'function') {
        args.preHandleConnectionLost.apply(this, arguments);
      }

      // Check the status of the maintenance server connection.
      var server = pgBrowser.Nodes['server'],
          ctx = {
        resp: jsonResp,
        xhr: xhr,
        args: args
      },
          reconnectServer = function () {
        var ctx = this,
            onServerConnect = function (_sid, _i, _d) {
          // Yay - server is reconnected.
          if (this.args.info.server._id == _sid) {
            pgBrowser.Events.off('pgadmin:server:connected', onServerConnect);
            pgBrowser.Events.off('pgadmin:server:connect:cancelled', onConnectCancel);

            // Do we need to connect the disconnected server now?
            if (this.resp.data.database && this.resp.data.database != _d.db) {
              // Server is connected now, we will need to inform the
              // database to connect it now.
              pgBrowser.Events.trigger('pgadmin:database:connection:lost', this.args.item, this.resp, true);
            }
          }
        }.bind(ctx),
            onConnectCancel = function (_sid, _item, _data) {
          // User has cancelled the operation in between.
          if (_sid == this.args.info.server.id) {
            pgBrowser.Events.off('pgadmin:server:connected', onServerConnect);
            pgBrowser.Events.off('pgadmin:server:connect:cancelled', onConnectCancel);

            // Connection to the database will also be cancelled
            pgBrowser.Events.trigger('pgadmin:database:connect:cancelled', _sid, this.resp.data.database || _data.db, _item, _data);
          }
        }.bind(ctx);

        pgBrowser.Events.on('pgadmin:server:connected', onServerConnect);
        pgBrowser.Events.on('pgadmin:server:connect:cancelled', onConnectCancel);

        // Connection to the server has been lost, we need to inform the
        // server first to take the action first.
        pgBrowser.Events.trigger('pgadmin:server:connection:lost', this.args.item, this.resp);
      }.bind(ctx);

      $.ajax({
        url: server.generate_url(null, 'connect', args.info.server, true, args.info),
        dataType: 'json',
        success: function success(res) {
          if (res.success && 'connected' in res.data) {
            if (res.data.connected) {
              // Server is connected, but - the connection with the
              // particular database has been lost.
              pgBrowser.Events.trigger('pgadmin:database:connection:lost', args.item, jsonResp);
              return;
            }
          }

          // Serever was not connected, we should first try to connect
          // the server.
          reconnectServer();
        },
        error: function error() {
          reconnectServer();
        }
      });
      return true;
    }
    return false;
  };

  var alertifySuccess = alertify.success,
      alertifyError = alertify.error;

  /*
  For adding the jasmine test cases, we needed to refer the original success,
   and error functions, as orig_success and orig_error respectively.
  */
  _.extend(alertify, {
    orig_success: alertifySuccess, orig_error: alertifyError
  });

  _.extend(alertify, {
    success: function success(message, timeout, callback) {
      var alertMessage = '\
      <div class="media font-green-3 text-14">\
        <div class="media-body media-middle">\
          <div class="alert-icon success-icon">\
            <i class="fa fa-check" aria-hidden="true"></i>\
          </div>\
            <div class="alert-text">' + message + '</div>\
        </div>\
      </div>';
      return alertify.orig_success(alertMessage, timeout, callback);
    },
    error: function error(message, timeout, callback) {
      var alertMessage = '\
      <div class="media font-red-3 text-14">\
        <div class="media-body media-middle">\
          <div class="alert-icon error-icon">\
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>\
          </div>\
            <div class="alert-text">' + message + '</div>\
        </div>\
      </div>';
      return alertify.orig_error(alertMessage, timeout, callback);
    },
    info: function info(message, timeout) {
      var alertMessage = '\
      <div class="media alert-info font-blue text-14">\
        <div class="media-body media-middle">\
          <div class="alert-icon info-icon">\
            <i class="fa fa-info" aria-hidden="true"></i>\
          </div>\
            <div class="alert-text">' + message + '</div>\
        </div>\
      </div>';
      var alert = alertify.notify(alertMessage, timeout);
      return alert;
    }
  });

  return alertify;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),

/***/ 189:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(4), __webpack_require__(3), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, S, pgAdmin, $) {
  'use strict';

  pgAdmin.Browser = pgAdmin.Browser || {};

  // Individual menu-item class
  var MenuItem = pgAdmin.Browser.MenuItem = function (opts) {
    var menu_opts = ['name', 'label', 'priority', 'module', 'callback', 'data', 'enable', 'category', 'target', 'url' /* Do not show icon in the menus, 'icon' */, 'node'],
        defaults = {
      url: '#',
      target: '_self',
      enable: true
    };
    _.extend(this, defaults, _.pick(opts, menu_opts));
  };

  _.extend(pgAdmin.Browser.MenuItem.prototype, {
    /*
     *  Keeps track of the jQuery object representing this menu-item. This will
     *  be used by the update function to enable/disable the individual item.
     */
    $el: null,
    /*
     * Generate the UI for this menu-item. enable/disable, based on the
     * currently selected object.
     */
    generate: function generate(node, item) {
      this.create_el(node, item);

      this.context = {
        name: this.label,
        /* icon: this.icon || this.module && (this.module.type), */
        disabled: this.is_disabled,
        callback: this.context_menu_callback.bind(this, item)
      };

      return this.$el;
    },

    /*
     * Create the jquery element for the menu-item.
     */
    create_el: function create_el(node, item) {
      var url = $('<a></a>', {
        'id': this.name,
        'href': this.url,
        'target': this.target,
        'data-toggle': 'pg-menu'
      }).data('pgMenu', {
        module: this.module || pgAdmin.Browser,
        cb: this.callback,
        data: this.data
      }).addClass('menu-link');

      this.is_disabled = this.disabled(node, item);
      if (this.icon) {
        url.append($('<i></i>', { 'class': this.icon }));
      }

      var textSpan = $('<span data-test="menu-item-text"></span>').text('  ' + this.label);

      url.append(textSpan);

      this.$el = $('<li/>').addClass('menu-item' + (this.is_disabled ? ' disabled' : '')).append(url);

      this.applyStyle();
    },

    applyDisabledStyle: function applyDisabledStyle() {
      var span = this.$el.find('span');
      var icon = this.$el.find('i');

      span.addClass('font-gray-4');
      span.removeClass('font-white');
      icon.addClass('font-gray-4');
      icon.removeClass('font-white');
    },

    applyEnabledStyle: function applyEnabledStyle() {
      var element = this.$el;
      var span = this.$el.find('span');

      span.addClass('font-white');
      span.removeClass('font-gray-4');
      element.find('i').addClass('font-white');
      element.find('i').removeClass('font-gray-4');

      span.mouseover(function () {
        element.addClass('bg-gray-5');
      });
      span.mouseout(function () {
        element.removeClass('bg-gray-5');
      });
    },

    applyStyle: function applyStyle() {
      if (this.is_disabled) {
        this.applyDisabledStyle();
      } else {
        this.applyEnabledStyle();
      }
    },

    /*
     * Updates the enable/disable state of the menu-item based on the current
     * selection using the disabled function. This also creates a object
     * for this menu, which can be used in the context-menu.
     */
    update: function update(node, item) {

      if (this.$el && !this.$el.hasClass('disabled')) {
        this.$el.addClass('disabled');
      }

      this.is_disabled = this.disabled(node, item);
      if (this.$el && !this.is_disabled) {
        this.$el.removeClass('disabled');
      }

      if (this.$el) {
        this.applyStyle();
      }

      this.context = {
        name: this.label,
        /* icon: this.icon || (this.module && this.module.type), */
        disabled: this.is_disabled,
        callback: this.context_menu_callback.bind(this, item)
      };
    },

    /*
     * This will be called when context-menu is clicked.
     */
    context_menu_callback: function context_menu_callback(item) {
      var o = this,
          cb;

      if (o.module['callbacks'] && o.callback in o.module['callbacks']) {
        cb = o.module['callbacks'][o.callback];
      } else if (o.callback in o.module) {
        cb = o.module[o.callback];
      }
      if (cb) {
        cb.apply(o.module, [o.data, item]);
      } else {
        pgAdmin.Browser.report_error(S('Developer Warning: Callback - "%s" not found!').sprintf(o.cb).value());
      }
    },

    /*
     * Checks this menu enable/disable state based on the selection.
     */
    disabled: function disabled(node, item) {
      if (this.enable == undefined) {
        return false;
      }

      if (this.node) {
        if (!node) {
          return true;
        }
        if (_.isArray(this.node) ? _.indexOf(this.node, node) == -1 : this.node != node._type) {
          return true;
        }
      }

      if (_.isBoolean(this.enable)) return !this.enable;
      if (_.isFunction(this.enable)) return !this.enable.apply(this.module, [node, item, this.data]);
      if (this.module && _.isBoolean(this.module[this.enable])) return !this.module[this.enable];
      if (this.module && _.isFunction(this.module[this.enable])) return !this.module[this.enable].apply(this.module, [node, item, this.data]);

      return false;
    }
  });

  /*
   * This a class for creating a menu group, mainly used by the submenu
   * creation logic.
   *
   * Arguments:
   * 1. Options to render the submenu DOM Element.
   *    i.e. label, icon, above (separator), below (separator)
   * 2. List of menu-items comes under this submenu.
   * 3. Did we rendered separator after the menu-item/submenu?
   * 4. A unique-id for this menu-item.
   *
   * Returns a object, similar to the menu-item, which has his own jQuery
   * Element, context menu representing object, etc.
   *
   */

  pgAdmin.Browser.MenuGroup = function (opts, items, prev, ctx) {
    var template = _.template(['<% if (above) { %><hr><% } %>', '<li class="menu-item dropdown dropdown-submenu">', ' <a href="#" class="dropdown-toggle" data-toggle="dropdown">', '  <% if (icon) { %><i class="<%= icon %>"></i><% } %>', '  <span><%= label %></span>', ' </a>', ' <ul class="dropdown-menu navbar-inverse">', ' </ul>', '</li>', '<% if (below) { %><hr><% } %>'].join('\n')),
        data = {
      'label': opts.label,
      'icon': opts.icon,
      'above': opts.above && !prev,
      'below': opts.below
    },
        m,
        $el = $(template(data)),
        $menu = $el.find('.dropdown-menu'),
        submenus = {},
        ctxId = 1;

    ctx = _.uniqueId(ctx + '_sub_');

    // Sort by alphanumeric ordered first
    items.sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
    // Sort by priority
    items.sort(function (a, b) {
      return a.priority - b.priority;
    });

    for (var idx in items) {
      m = items[idx];
      $menu.append(m.$el);
      if (!m.is_disabled) {
        submenus[ctx + ctxId] = m.context;
      }
      ctxId++;
    }

    var is_disabled = _.size(submenus) == 0;

    return {
      $el: $el,
      priority: opts.priority || 10,
      label: opts.label,
      above: data['above'],
      below: opts.below,
      is_disabled: is_disabled,
      context: {
        name: opts.label,
        icon: opts.icon,
        items: submenus,
        disabled: is_disabled
      }
    };
  };

  /*
   * A function to generate menus (submenus) based on the categories.
   * Attach the current selected browser tree node to each of the generated
   * menu-items.
   *
   * Arguments:
   * 1. jQuery Element on which you may want to created the menus
   * 2. list of menu-items
   * 3. categories - metadata information about the categories, based on which
   *                 the submenu (menu-group) will be created (if any).
   * 4. d - Data object for the selected browser tree item.
   * 5. item - The selected browser tree item
   * 6. menu_items - A empty object on which the context menu for the given
   *                 list of menu-items.
   *
   * Returns if any menu generated for the given input.
   */
  pgAdmin.Browser.MenuCreator = function ($mnu, menus, categories, d, item, menu_items) {
    var groups = { 'common': [] },
        common,
        idx = 0,
        j,
        item,
        ctxId = _.uniqueId('ctx_'),
        update_menuitem = function update_menuitem(m) {
      if (m instanceof MenuItem) {
        if (m.$el) {
          m.$el.remove();
          delete m.$el;
        }
        m.generate(d, item);
        var group = groups[m.category || 'common'] = groups[m.category || 'common'] || [];
        group.push(m);
      } else {
        for (var key in m) {
          update_menuitem(m[key]);
        }
      }
    },
        ctxIdx = 1;

    for (idx in menus) {
      update_menuitem(menus[idx]);
    }

    // Not all menu creator requires the context menu structure.
    menu_items = menu_items || {};

    common = groups['common'];
    delete groups['common'];

    var prev = true;

    for (name in groups) {
      var g = groups[name],
          c = categories[name] || { 'label': name, single: false },
          menu_group = pgAdmin.Browser.MenuGroup(c, g, prev, ctxId);

      if (g.length <= 1 && !c.single) {
        prev = false;
        for (idx in g) {
          common.push(g[idx]);
        }
      } else {
        prev = g.below;
        common.push(menu_group);
      }
    }

    // The menus will be created based on the priority given.
    // Menu with lowest value has the highest priority. If the priority is
    // same, then - it will be ordered by label.
    // Sort by alphanumeric ordered first
    common.sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
    // Sort by priority
    common.sort(function (a, b) {
      return a.priority - b.priority;
    });
    var len = _.size(common);

    for (idx in common) {
      item = common[idx];

      item.priority = item.priority || 10;
      $mnu.append(item.$el);
      var prefix = ctxId + '_' + item.priority + '_' + ctxIdx;

      if (ctxIdx != 1 && item.above && !item.is_disabled) {
        // For creatign the seprator any string will do.
        menu_items[prefix + '_ma'] = '----';
      }

      if (!item.is_disabled) {
        menu_items[prefix + '_ms'] = item.context;
      }

      if (ctxId != len && item.below && !item.is_disabled) {
        menu_items[prefix + '_mz'] = '----';
      }
      ctxIdx++;
    }

    return len > 0;
  };

  // MENU PUBLIC CLASS DEFINITION
  // ==============================
  var Menu = function Menu(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Menu.DEFAULTS, options);
    this.isLoading = false;
  };

  Menu.DEFAULTS = {};

  Menu.prototype.toggle = function (ev) {
    var $parent = this.$element.closest('.menu-item');
    if ($parent.hasClass('disabled')) {
      ev.preventDefault();
      return false;
    }
    var d = this.$element.data('pgMenu');
    if (d.cb) {
      var cb = d.module && d.module['callbacks'] && d.module['callbacks'][d.cb] || d.module && d.module[d.cb];
      if (cb) {
        cb.apply(d.module, [d.data, pgAdmin.Browser.tree.selected()]);
        ev.preventDefault();
      } else {
        pgAdmin.Browser.report_error('Developer Warning: Callback - "' + d.cb + '" not found!');
      }
    }
  };

  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option, ev) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('pg.menu');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('pg.menu', data = new Menu(this, options));

      data.toggle(ev);
    });
  }

  var old = $.fn.button;

  $.fn.pgmenu = Plugin;
  $.fn.pgmenu.Constructor = Menu;

  // BUTTON NO CONFLICT
  // ==================

  $.fn.pgmenu.noConflict = function () {
    $.fn.pgmenu = old;
    return this;
  };

  // MENU DATA-API
  // =============

  $(document).on('click.pg.menu.data-api', '[data-toggle^="pg-menu"]', function (ev) {
    var $menu = $(ev.target);
    if (!$menu.hasClass('menu-link')) $menu = $menu.closest('.menu-link');
    Plugin.call($menu, 'toggle', ev);
  }).on('focus.pg.menu.data-api blur.pg.menu.data-api', '[data-toggle^="pg-menu"]', function (e) {
    $(e.target).closest('.menu').toggleClass('focus', /^focus(in)?$/.test(e.type));
  });

  return pgAdmin.Browser.MenuItem;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 190:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(3), __webpack_require__(30)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, pgAdmin) {

  var pgBrowser = pgAdmin.Browser = pgAdmin.Browser || {};

  pgAdmin.Browser.Frame = function (options) {
    var defaults = ['name', 'title', 'width', 'height', 'showTitle', 'isCloseable', 'isPrivate', 'url', 'icon', 'onCreate'];
    _.extend(this, _.pick(options, defaults));
  };

  _.extend(pgAdmin.Browser.Frame.prototype, {
    name: '',
    title: '',
    width: 300,
    height: 600,
    showTitle: true,
    isClosable: true,
    isPrivate: false,
    url: '',
    icon: '',
    panel: null,
    frame: null,
    onCreate: null,
    load: function load(docker) {
      var that = this;
      if (!that.panel) {
        docker.registerPanelType(this.name, {
          title: that.title,
          isPrivate: that.isPrivate,
          onCreate: function onCreate(myPanel) {
            $(myPanel).data('pgAdminName', that.name);
            myPanel.initSize(that.width, that.height);

            if (myPanel.showTitle == false) myPanel.title(false);

            myPanel.icon(that.icon);

            myPanel.closeable(!!that.isCloseable);

            var $frameArea = $('<div style="position:absolute;top:0 !important;width:100%;height:100%;display:table">');
            myPanel.layout().addItem($frameArea);
            that.panel = myPanel;
            var frame = new wcIFrame($frameArea, myPanel);
            $(myPanel).data('frameInitialized', false);
            $(myPanel).data('embeddedFrame', frame);

            if (that.url != '' && that.url != 'about:blank') {
              setTimeout(function () {
                frame.openURL(that.url);
                $(myPanel).data('frameInitialized', true);
                pgBrowser.Events.trigger('pgadmin-browser:frame:urlloaded:' + that.name, frame, that.url, self);
              }, 50);
            } else {
              frame.openURL('about:blank');
              $(myPanel).data('frameInitialized', true);
              pgBrowser.Events.trigger('pgadmin-browser:frame:urlloaded:' + that.name, frame, that.url, self);
            }

            if (that.events && _.isObject(that.events)) {
              _.each(that.events, function (v, k) {
                if (v && _.isFunction(v)) {
                  myPanel.on(k, v);
                }
              });
            }

            _.each([wcDocker.EVENT.UPDATED, wcDocker.EVENT.VISIBILITY_CHANGED, wcDocker.EVENT.BEGIN_DOCK, wcDocker.EVENT.END_DOCK, wcDocker.EVENT.GAIN_FOCUS, wcDocker.EVENT.LOST_FOCUS, wcDocker.EVENT.CLOSED, wcDocker.EVENT.BUTTON, wcDocker.EVENT.ATTACHED, wcDocker.EVENT.DETACHED, wcDocker.EVENT.MOVE_STARTED, wcDocker.EVENT.MOVE_ENDED, wcDocker.EVENT.MOVED, wcDocker.EVENT.RESIZE_STARTED, wcDocker.EVENT.RESIZE_ENDED, wcDocker.EVENT.RESIZED, wcDocker.EVENT.SCROLLED], function (ev) {
              myPanel.on(ev, that.eventFunc.bind(myPanel, ev));
            });

            if (that.onCreate && _.isFunction(that.onCreate)) {
              that.onCreate.apply(that, [myPanel, frame, $container]);
            }
          }
        });
      }
    },
    eventFunc: function eventFunc(eventName) {
      var name = $(this).data('pgAdminName');

      try {
        pgBrowser.Events.trigger('pgadmin-browser:frame', eventName, this, arguments);
        pgBrowser.Events.trigger('pgadmin-browser:frame:' + eventName, this, arguments);

        if (name) {
          pgBrowser.Events.trigger('pgadmin-browser:frame-' + name, eventName, this, arguments);
          pgBrowser.Events.trigger('pgadmin-browser:frame-' + name + ':' + eventName, this, arguments);
        }
      } catch (e) {
        console.log(e);
      }
    }
  });

  return pgAdmin.Browser.Frame;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 191:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(pgAdmin) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(5), __webpack_require__(0), __webpack_require__(1), __webpack_require__(17)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, url_for, $, _, alertify) {
  pgAdmin = pgAdmin || window.pgAdmin || {};

  /*
   * Hmm... this module is already been initialized, we can refer to the old
   * object from here.
   */
  if (pgAdmin.FileManager) {
    return pgAdmin.FileManager;
  }

  pgAdmin.FileManager = {
    init: function init() {
      if (this.initialized) {
        return;
      }

      this.initialized = true;

      // send a request to get transaction id
      var getTransId = function getTransId(configs) {
        return $.ajax({
          data: configs,
          type: "POST",
          async: false,
          url: url_for('file_manager.get_trans_id'),
          dataType: "json",
          contentType: "application/json; charset=utf-8"
        });
      };

      // Function to remove trans id from session
      var removeTransId = function removeTransId(trans_id) {
        return $.ajax({
          type: "GET",
          async: false,
          url: url_for('file_manager.delete_trans_id', { 'trans_id': trans_id }),
          dataType: "json",
          contentType: "application/json; charset=utf-8"
        });
      };

      var set_last_traversed_dir = function set_last_traversed_dir(path, trans_id) {
        return $.ajax({
          url: url_for('file_manager.save_last_dir', { 'trans_id': trans_id }),
          type: 'POST',
          data: JSON.stringify(path),
          contentType: 'application/json'
        });
      };
      // Declare the Storage dialog
      alertify.dialog('storageManagerDlg', function () {
        var controls = [],
            // Keep tracking of all the backform controls
        // Dialog containter
        $container = $("<div class='storage_dialog'></div>"),
            trans_id;

        /*
         * Function: renderStoragePanel
         *
         * Renders the FileManager in the content div based on the given
         * configuration parameters.
         */
        var renderStoragePanel = function renderStoragePanel(params) {
          /*
           * Clear the existing html in the storage content
           */
          var content = $container.find('.storage_content');
          content.empty();
          $.get(url_for('file_manager.index'), function (data) {
            content.append(data);
          });

          var transId = getTransId(params);
          var t_res;
          if (transId.readyState == 4) {
            t_res = JSON.parse(transId.responseText);
          }
          trans_id = t_res.data.fileTransId;
        };

        // Dialog property
        return {
          main: function main(params) {
            // Set title and button name
            var self = this;
            if (_.isUndefined(params['dialog_title'])) {
              params['dialog_title'] = 'Storage manager';
            }
            this.set('title', params['dialog_title']);
            if (_.isUndefined(params['btn_primary'])) {
              params['btn_primary'] = 'Select';
            }
            this.set('label', params['btn_primary']);

            params = JSON.stringify(params);
            $container.find('.storage_content').remove();
            $container.append("<div class='storage_content'></div>");
            renderStoragePanel(params);
            this.elements.dialog.style.minWidth = '630px';
            this.show();
            setTimeout(function () {
              $($container.find('.file_manager')).on('enter-key', function () {
                $($(self.elements.footer).find('.file_manager_ok')).trigger('click');
              });
            }, 200);
          },
          settings: {
            label: undefined
          },
          settingUpdated: function settingUpdated(key, oldValue, newValue) {
            switch (key) {
              case 'message':
                this.setMessage(newValue);
                break;
              case 'label':
                if (this.__internal.buttons[0].element) {
                  this.__internal.buttons[0].element.innerHTML = newValue;
                }
                break;
              default:
                break;
            }
          },
          setup: function setup() {
            return {
              buttons: [{
                text: gettext("Select"), className: "btn btn-primary fa fa-file file_manager_ok pg-alertify-button disabled"
              }, {
                text: gettext("Cancel"), className: "btn btn-danger fa fa-times pg-alertify-button"
              }],
              focus: { element: 0 },
              options: {
                closableByDimmer: false

              }
            };
          },
          callback: function callback(closeEvent) {
            if (closeEvent.button.text == gettext("Select")) {
              var newFile = $('.storage_dialog #uploader .input-path').val(),
                  file_data = { 'path': $('.currentpath').val() };

              pgAdmin.Browser.Events.trigger('pgadmin-storage:finish_btn:storage_dialog', newFile);

              set_last_traversed_dir(file_data, trans_id);
              var innerbody = $(this.elements.body).find('.storage_content');
              $(innerbody).find('*').off();
              innerbody.remove();
              removeTransId(trans_id);
            } else if (closeEvent.button.text == gettext("Cancel")) {
              var innerbody = $(this.elements.body).find('.storage_content');
              $(innerbody).find('*').off();
              innerbody.remove();
              removeTransId(trans_id);
            }
          },
          build: function build() {
            this.elements.content.appendChild($container.get(0));
          },
          hooks: {
            onshow: function onshow() {
              $(this.elements.body).addClass('pgadmin-storage-body');
            }
          }
        };
      });

      // Declare the Selection dialog
      alertify.dialog('fileSelectionDlg', function () {
        var controls = [],
            // Keep tracking of all the backform controls
        // Dialog containter
        $container = $("<div class='storage_dialog file_selection_dlg'></div>");
        var trans_id;

        // send a request to get transaction id
        /*
         * Function: renderStoragePanel
         *
         * Renders the FileManager in the content div based on the given
         * configuration parameters.
         */
        var renderStoragePanel = function renderStoragePanel(configs) {
          /*
           * Clear the existing html in the storage content
           */
          var content = $container.find('.storage_content');
          content.empty();

          $.get(url_for('file_manager.index'), function (data) {
            content.append(data);
          });

          var transId = getTransId(configs);
          var t_res;
          if (transId.readyState == 4) {
            t_res = JSON.parse(transId.responseText);
          }
          trans_id = t_res.data.fileTransId;
        };

        // Dialog property
        return {
          main: function main(params) {
            // Set title and button name
            var self = this;
            if (_.isUndefined(params['dialog_title'])) {
              params['dialog_title'] = 'Select file';
            }
            this.set('title', params['dialog_title']);
            if (_.isUndefined(params['btn_primary'])) {
              params['btn_primary'] = 'Select';
            }
            this.set('label', params['btn_primary']);

            params = JSON.stringify(params);
            $container.find('.storage_content').remove();
            $container.append("<div class='storage_content'></div>");
            renderStoragePanel(params);
            this.elements.dialog.style.minWidth = '630px';
            this.show();
            setTimeout(function () {
              $($container.find('.file_manager')).on('enter-key', function () {
                $($(self.elements.footer).find('.file_manager_ok')).trigger('click');
              });
            }, 200);
          },
          settings: {
            label: undefined
          },
          settingUpdated: function settingUpdated(key, oldValue, newValue) {
            switch (key) {
              case 'message':
                this.setMessage(newValue);
                break;
              case 'label':
                if (this.__internal.buttons[0].element) {
                  this.__internal.buttons[0].element.innerHTML = newValue;
                }
                break;
              default:
                break;
            }
          },
          setup: function setup() {
            return {
              buttons: [{
                text: gettext("Select"), key: 13, className: "btn btn-primary fa fa-file file_manager_ok pg-alertify-button disabled"
              }, {
                text: gettext("Cancel"), key: 27, className: "btn btn-danger fa fa-times pg-alertify-button"
              }],
              focus: { element: 0 },
              options: {
                closableByDimmer: false,
                maximizable: false,
                closable: false,
                movable: true
              }
            };
          },
          callback: function callback(closeEvent) {
            if (closeEvent.button.text == gettext("Select")) {
              var newFile = $('.storage_dialog #uploader .input-path').val(),
                  file_data = { 'path': $('.currentpath').val() };

              pgAdmin.Browser.Events.trigger('pgadmin-storage:finish_btn:select_file', newFile);
              var innerbody = $(this.elements.body).find('.storage_content');
              $(innerbody).find('*').off();
              innerbody.remove();
              removeTransId(trans_id);
              // Ajax call to store the last directory visited once user press select button

              set_last_traversed_dir(file_data, trans_id);
            } else if (closeEvent.button.text == gettext("Cancel")) {
              var innerbody = $(this.elements.body).find('.storage_content');
              $(innerbody).find('*').off();
              innerbody.remove();
              removeTransId(trans_id);
            }
          },
          build: function build() {
            this.elements.content.appendChild($container.get(0));
          },
          hooks: {
            onshow: function onshow() {
              $(this.elements.body).addClass('pgadmin-storage-body');
            }
          }
        };
      });

      // Declare the Folder Selection dialog
      alertify.dialog('folderSelectionDlg', function () {
        var controls = [],
            // Keep tracking of all the backform controls
        // Dialog containter
        $container = $("<div class='storage_dialog folder_selection_dlg'></div>"),
            trans_id;

        // send a request to get transaction id
        /*
         * Function: renderStoragePanel
         *
         * Renders the FileManager in the content div based on the given
         * configuration parameters.
         */
        var renderStoragePanel = function renderStoragePanel(params) {
          /*
           * Clear the existing html in the storage content
           */
          var content = $container.find('.storage_content');
          content.empty();

          $.get(url_for('file_manager.index'), function (data) {
            content.append(data);
          });

          var transId = getTransId(params);
          var t_res;
          if (transId.readyState == 4) {
            t_res = JSON.parse(transId.responseText);
          }
          trans_id = t_res.data.fileTransId;
        };

        // Dialog property
        return {
          main: function main(params) {
            var self = this;
            // Set title and button name
            if (_.isUndefined(params['dialog_title'])) {
              params['dialog_title'] = 'Select folder';
            }
            this.set('title', params['dialog_title']);
            if (_.isUndefined(params['btn_primary'])) {
              params['btn_primary'] = 'Select';
            }
            this.set('label', params['btn_primary']);

            params = JSON.stringify(params);
            $container.find('.storage_content').remove();
            $container.append("<div class='storage_content'></div>");
            renderStoragePanel(params);
            this.elements.dialog.style.minWidth = '630px';
            this.show();
            setTimeout(function () {
              $($container.find('.file_manager')).on('enter-key', function () {
                $($(self.elements.footer).find('.file_manager_ok')).trigger('click');
              });
            }, 200);
          },
          settings: {
            label: undefined
          },
          settingUpdated: function settingUpdated(key, oldValue, newValue) {
            switch (key) {
              case 'message':
                this.setMessage(newValue);
                break;
              case 'label':
                if (this.__internal.buttons[0].element) {
                  this.__internal.buttons[0].element.innerHTML = newValue;
                }
                break;
              default:
                break;
            }
          },
          setup: function setup() {
            return {
              buttons: [{
                text: gettext("Select"), key: 13, className: "btn btn-primary fa fa-file file_manager_ok pg-alertify-button disabled"
              }, {
                text: gettext("Cancel"), key: 27, className: "btn btn-danger fa fa-times pg-alertify-button"
              }],
              focus: { element: 0 },
              options: {
                closableByDimmer: false,
                maximizable: false,
                closable: false,
                movable: true
              }
            };
          },
          callback: function callback(closeEvent) {
            if (closeEvent.button.text == gettext("Select")) {
              var newFile = $('.storage_dialog #uploader .input-path').val(),
                  file_data = { 'path': $('.currentpath').val() };
              pgAdmin.Browser.Events.trigger('pgadmin-storage:finish_btn:select_folder', newFile);
              var innerbody = $(this.elements.body).find('.storage_content');
              $(innerbody).find('*').off();
              innerbody.remove();
              removeTransId(trans_id);
              // Ajax call to store the last directory visited once user press select button
              set_last_traversed_dir(file_data, trans_id);
            } else if (closeEvent.button.text == gettext("Cancel")) {
              var innerbody = $(this.elements.body).find('.storage_content');
              $(innerbody).find('*').off();
              innerbody.remove();
              removeTransId(trans_id);
            }
          },
          build: function build() {
            this.elements.content.appendChild($container.get(0));
          },
          hooks: {
            onshow: function onshow() {
              $(this.elements.body).addClass('pgadmin-storage-body');
            }
          }
        };
      });

      // Declare the Create mode dialog
      alertify.dialog('createModeDlg', function () {
        var controls = [],
            // Keep tracking of all the backform controls
        // Dialog containter
        $container = $("<div class='storage_dialog create_mode_dlg'></div>"),
            trans_id;

        /*
         * Function: renderStoragePanel
         *
         * Renders the FileManager in the content div based on the given
         * configuration parameters.
         */
        var renderStoragePanel = function renderStoragePanel(params) {
          /*
           * Clear the existing html in the storage content
           */
          var content = $container.find('.storage_content');
          content.empty();

          $.get(url_for('file_manager.index'), function (data) {
            content.append(data);
          });

          var transId = getTransId(params);
          var t_res;
          if (transId.readyState == 4) {
            t_res = JSON.parse(transId.responseText);
          }
          trans_id = t_res.data.fileTransId;
        };

        // Dialog property
        return {
          main: function main(params) {
            var self = this,
                trans_id;
            // Set title and button name
            if (_.isUndefined(params['dialog_title'])) {
              params['dialog_title'] = 'Create file';
            }
            this.set('title', params['dialog_title']);
            if (_.isUndefined(params['btn_primary'])) {
              params['btn_primary'] = 'Create';
            }
            this.set('label', params['btn_primary']);

            params = JSON.stringify(params);
            $container.find('.storage_content').remove();
            $container.append("<div class='storage_content'></div>");
            renderStoragePanel(params);
            this.elements.dialog.style.minWidth = '630px';
            this.show();
            setTimeout(function () {
              $($container.find('.file_manager')).on('enter-key', function () {
                $($(self.elements.footer).find('.file_manager_ok')).trigger('click');
              });
            }, 200);
          },
          settings: {
            label: undefined
          },
          settingUpdated: function settingUpdated(key, oldValue, newValue) {
            switch (key) {
              case 'message':
                this.setMessage(newValue);
                break;
              case 'label':
                if (this.__internal.buttons[0].element) {
                  this.__internal.buttons[0].element.innerHTML = newValue;
                }
                break;
              default:
                break;
            }
          },
          setup: function setup() {
            return {
              buttons: [{
                text: gettext("Create"), key: 13, className: "btn btn-primary fa fa-file file_manager_create file_manager_ok pg-alertify-button disabled"
              }, {
                text: gettext("Cancel"), key: 27, className: "btn btn-danger fa fa-times file_manager_create_cancel pg-alertify-button"
              }],
              focus: { element: 0 },
              options: {
                closableByDimmer: false,
                maximizable: false,
                closable: false,
                movable: true
              }
            };
          },
          replace_file: function replace_file() {
            var $yesBtn = $('.replace_file .btn_yes'),
                $noBtn = $('.replace_file .btn_no');

            $('.storage_dialog #uploader .input-path').attr('disabled', true);
            $('.file_manager_ok').addClass('disabled');
            $('.replace_file, .fm_dimmer').show();

            $yesBtn.click(function (e) {
              $('.replace_file, .fm_dimmer').hide();
              $yesBtn.off();
              $noBtn.off();
              var newFile = $('.storage_dialog #uploader .input-path').val();

              pgAdmin.Browser.Events.trigger('pgadmin-storage:finish_btn:create_file', newFile);
              $('.file_manager_create_cancel').trigger('click');
              $('.storage_dialog #uploader .input-path').attr('disabled', false);
              $('.file_manager_ok').removeClass('disabled');
            });

            $noBtn.click(function (e) {
              $('.replace_file, .fm_dimmer').hide();
              $yesBtn.off();
              $noBtn.off();
              $('.storage_dialog #uploader .input-path').attr('disabled', false);
              $('.file_manager_ok').removeClass('disabled');
            });
          },
          is_file_exist: function is_file_exist() {
            var full_path = $('.storage_dialog #uploader .input-path').val(),
                path = full_path.substr(0, full_path.lastIndexOf('/') + 1),
                selected_item = full_path.substr(full_path.lastIndexOf('/') + 1),
                is_exist = false;

            var file_data = {
              'path': path,
              'name': selected_item,
              'mode': 'is_file_exist'
            };

            $.ajax({
              type: 'POST',
              data: JSON.stringify(file_data),
              url: url_for('file_manager.filemanager', { 'trans_id': trans_id }),
              dataType: 'json',
              contentType: "application/x-download; charset=utf-8",
              async: false,
              success: function success(resp) {
                var data = resp.data.result;
                if (data['Code'] === 1) {
                  is_exist = true;
                } else {
                  is_exist = false;
                }
              }
            });
            return is_exist;
          },
          check_permission: function check_permission(path) {
            var permission = false,
                post_data = {
              'path': path,
              'mode': 'permission'
            };

            $.ajax({
              type: 'POST',
              data: JSON.stringify(post_data),
              url: url_for('file_manager.filemanager', { 'trans_id': trans_id }),
              dataType: 'json',
              contentType: "application/json; charset=utf-8",
              async: false,
              success: function success(resp) {
                var data = resp.data.result;
                if (data.Code === 1) {
                  permission = true;
                } else {
                  $('.file_manager_ok').addClass('disabled');
                  alertify.error(data.Error);
                }
              },
              error: function error() {
                $('.file_manager_ok').addClass('disabled');
                alertify.error(gettext('Error occurred while checking access permission.'));
              }
            });
            return permission;
          },
          callback: function callback(closeEvent) {
            if (closeEvent.button.text == gettext("Create")) {
              var newFile = $('.storage_dialog #uploader .input-path').val(),
                  file_data = { 'path': $('.currentpath').val() };

              if (!this.check_permission(newFile)) {
                closeEvent.cancel = true;
                return;
              }

              if (!_.isUndefined(newFile) && newFile !== '' && this.is_file_exist()) {
                this.replace_file();
                closeEvent.cancel = true;
              } else {
                pgAdmin.Browser.Events.trigger('pgadmin-storage:finish_btn:create_file', newFile);
                var innerbody = $(this.elements.body).find('.storage_content');
                $(innerbody).find('*').off();
                innerbody.remove();
                removeTransId(trans_id);
              }

              set_last_traversed_dir(file_data, trans_id);
            } else if (closeEvent.button.text == gettext("Cancel")) {
              var innerbody = $(this.elements.body).find('.storage_content');
              $(innerbody).find('*').off();
              innerbody.remove();
              removeTransId(trans_id);
            }
          },
          build: function build() {
            this.elements.content.appendChild($container.get(0));
          },
          hooks: {
            onshow: function onshow() {
              $(this.elements.body).addClass('pgadmin-storage-body');
            }
          }
        };
      });
    },
    show_storage_dlg: function show_storage_dlg(params) {
      alertify.storageManagerDlg(params).resizeTo('60%', '80%');
    },
    show_file_selection: function show_file_selection(params) {
      alertify.fileSelectionDlg(params).resizeTo('60%', '80%');
    },
    show_folder_selection: function show_folder_selection(params) {
      alertify.folderSelectionDlg(params).resizeTo('60%', '80%');
    },
    show_create_dlg: function show_create_dlg(params) {
      alertify.createModeDlg(params).resizeTo('60%', '80%');
    },
    // call dialogs subject to dialog_type param
    show_dialog: function show_dialog(params) {
      if (params.dialog_type == 'select_file') {
        this.show_file_selection(params);
      } else if (params.dialog_type == 'select_folder') {
        this.show_folder_selection(params);
      } else if (params.dialog_type == 'create_file') {
        this.show_create_dlg(params);
      } else {
        this.show_storage_dlg(params);
      }
    }
  };

  return pgAdmin.FileManager;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(0), __webpack_require__(10), __webpack_require__(16), __webpack_require__(13), __webpack_require__(8), __webpack_require__(3), __webpack_require__(31), __webpack_require__(54)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, $, Backbone, Backform, Backgrid, Alertify, pgAdmin, pgNode) {

  /*
   * cellFunction for variable control.
   * This function returns cell class depending on vartype.
   */
  var cellFunction = function cellFunction(model) {
    var self = this,
        name = model.get("name"),
        availVariables = {};

    self.collection.each(function (col) {
      if (col.get("name") == "name") {
        availVariables = col.get('availVariables');
      }
    });

    var variable = name ? availVariables[name] : undefined,
        value = model.get("value");

    switch (variable && variable.vartype) {
      case "bool":
        /*
         * bool cell and variable cannot be stateless (i.e undefined).
         * It should be either true or false.
         */

        model.set("value", !!model.get("value"), { silent: true });

        return Backgrid.Extension.SwitchCell;
        break;
      case "enum":
        model.set({ 'value': value }, { silent: true });
        var options = [],
            enumVals = variable.enumvals;

        _.each(enumVals, function (enumVal) {
          options.push([enumVal, enumVal]);
        });

        return Backgrid.Extension.Select2Cell.extend({ optionValues: options });
        break;
      case "integer":
        if (!_.isNaN(parseInt(value))) {
          model.set({ 'value': parseInt(value) }, { silent: true });
        } else {
          model.set({ 'value': undefined }, { silent: true });
        }
        return Backgrid.IntegerCell;
        break;
      case "real":
        if (!_.isNaN(parseFloat(value))) {
          model.set({ 'value': parseFloat(value) }, { silent: true });
        } else {
          model.set({ 'value': undefined }, { silent: true });
        }
        return Backgrid.NumberCell.extend({ decimals: 0 });
        break;
      case "string":
        return Backgrid.StringCell;
        break;
      default:
        model.set({ 'value': undefined }, { silent: true });
        return Backgrid.Cell;
        break;
    }
    model.set({ 'value': undefined }, { silent: true });
    return Backgrid.Cell;
  };

  /*
   * This row will define behaviour or value column cell depending upon
   * variable name.
   */
  var VariableRow = Backgrid.Row.extend({
    modelDuplicateColor: "lightYellow",

    modelUniqueColor: "#fff",

    initialize: function initialize() {
      Backgrid.Row.prototype.initialize.apply(this, arguments);
      var self = this;
      self.model.on("change:name", function () {
        setTimeout(function () {
          self.columns.each(function (col) {
            if (col.get('name') == 'value') {

              var idx = self.columns.indexOf(col),
                  cf = col.get("cellFunction"),
                  cell = new (cf.apply(col, [self.model]))({
                column: col,
                model: self.model
              }),
                  oldCell = self.cells[idx];
              oldCell.remove();
              self.cells[idx] = cell;
              self.render();
            }
          });
        }, 10);
      });
      self.listenTo(self.model, 'pgadmin-session:model:duplicate', self.modelDuplicate);
      self.listenTo(self.model, 'pgadmin-session:model:unique', self.modelUnique);
    },
    modelDuplicate: function modelDuplicate() {
      $(this.el).removeClass("new");
      this.el.style.backgroundColor = this.modelDuplicateColor;
    },
    modelUnique: function modelUnique() {
      this.el.style.backgroundColor = this.modelUniqueColor;
    }

  });
  /**
   *  VariableModel used to represent configuration parameters (variables tab)
   *  for database objects.
   **/
  var VariableModel = pgNode.VariableModel = pgNode.Model.extend({
    keys: ['name'],
    defaults: {
      name: undefined,
      value: undefined,
      role: null,
      database: null
    },
    schema: [{
      id: 'name', label: 'Name', type: 'text', cellHeaderClasses: 'width_percent_30',
      editable: function editable(m) {
        return m instanceof Backbone.Collection ? true : m.isNew();
      },
      cell: Backgrid.Extension.NodeAjaxOptionsCell.extend({
        initialize: function initialize() {
          Backgrid.Extension.NodeAjaxOptionsCell.prototype.initialize.apply(this, arguments);

          // Immediately process options as we need them before render.

          var opVals = _.clone(this.optionValues || (_.isFunction(this.column.get('options')) ? this.column.get('options')(this) : this.column.get('options')));

          this.column.set('options', opVals);
        }
      }),
      url: 'vopts',
      select2: { allowClear: false },
      transform: function transform(vars, cell) {
        var self = this,
            res = [],
            availVariables = {};

        _.each(vars, function (v) {
          res.push({
            'value': v.name,
            'image': undefined,
            'label': v.name
          });
          availVariables[v.name] = v;
        });

        cell.column.set("availVariables", availVariables);
        return res;
      }
    }, {
      id: 'value', label: 'Value', type: 'text', editable: true,
      cellFunction: cellFunction, cellHeaderClasses: 'width_percent_40'
    }, { id: 'database', label: 'Database', type: 'text', editable: true,
      node: 'database', cell: Backgrid.Extension.NodeListByNameCell
    }, { id: 'role', label: 'Role', type: 'text', editable: true,
      node: 'role', cell: Backgrid.Extension.NodeListByNameCell }],
    toJSON: function toJSON() {
      var d = Backbone.Model.prototype.toJSON.apply(this);

      // Remove not defined values from model values.
      // i.e.
      // role, database
      if (_.isUndefined(d.database) || _.isNull(d.database)) {
        delete d.database;
      }

      if (_.isUndefined(d.role) || _.isNull(d.role)) {
        delete d.role;
      }

      return d;
    },
    validate: function validate() {
      if (_.isUndefined(this.get('name')) || _.isNull(this.get('name')) || String(this.get('name')).replace(/^\s+|\s+$/g, '') == '') {
        var msg = 'Please select a parameter name.';

        this.errorModel.set('name', msg);

        return msg;
      } else if (_.isUndefined(this.get('value')) || _.isNull(this.get('value')) || String(this.get('value')).replace(/^\s+|\s+$/g, '') == '') {
        var msg = 'Please enter a value for the parameter.';

        this.errorModel.set('value', msg);

        return msg;
      } else {
        this.errorModel.unset('name');
        this.errorModel.unset('value');
      }

      return null;
    }
  });

  /**
   * Variable Tab Control to set/update configuration values for database object.
   *
   **/
  var VariableCollectionControl = Backform.VariableCollectionControl = Backform.UniqueColCollectionControl.extend({

    hasDatabase: false,
    hasRole: false,

    initialize: function initialize(opts) {
      var self = this,
          keys = ['name'];

      /*
       * Read from field schema whether user wants to use database and role
       * fields in Variable control.
       */
      self.hasDatabase = opts.field.get('hasDatabase');
      self.hasRole = opts.field.get('hasRole');

      // Update unique coll field based on above flag status.
      if (self.hasDatabase) {
        keys.push('database');
      } else if (self.hasRole) {
        keys.push('role');
      }
      // Overriding the uniqueCol in the field
      if (opts && opts.field) {
        if (opts.field instanceof Backform.Field) {
          opts.field.set({
            model: pgNode.VariableModel.extend({ keys: keys })
          }, {
            silent: true
          });
        } else {
          opts.field.extend({
            model: pgNode.VariableModel.extend({ keys: keys })
          });
        }
      }

      Backform.UniqueColCollectionControl.prototype.initialize.apply(self, arguments);

      self.availVariables = {};

      var node = self.field.get('node').type,
          gridCols = ['name', 'value'];

      if (self.hasDatabase) {
        gridCols.push('database');
      }

      if (self.hasRole) {
        gridCols.push('role');
      }

      self.gridSchema = Backform.generateGridColumnsFromModel(self.field.get('node_info'), VariableModel.extend({ keys: keys }), 'edit', gridCols, self.field.get('schema_node'));

      // Make sure - we do have the data for variables
      self.getVariables();
    },
    /*
     * Get the variable data for this node.
     */
    getVariables: function getVariables() {
      var self = this,
          url = this.field.get('url'),
          m = self.model;

      if (!this.field.get('version_compatible')) return;

      if (url && !m.isNew()) {
        var node = self.field.get('node'),
            node_data = self.field.get('node_data'),
            node_info = self.field.get('node_info'),
            full_url = node.generate_url.apply(node, [null, url, node_data, true, node_info]),
            data,
            isTracking = self.collection.trackChanges;

        if (isTracking) {
          self.collection.stopSession();
        }
        m.trigger('pgadmin-view:fetching', m, self.field);

        $.ajax({
          async: false,
          url: full_url,
          success: function success(res) {
            data = res.data;
          },
          error: function error() {
            m.trigger('pgadmin-view:fetch:error', m, self.field);
          }
        });
        m.trigger('pgadmin-view:fetched', m, self.field);

        if (data && _.isArray(data)) {
          self.collection.reset(data, { silent: true });
        }
        /*
         * Make sure - new data will be taken care by the session management
         */
        if (isTracking) {
          self.collection.startNewSession();
        }
      }
    },

    showGridControl: function showGridControl(data) {

      var self = this,
          titleTmpl = _.template(["<div class='subnode-header'>", "<label class='control-label'><%-label%></label>", "<button class='btn-sm btn-default add fa fa-plus' <%=canAdd ? '' : 'disabled=\"disabled\"'%>></button>", "</div>"].join("\n")),
          $gridBody = $("<div class='pgadmin-control-group backgrid form-group col-xs-12 object subnode'></div>").append(titleTmpl(data));

      // Clean up existing grid if any (in case of re-render)
      if (self.grid) {
        self.grid.remove();
      }

      var gridSchema = _.clone(this.gridSchema);

      _.each(gridSchema.columns, function (col) {
        if (col.name == 'value') {
          col.availVariables = self.availVariables;
        }
      });

      // Insert Delete Cell into Grid
      if (data.disabled == false && data.canDelete) {
        gridSchema.columns.unshift({
          name: "pg-backform-delete", label: "",
          cell: Backgrid.Extension.DeleteCell,
          editable: false, cell_priority: -1
        });
      }

      // Change format of each of the data
      // Because - data coming from the server is in string format
      self.collection.each(function (model) {
        var name = model.get("name");

        if (name in self.availVariables) {
          switch (self.availVariables[name].vartype) {
            case 'real':
              var v = parseFloat(model.get('value'));
              model.set('value', isNaN(v) ? undefined : v, { silent: true });

              break;
            case 'integer':
              var v = parseInt(model.get('value'));
              model.set('value', isNaN(v) ? undefined : v, { silent: true });

              break;
            default:
              break;
          }
        }
      });

      // Initialize a new Grid instance
      var grid = self.grid = new Backgrid.Grid({
        columns: gridSchema.columns,
        collection: self.collection,
        row: VariableRow,
        className: "backgrid table-bordered"
      });
      self.$grid = grid.render().$el;

      $gridBody.append(self.$grid);

      // Add button callback
      if (!(data.disabled || data.canAdd == false)) {
        $gridBody.find('button.add').first().click(function (e) {
          e.preventDefault();
          var canAddRow = _.isFunction(data.canAddRow) ? data.canAddRow.apply(self, [self.model]) : true;
          if (canAddRow) {

            var allowMultipleEmptyRows = !!self.field.get('allowMultipleEmptyRows');

            // If allowMultipleEmptyRows is not set or is false then don't allow second new empty row.
            // There should be only one empty row.
            if (!allowMultipleEmptyRows && self.collection) {
              var isEmpty = false;
              self.collection.each(function (model) {
                var modelValues = [];
                _.each(model.attributes, function (val, key) {
                  modelValues.push(val);
                });
                if (!_.some(modelValues, _.identity)) {
                  isEmpty = true;
                }
              });
              if (isEmpty) {
                return false;
              }
            }

            $(grid.body.$el.find($("tr.new"))).removeClass("new");
            var m = new data.model(null, {
              silent: true,
              handler: self.collection,
              top: self.model.top || self.model,
              collection: self.collection,
              node_info: self.model.node_info
            });
            self.collection.add(m);

            var idx = self.collection.indexOf(m),
                newRow = grid.body.rows[idx].$el;

            newRow.addClass("new");
            $(newRow).pgMakeVisible('backform-tab');

            return false;
          }
        });
      }

      // Render node grid
      return $gridBody;
    },

    addVariable: function addVariable(ev) {
      ev.preventDefault();

      var self = this,
          m = new (self.field.get('model'))(self.headerData.toJSON(), {
        silent: true, top: self.collection.top,
        handler: self.collection
      }),
          coll = self.model.get(self.field.get('name'));

      coll.add(m);

      var idx = coll.indexOf(m);

      // idx may not be always > -1 because our UniqueColCollection may
      // remove 'm' if duplicate value found.
      if (idx > -1) {
        self.$grid.find('.new').removeClass('new');

        var newRow = self.grid.body.rows[idx].$el;

        newRow.addClass("new");
        $(newRow).pgMakeVisible('backform-tab');
      }

      return false;
    }
  });

  return VariableModel;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(1), __webpack_require__(0), __webpack_require__(10), __webpack_require__(16), __webpack_require__(13), __webpack_require__(8), __webpack_require__(31), __webpack_require__(54)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, _, $, Backbone, Backform, Backgrid, Alertify, pgNode) {
  /**
   * Each Privilege, supporeted by an database object, will be represented
   * using this Model.
   *
   * Defaults:
   *   privilege_type -> Name of the permission
   *      i.e. CREATE, TEMPORARY, CONNECT, etc.
   *   privilege      -> Has privilege? (true/false)
   *   with_grant     -> Has privilege with grant option (true/false)
   **/
  var PrivilegeModel = pgNode.Model.extend({
    idAttribute: 'privilege_type',
    defaults: {
      privilege_type: undefined,
      privilege: false,
      with_grant: false
    },
    validate: function validate() {
      return null;
    }
  });

  /**
   * A database object has privileges item list (aclitem[]).
   *
   * This model represents the individual privilege item (aclitem).
   * It has basically three properties:
   *  + grantee    - Role to which that privilege applies to.
   *                Empty value represents to PUBLIC.
   *  + grantor    - Grantor who has given this permission.
   *  + privileges - Privileges for that role.
   **/
  var PrivilegeRoleModel = pgNode.PrivilegeRoleModel = pgNode.Model.extend({
    idAttribute: 'grantee',
    defaults: {
      grantee: undefined,
      grantor: undefined,
      privileges: undefined
    },
    keys: ['grantee', 'grantor'],
    /*
     * Each of the database object needs to extend this model, which should
     * provide the type of privileges (it supports).
     */
    privileges: [],
    schema: [{
      id: 'grantee', label: 'Grantee', type: 'text', group: null,
      editable: true, cellHeaderClasses: 'width_percent_40',
      node: 'role',
      disabled: function disabled(m) {
        if (!(m instanceof Backbone.Model)) {
          // This has been called during generating the header cell
          return false;
        }
        return !(m.top && m.top.node_info && m.top.node_info.server.user.name == m.get('grantor'));
      },
      transform: function transform(data) {
        var res = Backgrid.Extension.NodeListByNameCell.prototype.defaults.transform.apply(this, arguments);
        res.unshift({ label: 'PUBLIC', value: 'PUBLIC' });
        return res;
      },
      cell: Backgrid.Extension.NodeListByNameCell.extend({
        initialize: function initialize(opts) {
          var self = this,
              override_opts = true;

          // We would like to override the original options, because - we
          // should omit the existing role/user from the privilege cell.
          // Because - the column is shared among all the cell, we can only
          // override only once.
          if (opts && opts.column && opts.column instanceof Backbone.Model && opts.column.get('options_cached')) {
            override_opts = false;
          }
          Backgrid.Extension.NodeListByNameCell.prototype.initialize.apply(self, arguments);

          // Let's override the options
          if (override_opts) {
            var opts = self.column.get('options');
            self.column.set('options', self.omit_selected_roles.bind(self, opts));
          }

          var rerender = function (m) {
            var self = this;
            if ('grantee' in m.changed && this.model.cid != m.cid) {
              setTimeout(function () {
                self.render();
              }, 50);
            }
          }.bind(this);

          // We would like to rerender all the cells of this type for this
          // collection, because - we need to omit the newly selected roles
          // form the list. Also, the render will be automatically called for
          // the model represented by this cell, we will not do that again.
          this.listenTo(self.model.collection, "change", rerender, this);
          this.listenTo(self.model.collection, "remove", rerender, this);
        },
        // Remove all the selected roles (though- not mine).
        omit_selected_roles: function omit_selected_roles(opts, cell) {
          var res = opts(cell),
              selected = {},
              model = cell.model,
              cid = model.cid,

          // We need to check node_info values in parent when object is nested.
          // eg: column level privileges in table dialog
          // In this case node_info will not be avilable to column node as
          // it is not loaded yet
          node_info = _.has(model.top, 'node_info') && !_.isUndefined(model.top.node_info) ? model.top.node_info : model.handler.top.node_info,
              curr_user = node_info.server.user.name;

          var idx = 0;

          model.collection.each(function (m) {
            var grantee = m.get('grantee');

            if (m.cid != cid && !_.isUndefined(grantee) && curr_user == m.get('grantor')) {
              selected[grantee] = m.cid;
            }
          });

          res = _.filter(res, function (o) {
            return !(o.value in selected);
          });

          return res;
        }
      })
    }, {
      id: 'privileges', label: 'Privileges',
      type: 'collection', model: PrivilegeModel, group: null,
      cell: 'privilege', control: 'text', cellHeaderClasses: 'width_percent_40',
      disabled: function disabled(column, collection) {
        if (column instanceof Backbone.Collection) {
          // This has been called during generating the header cell
          return false;
        }
        return !(this.node_info && this.node_info.server.user.name == column.get('grantor') || this.attributes.node_info.server.user.name == column.get('grantor'));
      }
    }, {
      id: 'grantor', label: 'Grantor', type: 'text', disabled: true,
      cell: 'node-list-by-name', node: 'role'
    }],

    /*
     * Initialize the model, which will transform the privileges string to
     * collection of Privilege Model.
     */
    initialize: function initialize(attrs, opts) {

      pgNode.Model.prototype.initialize.apply(this, arguments);

      if (_.isNull(attrs)) {
        this.set('grantor', opts && opts.top && opts.top.node_info && opts.top.node_info.server.user.name, { silent: true });
      }

      /*
       * Define the collection of the privilege supported by this model
       */
      var self = this,
          models = self.get('privileges'),
          privileges = this.get('privileges') || {};

      if (_.isArray(privileges)) {
        privileges = new pgNode.Collection(models, {
          model: PrivilegeModel,
          top: this.top || this,
          handler: this,
          silent: true,
          parse: false
        });
        this.set('privileges', privileges, { silent: true });
      }

      var privs = {};
      _.each(self.privileges, function (p) {
        privs[p] = {
          'privilege_type': p, 'privilege': false, 'with_grant': false
        };
      });

      privileges.each(function (m) {
        delete privs[m.get('privilege_type')];
      });

      _.each(privs, function (p) {
        privileges.add(p, { silent: true });
      });

      self.on("change:grantee", self.granteeChanged);
      privileges.on('change', function () {
        self.trigger('change:privileges', self);
      });

      return self;
    },

    granteeChanged: function granteeChanged() {
      var privileges = this.get('privileges'),
          grantee = this.get('grantee');

      // Reset all with grant options if grantee is public.
      if (grantee == 'PUBLIC') {
        privileges.each(function (m) {
          m.set("with_grant", false, { silent: true });
        });
      }
    },

    toJSON: function toJSON(session) {

      var privileges = [];

      if (this.attributes && !this.attributes['privileges']) {
        return null;
      }

      this.attributes['privileges'].each(function (p) {
        if (p.get('privilege')) {
          privileges.push(p.toJSON());
        }
      });

      return {
        'grantee': this.get('grantee'),
        'grantor': this.get('grantor'),
        'privileges': privileges
      };
    },

    validate: function validate() {
      var err = {},
          errmsg = null,
          changedAttrs = this.sessAttrs,
          msg = undefined;

      if (_.isUndefined(this.get('grantee'))) {
        msg = gettext('A grantee must be selected.');
        this.errorModel.set('grantee', msg);
        errmsg = msg;
      } else {
        this.errorModel.unset('grantee');
      }

      if (this.attributes && this.attributes['privileges']) {
        var anyPrivSelected = false;
        this.attributes['privileges'].each(function (p) {
          if (p.get('privilege')) {
            anyPrivSelected = true;
          }
        });

        if (!anyPrivSelected) {
          msg = gettext('At least one privilege should be selected.');
          this.errorModel.set('privileges', msg);
          errmsg = errmsg || msg;
        } else {
          this.errorModel.unset('privileges');
        }
      }

      return errmsg;
    }
  });

  /**
     Custom cell editor for editing privileges.
   */
  var PrivilegeCellEditor = Backgrid.Extension.PrivilegeCellEditor = Backgrid.CellEditor.extend({
    tagName: "div",

    // All available privileges in the PostgreSQL database server for
    // generating the label for the specific Control
    Labels: {
      "C": "CREATE",
      "T": "TEMPORARY",
      "c": "CONNECT",
      "a": "INSERT",
      "r": "SELECT",
      "w": "UPDATE",
      "d": "DELETE",
      "D": "TRUNCATE",
      "x": "REFERENCES",
      "t": "TRIGGER",
      "U": "USAGE",
      "X": "EXECUTE"
    },

    template: _.template(['<tr class="<%= header ? "header" : "" %>">', ' <td class="renderable">', '  <label class="privilege_label">', '   <input type="checkbox" name="privilege" privilege="<%- privilege_type %>" target="<%- target %>" <%= privilege ? \'checked\' : "" %>></input>', '   <%- privilege_label %>', '  </label>', ' </td>', ' <td class="renderable">', '  <label class="privilege_label">', '   <input type="checkbox" name="with_grant" privilege="<%- privilege_type %>" target="<%- target %>" <%= with_grant ? \'checked\' : "" %> <%= enable_with_grant ? "" : \'disabled\'%>></input>', '   WITH GRANT OPTION', '  </label>', ' </td>', '</tr>'].join(" "), null, { variable: null }),

    events: {
      'change': 'privilegeChanged',
      'blur': 'lostFocus'
    },

    render: function render() {
      this.$el.empty();
      this.$el.attr('tabindex', '1');
      this.$el.attr('target', this.elId);

      var collection = this.model.get(this.column.get("name")),
          tbl = $("<table></table>").appendTo(this.$el),
          self = this,
          privilege = true,
          with_grant = true;

      // For each privilege generate html template.
      // List down all the Privilege model.
      collection.each(function (m) {
        var d = m.toJSON();

        privilege = privilege && d.privilege;
        with_grant = with_grant && privilege && d.with_grant;

        _.extend(d, {
          'target': self.cid,
          'header': false,
          'privilege_label': self.Labels[d.privilege_type],
          'with_grant': self.model.get('grantee') != 'PUBLIC' && d.with_grant,
          'enable_with_grant': self.model.get('grantee') != 'PUBLIC' && d.privilege
        });
        privilege = privilege && d.privilege;
        with_grant = with_grant && privilege && d.with_grant;
        tbl.append(self.template(d));
      });

      if (collection.length > 1) {
        // Preprend the ALL controls on that table
        tbl.prepend(self.template({
          'target': self.cid,
          'privilege_label': 'ALL',
          'privilege_type': 'ALL',
          'privilege': privilege,
          'with_grant': self.model.get('grantee') != 'PUBLIC' && with_grant,
          'enable_with_grant': self.model.get('grantee') != 'PUBLIC' && privilege,
          'header': true
        }));
      }
      self.$el.find('input[type=checkbox]').first().focus();
      // Since blur event does not bubble we need to explicitly call parent's blur event.
      $(self.$el.find('input[type=checkbox]')).on('blur', function () {
        self.$el.blur();
      });

      // Make row visible in when entering in edit mode.
      $(self.$el).pgMakeVisible('backform-tab');

      self.delegateEvents();

      return this;
    },

    /*
     * Listen to the checkbox value change and update the model accordingly.
     */
    privilegeChanged: function privilegeChanged(ev) {

      if (ev && ev.target) {
        /*
         * We're looking for checkboxes only.
         */
        var $el = $(ev.target),
            privilege_type = $el.attr('privilege'),
            type = $el.attr('name'),
            checked = $el.prop('checked'),
            $tr = $el.closest('tr'),
            $tbl = $tr.closest('table'),
            collection = this.model.get('privileges'),
            grantee = this.model.get('grantee');

        this.undelegateEvents();
        /*
         * If the checkbox selected/deselected is for 'ALL', we will select all
         * the checkbox for each privilege.
         */
        if (privilege_type == 'ALL') {
          var $elGrant = $tr.find('input[name=with_grant]'),
              $allPrivileges = $tbl.find('input[name=privilege][privilege!=\'ALL\']'),
              $allGrants = $tbl.find('input[name=with_grant][privilege!=\'ALL\']'),
              allPrivilege,
              allWithGrant;

          if (type == 'privilege') {
            /*
             * We clicked the privilege checkbox, and not checkbox for with
             * grant options.
             */
            allPrivilege = checked;
            allWithGrant = false;

            if (checked) {
              $allPrivileges.prop('checked', true);
              /*
               * We have clicked the ALL checkbox, we should be able to select
               * the grant options too.
               */
              if (grantee == 'PUBLIC') {
                $allGrants.prop('disabled', true);
                $elGrant.prop('disabled', true);
              } else {
                $allGrants.prop('disabled', false);
                $elGrant.prop('disabled', false);
              }
            } else {
              /*
               * ALL checkbox has been deselected, hence - we need to make
               * sure.
               * 1. Deselect all the privileges checkboxes
               * 2. Deselect and disable all with grant privilege checkboxes.
               * 3. Deselect and disable the checkbox for ALL with grant privilege.
               */
              $allPrivileges.prop('checked', false);
              $elGrant.prop('checked', false), $allGrants.prop('checked', false);
              $elGrant.prop('disabled', true);
              $allGrants.prop('disabled', true);
            }
          } else {
            /*
             * We were able to click the ALL with grant privilege checkbox,
             * that means, privilege for Privileges are true.
             *
             * We need to select/deselect all the with grant options
             * checkboxes, based on the current value of the ALL with grant
             * privilege checkbox.
             */
            allPrivilege = true;
            allWithGrant = checked;
            $allGrants.prop('checked', checked);
          }

          /*
           * Set the values for each Privilege Model.
           */
          collection.each(function (m) {
            m.set({ 'privilege': allPrivilege, 'with_grant': allWithGrant }, { silent: true });
          });
        } else {
          /*
           * Particular privilege has been selected/deselected, which can be
           * identified using the privilege="X" attribute.
           */
          var attrs = {},
              $tbl = $tr.closest('table'),
              $allPrivilege = $tbl.find('input[name=privilege][privilege=\'ALL\']'),
              $allGrant = $tbl.find('input[name=with_grant][privilege=\'ALL\']');

          attrs[type] = checked;

          if (type == 'privilege') {
            var $elGrant = $el.closest('tr').find('input[name=with_grant]');
            if (!checked) {
              attrs['with_grant'] = false;

              $elGrant.prop('checked', false).prop('disabled', true);
              $allPrivilege.prop('checked', false);
              $allGrant.prop('disabled', true);
              $allGrant.prop('checked', false);
            } else if (grantee != "PUBLIC") {
              $elGrant.prop('disabled', false);
            }
          } else if (!checked) {
            $allGrant.prop('checked', false);
          }
          collection.get(privilege_type).set(attrs, { silent: true });

          if (checked) {
            var $allPrivileges = $tbl.find('input[name=privilege][privilege!=\'ALL\']:checked');

            if ($allPrivileges.length > 1 && $allPrivileges.length == collection.models.length) {

              $allPrivilege.prop('checked', true);

              if (type == 'with_grant') {
                var $allGrants = $tbl.find('input[name=with_grant][privilege!=\'ALL\']:checked');
                if ($allGrants.length == collection.models.length) {
                  $allGrant.prop('disabled', false);
                  $allGrant.prop('checked', true);
                }
              } else if (grantee != "PUBLIC") {
                $allGrant.prop('disabled', false);
              }
            }
          }
        }
        this.model.trigger('change', this.model);

        var anySelected = false,
            msg = null;

        collection.each(function (m) {
          anySelected = anySelected || m.get('privilege');
        });

        if (anySelected) {
          this.model.errorModel.unset('privileges');
          if (this.model.errorModel.has('grantee')) {
            msg = this.model.errorModel.get('grantee');
          }
        } else {
          this.model.errorModel.set('privileges', gettext('At least one privilege should be selected.'));
          msg = gettext('At least one privilege should be selected.');
        }
        if (msg) {
          this.model.collection.trigger('pgadmin-session:model:invalid', msg, this.model);
        } else {
          this.model.collection.trigger('pgadmin-session:model:valid', this.model);
        }
      }
      this.delegateEvents();
    },

    lostFocus: function lostFocus(ev) {
      /*
       * We lost the focus, it's time for us to exit the editor.
       */
      var self = this,

      /*
       * Function to determine whether one dom element is descendant of another
       * dom element.
       */
      isDescendant = function isDescendant(parent, child) {
        var node = child.parentNode;
        while (node != null) {
          if (node == parent) {
            return true;
          }
          node = node.parentNode;
        }
        return false;
      };
      /*
       * Between leaving the old element focus and entering the new element focus the
       * active element is the document/body itself so add timeout to get the proper
       * focused active element.
       */
      setTimeout(function () {
        /*
         Do not close the control if user clicks outside dialog window,
         only close the row if user clicks on add button or on another row, if user
         clicks somewhere else then we will get tagName as 'BODY' or 'WINDOW'
        */
        var is_active_element = document.activeElement.tagName == 'DIV' || document.activeElement.tagName == 'BUTTON';

        if (is_active_element && self.$el[0] != document.activeElement && !isDescendant(self.$el[0], document.activeElement)) {
          var m = self.model;
          m.trigger('backgrid:edited', m, self.column, new Backgrid.Command(ev));
        }
      }, 10);
      return;
    }
  });

  /*
   * This will help us transform the privileges value in proper format to be
   * displayed in the cell.
   */
  var PrivilegeCellFormatter = Backgrid.Extension.PrivilegeCellFormatter = function () {};
  _.extend(PrivilegeCellFormatter.prototype, {
    notation: {
      "CREATE": "C",
      "TEMPORARY": "T",
      "CONNECT": "c",
      "INSERT": "a",
      "SELECT": "r",
      "UPDATE": "w",
      "DELETE": "d",
      "TRUNCATE": "D",
      "REFERENCES": "x",
      "TRIGGER": "t",
      "USAGE": "U",
      "EXECUTE": "X"
    },
    /**
     * Takes a raw value from a model and returns an optionally formatted
     * string for display.
     */
    fromRaw: function fromRaw(rawData, model) {
      var res = '',
          self = this;

      if (rawData instanceof Backbone.Collection) {
        rawData.each(function (m) {
          if (m.get('privilege')) {
            res += m.get('privilege_type');
            if (m.get('with_grant')) {
              res += '*';
            }
          }
        });
      }
      return res;
    }
  });

  /*
   *  PrivilegeCell for rendering and taking input for the privileges.
   */
  var PrivilegeCell = Backgrid.Extension.PrivilegeCell = Backgrid.Cell.extend({
    className: "edit-cell",
    formatter: PrivilegeCellFormatter,
    editor: PrivilegeCellEditor,

    initialize: function initialize(options) {
      var self = this;
      Backgrid.Cell.prototype.initialize.apply(this, arguments);

      self.model.on("change:grantee", function () {
        if (!self.$el.hasClass("editor")) {
          /*
           * Add time out before render; As we might want to wait till model
           * is updated by PrivilegeRoleModel:granteeChanged.
           */
          setTimeout(function () {
            self.render();
          }, 10);
        }
      });
    }
  });

  return PrivilegeRoleModel;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 236:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Backbone) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(5), __webpack_require__(0), __webpack_require__(1), __webpack_require__(8), __webpack_require__(3), __webpack_require__(16), __webpack_require__(6), __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, url_for, $, _, alertify, pgAdmin, Backform, pgBrowser) {
  // This defines the Preference/Options Dialog for pgAdmin IV.
  pgAdmin = pgAdmin || window.pgAdmin || {};

  /*
   * Hmm... this module is already been initialized, we can refer to the old
   * object from here.
   */
  if (pgAdmin.Preferences) return pgAdmin.Preferences;

  pgAdmin.Preferences = {
    init: function init() {
      if (this.initialized) return;

      this.initialized = true;

      // Declare the Preferences dialog
      alertify.dialog('preferencesDlg', function () {

        var jTree,
            // Variable to create the aci-tree
        controls = [],
            // Keep tracking of all the backform controls
        // created by the dialog.
        // Dialog containter
        $container = $("<div class='preferences_dialog'></div>");

        /*
         * Preference Model
         *
         * This model will be used to keep tracking of the changes done for
         * an individual option.
         */
        var PreferenceModel = Backbone.Model.extend({
          idAttribute: 'id',
          defaults: {
            id: undefined,
            value: undefined
          }
        });

        /*
         * Preferences Collection object.
         *
         * We will use only one collection object to keep track of all the
         * preferences.
         */
        var changed = {},
            preferences = this.preferences = new (Backbone.Collection.extend({
          model: PreferenceModel,
          url: url_for('preferences.index'),
          updateAll: function updateAll() {
            // We will send only the modified data to the server.
            for (var key in changed) {
              this.get(key).save();
            }
            return true;
          }
        }))(null);

        preferences.on('reset', function () {
          // Reset the changed variables
          changed = {};
        });

        preferences.on('change', function (m) {
          var id = m.get('id');
          if (!(id in changed)) {
            // Keep track of the original value
            changed[id] = m._previousAttributes.value;
          } else if (_.isEqual(m.get('value'), changed[id])) {
            // Remove unchanged models.
            delete changed[id];
          }
        });

        /*
         * Function: renderPreferencePanel
         *
         * Renders the preference panel in the content div based on the given
         * preferences.
         */
        var renderPreferencePanel = function renderPreferencePanel(prefs) {
          /*
           * Clear the existing html in the preferences content
           */
          var content = $container.find('.preferences_content');
          content.empty();

          /*
           * We should clean up the existing controls.
           */
          if (controls) {
            _.each(controls, function (c) {
              c.remove();
            });
          }
          controls = [];

          /*
           * We will create new set of controls and render it based on the
           * list of preferences using the Backform Field, Control.
           */
          _.each(prefs, function (p) {

            var m = preferences.get(p.id);
            m.errorModel = new Backbone.Model();
            var f = new Backform.Field(_.extend({}, p, { id: 'value', name: 'value' })),
                cntr = new (f.get("control"))({
              field: f,
              model: m
            });
            content.append(cntr.render().$el);

            // We will keep track of all the controls rendered at the
            // moment.
            controls.push(cntr);
          });
        };

        /*
         * Function: dialogContentCleanup
         *
         * Do the dialog container cleanup on openning.
         */

        var dialogContentCleanup = function dialogContentCleanup() {
          // Remove the existing preferences
          if (!jTree) return;

          /*
           * Remove the aci-tree (mainly to remove the jquery object of
           * aciTree from the system for this container).
           */
          try {
            jTreeApi = jTree.aciTree('destroy');
          } catch (ex) {
            // Sometimes - it fails to destroy the tree properly and throws
            // exception.
          }
          jTree.off('acitree', treeEventHandler);

          // We need to reset the data from the preferences too
          preferences.reset();

          /*
           * Clean up the existing controls.
           */
          if (controls) {
            _.each(controls, function (c) {
              c.remove();
            });
          }
          controls = [];

          // Remove all the objects now.
          $container.empty();
        },

        /*
         * Function: selectFirstCategory
         *
         * Whenever a user select a module instead of a category, we should
         * select the first categroy of it.
         */
        selectFirstCategory = function selectFirstCategory(api, item) {
          var data = item ? api.itemData(item) : null;

          if (data && data.preferences) {
            api.select(item);
            return;
          }
          item = api.first(item);
          selectFirstCategory(api, item);
        },

        /*
         * A map on how to create controls for each datatype in preferences
         * dialog.
         */
        getControlMappedForType = function getControlMappedForType(p) {
          switch (p.type) {
            case 'text':
              return 'input';
            case 'boolean':
              p.options = {
                onText: gettext('True'),
                offText: gettext('False'),
                onColor: 'success',
                offColor: 'default',
                size: 'mini'
              };
              return 'switch';
            case 'node':
              p.options = {
                onText: gettext('Show'),
                offText: gettext('Hide'),
                onColor: 'success',
                offColor: 'default',
                size: 'mini'
              };
              return 'switch';
            case 'integer':
              return 'numeric';
            case 'numeric':
              return 'numeric';
            case 'date':
              return 'datepicker';
            case 'datetime':
              return 'datetimepicker';
            case 'options':
              var opts = [];
              // Convert the array to SelectControl understandable options.
              _.each(p.options, function (o) {
                if ('label' in o && 'value' in o) {
                  opts.push({ 'label': o.label, 'value': o.value });
                } else {
                  opts.push({ 'label': o, 'value': o });
                }
              });
              p.options = opts;
              return 'select2';
            case 'multiline':
              return 'textarea';
            case 'switch':
              return 'switch';
            default:
              if (console && console.log) {
                // Warning for developer only.
                console.log("Hmm.. We don't know how to render this type - ''" + type + "' of control.");
              }
              return 'input';
          }
        },

        /*
         * function: treeEventHandler
         *
         * It is basically a callback, which listens to aci-tree events,
         * and act accordingly.
         *
         * + Selection of the node will existance of the preferences for
         *   the selected tree-node, if not pass on to select the first
         *   category under a module, else pass on to the render function.
         *
         * + When a new node is added in the tree, it will add the relavent
         *   preferences in the preferences model collection, which will be
         *   called during initialization itself.
         *
         *
         */
        treeEventHandler = function treeEventHandler(event, api, item, eventName) {
          // Look for selected item (if none supplied)!
          item = item || api.selected();

          // Event tree item has itemData
          var d = item ? api.itemData(item) : null;

          /*
           * boolean (switch/checkbox), string, enum (combobox - enumvals),
           * integer (min-max), font, color
           */
          switch (eventName) {
            case "selected":
              if (!d) return true;

              if (d.preferences) {
                /*
                 * Clear the existing html in the preferences content
                 */
                renderPreferencePanel(d.preferences);

                return true;
              } else {
                selectFirstCategory(api, item);
              }
              break;
            case 'added':
              if (!d) return true;

              // We will add the preferences in to the preferences data
              // collection.
              if (d.preferences && _.isArray(d.preferences)) {
                _.each(d.preferences, function (p) {
                  preferences.add({
                    'id': p.id, 'value': p.value, 'cid': d.id, 'mid': d.mid
                  });
                  /*
                   * We don't know until now, how to render the control for
                   * this preference.
                   */
                  if (!p.control) {
                    p.control = getControlMappedForType(p);
                  }
                  if (p.help_str) {
                    p.helpMessage = p.help_str;
                  }
                });
              }
              d.sortable = false;
              break;
            case 'loaded':
              // Let's select the first category from the prefrences.
              // We need to wait for sometime before all item gets loaded
              // properly.
              setTimeout(function () {
                selectFirstCategory(api, null);
              }, 300);
              break;
          }
          return true;
        };

        // Dialog property
        return {
          main: function main() {

            // Remove the existing content first.
            dialogContentCleanup();

            $container.append("<div class='pg-el-xs-3 preferences_tree aciTree'></div>").append("<div class='pg-el-xs-9 preferences_content'>" + gettext('Category is not selected.') + "</div>");

            // Create the aci-tree for listing the modules and categories of
            // it.
            jTree = $container.find('.preferences_tree');
            jTree.on('acitree', treeEventHandler);

            jTree.aciTree({
              selectable: true,
              expand: true,
              ajax: {
                url: url_for('preferences.index')
              }
            });

            this.show();
          },
          setup: function setup() {
            return {
              buttons: [{
                text: '', key: 112,
                className: 'btn btn-default pull-left fa fa-lg fa-question',
                attrs: {
                  name: 'dialog_help', type: 'button',
                  label: gettext('Preferences'),
                  url: url_for('help.static', { 'filename': 'preferences.html' })
                }
              }, {
                text: gettext('OK'), key: 13, className: "btn btn-primary fa fa-lg fa-save pg-alertify-button"
              }, {
                text: gettext('Cancel'), key: 27, className: "btn btn-danger fa fa-lg fa-times pg-alertify-button"
              }],
              focus: { element: 0 },
              options: {
                padding: !1,
                overflow: !1,
                title: gettext('Preferences'),
                closableByDimmer: false,
                modal: false,
                pinnable: false
              }
            };
          },
          callback: function callback(e) {
            if (e.button.element.name == "dialog_help") {
              e.cancel = true;
              pgBrowser.showHelp(e.button.element.name, e.button.element.getAttribute('url'), null, null, e.button.element.getAttribute('label'));
              return;
            }

            if (e.button.text == gettext('OK')) {
              preferences.updateAll();
              // Refresh preferences cache
              pgBrowser.cache_preferences();
            }
          },
          build: function build() {
            this.elements.content.appendChild($container.get(0));
            alertify.pgDialogBuild.apply(this);
          },
          hooks: {
            onshow: function onshow() {
              $(this.elements.body).addClass('pgadmin-preference-body');
            }
          }
        };
      });
    },
    show: function show() {
      alertify.preferencesDlg(true).resizeTo('60%', '60%');
    }
  };

  return pgAdmin.Preferences;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function (root, factory) {

  // Set up Backform appropriately for the environment. Start with AMD.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(1), __webpack_require__(4), __webpack_require__(0), __webpack_require__(10), __webpack_require__(16), __webpack_require__(13), __webpack_require__(14), __webpack_require__(28), __webpack_require__(158)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, _, S, $, Backbone, Backform, Backgrid, CodeMirror) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backform.
      return factory(root, gettext, _, S, $, Backbone, Backform, Backgrid, CodeMirror);
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

    // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore') || root._,
        $ = root.jQuery || root.$ || root.Zepto || root.ender,
        Backbone = require('backbone') || root.Backbone,
        Backform = require('backform') || root.Backform,
        Backgrid = require('backgrid') || root.Backgrid,
        CodeMirror = require('codemirror') || root.CodeMirror,
        S = require('underscore.string'),
        gettext = require('sources/gettext');
    factory(root, gettext, _, S, $, Backbone, Backform, Backgrid, CodeMirror);
    // Finally, as a browser global.
  } else {
    factory(root, root.gettext, root._, root.s, root.jQuery || root.Zepto || root.ender || root.$, root.Backbone, root.Backform, root.Backgrid, root.CodeMirror);
  }
})(undefined, function (root, gettext, _, S, $, Backbone, Backform, Backgrid, CodeMirror) {

  var pgAdmin = window.pgAdmin = window.pgAdmin || {};

  pgAdmin.editableCell = function () {
    if (this.attributes && !_.isUndefined(this.attributes.disabled) && !_.isNull(this.attributes.disabled)) {
      if (_.isFunction(this.attributes.disabled)) {
        return !this.attributes.disabled.apply(this, arguments);
      }
      if (_.isBoolean(this.attributes.disabled)) {
        return !this.attributes.disabled;
      }
    }
  };

  // HTML markup global class names. More can be added by individual controls
  // using _.extend. Look at RadioControl as an example.
  _.extend(Backform, {
    controlLabelClassName: "control-label pg-el-sm-3 pg-el-xs-12",
    controlsClassName: "pgadmin-controls pg-el-sm-9 pg-el-xs-12",
    groupClassName: "pgadmin-control-group form-group pg-el-xs-12",
    setGroupClassName: "set-group pg-el-xs-12",
    tabClassName: "backform-tab pg-el-xs-12",
    setGroupContentClassName: "fieldset-content pg-el-xs-12"
  });

  var controlMapper = Backform.controlMapper = {
    'int': ['uneditable-input', 'numeric', 'integer'],
    'text': ['uneditable-input', 'input', 'string'],
    'numeric': ['uneditable-input', 'numeric', 'numeric'],
    'date': 'datepicker',
    'datetime': 'datetimepicker',
    'boolean': 'boolean',
    'options': ['readonly-option', 'select', Backgrid.Extension.PGSelectCell],
    'multiline': ['textarea', 'textarea', 'string'],
    'collection': ['sub-node-collection', 'sub-node-collection', 'string'],
    'uniqueColCollection': ['unique-col-collection', 'unique-col-collection', 'string'],
    'switch': 'switch',
    'select2': 'select2',
    'note': 'note'
  };

  var getMappedControl = Backform.getMappedControl = function (type, mode) {
    if (type in Backform.controlMapper) {
      var m = Backform.controlMapper[type];

      if (!_.isArray(m)) {
        return m;
      }

      var idx = 1,
          len = _.size(m);

      switch (mode) {
        case 'properties':
          idx = 0;
          break;
        case 'edit':
        case 'create':
        case 'control':
          idx = 1;
          break;
        case 'cell':
          idx = 2;
          break;
        default:
          idx = 0;
          break;
      }

      return m[idx > len ? 0 : idx];
    }
    return type;
  };

  var BackformControlInit = Backform.Control.prototype.initialize,
      BackformControlRemove = Backform.Control.prototype.remove;

  // Override the Backform.Control to allow to track changes in dependencies,
  // and rerender the View element
  _.extend(Backform.Control.prototype, {

    defaults: _.extend(Backform.Control.prototype.defaults, { helpMessage: null }),

    initialize: function initialize() {
      BackformControlInit.apply(this, arguments);

      // Listen to the dependent fields in the model for any change
      var deps = this.field.get('deps');
      var self = this;

      if (deps && _.isArray(deps)) {
        _.each(deps, function (d) {
          var attrArr = d.split('.');
          var name = attrArr.shift();
          self.listenTo(self.model, "change:" + name, self.render);
        });
      }
    },

    remove: function remove() {
      // Remove the events for the dependent fields in the model
      var self = this,
          deps = self.field.get('deps');

      self.stopListening(self.model, "change:" + name, self.render);
      self.stopListening(self.model.errorModel, "change:" + name, self.updateInvalid);

      if (deps && _.isArray(deps)) {
        _.each(deps, function (d) {

          var attrArr = d.split('.');
          var name = attrArr.shift();

          self.stopListening(self.model, "change:" + name, self.render);
        });
      }

      if (this.cleanup) {
        this.cleanup.apply(this);
      }

      if (BackformControlRemove) {
        BackformControlRemove.apply(self, arguments);
      } else {
        Backbone.View.prototype.remove.apply(self, arguments);
      }
    },

    template: _.template(['<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>', '<div class="<%=Backform.controlsClassName%>">', '  <span class="<%=Backform.controlClassName%> uneditable-input" <%=disabled ? "disabled" : ""%>>', '    <%-value%>', '  </span>', '</div>', '<% if (helpMessage && helpMessage.length) { %>', '  <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>', '<% } %>'].join("\n")),

    clearInvalid: function clearInvalid() {
      this.$el.removeClass(Backform.errorClassName);
      this.$el.find(".pgadmin-control-error-message").remove();
      return this;
    },

    updateInvalid: function updateInvalid() {
      var self = this,
          errorModel = this.model.errorModel;

      if (!(errorModel instanceof Backbone.Model)) return this;

      this.clearInvalid();

      /*
      * Find input which have name attribute.
      */
      this.$el.find(':input[name]').not('button').each(function (ix, el) {
        var attrArr = $(el).attr('name').split('.'),
            name = attrArr.shift(),
            path = attrArr.join('.'),
            error = self.keyPathAccessor(errorModel.toJSON(), $(el).attr('name'));

        if (_.isEmpty(error)) return;
        self.$el.addClass(Backform.errorClassName);
      });
    },

    /*
     * Overriding the render function of the control to allow us to eval the
     * values properly.
     */
    render: function render() {
      var field = _.defaults(this.field.toJSON(), this.defaults),
          attributes = this.model.toJSON(),
          attrArr = field.name.split('.'),
          name = attrArr.shift(),
          path = attrArr.join('.'),
          rawValue = this.keyPathAccessor(attributes[name], path),
          data = _.extend(field, {
        rawValue: rawValue,
        value: this.formatter.fromRaw(rawValue, this.model),
        attributes: attributes,
        formatter: this.formatter
      }),
          evalF = function evalF(f, d, m) {
        return _.isFunction(f) ? !!f.apply(d, [m]) : !!f;
      };

      // Evaluate the disabled, visible, and required option
      _.extend(data, {
        disabled: evalF(data.disabled, data, this.model),
        visible: evalF(data.visible, data, this.model),
        required: evalF(data.required, data, this.model)
      });

      // Clean up first
      this.$el.removeClass(Backform.hiddenClassName);

      if (!data.visible) this.$el.addClass(Backform.hiddenClassName);

      this.$el.html(this.template(data)).addClass(field.name);
      this.updateInvalid();

      return this;
    }
  });

  /*
   * Override the input control events in order to reslove the issue related to
   * not updating the value sometimes in the input control.
   */
  _.extend(Backform.InputControl.prototype, {
    events: {
      "change input": "onChange",
      "blur input": "onChange",
      "keyup input": "onKeyUp",
      "focus input": "clearInvalid"
    },
    onKeyUp: function onKeyUp(ev) {
      if (this.key_timeout) {
        clearTimeout(this.key_timeout);
      }

      this.keyup_timeout = setTimeout(function () {
        this.onChange(ev);
      }.bind(this), 400);
    }
  });

  /*
   * Override the textarea control events in order to resolve the issue related
   * to not updating the value in model on certain browsers in few situations
   * like copy/paste, deletion using backspace.
   *
   * Reference:
   * http://stackoverflow.com/questions/11338592/how-can-i-bind-to-the-change-event-of-a-textarea-in-jquery
   */
  _.extend(Backform.TextareaControl.prototype, {
    defaults: _.extend(Backform.TextareaControl.prototype.defaults, { rows: 5, helpMessage: null }),
    events: {
      "change textarea": "onChange",
      "keyup textarea": "onKeyUp",
      "paste textarea": "onChange",
      "selectionchange textarea": "onChange",
      "focus textarea": "clearInvalid"
    },
    template: _.template(['<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>', '<div class="<%=Backform.controlsClassName%>">', '  <textarea ', '    class="<%=Backform.controlClassName%> <%=extraClasses.join(\' \')%>" name="<%=name%>"', '    maxlength="<%=maxlength%>" placeholder="<%-placeholder%>" <%=disabled ? "disabled" : ""%>', '    rows=<%=rows ? rows : ""%>', '    <%=required ? "required" : ""%>><%-value%></textarea>', '  <% if (helpMessage && helpMessage.length) { %>', '    <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>', '  <% } %>', '</div>'].join("\n")),
    onKeyUp: function onKeyUp(ev) {
      if (this.key_timeout) {
        clearTimeout(this.key_timeout);
      }

      this.keyup_timeout = setTimeout(function () {
        this.onChange(ev);
      }.bind(this), 400);
    }
  });

  /*
   * Overriding the render function of the select control to allow us to use
   * options as function, which should return array in the format of
   * (label, value) pair.
   */
  Backform.SelectControl.prototype.render = function () {
    var field = _.defaults(this.field.toJSON(), this.defaults),
        attributes = this.model.toJSON(),
        attrArr = field.name.split('.'),
        name = attrArr.shift(),
        path = attrArr.join('.'),
        rawValue = this.keyPathAccessor(attributes[name], path),
        data = _.extend(field, {
      rawValue: rawValue,
      value: this.formatter.fromRaw(rawValue, this.model),
      attributes: attributes,
      formatter: this.formatter
    }),
        evalF = function evalF(f, d, m) {
      return _.isFunction(f) ? !!f.apply(d, [m]) : !!f;
    };

    // Evaluate the disabled, visible, and required option
    _.extend(data, {
      disabled: evalF(data.disabled, data, this.model),
      visible: evalF(data.visible, data, this.model),
      required: evalF(data.required, data, this.model)
    });
    // Evaluation the options
    if (_.isFunction(data.options)) {
      try {
        data.options = data.options(this);
      } catch (e) {
        // Do nothing
        data.options = [];
        this.model.trigger('pgadmin-view:transform:error', this.model, this.field, e);
      }
    }

    // Clean up first
    this.$el.removeClass(Backform.hiddenClassName);

    if (!data.visible) this.$el.addClass(Backform.hiddenClassName);

    this.$el.html(this.template(data)).addClass(field.name);
    this.updateInvalid();

    return this;
  };
  _.extend(Backform.SelectControl.prototype.defaults, { helpMessage: null });

  var ReadonlyOptionControl = Backform.ReadonlyOptionControl = Backform.SelectControl.extend({
    template: _.template(['<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>', '<div class="<%=Backform.controlsClassName%>">', '<% for (var i=0; i < options.length; i++) { %>', ' <% var option = options[i]; %>', ' <% if (option.value === rawValue) { %>', ' <span class="<%=Backform.controlClassName%> uneditable-input" disabled><%-option.label%></span>', ' <% } %>', '<% } %>', '<% if (helpMessage && helpMessage.length) { %>', '  <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>', '<% } %>', '</div>'].join("\n")),
    events: {},
    getValueFromDOM: function getValueFromDOM() {
      return this.formatter.toRaw(this.$el.find("span").text(), this.model);
    }
  });

  /*
   * Override the function 'updateInvalid' of the radio control to resolve an
   * issue, which will not render the error block multiple times for each
   * options.
   */
  _.extend(Backform.RadioControl.prototype, {
    updateInvalid: function updateInvalid() {
      var self = this,
          errorModel = this.model.errorModel;

      if (!(errorModel instanceof Backbone.Model)) return this;

      this.clearInvalid();

      /*
       * Find input which have name attribute.
       */
      this.$el.find(':input[name]').not('button').each(function (ix, el) {
        var attrArr = $(el).attr('name').split('.'),
            name = attrArr.shift(),
            path = attrArr.join('.'),
            error = self.keyPathAccessor(errorModel.toJSON(), $(el).attr('name'));

        if (_.isEmpty(error)) return;

        self.$el.addClass(Backform.errorClassName).find('[type="radio"]').append($("<div></div>").addClass('pgadmin-control-error-message pg-el-xs-offset-4 pg-el-xs-8 pg-el-xs-8 help-block').text(error));
      });
    }
  });

  // Requires the Bootstrap Switch to work.
  var SwitchControl = Backform.SwitchControl = Backform.InputControl.extend({
    defaults: {
      label: "",
      options: {
        onText: 'Yes',
        offText: 'No',
        onColor: 'success',
        offColor: 'primary',
        size: 'small'
      },
      extraClasses: [],
      helpMessage: null
    },
    template: _.template(['<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>', '<div class="<%=Backform.controlsClassName%>">', '  <div class="checkbox">', '    <label>', '      <input type="checkbox" class="<%=extraClasses.join(\' \')%>" name="<%=name%>" <%=value ? "checked=\'checked\'" : ""%> <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> />', '    </label>', '  </div>', '  <% if (helpMessage && helpMessage.length) { %>', '    <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>', '  <% } %>', '</div>'].join("\n")),
    getValueFromDOM: function getValueFromDOM() {
      return this.formatter.toRaw(this.$input.prop('checked'), this.model);
    },
    events: { 'switchChange.bootstrapSwitch': 'onChange' },
    render: function render() {
      var field = _.defaults(this.field.toJSON(), this.defaults),
          attributes = this.model.toJSON(),
          attrArr = field.name.split('.'),
          name = attrArr.shift(),
          path = attrArr.join('.'),
          rawValue = this.keyPathAccessor(attributes[name], path),
          evalF = function evalF(f, d, m) {
        return _.isFunction(f) ? !!f.apply(d, [m]) : !!f;
      },
          options = _.defaults({
        disabled: evalF(field.disabled, field, this.model)
      }, this.field.get('options'), this.defaults.options, $.fn.bootstrapSwitch.defaults);

      Backform.InputControl.prototype.render.apply(this, arguments);
      this.$input = this.$el.find("input[type=checkbox]").first();

      //Check & set additional properties
      this.$input.bootstrapSwitch(_.extend(options, { 'state': rawValue }));

      return this;
    }
  });

  // Backform Dialog view (in bootstrap tabbular form)
  // A collection of field models.
  var Dialog = Backform.Dialog = Backform.Form.extend({
    /* Array of objects having attributes [label, fields] */
    schema: undefined,
    tagName: "div",
    legend: true,
    className: function className() {
      return 'pg-el-sm-12 pg-el-md-12 pg-el-lg-12 pg-el-xs-12';
    },
    tabPanelClassName: function tabPanelClassName() {
      return Backform.tabClassName;
    },
    tabIndex: 0,
    initialize: function initialize(opts) {
      var s = opts.schema;
      if (s && _.isArray(s)) {
        this.schema = _.each(s, function (o) {
          if (o.fields && !(o.fields instanceof Backbone.Collection)) o.fields = new Backform.Fields(o.fields);
          o.cId = o.cId || _.uniqueId('pgC_');
          o.hId = o.hId || _.uniqueId('pgH_');
          o.disabled = o.disabled || false;
          o.legend = opts.legend;
        });
        if (opts.tabPanelClassName && _.isFunction(opts.tabPanelClassName)) {
          this.tabPanelClassName = opts.tabPanelClassName;
        }
      }
      this.model.errorModel = opts.errorModel || this.model.errorModel || new Backbone.Model();
      this.controls = [];
    },
    template: {
      'header': _.template(['<li role="presentation" <%=disabled ? "disabled" : ""%>>', ' <a data-toggle="tab" data-tab-index="<%=tabIndex%>" href="#<%=cId%>"', '  id="<%=hId%>" aria-controls="<%=cId%>">', '<%=label%></a></li>'].join(" ")),
      'panel': _.template('<div role="tabpanel" class="tab-pane <%=label%> pg-el-sm-12 pg-el-md-12 pg-el-lg-12 pg-el-xs-12 fade" id="<%=cId%>" aria-labelledby="<%=hId%>"></div>') },
    render: function render() {
      this.cleanup();

      var c = this.$el.children().first().children('.active').first().attr('id'),
          m = this.model,
          controls = this.controls,
          tmpls = this.template,
          self = this,
          idx = this.tabIndex * 100,
          evalF = function evalF(f, d, m) {
        return _.isFunction(f) ? !!f.apply(d, [m]) : !!f;
      };

      this.$el.empty().attr('role', 'tabpanel').attr('class', _.result(this, 'tabPanelClassName'));
      m.panelEl = this.$el;

      var tabHead = $('<ul class="nav nav-tabs" role="tablist"></ul>').appendTo(this.$el);
      var tabContent = $('<ul class="tab-content pg-el-sm-12 pg-el-md-12 pg-el-lg-12 pg-el-xs-12"></ul>').appendTo(this.$el);

      _.each(this.schema, function (o) {
        idx++;
        if (!o.version_compatible || !evalF(o.visible, o, m)) {
          return;
        }
        var el = $(tmpls['panel'](_.extend(o, { 'tabIndex': idx }))).appendTo(tabContent).removeClass('collapse').addClass('collapse'),
            h = $(tmpls['header'](o)).appendTo(tabHead);

        o.fields.each(function (f) {
          var cntr = new (f.get("control"))({
            field: f,
            model: m,
            dialog: self,
            tabIndex: idx
          });
          el.append(cntr.render().$el);
          controls.push(cntr);
        });

        tabHead.find('a[data-toggle="tab"]').off('shown.bs.tab').off('hidden.bs.tab').on('hidden.bs.tab', function () {
          self.hidden_tab = $(this).data('tabIndex');
        }).on('shown.bs.tab', function () {
          var self = this;
          self.shown_tab = $(self).data('tabIndex');
          m.trigger('pg-property-tab-changed', {
            'model': m, 'shown': self.shown_tab, 'hidden': self.hidden_tab,
            'tab': self
          });
        });
      });

      var makeActive = tabHead.find('[id="' + c + '"]').first();
      if (makeActive.length == 1) {
        makeActive.parent().addClass('active');
        tabContent.find('#' + makeActive.attr("aria-controls")).addClass('in active');
      } else {
        tabHead.find('[role="presentation"]').first().addClass('active');
        tabContent.find('[role="tabpanel"]').first().addClass('in active');
      }

      return this;
    },
    remove: function remove(opts) {
      if (opts && opts.data) {
        if (this.model) {
          if (this.model.reset) {
            this.model.reset({ validate: false, silent: true, stop: true });
          }
          this.model.clear({ validate: false, silent: true, stop: true });
          delete this.model;
        }
        if (this.errorModel) {
          this.errorModel.clear({ validate: false, silent: true, stop: true });
          delete this.errorModel;
        }
      }
      this.cleanup();
      Backform.Form.prototype.remove.apply(this, arguments);
    }
  });

  var Fieldset = Backform.Fieldset = Backform.Dialog.extend({
    className: function className() {
      return 'set-group pg-el-xs-12';
    },
    tabPanelClassName: function tabPanelClassName() {
      return Backform.tabClassName;
    },
    fieldsetClass: Backform.setGroupClassName,
    legendClass: 'badge',
    contentClass: Backform.setGroupContentClassName + ' collapse in',
    template: {
      'header': _.template(['<fieldset class="<%=fieldsetClass%>" <%=disabled ? "disabled" : ""%>>', ' <% if (legend != false) { %>', '  <legend class="<%=legendClass%>" <%=collapse ? "data-toggle=\'collapse\'" : ""%> data-target="#<%=cId%>"><%=collapse ? "<span class=\'caret\'></span>" : "" %><%=label%></legend>', ' <% } %>', '</fieldset>'].join("\n")),
      'content': _.template('  <div id="<%= cId %>" class="<%=contentClass%>"></div>') },
    collapse: true,
    render: function render() {
      this.cleanup();

      var m = this.model,
          $el = this.$el,
          tmpl = this.template,
          controls = this.controls,
          data = {
        'className': _.result(this, 'className'),
        'fieldsetClass': _.result(this, 'fieldsetClass'),
        'legendClass': _.result(this, 'legendClass'),
        'contentClass': _.result(this, 'contentClass'),
        'collapse': _.result(this, 'collapse')
      },
          idx = this.tabIndex * 100,
          evalF = function evalF(f, d, m) {
        return _.isFunction(f) ? !!f.apply(d, [m]) : !!f;
      };

      this.$el.empty();

      _.each(this.schema, function (o) {
        idx++;
        if (!o.version_compatible || !evalF(o.visible, o, m)) {
          return;
        }

        if (!o.fields) return;

        var d = _.extend({}, data, o),
            h = $(tmpl['header'](d)).appendTo($el),
            el = $(tmpl['content'](d)).appendTo(h);

        o.fields.each(function (f) {
          var cntr = new (f.get("control"))({
            field: f,
            model: m,
            tabIndex: idx
          });
          el.append(cntr.render().$el);
          controls.push(cntr);
        });
      });

      return this;
    },
    getValueFromDOM: function getValueFromDOM() {
      return "";
    },
    events: {}
  });

  var generateGridColumnsFromModel = Backform.generateGridColumnsFromModel = function (node_info, m, type, cols, node) {
    var groups = Backform.generateViewSchema(node_info, m, type, node, true, true),
        schema = [],
        columns = [],
        func,
        idx = 0;

    // Create another array if cols is of type object & store its keys in that array,
    // If cols is object then chances that we have custom width class attached with in.
    if (_.isNull(cols) || _.isUndefined(cols)) {
      func = function func(f) {
        f.cell_priority = idx;
        idx = idx + 1;

        // We can also provide custom header cell class in schema itself,
        // But we will give priority to extraClass attached in cols
        // If headerCell property is already set by cols then skip extraClass property from schema
        if (!f.headerCell && f.cellHeaderClasses) {
          f.headerCell = Backgrid.Extension.CustomHeaderCell;
        }
      };
    } else if (_.isArray(cols)) {
      func = function func(f) {
        f.cell_priority = _.indexOf(cols, f.name);

        // We can also provide custom header cell class in schema itself,
        // But we will give priority to extraClass attached in cols
        // If headerCell property is already set by cols then skip extraClass property from schema
        if (!f.headerCell && f.cellHeaderClasses) {
          f.headerCell = Backgrid.Extension.CustomHeaderCell;
        }
      };
    } else if (_.isObject(cols)) {
      var tblCols = Object.keys(cols);
      func = function func(f) {
        var val = f.name in cols && cols[f.name];

        if (_.isNull(val) || _.isUndefined(val)) {
          f.cell_priority = -1;
          return;
        }
        if (_.isObject(val)) {
          if ('index' in val) {
            f.cell_priority = val['index'];
            idx = idx > val['index'] ? idx + 1 : val['index'];
          } else {
            var i = _.indexOf(tblCols, f.name);
            f.cell_priority = idx = i > idx ? i : idx;
            idx = idx + 1;
          }

          // We can also provide custom header cell class in schema itself,
          // But we will give priority to extraClass attached in cols
          // If headerCell property is already set by cols then skip extraClass property from schema
          if (!f.headerCell) {
            if (f.cellHeaderClasses) {
              f.headerCell = Backgrid.Extension.CustomHeaderCell;
            }
            if ('class' in val && _.isString(val['class'])) {
              f.headerCell = Backgrid.Extension.CustomHeaderCell;
              f.cellHeaderClasses = (f.cellHeaderClasses || '') + ' ' + val['class'];
            }
          }
        }
        if (_.isString(val)) {
          var i = _.indexOf(tblCols, f.name);

          f.cell_priority = idx = i > idx ? i : idx;
          idx = idx + 1;

          if (!f.headerCell) {
            f.headerCell = Backgrid.Extension.CustomHeaderCell;
          }
          f.cellHeaderClasses = (f.cellHeaderClasses || '') + ' ' + val;
        }
      };
    }

    // Prepare columns for backgrid
    _.each(groups, function (group, key) {
      _.each(group.fields, function (f) {
        if (!f.cell) {
          return;
        }
        // Check custom property in cols & if it is present then attach it to current cell
        func(f);
        if (f.cell_priority != -1) {
          columns.push(f);
        }
      });
      schema.push(group);
    });
    return {
      'columns': _.sortBy(columns, function (c) {
        return c.cell_priority;
      }),
      'schema': schema
    };
  };

  var UniqueColCollectionControl = Backform.UniqueColCollectionControl = Backform.Control.extend({
    initialize: function initialize() {
      Backform.Control.prototype.initialize.apply(this, arguments);

      var uniqueCol = this.field.get('uniqueCol') || [],
          m = this.field.get('model'),
          schema = m.prototype.schema || m.__super__.schema,
          columns = [],
          self = this;

      _.each(schema, function (s) {
        columns.push(s.id);
      });

      // Check if unique columns provided are also in model attributes.
      if (uniqueCol.length > _.intersection(columns, uniqueCol).length) {
        var errorMsg = "Developer: Unique columns [ " + _.difference(uniqueCol, columns) + " ] not found in collection model [ " + columns + " ].";
        alert(errorMsg);
      }

      var collection = self.collection = self.model.get(self.field.get('name'));

      if (!collection) {
        collection = self.collection = new pgAdmin.Browser.Node.Collection(null, {
          model: self.field.get('model'),
          silent: true,
          handler: self.model,
          top: self.model.top || self.model,
          attrName: self.field.get('name')
        });
        self.model.set(self.field.get('name'), collection, { silent: true });
      }

      if (this.field.get('version_compatible')) {
        self.listenTo(collection, "add", self.collectionChanged);
        self.listenTo(collection, "change", self.collectionChanged);
      }
    },
    cleanup: function cleanup() {
      this.stopListening(this.collection, "change", this.collectionChanged);

      if (this.field.get('version_compatible')) {
        this.stopListening(self.collection, "add", this.collectionChanged);
        this.stopListening(self.collection, "change", this.collectionChanged);
      }
      if (this.grid) {
        this.grid.remove();
        delete this.grid;
      }
      this.$el.empty();
    },
    collectionChanged: function collectionChanged(newModel, coll, op) {
      var uniqueCol = this.field.get('uniqueCol') || [],
          uniqueChangedAttr = [],
          self = this;
      // Check if changed model attributes are also in unique columns. And then only check for uniqueness.
      if (newModel.attributes) {
        _.each(uniqueCol, function (col) {
          if (_.has(newModel.attributes, col)) {
            uniqueChangedAttr.push(col);
          }
        });
        if (uniqueChangedAttr.length == 0) {
          return;
        }
      } else {
        return;
      }

      var collection = this.model.get(this.field.get('name'));
      this.stopListening(collection, "change", this.collectionChanged);
      // Check if changed attribute's value of new/updated model also exist for another model in collection.
      // If duplicate value exists then set the attribute's value of new/updated model to its previous values.
      var m = undefined,
          oldModel = undefined;
      collection.each(function (model) {
        if (newModel != model) {
          var duplicateAttrValues = [];
          _.each(uniqueCol, function (attr) {
            var attrValue = newModel.get(attr);
            if (!_.isUndefined(attrValue) && attrValue == model.get(attr)) {
              duplicateAttrValues.push(attrValue);
            }
          });
          if (duplicateAttrValues.length == uniqueCol.length) {
            m = newModel;
            // Keep reference of model to make it visible in dialog.
            oldModel = model;
          }
        }
      });
      if (m) {
        if (op && op.add) {
          // Remove duplicate model.
          setTimeout(function () {
            collection.remove(m);
          }, 0);
        } else {
          /*
           * Set model value to its previous value as its new value is
           * conflicting with another model value.
           */

          m.set(uniqueChangedAttr[0], m.previous(uniqueChangedAttr[0]));
        }
        if (oldModel) {
          var idx = collection.indexOf(oldModel);
          if (idx > -1) {
            var newRow = self.grid.body.rows[idx].$el;
            newRow.addClass("new");
            $(newRow).pgMakeVisible('backform-tab');
            setTimeout(function () {
              newRow.removeClass("new");
            }, 3000);
          }
        }
      }

      this.listenTo(collection, "change", this.collectionChanged);
    },
    render: function render() {
      // Clean up existing elements

      this.undelegateEvents();
      this.$el.empty();

      var field = _.defaults(this.field.toJSON(), this.defaults),
          attributes = this.model.toJSON(),
          attrArr = field.name.split('.'),
          name = attrArr.shift(),
          path = attrArr.join('.'),
          rawValue = this.keyPathAccessor(attributes[name], path),
          data = _.extend(field, {
        rawValue: rawValue,
        value: this.formatter.fromRaw(rawValue, this.model),
        attributes: attributes,
        formatter: this.formatter
      }),
          evalF = function evalF(f, d, m) {
        return _.isFunction(f) ? !!f.apply(d, [m]) : !!f;
      };

      // Evaluate the disabled, visible, required, canAdd, & canDelete option
      _.extend(data, {
        disabled: field.version_compatible && evalF.apply(this.field, [data.disabled, data, this.model]),
        visible: evalF.apply(this.field, [data.visible, data, this.model]),
        required: evalF.apply(this.field, [data.required, data, this.model]),
        canAdd: field.version_compatible && evalF.apply(this.field, [data.canAdd, data, this.model]),
        canAddRow: data.canAddRow,
        canDelete: evalF.apply(this.field, [data.canDelete, data, this.model]),
        canEdit: evalF.apply(this.field, [data.canEdit, data, this.model])
      });
      _.extend(data, { add_label: "" });

      // This control is not visible, we should remove it.
      if (!data.visible) {
        return this;
      }

      this.control_data = _.clone(data);

      // Show Backgrid Control
      var grid = this.showGridControl(data);

      this.$el.html(grid).addClass(field.name);
      this.updateInvalid();

      this.delegateEvents();
      return this;
    },
    showGridControl: function showGridControl(data) {
      var self = this,
          gridHeader = _.template(['<div class="subnode-header">', '  <label class="control-label pg-el-sm-10"><%-label%></label>', '  <button class="btn-sm btn-default add fa fa-plus" <%=canAdd ? "" : "disabled=\'disabled\'"%>><%-add_label%></button>', '</div>'].join("\n")),
          gridBody = $('<div class="pgadmin-control-group backgrid form-group pg-el-xs-12 object subnode"></div>').append(gridHeader(data));

      // Clean up existing grid if any (in case of re-render)
      if (self.grid) {
        self.grid.remove();
      }

      if (!data.subnode) {
        return '';
      }

      var subnode = data.subnode.schema ? data.subnode : data.subnode.prototype,
          gridSchema = Backform.generateGridColumnsFromModel(data.node_info, subnode, this.field.get('mode'), data.columns);

      // Set visibility of Add button
      if (data.mode == 'properties') {
        $(gridBody).find("button.add").remove();
      }

      // Insert Delete Cell into Grid
      if (!data.disabled && data.canDelete) {
        gridSchema.columns.unshift({
          name: "pg-backform-delete", label: "",
          cell: Backgrid.Extension.DeleteCell,
          editable: false, cell_priority: -1,
          canDeleteRow: data.canDeleteRow
        });
      }

      // Insert Edit Cell into Grid
      if (data.disabled == false && data.canEdit) {
        var editCell = Backgrid.Extension.ObjectCell.extend({
          schema: gridSchema.schema
        });

        gridSchema.columns.unshift({
          name: "pg-backform-edit", label: "", cell: editCell,
          cell_priority: -2, canEditRow: data.canEditRow
        });
      }

      var collection = this.model.get(data.name);

      var cellEditing = function cellEditing(args) {
        var that = this,
            cell = args[0];
        // Search for any other rows which are open.
        this.each(function (m) {
          // Check if row which we are about to close is not current row.
          if (cell.model != m) {
            var idx = that.indexOf(m);
            if (idx > -1) {
              var row = self.grid.body.rows[idx],
                  editCell = row.$el.find(".subnode-edit-in-process").parent();
              // Only close row if it's open.
              if (editCell.length > 0) {
                var event = new Event('click');
                editCell[0].dispatchEvent(event);
              }
            }
          }
        });
      };
      // Listen for any row which is about to enter in edit mode.
      collection.on("enteringEditMode", cellEditing, collection);

      // Initialize a new Grid instance
      var grid = self.grid = new Backgrid.Grid({
        columns: gridSchema.columns,
        collection: collection,
        className: "backgrid table-bordered"
      });

      // Render subNode grid
      var subNodeGrid = self.grid.render().$el;

      // Combine Edit and Delete Cell
      if (data.canDelete && data.canEdit) {
        $(subNodeGrid).find("th.pg-backform-delete").remove();
        $(subNodeGrid).find("th.pg-backform-edit").attr("colspan", "2");
      }

      var $dialog = gridBody.append(subNodeGrid);

      // Add button callback
      if (!(data.disabled || data.canAdd == false)) {
        $dialog.find('button.add').first().click(function (e) {
          e.preventDefault();
          var canAddRow = _.isFunction(data.canAddRow) ? data.canAddRow.apply(self, [self.model]) : true;
          if (canAddRow) {
            // Close any existing expanded row before adding new one.
            _.each(self.grid.body.rows, function (row) {
              var editCell = row.$el.find(".subnode-edit-in-process").parent();
              // Only close row if it's open.
              if (editCell.length > 0) {
                var event = new Event('click');
                editCell[0].dispatchEvent(event);
              }
            });

            var allowMultipleEmptyRows = !!self.field.get('allowMultipleEmptyRows');

            // If allowMultipleEmptyRows is not set or is false then don't allow second new empty row.
            // There should be only one empty row.
            if (!allowMultipleEmptyRows && collection) {
              var isEmpty = false;
              collection.each(function (model) {
                var modelValues = [];
                _.each(model.attributes, function (val, key) {
                  modelValues.push(val);
                });
                if (!_.some(modelValues, _.identity)) {
                  isEmpty = true;
                }
              });
              if (isEmpty) {
                return false;
              }
            }

            $(self.grid.body.$el.find($("tr.new"))).removeClass("new");
            var m = new data.model(null, {
              silent: true,
              handler: collection,
              top: self.model.top || self.model,
              collection: collection,
              node_info: self.model.node_info
            });
            collection.add(m);

            var idx = collection.indexOf(m),
                newRow = self.grid.body.rows[idx].$el;

            newRow.addClass("new");
            $(newRow).pgMakeVisible('backform-tab');

            return false;
          }
        });
      }

      return $dialog;
    },
    clearInvalid: function clearInvalid() {
      this.$el.removeClass("subnode-error");
      this.$el.find(".pgadmin-control-error-message").remove();
      return this;
    },
    updateInvalid: function updateInvalid() {
      var self = this,
          errorModel = this.model.errorModel;

      if (!(errorModel instanceof Backbone.Model)) return this;

      this.clearInvalid();

      this.$el.find('.subnode-body').each(function (ix, el) {
        var error = self.keyPathAccessor(errorModel.toJSON(), self.field.get('name'));

        if (_.isEmpty(error)) return;

        self.$el.addClass("subnode-error").append($("<div></div>").addClass('pgadmin-control-error-message pg-el-xs-offset-4 pg-el-xs-8 help-block').text(error));
      });
    }
  });

  var SubNodeCollectionControl = Backform.SubNodeCollectionControl = Backform.Control.extend({
    row: Backgrid.Row,
    render: function render() {
      var field = _.defaults(this.field.toJSON(), this.defaults),
          attributes = this.model.toJSON(),
          attrArr = field.name.split('.'),
          name = attrArr.shift(),
          path = attrArr.join('.'),
          rawValue = this.keyPathAccessor(attributes[name], path),
          data = _.extend(field, {
        rawValue: rawValue,
        value: this.formatter.fromRaw(rawValue, this.model),
        attributes: attributes,
        formatter: this.formatter
      }),
          evalF = function evalF(f, d, m) {
        return _.isFunction(f) ? !!f.apply(d, [m]) : !!f;
      };

      // Evaluate the disabled, visible, required, canAdd, cannEdit & canDelete option
      _.extend(data, {
        disabled: evalF(data.disabled, data, this.model),
        visible: evalF(data.visible, data, this.model),
        required: evalF(data.required, data, this.model),
        canAdd: evalF(data.canAdd, data, this.model),
        canAddRow: data.canAddRow,
        canEdit: evalF(data.canEdit, data, this.model),
        canDelete: evalF(data.canDelete, data, this.model)
      });
      // Show Backgrid Control
      var grid = data.subnode == undefined ? "" : this.showGridControl(data);

      // Clean up first
      this.$el.removeClass(Backform.hiddenClassName);

      if (!data.visible) this.$el.addClass(Backform.hiddenClassName);

      this.$el.html(grid).addClass(field.name);
      this.updateInvalid();

      return this;
    },
    updateInvalid: function updateInvalid() {
      var self = this;
      var errorModel = this.model.errorModel;
      if (!(errorModel instanceof Backbone.Model)) return this;

      this.clearInvalid();

      var attrArr = self.field.get('name').split('.'),
          name = attrArr.shift(),
          path = attrArr.join('.'),
          error = self.keyPathAccessor(errorModel.toJSON(), path);

      if (_.isEmpty(error)) return;

      self.$el.addClass('subnode-error').append($("<div></div>").addClass('pgadmin-control-error-message pg-el-xs-offset-4 pg-el-xs-8 help-block').text(error));
    },
    cleanup: function cleanup() {
      // Clean up existing grid if any (in case of re-render)
      if (this.grid) {
        this.grid.remove();
      }
      if (this.collection) {
        this.collection.off("enteringEditMode");
      }
    },
    clearInvalid: function clearInvalid() {
      this.$el.removeClass('subnode-error');
      this.$el.find(".pgadmin-control-error-message").remove();
      return this;
    },
    showGridControl: function showGridControl(data) {
      var self = this,
          gridHeader = ["<div class='subnode-header'>", "  <label class='control-label pg-el-sm-10'>" + data.label + "</label>", "  <button class='btn-sm btn-default add fa fa-plus'></button>", "</div>"].join("\n"),
          gridBody = $("<div class='pgadmin-control-group backgrid form-group pg-el-xs-12 object subnode'></div>").append(gridHeader);

      var subnode = data.subnode.schema ? data.subnode : data.subnode.prototype,
          gridSchema = Backform.generateGridColumnsFromModel(data.node_info, subnode, this.field.get('mode'), data.columns, data.schema_node),
          pgBrowser = window.pgAdmin.Browser;

      // Clean up existing grid if any (in case of re-render)
      if (self.grid) {
        self.grid.remove();
      }

      // Set visibility of Add button
      if (data.disabled || data.canAdd == false) {
        $(gridBody).find("button.add").remove();
      }

      // Insert Delete Cell into Grid
      if (data.disabled == false && data.canDelete) {
        gridSchema.columns.unshift({
          name: "pg-backform-delete", label: "",
          cell: Backgrid.Extension.DeleteCell,
          editable: false, cell_priority: -1,
          canDeleteRow: data.canDeleteRow,
          customDeleteMsg: data.customDeleteMsg,
          customDeleteTitle: data.customDeleteTitle
        });
      }

      // Insert Edit Cell into Grid
      if (data.disabled == false && data.canEdit) {
        var editCell = Backgrid.Extension.ObjectCell.extend({
          schema: gridSchema.schema
        }),
            canEdit = self.field.has('canEdit') && self.field.get('canEdit') || true;

        gridSchema.columns.unshift({
          name: "pg-backform-edit", label: "", cell: editCell,
          cell_priority: -2, editable: canEdit,
          canEditRow: data.canEditRow
        });
      }

      var collection = self.model.get(data.name);

      if (!collection) {
        collection = new pgBrowser.Node.Collection(null, {
          handler: self.model.handler || self.model,
          model: data.model, top: self.model.top || self.model,
          silent: true
        });
        self.model.set(data.name, collection, { silent: true });
      }

      var cellEditing = function cellEditing(args) {
        var self = this,
            cell = args[0];
        // Search for any other rows which are open.
        this.each(function (m) {
          // Check if row which we are about to close is not current row.
          if (cell.model != m) {
            var idx = self.indexOf(m);
            if (idx > -1) {
              var row = grid.body.rows[idx],
                  editCell = row.$el.find(".subnode-edit-in-process").parent();
              // Only close row if it's open.
              if (editCell.length > 0) {
                var event = new Event('click');
                editCell[0].dispatchEvent(event);
              }
            }
          }
        });
      };
      // Listen for any row which is about to enter in edit mode.
      collection.on("enteringEditMode", cellEditing, collection);

      // Initialize a new Grid instance
      var grid = self.grid = new Backgrid.Grid({
        columns: gridSchema.columns,
        collection: collection,
        row: this.row,
        className: "backgrid table-bordered"
      });

      // Render subNode grid
      var subNodeGrid = grid.render().$el;

      // Combine Edit and Delete Cell
      if (data.canDelete && data.canEdit) {
        $(subNodeGrid).find("th.pg-backform-delete").remove();
        $(subNodeGrid).find("th.pg-backform-edit").attr("colspan", "2");
      }

      var $dialog = gridBody.append(subNodeGrid);

      // Add button callback
      $dialog.find('button.add').click(function (e) {
        e.preventDefault();
        var canAddRow = _.isFunction(data.canAddRow) ? data.canAddRow.apply(self, [self.model]) : true;
        if (canAddRow) {
          // Close any existing expanded row before adding new one.
          _.each(grid.body.rows, function (row) {
            var editCell = row.$el.find(".subnode-edit-in-process").parent();
            // Only close row if it's open.
            if (editCell.length > 0) {
              var event = new Event('click');
              editCell[0].dispatchEvent(event);
            }
          });

          grid.insertRow({});

          var newRow = $(grid.body.rows[collection.length - 1].$el);
          newRow.attr("class", "new").click(function (e) {
            $(this).attr("class", "editable");
          });
          $(newRow).pgMakeVisible('backform-tab');
          return false;
        }
      });

      return $dialog;
    }
  });

  /*
   * SQL Tab Control for showing the modified SQL for the node with the
   * property 'hasSQL' is set to true.
   *
   * When the user clicks on the SQL tab, we will send the modified data to the
   * server and fetch the SQL for it.
   */
  var SqlTabControl = Backform.SqlTabControl = Backform.Control.extend({
    defaults: {
      label: "",
      controlsClassName: "pgadmin-controls pg-el-sm-12 SQL",
      extraClasses: [],
      helpMessage: null
    },
    template: _.template(['<div class="<%=controlsClassName%>">', '  <textarea class="<%=Backform.controlClassName%> <%=extraClasses.join(\' \')%>" name="<%=name%>" placeholder="<%-placeholder%>" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%>><%-value%></textarea>', '  <% if (helpMessage && helpMessage.length) { %>', '    <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>', '  <% } %>', '</div>'].join("\n")),
    /*
     * Initialize the SQL Tab control properly
     */
    initialize: function initialize(o) {
      Backform.Control.prototype.initialize.apply(this, arguments);

      // Save the required information for using it later.
      this.dialog = o.dialog;
      this.tabIndex = o.tabIndex;

      _.bindAll(this, 'onTabChange', 'onPanelResized');
    },
    getValueFromDOM: function getValueFromDOM() {
      return this.formatter.toRaw(this.$el.find("textarea").val(), this.model);
    },
    render: function render() {
      var _CodeMirror$fromTextA;

      if (this.sqlCtrl) {
        this.sqlCtrl.toTextArea();
        delete this.sqlCtrl;
        this.sqlCtrl = null;
        this.$el.empty();
        this.model.off('pg-property-tab-changed', this.onTabChange, this);
        this.model.off('pg-browser-resized', this.onPanelResized, this);
      }
      // Use the Backform Control's render function
      Backform.Control.prototype.render.apply(this, arguments);

      this.sqlCtrl = CodeMirror.fromTextArea(this.$el.find("textarea")[0], (_CodeMirror$fromTextA = {
        lineNumbers: true,
        lineWrapping: true,
        mode: "text/x-pgsql",
        readOnly: true,
        extraKeys: pgAdmin.Browser.editor_shortcut_keys,
        tabSize: pgAdmin.Browser.editor_options.tabSize
      }, _defineProperty(_CodeMirror$fromTextA, 'lineWrapping', pgAdmin.Browser.editor_options.wrapCode), _defineProperty(_CodeMirror$fromTextA, 'autoCloseBrackets', pgAdmin.Browser.editor_options.insert_pair_brackets), _defineProperty(_CodeMirror$fromTextA, 'matchBrackets', pgAdmin.Browser.editor_options.brace_matching), _CodeMirror$fromTextA));

      /*
       * We will listen to the tab change event to check, if the SQL tab has
       * been clicked or, not.
       */
      this.model.on('pg-property-tab-changed', this.onTabChange, this);
      this.model.on('pg-browser-resized', this.onPanelResized, this);

      return this;
    },
    onTabChange: function onTabChange(obj) {

      // Fetch the information only if the SQL tab is visible at the moment.
      if (this.dialog && obj.shown == this.tabIndex) {

        // We will send a request to the sever only if something has changed
        // in a model and also it does not contain any error.
        if (this.model.sessChanged()) {
          if (_.size(this.model.errorModel.attributes) == 0) {
            var self = this,
                node = self.field.get('schema_node'),
                msql_url = node.generate_url.apply(node, [null, 'msql', this.field.get('node_data'), !self.model.isNew(), this.field.get('node_info')]);

            // Fetching the modified SQL
            self.model.trigger('pgadmin-view:msql:fetching', self.method, node);

            $.ajax({
              url: msql_url,
              type: 'GET',
              cache: false,
              data: self.model.toJSON(true, 'GET'),
              dataType: "json",
              contentType: "application/json"
            }).done(function (res) {
              self.sqlCtrl.clearHistory();
              self.sqlCtrl.setValue(res.data);
            }).fail(function () {
              self.model.trigger('pgadmin-view:msql:error', self.method, node, arguments);
            }).always(function () {
              self.model.trigger('pgadmin-view:msql:fetched', self.method, node, arguments);
            });
          } else {
            this.sqlCtrl.clearHistory();
            this.sqlCtrl.setValue('-- ' + gettext('Definition incomplete'));
          }
        } else {
          this.sqlCtrl.clearHistory();
          this.sqlCtrl.setValue('-- ' + gettext('Nothing changed'));
        }
        this.sqlCtrl.refresh.apply(this.sqlCtrl);
      }
    },
    onPanelResized: function onPanelResized(o) {
      if (o && o.container) {
        var $tabContent = o.container.find('.backform-tab > .tab-content').first(),
            $sqlPane = $tabContent.find('div[role=tabpanel].tab-pane.SQL');
        if ($sqlPane.hasClass('active')) {
          $sqlPane.find('.CodeMirror').css('cssText', 'height: ' + ($tabContent.height() + 8) + 'px !important;');
        }
      }
    },
    remove: function remove() {
      if (this.sqlCtrl) {
        this.sqlCtrl.toTextArea();
        delete this.sqlCtrl;
        this.sqlCtrl = null;

        this.$el.empty();
      }
      this.model.off('pg-property-tab-changed', this.onTabChange, this);
      this.model.off('pg-browser-resized', this.onPanelResized, this);

      Backform.Control.__super__.remove.apply(this, arguments);
    }
  });
  /*
  * Numeric input Control functionality just like backgrid
  */
  var NumericControl = Backform.NumericControl = Backform.InputControl.extend({
    defaults: {
      type: "number",
      label: "",
      min: undefined,
      max: undefined,
      maxlength: 255,
      extraClasses: [],
      helpMessage: null
    },
    template: _.template(['<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>', '<div class="<%=Backform.controlsClassName%>">', '  <input type="<%=type%>" class="<%=Backform.controlClassName%> <%=extraClasses.join(\' \')%>" name="<%=name%>" min="<%=min%>" max="<%=max%>"maxlength="<%=maxlength%>" value="<%-value%>" placeholder="<%-placeholder%>" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> />', '  <% if (helpMessage && helpMessage.length) { %>', '    <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>', '  <% } %>', '</div>'].join("\n"))
  });

  ///////
  // Generate a schema (as group members) based on the model's schema
  //
  // It will be used by the grid, properties, and dialog view generation
  // functions.
  var generateViewSchema = Backform.generateViewSchema = function (node_info, Model, mode, node, treeData, noSQL, subschema) {
    var proto = Model && Model.prototype || Model,
        schema = subschema || proto && proto.schema,
        pgBrowser = window.pgAdmin.Browser,
        fields = [],
        groupInfo = {};

    // 'schema' has the information about how to generate the form.
    if (schema && _.isArray(schema)) {
      var evalASFunc = evalASFunc = function evalASFunc(prop) {
        return prop && proto[prop] && typeof proto[prop] == "function" ? proto[prop] : prop;
      };
      var groups = {},
          server_info = node_info && 'server' in node_info && pgBrowser.serverInfo && pgBrowser.serverInfo[node_info.server._id],
          in_catalog = node_info && 'catalog' in node_info;

      _.each(schema, function (s) {
        // Do we understand - what control, we're creating
        // here?
        if (s.type == 'group') {
          var ver_in_limit = _.isUndefined(server_info) ? true : (_.isUndefined(s.server_type) ? true : server_info.type in s.server_type) && (_.isUndefined(s.min_version) ? true : server_info.version >= s.min_version) && (_.isUndefined(s.max_version) ? true : server_info.version <= s.max_version),
              visible = true;

          if (s.mode && _.isObject(s.mode)) visible = _.indexOf(s.mode, mode) > -1;
          if (visible) visible = evalASFunc(s.visible);

          groupInfo[s.id] = {
            label: s.label || s.id,
            version_compatible: ver_in_limit,
            visible: visible
          };
          return;
        }

        if (!s.mode || s && s.mode && _.isObject(s.mode) && _.indexOf(s.mode, mode) != -1) {
          // Each field is kept in specified group, or in
          // 'General' category.
          var group = s.group || gettext('General'),
              control = s.control || Backform.getMappedControl(s.type, mode),
              cell = s.cell || Backform.getMappedControl(s.type, 'cell');

          if (control == null) {
            return;
          }

          // Generate the empty group list (if not exists)
          groups[group] = groups[group] || [];
          var ver_in_limit = _.isUndefined(server_info) ? true : (_.isUndefined(s.server_type) ? true : server_info.type in s.server_type) && (_.isUndefined(s.min_version) ? true : server_info.version >= s.min_version) && (_.isUndefined(s.max_version) ? true : server_info.version <= s.max_version),
              disabled = mode == 'properties' || !ver_in_limit || in_catalog,
              schema_node = s.node && _.isString(s.node) && s.node in pgBrowser.Nodes && pgBrowser.Nodes[s.node] || node;

          var o = _.extend(_.clone(s), {
            name: s.id,
            // This can be disabled in some cases (if not hidden)

            disabled: disabled ? true : evalASFunc(s.disabled),
            editable: _.isUndefined(s.editable) ? pgAdmin.editableCell : evalASFunc(s.editable),
            subnode: _.isString(s.model) && s.model in pgBrowser.Nodes ? pgBrowser.Nodes[s.model].model : s.model,
            canAdd: disabled ? false : evalASFunc(s.canAdd),
            canAddRow: disabled ? false : evalASFunc(s.canAddRow),
            canEdit: disabled ? false : evalASFunc(s.canEdit),
            canDelete: disabled ? false : evalASFunc(s.canDelete),
            canEditRow: disabled ? false : evalASFunc(s.canEditRow),
            canDeleteRow: disabled ? false : evalASFunc(s.canDeleteRow),
            transform: evalASFunc(s.transform),
            mode: mode,
            control: control,
            cell: cell,
            node_info: node_info,
            schema_node: schema_node,
            // Do we need to show this control in this mode?
            visible: evalASFunc(s.visible),
            node: node,
            node_data: treeData,
            version_compatible: ver_in_limit
          });
          delete o.id;

          // Temporarily store in dictionary format for
          // utilizing it later.
          groups[group].push(o);

          if (s.type == 'nested') {
            delete o.name;
            delete o.cell;

            o.schema = Backform.generateViewSchema(node_info, Model, mode, node, treeData, true, s.schema);
            o.control = o.control || 'tab';
          }
        }
      });

      // Do we have fields to genreate controls, which we
      // understand?
      if (_.isEmpty(groups)) {
        return null;
      }

      if (!noSQL && node && node.hasSQL && (mode == 'create' || mode == 'edit')) {
        groups[gettext('SQL')] = [{
          name: 'sql',
          visible: true,
          disabled: false,
          type: 'text',
          control: 'sql-tab',
          node_info: node_info,
          schema_node: node,
          node_data: treeData
        }];
      }

      // Create an array from the dictionary with proper required
      // structure.
      _.each(groups, function (val, key) {
        fields.push(_.extend(_.defaults(groupInfo[key] || { label: key }, { version_compatible: true, visible: true }), { fields: val }));
      });
    }

    return fields;
  };

  var Select2Formatter = function Select2Formatter() {};
  _.extend(Select2Formatter.prototype, {
    fromRaw: function fromRaw(rawData, model) {
      return encodeURIComponent(rawData);
    },
    toRaw: function toRaw(formattedData, model) {
      if (_.isArray(formattedData)) {
        return _.map(formattedData, decodeURIComponent);
      } else {
        if (!_.isNull(formattedData) && !_.isUndefined(formattedData)) {
          return decodeURIComponent(formattedData);
        } else {
          return null;
        }
      }
    }
  });

  /*
   *  Backform Select2 control.
   */
  var Select2Control = Backform.Select2Control = Backform.SelectControl.extend({
    defaults: _.extend({}, Backform.SelectControl.prototype.defaults, {
      select2: {
        first_empty: true,
        multiple: false,
        emptyOptions: false
      }
    }),
    formatter: Select2Formatter,
    template: _.template(['<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>', '<div class="<%=Backform.controlsClassName%>">', ' <select class="<%=Backform.controlClassName%> <%=extraClasses.join(\' \')%>"', '  name="<%=name%>" value="<%-value%>" <%=disabled ? "disabled" : ""%>', '  <%=required ? "required" : ""%><%= select2.multiple ? " multiple>" : ">" %>', '  <%=select2.first_empty ? " <option></option>" : ""%>', '  <% for (var i=0; i < options.length; i++) {%>', '   <% var option = options[i]; %>', '   <option ', '    <% if (option.image) { %> data-image=<%=option.image%> <%}%>', '    value=<%= formatter.fromRaw(option.value) %>', '    <% if (option.selected) {%>selected="selected"<%} else {%>', '    <% if (!select2.multiple && option.value === rawValue) {%>selected="selected"<%}%>', '    <% if (select2.multiple && rawValue && rawValue.indexOf(option.value) != -1){%>selected="selected" data-index="rawValue.indexOf(option.value)"<%}%>', '    <%}%>', '    <%= disabled ? "disabled" : ""%>><%-option.label%></option>', '  <%}%>', ' </select>', ' <% if (helpMessage && helpMessage.length) { %>', ' <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>', ' <% } %>', '</div>'].join("\n")),
    render: function render() {

      if (this.$sel && this.$sel.select2 && this.$sel.select2.hasOwnProperty('destroy')) {
        this.$sel.select2('destroy');
      }

      var field = _.defaults(this.field.toJSON(), this.defaults),
          attributes = this.model.toJSON(),
          attrArr = field.name.split('.'),
          name = attrArr.shift(),
          path = attrArr.join('.'),
          rawValue = this.keyPathAccessor(attributes[name], path),
          data = _.extend(field, {
        rawValue: rawValue,
        value: this.formatter.fromRaw(rawValue, this.model),
        attributes: attributes,
        formatter: this.formatter
      }),
          evalF = function evalF(f, d, m) {
        return _.isFunction(f) ? !!f.apply(d, [m]) : !!f;
      };

      data.select2 = data.select2 || {};
      _.defaults(data.select2, this.defaults.select2, {
        first_empty: true,
        multiple: false,
        emptyOptions: false
      });

      // Evaluate the disabled, visible, and required option
      _.extend(data, {
        disabled: evalF(data.disabled, data, this.model),
        visible: evalF(data.visible, data, this.model),
        required: evalF(data.required, data, this.model)
      });

      // Evaluation the options
      if (_.isFunction(data.options)) {
        try {
          data.options = data.options(this);
        } catch (e) {
          // Do nothing
          data.options = [];
          this.model.trigger('pgadmin-view:transform:error', this.model, this.field, e);
        }
      }

      // Clean up first
      this.$el.removeClass(Backform.hiddenClassName);

      if (!data.visible) this.$el.addClass(Backform.hiddenClassName);

      this.$el.html(this.template(data)).addClass(field.name);

      var select2Opts = _.extend({
        disabled: data.disabled
      }, field.select2, {
        options: this.field.get('options') || this.defaults.options
      });

      // If disabled then no need to show placeholder
      if (data.disabled || data.mode === 'properties') {
        select2Opts['placeholder'] = '';
      }

      /*
       * Add empty option as Select2 requires any empty '<option><option>' for
       * some of its functionality to work and initialize select2 control.
       */

      if (data.select2.tags && data.select2.emptyOptions) {
        select2Opts.data = data.rawValue;
      }

      this.$sel = this.$el.find("select").select2(select2Opts);

      // Add or remove tags from select2 control
      if (data.select2.tags && data.select2.emptyOptions) {
        this.$sel.val(data.rawValue);
        this.$sel.trigger('change.select2');
        this.$sel.on('select2:unselect', function (evt) {

          $(this).find('option[value="' + evt.params.data.text.replace("'", "\\'").replace('"', '\\"') + '"]').remove();
          $(this).trigger('change.select2');
          if ($(this).val() == null) {
            $(this).empty();
          }
        });
      }

      // Select the highlighted item on Tab press.
      if (this.$sel) {
        this.$sel.data('select2').on("keypress", function (ev) {
          var self = this;

          // keycode 9 is for TAB key
          if (ev.which === 9 && self.isOpen()) {
            ev.preventDefault();
            self.trigger('results:select', {});
          }
        });
      }

      this.updateInvalid();

      return this;
    },
    getValueFromDOM: function getValueFromDOM() {
      var val = Backform.SelectControl.prototype.getValueFromDOM.apply(this, arguments),
          select2Opts = _.extend({}, this.field.get("select2") || this.defaults.select2);

      if (select2Opts.multiple && val == null) {
        return [];
      }
      return val;
    }
  });

  var FieldsetControl = Backform.FieldsetControl = Backform.Fieldset.extend({
    initialize: function initialize(opts) {
      Backform.Control.prototype.initialize.apply(this, arguments);
      Backform.Dialog.prototype.initialize.apply(this, [{ schema: opts.field.get('schema') }]);
      this.dialog = opts.dialog;
      this.tabIndex = opts.tabIndex;

      // Listen to the dependent fields in the model for any change
      var deps = this.field.get('deps');
      var self = this;

      if (deps && _.isArray(deps)) {
        _.each(deps, function (d) {
          var attrArr = d.split('.'),
              name = attrArr.shift();
          self.listenTo(self.model, "change:" + name, self.render);
        });
      }
    },
    // Render using Backform.Fieldset (only if this control is visible)
    orig_render: Backform.Fieldset.prototype.render,
    render: function render() {
      var field = _.defaults(this.field.toJSON(), this.defaults),
          evalF = function evalF(f, d, m) {
        return _.isFunction(f) ? !!f.apply(d, [m]) : !!f;
      };

      if (!field.version_compatible || !evalF(field.visible, field, this.model)) {
        this.cleanup();
        this.$el.empty();
      } else {
        this.orig_render.apply(this, arguments);
      }
      return this;
    },
    formatter: function formatter() {},
    cleanup: function cleanup() {
      Backform.Fieldset.prototype.cleanup.apply(this);
    },
    remove: function remove() {
      Backform.Control.prototype.remove.apply(this, arguments);
      Backform.Dialog.prototype.remove.apply(this, arguments);
    },
    className: function className() {
      return 'set-group';
    },
    tabPanelClassName: function tabPanelClassName() {
      return Backform.tabClassName;
    },
    fieldsetClass: 'inline-fieldset',
    legendClass: '',
    contentClass: '',
    collapse: false
  });

  // Backform Tab Control (in bootstrap tabbular)
  // A collection of field models.
  var TabControl = Backform.TabControl = Backform.FieldsetControl.extend({
    tagName: "div",
    className: 'inline-tab-panel',
    tabPanelClassName: 'inline-tab-panel',
    initialize: function initialize(opts) {
      Backform.FieldsetControl.prototype.initialize.apply(this, arguments);
      this.tabIndex = (opts.tabIndex || parseInt(Math.random() * 1000)) + 1;
    },
    // Render using Backform.Dialog (tabular UI) (only if this control is
    // visible).
    orig_render: Backform.Dialog.prototype.render,
    template: Backform.Dialog.prototype.template
  });

  // Backform Tab Control (in bootstrap tabbular)
  // A collection of field models.
  var PlainFieldsetControl = Backform.PlainFieldsetControl = Backform.FieldsetControl.extend({
    initialize: function initialize(opts) {
      Backform.FieldsetControl.prototype.initialize.apply(this, arguments);
    },
    template: {
      'header': _.template(['<fieldset class="<%=fieldsetClass%>" <%=disabled ? "disabled" : ""%>>', ' <% if (legend != false) { %>', '  <legend class="<%=legendClass%>" <%=collapse ? "data-toggle=\'collapse\'" : ""%> data-target="#<%=cId%>"><%=collapse ? "<span class=\'caret\'></span>" : "" %></legend>', ' <% } %>', '</fieldset>'].join("\n")),
      'content': _.template('  <div id="<%= cId %>" class="<%=contentClass%>"></div>') },
    fieldsetClass: 'inline-fieldset-without-border',
    legend: false
  });

  /*
   * Control For Code Mirror SQL text area.
   */
  var SqlFieldControl = Backform.SqlFieldControl = Backform.TextareaControl.extend({

    defaults: {
      label: "",
      extraClasses: [], // Add default control height
      helpMessage: null,
      maxlength: 4096,
      rows: undefined
    },

    // Customize template to add new styles
    template: _.template(['<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>', '<div class="<%=Backform.controlsClassName%> sql_field_layout <%=extraClasses.join(\' \')%>">', '  <textarea ', '    class="<%=Backform.controlClassName%> " name="<%=name%>"', '    maxlength="<%=maxlength%>" placeholder="<%-placeholder%>" <%=disabled ? "disabled" : ""%>', '    rows=<%=rows%>', '    <%=required ? "required" : ""%>><%-value%></textarea>', '  <% if (helpMessage && helpMessage.length) { %>', '    <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>', '  <% } %>', '</div>'].join("\n")),

    /*
     * Initialize the SQL Field control properly
     */
    initialize: function initialize(o) {
      Backform.TextareaControl.prototype.initialize.apply(this, arguments);
      this.sqlCtrl = null;

      _.bindAll(this, 'onFocus', 'onBlur', 'refreshTextArea');
    },

    getValueFromDOM: function getValueFromDOM() {
      return this.sqlCtrl.getValue();
    },

    render: function render() {
      // Clean up the existing sql control
      if (this.sqlCtrl) {
        this.model.off('pg-property-tab-changed', this.refreshTextArea, this);
        this.sqlCtrl.off('focus', this.onFocus);
        this.sqlCtrl.off('blur', this.onBlur);

        this.sqlCtrl.toTextArea();
        delete this.sqlCtrl;
        this.sqlCtrl = null;
        this.$el.empty();
      }

      // Use the Backform TextareaControl's render function
      Backform.TextareaControl.prototype.render.apply(this, arguments);

      var field = _.defaults(this.field.toJSON(), this.defaults),
          attributes = this.model.toJSON(),
          attrArr = field.name.split('.'),
          name = attrArr.shift(),
          path = attrArr.join('.'),
          rawValue = this.keyPathAccessor(attributes[name], path),
          data = _.extend(field, {
        rawValue: rawValue,
        value: this.formatter.fromRaw(rawValue, this.model),
        attributes: attributes,
        formatter: this.formatter
      }),
          evalF = function evalF(f, d, m) {
        return _.isFunction(f) ? !!f.apply(d, [m]) : !!f;
      };

      // Evaluate the disabled, visible option
      var isDisabled = evalF(data.disabled, data, this.model),
          isVisible = evalF(data.visible, data, this.model),
          self = this;

      self.sqlCtrl = CodeMirror.fromTextArea(self.$el.find("textarea")[0], {
        lineNumbers: true,
        mode: "text/x-pgsql",
        extraKeys: pgAdmin.Browser.editor_shortcut_keys,
        tabSize: pgAdmin.Browser.editor_options.tabSize,
        lineWrapping: pgAdmin.Browser.editor_options.wrapCode,
        autoCloseBrackets: pgAdmin.Browser.editor_options.insert_pair_brackets,
        matchBrackets: pgAdmin.Browser.editor_options.brace_matching
      });

      // Disable editor
      if (isDisabled) {
        self.sqlCtrl.setOption("readOnly", "nocursor");
        var cm = self.sqlCtrl.getWrapperElement();
        if (cm) {
          cm.className += ' cm_disabled';
        }
      }

      if (!isVisible) self.$el.addClass(Backform.hiddenClassName);

      // There is an issue with the Code Mirror SQL.
      //
      // It does not initialize the code mirror object completely when the
      // referenced textarea is hidden (not visible), hence - we need to
      // refresh the code mirror object on 'pg-property-tab-changed' event to
      // make it work properly.
      self.model.on('pg-property-tab-changed', this.refreshTextArea, this);

      this.sqlCtrl.on('focus', this.onFocus);
      this.sqlCtrl.on('blur', this.onBlur);

      var self = this;
      // Refresh SQL Field to refresh the control lazily after it renders
      setTimeout(function () {
        self.refreshTextArea.apply(self);
      }, 0);

      return self;
    },

    onFocus: function onFocus() {
      var $ctrl = this.$el.find('.pgadmin-controls').first();
      if (!$ctrl.hasClass('focused')) $ctrl.addClass('focused');
    },

    onBlur: function onBlur() {
      this.$el.find('.pgadmin-controls').first().removeClass('focused');
    },

    refreshTextArea: function refreshTextArea() {
      if (this.sqlCtrl) {
        this.sqlCtrl.refresh();
      }
    },

    remove: function remove() {
      // Clean up the sql control
      if (this.sqlCtrl) {
        this.sqlCtrl.off('focus', this.onFocus);
        this.sqlCtrl.off('blur', this.onBlur);
        delete this.sqlCtrl;
        this.sqlCtrl = null;
        this.$el.empty();
      }

      this.model.off("pg-property-tab-changed", this.refreshTextArea, this);

      Backform.TextareaControl.prototype.remove.apply(this, arguments);
    }
  });

  // We will use this control just as a annotate in Backform
  var NoteControl = Backform.NoteControl = Backform.Control.extend({
    defaults: {
      label: gettext("Note"),
      text: '',
      extraClasses: [],
      noteClass: 'backform_control_notes'
    },
    template: _.template(['<div class="<%=noteClass%> pg-el-xs-12 <%=extraClasses.join(\' \')%>">', '<label class="control-label"><%=label%>:</label>', '<span><%=text%></span></div>'].join("\n"))
  });

  /*
  * Input File Control: This control is used with Storage Manager Dialog,
  * It allows user to perform following operations:
  * - Select File
  * - Select Folder
  * - Create File
  * - Opening Storage Manager Dialog itself.
  */
  var FileControl = Backform.FileControl = Backform.InputControl.extend({
    defaults: {
      type: "text",
      label: "",
      min: undefined,
      max: undefined,
      maxlength: 255,
      extraClasses: [],
      dialog_title: '',
      btn_primary: '',
      helpMessage: null,
      dialog_type: 'select_file'
    },
    initialize: function initialize() {
      Backform.InputControl.prototype.initialize.apply(this, arguments);

      // Listen click events of Storage Manager dialog buttons
      pgAdmin.Browser.Events.on('pgadmin-storage:finish_btn:' + this.field.get('dialog_type'), this.storage_dlg_hander, this);
    },
    template: _.template(['<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>', '<div class="<%=Backform.controlsClassName%>">', '<div class="file_selection_ctrl form-control">', '<input type="<%=type%>" class="browse_file_input form-control <%=extraClasses.join(\' \')%>" name="<%=name%>" min="<%=min%>" max="<%=max%>"maxlength="<%=maxlength%>" value="<%-value%>" placeholder="<%-placeholder%>" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> />', '<button class="btn fa fa-ellipsis-h select_item pull-right" <%=disabled ? "disabled" : ""%> ></button>', '<% if (helpMessage && helpMessage.length) { %>', '<span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>', '<% } %>', '</div>', '</div>'].join("\n")),
    events: function events() {
      // Inherit all default events of InputControl
      return _.extend({}, Backform.InputControl.prototype.events, {
        "click .select_item": "onSelect"
      });
    },
    onSelect: function onSelect(ev) {
      var dialog_type = this.field.get('dialog_type'),
          supp_types = this.field.get('supp_types'),
          btn_primary = this.field.get('btn_primary'),
          dialog_title = this.field.get('dialog_title'),
          params = {
        supported_types: supp_types,
        dialog_type: dialog_type,
        dialog_title: dialog_title,
        btn_primary: btn_primary
      };

      pgAdmin.FileManager.init();
      pgAdmin.FileManager.show_dialog(params);
    },
    storage_dlg_hander: function storage_dlg_hander(value) {
      var field = _.defaults(this.field.toJSON(), this.defaults),
          attrArr = this.field.get("name").split('.'),
          name = attrArr.shift();

      // Set selected value into the model
      this.model.set(name, decodeURI(value));
    },
    clearInvalid: function clearInvalid() {
      Backform.InputControl.prototype.clearInvalid.apply(this, arguments);
      this.$el.removeClass("pgadmin-file-has-error");
      return this;
    },
    updateInvalid: function updateInvalid() {
      Backform.InputControl.prototype.updateInvalid.apply(this, arguments);
      // Introduce a new class to fix the error icon placement on the control
      this.$el.addClass("pgadmin-file-has-error");
    }
  });

  var DatetimepickerControl = Backform.DatetimepickerControl = Backform.InputControl.extend({
    defaults: {
      type: "text",
      label: "",
      options: {
        format: "YYYY-MM-DD HH:mm:ss Z",
        showClear: true,
        showTodayButton: true,
        toolbarPlacement: 'top',
        widgetPositioning: {
          horizontal: 'auto',
          vertical: 'bottom'
        }
      },
      placeholder: "YYYY-MM-DD HH:mm:ss Z",
      extraClasses: [],
      helpMessage: null
    },
    events: {
      "blur input": "onChange",
      "change input": "onChange",
      "changeDate input": "onChange",
      "focus input": "clearInvalid",
      'db.change': "onChange",
      'click': 'openPicker'
    },
    openPicker: function openPicker() {
      if (this.has_datepicker) {
        this.$el.find("input").datetimepicker('show');
      }
    },
    template: _.template(['<label class="<%=Backform.controlLabelClassName%>"><%=label%></label>', '<div class="input-group  <%=Backform.controlsClassName%>">', ' <input type="text" class="<%=Backform.controlClassName%> <%=extraClasses.join(\' \')%>" name="<%=name%>" value="<%-value%>" placeholder="<%-placeholder%>" <%=disabled ? "disabled" : ""%> <%=required ? "required" : ""%> />', ' <span class="input-group-addon">', '  <span class="fa fa-calendar"></span>', ' </span>', '</div>', '<% if (helpMessage && helpMessage.length) { %>', ' <div class="<%=Backform.controlsClassName%>">', '   <span class="<%=Backform.helpMessageClassName%>"><%=helpMessage%></span>', ' </div>', '<% } %>'].join("\n")),
    render: function render() {
      var field = _.defaults(this.field.toJSON(), this.defaults),
          attributes = this.model.toJSON(),
          attrArr = field.name.split('.'),
          name = attrArr.shift(),
          path = attrArr.join('.'),
          rawValue = this.keyPathAccessor(attributes[name], path),
          data = _.extend(field, {
        rawValue: rawValue,
        value: this.formatter.fromRaw(rawValue, this.model),
        attributes: attributes,
        formatter: this.formatter
      }),
          evalF = function evalF(f, m) {
        return _.isFunction(f) ? !!f(m) : !!f;
      };

      // Evaluate the disabled, visible, and required option
      _.extend(data, {
        disabled: evalF(data.disabled, this.model),
        visible: evalF(data.visible, this.model),
        required: evalF(data.required, this.model)
      });
      if (!data.disabled) {
        data.placeholder = data.placeholder || this.defaults.placeholder;
      }

      // Clean up first
      if (this.has_datepicker) this.$el.find("input").datetimepicker('destroy');
      this.$el.empty();
      this.$el.removeClass(Backform.hiddenClassName);

      this.$el.html(this.template(data)).addClass(field.name);

      if (!data.visible) {
        this.has_datepicker = false;
        this.$el.addClass(Backform.hiddenClassName);
      } else {
        this.has_datepicker = true;
        var self = this;
        this.$el.find("input").first().datetimepicker(_.extend({
          keyBinds: {
            enter: function enter(widget) {
              var picker = this;
              if (widget) {
                setTimeout(function () {
                  picker.toggle();
                  self.$el.find('input').first().blur();
                }, 10);
              } else {
                setTimeout(function () {
                  picker.toggle();
                }, 10);
              }
            },
            tab: function tab(widget) {
              if (!widget) {
                // blur the input
                setTimeout(function () {
                  self.$el.find('input').first().blur();
                }, 10);
              }
            },
            escape: function escape(widget) {
              if (widget) {
                var picker = this;
                setTimeout(function () {
                  picker.toggle();
                  self.$el.find('input').first().blur();
                }, 10);
              }
            }
          }
        }, this.defaults.options, this.field.get("options"), { 'date': data.value }));
      }
      this.updateInvalid();

      return this;
    },
    cleanup: function cleanup() {
      if (this.has_datepicker) this.$el.find("input").datetimepicker('destroy');
      this.$el.empty();
    }
  });

  return Backform;
});

/***/ }),

/***/ 251:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(1), __webpack_require__(8), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, _, alertify, pgAdmin) {
  pgAdmin.Browser = pgAdmin.Browser || {};

  _.extend(pgAdmin.Browser, {
    report_error: function report_error(title, message, info) {
      var text = '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">\
           <div class="panel panel-default">\
           <div class="panel-heading" role="tab" id="headingOne">\
           <h4 class="panel-title">\
           <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">\
           ' + gettext("Error message") + '</a>\
        </h4>\
        </div>\
        <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">\
        <div class="panel-body" style="overflow: auto;">' + unescape(message) + '</div>\
        </div>\
        </div>';

      if (info != null && info != '') {
        text += '<div class="panel panel-default">\
            <div class="panel-heading" role="tab" id="headingTwo">\
            <h4 class="panel-title">\
            <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">\
            ' + gettext("Additional info") + '</a>\
          </h4>\
          </div>\
          <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">\
          <div class="panel-body" style="overflow: auto;">' + unescape(info) + '</div>\
          </div>\
          </div>\
          </div>';
      }

      text += '</div>';
      alertify.alert(title, text);
    }
  });

  return pgAdmin.Browser.report_error;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 252:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(4), __webpack_require__(3), __webpack_require__(0), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, S, pgAdmin, $, Backbone) {
  var pgBrowser = pgAdmin.Browser = pgAdmin.Browser || {};

  pgBrowser.DataModel = Backbone.Model.extend({
    /*
     * Parsing the existing data
     */
    on_server: false,
    parse: function parse(res) {
      var self = this;
      if (res && _.isObject(res) && 'node' in res && res['node']) {
        self.tnode = _.extend({}, res.node);
        delete res.node;
      }
      var objectOp = function objectOp(schema) {
        if (schema && _.isArray(schema)) {
          _.each(schema, function (s) {
            var obj, val;
            switch (s.type) {
              case 'collection':
                obj = self.get(s.id);
                val = res[s.id];
                if (_.isArray(val) || _.isObject(val)) {
                  if (!obj || !(obj instanceof Backbone.Collection)) {
                    obj = new pgBrowser.Node.Collection(val, {
                      model: _.isString(s.model) && s.model in pgBrowser.Nodes ? pgBrowser.Nodes[s.model].model : s.model,
                      top: self.top || self,
                      handler: self,
                      parse: true,
                      silent: true,
                      attrName: s.id
                    });

                    /*
                     * Nested collection models may or may not have idAttribute.
                     * So to decide whether model is new or not set 'on_server'
                     * flag on such models.
                     */

                    self.set(s.id, obj, { silent: true, parse: true, on_server: true });
                  } else {
                    /*
                     * Nested collection models may or may not have idAttribute.
                     * So to decide whether model is new or not set 'on_server'
                     * flag on such models.
                     */
                    obj.reset(val, { silent: true, parse: true, on_server: true });
                  }
                } else {
                  obj = null;
                }
                self.set(s.id, obj, { silent: true });
                res[s.id] = obj;
                break;
              case 'model':
                obj = self.get(s.id);
                val = res[s.id];
                if (!_.isUndefined(val) && !_.isNull(val)) {
                  if (!obj || !(obj instanceof Backbone.Model)) {
                    if (_.isString(s.model) && s.model in pgBrowser.Nodes[s.model]) {
                      obj = new pgBrowser.Nodes[s.model].Model(obj, {
                        silent: true, top: self.top || self, handler: self,
                        attrName: s.id
                      });
                    } else {
                      obj = new s.model(obj, {
                        silent: true, top: self.top || self, handler: self,
                        attrName: s.id
                      });
                    }
                  }
                  obj.set(val, { parse: true, silent: true });
                } else {
                  obj = null;
                }
                res[s.id] = obj;
                break;
              case 'nested':
                objectOp(s.schema);

                break;
              default:
                break;
            }
          });
        }
      };

      objectOp(self.schema);

      return res;
    },
    isNew: function isNew() {
      if (this.has(this.idAttribute)) {
        return !this.has(this.idAttribute);
      }
      return !this.on_server;
    },
    primary_key: function primary_key() {
      if (this.keys && _.isArray(this.keys)) {
        var res = {},
            self = this;

        _.each(self.keys, function (k) {
          res[k] = self.attributes[k];
        });

        return JSON.stringify(res);
      }
      return this.cid;
    },
    initialize: function initialize(attributes, options) {
      var self = this;
      self._previous_key_values = {};

      if (!_.isUndefined(options) && 'on_server' in options && options.on_server) {
        self.on_server = true;
      }

      Backbone.Model.prototype.initialize.apply(self, arguments);

      if (_.isUndefined(options) || _.isNull(options)) {
        options = attributes || {};
        attributes = null;
      }

      self.sessAttrs = {};
      self.fieldData = {};
      self.origSessAttrs = {};
      self.objects = [];
      self.arrays = [];
      self.attrName = options.attrName, self.top = options.top || self.collection && self.collection.top || self.collection || self;
      self.handler = options.handler || self.collection && self.collection.handler;
      self.trackChanges = false;
      self.errorModel = new Backbone.Model();
      self.node_info = options.node_info;

      var obj;
      var objectOp = function objectOp(schema) {
        if (schema && _.isArray(schema)) {
          _.each(schema, function (s) {

            switch (s.type) {
              case 'int':
              case 'numeric':
                self.fieldData[s.id] = {
                  id: s.id,
                  label: s.label,
                  type: s.type,
                  min: s.min || undefined,
                  max: s.max || undefined
                };
                break;
              default:
                self.fieldData[s.id] = {
                  id: s.id,
                  label: s.label,
                  type: s.type
                };
            }

            switch (s.type) {
              case 'array':
                self.arrays.push(s.id);

                break;
              case 'collection':
                obj = self.get(s.id);
                if (!obj || !(obj instanceof pgBrowser.Node.Collection)) {
                  if (_.isString(s.model) && s.model in pgBrowser.Nodes) {
                    var node = pgBrowser.Nodes[s.model];
                    obj = new node.Collection(obj, {
                      model: node.model,
                      top: self.top || self,
                      handler: self,
                      attrName: s.id
                    });
                  } else {
                    obj = new pgBrowser.Node.Collection(obj, {
                      model: s.model,
                      top: self.top || self,
                      handler: self,
                      attrName: s.id
                    });
                  }
                }

                obj.name = s.id;
                self.objects.push(s.id);
                self.set(s.id, obj, { silent: true });

                break;
              case 'model':
                obj = self.get(s.id);
                if (!obj || !(obj instanceof Backbone.Model)) {
                  if (_.isString(s.model) && s.model in pgBrowser.Nodes[s.model]) {
                    obj = new pgBrowser.Nodes[s.model].Model(obj, {
                      top: self.top || self, handler: self, attrName: s.id
                    });
                  } else {
                    obj = new s.model(obj, {
                      top: self.top || self, handler: self, attrName: s.id
                    });
                  }
                }

                obj.name = s.id;
                self.objects.push(s.id);
                self.set(s.id, obj, { silent: true });

                break;
              case 'nested':
                objectOp(s.schema);
                break;
              default:
                return;
            }
          });
        }
      };
      objectOp(self.schema);

      if (self.handler && self.handler.trackChanges) {
        self.startNewSession();
      }

      if ('keys' in self && _.isArray(self.keys)) {
        _.each(self.keys, function (key) {
          self.on("change:" + key, function (m) {
            self._previous_key_values[key] = m.previous(key);
          });
        });
      }
      return self;
    },
    // Create a reset function, which allow us to remove the nested object.
    reset: function reset(opts) {
      var obj;

      if (opts && opts.stop) this.stopSession();

      for (var id in this.objects) {
        obj = this.get(id);

        if (obj) {
          if (obj instanceof pgBrowser.DataModel) {
            obj.reset(opts);
          } else if (obj instanceof Backbone.Model) {
            obj.clear(opts);
          } else if (obj instanceof pgBrowser.DataCollection) {
            obj.reset(opts);
          } else if (obj instanceof Backbone.Collection) {
            obj.each(function (m) {
              if (m instanceof Backbone.DataModel) {
                obj.reset();
                obj.clear(opts);
              }
            });
            if (!(opts instanceof Array)) {
              opts = [opts];
            }
            Backbone.Collection.prototype.reset.apply(obj, opts);
          }
        }
      }
      this.clear(opts);
    },
    sessChanged: function sessChanged() {
      var self = this;

      return _.size(self.sessAttrs) > 0 || _.some(self.objects, function (k) {
        var obj = self.get(k);
        if (!(_.isNull(obj) || _.isUndefined(obj))) {
          return obj.sessChanged();
        }
        return false;
      });
    },
    sessValid: function sessValid() {
      var self = this;
      // Perform default validations.
      if ('default_validate' in self && typeof self.default_validate == 'function' && _.isString(self.default_validate())) {
        return false;
      }

      if ('validate' in self && _.isFunction(self.validate) && _.isString(self.validate.apply(self))) {
        return false;
      }
      return true;
    },
    set: function set(key, val, options) {
      var opts = _.isObject(key) ? val : options;

      this._changing = true;
      this._previousAttributes = _.clone(this.attributes);
      this.changed = {};

      var res = Backbone.Model.prototype.set.call(this, key, val, options);
      this._changing = false;

      if (opts && opts.internal || !this.trackChanges) {
        return true;
      }

      if (key != null && res) {
        var attrs = {},
            self = this,
            msg;

        var attrChanged = function attrChanged(v, k) {
          if (k in self.objects) {
            return;
          }
          attrs[k] = v;
          if (_.isEqual(self.origSessAttrs[k], v)) {
            delete self.sessAttrs[k];
          } else {
            self.sessAttrs[k] = v;
          }
        };

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
          _.each(key, attrChanged);
        } else {
          attrChanged(val, key);
        }

        self.trigger('pgadmin-session:set', self, attrs);
        if (!options || !options.silent) {
          self.trigger('change', self, options);
        }

        // Perform default validations.

        if ('default_validate' in self && typeof self.default_validate == 'function') {
          msg = self.default_validate();
        }

        if ('validate' in self && typeof self['validate'] === 'function') {

          if (!msg) {
            msg = self.validate(_.keys(attrs));
          }
        }

        /*
         * If any parent present, we will need to inform the parent - that
         * I have some issues/fixed the issue.
         *
         * If not parent found, we will raise the issue
         */
        if (_.size(self.errorModel.attributes) == 0) {
          if (self.collection || self.handler) {
            (self.collection || self.handler).trigger('pgadmin-session:model:valid', self, self.collection || self.handler);
          } else {
            self.trigger('pgadmin-session:valid', self.sessChanged(), self);
          }
        } else {
          msg = msg || _.values(self.errorModel.attributes)[0];
          if (self.collection || self.handler) {
            (self.collection || self.handler).trigger('pgadmin-session:model:invalid', msg, self, self.collection || self.handler);
          } else {
            self.trigger('pgadmin-session:invalid', msg, self);
          }
        }

        return res;
      }
      return res;
    },
    /*
     * We do support modified data only through session by tracking changes.
     *
     * In normal mode, we will use the toJSON function of Backbone.Model.
     * In session mode, we will return all the modified data only. And, the
     * objects (collection, and model) will be return as stringified JSON,
     * only from the parent object.
     */
    toJSON: function toJSON(session, method) {
      var self = this,
          res,
          isNew = self.isNew();

      session = typeof session != "undefined" && session == true;

      if (!session || isNew) {
        res = Backbone.Model.prototype.toJSON.call(this, arguments);
      } else {
        res = {};
        res[self.idAttribute || '_id'] = self.get(self.idAttribute || '_id');
        res = _.extend(res, self.sessAttrs);
      }

      /*
       * We do have number objects (models, collections), which needs to be
       * converted to JSON data manually.
       */
      _.each(self.objects, function (k) {
        var obj = self.get(k);
        /*
         * For session changes, we only need the modified data to be
         * transformed to JSON data.
         */
        if (session) {
          if (res[k] instanceof Array) {
            res[k] = JSON.stringify(res[k]);
          } else if (obj && obj.sessChanged && obj.sessChanged() || isNew) {
            res[k] = obj && obj.toJSON(!isNew);
            /*
             * We will run JSON.stringify(..) only from the main object,
             * not for the JSON object within the objects, that only when
             * HTTP method is 'GET'.
             *
             * We do stringify the object, so that - it will not be
             * translated to wierd format using jQuery.
             */
            if (obj && method && method == 'GET') {
              res[k] = JSON.stringify(res[k]);
            }
          } else {
            delete res[k];
          }
        } else if (!(res[k] instanceof Array)) {
          res[k] = obj && obj.toJSON();
        }
      });
      if (session) {
        _.each(self.arrays, function (a) {
          /*
           * For session changes, we only need the modified data to be
           * transformed to JSON data.
           */
          if (res[a] && res[a] instanceof Array) {
            res[a] = JSON.stringify(res[a]);
          }
        });
      }
      return res;
    },
    startNewSession: function startNewSession() {
      var self = this;

      if (self.trackChanges) {
        self.trigger('pgadmin-session:stop', self);
        self.off('pgadmin-session:model:invalid', self.onChildInvalid);
        self.off('pgadmin-session:model:valid', self.onChildValid);
        self.off('pgadmin-session:changed', self.onChildChanged);
        self.off('pgadmin-session:added', self.onChildChanged);
        self.off('pgadmin-session:removed', self.onChildChanged);
      }

      self.trackChanges = true;
      self.sessAttrs = {};
      self.origSessAttrs = _.clone(self.attributes);

      var res = false;

      _.each(self.objects, function (o) {
        var obj = self.get(o);

        if (_.isUndefined(obj) || _.isNull(obj)) {
          return;
        }

        delete self.origSessAttrs[o];

        if (obj && 'startNewSession' in obj && _.isFunction(obj.startNewSession)) {
          obj.startNewSession();
        }
      });

      // Let people know, I have started session hanlding
      self.trigger('pgadmin-session:start', self);

      // Let me listen to the my child invalid/valid messages
      self.on('pgadmin-session:model:invalid', self.onChildInvalid);
      self.on('pgadmin-session:model:valid', self.onChildValid);
      self.on('pgadmin-session:changed', self.onChildChanged);
      self.on('pgadmin-session:added', self.onChildChanged);
      self.on('pgadmin-session:removed', self.onChildChanged);
    },

    onChildInvalid: function onChildInvalid(msg, obj) {
      var self = this;

      if (self.trackChanges && obj) {
        var objName = obj.attrName;

        if (!objName) {
          var hasPrimaryKey = obj.primary_key && typeof obj.primary_key === 'function';
          var key = hasPrimaryKey ? obj.primary_key() : obj.cid,
              comparator = hasPrimaryKey ? function (k) {
            var o = self.get('k');

            if (o && o.primary_key() === key) {
              objName = k;
              return true;
            }

            return false;
          } : function (k) {
            var o = self.get(k);

            if (o.cid === key) {
              objName = k;
              return true;
            }

            return false;
          };
          _.findIndex(self.objects, comparator);
        }

        if (objName) {
          /*
           * Update the error message for this object.
           */
          self.errorModel.set(objName, msg);

          if (self.handler) {
            self.handler.trigger('pgadmin-session:model:invalid', msg, self, self.handler);
          } else {
            self.trigger('pgadmin-session:invalid', msg, self);
          }
        }
      }

      return this;
    },
    onChildValid: function onChildValid(obj) {
      var self = this;

      if (self.trackChanges && obj) {
        var objName = obj.attrName;

        if (!objName) {
          var hasPrimaryKey = obj.primary_key && typeof obj.primary_key === 'function';
          var key = hasPrimaryKey ? obj.primary_key() : obj.cid,
              comparator = hasPrimaryKey ? function (k) {
            var o = self.get('k');

            if (o && o.primary_key() === key) {
              objName = k;
              return true;
            }

            return false;
          } : function (k) {
            var o = self.get('k');

            if (o && o.cid === key) {
              objName = k;
              return true;
            }

            return false;
          };

          _.findIndex(self.objects, comparator);
        }

        var msg = null,
            validate = function validate(m, attrs) {
          if ('default_validate' in m && typeof m.default_validate == 'function') {
            msg = m.default_validate();
            if (_.isString(msg)) {
              return msg;
            }
          }

          if ('validate' in m && typeof m.validate == 'function') {
            msg = m.validate(attrs);

            return msg;
          }
          return null;
        };

        if (obj instanceof Backbone.Collection) {
          for (var idx in obj.models) {
            if (validate(obj.models[idx])) break;
          }
        } else if (obj instanceof Backbone.Model) {
          validate(obj);
        }

        if (objName && self.errorModel.has(objName)) {
          if (!msg) {
            self.errorModel.unset(objName);
          } else {
            self.errorModel.set(objName, msg);
          }
        }

        /*
         * The object is valid, but does this has any effect on parent?
         * Let's validate this object itself, before making it clear.
         *
         * We will trigger validation information.
         */
        if (_.size(self.errorModel.attributes) == 0 && !validate(self, objName && [objName])) {
          if (self.handler) {
            self.handler.trigger('pgadmin-session:model:valid', self, self.handler);
          } else {
            self.trigger('pgadmin-session:valid', self.sessChanged(), self);
          }
        } else {
          msg = msg || _.values(self.errorModel.attributes)[0];

          if (self.handler) {
            self.handler.trigger('pgadmin-session:model:invalid', msg, self, self.handler);
          } else {
            self.trigger('pgadmin-session:invalid', msg, self);
          }
        }
      }
    },

    onChildChanged: function onChildChanged(obj) {
      var self = this;

      if (self.trackChanges && self.collection) {
        self.collection.trigger('change', self);
      }
    },

    stopSession: function stopSession() {
      var self = this;

      if (self.trackChanges) {
        self.off('pgadmin-session:model:invalid', self.onChildInvalid);
        self.off('pgadmin-session:model:valid', self.onChildValid);
        self.off('pgadmin-session:changed', self.onChildChanged);
        self.off('pgadmin-session:added', self.onChildChanged);
        self.off('pgadmin-session:removed', self.onChildChanged);
      }

      self.trackChanges = false;
      self.sessAttrs = {};
      self.origSessAttrs = {};

      _.each(self.objects, function (o) {
        var obj = self.get(o);

        if (_.isUndefined(obj) || _.isNull(obj)) {
          return;
        }

        self.origSessAttrs[o] = null;
        delete self.origSessAttrs[o];

        if (obj && 'stopSession' in obj && _.isFunction(obj.stopSession)) {
          obj.stopSession();
        }
      });

      self.trigger('pgadmin-session:stop');
    },
    default_validate: function default_validate() {
      var msg, field, value, type;

      for (var i = 0, keys = _.keys(this.attributes), l = keys.length; i < l; i++) {

        value = this.attributes[keys[i]];
        field = this.fieldData[keys[i]];
        msg = null;

        if (!(_.isUndefined(value) || _.isNull(value) || String(value).replace(/^\s+|\s+$/g, '') == '')) {

          if (!field) {
            continue;
          }

          type = field.type || undefined;
          if (!type) {
            continue;
          }

          switch (type) {
            case 'int':
              msg = this.integer_validate(value, field);
              break;
            case 'numeric':
              msg = this.number_validate(value, field);
              break;
          }

          if (msg) {
            this.errorModel.set(field.id, msg);
            return msg;
          } else {
            this.errorModel.unset(field.id);
          }
        } else {
          if (field) {
            this.errorModel.unset(field.id);
          }
        }
      }
      return null;
    },

    check_min_max: function check_min_max(value, field) {
      var label = field.label,
          min_value = field.min,
          max_value = field.max;

      if (min_value && value < min_value) {
        return S(pgAdmin.Browser.messages.MUST_GR_EQ).sprintf(label, min_value).value();
      } else if (max_value && value > max_value) {
        return S(pgAdmin.Browser.messages.MUST_LESS_EQ).sprintf(label, max_value).value();
      }
      return null;
    },
    number_validate: function number_validate(value, field) {
      var pattern = new RegExp("^-?[0-9]+(\.?[0-9]*)?$");
      if (!pattern.test(value)) {
        return S(pgAdmin.Browser.messages.MUST_BE_NUM).sprintf(field.label).value();
      }
      return this.check_min_max(value, field);
    },
    integer_validate: function integer_validate(value, field) {
      var pattern = new RegExp("^-?[0-9]*$");
      if (!pattern.test(value)) {
        return S(pgAdmin.Browser.messages.MUST_BE_INT).sprintf(field.label).value();
      }
      return this.check_min_max(value, field);
    }
  });

  pgBrowser.DataCollection = Backbone.Collection.extend({
    // Model collection
    initialize: function initialize(attributes, options) {
      var self = this;

      options = options || {};
      /*
       * Session changes will be kept in this object.
       */
      self.sessAttrs = {
        'changed': [],
        'added': [],
        'deleted': [],
        'invalid': []
      };
      self.top = options.top || self;
      self.attrName = options.attrName;
      self.handler = options.handler;
      self.trackChanges = false;

      /*
       * Listen to the model changes for the session changes.
       */
      self.on('add', self.onModelAdd);
      self.on('remove', self.onModelRemove);
      self.on('change', self.onModelChange);

      /*
       * We need to start the session, if the handler is already in session
       * tracking mode.
       */
      if (self.handler && self.handler.trackChanges) {
        self.startNewSession();
      }

      return self;
    },
    startNewSession: function startNewSession() {
      var self = this,
          msg;

      if (self.trackChanges) {
        // We're stopping the existing session.
        self.trigger('pgadmin-session:stop', self);

        self.off('pgadmin-session:model:invalid', self.onModelInvalid);
        self.off('pgadmin-session:model:valid', self.onModelValid);
      }

      self.trackChanges = true;
      self.sessAttrs = {
        'changed': [],
        'added': [],
        'deleted': [],
        'invalid': []
      };

      _.each(self.models, function (m) {
        if ('startNewSession' in m && _.isFunction(m.startNewSession)) {
          m.startNewSession();
        }

        if ('default_validate' in m && typeof m.default_validate == 'function') {
          msg = m.default_validate();
        }

        if (_.isString(msg)) {
          self.sessAttrs['invalid'][m.cid] = msg;
        } else if ('validate' in m && typeof m.validate === 'function') {
          msg = m.validate();

          if (msg) {
            self.sessAttrs['invalid'][m.cid] = msg;
          }
        }
      });

      // Let people know, I have started session hanlding
      self.trigger('pgadmin-session:start', self);

      self.on('pgadmin-session:model:invalid', self.onModelInvalid);
      self.on('pgadmin-session:model:valid', self.onModelValid);
    },
    onModelInvalid: function onModelInvalid(msg, m) {
      var self = this,
          invalidModels = self.sessAttrs['invalid'];

      if (self.trackChanges) {
        // Do not add the existing invalid object
        invalidModels[m.cid] = msg;

        // Inform the parent that - I am an invalid model.
        if (self.handler) {
          self.handler.trigger('pgadmin-session:model:invalid', msg, self, self.handler);
        } else {
          self.trigger('pgadmin-session:invalid', msg, self);
        }
      }

      return true;
    },
    onModelValid: function onModelValid(m) {
      var self = this,
          invalidModels = self.sessAttrs['invalid'];

      if (self.trackChanges) {
        // Now check uniqueness of current model with other models.
        var isUnique = self.checkDuplicateWithModel(m);

        // If unique then find the object the invalid list, if found remove it from the list
        // and inform the parent that - I am a valid object now.

        if (isUnique && m.cid in invalidModels) {
          delete invalidModels[m.cid];
        }

        if (isUnique) {
          this.triggerValidationEvent.apply(this);
        }
      }

      return true;
    },
    stopSession: function stopSession() {
      var self = this;

      self.trackChanges = false;
      self.sessAttrs = {
        'changed': [],
        'added': [],
        'deleted': [],
        'invalid': []
      };

      _.each(self.models, function (m) {
        if ('stopSession' in m && _.isFunction(m.stopSession)) {
          m.stopSession();
        }
      });
    },
    sessChanged: function sessChanged() {
      return this.sessAttrs['changed'].length > 0 || this.sessAttrs['added'].length > 0 || this.sessAttrs['deleted'].length > 0;
    },
    /*
     * We do support the changes through session tracking in general.
     *
     * In normal mode, we will use the general toJSON(..) function of
     * Backbone.Colletion.
     *
     * In session mode, we will return session changes as:
     * We will be returning the session changes as:
     * {
     *  'added': [JSON of each new model],
     *  'delete': [JSON of each deleted model],
     *  'changed': [JSON of each modified model with session changes]
     * }
     */
    toJSON: function toJSON(session) {
      var self = this,
          session = typeof session != "undefined" && session == true;

      if (!session) {
        return Backbone.Collection.prototype.toJSON.call(self);
      } else {
        var res = {};

        res['added'] = [];
        _.each(this.sessAttrs['added'], function (o) {
          res['added'].push(o.toJSON());
        });
        if (res['added'].length == 0) {
          delete res['added'];
        }
        res['changed'] = [];
        _.each(self.sessAttrs['changed'], function (o) {
          res['changed'].push(o.toJSON(true));
        });
        if (res['changed'].length == 0) {
          delete res['changed'];
        }
        res['deleted'] = [];
        _.each(self.sessAttrs['deleted'], function (o) {
          res['deleted'].push(o.toJSON());
        });
        if (res['deleted'].length == 0) {
          delete res['deleted'];
        }

        return _.size(res) == 0 ? null : res;
      }
    },
    // Override the reset function, so that - we can reset the model
    // properly.
    reset: function reset(opts) {
      if (opts && opts.stop) this.stopSession();
      this.each(function (m) {
        if (!m) return;
        if (m instanceof pgBrowser.DataModel) {
          m.reset(opts);
        } else {
          m.clear(opts);
        }
      });
      Backbone.Collection.prototype.reset.apply(this, arguments);
    },
    objFindInSession: function objFindInSession(m, type) {
      var hasPrimaryKey = m.primary_key && typeof m.primary_key == 'function',
          key = hasPrimaryKey ? m.primary_key() : m.cid,
          comparator = hasPrimaryKey ? function (o) {
        return o.primary_key() === key;
      } : function (o) {
        return o.cid === key;
      };

      return _.findIndex(this.sessAttrs[type], comparator);
    },
    onModelAdd: function onModelAdd(obj) {
      if (!this.trackChanges) return true;

      var self = this,
          msg,
          isAlreadyInvalid = _.size(self.sessAttrs['invalid']) != 0,
          idx = self.objFindInSession(obj, 'deleted');

      // Hmm.. - it was originally deleted from this collection, we should
      // remove it from the 'deleted' list.
      if (idx >= 0) {
        var origObj = self.sessAttrs['deleted'][idx];

        obj.origSessAttrs = _.clone(origObj.origSessAttrs);
        obj.attributes = _.extend(obj.attributes, origObj.attributes);
        obj.sessAttrs = _.clone(origObj.sessAttrs);

        self.sessAttrs['deleted'].splice(idx, 1);

        // It has been changed originally!
        if (!'sessChanged' in obj || obj.sessChanged()) {
          self.sessAttrs['changed'].push(obj);
        }

        (self.handler || self).trigger('pgadmin-session:added', self, obj);

        if ('default_validate' in obj && typeof obj.default_validate == 'function') {
          msg = obj.default_validate();
        }

        if (_.isString(msg)) {
          self.sessAttrs['invalid'][obj.cid] = msg;
        } else if ('validate' in obj && typeof obj.validate === 'function') {
          msg = obj.validate();

          if (msg) {
            self.sessAttrs['invalid'][obj.cid] = msg;
          }
        }
      } else {

        if ('default_validate' in obj && typeof obj.default_validate == 'function') {
          msg = obj.default_validate();
        }

        if (_.isString(msg)) {
          self.sessAttrs['invalid'][obj.cid] = msg;
        } else if ('validate' in obj && typeof obj.validate === 'function') {
          msg = obj.validate();

          if (msg) {
            self.sessAttrs['invalid'][obj.cid] = msg;
          }
        }
        self.sessAttrs['added'].push(obj);

        /*
         * Session has been changed
         */
        (self.handler || self).trigger('pgadmin-session:added', self, obj);
      }

      // Let the parent/listener know about my status (valid/invalid).
      this.triggerValidationEvent.apply(this);

      return true;
    },
    onModelRemove: function onModelRemove(obj) {
      if (!this.trackChanges) return true;

      /* Once model is removed from collection clear its errorModel as it's no longer relevant
       * for us. Otherwise it creates problem in 'clearInvalidSessionIfModelValid' function.
       */
      obj.errorModel.clear();

      var self = this,
          invalidModels = self.sessAttrs['invalid'],
          copy = _.clone(obj),
          idx = self.objFindInSession(obj, 'added');

      // We need to remove it from the invalid object list first.
      if (obj.cid in invalidModels) {
        delete invalidModels[obj.cid];
      }

      // Hmm - it was newly added, we can safely remove it.
      if (idx >= 0) {
        self.sessAttrs['added'].splice(idx, 1);

        (self.handler || self).trigger('pgadmin-session:removed', self, copy);

        self.checkDuplicateWithModel(copy);

        // Let the parent/listener know about my status (valid/invalid).
        this.triggerValidationEvent.apply(this);

        return true;
      }

      // Hmm - it was changed in this session, we should remove it from the
      // changed models.
      idx = self.objFindInSession(obj, 'changed');

      if (idx >= 0) {
        self.sessAttrs['changed'].splice(idx, 1);
        (self.handler || self).trigger('pgadmin-session:removed', self, copy);
      } else {
        (self.handler || self).trigger('pgadmin-session:removed', self, copy);
      }

      self.sessAttrs['deleted'].push(obj);

      self.checkDuplicateWithModel(obj);

      // Let the parent/listener know about my status (valid/invalid).
      this.triggerValidationEvent.apply(this);

      /*
       * This object has been remove, we need to check (if we still have any
       * other invalid message pending).
       */

      return true;
    },
    triggerValidationEvent: function triggerValidationEvent() {
      var self = this,
          msg = null,
          invalidModels = self.sessAttrs['invalid'],
          validModels = [];

      for (var key in invalidModels) {
        msg = invalidModels[key];
        if (msg) {
          break;
        } else {
          // Hmm..
          // How come - you have been assigned in invalid list.
          // I will make a list of it, and remove it later.
          validModels.push(key);
        }
      }

      // Let's remove the un
      for (key in validModels) {
        delete invalidModels[validModels[key]];
      }

      if (!msg) {
        if (self.handler) {
          self.handler.trigger('pgadmin-session:model:valid', self, self.handler);
        } else {
          self.trigger('pgadmin-session:valid', self.sessChanged(), self);
        }
      } else {
        if (self.handler) {
          self.handler.trigger('pgadmin-session:model:invalid', msg, self, self.handler);
        } else {
          self.trigger('pgadmin-session:invalid', msg, self);
        }
      }
    },
    onModelChange: function onModelChange(obj) {
      var self = this;

      if (!this.trackChanges || !(obj instanceof pgBrowser.Node.Model)) return true;

      var idx = self.objFindInSession(obj, 'added');

      // It was newly added model, we don't need to add into the changed
      // list.
      if (idx >= 0) {
        (self.handler || self).trigger('pgadmin-session:changed', self, obj);

        return true;
      }

      idx = self.objFindInSession(obj, 'changed');

      if (!'sessChanged' in obj) {
        (self.handler || self).trigger('pgadmin-session:changed', self, obj);

        if (idx >= 0) {
          return true;
        }

        self.sessAttrs['changed'].push(obj);

        return true;
      }

      if (idx >= 0) {

        if (!obj.sessChanged()) {
          // This object is no more updated, removing it from the changed
          // models list.
          self.sessAttrs['changed'].splice(idx, 1);

          (self.handler || self).trigger('pgadmin-session:changed', self, obj);
          return true;
        }

        (self.handler || self).trigger('pgadmin-session:changed', self, obj);

        return true;
      }

      if (obj.sessChanged()) {
        self.sessAttrs['changed'].push(obj);
        (self.handler || self).trigger('pgadmin-session:changed', self, obj);
      }

      return true;
    },

    /*
     * This function will check if given model is unique or duplicate in
     * collection and set/clear duplicate errors on models.
     */
    checkDuplicateWithModel: function checkDuplicateWithModel(model) {
      if (!('keys' in model) || _.isEmpty(model.keys)) {
        return true;
      }

      var self = this,
          condition = {},
          previous_condition = {};

      _.each(model.keys, function (key) {
        condition[key] = model.get(key);
        if (key in model._previous_key_values) {
          previous_condition[key] = model._previous_key_values[key];
        } else {
          previous_condition[key] = model.previous(key);
        }
      });

      // Reset previously changed values.
      model._previous_key_values = {};

      var old_conflicting_models = self.where(previous_condition);

      if (old_conflicting_models.length == 1) {
        var m = old_conflicting_models[0];
        self.clearInvalidSessionIfModelValid(m);
      }

      var new_conflicting_models = self.where(condition);
      if (new_conflicting_models.length == 0) {
        self.clearInvalidSessionIfModelValid(model);
      } else if (new_conflicting_models.length == 1) {
        self.clearInvalidSessionIfModelValid(model);
        self.clearInvalidSessionIfModelValid(new_conflicting_models[0]);
      } else {
        var msg = "Duplicate rows.";
        setTimeout(function () {
          _.each(new_conflicting_models, function (m) {
            self.trigger('pgadmin-session:model:invalid', msg, m, self.handler);
            m.trigger('pgadmin-session:model:duplicate', m, msg);
          });
        }, 10);

        return false;
      }
      return true;
    },
    clearInvalidSessionIfModelValid: function clearInvalidSessionIfModelValid(m) {
      var errors = m.errorModel.attributes,
          invalidModels = this.sessAttrs['invalid'];

      m.trigger('pgadmin-session:model:unique', m);
      if (_.size(errors) == 0) {
        delete invalidModels[m.cid];
      } else {
        invalidModels[m.cid] = errors[Object.keys(errors)[0]];
      }
    }
  });

  pgBrowser.Events = _.extend({}, Backbone.Events);

  return pgBrowser;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 257:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(8), __webpack_require__(3), __webpack_require__(1), __webpack_require__(16), __webpack_require__(2), __webpack_require__(5), __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, alertify, pgAdmin, _, Backform, gettext, url_for) {
  pgAdmin = pgAdmin || window.pgAdmin || {};

  /*
   * Hmm... this module is already been initialized, we can refer to the old
   * object from here.
   */
  if (pgAdmin.Settings) return pgAdmin.Settings;

  pgAdmin.Settings = {
    init: function init() {
      if (this.initialized) return;

      this.initialized = true;
    },
    // We will force unload method to not to save current layout
    // and reload the window
    show: function show() {
      var obj = this;
      alertify.confirm(gettext('Reset layout'), gettext('Are you sure you want to reset the current layout? This will cause the application to reload and any un-saved data will be lost.'), function () {
        var reloadingIndicator = $('<div id="reloading-indicator"></div>');
        $('body').append(reloadingIndicator);
        // Delete the record from database as well, then only reload page
        $.ajax({
          url: url_for('settings.reset_layout'),
          type: 'DELETE',
          async: false,
          success: function success() {
            // Prevent saving layout on server for next page reload.
            $(window).unbind('unload');
            window.onbeforeunload = null;
            // Now reload page
            location.reload(true);
          },
          error: function error() {
            console.log('Something went wrong on server while resetting layout');
          }
        });
      }, function () {
        // Do nothing as user canceled the operation.
      });
    }
  };

  return pgAdmin.Settings;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 261:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(10), __webpack_require__(3), __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, pgAdmin, pgBrowser) {

  pgBrowser = pgBrowser || pgAdmin.Browser || {};

  /* Wizard individual Page Model */
  var WizardPage = pgBrowser.WizardPage = Backbone.Model.extend({
    defaults: {
      id: undefined, /* Id */
      page_title: undefined, /* Page Title */
      view: undefined, /* A Backbone View */
      html: undefined, /* HTML tags to be rendered */
      image: undefined, /* Left hand side image */
      disable_prev: false, /*  Previous Button Flag */
      disable_next: false, /*  Next Button Flag */
      disable_cancel: false, /* Cancel Button Flag */
      show_progress_bar: '',
      /* Callback for OnLoad */
      onLoad: function onLoad() {
        return true;
      },
      /* Callback for before Next */
      beforeNext: function beforeNext() {
        return true;
      },
      onNext: function onNext() {},
      onBefore: function onBefore() {},
      /* Callback for before Previous */
      beforePrev: function beforePrev() {
        return true;
      }
    }
  });

  var Wizard = pgBrowser.Wizard = Backbone.View.extend({
    options: {
      title: 'Wizard', /* Main Wizard Title */
      image: 'left_panel.png', /* TODO:: We can use default image here */
      curr_page: 0, /* Current Page to Load */
      disable_next: false,
      disable_prev: false,
      disable_finish: false,
      disable_cancel: false,
      show_header_cancel_btn: false, /* show cancel button at wizard header */
      show_header_maximize_btn: false, /* show maximize button at wizard header */
      dialog_api: null,
      height: 400,
      width: 650,
      show_left_panel: true,
      wizard_help: ''
    },
    tmpl: _.template("    <div class='pgadmin-wizard' style='height: <%= this.options.height %>px;" + "    width: <%= this.options.width %>px'>" + "      <div class='wizard-header wizard-badge'>" + "        <div class='row'>" + "          <div class='col-sm-10'>" + "              <h3><span id='main-title'><%= this.options.title %></span> -" + "              <span id='step-title'><%= page_title %></span></h3>" + "          </div>" + "          <% if (this.options.show_header_cancel_btn) { %>" + "            <div class='col-sm-2'>" + "              <button class='ajs-close wizard-cancel-event pull-right'></button>" + "              <% if (this.options.show_header_maximize_btn) { %>" + "                <button class='ajs-maximize wizard-maximize-event pull-right'></button>" + "              <% } %>" + "            </div>" + "          <% } %>" + "        </div>" + "      </div>" + "      <div class='wizard-content col-sm-12'>" + "        <% if (this.options.show_left_panel) { %>" + "          <div class='col-sm-3 wizard-left-panel'>" + "              <img src='<%= this.options.image %>'></div>" + "        <% } %>" + "        <div class='col-sm-<% if (this.options.show_left_panel) { %>9<% }" + "          else { %>12<% } %> wizard-right-panel'>" + "          <% if ( typeof show_description !=  'undefined'){ %>" + "            <div class='wizard-description'>" + "              <%= show_description %>" + "            </div>" + "          <% } %>" + "          <div class='wizard-progress-bar'><% if (show_progress_bar) { %>" + "            <p class='alert alert-info col-sm-12'><%= show_progress_bar %></p><% } %>" + "          </div>" + "          <div class='wizard-right-panel_content col-xs-12'>" + "          </div>" + "        </div>" + "      </div>" + "      <div class='col-sm-12 error_msg_div'>" + "       <p></p>" + "      </div>" + "      <div class='footer col-sm-12'>" + "        <div class='row'>" + "          <div class='col-sm-4 wizard-buttons pull-left'>" + "            <button title = 'Help for this dialog.' class='btn btn-default pull-left wizard-help' <%=this.options.wizard_help ? '' : 'disabled' %>>" + "              <span class='fa fa-lg fa-question'></span></button>" + "          </div>" + "          <div class='col-sm-8'>" + "            <div class='wizard-buttons'>" + "              <button class='btn btn-primary wizard-back' <%=this.options.disable_prev ? 'disabled' : ''%>>" + "                <i class='fa fa-backward'></i>Back</button>" + "              <button class='btn btn-primary wizard-next' <%=this.options.disable_next ? 'disabled' : ''%>>Next" + "                <i class='fa fa-forward'></i></button>" + "              <button class='btn btn-danger wizard-cancel' <%=this.options.disable_cancel ? 'disabled' : ''%>>" + "                <i class='fa fa-lg fa-close'></i>Cancel</button>" + "              <button class='btn btn-primary wizard-finish' <%=this.options.disable_finish ? 'disabled' : ''%>>" + "                Finish</button>" + "            </div>" + "          </div>" + "        </div>" + "      </div>" + "    </div>"),
    events: {
      "click button.wizard-next": "nextPage",
      "click button.wizard-back": "prevPage",
      "click button.wizard-cancel": "onCancel",
      "click button.wizard-cancel-event": "onCancel",
      "click button.wizard-maximize-event": "onMaximize",
      "click button.wizard-finish": "finishWizard",
      "click button.wizard-help": "onDialogHelp"
    },
    initialize: function initialize(options) {
      this.options = _.extend({}, this.options, options.options);
      this.currPage = this.collection.at(this.options.curr_page).toJSON();
    },
    render: function render() {
      var data = this.currPage;

      /* Check Status of the buttons */
      this.options.disable_next = this.options.disable_next ? true : this.evalASFunc(this.currPage.disable_next);
      this.options.disable_prev = this.options.disable_prev ? true : this.evalASFunc(this.currPage.disable_prev);
      this.options.disable_cancel = this.currPage.canCancel ? true : this.evalASFunc(this.currPage.disable_cancel);

      var that = this;

      /* HTML Content */
      if (data.html) {
        data.content = data.html;
      }
      /* Backbone View */
      else if (data.view) {
          data.content = data.view.render().el;
        }

      $(this.el).html(this.tmpl(data));
      $(this.el).find(".wizard-right-panel_content").html(data.content);

      /* OnLoad Callback */
      this.onLoad();

      return this;
    },
    nextPage: function nextPage() {
      if (!this.beforeNext()) {
        return false;
      }

      var page_id = this.onNext();

      if (page_id) {
        this.currPage = this.collection.get(page_id).toJSON();
        this.options.curr_page = this.collection.indexOf(this.collection.get(page_id));
      } else if (this.options.curr_page < this.collection.length - 1) {
        this.options.curr_page = this.options.curr_page + 1;
        this.currPage = this.collection.at(this.options.curr_page).toJSON();
      }

      this.enableDisableNext();
      this.enableDisablePrev();

      return this.render();
    },
    prevPage: function prevPage() {
      if (!this.beforePrev()) {
        return false;
      }

      var page_id = this.onPrev();

      if (page_id) {
        this.currPage = this.collection.get(page_id).toJSON();
        this.options.curr_page = this.collection.indexOf(this.collection.get(page_id));
      } else if (this.options.curr_page > 0) {
        this.options.curr_page = this.options.curr_page - 1;
        this.currPage = this.collection.at(this.options.curr_page).toJSON();
      }

      this.enableDisableNext();
      this.enableDisablePrev();

      return this.render();
    },
    finishWizard: function finishWizard() {
      this.onFinish();
      this.remove(); // Remove view from DOM
      this.unbind(); // Unbind all local event bindings
      delete this.$el; // Delete the jQuery wrapped object variable
      delete this.el; // Delete the variable reference to this node
      return true;
    },
    enableDisableNext: function enableDisableNext(disable) {
      if (typeof disable != 'undefined') {
        this.options.disable_next = disable;
      } else if (this.options.curr_page >= this.collection.length - 1) {
        this.options.disable_next = true;
      } else {
        this.options.disable_next = false;
      }
    },
    enableDisablePrev: function enableDisablePrev(disable) {
      if (typeof disable != 'undefined') {
        this.options.disable_prev = disable;
      } else if (this.options.curr_page <= 0) {
        this.options.disable_prev = true;
      } else {
        this.options.disable_prev = false;
      }
    },
    beforeNext: function beforeNext() {
      return this.evalASFunc(this.currPage.beforeNext);
    },
    beforePrev: function beforePrev() {
      return this.evalASFunc(this.currPage.beforePrev);
    },
    onPrev: function onPrev() {
      return this.evalASFunc(this.currPage.onPrev);
    },
    onNext: function onNext() {
      return this.evalASFunc(this.currPage.onNext);
    },
    onLoad: function onLoad() {
      return this.evalASFunc(this.currPage.onLoad);
    },
    onFinish: function onFinish() {
      return true;
    },
    onCancel: function onCancel() {
      this.$el.remove();
      return true;
    },
    onMaximize: function onMaximize() {
      var dialog_api = this.options.dialog_api,
          old_classes,
          _el = this.$el.find('.wizard-maximize-event');

      // If no dialog api found then return
      if (!dialog_api) return;

      if (dialog_api.isMaximized()) {
        // toggle the icon
        _el.removeClass('ajs-maximized');
        dialog_api.restore();
      } else {
        // toggle the icon
        _el.addClass('ajs-maximized ' + _el.attr('class'));
        dialog_api.maximize();
      }
    },
    evalASFunc: function evalASFunc(func, ctx) {
      var self = this;
      ctx = ctx || self.currPage;

      return _.isFunction(func) ? func.apply(ctx, [self]) : func;
    },
    onDialogHelp: function onDialogHelp() {
      // See if we can find an existing panel, if not, create one
      var pnlDialogHelp = pgBrowser.docker.findPanels('pnl_online_help')[0];

      if (pnlDialogHelp == null) {
        var pnlProperties = pgBrowser.docker.findPanels('properties')[0];
        pgBrowser.docker.addPanel('pnl_online_help', wcDocker.DOCK.STACKED, pnlProperties);
        pnlDialogHelp = pgBrowser.docker.findPanels('pnl_online_help')[0];
      }

      // Update the panel
      var iframe = $(pnlDialogHelp).data('embeddedFrame');

      pnlDialogHelp.focus();
      iframe.openURL(this.options.wizard_help);
    }
  });

  return pgBrowser;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

(function (root, factory) {
  // Set up Backform appropriately for the environment. Start with AMD.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(1), __webpack_require__(0), __webpack_require__(10), __webpack_require__(16), __webpack_require__(13), __webpack_require__(8), __webpack_require__(47), __webpack_require__(253), __webpack_require__(254), __webpack_require__(255)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, _, $, Backbone, Backform, Backgrid, Alertify, moment, BigNumber) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backform.
      return factory(root, gettext, _, $, Backbone, Backform, Backgrid, Alertify, moment, BigNumber);
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

    // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var gettext = require('sources/gettext'),
        _ = require('underscore') || root._,
        $ = root.jQuery || root.$ || root.Zepto || root.ender,
        Backbone = require('backbone') || root.Backbone,
        Backform = require('backform') || root.Backform,
        Backgrid = require('backgrid') || root.Backgrid,
        Alertify = require('alertify') || root.Alertify,
        moment = require('moment') || root.moment;
    factory(root, gettext, _, $, Backbone, Backform, Backgrid, Alertify, moment);

    // Finally, as a browser global.
  } else {
    factory(root, root.gettext, root._, root.jQuery || root.Zepto || root.ender || root.$, root.Backbone, root.Backform, root.Alertify, root.moment);
  }
})(undefined, function (root, gettext, _, $, Backbone, Backform, Backgrid, Alertify, moment, BigNumber) {
  /*
     * Add mechanism in backgrid to render different types of cells in
     * same column;
   */

  // Add new property cellFunction in Backgrid.Column.
  _.extend(Backgrid.Column.prototype.defaults, { cellFunction: undefined });

  // Add tooltip to cell if cell content is larger than
  // cell width
  _.extend(Backgrid.Cell.prototype.events, {
    'mouseover': function mouseover(e) {
      var $el = $(this.el);
      if ($el.text().length > 0 && !$el.attr('title') && $el.innerWidth() + 1 < $el[0].scrollWidth) {
        $el.attr('title', $.trim($el.text()));
      }
    }
  });

  /* Overriding backgrid sort method.
   * As we are getting numeric, integer values as string
   * from server side, but on client side javascript truncates
   * large numbers automatically due to which backgrid was unable
   * to sort numeric values properly in the grid.
   * To fix this issue, now we check if cell type is integer/number
   * convert it into BigNumber object and make comparison to perform sorting.
   */

  _.extend(Backgrid.Body.prototype, {
    sort: function sort(column, direction) {

      if (!_.contains(["ascending", "descending", null], direction)) {
        throw new RangeError('direction must be one of "ascending", "descending" or `null`');
      }

      if (_.isString(column)) column = this.columns.findWhere({ name: column });

      var collection = this.collection;

      var order;
      if (direction === "ascending") order = -1;else if (direction === "descending") order = 1;else order = null;

      // Get column type and pass it to comparator.
      var col_type = column.get('cell').prototype.className || 'string-cell',
          comparator = this.makeComparator(column.get("name"), order, order ? column.sortValue() : function (model) {
        return model.cid.replace('c', '') * 1;
      }, col_type);

      if (Backbone.PageableCollection && collection instanceof Backbone.PageableCollection) {

        collection.setSorting(order && column.get("name"), order, { sortValue: column.sortValue() });

        if (collection.fullCollection) {
          // If order is null, pageable will remove the comparator on both sides,
          // in this case the default insertion order comparator needs to be
          // attached to get back to the order before sorting.
          if (collection.fullCollection.comparator == null) {
            collection.fullCollection.comparator = comparator;
          }
          collection.fullCollection.sort();
          collection.trigger("backgrid:sorted", column, direction, collection);
        } else collection.fetch({ reset: true, success: function success() {
            collection.trigger("backgrid:sorted", column, direction, collection);
          } });
      } else {
        collection.comparator = comparator;
        collection.sort();
        collection.trigger("backgrid:sorted", column, direction, collection);
      }

      column.set("direction", direction);

      return this;
    },
    makeComparator: function makeComparator(attr, order, func, type) {

      return function (left, right) {
        // extract the values from the models

        var l = func(left, attr),
            r = func(right, attr),
            t;
        if (_.isUndefined(l) || _.isUndefined(r)) return;

        var types = ['number-cell', 'integer-cell'];
        if (_.include(types, type)) {
          var _l, _r;
          // NaN if invalid number
          try {
            _l = new BigNumber(l);
          } catch (err) {
            _l = NaN;
          }

          try {
            _r = new BigNumber(r);
          } catch (err) {
            _r = NaN;
          }

          // if descending order, swap left and right
          if (order === 1) t = _l, _l = _r, _r = t;

          if (_l.eq(_r)) // If both are equals
            return 0;else if (_l.lt(_r)) // If left is less than right
            return -1;else return 1;
        } else {
          // if descending order, swap left and right
          if (order === 1) t = l, l = r, r = t;

          // compare as usual
          if (l === r) return 0;else if (l < r) return -1;
          return 1;
        }
      };
    }
  });

  _.extend(Backgrid.Row.prototype, {
    makeCell: function makeCell(column) {
      return new (this.getCell(column))({
        column: column,
        model: this.model
      });
    },
    /*
     * getCell function will check and execute user given cellFunction to get
     * appropriate cell class for current cell being rendered.
     * User provided cellFunction must return valid cell class.
     * cellFunction will be called with context (this) as column and model as
     * argument.
     */
    getCell: function getCell(column) {
      var cf = column.get("cellFunction");
      if (_.isFunction(cf)) {
        var cell = cf.apply(column, [this.model]);
        try {
          return Backgrid.resolveNameToClass(cell, "Cell");
        } catch (e) {
          if (e instanceof ReferenceError) {
            // Fallback to column cell.
            return column.get("cell");
          } else {
            throw e; // Let other exceptions bubble up
          }
        }
      } else {
        return column.get("cell");
      }
    }
  });

  var ObjectCellEditor = Backgrid.Extension.ObjectCellEditor = Backgrid.CellEditor.extend({
    modalTemplate: _.template(['<div class="subnode-dialog" tabindex="1">', '    <div class="subnode-body"></div>', '</div>'].join("\n")),
    stringTemplate: _.template(['<div class="form-group">', '  <label class="control-label col-sm-4"><%=label%></label>', '  <div class="col-sm-8">', '    <input type="text" class="form-control" name="<%=name%>" value="<%=value%>" placeholder="<%=placeholder%>" />', '  </div>', '</div>'].join("\n")),
    extendWithOptions: function extendWithOptions(options) {
      _.extend(this, options);
    },
    render: function render() {
      return this;
    },
    postRender: function postRender(model, column) {
      var editor = this,
          el = this.el,
          columns_length = this.columns_length,

      // To render schema directly from Backgrid cell we use columns schema attribute
      schema = this.schema.length ? this.schema : this.column.get('schema');

      if (column != null && column.get("name") != this.column.get("name")) return false;

      if (!_.isArray(schema)) throw new TypeError("schema must be an array");

      // Create a Backbone model from our object if it does not exist
      var $dialog = this.createDialog(columns_length);

      // Add the Bootstrap form
      var $form = $('<form class="form-dialog"></form>');
      $dialog.find('div.subnode-body').append($form);

      // Call Backform to prepare dialog
      var back_el = $dialog.find('form.form-dialog');

      this.objectView = new Backform.Dialog({
        el: back_el, model: this.model, schema: schema,
        tabPanelClassName: function tabPanelClassName() {
          return 'sub-node-form col-sm-12';
        }
      });

      this.objectView.render();

      return this;
    },
    createDialog: function createDialog(noofcol) {
      var $dialog = this.$dialog = $(this.modalTemplate({ title: "" })),
          tr = $("<tr>"),
          noofcol = noofcol || 1,
          td = $("<td>", { class: 'editable sortable renderable', style: 'height: auto', colspan: noofcol + 2 }).appendTo(tr);

      this.tr = tr;

      // Show the Bootstrap modal dialog
      td.append($dialog.css('display', 'block'));
      this.el.parent('tr').after(tr);

      return $dialog;
    },
    save: function save() {
      // Retrieve values from the form, and store inside the object model
      this.model.trigger("backgrid:edited", this.model, this.column, new Backgrid.Command({ keyCode: 13 }));
      if (this.tr) {
        this.tr.remove();
      }

      return this;
    },
    remove: function remove() {
      this.objectView.remove();
      Backgrid.CellEditor.prototype.remove.apply(this, arguments);
      if (this.tr) {
        this.tr.remove();
      }
      return this;
    }
  });

  var PGSelectCell = Backgrid.Extension.PGSelectCell = Backgrid.SelectCell.extend({
    // It's possible to render an option group or use a
    // function to provide option values too.
    optionValues: function optionValues() {
      var res = [],
          opts = _.result(this.column.attributes, 'options');
      _.each(opts, function (o) {
        res.push([o.label, o.value]);
      });
      return res;
    }
  });

  var ObjectCell = Backgrid.Extension.ObjectCell = Backgrid.Cell.extend({
    editorOptionDefaults: {
      schema: []
    },
    className: "edit-cell",
    editor: ObjectCellEditor,
    initialize: function initialize(options) {
      Backgrid.Cell.prototype.initialize.apply(this, arguments);

      // Pass on cell options to the editor
      var cell = this,
          editorOptions = {};
      _.each(this.editorOptionDefaults, function (def, opt) {
        if (!cell[opt]) cell[opt] = def;
        if (options && options[opt]) cell[opt] = options[opt];
        editorOptions[opt] = cell[opt];
      });

      editorOptions['el'] = $(this.el);
      editorOptions['columns_length'] = this.column.collection.length;
      editorOptions['el'].attr('tabindex', 1);

      this.listenTo(this.model, "backgrid:edit", function (model, column, cell, editor) {
        if (column.get("name") == this.column.get("name")) editor.extendWithOptions(editorOptions);
      });
    },
    enterEditMode: function enterEditMode() {
      // Notify that we are about to enter in edit mode for current cell.
      // We will check if this row is editable first
      var canEditRow = !_.isUndefined(this.column.get('canEditRow')) && _.isFunction(this.column.get('canEditRow')) ? Backgrid.callByNeed(this.column.get('canEditRow'), this.column, this.model) : true;
      if (canEditRow) {
        // Notify that we are about to enter in edit mode for current cell.
        this.model.trigger("enteringEditMode", [this]);

        Backgrid.Cell.prototype.enterEditMode.apply(this, arguments);
        /* Make sure - we listen to the click event */
        this.delegateEvents();
        var editable = Backgrid.callByNeed(this.column.editable(), this.column, this.model);

        if (editable) {
          this.$el.html("<i class='fa fa-pencil-square subnode-edit-in-process'></i>");
          this.model.trigger("pg-sub-node:opened", this.model, this);
        }
      } else {
        Alertify.alert("This object is not editable by user", function () {
          return true;
        });
      }
    },
    render: function render() {
      this.$el.empty();
      this.$el.html("<i class='fa fa-pencil-square-o'></i>");
      this.delegateEvents();
      if (this.grabFocus) this.$el.focus();
      return this;
    },
    exitEditMode: function exitEditMode() {
      var index = $(this.currentEditor.objectView.el).find('.nav-tabs > .active > a[data-toggle="tab"]').first().data('tabIndex');
      Backgrid.Cell.prototype.exitEditMode.apply(this, arguments);
      this.model.trigger("pg-sub-node:closed", this, index);
      this.grabFocus = true;
    },
    events: {
      'click': function click(e) {
        if (this.$el.find('i').first().hasClass('subnode-edit-in-process')) {
          // Need to redundantly undelegate events for Firefox
          this.undelegateEvents();
          this.currentEditor.save();
        } else {
          this.enterEditMode.call(this, []);
        }
        e.preventDefault();
      }
    }
  });

  var DeleteCell = Backgrid.Extension.DeleteCell = Backgrid.Cell.extend({
    defaults: _.defaults({
      defaultDeleteMsg: gettext('Are you sure you wish to delete this row?'),
      defaultDeleteTitle: gettext('Delete Row')
    }, Backgrid.Cell.prototype.defaults),

    /** @property */
    className: "delete-cell",
    events: {
      "click": "deleteRow"
    },
    deleteRow: function deleteRow(e) {
      e.preventDefault();
      var that = this;
      // We will check if row is deletable or not
      var canDeleteRow = !_.isUndefined(this.column.get('canDeleteRow')) && _.isFunction(this.column.get('canDeleteRow')) ? Backgrid.callByNeed(this.column.get('canDeleteRow'), this.column, this.model) : true;
      if (canDeleteRow) {
        var delete_msg = !_.isUndefined(this.column.get('customDeleteMsg')) ? this.column.get('customDeleteMsg') : that.defaults.defaultDeleteMsg;
        var delete_title = !_.isUndefined(this.column.get('customDeleteTitle')) ? this.column.get('customDeleteTitle') : that.defaults.defaultDeleteTitle;
        Alertify.confirm(delete_title, delete_msg, function (evt) {
          that.model.collection.remove(that.model);
        }, function (evt) {
          return true;
        });
      } else {
        Alertify.alert("This object cannot be deleted", function () {
          return true;
        });
      }
    },
    initialize: function initialize() {
      Backgrid.Cell.prototype.initialize.apply(this, arguments);
    },
    render: function render() {
      this.$el.empty();
      this.$el.html("<i class='fa fa-trash'></i>");
      this.delegateEvents();
      return this;
    }
  });

  var CustomHeaderCell = Backgrid.Extension.CustomHeaderCell = Backgrid.HeaderCell.extend({
    initialize: function initialize() {
      // Here, we will add custom classes to header cell
      Backgrid.HeaderCell.prototype.initialize.apply(this, arguments);
      var getClassName = this.column.get('cellHeaderClasses');
      if (getClassName) {
        this.$el.addClass(getClassName);
      }
    }
  });

  /**
    SwitchCell renders a Bootstrap Switch in backgrid cell
  */
  $.fn.bootstrapSwitch = jQuery.fn.bootstrapSwitch;
  var SwitchCell = Backgrid.Extension.SwitchCell = Backgrid.BooleanCell.extend({
    defaults: {
      options: _.defaults({
        onText: 'True',
        offText: 'False',
        onColor: 'success',
        offColor: 'default',
        size: 'mini'
      }, $.fn.bootstrapSwitch.defaults)
    },

    className: 'switch-cell',

    initialize: function initialize() {
      Backgrid.BooleanCell.prototype.initialize.apply(this, arguments);
      this.onChange = this.onChange.bind(this);
    },

    enterEditMode: function enterEditMode() {
      this.$el.addClass('editor');
      $(this.$el.find('input')).focus();
    },

    exitEditMode: function exitEditMode() {
      this.$el.removeClass('editor');
    },

    events: {
      'switchChange.bootstrapSwitch': 'onChange'
    },

    onChange: function onChange() {
      var model = this.model,
          column = this.column,
          val = this.formatter.toRaw(this.$input.prop('checked'), model);

      // on bootstrap change we also need to change model's value
      model.set(column.get("name"), val);
    },

    render: function render() {
      var self = this,
          col = _.defaults(this.column.toJSON(), this.defaults),
          attributes = this.model.toJSON(),
          attrArr = col.name.split('.'),
          name = attrArr.shift(),
          path = attrArr.join('.'),
          model = this.model,
          column = this.column,
          rawValue = this.formatter.fromRaw(model.get(column.get("name")), model),
          editable = Backgrid.callByNeed(col.editable, column, model);

      this.undelegateEvents();

      this.$el.empty();

      this.$el.append($("<input>", {
        tabIndex: -1,
        type: "checkbox"
      }).prop('checked', rawValue).prop('disabled', !editable));
      this.$input = this.$el.find('input[type=checkbox]').first();

      // Override BooleanCell checkbox with Bootstrapswitch
      this.$input.bootstrapSwitch(_.defaults({ 'state': rawValue, 'disabled': !editable }, col.options, this.defaults.options));

      // Listen for Tab key
      this.$el.on('keydown', function (e) {
        var gotoCell;
        if (e.keyCode == 9) {
          // go to Next Cell & if Shift is also pressed go to Previous Cell
          gotoCell = e.shiftKey ? self.$el.prev() : self.$el.next();
        }

        if (gotoCell) {
          setTimeout(function () {
            if (gotoCell.hasClass('editable')) {
              e.preventDefault();
              e.stopPropagation();
              var command = new Backgrid.Command({
                key: "Tab", keyCode: 9,
                which: 9, shiftKey: e.shiftKey
              });
              self.model.trigger("backgrid:edited", self.model, self.column, command);
              gotoCell.focus();
            }
          }, 20);
        }
      });

      this.delegateEvents();

      return this;
    }
  });

  /*
   *  Select2Cell for backgrid.
   */
  var Select2Cell = Backgrid.Extension.Select2Cell = Backgrid.SelectCell.extend({
    className: "select2-cell",

    /** @property */
    editor: null,

    defaults: _.defaults({
      select2: {},
      opt: {
        label: null,
        value: null,
        selected: false
      }
    }, Backgrid.SelectCell.prototype.defaults),

    enterEditMode: function enterEditMode() {
      if (!this.$el.hasClass('editor')) this.$el.addClass('editor');
      this.$select.select2('focus');
      this.$select.select2('open');
      this.$select.on('blur', this.exitEditMode);
    },

    exitEditMode: function exitEditMode() {
      this.$select.off('blur', this.exitEditMode);
      this.$select.select2('close');
      this.$el.removeClass('editor');
    },

    events: {
      "select2:open": "enterEditMode",
      "select2:close": "exitEditMode",
      "change": "onSave",
      "select2:unselect": "onSave"
    },
    /** @property {function(Object, ?Object=): string} template */
    template: _.template(['<option value="<%- value %>" ', '<%= selected ? \'selected="selected"\' : "" %>>', '<%- label %></option>'].join(''), null, {
      variable: null
    }),

    initialize: function initialize() {
      Backgrid.SelectCell.prototype.initialize.apply(this, arguments);
      this.onSave = this.onSave.bind(this);
      this.enterEditMode = this.enterEditMode.bind(this);
      this.exitEditMode = this.exitEditMode.bind(this);
    },

    render: function render() {
      var col = _.defaults(this.column.toJSON(), this.defaults),
          model = this.model,
          column = this.column,
          editable = Backgrid.callByNeed(col.editable, column, model),
          optionValues = _.clone(this.optionValues || (_.isFunction(this.column.get('options')) ? this.column.get('options')(this) : this.column.get('options')));

      this.undelegateEvents();

      if (this.$select) {
        if (this.$select.data('select2')) {
          this.$select.select2('destroy');
        }
        delete this.$select;
        this.$select = null;
      }

      this.$el.empty();

      if (!_.isArray(optionValues)) throw new TypeError("optionValues must be an array");

      /*
       * Add empty option as Select2 requires any empty '<option><option>' for
       * some of its functionality to work.
       */
      optionValues.unshift(this.defaults.opt);

      var optionText = null,
          optionValue = null,
          self = this,
          model = this.model,
          selectedValues = model.get(this.column.get("name")),
          select2_opts = _.extend({ openOnEnter: false, multiple: false }, self.defaults.select2, col.select2 || {}),
          selectTpl = _.template('<select <%=multiple ? "multiple" : "" %>></select>');

      var $select = self.$select = $(selectTpl({
        multiple: select2_opts.multiple
      })).appendTo(self.$el);

      for (var i = 0; i < optionValues.length; i++) {
        var opt = optionValues[i];

        if (_.isArray(opt)) {

          optionText = opt[0];
          optionValue = opt[1];

          $select.append(self.template({
            label: optionText,
            value: optionValue,
            selected: selectedValues == optionValue || select2_opts.multiple && _.indexOf(selectedValues, optionValue) > -1
          }));
        } else {
          opt = _.defaults({}, opt, {
            selected: selectedValues == opt.value || select2_opts.multiple && _.indexOf(selectedValues, opt.value) > -1
          }, self.defaults.opt);
          $select.append(self.template(opt));
        }
      }

      if (col && _.has(col.disabled)) {
        _.extend(select2_opts, {
          disabled: evalF(col.disabled, col, model)
        });
      } else {
        _.extend(select2_opts, { disabled: !editable });
      }

      this.delegateEvents();

      // If disabled then no need to show placeholder
      if (!editable || col.mode === 'properties') {
        select2_opts['placeholder'] = '';
      }

      // Initialize select2 control.
      this.$sel = this.$select.select2(select2_opts);

      // Select the highlighted item on Tab press.
      if (this.$sel) {
        this.$sel.data('select2').on("keypress", function (ev) {
          var self = this;

          // keycode 9 is for TAB key
          if (ev.which === 9 && self.isOpen()) {
            self.trigger('results:select', {});
            ev.preventDefault();
          }
        });
      }

      return this;
    },

    /**
       Saves the value of the selected option to the model attribute.
    */
    onSave: function onSave(e) {
      var model = this.model;
      var column = this.column;

      model.set(column.get("name"), this.$select.val());
    },

    remove: function remove() {
      this.$select.off('change', this.onSave);
      if (this.$select.data('select2')) {
        this.$select.select2('destroy');
      }
      this.$el.empty();
      Backgrid.SelectCell.prototype.remove.apply(this, arguments);
    }
  });

  /**
    TextareaCellEditor the cell editor renders a textarea multi-line text input
    box as its editor.
     @class Backgrid.TextareaCellEditor
    @extends Backgrid.InputCellEditor
  */
  var TextareaCellEditor = Backgrid.TextareaCellEditor = Backgrid.InputCellEditor.extend({
    /** @property */
    tagName: "textarea",

    events: {
      "blur": "saveOrCancel",
      "keydown": ""
    }
  });

  /**
    TextareaCell displays multiline HTML strings.
       @class Backgrid.Extension.TextareaCell
      @extends Backgrid.Cell
  */
  var TextareaCell = Backgrid.Extension.TextareaCell = Backgrid.Cell.extend({
    /** @property */
    className: "textarea-cell",

    editor: TextareaCellEditor
  });

  /**
   * Custom header icon cell to add the icon in table header.
  */
  var CustomHeaderIconCell = Backgrid.Extension.CustomHeaderIconCell = Backgrid.HeaderCell.extend({
    /** @property */
    className: "header-icon-cell",
    events: {
      "click": "addHeaderIcon"
    },
    addHeaderIcon: function addHeaderIcon(e) {
      var self = this,
          m = new this.collection.model();
      this.collection.add(m);
      e.preventDefault();
    },
    render: function render() {
      this.$el.empty();
      //this.$el.html("<i class='fa fa-plus-circle'></i>");
      this.$el.html("<label><a><span style='font-weight:normal;'>Array Values</a></span></label> <button class='btn-sm btn-default add'>Add</button>");
      this.delegateEvents();
      return this;
    }
  });

  var arrayCellModel = Backbone.Model.extend({
    defaults: {
      value: undefined
    }
  });

  /**
     Custom InputArrayCellEditor for editing user input array for debugger.
   */
  var InputArrayCellEditor = Backgrid.Extension.InputArrayCellEditor = Backgrid.CellEditor.extend({
    tagName: "div",

    events: {
      'blur': 'lostFocus'
    },

    render: function render() {
      var self = this,
          arrayValuesCol = this.model.get(this.column.get("name")),
          tbl = $("<table></table>").appendTo(this.$el),
          gridCols = [{ name: 'value', label: 'Array Values', type: 'text', cell: 'string', headerCell: Backgrid.Extension.CustomHeaderIconCell, cellHeaderClasses: 'width_percent_100' }],
          gridBody = $("<div class='pgadmin-control-group backgrid form-group col-xs-12 object subnode'></div>");

      this.$el.attr('tabindex', '1');

      gridCols.unshift({
        name: "pg-backform-delete", label: "",
        cell: Backgrid.Extension.DeleteCell,
        //headerCell: Backgrid.Extension.CustomHeaderIconCell,
        editable: false, cell_priority: -1
      });

      this.$el.empty();
      var grid = self.grid = new Backgrid.Grid({
        columns: gridCols,
        collection: arrayValuesCol
      });

      grid.render();

      gridBody.append(grid.$el);

      this.$el.html(gridBody);

      $(self.$el).pgMakeVisible('backform-tab');
      self.delegateEvents();

      return this;
    },

    /*
     * Call back function when the grid lost the focus
     */
    lostFocus: function lostFocus(ev) {

      var self = this,

      /*
       * Function to determine whether one dom element is descendant of another
       * dom element.
       */
      isDescendant = function isDescendant(parent, child) {
        var node = child.parentNode;
        while (node != null) {
          if (node == parent) {
            return true;
          }
          node = node.parentNode;
        }
        return false;
      };
      /*
       * Between leaving the old element focus and entering the new element focus the
       * active element is the document/body itself so add timeout to get the proper
       * focused active element.
       */
      setTimeout(function () {
        if (self.$el[0] != document.activeElement && !isDescendant(self.$el[0], document.activeElement)) {
          var m = self.model,
              column = self.column;
          m.trigger('backgrid:edited', m, column, new Backgrid.Command(ev));

          setTimeout(function () {
            if (self.grid) {
              self.grid.remove();
              self.grid = null;
            }
          }, 10);
        }
      }, 10);
      return;
    }
  });

  /*
   * This will help us transform the user input string array values in proper format to be
   * displayed in the cell.
   */
  var InputStringArrayCellFormatter = Backgrid.Extension.InputStringArrayCellFormatter = function () {};
  _.extend(InputStringArrayCellFormatter.prototype, {
    /**
     * Takes a raw value from a model and returns an optionally formatted
     * string for display.
     */
    fromRaw: function fromRaw(rawData, model) {
      var values = [];
      rawData.each(function (m) {
        var val = m.get('value');
        if (_.isUndefined(val)) {
          values.push("null");
        } else {
          values.push(m.get("value"));
        }
      });
      return values.toString();
    },
    toRaw: function toRaw(formattedData, model) {
      return formattedData;
    }
  });

  /*
   * This will help us transform the user input integer array values in proper format to be
   * displayed in the cell.
   */
  var InputIntegerArrayCellFormatter = Backgrid.Extension.InputIntegerArrayCellFormatter = function () {};
  _.extend(InputIntegerArrayCellFormatter.prototype, {
    /**
     * Takes a raw value from a model and returns an optionally formatted
     * string for display.
     */
    fromRaw: function fromRaw(rawData, model) {
      var values = [];
      rawData.each(function (m) {
        var val = m.get('value');
        if (_.isUndefined(val)) {
          values.push("null");
        } else {
          values.push(m.get("value"));
        }
      });
      return values.toString();
    },
    toRaw: function toRaw(formattedData, model) {
      formattedData.each(function (m) {
        m.set("value", parseInt(m.get('value')), { silent: true });
      });

      return formattedData;
    }
  });

  /*
   *  InputStringArrayCell for rendering and taking input for string array type in debugger
   */
  var InputStringArrayCell = Backgrid.Extension.InputStringArrayCell = Backgrid.Cell.extend({
    className: "width_percent_25",
    formatter: InputStringArrayCellFormatter,
    editor: InputArrayCellEditor,

    initialize: function initialize() {
      Backgrid.Cell.prototype.initialize.apply(this, arguments);
      // set value to empty array.
      var m = arguments[0].model;
      if (_.isUndefined(this.collection)) {
        this.collection = new (Backbone.Collection.extend({
          model: arrayCellModel }))(m.get('value'));
      }

      this.model.set(this.column.get('name'), this.collection);

      this.listenTo(this.collection, "remove", this.render);
    }
  });

  /*
   *  InputIntegerArrayCell for rendering and taking input for integer array type in debugger
   */
  var InputIntegerArrayCell = Backgrid.Extension.InputIntegerArrayCell = Backgrid.Cell.extend({
    className: "width_percent_25",
    formatter: InputIntegerArrayCellFormatter,
    editor: InputArrayCellEditor,

    initialize: function initialize() {
      Backgrid.Cell.prototype.initialize.apply(this, arguments);
      // set value to empty array.
      var m = arguments[0].model;
      if (_.isUndefined(this.collection)) {
        this.collection = new (Backbone.Collection.extend({
          model: arrayCellModel }))(m.get('value'));
      }

      this.model.set(this.column.get('name'), this.collection);

      this.listenTo(this.collection, "remove", this.render);
    }
  });

  /**
   * DependentCell functions can be used with the different cell type in order
   * to setup the callback for the depedent attribute change in the model.
   *
   * Please implement the 'dependentChanged' as the callback in the used cell.
   *
   * @class Backgrid.Extension.DependentCell
   **/
  var DependentCell = Backgrid.Extension.DependentCell = function () {};

  _.extend(DependentCell.prototype, {
    initialize: function initialize() {
      // Listen to the dependent fields in the model for any change
      var deps = this.column.get('deps');
      var self = this;

      if (deps && _.isArray(deps)) {
        _.each(deps, function (d) {
          var attrArr = d.split('.'),
              name = attrArr.shift();
          self.listenTo(self.model, "change:" + name, self.dependentChanged);
        });
      }
    },
    remove: function remove() {
      // Remove the events for the dependent fields in the model
      var self = this,
          deps = self.column.get('deps');

      if (deps && _.isArray(deps)) {
        _.each(deps, function (d) {
          var attrArr = d.split('.'),
              name = attrArr.shift();

          self.stopListening(self.model, "change:" + name, self.dependentChanged);
        });
      }
    }
  });

  /**
   Formatter for PasswordCell.
    @class Backgrid.PasswordFormatter
   @extends Backgrid.CellFormatter
   @constructor
  */
  var PasswordFormatter = Backgrid.PasswordFormatter = function () {};
  PasswordFormatter.prototype = new Backgrid.CellFormatter();
  _.extend(PasswordFormatter.prototype, {
    fromRaw: function fromRaw(rawValue, model) {

      if (_.isUndefined(rawValue) || _.isNull(rawValue)) return '';

      var pass = '';
      for (var i = 0; i < rawValue.length; i++) {
        pass += '*';
      }
      return pass;
    }
  });

  var PasswordCell = Backgrid.Extension.PasswordCell = Backgrid.StringCell.extend({

    formatter: PasswordFormatter,

    editor: Backgrid.InputCellEditor.extend({
      attributes: {
        type: "password"
      },

      render: function render() {
        var model = this.model;
        this.$el.val(model.get(this.column.get("name")));
        return this;
      }
    })
  });

  /*
   * Override NumberFormatter to support NaN, Infinity values.
   * On client side, JSON do not directly support NaN & Infinity,
   * we explicitly converted it into string format at server side
   * and we need to parse it again in float at client side.
   */
  _.extend(Backgrid.NumberFormatter.prototype, {
    fromRaw: function fromRaw(number, model) {
      if (_.isNull(number) || _.isUndefined(number)) return '';

      number = parseFloat(number).toFixed(~~this.decimals);

      var parts = number.split('.');
      var integerPart = parts[0];
      var decimalPart = parts[1] ? (this.decimalSeparator || '.') + parts[1] : '';

      return integerPart.replace(this.HUMANIZED_NUM_RE, '$1' + this.orderSeparator) + decimalPart;
    }
  });

  /*
   *  JSONBCell Formatter.
   */
  var JSONBCellFormatter = Backgrid.Extension.JSONBCellFormatter = function () {};
  _.extend(JSONBCellFormatter.prototype, {
    fromRaw: function fromRaw(rawData, model) {
      // json data
      if (_.isArray(rawData)) {
        var converted_data = '';
        converted_data = _.map(rawData, function (data) {
          return JSON.stringify(JSON.stringify(data));
        });
        return '{' + converted_data.join() + '}';
      } else if (_.isObject(rawData)) {
        return JSON.stringify(rawData);
      } else {
        return rawData;
      }
    },
    toRaw: function toRaw(formattedData, model) {
      return formattedData;
    }
  });

  /*
   *  JSONBCell for backgrid.
   */
  var JSONBCell = Backgrid.Extension.JSONBCell = Backgrid.StringCell.extend({
    className: "jsonb-cell",
    formatter: JSONBCellFormatter
  });

  var DatepickerCell = Backgrid.Extension.DatepickerCell = Backgrid.Cell.extend({
    editor: DatepickerCellEditor
  });

  var DatepickerCellEditor = Backgrid.InputCellEditor.extend({
    events: {},
    initialize: function initialize() {
      Backgrid.InputCellEditor.prototype.initialize.apply(this, arguments);
      var input = this;
      $(this.el).prop('readonly', true);
      $(this.el).datepicker({
        onClose: function onClose(newValue) {
          var command = new Backgrid.Command({});
          input.model.set(input.column.get("name"), newValue);
          input.model.trigger("backgrid:edited", input.model, input.column, command);
          command = input = null;
        }
      });
    }
  });

  // Reference:
  // https://github.com/wyuenho/backgrid-moment-cell/blob/master/backgrid-moment-cell.js
  /**
   MomentFormatter converts bi-directionally any datetime values in any format
   supported by [moment()](http://momentjs.com/docs/#/parsing/) to any
   datetime format
   [moment.fn.format()](http://momentjs.com/docs/#/displaying/format/)
   supports.
   @class Backgrid.Extension.MomentFormatter
   @extends Backgrid.CellFormatter
   @constructor
   */
  var MomentFormatter = Backgrid.Extension.MomentFormatter = function (options) {
    _.extend(this, this.defaults, options);
  };

  MomentFormatter.prototype = new Backgrid.CellFormatter();
  _.extend(MomentFormatter.prototype, {
    /**
       @cfg {Object} options
       @cfg {boolean} [options.modelInUnixOffset=false] Whether the model values
       should be read/written as the number of milliseconds since UNIX Epoch.
       @cfg {boolean} [options.modelInUnixTimestamp=false] Whether the model
       values should be read/written as the number of seconds since UNIX Epoch.
       @cfg {boolean} [options.modelInUTC=true] Whether the model values should
       be read/written in UTC mode or local mode.
       @cfg {string} [options.modelLang=moment.locale() moment>=2.8.0 |
       moment.lang() moment<2.8.0] The locale the model values should be
       read/written in.
       @cfg {string} [options.modelFormat=moment.defaultFormat] The format this
       moment formatter should use to read/write model values. Only meaningful if
       the values are strings.
       @cfg {boolean} [options.displayInUnixOffset=false] Whether the display
       values should be read/written as the number of milliseconds since UNIX
       Epoch.
       @cfg {boolean} [options.displayInUnixTimestamp=false] Whether the display
       values should be read/written as the number of seconds since UNIX Epoch.
       @cfg {boolean} [options.displayInUTC=true] Whether the display values
       should be read/written in UTC mode or local mode.
       @cfg {string} [options.displayLang=moment.locale() moment>=2.8.0 |
       moment.lang() moment<2.8.0] The locale the display values should be
       read/written in.
       @cfg {string} [options.displayFormat=moment.defaultFormat] The format
       this moment formatter should use to read/write dislay values.
       */
    defaults: {
      modelInUnixOffset: false,
      modelInUnixTimestamp: false,
      modelInUTC: true,
      modelLang: moment.locale(),
      modelFormat: moment.defaultFormat,
      displayInUnixOffset: false,
      displayInUnixTimestamp: false,
      displayInUTC: true,
      displayLang: moment.locale(),
      displayFormat: moment.defaultFormat,
      allowEmpty: false
    },

    /**
       Converts datetime values from the model for display.
       @member Backgrid.Extension.MomentFormatter
       @param {*} rawData
       @return {string}
       */
    fromRaw: function fromRaw(rawData) {
      if (rawData == null) return '';

      var m = this.modelInUnixOffset ? moment(rawData) : this.modelInUnixTimestamp ? moment.unix(rawData) : this.modelInUTC ? moment.utc(rawData, this.modelFormat, this.modelLang) : moment(rawData, this.modelFormat, this.modelLang);

      if (this.displayInUnixOffset) return +m;

      if (this.displayInUnixTimestamp) return m.unix();

      if (this.displayLang) m.locale(this.displayLang);

      if (this.displayInUTC) m.utc();else m.local();

      if (this.displayFormat != moment.defaultFormat) {
        return m.format(this.displayFormat);
      }

      return m.format();
    },

    /**
       Converts datetime values from user input to model values.
       @member Backgrid.Extension.MomentFormatter
       @param {string} formattedData
       @return {string}
       */
    toRaw: function toRaw(formattedData) {

      var m = this.displayInUnixOffset ? moment(+formattedData) : this.displayInUnixTimestamp ? moment.unix(+formattedData) : this.displayInUTC ? moment.utc(formattedData, this.displayFormat, this.displayLang) : moment(formattedData, this.displayFormat, this.displayLang);

      if (!m || !m.isValid()) return this.allowEmpty && formattedData === '' ? null : undefined;

      if (this.modelInUnixOffset) return +m;

      if (this.modelInUnixTimestamp) return m.unix();

      if (this.modelLang) m.locale(this.modelLang);

      if (this.modelInUTC) m.utc();else m.local();

      if (this.modelFormat != moment.defaultFormat) {
        return m.format(this.modelFormat);
      }

      return m.format();
    }
  });

  var MomentCell = Backgrid.Extension.MomentCell = Backgrid.Cell.extend({

    editor: Backgrid.InputCellEditor,

    /** @property */
    className: "datetime-cell",

    /** @property {Backgrid.CellFormatter} [formatter=Backgrid.Extension.MomentFormatter] */
    formatter: MomentFormatter,

    /**
       Initializer. Accept Backgrid.Extension.MomentFormatter.options and
       Backgrid.Cell.initialize required parameters.
     */
    initialize: function initialize(options) {

      MomentCell.__super__.initialize.apply(this, arguments);

      var formatterDefaults = MomentFormatter.prototype.defaults;
      var formatterDefaultKeys = _.keys(formatterDefaults);
      var classAttrs = _.pick(this, formatterDefaultKeys);
      var formatterOptions = _.pick(options, formatterDefaultKeys);
      var columnsAttrs = _.pick(this.column.toJSON(), formatterDefaultKeys);

      // Priority of the options for the formatter, from highest to lowerest
      // 1. MomentCell instance options
      // 2. MomentCell class attributes
      // 3. MomentFormatter defaults

      // this.formatter will have been instantiated now
      _.extend(this.formatter, formatterDefaults, classAttrs, formatterOptions, columnsAttrs);

      this.editor = this.editor.extend({
        attributes: _.extend({}, this.editor.prototype.attributes || this.editor.attributes || {}, {
          placeholder: this.formatter.displayFormat
        }),
        options: this.column.get('options')
      });
    }
  });

  var DatetimePickerEditor = Backgrid.Extension.DatetimePickerEditor = Backgrid.InputCellEditor.extend({
    postRender: function postRender() {
      var self = this,
          evalF = function evalF() {
        var args = [];
        Array.prototype.push.apply(args, arguments);
        var f = args.shift();

        if (typeof f === 'function') {
          return f.apply(self, args);
        }
        return f;
      },
          options = _.extend({
        format: "YYYY-MM-DD HH:mm:ss Z",
        showClear: true,
        showTodayButton: true,
        toolbarPlacement: 'top'
      }, evalF(this.column.get('options')), {
        keyBinds: {
          "shift tab": function shiftTab(widget) {
            if (widget) {
              // blur the input
              setTimeout(function () {
                self.closeIt({ keyCode: 9, shiftKey: true });
              }, 10);
            }
          },
          tab: function tab(widget) {
            if (widget) {
              // blur the input
              setTimeout(function () {
                self.closeIt({ keyCode: 9 });
              }, 10);
            }
          }
        }
      });
      this.$el.datetimepicker(options);
      this.$el.datetimepicker('show');
      this.picker = this.$el.data('DateTimePicker');
    },
    events: {
      'dp.hide': 'closeIt'
    },
    closeIt: function closeIt(ev) {
      var formatter = this.formatter,
          model = this.model,
          column = this.column,
          val = this.$el.val(),
          newValue = formatter.toRaw(val, model);

      if (this.is_closing) return;
      this.is_closing = true;
      this.$el.datetimepicker('destroy');
      this.is_closing = false;

      var command = new Backgrid.Command(ev);

      if (_.isUndefined(newValue)) {
        model.trigger("backgrid:error", model, column, val);
      } else {
        model.set(column.get("name"), newValue);
        model.trigger("backgrid:edited", model, column, command);
      }
    }
  });

  _.extend(MomentCell.prototype, MomentFormatter.prototype.defaults);

  Backgrid.Extension.StringDepCell = Backgrid.StringCell.extend({
    initialize: function initialize() {
      Backgrid.StringCell.prototype.initialize.apply(this, arguments);
      Backgrid.Extension.DependentCell.prototype.initialize.apply(this, arguments);
    },
    dependentChanged: function dependentChanged() {
      this.$el.empty();

      var self = this,
          model = this.model,
          column = this.column,
          editable = this.column.get("editable");

      this.render();

      var is_editable = _.isFunction(editable) ? !!editable.apply(column, [model]) : !!editable;
      setTimeout(function () {
        self.$el.removeClass("editor");
        if (is_editable) {
          self.$el.addClass("editable");
        } else {
          self.$el.removeClass("editable");
        }
      }, 10);

      this.delegateEvents();
      return this;
    },
    remove: Backgrid.Extension.DependentCell.prototype.remove
  });

  Backgrid.Extension.Select2DepCell = Backgrid.Extension.Select2Cell.extend({
    initialize: function initialize() {
      Backgrid.Extension.Select2Cell.prototype.initialize.apply(this, arguments);
      Backgrid.Extension.DependentCell.prototype.initialize.apply(this, arguments);
    },

    dependentChanged: function dependentChanged() {
      var model = this.model;
      var column = this.column;
      editable = this.column.get("editable");

      this.render();

      is_editable = _.isFunction(editable) ? !!editable.apply(column, [model]) : !!editable;
      if (is_editable) {
        this.$el.addClass("editable");
      } else {
        this.$el.removeClass("editable");
      }

      this.delegateEvents();
      return this;
    },
    remove: Backgrid.Extension.DependentCell.prototype.remove
  });

  return Backgrid;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(0), __webpack_require__(1), __webpack_require__(4), __webpack_require__(3), __webpack_require__(189), __webpack_require__(10), __webpack_require__(17), __webpack_require__(252), __webpack_require__(16), __webpack_require__(97), __webpack_require__(77), __webpack_require__(24)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, $, _, S, pgAdmin, Menu, Backbone, Alertify, pgBrowser, Backform, generateUrl) {

  var wcDocker = window.wcDocker,
      keyCode = {
    ENTER: 13,
    ESCAPE: 27,
    F1: 112
  };

  // It has already been defined.
  // Avoid running this script again.
  if (pgBrowser.Node) return pgBrowser.Node;

  pgBrowser.Nodes = pgBrowser.Nodes || {};

  // A helper (base) class for all the nodes, this has basic
  // operations/callbacks defined for basic operation.
  pgBrowser.Node = function () {};

  // Helper function to correctly set up the property chain, for subclasses.
  // Uses a hash of class properties to be extended.
  //
  // It is unlikely - we will instantiate an object for this class.
  // (Inspired by Backbone.extend function)
  pgBrowser.Node.extend = function (props) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is defined to simply call
    // the parent's constructor.
    child = function child() {
      return parent.apply(this, arguments);
    };

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, _.omit(props, 'callbacks'));

    // Make sure - a child have all the callbacks of the parent.
    child.callbacks = _.extend({}, parent.callbacks, props.callbacks);

    var bindToChild = function bindToChild(cb) {
      if (typeof child.callbacks[cb] == 'function') {
        child.callbacks[cb] = child.callbacks[cb].bind(child);
      }
    },
        callbacks = _.keys(child.callbacks);
    for (var idx = 0; idx < callbacks.length; idx++) {
      bindToChild(callbacks[idx]);
    } // Registering the node by calling child.Init(...) function
    child.Init.apply(child);

    // Initialize the parent
    this.Init.apply(child);

    return child;
  };

  _.extend(pgAdmin.Browser.Node, Backbone.Events, {
    // Node type
    type: undefined,
    // Label
    label: '',
    // Help pages
    sqlAlterHelp: '',
    sqlCreateHelp: '',
    dialogHelp: '',

    title: function title(o, d) {
      return o.label + (d ? ' - ' + d.label : '');
    },
    hasId: true,
    ///////
    // Initialization function
    // Generally - used to register the menus for this type of node.
    //
    // Also, look at pgAdmin.Browser.add_menus(...) function.
    //
    // NOTE: Override this for each node for initialization purpose
    Init: function Init() {
      var self = this;
      if (self.node_initialized) return;
      self.node_initialized = true;

      pgAdmin.Browser.add_menus([{
        name: 'refresh', node: self.type, module: self,
        applies: ['object', 'context'], callback: 'refresh',
        priority: 1, label: gettext('Refresh...'),
        icon: 'fa fa-refresh'
      }]);

      if (self.canEdit) {
        pgAdmin.Browser.add_menus([{
          name: 'show_obj_properties', node: self.type, module: self,
          applies: ['object', 'context'], callback: 'show_obj_properties',
          priority: 999, label: gettext('Properties...'),
          data: { 'action': 'edit' }, icon: 'fa fa-pencil-square-o'
        }]);
      }

      if (self.canDrop) {
        pgAdmin.Browser.add_menus([{
          name: 'delete_object', node: self.type, module: self,
          applies: ['object', 'context'], callback: 'delete_obj',
          priority: 2, label: gettext('Delete/Drop'),
          data: { 'url': 'drop' }, icon: 'fa fa-trash',
          enable: _.isFunction(self.canDrop) ? function () {
            return !!self.canDrop.apply(self, arguments);
          } : !!self.canDrop
        }]);
        if (self.canDropCascade) {
          pgAdmin.Browser.add_menus([{
            name: 'delete_object_cascade', node: self.type, module: self,
            applies: ['object', 'context'], callback: 'delete_obj',
            priority: 3, label: gettext('Drop Cascade'),
            data: { 'url': 'delete' }, icon: 'fa fa-trash',
            enable: _.isFunction(self.canDropCascade) ? function () {
              return self.canDropCascade.apply(self, arguments);
            } : !!self.canDropCascade
          }]);
        }
      }

      // show query tool only in context menu of supported nodes.
      if (true) {
        if (_.indexOf(pgAdmin.unsupported_nodes, self.type) == -1) {
          pgAdmin.Browser.add_menus([{
            name: 'show_query_tool', node: self.type, module: self,
            applies: ['context'], callback: 'show_query_tool',
            priority: 998, label: gettext('Query Tool...'),
            icon: 'fa fa-bolt',
            enable: function enable(itemData, item, data) {
              if (itemData._type == 'database' && itemData.allowConn) return true;else if (itemData._type != 'database') return true;else return false;
            }
          }]);
        }
      }

      // This will add options of scripts eg:'CREATE Script'
      if (self.hasScriptTypes && _.isArray(self.hasScriptTypes) && self.hasScriptTypes.length > 0) {
        // For each script type create menu
        _.each(self.hasScriptTypes, function (stype) {

          var type_label = S(gettext("%s Script")).sprintf(stype.toUpperCase()).value(),
              stype = stype.toLowerCase();

          // Adding menu for each script type
          pgAdmin.Browser.add_menus([{
            name: 'show_script_' + stype, node: self.type, module: self,
            applies: ['object', 'context'], callback: 'show_script',
            priority: 4, label: type_label, category: 'Scripts',
            data: { 'script': stype }, icon: 'fa fa-pencil',
            enable: self.check_user_permission
          }]);
        });
      }
    },
    ///////
    // Checks if Script Type is allowed to user
    // First check if role node & create role allowed
    // Otherwise test rest of database objects
    // if no permission matched then do not allow create script
    ///////
    check_user_permission: function check_user_permission(itemData, item, data) {
      // Do not display CREATE script on server group and server node
      if (itemData._type == 'server_group' || itemData._type == 'server') {
        return false;
      }

      // Do not display the menu if the database connection is not allowed
      if (itemData._type == 'database' && !itemData.allowConn) return false;

      var node = pgBrowser.Nodes[itemData._type],
          parentData = node.getTreeNodeHierarchy(item);
      if (_.indexOf(['create', 'insert', 'update', 'delete'], data.script) != -1) {
        if (itemData.type == 'role' && parentData.server.user.can_create_role) {
          return true;
        } else if (parentData.server && (parentData.server.user.is_superuser || parentData.server.user.can_create_db) || parentData.schema && parentData.schema.can_create) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    ///////
    // Generate a Backform view using the node's model type
    //
    // Used to generate view for the particular node properties, edit,
    // creation.
    getView: function getView(item, type, el, node, formType, callback, ctx, cancelFunc) {
      var that = this;

      if (!this.type || this.type == '')
        // We have no information, how to generate view for this type.
        return null;

      if (this.model) {
        // This will be the URL, used for object manipulation.
        // i.e. Create, Update in these cases
        var urlBase = this.generate_url(item, type, node, false);

        if (!urlBase)
          // Ashamed of myself, I don't know how to manipulate this
          // node.
          return null;

        var attrs = {};

        // In order to get the object data from the server, we must set
        // object-id in the model (except in the create mode).
        if (type !== 'create') {
          attrs[this.model.idAttribute || this.model.prototype.idAttribute || 'id'] = node._id;
        }

        // We know - which data model to be used for this object.
        var info = this.getTreeNodeHierarchy.apply(this, [item]),
            newModel = new (this.model.extend({ urlRoot: urlBase }))(attrs, { node_info: info }),
            fields = Backform.generateViewSchema(info, newModel, type, this, node);

        if (type == 'create' || type == 'edit') {

          if (callback && ctx) {
            callback = callback.bind(ctx);
          } else {
            callback = function callback() {
              console.log("Broke something!!! Why we don't have the callback or the context???");
            };
          }

          var onSessionInvalid = function onSessionInvalid(msg) {
            var alertMessage = '\
              <div class="media error-in-footer bg-red-1 border-red-2 font-red-3 text-14">\
                <div class="media-body media-middle">\
                  <div class="alert-icon error-icon">\
                    <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>\
                  </div>\
                    <div class="alert-text">' + msg + '</div>\
                </div>\
              </div>';
            if (!_.isUndefined(that.statusBar)) {
              that.statusBar.html(alertMessage).css("visibility", "visible");
            }
            callback(true);

            return true;
          };

          var onSessionValidated = function onSessionValidated(sessHasChanged) {

            if (!_.isUndefined(that.statusBar)) {
              that.statusBar.empty().css("visibility", "hidden");
            }

            callback(false, sessHasChanged);
          };

          callback(false, false);

          newModel.on('pgadmin-session:valid', onSessionValidated);
          newModel.on('pgadmin-session:invalid', onSessionInvalid);
        }
        // 'schema' has the information about how to generate the form.
        if (_.size(fields)) {
          // This will contain the actual view
          var view;

          if (formType == 'fieldset') {
            // It is used to show, edit, create the object in the
            // properties tab.
            view = new Backform.Fieldset({
              el: el, model: newModel, schema: fields
            });
          } else {
            // This generates a view to be used by the node dialog
            // (for create/edit operation).
            view = new Backform.Dialog({
              el: el, model: newModel, schema: fields
            });
          }

          var setFocusOnEl = function setFocusOnEl() {
            setTimeout(function () {
              $(el).find('.tab-pane.active:first').find('input:first').focus();
            }, 500);
          };

          if (!newModel.isNew()) {
            // This is definetely not in create mode
            var msgDiv = '<div class="alert alert-info pg-panel-message pg-panel-properties-message">' + gettext("Retrieving data from the server...") + '</div>',
                $msgDiv = $(msgDiv);
            var timer = setTimeout(function (ctx) {
              // notify user if request is taking longer than 1 second

              if (!_.isUndefined(ctx)) {
                $msgDiv.appendTo(ctx);
              }
            }, 1000, ctx);

            newModel.fetch({
              success: function success(res, msg, xhr) {
                // clear timeout and remove message
                clearTimeout(timer);
                $msgDiv.addClass('hidden');

                // We got the latest attributes of the
                // object. Render the view now.
                view.render();
                setFocusOnEl();
                newModel.startNewSession();
              },
              error: function error(xhr, _error, message) {
                var _label = that && item ? that.getTreeNodeHierarchy(item)[that.type].label : '';
                pgBrowser.Events.trigger('pgadmin:node:retrieval:error', 'properties', xhr, _error, message, item);
                if (!Alertify.pgHandleItemError(xhr, _error, message, { item: item, info: info })) {
                  Alertify.pgNotifier(_error, xhr, S(gettext("Error retrieving properties - %s")).sprintf(message || _label).value(), function () {
                    console.log(arguments);
                  });
                }
                // Close the panel (if could not fetch properties)
                if (cancelFunc) {
                  cancelFunc();
                }
              }
            });
          } else {
            // Yay - render the view now!
            // $(el).focus();
            view.render();
            setFocusOnEl();
            newModel.startNewSession();
          }
        }
        return view;
      }

      return null;
    },
    register_node_panel: function register_node_panel() {
      var w = pgBrowser.docker,
          p = w.findPanels('node_props');

      if (p && p.length == 1) return;

      var events = {};
      events[wcDocker.EVENT.RESIZE_ENDED] = function () {
        var $container = this.$container.find('.obj_properties').first(),
            v = $container.data('obj-view');

        if (v && v.model && v.model) {
          v.model.trigger('pg-browser-resized', {
            'view': v, 'panel': this, 'container': $container
          });
        }
      };

      p = new pgBrowser.Panel({
        name: 'node_props',
        showTitle: true,
        isCloseable: true,
        isPrivate: true,
        elContainer: true,
        content: '<div class="obj_properties"><div class="alert alert-info pg-panel-message">' + gettext('Please wait while we fetch information about the node from the server!') + '</div></div>',
        onCreate: function onCreate(myPanel, $container) {
          $container.addClass('pg-no-overflow');
        },
        events: events
      });
      p.load(pgBrowser.docker);
    },
    /*
     * Default script type menu for node.
     *
     * Override this, to show more script type menus (e.g hasScriptTypes: ['create', 'select', 'insert', 'update', 'delete'])
     *
     * Or set it to empty array to disable script type menu on node (e.g hasScriptTypes: [])
     */
    hasScriptTypes: ['create'],
    /******************************************************************
     * This function determines the given item is editable or not.
     *
     * Override this, when a node is not editable.
     */
    canEdit: true,
    /******************************************************************
     * This function determines the given item is deletable or not.
     *
     * Override this, when a node is not deletable.
     */
    canDrop: false,
    /************************************************************************
     * This function determines the given item and children are deletable or
     * not.
     *
     * Override this, when a node is not deletable.
     */
    canDropCascade: false,
    // List of common callbacks - that can be used for different
    // operations!
    callbacks: {
      /******************************************************************
       * This function allows to create/edit/show properties of any
       * object depending on the arguments provided.
       *
       * args must be a object containing:
       *   action - create/edit/properties
       *   item   - The properties of the item (tree ndoe item)
       *
       * NOTE:
       * if item is not provided, the action will be done on the
       * currently selected tree item node.
       *
       **/
      show_obj_properties: function show_obj_properties(args, item) {
        var t = pgBrowser.tree,
            i = args.item || item || t.selected(),
            d = i && i.length == 1 ? t.itemData(i) : undefined,
            o = this,
            l = o.title.apply(this, [d]);

        // Make sure - the properties dialog type registered
        pgBrowser.Node.register_node_panel();

        // No node selected.
        if (!d) return;

        var self = this,
            isParent = _.isArray(this.parent_type) ? function (d) {
          return _.indexOf(self.parent_type, d._type) != -1;
        } : function (d) {
          return self.parent_type == d._type;
        },
            addPanel = function addPanel() {
          var d = window.document,
              b = d.body,
              el = d.createElement('div');

          d.body.insertBefore(el, d.body.firstChild);

          var pW = screen.width < 800 ? '95%' : '500px',
              pH = screen.height < 600 ? '95%' : '550px',
              w = pgAdmin.toPx(el, self.width || pW, 'width', true),
              h = pgAdmin.toPx(el, self.height || pH, 'height', true),
              x = (b.offsetWidth - w) / 2,
              y = (b.offsetHeight - h) / 2;

          var p = pgBrowser.docker.addPanel('node_props', wcDocker.DOCK.FLOAT, undefined, { w: w + 'px', h: h + 'px', x: x + 'px', y: y + 'px' });

          b.removeChild(el);
          // delete(el);

          return p;
        };

        if (args.action == 'create') {
          // If we've parent, we will get the information of it for
          // proper object manipulation.
          //
          // You know - we're working with RDBMS, relation is everything
          // for us.
          if (self.parent_type && !isParent(d)) {
            // In browser tree, I can be under any node, But - that
            // does not mean, it is my parent.
            //
            // We have some group nodes too.
            //
            // i.e.
            // Tables, Views, etc. nodes under Schema node
            //
            // And, actual parent of a table is schema, not Tables.
            while (i && t.hasParent(i)) {
              i = t.parent(i);
              var pd = t.itemData(i);

              if (isParent(pd)) {
                // Assign the data, this is my actual parent.
                d = pd;
                break;
              }
            }
          }

          // Seriously - I really don't have parent data present?
          //
          // The only node - which I know - who does not have parent
          // node, is the Server Group (and, comes directly under root
          // node - which has no parent.)
          if (!d || this.parent_type != null && !isParent(d)) {
            // It should never come here.
            // If it is here, that means - we do have some bug in code.
            return;
          }

          if (!d) return;

          l = S(gettext('Create - %s')).sprintf([this.label]).value();
          p = addPanel();

          setTimeout(function () {
            o.showProperties(i, d, p, args.action);
          }, 10);
        } else {
          if (pgBrowser.Node.panels && pgBrowser.Node.panels[d.id] && pgBrowser.Node.panels[d.id].$container) {
            var p = pgBrowser.Node.panels[d.id];
            /**  TODO ::
             *  Run in edit mode (if asked) only when it is
             *  not already been running edit mode
             **/
            var mode = p.$container.attr('action-mode');
            if (mode) {
              var msg = gettext('Are you sure want to stop editing the properties of %s "%s"?');
              if (args.action == 'edit') {
                msg = gettext('Are you sure want to reset the current changes and re-open the panel for %s "%s"?');
              }

              Alertify.confirm(gettext('Edit in progress?'), S(msg).sprintf(o.label.toLowerCase(), d.label).value(), function () {
                setTimeout(function () {
                  o.showProperties(i, d, p, args.action);
                }, 10);
              }, null).show();
            } else {
              setTimeout(function () {
                o.showProperties(i, d, p, args.action);
              }, 10);
            }
          } else {
            pgBrowser.Node.panels = pgBrowser.Node.panels || {};
            p = pgBrowser.Node.panels[d.id] = addPanel();

            setTimeout(function () {
              o.showProperties(i, d, p, args.action);
            }, 10);
          }
        }

        p.title(l);
        p.icon('icon-' + this.type);

        // Make sure the properties dialog is visible
        p.focus();
      },
      // Delete the selected object
      delete_obj: function delete_obj(args, item) {
        var input = args || { 'url': 'drop' },
            obj = this,
            t = pgBrowser.tree,
            i = input.item || item || t.selected(),
            d = i && i.length == 1 ? t.itemData(i) : undefined;

        if (!d) return;

        /*
         * Make sure - we're using the correct version of node
         */
        obj = pgBrowser.Nodes[d._type];
        var objName = d.label;

        var msg, title;
        if (input.url == 'delete') {

          msg = S(gettext('Are you sure you want to drop %s "%s" and all the objects that depend on it?')).sprintf(obj.label.toLowerCase(), d.label).value();
          title = S(gettext('DROP CASCADE %s?')).sprintf(obj.label).value();

          if (!(_.isFunction(obj.canDropCascade) ? obj.canDropCascade.apply(obj, [d, i]) : obj.canDropCascade)) {
            Alertify.error(S('The %s "%s" cannot be dropped!').sprintf(obj.label, d.label).value(), 10);
            return;
          }
        } else {
          msg = S(gettext('Are you sure you want to drop %s "%s"?')).sprintf(obj.label.toLowerCase(), d.label).value();
          title = S(gettext('DROP %s?')).sprintf(obj.label).value();

          if (!(_.isFunction(obj.canDrop) ? obj.canDrop.apply(obj, [d, i]) : obj.canDrop)) {
            Alertify.error(S('The %s "%s" cannot be dropped!').sprintf(obj.label, d.label).value(), 10);
            return;
          }
        }
        Alertify.confirm(title, msg, function () {
          $.ajax({
            url: obj.generate_url(i, input.url, d, true),
            type: 'DELETE',
            success: function success(res) {
              if (res.success == 0) {
                pgBrowser.report_error(res.errormsg, res.info);
              } else {
                pgBrowser.removeTreeNode(i, true);
              }
              return true;
            },
            error: function error(jqx) {
              var msg = jqx.responseText;
              /* Error from the server */
              if (jqx.status == 417 || jqx.status == 410 || jqx.status == 500) {
                try {
                  var data = $.parseJSON(jqx.responseText);
                  msg = data.errormsg;
                } catch (e) {}
              }
              pgBrowser.report_error(S(gettext('Error dropping %s: "%s"')).sprintf(obj.label, objName).value(), msg);
            }
          });
        }, null).show();
      },
      // Callback for creating script(s) & opening them in Query editor
      show_script: function show_script(args, item) {
        var scriptType = args.script,
            obj = this,
            t = pgBrowser.tree,
            i = item || t.selected(),
            d = i && i.length == 1 ? t.itemData(i) : undefined;

        if (!d) return;

        /*
         * Make sure - we're using the correct version of node
         */
        obj = pgBrowser.Nodes[d._type];
        var objName = d.label,
            sql_url;

        // URL for script type
        if (scriptType == 'insert') {
          sql_url = 'insert_sql';
        } else if (scriptType == 'update') {
          sql_url = 'update_sql';
        } else if (scriptType == 'delete') {
          sql_url = 'delete_sql';
        } else if (scriptType == 'select') {
          sql_url = 'select_sql';
        } else if (scriptType == 'exec') {
          sql_url = 'exec_sql';
        } else {
          // By Default get CREATE SQL
          sql_url = 'sql';
        }
        // Open data grid & pass the URL for fetching
        pgAdmin.DataGrid.show_query_tool(obj.generate_url(i, sql_url, d, true), i, scriptType);
      },

      // Callback to render query editor
      show_query_tool: function show_query_tool(args, item) {
        var obj = this,
            t = pgBrowser.tree,
            i = item || t.selected(),
            d = i && i.length == 1 ? t.itemData(i) : undefined;

        if (!d) return;

        // Here call data grid method to render query tool
        pgAdmin.DataGrid.show_query_tool('', i);
      },
      added: function added(item, data, browser) {
        var b = browser || pgBrowser,
            t = b.tree,
            pItem = t.parent(item),
            pData = pItem && t.itemData(pItem),
            pNode = pData && pgBrowser.Nodes[pData._type];

        // Check node is a collection or not.
        if (pNode && pNode.is_collection) {
          /* If 'collection_count' is not present in data
           * it means tree node expanded first time, so we will
           * kept collection count and label in data itself.
           */
          if (!('collection_count' in pData)) {
            pData.collection_count = 0;
          }
          pData.collection_count++;
          t.setLabel(pItem, {
            label: _.escape(pData._label) + ' <span>(' + pData.collection_count + ')</span>'
          });
        }
      },
      // Callback called - when a node is selected in browser tree.
      selected: function selected(item, data, browser) {
        // Show the information about the selected node in the below panels,
        // which are visible at this time:
        // + Properties
        // + Query (if applicable, otherwise empty)
        // + Dependents
        // + Dependencies
        // + Statistics
        var b = browser || pgBrowser,
            t = b.tree,
            d = data || t.itemData(item);

        // Update the menu items
        pgAdmin.Browser.enable_disable_menus.apply(b, [item]);

        if (d && b) {
          if ('properties' in b.panels && b.panels['properties'] && b.panels['properties'].panel && b.panels['properties'].panel.isVisible()) {
            // Show object properties (only when the 'properties' tab
            // is active).
            this.showProperties(item, d, b.panels['properties'].panel);
          }
          if ('sql' in b.panels && b.panels['sql'] && b.panels['sql'].panel && b.panels['sql'].panel.isVisible()) {
            // TODO:: Show reverse engineered query for this object (when 'sql'
            // tab is active.)
          }
          if ('statistics' in b.panels && b.panels['statistics'] && b.panels['statistics'].panel && b.panels['statistics'].panel.isVisible()) {
            // TODO:: Show statistics for this object (when the 'statistics'
            // tab is active.)
          }
          if ('dependencies' in b.panels && b.panels['dependencies'] && b.panels['dependencies'].panel && b.panels['dependencies'].panel.isVisible()) {
            // TODO:: Show dependencies for this object (when the
            // 'dependencies' tab is active.)
          }
          if ('dependents' in b.panels && b.panels['dependents'] && b.panels['dependents'].panel && b.panels['dependents'].panel.isVisible()) {
            // TODO:: Show dependents for this object (when the 'dependents'
            // tab is active.)
          }
        }

        return true;
      },
      removed: function removed(item) {
        var self = this,
            t = pgBrowser.tree,
            pItem = t.parent(item),
            pData = pItem && t.itemData(pItem),
            pNode = pData && pgBrowser.Nodes[pData._type];

        // Check node is a collection or not.
        if (pNode && pNode.is_collection && 'collection_count' in pData) {
          pData.collection_count--;
          t.setLabel(pItem, {
            label: _.escape(pData._label) + ' <span>(' + pData.collection_count + ')</span>'
          });
        }

        setTimeout(function () {
          self.clear_cache.apply(self, item);
        }, 0);
      },
      unloaded: function unloaded(item) {
        var self = this,
            t = pgBrowser.tree,
            data = item && t.itemData(item);

        // In case of unload remove the collection counter
        if (self.is_collection && 'collection_count' in data) {
          delete data.collection_count;
          t.setLabel(item, { label: _.escape(data._label) });
        }
      },
      refresh: function refresh(cmd, i) {
        var self = this,
            t = pgBrowser.tree,
            item = i || t.selected(),
            d = t.itemData(item);

        pgBrowser.Events.trigger('pgadmin:browser:tree:refresh', item);
      }
    },
    /**********************************************************************
     * A hook (not a callback) to show object properties in given HTML
     * element.
     *
     * This has been used for the showing, editing properties of the node.
     * This has also been used for creating a node.
     **/
    showProperties: function showProperties(item, data, panel, action) {
      var that = this,
          tree = pgAdmin.Browser.tree,
          j = panel.$container.find('.obj_properties').first(),
          view = j.data('obj-view'),
          content = $('<div tabindex="1"></div>').addClass('pg-prop-content col-xs-12');

      // Handle key press events for Cancel, save and help button
      var handleKeyDown = function (event, context) {
        // If called on panel other than node_props, return
        if (panel && panel['_type'] !== 'node_props') return;

        switch (event.which) {
          case keyCode.ESCAPE:
            closePanel();
            break;
          case keyCode.ENTER:
            // Return if event is fired from child element
            if (event.target !== context) return;
            if (view && view.model && view.model.sessChanged()) {
              onSave.call(this, view);
            }
            break;
          case keyCode.F1:
            onDialogHelp();
            break;
          default:
            break;
        }
      }.bind(panel);

      setTimeout(function () {
        // Register key press events with panel element
        panel.$container.find('.backform-tab').on("keydown", function (event) {
          handleKeyDown(event, this);
        });
      }, 200); // wait for panel tab to render

      // Template function to create the status bar
      var createStatusBar = function (location) {
        var statusBar = $('<div></div>').addClass('pg-prop-status-bar').appendTo(j);
        statusBar.css("visibility", "hidden");
        if (location == "header") {
          statusBar.appendTo(that.header);
        } else {
          statusBar.prependTo(that.footer);
        }
        that.statusBar = statusBar;
        return statusBar;
      }.bind(panel),

      // Template function to create the button-group
      createButtons = function (buttons, location, extraClasses) {
        var panel = this;

        // arguments must be non-zero length array of type
        // object, which contains following attributes:
        // label, type, extraClasses, register
        if (buttons && _.isArray(buttons) && buttons.length > 0) {
          // All buttons will be created within a single
          // div area.
          var btnGroup = $('<div></div>').addClass('pg-prop-btn-group'),

          // Template used for creating a button
          tmpl = _.template(['<button type="<%= type %>" ', 'class="btn <%=extraClasses.join(\' \')%>"', '<% if (disabled) { %> disabled="disabled"<% } %> title="<%-tooltip%>">', '<span class="<%= icon %>"></span><% if (label != "") { %>&nbsp;<%-label%><% } %></button>'].join(' '));
          if (location == "header") {
            btnGroup.appendTo(that.header);
          } else {
            btnGroup.appendTo(that.footer);
          }
          if (extraClasses) {
            btnGroup.addClass(extraClasses);
          }
          _.each(buttons, function (btn) {
            // Create the actual button, and append to
            // the group div

            // icon may not present for this button
            if (!btn.icon) {
              btn.icon = "";
            }
            var b = $(tmpl(btn));
            btnGroup.append(b);
            // Register is a callback to set callback
            // for certain operation for this button.
            btn.register(b);
          });
          return btnGroup;
        }
        return null;
      }.bind(panel),

      // Callback to show object properties
      properties = function () {

        // Avoid unnecessary reloads
        var panel = this,
            i = tree.selected(),
            d = i && tree.itemData(i),
            n_type = d._type,
            n_value = -1,
            n = i && d && pgBrowser.Nodes[d._type],
            treeHierarchy = n.getTreeNodeHierarchy(i);

        if (_.isEqual($(panel).data('node-prop'), treeHierarchy)) {
          return;
        }

        // Cache the current IDs for next time
        $(panel).data('node-prop', treeHierarchy);

        if (!content.hasClass('has-pg-prop-btn-group')) content.addClass('has-pg-prop-btn-group');

        // We need to release any existing view, before
        // creating new view.
        if (view) {
          // Release the view
          view.remove({ data: true, internal: true, silent: true });
          // Deallocate the view
          // delete view;
          view = null;
          // Reset the data object
          j.data('obj-view', null);
        }
        // Make sure the HTML element is empty.
        j.empty();
        that.header = $('<div></div>').addClass('pg-prop-header').appendTo(j);
        that.footer = $('<div></div>').addClass('pg-prop-footer').appendTo(j);
        // Create a view to show the properties in fieldsets
        view = that.getView(item, 'properties', content, data, 'fieldset', undefined, j);
        if (view) {
          // Save it for release it later
          j.data('obj-view', view);

          // Create proper buttons

          var buttons = [];

          buttons.push({
            label: '', type: 'edit',
            tooltip: gettext('Edit'),
            extraClasses: ['btn-default'],
            icon: 'fa fa-lg fa-pencil-square-o',
            disabled: !that.canEdit,
            register: function register(btn) {
              btn.click(function () {
                onEdit();
              });
            }
          });

          buttons.push({
            label: '', type: 'help',
            tooltip: gettext('SQL help for this object type.'),
            extraClasses: ['btn-default', 'pull-right'],
            icon: 'fa fa-lg fa-info',
            disabled: that.sqlAlterHelp == '' && that.sqlCreateHelp == '' ? true : false,
            register: function register(btn) {
              btn.click(function () {
                onSqlHelp();
              });
            }
          });

          createButtons(buttons, 'header', 'pg-prop-btn-group-above bg-gray-2 border-gray-3');
        }
        j.append(content);
      }.bind(panel),
          onSqlHelp = function () {
        var panel = this;
        // See if we can find an existing panel, if not, create one
        var pnlSqlHelp = pgBrowser.docker.findPanels('pnl_sql_help')[0];

        if (pnlSqlHelp == null) {
          var pnlProperties = pgBrowser.docker.findPanels('properties')[0];
          pgBrowser.docker.addPanel('pnl_sql_help', wcDocker.DOCK.STACKED, pnlProperties);
          pnlSqlHelp = pgBrowser.docker.findPanels('pnl_sql_help')[0];
        }

        // Construct the URL
        var server = that.getTreeNodeHierarchy(item).server;

        var url = pgBrowser.utils.pg_help_path;
        if (server.server_type == 'ppas') {
          url = pgBrowser.utils.edbas_help_path;
        }

        var major = Math.floor(server.version / 10000),
            minor = Math.floor(server.version / 100) - major * 100;

        url = url.replace('$VERSION$', major + '.' + minor);
        if (!S(url).endsWith('/')) {
          url = url + '/';
        }
        if (that.sqlCreateHelp == '' && that.sqlAlterHelp != '') {
          url = url + that.sqlAlterHelp;
        } else if (that.sqlCreateHelp != '' && that.sqlAlterHelp == '') {
          url = url + that.sqlCreateHelp;
        } else {
          if (view.model.isNew()) {
            url = url + that.sqlCreateHelp;
          } else {
            url = url + that.sqlAlterHelp;
          }
        }

        // Update the panel
        var iframe = $(pnlSqlHelp).data('embeddedFrame');
        pnlSqlHelp.title('SQL: ' + that.label);

        pnlSqlHelp.focus();
        iframe.openURL(url);
      }.bind(panel),
          onDialogHelp = function () {
        var panel = this;
        // See if we can find an existing panel, if not, create one
        var pnlDialogHelp = pgBrowser.docker.findPanels('pnl_online_help')[0];

        if (pnlDialogHelp == null) {
          var pnlProperties = pgBrowser.docker.findPanels('properties')[0];
          pgBrowser.docker.addPanel('pnl_online_help', wcDocker.DOCK.STACKED, pnlProperties);
          pnlDialogHelp = pgBrowser.docker.findPanels('pnl_online_help')[0];
        }

        // Update the panel
        var iframe = $(pnlDialogHelp).data('embeddedFrame');

        pnlDialogHelp.focus();
        iframe.openURL(that.dialogHelp);
      }.bind(panel),
          onSave = function (view) {
        var m = view.model,
            d = m.toJSON(true),


        // Generate a timer for the request
        timer = setTimeout(function () {
          $('.obj_properties').addClass('show_progress');
        }, 1000);

        if (d && !_.isEmpty(d)) {
          m.save({}, {
            attrs: d,
            validate: false,
            cache: false,
            success: function success() {
              onSaveFunc.call();
              // Hide progress cursor
              $('.obj_properties').removeClass('show_progress');
              clearTimeout(timer);

              // Removing the node-prop property of panel
              // so that we show updated data on panel
              var pnlProperties = pgBrowser.docker.findPanels('properties')[0],
                  pnlSql = pgBrowser.docker.findPanels('sql')[0],
                  pnlStats = pgBrowser.docker.findPanels('statistics')[0],
                  pnlDependencies = pgBrowser.docker.findPanels('dependencies')[0],
                  pnlDependents = pgBrowser.docker.findPanels('dependents')[0];

              if (pnlProperties) $(pnlProperties).removeData('node-prop');
              if (pnlSql) $(pnlSql).removeData('node-prop');
              if (pnlStats) $(pnlStats).removeData('node-prop');
              if (pnlDependencies) $(pnlDependencies).removeData('node-prop');
              if (pnlDependents) $(pnlDependents).removeData('node-prop');
            },
            error: function error(m, jqxhr) {
              Alertify.pgNotifier("error", jqxhr, S(gettext("Error saving properties: %s")).sprintf(jqxhr.statusText).value());

              // Hide progress cursor
              $('.obj_properties').removeClass('show_progress');
              clearTimeout(timer);
            }
          });
        }
      }.bind(panel),
          editFunc = function () {
        var panel = this;
        if (action && action == 'properties') {
          action = 'edit';
        }
        panel.$container.attr('action-mode', action);
        // We need to release any existing view, before
        // creating the new view.
        if (view) {
          // Release the view
          view.remove({ data: true, internal: true, silent: true });
          // Deallocate the view
          view = null;
          // Reset the data object
          j.data('obj-view', null);
        }
        // Make sure the HTML element is empty.
        j.empty();

        that.header = $('<div></div>').addClass('pg-prop-header').appendTo(j);
        that.footer = $('<div></div>').addClass('pg-prop-footer').appendTo(j);

        var updateButtons = function updateButtons(hasError, modified) {

          var btnGroup = this.find('.pg-prop-btn-group'),
              btnSave = btnGroup.find('button.btn-primary'),
              btnReset = btnGroup.find('button.btn-warning');

          if (hasError || !modified) {
            btnSave.prop('disabled', true);
            btnSave.attr('disabled', 'disabled');
          } else {
            btnSave.prop('disabled', false);
            btnSave.removeAttr('disabled');
          }

          if (!modified) {
            btnReset.prop('disabled', true);
            btnReset.attr('disabled', 'disabled');
          } else {
            btnReset.prop('disabled', false);
            btnReset.removeAttr('disabled');
          }
        };

        // Create a view to edit/create the properties in fieldsets
        view = that.getView(item, action, content, data, 'dialog', updateButtons, j, onCancelFunc);
        if (view) {
          // Save it to release it later
          j.data('obj-view', view);

          panel.icon(_.isFunction(that['node_image']) ? that['node_image'].apply(that, [data, view.model]) : that['node_image'] || 'icon-' + that.type);

          // Create proper buttons
          createButtons([{
            label: '', type: 'help',
            tooltip: gettext('SQL help for this object type.'),
            extraClasses: ['btn-default', 'pull-left'],
            icon: 'fa fa-lg fa-info',
            disabled: that.sqlAlterHelp == '' && that.sqlCreateHelp == '' ? true : false,
            register: function register(btn) {
              btn.click(function () {
                onSqlHelp();
              });
            }
          }, {
            label: '', type: 'help',
            tooltip: gettext('Help for this dialog.'),
            extraClasses: ['btn-default', 'pull-left'],
            icon: 'fa fa-lg fa-question',
            disabled: that.dialogHelp == '' ? true : false,
            register: function register(btn) {
              btn.click(function () {
                onDialogHelp();
              });
            }
          }, {
            label: gettext('Save'), type: 'save',
            tooltip: gettext('Save this object.'),
            extraClasses: ['btn-primary'],
            icon: 'fa fa-lg fa-save',
            disabled: true,
            register: function register(btn) {
              // Save the changes
              btn.click(function () {
                onSave.call(this, view);
              });
            }
          }, {
            label: gettext('Cancel'), type: 'cancel',
            tooltip: gettext('Cancel changes to this object.'),
            extraClasses: ['btn-danger'],
            icon: 'fa fa-lg fa-close',
            disabled: false,
            register: function register(btn) {
              btn.click(function () {
                // Removing the action-mode
                panel.$container.removeAttr('action-mode');
                onCancelFunc.call(arguments);
              });
            }
          }, {
            label: gettext('Reset'), type: 'reset',
            tooltip: gettext('Reset the fields on this dialog.'),
            extraClasses: ['btn-warning'],
            icon: 'fa fa-lg fa-recycle',
            disabled: true,
            register: function register(btn) {
              btn.click(function () {
                setTimeout(function () {
                  editFunc.call();
                }, 0);
              });
            }
          }], 'footer', 'pg-prop-btn-group-below bg-gray-2 border-gray-3');
        };

        // Create status bar.
        createStatusBar('footer');

        // Add some space, so that - button group does not override the
        // space
        content.addClass('pg-prop-has-btn-group-below');

        // Show contents before buttons
        j.prepend(content);
      }.bind(panel),
          closePanel = function () {
        // Closing this panel
        this.close();
      }.bind(panel),
          updateTreeItem = function updateTreeItem(that) {
        var _old = data,
            _new = _.clone(view.model.tnode),
            info = _.clone(view.model.node_info);

        // Clear the cache for this node now.
        setTimeout(function () {
          that.clear_cache.apply(that, item);
        }, 0);

        pgBrowser.Events.trigger('pgadmin:browser:tree:update', _old, _new, info, {
          success: function success(_item, _newNodeData, _oldNodeData) {
            pgBrowser.Events.trigger('pgadmin:browser:node:updated', _item, _newNodeData, _oldNodeData);
            pgBrowser.Events.trigger('pgadmin:browser:node:' + _newNodeData._type + ':updated', _item, _newNodeData, _oldNodeData);
          }
        });
        closePanel();
      },
          saveNewNode = function (that) {
        var panel = this,
            j = panel.$container.find('.obj_properties').first(),
            view = j.data('obj-view');

        // Clear the cache for this node now.
        setTimeout(function () {
          that.clear_cache.apply(that, item);
        }, 0);
        try {
          pgBrowser.Events.trigger('pgadmin:browser:tree:add', _.clone(view.model.tnode), _.clone(view.model.node_info));
        } catch (e) {
          console.log(e);
        }
        closePanel();
      }.bind(panel, that),
          editInNewPanel = function editInNewPanel() {
        // Open edit in separate panel
        setTimeout(function () {
          that.callbacks.show_obj_properties.apply(that, [{
            'action': 'edit',
            'item': item
          }]);
        }, 0);
      },
          onCancelFunc = closePanel,
          onSaveFunc = updateTreeItem.bind(panel, that),
          onEdit = editFunc.bind(panel);

      if (action) {
        if (action == 'create') {
          onCancelFunc = closePanel;
          onSaveFunc = saveNewNode;
        }
        if (action != 'properties') {
          // We need to keep track edit/create mode for this panel.
          editFunc();
        } else {
          properties();
        }
      } else {
        /* Show properties */
        properties();
        onEdit = editInNewPanel.bind(panel);
      }
      if (panel.closeable()) {
        var onCloseFunc = function () {
          var j = this.$container.find('.obj_properties').first(),
              view = j && j.data('obj-view');

          if (view) {
            view.remove({ data: true, internal: true, silent: true });
          }
        }.bind(panel);
        panel.on(wcDocker.EVENT.CLOSED, onCloseFunc);
      }
    },
    _find_parent_node: function _find_parent_node(t, i, d) {
      if (this.parent_type) {
        d = d || t.itemData(i);

        if (_.isString(this.parent_type)) {
          if (this.parent_type == d._type) {
            return i;
          }
          while (t.hasParent(i)) {
            i = t.parent(i);
            d = t.itemData(i);

            if (this.parent_type == d._type) return i;
          }
        } else {
          if (_.indexOf(this.parent_type, d._type) >= 0) {
            return i;
          }
          while (t.hasParent(i)) {
            i = t.parent(i);
            d = t.itemData(i);

            if (_.indexOf(this.parent_type, d._type) >= 0) return i;
          }
        }
      }
      return null;
    },
    /**********************************************************************
     * Generate the URL for different operations
     *
     * arguments:
     *   type:  Create/drop/edit/properties/sql/depends/statistics
     *   d:     Provide the ItemData for the current item node
     *   with_id: Required id information at the end?
     *
     * Supports url generation for create, drop, edit, properties, sql,
     * depends, statistics
     */
    generate_url: function generate_url(item, type, d, with_id, info) {

      var opURL = {
        'create': 'obj', 'drop': 'obj', 'edit': 'obj',
        'properties': 'obj', 'statistics': 'stats'
      },
          self = this,
          priority = -Infinity;

      var treeInfo = _.isUndefined(item) || _.isNull(item) ? info || {} : this.getTreeNodeHierarchy(item);
      var actionType = type in opURL ? opURL[type] : type;
      var itemID = with_id && d._type == self.type ? encodeURIComponent(d._id) : '';

      if (self.parent_type) {
        if (_.isString(self.parent_type)) {
          var p = treeInfo[self.parent_type];
          if (p) {
            priority = p.priority;
          }
        } else {
          _.each(self.parent_type, function (o) {
            var p = treeInfo[o];
            if (p) {
              if (priority < p.priority) {
                priority = p.priority;
              }
            }
          });
        }
      }
      var nodePickFunction = function nodePickFunction(treeInfoValue) {
        return treeInfoValue.priority <= priority;
      };
      return generateUrl.generate_url(pgBrowser.URL, treeInfo, actionType, self.type, nodePickFunction, itemID);
    },
    // Base class for Node Data Collection
    Collection: pgBrowser.DataCollection,
    // Base class for Node Data Model
    Model: pgBrowser.DataModel,
    getTreeNodeHierarchy: function getTreeNodeHierarchy(i) {
      var idx = 0,
          res = {},
          t = pgBrowser.tree,
          d;
      do {
        d = t.itemData(i);
        if (d._type in pgBrowser.Nodes && pgBrowser.Nodes[d._type].hasId) {
          res[d._type] = _.extend({}, d, {
            'priority': idx
          });
          idx -= 1;
        }
        i = t.hasParent(i) ? t.parent(i) : null;
      } while (i);

      return res;
    },
    cache: function cache(url, node_info, level, data) {
      var cached = this.cached = this.cached || {},
          hash = url,
          min_priority = node_info && node_info[level] && node_info[level].priority || 0;

      if (node_info) {
        _.each(_.sortBy(_.values(_.pick(node_info, function (v, k, o) {
          return v.priority <= min_priority;
        })), function (o) {
          return o.priority;
        }), function (o) {
          hash = S('%s/%s').sprintf(hash, encodeURI(o._id)).value();
        });
      }

      if (_.isUndefined(data)) {
        var res = cached[hash];

        if (!_.isUndefined(res) && res.at - Date.now() > 300000) {
          res = undefined;
        }
        return res;
      }

      res = cached[hash] = { data: data, at: Date.now(), level: level };

      return res;
    },
    clear_cache: function clear_cache(item) {
      /*
       * Reset the cache, when new node is created.
       *
       * FIXME:
       * At the moment, we will clear all the cache for this node. But - we
       * would like to clear the cache only this nodes parent, so that - it
       * fetches the new data.
       */
      this.cached = {};
    },
    cache_level: function cache_level(node_info, with_id) {
      if (node_info) {
        if (with_id && this.type in node_info) {
          return this.type;
        }
        if (_.isArray(this.parent_type)) {
          for (var parent in this.parent_type) {
            if (parent in node_info) {
              return parent;
            }
          }
          return this.type;
        }
        return this.parent_type;
      }
    }
  });

  return pgAdmin.Browser.Node;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 493:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery, _) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/***
 * Contains pgAdmin4 related SlickGrid formatters.
 *
 * @module Formatters
 * @namespace Slick
 */

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Formatters": {
        "JsonString": JsonFormatter,
        "Numbers": NumbersFormatter,
        "Checkmark": CheckmarkFormatter,
        "Text": TextFormatter
      }
    }
  });

  function JsonFormatter(row, cell, value, columnDef, dataContext) {
    // If column has default value, set placeholder
    if (_.isUndefined(value) && columnDef.has_default_val) {
      return "<span class='pull-left disabled_cell'>[default]</span>";
    } else if (_.isUndefined(value) && columnDef.not_null || _.isUndefined(value) || value === null) {
      return "<span class='pull-left disabled_cell'>[null]</span>";
    } else {
      // Stringify only if it's json object
      if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && !Array.isArray(value)) {
        return _.escape(JSON.stringify(value));
      } else if (Array.isArray(value)) {
        var temp = [];
        $.each(value, function (i, val) {
          if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === "object") {
            temp.push(JSON.stringify(val));
          } else {
            temp.push(val);
          }
        });
        return _.escape("[" + temp.join() + "]");
      } else {
        return _.escape(value);
      }
    }
  }

  function NumbersFormatter(row, cell, value, columnDef, dataContext) {
    // If column has default value, set placeholder
    if (_.isUndefined(value) && columnDef.has_default_val) {
      return "<span class='pull-right disabled_cell'>[default]</span>";
    } else if (_.isUndefined(value) || value === null || value === "" || _.isUndefined(value) && columnDef.not_null) {
      return "<span class='pull-right disabled_cell'>[null]</span>";
    } else {
      return "<span style='float:right'>" + _.escape(value) + "</span>";
    }
  }

  function CheckmarkFormatter(row, cell, value, columnDef, dataContext) {
    /* Checkbox has 3 states
     * 1) checked=true
     * 2) unchecked=false
     * 3) indeterminate=null
     */
    if (_.isUndefined(value) && columnDef.has_default_val) {
      return "<span class='pull-left disabled_cell'>[default]</span>";
    } else if (_.isUndefined(value) && columnDef.not_null || value == null || value === "") {
      return "<span class='pull-left disabled_cell'>[null]</span>";
    }
    return value ? "true" : "false";
  }

  function TextFormatter(row, cell, value, columnDef, dataContext) {
    // If column has default value, set placeholder
    if (_.isUndefined(value) && columnDef.has_default_val) {
      return "<span class='pull-left disabled_cell'>[default]</span>";
    } else if (_.isUndefined(value) && columnDef.not_null || _.isUndefined(value) || _.isNull(value)) {
      return "<span class='pull-left disabled_cell'>[null]</span>";
    } else if (columnDef.column_type_internal == 'bytea' || columnDef.column_type_internal == 'bytea[]') {
      return "<span class='pull-left disabled_cell'>[" + _.escape(value) + "]</span>";
    } else {
      return _.escape(value);
    }
  }
})(jQuery);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),

/***/ 494:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery, _) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/***
 * Contains JSON SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */

(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Editors": {
        "pgText": pgTextEditor,
        "JsonText": JsonTextEditor,
        "CustomNumber": CustomNumberEditor,
        // Below editor will read only editors, Just to display data
        "ReadOnlyText": ReadOnlyTextEditor,
        "ReadOnlyCheckbox": ReadOnlyCheckboxEditor,
        "Checkbox": CheckboxEditor, // Override editor to implement checkbox with three states
        "ReadOnlypgText": ReadOnlypgTextEditor,
        "ReadOnlyJsonText": ReadOnlyJsonTextEditor
      }
    }
  });

  // return wrapper element
  function getWrapper() {
    return $("<div class='pg_text_editor' />");
  }

  // return textarea element
  function getTextArea() {
    return $("<textarea class='pg_textarea text-12' hidefocus rows=5'>");
  }

  // Generate and return editor buttons
  function getButtons(editable) {
    var $buttons = $("<div class='pg_buttons' />"),
        label = editable ? 'Cancel' : 'OK',
        button_type = editable ? 'btn-danger' : 'btn-primary';

    if (editable) {
      var $save_button = $("<button class='btn btn-primary fa fa-lg fa-save long_text_editor pg-alertify-button'>Save</button>").appendTo($buttons);
    }

    var $cancel_button = $("<button class='btn " + button_type + " fa fa-lg fa-times long_text_editor pg-alertify-button'>" + label + "</button>").appendTo($buttons);
    return $buttons;
  }

  /*
   * This function handles the [default] and [null] values for cells
   * if row is copied, otherwise returns the editor value.
   * @param {args} editor object
   * @param {item} row cell values
   * @param {state} entered value
   * @param {column_type} type of column
   */
  function setValue(args, item, state, column_type) {
    // declare a 2-d array which tracks the status of each updated cell
    // If a cell is edited for the 1st time and state is null,
    // set cell value to [default] and update its status [row][cell] to 1.
    // If same cell is edited again, and kept blank, set cell value to [null]

    // If a row is copied
    var grid = args.grid;
    if (item.is_row_copied) {
      if (!grid.copied_rows) {
        grid.copied_rows = [[]];
      }

      var active_cell = grid.getActiveCell(),
          row = active_cell['row'],
          cell = active_cell['cell'],
          last_value = item[args.column.pos],
          last_value = column_type === 'number' ? _.isEmpty(last_value) || last_value : last_value;

      item[args.column.field] = state;
      if (last_value && _.isNull(state) && (_.isUndefined(grid.copied_rows[row]) || _.isUndefined(grid.copied_rows[row][cell]))) {
        item[args.column.field] = undefined;
        if (grid.copied_rows[row] == undefined) grid.copied_rows[row] = [];
        grid.copied_rows[row][cell] = 1;
      }
    } else {
      item[args.column.field] = state;
    }
  }

  function calculateEditorPosition(position, $wrapper) {
    var $edit_grid = $wrapper.parent().find('#datagrid');
    var _elem_height = $edit_grid.height(),
        is_hidden,
        _position;
    // We cannot display editor partially visible so we will lift it above select column
    if (position.top > _elem_height) {
      is_hidden = position.bottom - _elem_height;
    }

    if (is_hidden) {
      _position = position.top - is_hidden;
    } else {
      _position = position.top - 7;
    }
    position.top = _position;

    var grid_width = $edit_grid.width(),
        popup_width = $wrapper.width() + 32;
    popup_width += position.left;

    if (popup_width > grid_width) {
      position.left -= popup_width - grid_width;
    }
    return position;
  }

  // Text data type editor
  function pgTextEditor(args) {
    var $input, $wrapper, $buttons;
    var defaultValue;
    var scope = this;

    this.init = function () {
      var $container = $("body");

      $wrapper = getWrapper().appendTo($container);
      $input = getTextArea().appendTo($wrapper);
      $buttons = getButtons(true).appendTo($wrapper);

      $buttons.find("button:first").on("click", this.save);
      $buttons.find("button:last").on("click", this.cancel);
      $input.bind("keydown", this.handleKeyDown);

      scope.position(args.position);
      $input.focus().select();
    };

    this.handleKeyDown = function (e) {
      if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
        scope.save();
      } else if (e.which == $.ui.keyCode.ESCAPE) {
        e.preventDefault();
        scope.cancel();
      } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
        e.preventDefault();
        args.grid.navigatePrev();
      } else if (e.which == $.ui.keyCode.TAB) {
        e.preventDefault();
        args.grid.navigateNext();
      }
    };

    this.save = function () {
      args.commitChanges();
    };

    this.cancel = function () {
      $input.val(defaultValue);
      args.cancelChanges();
    };

    this.hide = function () {
      $wrapper.hide();
    };

    this.show = function () {
      $wrapper.show();
    };

    this.position = function (position) {
      calculateEditorPosition(position, $wrapper);
      $wrapper.css("top", position.top).css("left", position.left);
    };

    this.destroy = function () {
      $wrapper.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    // When text editor opens
    this.loadValue = function (item) {
      var col = args.column;

      if (_.isUndefined(item[args.column.field]) && col.has_default_val) {
        $input.val(defaultValue = "");
      } else if (item[args.column.field] === "") {
        $input.val(defaultValue = "''");
      } else {
        $input.val(defaultValue = item[args.column.field]);
        $input.select();
      }
    };

    this.serializeValue = function () {
      var value = $input.val();
      // If empty return null
      if (value === "") {
        return null;
      }
      // single/double quotes represent an empty string
      // If found return ''
      else if (value === "''" || value === '""') {
          return '';
        } else {
          // If found string literals - \"\", \'\', \\'\\' and \\\\'\\\\'
          // then remove slashes.
          value = value.replace("\\'\\'", "''");
          value = value.replace('\\"\\"', '""');
          value = value = value.replace(/\\\\/g, '\\');
          return value;
        }
    };

    this.applyValue = function (item, state) {
      setValue(args, item, state, 'text');
    };

    this.isValueChanged = function () {
      // Use _.isNull(value) for comparison for null instead of
      // defaultValue == null, because it returns true for undefined value.
      if ($input.val() == "" && _.isUndefined(defaultValue)) {
        return false;
      } else {
        return !($input.val() == "" && _.isNull(defaultValue)) && $input.val() != defaultValue;
      }
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  // JSON data type editor
  function JsonTextEditor(args) {
    var $input, $wrapper, $buttons;
    var defaultValue;
    var scope = this;

    this.init = function () {
      var $container = $("body");

      $wrapper = getWrapper().appendTo($container);
      $input = getTextArea().appendTo($wrapper);
      $buttons = getButtons(true).appendTo($wrapper);

      $buttons.find("button:first").on("click", this.save);
      $buttons.find("button:last").on("click", this.cancel);
      $input.bind("keydown", this.handleKeyDown);

      scope.position(args.position);
      $input.focus().select();
    };

    this.handleKeyDown = function (e) {
      if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
        scope.save();
      } else if (e.which == $.ui.keyCode.ESCAPE) {
        e.preventDefault();
        scope.cancel();
      } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
        e.preventDefault();
        args.grid.navigatePrev();
      } else if (e.which == $.ui.keyCode.TAB) {
        e.preventDefault();
        args.grid.navigateNext();
      }
    };

    this.save = function () {
      args.commitChanges();
    };

    this.cancel = function () {
      $input.val(defaultValue);
      args.cancelChanges();
    };

    this.hide = function () {
      $wrapper.hide();
    };

    this.show = function () {
      $wrapper.show();
    };

    this.position = function (position) {
      calculateEditorPosition(position, $wrapper);
      $wrapper.css("top", position.top).css("left", position.left);
    };

    this.destroy = function () {
      $wrapper.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      var data = defaultValue = item[args.column.field];
      if (data && (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object" && !Array.isArray(data)) {
        data = JSON.stringify(data);
      } else if (Array.isArray(data)) {
        var temp = [];
        $.each(data, function (i, val) {
          if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === "object") {
            temp.push(JSON.stringify(val));
          } else {
            temp.push(val);
          }
        });
        data = "[" + temp.join() + "]";
      }
      $input.val(data);
      $input.select();
    };

    this.serializeValue = function () {
      if ($input.val() === "") {
        return null;
      }
      return $input.val();
    };

    this.applyValue = function (item, state) {
      setValue(args, item, state, 'text');
    };

    this.isValueChanged = function () {
      if ($input.val() == "" && _.isUndefined(defaultValue)) {
        return false;
      } else {
        return !($input.val() == "" && _.isNull(defaultValue)) && $input.val() != defaultValue;
      }
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  // Text data type editor
  function ReadOnlypgTextEditor(args) {
    var $input, $wrapper, $buttons;
    var defaultValue;
    var scope = this;

    this.init = function () {
      var $container = $("body");

      $wrapper = getWrapper().appendTo($container);
      $input = getTextArea().appendTo($wrapper);
      $buttons = getButtons(false).appendTo($wrapper);

      $buttons.find("button:first").on("click", this.cancel);
      $input.bind("keydown", this.handleKeyDown);

      scope.position(args.position);
      $input.focus().select();
    };

    this.handleKeyDown = function (e) {
      if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
        scope.cancel();
      } else if (e.which == $.ui.keyCode.ESCAPE) {
        e.preventDefault();
        scope.cancel();
      } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
        scope.cancel();
        e.preventDefault();
        args.grid.navigatePrev();
      } else if (e.which == $.ui.keyCode.TAB) {
        scope.cancel();
        e.preventDefault();
        args.grid.navigateNext();
      }
    };

    this.cancel = function () {
      $input.val(defaultValue);
      args.cancelChanges();
    };

    this.hide = function () {
      $wrapper.hide();
    };

    this.show = function () {
      $wrapper.show();
    };

    this.position = function (position) {
      calculateEditorPosition(position, $wrapper);
      $wrapper.css("top", position.top).css("left", position.left);
    };

    this.destroy = function () {
      $wrapper.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      $input.val(defaultValue = item[args.column.field]);
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return !($input.val() == "" && defaultValue == null) && $input.val() != defaultValue;
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  /* Override CheckboxEditor to implement checkbox with three states.
   * 1) checked=true
   * 2) unchecked=false
   * 3) indeterminate=null
   */
  function CheckboxEditor(args) {
    var $select, el;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $select = $("<input type=checkbox class='editor-checkbox' hideFocus>");
      $select.appendTo(args.container);
      $select.focus();

      // The following code is taken from https://css-tricks.com/indeterminate-checkboxes/
      $select.bind("click", function (e) {
        el = $(this);
        el.prop('indeterminate', false);

        var checkbox_status = el.data('checked');
        // add new row > checkbox clicked
        if (el.data('checked') == undefined) {
          checkbox_status = 1;
        }
        switch (checkbox_status) {
          // unchecked, going indeterminate
          case 0:
            el.prop('indeterminate', true);
            el.data('checked', 2); // determines next checkbox status
            break;

          // indeterminate, going checked
          case 1:
            el.prop('checked', true);
            el.data('checked', 0);
            break;

          // checked, going unchecked
          default:
            el.prop('checked', false);
            el.data('checked', 1);
        }
      });
    };

    this.destroy = function () {
      $select.remove();
    };

    this.focus = function () {
      $select.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      if (_.isNull(defaultValue) || _.isUndefined(defaultValue)) {
        $select.prop('indeterminate', true);
        $select.data('checked', 2);
      } else {
        defaultValue = !!item[args.column.field];
        if (defaultValue) {
          $select.prop('checked', true);
          $select.data('checked', 0);
        } else {
          $select.prop('checked', false);
          $select.data('checked', 1);
        }
      }
    };

    this.serializeValue = function () {
      if ($select.prop('indeterminate')) {
        return null;
      }
      return $select.prop('checked');
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      // var select_value = this.serializeValue();
      var select_value = $select.data('checked');
      return !(select_value === 2 && (defaultValue == null || defaultValue == undefined)) && select_value !== defaultValue;
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator(this.serializeValue());
        if (!validationResults.valid) {
          return validationResults;
        }
      }
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  // JSON data type editor
  function ReadOnlyJsonTextEditor(args) {
    var $input, $wrapper, $buttons;
    var defaultValue;
    var scope = this;

    this.init = function () {
      var $container = $("body");

      $wrapper = getWrapper().appendTo($container);
      $input = getTextArea().appendTo($wrapper);
      $buttons = getButtons(false).appendTo($wrapper);

      $buttons.find("button:first").on("click", this.cancel);
      $input.bind("keydown", this.handleKeyDown);

      scope.position(args.position);
      $input.focus().select();
    };

    this.handleKeyDown = function (e) {
      if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
        scope.cancel();
      } else if (e.which == $.ui.keyCode.ESCAPE) {
        e.preventDefault();
        scope.cancel();
      } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
        scope.cancel();
        e.preventDefault();
        args.grid.navigatePrev();
      } else if (e.which == $.ui.keyCode.TAB) {
        scope.cancel();
        e.preventDefault();
        args.grid.navigateNext();
      }
    };

    this.cancel = function () {
      $input.val(defaultValue);
      args.cancelChanges();
    };

    this.hide = function () {
      $wrapper.hide();
    };

    this.show = function () {
      $wrapper.show();
    };

    this.position = function (position) {
      calculateEditorPosition(position, $wrapper);
      $wrapper.css("top", position.top).css("left", position.left);
    };

    this.destroy = function () {
      $wrapper.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      var data = defaultValue = item[args.column.field];
      if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object" && !Array.isArray(data)) {
        data = JSON.stringify(data);
      } else if (Array.isArray(data)) {
        var temp = [];
        $.each(data, function (i, val) {
          if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === "object") {
            temp.push(JSON.stringify(val));
          } else {
            temp.push(val);
          }
        });
        data = "[" + temp.join() + "]";
      }
      $input.val(data);
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return !($input.val() == "" && defaultValue == null) && $input.val() != defaultValue;
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function ReadOnlyTextEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' readonly/>").appendTo(args.container).bind("keydown.nav", function (e) {
        if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
          e.stopImmediatePropagation();
        }
      }).focus().select();
    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.getValue = function () {
      return $input.val();
    };

    this.loadValue = function (item) {
      var value = item[args.column.field];

      // Check if value is null or undefined
      if (value === undefined && typeof value === "undefined") {
        value = "";
      }
      defaultValue = value;
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return !($input.val() == "" && defaultValue == null) && $input.val() != defaultValue;
    };

    this.validate = function () {
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function ReadOnlyCheckboxEditor(args) {
    var $select, el;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus disabled>");
      $select.appendTo(args.container);
      $select.focus();
    };

    this.destroy = function () {
      $select.remove();
    };

    this.focus = function () {
      $select.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.pos];
      if (_.isNull(defaultValue) || _.isUndefined(defaultValue)) {
        $select.prop('indeterminate', true);
        $select.data('checked', 2);
      } else {
        defaultValue = !!item[args.column.pos];
        if (defaultValue) {
          $select.prop('checked', true);
          $select.data('checked', 0);
        } else {
          $select.prop('checked', false);
          $select.data('checked', 1);
        }
      }
    };

    this.serializeValue = function () {
      if ($select.prop('indeterminate')) {
        return null;
      }
      return $select.prop('checked');
    };

    this.applyValue = function (item, state) {
      item[args.column.pos] = state;
    };

    this.isValueChanged = function () {
      // var select_value = this.serializeValue();
      var select_value = $select.data('checked');
      return !(select_value === 2 && (defaultValue == null || defaultValue == undefined)) && select_value !== defaultValue;
    };

    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }

  function CustomNumberEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      $input = $("<INPUT type=text class='editor-text' />");

      $input.bind("keydown.nav", function (e) {
        if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
          e.stopImmediatePropagation();
        }
      });

      $input.appendTo(args.container);
      $input.focus().select();
    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field];
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      if ($input.val() === "") {
        return null;
      }
      return $input.val();
    };

    this.applyValue = function (item, state) {
      setValue(args, item, state, 'number');
    };

    this.isValueChanged = function () {
      if ($input.val() == "" && _.isUndefined(defaultValue)) {
        return false;
      } else if ($input.val() == "" && defaultValue == "") {
        return true;
      } else {
        return !($input.val() == "" && _.isNull(defaultValue)) && $input.val() != defaultValue;
      }
    };

    this.validate = function () {
      if (isNaN($input.val())) {
        return {
          valid: false,
          msg: "Please enter a valid integer"
        };
      }

      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
  }
})(jQuery);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(0), __webpack_require__(1), __webpack_require__(3), __webpack_require__(10), __webpack_require__(16), __webpack_require__(8), __webpack_require__(13), __webpack_require__(158), __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, $, _, pgAdmin, Backbone, Backform, Alertify, Backgrid) {

  var pgBrowser = pgAdmin.Browser;

  /*
   * Define the selectAll adapter for select2.
   *
   * Reference:
   * https://github.com/select2/select2/issues/195#issuecomment-240130634
   */
  $.fn.select2.amd.define('select2/selectAllAdapter', ['select2/utils', 'select2/dropdown', 'select2/dropdown/attachBody'], function (Utils, Dropdown, AttachBody) {

    function SelectAll() {}
    SelectAll.prototype.render = function (decorated) {
      var self = this,
          $rendered = decorated.call(this),
          $selectAll = $(['<button class="btn btn-xs btn-default" type="button"', ' style="width: 49%;margin: 0 0.5%;">', '<i class="fa fa-check-square-o"></i>', '<span style="padding: 0px 5px;">', gettext("Select All"), '</span></button>'].join('')),
          $unselectAll = $(['<button class="btn btn-xs btn-default" type="button"', ' style="width: 49%;margin: 0 0.5%;">', '<i class="fa fa-square-o"></i><span style="padding: 0px 5px;">', gettext("Unselect All"), '</span></button>'].join('')),
          $btnContainer = $('<div style="padding: 3px 0px; background-color: #2C76B4; margin-bottom: 3px;">').append($selectAll).append($unselectAll);

      if (!this.$element.prop("multiple")) {
        // this isn't a multi-select -> don't add the buttons!
        return $rendered;
      }
      $rendered.find('.select2-dropdown').prepend($btnContainer);
      $selectAll.on('click', function (e) {
        var $results = $rendered.find('.select2-results__option[aria-selected=false]');
        $results.each(function () {
          self.trigger('select', {
            data: $(this).data('data')
          });
        });
        self.trigger('close');
      });
      $unselectAll.on('click', function (e) {
        var $results = $rendered.find('.select2-results__option[aria-selected=true]');
        $results.each(function () {
          self.trigger('unselect', {
            data: $(this).data('data')
          });
        });
        self.trigger('close');
      });
      return $rendered;
    };

    return Utils.Decorate(Utils.Decorate(Dropdown, AttachBody), SelectAll);
  });

  /*
   * NodeAjaxOptionsControl
   *   This control will fetch the options required to render the select
   *   control, from the url specific to the pgAdmin.Browser node object.
   *
   *   In order to use this properly, schema require to set the 'url' property,
   *   which exposes the data for this node.
   *
   *   In case the url is not providing the data in proper format, we can
   *   specify the 'transform' function too, which will convert the fetched
   *   data to proper 'label', 'value' format.
   */
  var NodeAjaxOptionsControl = Backform.NodeAjaxOptionsControl = Backform.Select2Control.extend({
    defaults: _.extend(Backform.Select2Control.prototype.defaults, {
      url: undefined,
      transform: undefined,
      url_with_id: false,
      select2: {
        allowClear: true,
        placeholder: 'Select from the list',
        width: 'style'
      }
    }),
    initialize: function initialize() {
      /*
       * Initialization from the original control.
       */
      Backform.Select2Control.prototype.initialize.apply(this, arguments);

      /*
       * We're about to fetch the options required for this control.
       */
      var self = this,
          url = self.field.get('url') || self.defaults.url,
          m = self.model.top || self.model;

      // Hmm - we found the url option.
      // That means - we needs to fetch the options from that node.
      if (url) {
        var node = this.field.get('schema_node'),
            node_info = this.field.get('node_info'),
            with_id = this.field.get('url_with_id') || false,
            full_url = node.generate_url.apply(node, [null, url, this.field.get('node_data'), with_id, node_info]),
            cache_level,
            cache_node = this.field.get('cache_node');

        cache_node = cache_node && pgAdmin.Browser.Nodes[cache_node] || node;

        if (this.field.has('cache_level')) {
          cache_level = this.field.get('cache_level');
        } else {
          cache_level = cache_node.cache_level(node_info, with_id);
        }

        /*
         * We needs to check, if we have already cached data for this url.
         * If yes - use that, and do not bother about fetching it again,
         * and use it.
         */
        var data = cache_node.cache(node.type + '#' + url, node_info, cache_level);

        if (this.field.get('version_compatible') && (_.isUndefined(data) || _.isNull(data))) {
          m.trigger('pgadmin:view:fetching', m, self.field);
          $.ajax({
            async: false,
            url: full_url,
            success: function success(res) {
              /*
               * We will cache this data for short period of time for avoiding
               * same calls.
               */
              data = cache_node.cache(node.type + '#' + url, node_info, cache_level, res.data);
            },
            error: function error() {
              m.trigger('pgadmin:view:fetch:error', m, self.field);
            }
          });
          m.trigger('pgadmin:view:fetched', m, self.field);
        }
        // To fetch only options from cache, we do not need time from 'at'
        // attribute but only options.
        //
        // It is feasible that the data may not have been fetched.
        data = data && data.data || [];

        /*
         * Transform the data
         */
        var transform = this.field.get('transform') || self.defaults.transform;
        if (transform && _.isFunction(transform)) {
          // We will transform the data later, when rendering.
          // It will allow us to generate different data based on the
          // dependencies.
          self.field.set('options', transform.bind(self, data));
        } else {
          self.field.set('options', data);
        }
      }
    }
  });

  var formatNode = function formatNode(opt) {
    if (!opt.id) {
      return opt.text;
    }

    var optimage = $(opt.element).data('image');

    if (!optimage) {
      return opt.text;
    } else {
      return $('<span></span>').append($('<span></span>', { class: "wcTabIcon " + optimage })).append($('<span></span>').text(opt.text));
    }
  };

  var NodeListByIdControl = Backform.NodeListByIdControl = NodeAjaxOptionsControl.extend({
    controlClassName: 'pgadmin-node-select form-control',
    defaults: _.extend({}, NodeAjaxOptionsControl.prototype.defaults, {
      url: 'nodes',
      filter: undefined,
      transform: function transform(rows) {
        var self = this,
            node = self.field.get('schema_node'),
            res = [],
            filter = self.field.get('filter') || function () {
          return true;
        };

        filter = filter.bind(self);

        _.each(rows, function (r) {
          if (filter(r)) {
            var l = _.isFunction(node['node_label']) ? node['node_label'].apply(node, [r, self.model, self]) : r.label,
                image = _.isFunction(node['node_image']) ? node['node_image'].apply(node, [r, self.model, self]) : node['node_image'] || 'icon-' + node.type;

            res.push({
              'value': r._id,
              'image': image,
              'label': l
            });
          }
        });

        return res;
      },
      select2: {
        allowClear: true,
        placeholder: 'Select from the list',
        width: 'style',
        templateResult: formatNode,
        templateSelection: formatNode
      }
    })
  });

  var NodeListByNameControl = Backform.NodeListByNameControl = NodeListByIdControl.extend({
    defaults: _.extend({}, NodeListByIdControl.prototype.defaults, {
      transform: function transform(rows) {
        var self = this,
            node = self.field.get('schema_node'),
            res = [],
            filter = self.field.get('filter') || function () {
          return true;
        };

        filter = filter.bind(self);

        _.each(rows, function (r) {
          if (filter(r)) {
            var l = _.isFunction(node['node_label']) ? node['node_label'].apply(node, [r, self.model, self]) : r.label,
                image = _.isFunction(node['node_image']) ? node['node_image'].apply(node, [r, self.model, self]) : node['node_image'] || 'icon-' + node.type;
            res.push({
              'value': r.label,
              'image': image,
              'label': l
            });
          }
        });

        return res;
      }
    })
  });

  /*
   * Global function to make visible  particular dom element in it's parent
   * with given class.
   */
  $.fn.pgMakeVisible = function (cls) {
    return this.each(function () {
      if (!this || !$(this.length)) return;
      var top,
          p = $(this),
          hasScrollbar = function hasScrollbar(j) {
        if (j && j.length > 0) {
          return j.get(0).scrollHeight > j.height();
        }
        return false;
      };

      // check if p is not empty
      while (p && p.length > 0) {
        top = p.get(0).offsetTop + p.height();
        p = p.parent();
        if (hasScrollbar(p)) {
          p.scrollTop(top);
        }
        if (p.hasClass(cls)) //'backform-tab'
          return;
      }
    });
  };

  /*
   * NodeAjaxOptionsCell
   *   This cell will fetch the options required to render the select
   *   cell, from the url specific to the pgAdmin.Browser node object.
   *
   *   In order to use this properly, schema require to set the 'url' property,
   *   which exposes the data for this node.
   *
   *   In case the url is not providing the data in proper format, we can
   *   specify the 'transform' function too, which will convert the fetched
   *   data to proper 'label', 'value' format.
   */
  var NodeAjaxOptionsCell = Backgrid.Extension.NodeAjaxOptionsCell = Backgrid.Extension.Select2Cell.extend({
    defaults: _.extend({}, Backgrid.Extension.Select2Cell.prototype.defaults, {
      url: undefined,
      transform: undefined,
      url_with_id: false,
      select2: {
        allowClear: true,
        placeholder: 'Select from the list',
        width: 'style'
      },
      opt: {
        label: null,
        value: null,
        image: null,
        selected: false
      }
    }),
    template: _.template('<option <% if (image) { %> data-image=<%= image %> <% } %> value="<%- value %>" <%= selected ? \'selected="selected"\' : "" %>><%- label %></option>'),
    initialize: function initialize() {
      Backgrid.Extension.Select2Cell.prototype.initialize.apply(this, arguments);

      var url = this.column.get('url') || this.defaults.url,
          options_cached = this.column.get('options_cached');

      // Hmm - we found the url option.
      // That means - we needs to fetch the options from that node.
      if (url && !options_cached) {

        var self = this,
            m = this.model,
            column = this.column,
            eventHandler = m.top || m,
            node = column.get('schema_node'),
            node_info = column.get('node_info'),
            with_id = column.get('url_with_id') || false,
            full_url = node.generate_url.apply(node, [null, url, column.get('node_data'), with_id, node_info]),
            cache_level,
            cache_node = column.get('cache_node');

        cache_node = cache_node && pgAdmin.Browser.Nodes['cache_node'] || node;

        if (column.has('cache_level')) {
          cache_level = column.get('cache_level');
        } else {
          cache_level = cache_node.cache_level(node_info, with_id);
        }

        /*
         * We needs to check, if we have already cached data for this url.
         * If yes - use that, and do not bother about fetching it again,
         * and use it.
         */
        var data = cache_node.cache(node.type + '#' + url, node_info, cache_level);

        if (column.get('version_compatible') && (_.isUndefined(data) || _.isNull(data))) {
          eventHandler.trigger('pgadmin:view:fetching', m, column);
          $.ajax({
            async: false,
            url: full_url,
            success: function success(res) {
              /*
               * We will cache this data for short period of time for avoiding
               * same calls.
               */
              data = cache_node.cache(node.type + '#' + url, node_info, cache_level, res.data);
            },
            error: function error() {
              eventHandler.trigger('pgadmin:view:fetch:error', m, column);
            }
          });
          eventHandler.trigger('pgadmin:view:fetched', m, column);
        }
        // To fetch only options from cache, we do not need time from 'at'
        // attribute but only options.
        //
        // It is feasible that the data may not have been fetched.
        data = data && data.data || [];

        /*
         * Transform the data
         */
        var transform = column.get('transform') || self.defaults.transform;
        if (transform && _.isFunction(transform)) {
          // We will transform the data later, when rendering.
          // It will allow us to generate different data based on the
          // dependencies.
          column.set('options', transform.bind(column, data));
        } else {
          column.set('options', data);
        }
        column.set('options_cached', true);
      }
    }
  });

  var NodeListByIdCell = Backgrid.Extension.NodeListByIdCell = NodeAjaxOptionsCell.extend({
    controlClassName: 'pgadmin-node-select backgrid-cell',
    defaults: _.extend({}, NodeAjaxOptionsCell.prototype.defaults, {
      url: 'nodes',
      filter: undefined,
      transform: function transform(rows, control) {
        var self = control || this,
            node = self.column.get('schema_node'),
            res = [],
            filter = self.column.get('filter') || function () {
          return true;
        };

        filter = filter.bind(self);

        _.each(rows, function (r) {
          if (filter(r)) {
            var l = _.isFunction(node['node_label']) ? node['node_label'].apply(node, [r, self.model, self]) : r.label,
                image = _.isFunction(node['node_image']) ? node['node_image'].apply(node, [r, self.model, self]) : node['node_image'] || 'icon-' + node.type;

            res.push({
              'value': r._id,
              'image': image,
              'label': l
            });
          }
        });

        return res;
      },
      select2: {
        placeholder: 'Select from the list',
        width: 'style',
        templateResult: formatNode,
        templateSelection: formatNode
      }
    })
  });

  var NodeListByNameCell = Backgrid.Extension.NodeListByNameCell = NodeAjaxOptionsCell.extend({
    controlClassName: 'pgadmin-node-select backgrid-cell',
    defaults: _.extend({}, NodeAjaxOptionsCell.prototype.defaults, {
      url: 'nodes',
      filter: undefined,
      transform: function transform(rows, control) {
        var self = control || this,
            node = self.column.get('schema_node'),
            res = [],
            filter = self.column.get('filter') || function () {
          return true;
        };

        filter = filter.bind(self);

        _.each(rows, function (r) {
          if (filter(r)) {
            var l = _.isFunction(node['node_label']) ? node['node_label'].apply(node, [r, self.model, self]) : r.label,
                image = _.isFunction(node['node_image']) ? node['node_image'].apply(node, [r, self.model, self]) : node['node_image'] || 'icon-' + node.type;

            res.push({
              'value': r.label,
              'image': image,
              'label': l
            });
          }
        });

        return res;
      },
      select2: {
        placeholder: 'Select from the list',
        width: 'style',
        templateResult: formatNode,
        templateSelection: formatNode
      }
    })
  });

  // Extend the browser's node model class to create a option/value pair
  var MultiSelectAjaxCell = Backgrid.Extension.MultiSelectAjaxCell = Backgrid.Extension.NodeAjaxOptionsCell.extend({
    defaults: _.extend({}, NodeAjaxOptionsCell.prototype.defaults, {
      transform: undefined,
      url_with_id: false,
      select2: {
        allowClear: true,
        placeholder: 'Select from the list',
        width: 'style',
        multiple: true
      },
      opt: {
        label: null,
        value: null,
        image: null,
        selected: false
      }
    }),
    getValueFromDOM: function getValueFromDOM() {
      var res = [];

      this.$el.find("select").find(':selected').each(function () {
        res.push($(this).attr('value'));
      });

      return res;
    }
  });

  /*
   * Control to select multiple columns.
   */
  var MultiSelectAjaxControl = Backform.MultiSelectAjaxControl = NodeAjaxOptionsControl.extend({
    defaults: _.extend({}, NodeAjaxOptionsControl.prototype.defaults, {
      select2: {
        multiple: true,
        allowClear: true,
        width: 'style'
      }
    })
  });

  return Backform;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(5), __webpack_require__, __webpack_require__(0), __webpack_require__(1), __webpack_require__(4), __webpack_require__(188), __webpack_require__(3), __webpack_require__(17), __webpack_require__(29), __webpack_require__(156), __webpack_require__(77), __webpack_require__(30), __webpack_require__(256), __webpack_require__(249), __webpack_require__(250), __webpack_require__(96), __webpack_require__(189), __webpack_require__(157), __webpack_require__(251), __webpack_require__(190), __webpack_require__(31), __webpack_require__(9), __webpack_require__(38)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, url_for, require, $, _, S, Bootstrap, pgAdmin, Alertify, codemirror, checkNodeVisibility) {
  __webpack_provided_window_dot_jQuery = window.$ = $;
  // Some scripts do export their object in the window only.
  // Generally the one, which do no have AMD support.
  var wcDocker = window.wcDocker;
  $ = $ || __webpack_provided_window_dot_jQuery || window.$;
  Bootstrap = Bootstrap || window.Bootstrap;
  var CodeMirror = codemirror.default;

  var pgBrowser = pgAdmin.Browser = pgAdmin.Browser || {};
  var select_object_msg = gettext('Please select an object in the tree view.');

  var panelEvents = {};
  panelEvents[wcDocker.EVENT.VISIBILITY_CHANGED] = function () {
    if (this.isVisible()) {
      var obj = pgAdmin.Browser,
          i = obj.tree ? obj.tree.selected() : undefined,
          d = i && i.length == 1 ? obj.tree.itemData(i) : undefined;

      if (d && obj.Nodes[d._type].callbacks['selected'] && _.isFunction(obj.Nodes[d._type].callbacks['selected'])) {
        return obj.Nodes[d._type].callbacks['selected'].apply(obj.Nodes[d._type], [i, d, obj]);
      }
    }
  };

  var processTreeData = function processTreeData(payload) {
    var data = JSON.parse(payload).data;
    if (data.length && data[0]._type !== 'column' && data[0]._type !== 'catalog_object_column') {
      data = data.sort(function (a, b) {
        return pgAdmin.natural_sort(a.label, b.label);
      });
    }
    _.each(data, function (d) {
      d._label = d.label;
      d.label = _.escape(d.label);
    });
    return data;
  };

  var initializeBrowserTree = pgAdmin.Browser.initializeBrowserTree = function (b) {
    $('#tree').aciTree({
      ajax: {
        url: url_for('browser.nodes'),
        converters: {
          'text json': processTreeData
        }
      },
      ajaxHook: function ajaxHook(item, settings) {
        if (item != null) {
          var d = this.itemData(item);
          var n = b.Nodes[d._type];
          if (n) settings.url = n.generate_url(item, 'children', d, true);
        }
      },
      loaderDelay: 100,
      show: {
        duration: 75
      },
      hide: {
        duration: 75
      },
      view: {
        duration: 75
      }
    });

    b.tree = $('#tree').aciTree('api');
  };

  // Extend the browser class attributes
  _.extend(pgAdmin.Browser, {
    // The base url for browser
    URL: url_for('browser.index'),
    // We do have docker of type wcDocker to take care of different
    // containers. (i.e. panels, tabs, frames, etc.)
    docker: null,
    // Reversed Engineer query for the selected database node object goes
    // here
    editor: null,
    // Left hand browser tree
    tree: null,
    // list of script to be loaded, when a certain type of node is loaded
    // It will be used to register extensions, tools, child node scripts,
    // etc.
    scripts: {},
    // Default panels
    panels: {
      // Panel to keep the left hand browser tree
      'browser': new pgAdmin.Browser.Panel({
        name: 'browser',
        title: gettext('Browser'),
        showTitle: true,
        isCloseable: false,
        isPrivate: true,
        icon: 'fa fa-binoculars',
        content: '<div id="tree" class="aciTree"></div>'
      }),
      // Properties of the object node
      'properties': new pgAdmin.Browser.Panel({
        name: 'properties',
        title: gettext('Properties'),
        icon: 'fa fa-cogs',
        width: 500,
        isCloseable: false,
        isPrivate: true,
        elContainer: true,
        content: '<div class="obj_properties"><div class="alert alert-info pg-panel-message">' + select_object_msg + '</div></div>',
        events: panelEvents,
        onCreate: function onCreate(myPanel, $container) {
          $container.addClass('pg-no-overflow');
        }
      }),
      // Statistics of the object
      'statistics': new pgAdmin.Browser.Panel({
        name: 'statistics',
        title: gettext('Statistics'),
        icon: 'fa fa-line-chart',
        width: 500,
        isCloseable: false,
        isPrivate: true,
        content: '<div><div class="alert alert-info pg-panel-message pg-panel-statistics-message">' + select_object_msg + '</div><div class="pg-panel-statistics-container hidden"></div></div>',
        events: panelEvents
      }),
      // Reversed engineered SQL for the object
      'sql': new pgAdmin.Browser.Panel({
        name: 'sql',
        title: gettext('SQL'),
        icon: 'fa fa-file-text-o',
        width: 500,
        isCloseable: false,
        isPrivate: true,
        content: '<textarea id="sql-textarea" name="sql-textarea"></textarea>'
      }),
      // Dependencies of the object
      'dependencies': new pgAdmin.Browser.Panel({
        name: 'dependencies',
        title: gettext('Dependencies'),
        icon: 'fa fa-hand-o-up',
        width: 500,
        isCloseable: false,
        isPrivate: true,
        content: '<div><div class="alert alert-info pg-panel-message pg-panel-depends-message">' + select_object_msg + '</div><div class="pg-panel-depends-container hidden"></div></div>',
        events: panelEvents
      }),
      // Dependents of the object
      'dependents': new pgAdmin.Browser.Panel({
        name: 'dependents',
        title: gettext('Dependents'),
        icon: 'fa fa-hand-o-down',
        width: 500,
        isCloseable: false,
        isPrivate: true,
        content: '<div><div class="alert alert-info pg-panel-message pg-panel-depends-message">' + select_object_msg + '</div><div class="pg-panel-depends-container hidden"></div></div>',
        events: panelEvents
      })
    },
    // We also support showing dashboards, HTML file, external URL
    frames: {},
    /* Menus */
    // pgAdmin.Browser.MenuItem.add_menus(...) will register all the menus
    // in this container
    menus: {
      // All context menu goes here under certain menu types.
      // i.e. context: {'server': [...], 'server-group': [...]}
      context: {},
      // File menus
      file: {},
      // Edit menus
      edit: {},
      // Object menus
      object: {},
      // Management menus
      management: {},
      // Tools menus
      tools: {},
      // Help menus
      help: {}
    },
    add_panels: function add_panels() {
      /* Add hooked-in panels by extensions */
      var panels = JSON.parse(pgBrowser.panels_items);
      _.each(panels, function (panel) {
        if (panel.isIframe) {
          pgBrowser.frames[panel.name] = new pgBrowser.Frame({
            name: panel.name,
            title: panel.title,
            icon: panel.icon,
            width: panel.width,
            height: panel.height,
            showTitle: panel.showTitle,
            isCloseable: panel.isCloseable,
            isPrivate: panel.isPrivate,
            url: panel.content
          });
        } else {
          pgBrowser.panels[panel.name] = new pgBrowser.Panel({
            name: panel.name,
            title: panel.title,
            icon: panel.icon,
            width: panel.width,
            height: panel.height,
            showTitle: panel.showTitle,
            isCloseable: panel.isCloseable,
            isPrivate: panel.isPrivate,
            content: panel.content ? panel.content : '',
            events: panel.events ? panel.events : '',
            canHide: panel.canHide ? panel.canHide : ''
          });
        }
      });
    },
    menu_categories: {
      /* name, label (pair) */
      'create': {
        label: gettext('Create'),
        priority: 1,
        /* separator above this menu */
        above: false,
        below: true,
        /* icon: 'fa fa-magic', */
        single: true
      }
    },
    // A callback to load/fetch a script when a certain node is loaded
    register_script: function register_script(n, m, p) {
      var scripts = this.scripts;
      scripts[n] = _.isArray(scripts[n]) ? scripts[n] : [];
      scripts[n].push({ 'name': m, 'path': p, loaded: false });
    },
    // Build the default layout
    buildDefaultLayout: function buildDefaultLayout() {
      var browserPanel = this.docker.addPanel('browser', wcDocker.DOCK.LEFT);
      var dashboardPanel = this.docker.addPanel('dashboard', wcDocker.DOCK.RIGHT, browserPanel);
      this.docker.addPanel('properties', wcDocker.DOCK.STACKED, dashboardPanel, {
        tabOrientation: wcDocker.TAB.TOP
      });
      this.docker.addPanel('sql', wcDocker.DOCK.STACKED, dashboardPanel);
      this.docker.addPanel('statistics', wcDocker.DOCK.STACKED, dashboardPanel);
      this.docker.addPanel('dependencies', wcDocker.DOCK.STACKED, dashboardPanel);
      this.docker.addPanel('dependents', wcDocker.DOCK.STACKED, dashboardPanel);
    },
    // Enable/disable menu options
    enable_disable_menus: function enable_disable_menus(item) {
      // Mechanism to enable/disable menus depending on the condition.
      var obj = this,
          j,
          e,

      // menu navigation bar
      navbar = $('#navbar-menu > ul').first(),

      // Drop down menu for objects
      $obj_mnu = navbar.find('li#mnu_obj > ul.dropdown-menu').first(),

      // data for current selected object
      d = obj.tree.itemData(item),
          update_menuitem = function update_menuitem(m) {
        if (m instanceof pgAdmin.Browser.MenuItem) {
          m.update(d, item);
        } else {
          for (var key in m) {
            update_menuitem(m[key]);
          }
        }
      };

      // All menus from the object menus (except the create drop-down
      // menu) needs to be removed.
      $obj_mnu.empty();

      // All menus (except for the object menus) are already present.
      // They will just require to check, wheather they are
      // enabled/disabled.
      _.each([{ m: 'file', id: '#mnu_file' }, { m: 'edit', id: '#mnu_edit' }, { m: 'management', id: '#mnu_management' }, { m: 'tools', id: '#mnu_tools' }, { m: 'help', id: '#mnu_help' }], function (o) {
        _.each(obj.menus[o.m], function (m, k) {
          update_menuitem(m);
        });
      });

      // Create the object menu dynamically
      if (item && obj.menus['object'] && obj.menus['object'][d._type]) {
        pgAdmin.Browser.MenuCreator($obj_mnu, obj.menus['object'][d._type], obj.menu_categories, d, item);
      } else {
        // Create a dummy 'no object seleted' menu
        var create_submenu = pgAdmin.Browser.MenuGroup(obj.menu_categories['create'], [{
          $el: $('<li class="menu-item disabled"><a href="#">' + gettext("No object selected") + '</a></li>'),
          priority: 1,
          category: 'create',
          update: function update() {}
        }], false);
        $obj_mnu.append(create_submenu.$el);
      }
    },
    save_current_layout: function save_current_layout(obj) {
      if (obj.docker) {
        var state = obj.docker.save();
        var settings = { setting: "Browser/Layout", value: state };
        $.ajax({
          type: 'POST',
          url: url_for('settings.store_bulk'),
          data: settings
        });
      }
    },
    init: function init() {
      var obj = this;
      if (obj.initialized) {
        return;
      }
      obj.initialized = true;

      // Cache preferences
      obj.cache_preferences();
      this.add_panels();
      // Initialize the Docker
      obj.docker = new wcDocker('#dockerContainer', {
        allowContextMenu: true,
        allowCollapse: false,
        themePath: '../static/css/',
        theme: 'webcabin.overrides.css'
      });
      if (obj.docker) {
        // Initialize all the panels
        _.each(obj.panels, function (panel, name) {
          obj.panels[name].load(obj.docker);
        });
        // Initialize all the frames
        _.each(obj.frames, function (frame, name) {
          obj.frames[name].load(obj.docker);
        });

        // Stored layout in database from the previous session
        var layout = pgBrowser.utils.layout;

        // Try to restore the layout if there is one
        if (layout != '') {
          try {
            obj.docker.restore(layout);
          } catch (err) {
            obj.docker.clear();
            obj.buildDefaultLayout();
          }
        } else {
          obj.buildDefaultLayout();
        }

        // Listen to panel attach/detach event so that last layout will be remembered
        _.each(obj.panels, function (panel, name) {
          if (panel.panel) {
            panel.panel.on(wcDocker.EVENT.ATTACHED, function () {
              obj.save_current_layout(obj);
            });
            panel.panel.on(wcDocker.EVENT.DETACHED, function () {
              obj.save_current_layout(obj);
            });
            panel.panel.on(wcDocker.EVENT.MOVE_ENDED, function () {
              obj.save_current_layout(obj);
            });
          }
        });
      }

      // Syntax highlight the SQL Pane
      obj.editor = CodeMirror.fromTextArea(document.getElementById("sql-textarea"), {
        lineNumbers: true,
        mode: "text/x-pgsql",
        readOnly: true,
        extraKeys: pgAdmin.Browser.editor_shortcut_keys,
        tabSize: pgAdmin.Browser.editor_options.tabSize,
        lineWrapping: pgAdmin.Browser.editor_options.wrapCode,
        autoCloseBrackets: pgAdmin.Browser.editor_options.insert_pair_brackets,
        matchBrackets: pgAdmin.Browser.editor_options.brace_matching
      });

      setTimeout(function () {
        obj.editor.refresh();
      }, 10);

      // Initialise the treeview
      initializeBrowserTree(obj);

      // Build the treeview context menu
      $('#tree').contextMenu({
        selector: '.aciTreeLine',
        autoHide: false,
        build: function build(element) {
          var item = obj.tree.itemFrom(element),
              d = obj.tree.itemData(item),
              menus = obj.menus['context'][d._type],
              $div = $('<div></div>'),
              context_menu = {};

          pgAdmin.Browser.MenuCreator($div, menus, obj.menu_categories, d, item, context_menu);

          return {
            autoHide: false,
            items: context_menu
          };
        }
      });

      // Treeview event handler
      $('#tree').on('acitree', function (event, api, item, eventName, options) {
        var d = item ? obj.tree.itemData(item) : null;

        switch (eventName) {
          // When a node is added in the browser tree, we need to
          // load the registered scripts
          case "added":
            if (d) {
              /* Loading all the scripts registered to be loaded on this node */
              if (obj.scripts && obj.scripts[d._type]) {
                var scripts = _.extend({}, obj.scripts[d._type]);

                /*
                 * We can remove it from the Browser.scripts object as
                 * these're about to be loaded.
                 *
                 * This will make sure that we check for the script to be
                 * loaded only once.
                 *
                 */
                delete obj.scripts[d._type];
              }
            }
            break;
        }

        var node;

        if (d && obj.Nodes[d._type]) {
          node = obj.Nodes[d._type];

          /* If the node specific callback returns false, we will also return
           * false for further processing.
           */
          if (_.isObject(node.callbacks) && eventName in node.callbacks && typeof node.callbacks[eventName] == 'function' && !node.callbacks[eventName].apply(node, [item, d, obj, options, eventName])) {
            return false;
          }
          /* Raise tree events for the nodes */
          try {
            node.trigger('browser-node.' + eventName, node, item, d);
          } catch (e) {
            console.log(e);
          }
        }

        try {
          obj.Events.trigger('pgadmin-browser:tree', eventName, item, d);
          obj.Events.trigger('pgadmin-browser:tree:' + eventName, item, d, node);
        } catch (e) {
          console.log(e);
        }
        return true;
      });

      // Register scripts and add menus
      pgBrowser.utils.registerScripts(this);
      pgBrowser.utils.addMenus(obj);

      // Ping the server every 5 minutes
      setInterval(function () {
        $.ajax({
          url: url_for('misc.ping'),
          type: 'POST',
          success: function success() {},
          error: function error() {}
        });
      }, 300000);
      obj.Events.on('pgadmin:browser:tree:add', obj.onAddTreeNode, obj);
      obj.Events.on('pgadmin:browser:tree:update', obj.onUpdateTreeNode, obj);
      obj.Events.on('pgadmin:browser:tree:refresh', obj.onRefreshTreeNode, obj);
    },

    add_menu_category: function add_menu_category(id, label, priority, icon, above_separator, below_separator, single) {
      this.menu_categories[id] = {
        label: label,
        priority: priority,
        icon: icon,
        above: above_separator === true,
        below: below_separator === true,
        single: single
      };
    },

    // This will hold preference data (Works as a cache object)
    // Here node will be a key and it's preference data will be value
    preferences_cache: {},

    // Add menus of module/extension at appropriate menu
    add_menus: function add_menus(menus) {
      var self = this,
          pgMenu = this.menus,
          MenuItem = pgAdmin.Browser.MenuItem;
      _.each(menus, function (m) {
        _.each(m.applies, function (a) {
          /* We do support menu type only from this list */
          if ($.inArray(a, ['context', 'file', 'edit', 'object', 'management', 'tools', 'help']) >= 0) {
            var menus;

            // If current node is not visible in browser tree
            // then return from here
            if (!checkNodeVisibility(self, m.node)) {
              return;
            } else if (_.has(m, 'module') && !_.isUndefined(m.module)) {
              // If module to which this menu applies is not visible in
              // browser tree then also we do not display menu
              if (!checkNodeVisibility(self, m.module.type)) {
                return;
              }
            }

            pgMenu[a] = pgMenu[a] || {};
            if (_.isString(m.node)) {
              menus = pgMenu[a][m.node] = pgMenu[a][m.node] || {};
            } else if (_.isString(m.category)) {
              menus = pgMenu[a][m.category] = pgMenu[a][m.category] || {};
            } else {
              menus = pgMenu[a];
            }

            if (!_.has(menus, m.name)) {
              menus[m.name] = new MenuItem({
                name: m.name, label: m.label, module: m.module,
                category: m.category, callback: m.callback,
                priority: m.priority, data: m.data, url: m.url,
                target: m.target, icon: m.icon,
                enable: m.enable == '' ? true : _.isString(m.enable) && m.enable.toLowerCase() == 'false' ? false : m.enable,
                node: m.node
              });
            }
          } else {
            console && console.log && console.log("Developer warning: Category '" + a + "' is not supported!\nSupported categories are: context, file, edit, object, tools, management, help");
          }
        });
      });
    },
    // Create the menus
    create_menus: function create_menus() {

      /* Create menus */
      var navbar = $('#navbar-menu > ul').first();
      var obj = this;

      _.each([{ menu: 'file', id: '#mnu_file' }, { menu: 'edit', id: '#mnu_edit' }, { menu: 'management', id: '#mnu_management' }, { menu: 'tools', id: '#mnu_tools' }, { menu: 'help', id: '#mnu_help' }], function (o) {
        var $mnu = navbar.children(o.id).first(),
            $dropdown = $mnu.children('.dropdown-menu').first();
        $dropdown.empty();
        var menus = {};

        if (pgAdmin.Browser.MenuCreator($dropdown, obj.menus[o.menu], obj.menu_categories)) {
          $mnu.removeClass('hide');
        }
      });

      navbar.children('#mnu_obj').removeClass('hide');
      obj.enable_disable_menus();
    },
    // General function to handle callbacks for object or dialog help.
    showHelp: function showHelp(type, url, node, item, label) {
      if (type == "object_help") {
        // See if we can find an existing panel, if not, create one
        var pnlSqlHelp = this.docker.findPanels('pnl_sql_help')[0];

        if (pnlSqlHelp == null) {
          var pnlProperties = this.docker.findPanels('properties')[0];
          this.docker.addPanel('pnl_sql_help', wcDocker.DOCK.STACKED, pnlProperties);
          pnlSqlHelp = this.docker.findPanels('pnl_sql_help')[0];
        }

        // Construct the URL
        var server = node.getTreeNodeHierarchy(item).server;
        var baseUrl = pgBrowser.utils.pg_help_path;
        if (server.server_type == 'ppas') {
          baseUrl = pgBrowser.utils.edbas_help_path;
        }

        var major = Math.floor(server.version / 10000),
            minor = Math.floor(server.version / 100) - major * 100;

        baseUrl = baseUrl.replace('$VERSION$', major + '.' + minor);
        if (!S(baseUrl).endsWith('/')) {
          baseUrl = baseUrl + '/';
        }
        var fullUrl = baseUrl + url;
        // Update the panel
        var iframe = $(pnlSqlHelp).data('embeddedFrame');
        pnlSqlHelp.title('Help: ' + label);

        pnlSqlHelp.focus();
        iframe.openURL(fullUrl);
      } else if (type == "dialog_help") {
        if (this.docker) {
          // See if we can find an existing panel, if not, create one
          var pnlDialogHelp = this.docker.findPanels('pnl_online_help')[0];

          if (pnlDialogHelp == null) {
            var pnlProperties = this.docker.findPanels('properties')[0];
            this.docker.addPanel('pnl_online_help', wcDocker.DOCK.STACKED, pnlProperties);
            pnlDialogHelp = this.docker.findPanels('pnl_online_help')[0];
          }

          // Update the panel
          var iframe = $(pnlDialogHelp).data('embeddedFrame');

          pnlDialogHelp.focus();
          iframe.openURL(url);
        } else {
          // We have added new functionality of opening Query tool & debugger in new
          // browser tab, In that case we will not have docker object available
          // so we will open dialog help in new browser tab
          window.open(url, '_blank');
        }
      }
    },

    // Get preference value from cache
    get_preference: function get_preference(module, preference) {
      var self = this;
      // If cache is not yet loaded then keep checking
      if (_.size(self.preferences_cache) == 0) {
        var check_preference = function check_preference() {
          if (_.size(self.preferences_cache) > 0) {
            clearInterval(preference_data);
            return _.findWhere(self.preferences_cache, { 'module': module, 'name': preference });
          }
        };

        var preference_data = setInterval(check_preference, 1000);
      } else {
        return _.findWhere(self.preferences_cache, { 'module': module, 'name': preference });
      }
    },

    // Get and cache the preferences
    cache_preferences: function cache_preferences() {
      var self = this;
      $.ajax({
        url: url_for('preferences.get_all'),
        success: function success(res) {
          self.preferences_cache = res;
        },
        error: function error(xhr, status, _error) {
          try {
            var err = $.parseJSON(xhr.responseText);
            Alertify.alert(gettext('Preference loading failed.'), err.errormsg);
          } catch (e) {}
        }
      });
    },

    _findTreeChildNode: function _findTreeChildNode(_i, _d, _o) {
      var loaded = _o.t.wasLoad(_i),
          done = true,
          onLoad = function onLoad() {
        var items = _o.t.children(_i),
            i,
            d,
            n,
            idx = 0,
            size = items.length;
        for (; idx < size; idx++) {
          i = items.eq(idx);
          d = _o.t.itemData(i);
          if (d._type === _d._type) {
            if (!_o.hasId || d._id == _d._id) {
              _o.i = i;
              _o.d = _d;
              _o.pI.push({ coll: false, item: i, d: _d });

              _o.success();
              return;
            }
          } else {
            n = _o.b.Nodes[d._type];
            // Are we looking at the collection node for the given node?
            if (n && n.collection_node && d.nodes && _.indexOf(d.nodes, _d._type) != -1) {
              _o.i = i;
              _o.d = null;
              _o.pI.push({ coll: true, item: i, d: d });

              // Set load to false when the current collection node's inode is false
              if (!_o.t.isInode(i)) {
                _o.load = false;
              }
              _o.b._findTreeChildNode(i, _d, _o);
              return;
            }
          }
        }
        _o.notFound && typeof _o.notFound == 'function' && _o.notFound(_d);
      };

      if (!loaded && _o.load) {
        _o.t.open(_i, {
          success: onLoad,
          unanimated: true,
          fail: function fail() {
            var fail = _o && _o.o && _o.o.fail;

            if (fail && typeof fail == 'function') {
              fail.apply(_o.t, []);
            }
          }
        });
      } else if (loaded) {
        onLoad();
      } else {
        _o.notFound && typeof _o.notFound == 'function' && _o.notFound(_d);
      }

      return;
    },

    onAddTreeNode: function onAddTreeNode(_data, _hierarchy, _opts) {
      var ctx = {
        b: this, // Browser
        d: null, // current parent
        hasId: true,
        i: null, // current item
        p: _.toArray(_hierarchy || {}).sort(function (a, b) {
          return a.priority === b.priority ? 0 : a.priority < b.priority ? -1 : 1;
        }), // path of the parent
        pI: [], // path Item
        t: this.tree, // Tree Api
        o: _opts
      },
          traversePath = function () {
        var ctx = this,
            i,
            d;

        ctx.success = traversePath;
        if (ctx.p.length) {
          d = ctx.p.shift();
          // This is the parent node.
          // Replace the parent-id of the data, which could be different
          // from the given hierarchy.
          if (!ctx.p.length) {
            d._id = _data._pid;
            ctx.success = addItemNode;
          }
          ctx.b._findTreeChildNode(ctx.i, d, ctx);
          // if parent node is null
          if (!_data._pid) {
            addItemNode.apply(ctx, arguments);
          }
        }
        return true;
      }.bind(ctx),
          addItemNode = function () {
        // Append the new data in the tree under the current item.
        // We may need to pass it to proper collection node.
        var ctx = this,
            first = (ctx.i || this.t.wasLoad(ctx.i)) && this.t.first(ctx.i),
            findChildNode = function (success, notFound) {
          var ctx = this;
          ctx.success = success;
          ctx.notFound = notFound;

          ctx.b._findTreeChildNode(ctx.i, _data, ctx);
        }.bind(ctx),
            selectNode = function () {
          this.t.openPath(this.i);
          this.t.select(this.i);
          if (ctx.o && ctx.o.success && typeof ctx.o.success == 'function') {
            ctx.o.success.apply(ctx.t, [ctx.i, _data]);
          }
        }.bind(ctx),
            addNode = function () {
          var ctx = this,
              items = ctx.t.children(ctx.i),
              s = 0,
              e = items.length - 1,
              i,
              linearSearch = function linearSearch() {
            while (e >= s) {
              i = items.eq(s);
              var d = ctx.t.itemData(i);
              if (pgAdmin.natural_sort(d._label, _data._label) == 1) return true;
              s++;
            }
            if (e != items.length - 1) {
              i = items.eq(e);
              return true;
            }
            i = null;
            return false;
          },
              binarySearch = function binarySearch() {
            var d, m;
            // Binary search only outperforms Linear search for n > 44.
            // Reference:
            // https://en.wikipedia.org/wiki/Binary_search_algorithm#cite_note-30
            //
            // We will try until it's half.
            while (e - s > 22) {
              i = items.eq(s);
              var d = ctx.t.itemData(i);
              if (pgAdmin.natural_sort(d._label, _data._label) != -1) return true;
              i = items.eq(e);
              d = ctx.t.itemData(i);
              if (pgAdmin.natural_sort(d._label, _data._label) != 1) return true;
              var m = s + Math.round((e - s) / 2);
              i = items.eq(m);
              d = ctx.t.itemData(i);
              var res = pgAdmin.natural_sort(d._label, _data._label);
              if (res == 0) return true;

              if (res == -1) {
                s = m + 1;
                e--;
              } else {
                s++;
                e = m - 1;
              }
            }
            return linearSearch();
          };

          if (binarySearch()) {
            ctx.t.before(i, {
              itemData: _data,
              success: function success() {
                if (ctx.o && ctx.o.success && typeof ctx.o.success == 'function') {
                  ctx.o.success.apply(ctx.t, [i, _data]);
                }
              },
              fail: function fail() {
                console.log('Failed to add before..');
                if (ctx.o && ctx.o.fail && typeof ctx.o.fail == 'function') {
                  ctx.o.fail.apply(ctx.t, [i, _data]);
                }
              }
            });
          } else {
            var _append = function () {
              var ctx = this,
                  is_parent_loaded_before = ctx.t.wasLoad(ctx.i),
                  _parent_data = ctx.t.itemData(ctx.i);

              ctx.t.append(ctx.i, {
                itemData: _data,
                success: function success(item, options) {
                  var i = $(options.items[0]);
                  // Open the item path only if its parent is loaded
                  // or parent type is same as nodes
                  if (is_parent_loaded_before && _parent_data && _parent_data._type.search(_data._type) > -1) {
                    ctx.t.openPath(i);
                    ctx.t.select(i);
                  } else {
                    if (_parent_data) {
                      // Unload the parent node so that we'll get
                      // latest data when we try to expand it
                      ctx.t.unload(ctx.i, {
                        success: function success(item, options) {
                          // Lets try to load it now
                          ctx.t.open(item);
                        }
                      });
                    }
                  }
                  if (ctx.o && ctx.o.success && typeof ctx.o.success == 'function') {
                    ctx.o.success.apply(ctx.t, [i, _data]);
                  }
                },
                fail: function fail() {
                  console.log('Failed to append');
                  if (ctx.o && ctx.o.fail && typeof ctx.o.fail == 'function') {
                    ctx.o.fail.apply(ctx.t, [ctx.i, _data]);
                  }
                }
              });
            }.bind(ctx);

            if (ctx.i && !ctx.t.isInode(ctx.i)) {
              ctx.t.setInode(ctx.i, { success: _append });
            } else {
              // Handle case for node without parent i.e. server-group
              // or if parent node's inode is true.
              _append();
            }
          }
        }.bind(ctx);

        // Parent node do not have any children, let me unload it.
        if (!first && ctx.t.wasLoad(ctx.i)) {
          ctx.t.unload(ctx.i, {
            success: function () {
              findChildNode(selectNode, function () {
                var o = this && this.o;
                if (o && o.fail && typeof o.fail == 'function') {
                  o.fail.apply(this.t, [this.i, _data]);
                }
              }.bind(this));
            }.bind(this),
            fail: function () {
              var o = this && this.o;
              if (o && o.fail && typeof o.fail == 'function') {
                o.fail.apply(this.t, [this.i, _data]);
              }
            }.bind(this)
          });
          return;
        }

        // We can find the collection node using _findTreeChildNode
        // indirectly.
        findChildNode(selectNode, addNode);
      }.bind(ctx);

      if (!ctx.t.wasInit() || !_data) {
        return;
      }
      _data._label = _data.label;
      _data.label = _.escape(_data.label);

      traversePath();
    },

    onUpdateTreeNode: function onUpdateTreeNode(_old, _new, _hierarchy, _opts) {
      var ctx = {
        b: this, // Browser
        d: null, // current parent
        i: null, // current item
        hasId: true,
        p: _.toArray(_hierarchy || {}).sort(function (a, b) {
          return a.priority === b.priority ? 0 : a.priority < b.priority ? -1 : 1;
        }), // path of the old object
        pI: [], // path items
        t: this.tree, // Tree Api
        o: _opts,
        load: true,
        old: _old,
        new: _new,
        op: null
      },
          errorOut = function () {
        var fail = this.o && this.o.fail;
        if (fail && typeof fail == 'function') {
          fail.apply(this.t, [this.i, _new, _old]);
        }
      }.bind(ctx),
          deleteNode = function () {
        var self = this,
            pI = this.pI,
            findParent = function () {
          if (pI.length) {
            pI.pop();
            var length = pI.length;
            this.i = length && pI[length - 1].item || null;
            this.d = length && pI[length - 1].d || null;

            // It is a collection item, let's find the node item
            if (length && pI[length - 1].coll) {
              pI.pop();
              length = pI.length;
              this.i = length && pI[length - 1].item || null;
              this.d = length && pI[length - 1].d || null;
            }
          } else {
            this.i = null;
            this.d = null;
          }
        }.bind(this);

        var _item_parent = this.i && this.t.hasParent(this.i) && this.t.parent(this.i) || null,
            _item_grand_parent = _item_parent ? this.t.hasParent(_item_parent) && this.t.parent(_item_parent) : null;

        // Remove the current node first.
        if (this.i && this.d && this.old._id == this.d._id && this.old._type == this.d._type) {
          var _parent = this.t.parent(this.i) || null;

          // If there is no parent then just update the node
          if (_parent.length == 0 && ctx.op == 'UPDATE') {
            updateNode();
          } else {
            var postRemove = function () {
              // If item has parent but no grand parent
              if (_item_parent && !_item_grand_parent) {
                var parent = null;
                // We need to search in all parent siblings (eg: server groups)
                var parents = this.t.siblings(this.i) || [];
                parents.push(this.i[0]);
                _.each(parents, function (p) {
                  var d = self.t.itemData($(p));
                  // If new server group found then assign it parent
                  if (d._id == self.new._pid) {
                    parent = p;
                    self.pI.push({ coll: true, item: parent, d: d });
                  }
                });

                if (parent) {
                  this.load = true;

                  this.success = function () {
                    addItemNode();
                  }.bind(this);
                  // We can refresh the collection node, but - let's not bother about
                  // it right now.
                  this.notFound = errorOut;

                  var _d = { _id: this.new._pid, _type: self.d._type };
                  parent = $(parent);
                  var loaded = this.t.wasLoad(parent),
                      onLoad = function onLoad() {
                    self.i = parent;
                    self.d = self.d;
                    self.pI.push({ coll: false, item: parent, d: self.d });
                    self.success();
                    return;
                  };

                  if (!loaded && self.load) {
                    self.t.open(parent, {
                      success: onLoad,
                      unanimated: true,
                      fail: function fail() {
                        var fail = self && self.o && self.o.fail;

                        if (fail && typeof fail == 'function') {
                          fail.apply(self.t, []);
                        }
                      }
                    });
                  } else {
                    onLoad();
                  }
                }
                return;
              } else {
                // This is for rest of the nodes
                var _parentData = this.d;
                // Find the grand-parent, or the collection node of parent.
                findParent();

                if (this.i) {
                  this.load = true;

                  this.success = function () {
                    addItemNode();
                  }.bind(this);
                  // We can refresh the collection node, but - let's not bother about
                  // it right now.
                  this.notFound = errorOut;

                  // Find the new parent
                  this.b._findTreeChildNode(this.i, { _id: this.new._pid, _type: _parentData._type }, this);
                } else {
                  addItemNode();
                }
                return;
              }
            }.bind(this);

            // If there is a parent then we can remove the node
            this.t.remove(this.i, {
              success: function success() {
                // Find the parent
                findParent();
                // If server group have no children then close it and set inode
                // and unload it so it can fetch new data on next expand
                if (_item_parent && !_item_grand_parent && _parent && self.t.children(_parent).length == 0) {
                  self.t.setInode(_parent, {
                    success: function success() {
                      self.t.unload(_parent, { success: function success() {
                          setTimeout(postRemove);
                        } });
                    }
                  });
                } else {
                  setTimeout(postRemove);
                }
                return true;
              }
            });
          }
        }
        errorOut();
      }.bind(ctx),
          findNewParent = function (_d) {
        var findParent = function () {
          if (pI.length) {
            pI.pop();
            var length = pI.length;
            this.i = length && pI[length - 1].item || null;
            this.d = length && pI[length - 1].d || null;

            // It is a collection item, let's find the node item
            if (length && pI[length - 1].coll) {
              pI.pop();
              length = pI.length;
              this.i = length && pI[length - 1].item || null;
              this.d = length && pI[length - 1].d || null;
            }
          } else {
            this.i = null;
            this.d = null;
          }
        }.bind(this);

        // old parent was not found, can we find the new parent?
        if (this.i) {
          this.load = true;
          this.success = function () {
            addItemNode();
          }.bind(this);

          if (_d._type == old._type) {
            // We were already searching the old object under the parent.
            findParent();
            _d = this.d;
            // Find the grand parent
            findParent();
          }
          console.log(_d);
          _d = this.new._pid;

          // We can refresh the collection node, but - let's not bother about
          // it right now.
          this.notFound = errorOut;

          // Find the new parent
          this.b._findTreeChildNode(this.i, _d, this);
        } else {
          addItemNode();
        }
      }.bind(ctx),
          updateNode = function () {
        if (this.i && this.d && this.new._type == this.d._type) {
          var self = this,
              _id = this.d._id;
          if (this.new._id != this.d._id) {
            // Found the new oid, update its node_id
            var node_data = this.t.itemData(ctx.i);
            node_data._id = _id = this.new._id;
          }
          if (this.new._id == _id) {
            // Found the current
            _.extend(this.d, {
              '_id': this.new._id,
              '_label': this.new._label,
              'label': this.new.label
            });
            this.t.setLabel(ctx.i, { label: this.new.label });
            this.t.addIcon(ctx.i, { icon: this.new.icon });
            this.t.setId(ctx.i, { id: this.new.id });
            this.t.openPath(this.i);
            this.t.deselect(this.i);

            // select tree item after few milliseconds
            setTimeout(function () {
              self.t.select(self.i);
            }, 10);
          }
        }
        var success = this.o && this.o.success;
        if (success && typeof success == 'function') {
          success.apply(this.t, [this.i, _old, _new]);
        }
      }.bind(ctx),
          traversePath = function () {
        var ctx = this,
            i,
            d;

        ctx.success = traversePath;
        if (ctx.p.length) {
          d = ctx.p.shift();
          // This is the node, we can now do the required operations.
          // We should first delete the existing node, if the parent-id is
          // different.
          if (!ctx.p.length) {
            if (ctx.op == 'RECREATE') {
              ctx.load = false;
              ctx.success = deleteNode;
              ctx.notFound = findNewParent;
            } else {
              ctx.success = updateNode;
              ctx.notFound = errorOut;
            }
          }
          ctx.b._findTreeChildNode(ctx.i, d, ctx);
        } else if (ctx.p.length == 1) {
          ctx.notFound = findNewParent;
        }
        return true;
      }.bind(ctx),
          addItemNode = function () {
        var ctx = this,
            first = (ctx.i || this.t.wasLoad(ctx.i)) && this.t.first(ctx.i),
            findChildNode = function (success, notFound) {
          var ctx = this;
          ctx.success = success;
          ctx.notFound = notFound;

          ctx.b._findTreeChildNode(ctx.i, _new, ctx);
        }.bind(ctx),
            selectNode = function () {
          this.t.openPath(this.i);
          this.t.select(this.i);
          if (ctx.o && ctx.o.success && typeof ctx.o.success == 'function') {
            ctx.o.success.apply(ctx.t, [ctx.i, _new]);
          }
        }.bind(ctx),
            addNode = function () {
          var ctx = this,
              items = ctx.t.children(ctx.i),
              s = 0,
              e = items.length - 1,
              i,
              linearSearch = function linearSearch() {
            while (e >= s) {
              i = items.eq(s);
              var d = ctx.t.itemData(i);
              if (pgAdmin.natural_sort(d._label, _new._label) == 1) return true;
              s++;
            }
            if (e != items.length - 1) {
              i = items.eq(e);
              return true;
            }
            i = null;
            return false;
          },
              binarySearch = function binarySearch() {
            while (e - s > 22) {
              i = items.eq(s);
              var d = ctx.t.itemData(i);
              if (pgAdmin.natural_sort(d._label, _new._label) != -1) return true;
              i = items.eq(e);
              d = ctx.t.itemData(i);
              if (pgAdmin.natural_sort(d._label, _new._label) != 1) return true;
              var m = s + Math.round((e - s) / 2);
              i = items.eq(m);
              d = ctx.t.itemData(i);
              var res = pgAdmin.natural_sort(d._label, _new._label);
              if (res == 0) return true;

              if (res == -1) {
                s = m + 1;
                e--;
              } else {
                s++;
                e = m - 1;
              }
            }
            return linearSearch();
          };

          if (binarySearch()) {
            ctx.t.before(i, {
              itemData: _new,
              success: function success() {
                var new_item = $(arguments[1].items[0]);
                ctx.t.openPath(new_item);
                ctx.t.select(new_item);
                if (ctx.o && ctx.o.success && typeof ctx.o.success == 'function') {
                  ctx.o.success.apply(ctx.t, [i, _old, _new]);
                }
              },
              fail: function fail() {
                console.log('Failed to add before..');
                if (ctx.o && ctx.o.fail && typeof ctx.o.fail == 'function') {
                  ctx.o.fail.apply(ctx.t, [i, _old, _new]);
                }
              }
            });
          } else {
            var _appendNode = function _appendNode() {
              ctx.t.append(ctx.i, {
                itemData: _new,
                success: function success() {
                  var new_item = $(arguments[1].items[0]);
                  ctx.t.openPath(new_item);
                  ctx.t.select(new_item);
                  if (ctx.o && ctx.o.success && typeof ctx.o.success == 'function') {
                    ctx.o.success.apply(ctx.t, [ctx.i, _old, _new]);
                  }
                },
                fail: function fail() {
                  console.log('Failed to append');
                  if (ctx.o && ctx.o.fail && typeof ctx.o.fail == 'function') {
                    ctx.o.fail.apply(ctx.t, [ctx.i, _old, _new]);
                  }
                }
              });
            };

            // If the current node's inode is false
            if (ctx.i && !ctx.t.isInode(ctx.i)) {
              ctx.t.setInode(ctx.i, { success: _appendNode });
            } else {
              // Handle case for node without parent i.e. server-group
              // or if parent node's inode is true.
              _appendNode();
            }
          }
        }.bind(ctx);

        // Parent node do not have any children, let me unload it.
        if (!first && ctx.t.wasLoad(ctx.i)) {
          ctx.t.unload(ctx.i, {
            success: function () {
              findChildNode(selectNode, function () {
                var o = this && this.o;
                if (o && o.fail && typeof o.fail == 'function') {
                  o.fail.apply(this.t, [this.i, _old, _new]);
                }
              }.bind(this));
            }.bind(this),
            fail: function () {
              var o = this && this.o;
              if (o && o.fail && typeof o.fail == 'function') {
                o.fail.apply(this.t, [this.i, _old, _new]);
              }
            }.bind(this)
          });
          return;
        }

        // We can find the collection node using _findTreeChildNode
        // indirectly.
        findChildNode(selectNode, addNode);
      }.bind(ctx);

      if (!ctx.t.wasInit() || !_new || !_old) {
        return;
      }
      ctx.pI.push(_old);
      _new._label = _new.label;
      _new.label = _.escape(_new.label);

      // We need to check if this is collection node and have
      // children count, if yes then add count with label too
      if (ctx.b.Nodes[_new._type].is_collection) {
        if ('collection_count' in _old && _old['collection_count'] > 0) {
          _new.label = _.escape(_new._label) + ' <span>(' + _old['collection_count'] + ')</span>';
        }
      }

      if (_old._pid != _new._pid || _old._label != _new._label) {
        ctx.op = 'RECREATE';
        traversePath();
      } else {
        ctx.op = 'UPDATE';
        traversePath();
      }
    },

    onRefreshTreeNode: function onRefreshTreeNode(_i, _opts) {
      var d = _i && this.tree.itemData(_i),
          n = d && d._type && this.Nodes[d._type],
          ctx = {
        b: this, // Browser
        d: d, // current parent
        i: _i, // current item
        p: null, // path of the old object
        pI: [], // path items
        t: this.tree, // Tree Api
        o: _opts
      },
          isOpen,
          idx = -1;

      if (!n) {
        _i = null;
        ctx.i = null;
        ctx.d = null;
      } else {
        isOpen = this.tree.isInode(_i) && this.tree.isOpen(_i);
      }

      ctx.branch = ctx.t.serialize(_i, {}, function (i, el, d) {
        idx++;
        if (!idx || d.inode && d.open) {
          return {
            _id: d._id, _type: d._type, branch: d.branch, open: d.open
          };
        }
      });

      if (!n) {
        ctx.t.destroy({
          success: function success() {
            initializeBrowserTree(ctx.b);
            ctx.t = ctx.b.tree;
            ctx.i = null;
            ctx.b._refreshNode(ctx, ctx.branch);
          },
          error: function error() {
            var fail = _opts.o && _opts.o.fail || _opts.fail;

            if (typeof fail == 'function') {
              fail();
            }
          }
        });
        return;
      }
      var fetchNodeInfo = function (_i, _d, _n) {
        var info = _n.getTreeNodeHierarchy(_i),
            url = _n.generate_url(_i, 'nodes', _d, true);

        $.ajax({
          url: url,
          type: 'GET',
          cache: false,
          dataType: 'json',
          success: function success(res) {
            // Node information can come as result/data
            var data = res.result || res.data;

            data._label = data.label;
            data.label = _.escape(data.label);
            var d = ctx.t.itemData(ctx.i);
            _.extend(d, data);
            ctx.t.setLabel(ctx.i, { label: _d.label });
            ctx.t.addIcon(ctx.i, { icon: _d.icon });
            ctx.t.setId(ctx.i, { id: _d.id });
            ctx.t.setInode(ctx.i, { inode: data.inode });

            if (_n.can_expand && typeof _n.can_expand == 'function') {
              if (!_n.can_expand(d)) {
                ctx.t.unload(ctx.i);
                return;
              }
            }
            ctx.b._refreshNode(ctx, ctx.branch);
            var success = ctx.o && ctx.o.success || ctx.success;
            if (success && typeof success == 'function') {
              success();
            }
          },
          error: function error(xhr, _error2, status) {
            if (!Alertify.pgHandleItemError(xhr, _error2, status, { item: _i, info: info })) {
              var msg = xhr.responseText,
                  contentType = xhr.getResponseHeader('Content-Type'),
                  msg = xhr.responseText,
                  jsonResp = contentType && contentType.indexOf('application/json') == 0 && $.parseJSON(xhr.responseText) || {};

              if (xhr.status == 410 && jsonResp.success == 0) {
                var p = ctx.t.parent(ctx.i);

                ctx.t.remove(ctx.i, {
                  success: function success() {
                    if (p) {
                      // Try to refresh the parent on error
                      try {
                        pgBrowser.Events.trigger('pgadmin:browser:tree:refresh', p);
                      } catch (e) {}
                    }
                  }
                });
              }

              Alertify.pgNotifier(_error2, xhr, gettext("Error retrieving details for the node."), function () {
                console.log(arguments);
              });
            }
          }
        });
      }.bind(this);

      if (n && n.collection_node) {
        var p = ctx.i = this.tree.parent(_i),
            unloadNode = function () {
          this.tree.unload(_i, {
            success: function success() {
              _i = p;
              d = ctx.d = ctx.t.itemData(ctx.i);
              n = ctx.b.Nodes[d._type];
              _i = p;
              fetchNodeInfo(_i, d, n);
            },
            fail: function fail() {
              console.log(arguments);
            }
          });
        }.bind(this);
        if (!this.tree.isInode(_i)) {
          this.tree.setInode(_i, {
            success: unloadNode
          });
        } else {
          unloadNode();
        }
      } else if (isOpen) {
        this.tree.unload(_i, {
          success: fetchNodeInfo.bind(this, _i, d, n),
          fail: function fail() {
            console.log(arguments);
          }
        });
      } else if (!this.tree.isInode(_i) && d.inode) {
        this.tree.setInode(_i, {
          success: fetchNodeInfo.bind(this, _i, d, n),
          fail: function fail() {
            console.log(arguments);
          }
        });
      } else {
        fetchNodeInfo(_i, d, n);
      }
    },

    removeChildTreeNodesById: function removeChildTreeNodesById(_parentNode, _collType, _childIds) {
      var tree = pgBrowser.tree;
      if (_parentNode && _collType) {
        var children = tree.children(_parentNode),
            idx = 0,
            size = children.length,
            childNode,
            childNodeData;

        _parentNode = null;

        for (; idx < size; idx++) {
          childNode = children.eq(idx);
          childNodeData = tree.itemData(childNode);

          if (childNodeData._type == _collType) {
            _parentNode = childNode;
            break;
          }
        }
      }

      if (_parentNode) {
        var children = tree.children(_parentNode),
            idx = 0,
            size = children.length,
            childNode,
            childNodeData,
            prevChildNode;

        for (; idx < size; idx++) {
          childNode = children.eq(idx);
          childNodeData = tree.itemData(childNode);

          if (_childIds.indexOf(childNodeData._id) != -1) {
            pgBrowser.removeTreeNode(childNode, false, _parentNode);
          }
        }
        return true;
      }
      return false;
    },

    removeTreeNode: function removeTreeNode(_node, _selectNext, _parentNode) {
      var tree = pgBrowser.tree,
          nodeToSelect = null;

      if (!_node) return false;

      if (_selectNext) {
        nodeToSelect = tree.next(_node);
        if (!nodeToSelect || !nodeToSelect.length) {
          nodeToSelect = tree.prev(_node);

          if (!nodeToSelect || !nodeToSelect.length) {
            if (!_parentNode) {
              nodeToSelect = tree.parent(_node);
            } else {
              nodeToSelect = _parentNode;
            }
          }
        }
        if (nodeToSelect) tree.select(nodeToSelect);
      }
      tree.remove(_node);
      return true;
    },

    findSiblingTreeNode: function findSiblingTreeNode(_node, _id) {
      var tree = pgBrowser.tree,
          parentNode = tree.parent(_node),
          siblings = tree.children(parentNode),
          idx = 0,
          nodeData,
          node;

      for (; idx < siblings.length; idx++) {
        node = siblings.eq(idx);
        nodeData = tree.itemData(node);

        if (nodeData && nodeData._id == _id) return node;
      }
      return null;
    },

    findParentTreeNodeByType: function findParentTreeNodeByType(_node, _parentType) {
      var tree = pgBrowser.tree,
          nodeData,
          node = _node;

      do {
        nodeData = tree.itemData(node);
        if (nodeData && nodeData._type == _parentType) return node;
        node = tree.hasParent(node) ? tree.parent(node) : null;
      } while (node);

      return null;
    },

    findChildCollectionTreeNode: function findChildCollectionTreeNode(_node, _collType) {
      var tree = pgBrowser.tree,
          nodeData,
          idx = 0,
          node = _node,
          children = _node && tree.children(_node);

      if (!children || !children.length) return null;

      for (; idx < children.length; idx++) {
        node = children.eq(idx);
        nodeData = tree.itemData(node);

        if (nodeData && nodeData._type == _collType) return node;
      }
      return null;
    },

    addChildTreeNodes: function addChildTreeNodes(_treeHierarchy, _node, _type, _arrayIds, _callback) {
      var module = _type in pgBrowser.Nodes && pgBrowser.Nodes[_type],
          childTreeInfo = _arrayIds.length && _.extend({}, _.mapObject(_treeHierarchy, function (_val, _key) {
        _val.priority -= 1;return _val;
      })),
          arrayChildNodeData = [],
          fetchNodeInfo = function fetchNodeInfo(_callback) {
        if (!_arrayIds.length) {
          if (_callback) {
            _callback();
          }
          return;
        }

        var childDummyInfo = {
          '_id': _arrayIds.pop(), '_type': _type, 'priority': 0
        },
            childNodeUrl;
        childTreeInfo[_type] = childDummyInfo;

        childNodeUrl = module.generate_url(null, 'nodes', childDummyInfo, true, childTreeInfo);
        console.debug("Fetching node information using: ", childNodeUrl);

        $.ajax({
          url: childNodeUrl,
          dataType: "json",
          success: function success(res) {
            if (res.success) {
              arrayChildNodeData.push(res.data);
            }
            fetchNodeInfo(_callback);
          },
          error: function error(xhr, status, _error3) {
            try {
              var err = $.parseJSON(xhr.responseText);
              if (err.success == 0) {
                Alertify.error(err.errormsg);
              }
            } catch (e) {}
            fetchNodeInfo(_callback);
          }
        });
      };

      if (!module) {
        console.warning("Developer: Couldn't find the module for the given child: ", _.clone(arguments));
        return;
      }

      if (pgBrowser.tree.wasLoad(_node) || pgBrowser.tree.isLeaf(_node)) {
        fetchNodeInfo(function () {
          console.log('Append this nodes:', arrayChildNodeData);
          _.each(arrayChildNodeData, function (_nodData) {
            pgBrowser.Events.trigger('pgadmin:browser:tree:add', _nodData, _treeHierarchy);
          });

          if (_callback) {
            _callback();
          }
        });
      } else {
        if (_callback) {
          _callback();
        }
      }
    },

    _refreshNode: function _refreshNode(_ctx, _d) {
      var traverseNodes = function (_d) {
        var _ctx = this,
            idx = 0,
            ctx,
            d,
            size = _d.branch && _d.branch.length || 0,
            findNode = function findNode(_i, __d, __ctx) {
          setTimeout(function () {
            __ctx.b._findTreeChildNode(_i, __d, __ctx);
          }, 0);
        };

        for (; idx < size; idx++) {
          d = _d.branch[idx];
          var n = _ctx.b.Nodes[d._type];
          ctx = {
            b: _ctx.b,
            t: _ctx.t,
            pI: [],
            i: _ctx.i,
            d: d,
            select: _ctx.select,
            hasId: n && !n.collection_node,
            o: _ctx.o,
            load: true
          };
          ctx.success = function () {
            this.b._refreshNode.call(this.b, this, this.d);
          }.bind(ctx);
          findNode(_ctx.i, d, ctx);
        }
      }.bind(_ctx, _d);

      if (!_d || !_d.open) return;

      if (!_ctx.t.isOpen(_ctx.i)) {
        _ctx.t.open(_ctx.i, {
          unanimated: true,
          success: traverseNodes,
          fail: function fail() {/* Do nothing */}
        });
      } else {
        traverseNodes();
      }
    },

    editor_shortcut_keys: {
      // Autocomplete sql command
      "Ctrl-Space": "autocomplete",
      "Cmd-Space": "autocomplete",

      // Select All text
      "Ctrl-A": "selectAll",
      "Cmd-A": "selectAll",

      // Redo text
      "Ctrl-Y": "redo",
      "Cmd-Y": "redo",

      // Undo text
      "Ctrl-Z": "undo",
      "Cmd-Z": "undo",

      // Delete Line
      "Ctrl-D": "deleteLine",
      "Cmd-D": "deleteLine",

      // Go to start/end of Line
      "Alt-Left": "goLineStart",
      "Alt-Right": "goLineEnd",

      // Move word by word left/right
      "Ctrl-Alt-Left": "goGroupLeft",
      "Cmd-Alt-Left": "goGroupLeft",
      "Ctrl-Alt-Right": "goGroupRight",
      "Cmd-Alt-Right": "goGroupRight",

      // Allow user to delete Tab(s)
      "Shift-Tab": "indentLess"
    },
    editor_options: {
      tabSize: pgBrowser.utils.tabSize,
      wrapCode: pgBrowser.utils.wrapCode,
      insert_pair_brackets: pgBrowser.utils.insertPairBrackets,
      brace_matching: pgBrowser.utils.braceMatching
    }

  });

  /* Remove paste event mapping from CodeMirror's emacsy KeyMap binding
   * specific to Mac LineNumber:5797 - lib/Codemirror.js
   * It is preventing default paste event(Cmd-V) from triggering
   * in runtime.
   */
  delete CodeMirror.keyMap.emacsy["Ctrl-V"];

  // Use spaces instead of tab
  if (pgBrowser.utils.useSpaces == 'True') {
    pgAdmin.Browser.editor_shortcut_keys.Tab = "insertSoftTab";
  }

  /*window.onbeforeunload = function(ev) {
    var e = ev || window.event,
        msg = S(gettext('Are you sure you wish to close the %s browser?')).sprintf(pgBrowser.utils.app_name).value();
     // For IE and Firefox prior to version 4
    if (e) {
      e.returnValue = msg;
    }
     // For Safari
    return msg;
  };*/

  return pgAdmin.Browser;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(0), __webpack_require__(1), __webpack_require__(4), __webpack_require__(3), __webpack_require__(10), __webpack_require__(8), __webpack_require__(16), __webpack_require__(13), __webpack_require__(97), __webpack_require__(24), __webpack_require__(28), __webpack_require__(31)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, $, _, S, pgAdmin, Backbone, Alertify, Backform, Backgrid, generateUrl) {

  var pgBrowser = pgAdmin.Browser = pgAdmin.Browser || {};

  // It has already been defined.
  // Avoid running this script again.
  if (pgBrowser.Collection) return pgBrowser.Collection;

  pgBrowser.Collection = function () {};

  _.extend(pgBrowser.Collection, _.clone(pgBrowser.Node), {
    ///////
    // Initialization function
    // Generally - used to register the menus for this type of node.
    //
    // Also, look at pgAdmin.Browser.add_menus(...) function.
    //
    // Collection will not have 'Properties' menu.
    //
    // NOTE: Override this for each node for initialization purpose
    Init: function Init() {
      if (this.node_initialized) return;
      this.node_initialized = true;
      pgAdmin.Browser.add_menus([{
        name: 'refresh', node: this.type, module: this,
        applies: ['object', 'context'], callback: 'refresh',
        priority: 1, label: gettext('Refresh...'),
        icon: 'fa fa-refresh'
      }]);

      // show query tool only in context menu of supported nodes.
      if (pgAdmin.DataGrid && pgAdmin.unsupported_nodes) {
        if (_.indexOf(pgAdmin.unsupported_nodes, this.type) == -1) {
          pgAdmin.Browser.add_menus([{
            name: 'show_query_tool', node: this.type, module: this,
            applies: ['context'], callback: 'show_query_tool',
            priority: 998, label: gettext('Query Tool...'),
            icon: 'fa fa-bolt'
          }]);
        }
      }
    },
    hasId: false,
    is_collection: true,
    collection_node: true,
    // A collection will always have a collection of statistics, when the node
    // it represent will have some statistics.
    hasCollectiveStatistics: true,
    showProperties: function showProperties(item, data, panel) {
      var that = this,
          j = panel.$container.find('.obj_properties').first(),
          view = j.data('obj-view'),
          content = $('<div></div>').addClass('pg-prop-content col-xs-12'),
          node = pgBrowser.Nodes[that.node],

      // This will be the URL, used for object manipulation.
      urlBase = this.generate_url(item, 'properties', data),
          collection = new (node.Collection.extend({
        url: urlBase,
        model: node.model
      }))(),
          info = this.getTreeNodeHierarchy.apply(this, [item]),
          gridSchema = Backform.generateGridColumnsFromModel(info, node.model, 'properties', that.columns),

      // Initialize a new Grid instance
      grid = new Backgrid.Grid({
        columns: gridSchema.columns,
        collection: collection,
        className: "backgrid table-bordered"
      }),
          gridView = {
        'remove': function remove() {
          if (this.grid) {
            if (this.grid.collection) {
              this.grid.collection.reset(null, { silent: true });
              delete this.grid.collection;
            }
            delete this.grid;
            this.grid = null;
          }
        },
        grid: grid
      };

      if (view) {
        // Avoid unnecessary reloads
        if (_.isEqual($(panel).data('node-prop'), urlBase)) {
          return;
        }

        // Cache the current IDs for next time
        $(panel).data('node-prop', urlBase);

        // Reset the data object
        j.data('obj-view', null);
      }

      // Make sure the HTML element is empty.
      j.empty();
      j.data('obj-view', gridView);

      // Render subNode grid
      content.append(grid.render().$el);
      j.append(content);

      // Fetch Data
      collection.fetch({
        reset: true,
        error: function error(xhr, _error, message) {
          pgBrowser.Events.trigger('pgadmin:collection:retrieval:error', 'properties', xhr, _error, message, item, that);
          if (!Alertify.pgHandleItemError(xhr, _error, message, { item: item, info: info })) {
            Alertify.pgNotifier(_error, xhr, S(gettext("Error retrieving properties - %s.")).sprintf(message || that.label).value(), function () {
              console.log(arguments);
            });
          }
        }
      });
    },
    generate_url: function generate_url(item, type) {
      /*
      * Using list, and collection functions of a node to get the nodes
      * under the collection, and properties of the collection respectively.
      */
      var opURL = {
        'properties': 'obj', 'children': 'nodes'
      },
          self = this;
      var collectionPickFunction = function collectionPickFunction(treeInfoValue, treeInfoKey) {
        return treeInfoKey != self.type;
      };
      var treeInfo = this.getTreeNodeHierarchy(item);
      var actionType = type in opURL ? opURL[type] : type;
      return generateUrl.generate_url(pgAdmin.Browser.URL, treeInfo, actionType, self.node, collectionPickFunction);
    }
  });

  return pgBrowser.Collection;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })

});
//# sourceMappingURL=pgadmin_commons.js.map