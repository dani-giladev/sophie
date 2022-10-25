Ext.define('App.controller.main.Main', {
    extend: 'App.controller.controller',

    requires: [
        
        // Admin
        ,'App.modules.admin.UI.view.user.user'
        ,'App.modules.admin.UI.view.userGroup.userGroup'
        ,'App.modules.admin.UI.view.plugin.plugin'
        ,'App.modules.admin.UI.view.config.config'
        ,'App.modules.admin.UI.view.baseConfig.baseConfig'
        
        // Cryptos Admin (Created by wizard)
        ,'App.modules.cryptos.UI.view.userGroup.userGroup',
        'App.modules.cryptos.UI.view.user.user',
        'App.modules.cryptos.UI.view.config.config'
        // Cryptos
        ,'App.modules.cryptos.UI.view.dashboard.dashboard'
        ,'App.modules.cryptos.UI.view.robot.robot'
        ,'App.modules.cryptos.UI.view.trading.trading'
        ,'App.modules.cryptos.UI.view.reportRobots.reportRobots'
        ,'App.modules.cryptos.UI.view.symbol.symbol'
        ,'App.modules.cryptos.UI.view.reportTraining.reportTraining'
        ,'App.modules.cryptos.UI.view.reportWildTraining.reportWildTraining'
        ,'App.modules.cryptos.UI.view.reportTransaction.reportTransaction'
        ,'App.modules.cryptos.UI.view.reportProfit.reportProfit'
        ,'App.modules.cryptos.UI.view.historyRobotChanges.historyRobotChanges'
        ,'App.modules.cryptos.UI.view.manualTransaction.manualTransaction'
        ,'App.modules.cryptos.UI.view.pump.pump'
        ,'App.modules.cryptos.UI.view.wildTrainingGroup.wildTrainingGroup'
        ,'App.modules.cryptos.UI.view.floating.floating'
        ,'App.modules.cryptos.UI.view.robotGroup.robotGroup'
        ,'App.modules.cryptos.UI.view.marketCoin.marketCoin'
        ,'App.modules.cryptos.UI.view.fiatFloating.fiatFloating'
        ,'App.modules.cryptos.UI.view.reportFiatProfit.reportFiatProfit'
// [WIZARD_MODULE_TAG]
    ],
    
    common_controller: null,
    uidata: null,

    getView: function()
    {
        return Ext.ComponentQuery.query('[xtype=main]')[0];
    },
    
    initViewport: function()
    {
        var me = this;
        var view = me.getView();
        
        me.common_controller = App.app.getController('App.controller.controller');
        me.globals_controller = App.app.getController('App.controller.globals');
        me.uidata = me.common_controller.getUIData();
       
        // Set global stores
        me.globals_controller.setGlobalStores();

        Ext.QuickTips.init();

        // Loading external extjs
        Ext.Loader.loadScript('resources/js/locale/locale-' + me.getLang() + '.js');
        
        // Update title
        var main_menu_wrapper = view.down('#main-menu-wrapper');
        main_menu_wrapper.setTitle(
                me.uidata.app_name + 
                '<div style="font-size:10px;">' + 
                    me.uidata.app_version + 
                '</div>'
        );
        
        if (Ext.isEmpty(autologindata.forcemodule))
        {
             // Add main menus
            main_menu_wrapper.setVisible(true);
            /*if (Object.keys(me.uidata.modules).length !== 1)
            {
                main_menu_wrapper.setCollapsed(false);
            }*/
            me.addMainMenus();            
        }
        else
        {
            // Force module
            me.forceModule(autologindata.forcemodule);
        }
    },
    
    getUserInfo: function()
    {
        var me = this;
        var html = 
                "Hello! I am <b>" + me.uidata.user_name + "</b>" + //" and my token is <b>" + me.common_controller.getToken() + "</b>" +
                "<br>" + 
                "<br>" + 
                '';
        
        var modules = me.uidata.modules;
        if (modules.length === 0)
        {
            html += "<font color=\"red\">" + "I do not have permission to access any module" + "</font>";
        }
        else
        {
            html += 
                "I have permission to access following modules:" +
                "<br>" + 
                "<ul>" + 
                '';
            var module;
            for(var code in modules)
            {
                module = modules[code];
                html += "<li>" + module.description + "</li>";
            }
            html += "</ul>";
        }
        
        return html;
    },

    getAppName: function()
    {
        var me = this;

        return me.uidata.app_name;
    },

    getAppVersion: function()
    {
        var me = this;

        return me.uidata.app_version;
    },

    forceModule: function(code)
    {
        var me = this;
        var modules = me.uidata.modules;
        var module = modules[code];
        me.addMainMenu(module.code, module.description, module.icon, true, false, null);
    },
    
    addMainMenus: function()
    {
        var me = this;
        var view = me.getView();
        var main_module_container = view.down('#main-module-container');
        var modules = me.uidata.modules;
        var module, pressed = false, is_pressed = false;
        
        // Firstly, add user info
        var code = 'me';
        main_module_container._current_module_code = code;
        //pressed = (Object.keys(me.uidata.modules).length !== 1);
        me.addMainMenu(code, me.uidata.user_name, 'fa fa-user', pressed, true, null); //"main-menu-userinfo-btn");
        main_module_container.add({
           xtype: 'panel',
           title: '',
           _code: code,
           layout: 'fit',
           width: '100%',
           height: '100%',
           html: me.getUserInfo()
        });

        // Add each module
        
        for(var code in modules)
        {
            module = modules[code];
            if (!Ext.isEmpty(module.code))
            {
                pressed = false;
                //if (Object.keys(me.uidata.modules).length === 1 && !is_pressed)
                if ((Object.keys(me.uidata.modules).length === 1 || module.code === 'cryptos') && !is_pressed)
                {
                    pressed = true;
                    is_pressed = true;
                }                
                me.addMainMenu(module.code, module.description, module.icon, pressed, false, "main-menu-big-btn");
            }
        }
        
    },
    
    addMainMenu: function(code, name, icon, pressed, initialized, cls)
    {
        var me = this;
        var view = me.getView();
        var main_menu = view.down('#main-menu');

        var item = {
            text: name,
            iconCls: icon,
            _code: code,
            pressed: pressed,
            _initialized: initialized,
            handler: function(button)
            {
                me.onClickMainMenu(button);
            }            
        };
        
        if (cls)
        {
            item.cls = cls;
        }
        
        main_menu.add(item);
        
        if (pressed)
        {
            me.onClickMainMenu(item);
        }
    },

    onClickMainMenu: function(menu)
    {
        var me = this;
        var view = me.getView();
        var main_module_container = view.down('#main-module-container');
        var code = menu._code;
        
        if (code === main_module_container._current_module_code)
        {
            return;
        }

        //console.log(code);

        // Hide the current module
        if (!Ext.isEmpty(main_module_container._current_module_code))
        {
            main_module_container.down('[_code=' + main_module_container._current_module_code + ']').setVisible(false);
        }

        // Initialize content
        if (!menu._initialized)
        {
            me.addModule(code);
            menu._initialized = true;

            // Should open any option by default?
            var default_menu_option = App.app.getController('App.controller.controller').getDefaultMenuOption(code);
            //console.log(default_menu_option);
            if(default_menu_option !== null)
            {
                var menu_item = Ext.ComponentQuery.query('#' + default_menu_option)[0];
                if (typeof menu_item != 'undefined')
                {
                    me.onClickAnyMenu(code, menu_item);
                }
            }
        }
        else
        {
            // Show module
            main_module_container.down('[_code=' + code + ']').setVisible(true);            
        }

        main_module_container._current_module_code = code;
    },
    
    addModule: function(code)
    {
        var me = this;
        var view = me.getView();
        var main_module_container = view.down('#main-module-container');

        // Menus
        var raw_menus = me.uidata.menus[code];
        var menus = [];
        var grants = me.uidata.grants[code];

        if (grants && (grants.grants_summary === 'all' || grants.grants_summary === 'custom' || me.uidata.is_super_user))
        {
            menus = me.getUIMenus(code, raw_menus.UI);
        }

        main_module_container.add({
            xtype: 'panel',
            _code: code,
            layout: 'border',
            bodyStyle: {
                'background-color': 'white'
            },    
            items:
            [
                {
                    xtype: 'panel',
                    region: 'north',
                    items:
                    [
                        {
                            xtype: 'panel',
                            hidden: Ext.isEmpty(menus),
                            margin: '0 0 10 0',
                            tbar: {
                                overflowHandler: 'menu',                    
                                items: menus
                            }
                        },
                        {
                            xtype: 'panel',
                            hidden: !Ext.isEmpty(menus),
                            html: "<font color=\"red\">" + "I do not have permission to access any menus of this module" + "</font>"
                        },
                        {
                            xtype: 'panel',
                            itemId: 'main_module_breadscrumb' + '_' + code,
                            hidden: true,
                            margin: '0 0 5 0',
                            html: ''
                        }
                    ]
                },
                {
                    xtype: 'tabpanel',
                    itemId: 'main_module_centerpanel' + '_' + code,
                    _current_menu_id: '',
                    region: 'center',
                    layout: 'fit',
                    width: '100%',
                    height: '100%',
                    plugins: 'tabreorderer',
                    cls: 'main-tabpanel-disabled',
                    items: []
                }                    
            ]
        });
               
    },
    
    getUIMenus: function(module_code, raw_menus)
    {
        // console.log(raw_menus);
        var me = this;
        var ret = [];
        var grants = me.uidata.grants[module_code];
        
        Ext.each(raw_menus, function(raw_menu)
        {
            var text = (!raw_menu.label || Ext.isEmpty(raw_menu.label))? raw_menu.alias : raw_menu.label;
            var is_leaf = (!raw_menu.children || Ext.isEmpty(raw_menu.children));
            
            // Check grants
            var visualize = true;

            if (is_leaf && grants.grants_summary === 'custom')
            {
                if (!grants.grants_by_menu[raw_menu.alias] || !grants.grants_by_menu[raw_menu.alias].visualize)
                {
                    visualize = false;
                }
            }

            if (raw_menu.hidden)
            {
                visualize = false;
            }

            if (visualize)
            {
                var object = {
                    _id: raw_menu.alias,
                    _breadscrumb: raw_menu.breadscrumb,
                    text: text,
                    iconCls: raw_menu.icon,
                    itemId: "module_" + module_code + "_menu_item_" + raw_menu.alias
                };

                if (is_leaf)
                {
                    object['handler'] = function(button, e) {
                        me.onClickAnyMenu(module_code, button);
                    };
                }
                else
                {
                    var items = me.getUIMenus(module_code, raw_menu.children);

                    me.checkForDefault(module_code, raw_menu.children);

                    if (Ext.isEmpty(items))
                    {
                        visualize = false;
                    }
                    else
                    {
                        object['menu'] = {
                            items: items
                        };                        
                    }
                }

                if (visualize)
                {
                    ret.push(object); 
                }               
            }
        }); 
        
        return ret;
    },

    checkForDefault: function(module_code, menu_items)
    {
        for (var key in menu_items)
        {
            var m = menu_items[key];
            var menu_itemId = "module_" + module_code + "_menu_item_" + m.alias;

            if (m.default)
            {
                App.app.getController('App.controller.controller').setDefaultMenuOption(module_code, menu_itemId);
            }
            else
            {
                App.app.getController('App.controller.controller').resetDefaultMenuOption(module_code, menu_itemId);
            }
        }
    },
    
    getModuleBreadscrumb: function(module_code)
    {
        var item = Ext.ComponentQuery.query('#main_module_breadscrumb' + '_' + module_code)[0];
        return item;
    },
    
    getModuleCenterpanel: function(module_code)
    {
        var item = Ext.ComponentQuery.query('#main_module_centerpanel' + '_' + module_code)[0];
        return item;
    },

    onClickAnyMenu: function(module_code, menu)
    {
        var me = this;
        var module_centerpanel = me.getModuleCenterpanel(module_code);
        var module_breadscrumb = me.getModuleBreadscrumb(module_code);
        var menu_id = menu._id;
        //console.log(menu_id);
        var breadscrumb = menu._breadscrumb;
        //console.log(breadscrumb);
        var itemId = 'main-maintenance-' + module_code + '-' + menu_id;
        //console.log(itemId);
        var widget = Ext.ComponentQuery.query('#' + itemId)[0];
        //console.log(widget);
        
        // Exit if it's the same widget
        /*if (menu_id === module_centerpanel._current_menu_id)
        {
            //console.log('Fool, it\'s the same!');
            return;
        }
        
        // Hide the current widget
        if (!Ext.isEmpty(module_centerpanel._current_menu_id))
        {
            var current_itemId = 'main-maintenance-' + module_code + '-' + module_centerpanel._current_menu_id;
            var current_widget = Ext.ComponentQuery.query('#' + current_itemId)[0];
            if (current_widget)
            {
                current_widget.setVisible(false);
            }
        }*/
        
        
        if (widget)
        {
            //console.log('Already initialized');
            module_breadscrumb.setHtml(breadscrumb);
            //widget.setVisible(true);
            module_centerpanel._current_menu_id = menu_id;
            module_centerpanel.setActiveTab(widget);
            return;
        }

        var widget;

        widget = Ext.create({
            xtype: menu_id,
            itemId: itemId,
            config: {
                breadscrumb: breadscrumb,
                launchedFromModule: module_code                        
            }
        });
        
        if (widget.isWindowed)
        {
            return;
        }

        /*try
        {
            widget = Ext.create({
                xtype: menu_id,
                itemId: itemId,
                config: {
                    breadscrumb: breadscrumb,
                    launchedFromModule: module_code
                }
            });
        }
        catch(err)
        {
            widget = {
                xtype: 'panel',
                itemId: itemId,
                closable: true,
                html: 
                        '<div style="color:red;">' + 
                            "We're sorry. Not implemented yet!" + 
                        '</div>'
            };
            me.msgBox("We're sorry", "This feature is not implemented yet!");
            return;
        }*/
            
        // Add widget to center panel
        module_breadscrumb.setHtml(breadscrumb);
        module_centerpanel.add(widget);
        if (Ext.isEmpty(module_centerpanel._current_menu_id))
        {
            module_centerpanel.removeCls('main-tabpanel-disabled').addCls('main-tabpanel-enabled');
        }
        module_centerpanel._current_menu_id = menu_id;
        module_centerpanel.setActiveTab(widget)
    }

});
