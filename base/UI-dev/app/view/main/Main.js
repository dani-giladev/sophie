Ext.define('App.view.main.Main', {
    extend: 'Ext.panel.Panel',    
    xtype: 'main',
    controller: 'Main',
    
    requires: [
        'Ext.plugin.Viewport',
        'App.view.main.MainController'
    ],

    plugins: ['viewport'],

    id: 'app_main_viewport',

    layout: 'border',
    border: false,
    frame: false,
    title: '',
    
    items:
    [
        {
            xtype: 'panel',
            itemId: 'main-menu-wrapper',
            region: 'west',
            title: '',
            hidden: true,
            width: 200,
            height: '100%',
            collapsible: true,
            collapsed: true,
            layout: 'border',     
            border: true,
            frame: false,
            items:
            [
                {
                    xtype: 'panel',
                    itemId: 'main-menu',
                    region: 'center',
                    layout: 'vbox',
                    scrollable: true,
                    title: '',
//                    bodyStyle: {
//                        'background-color': 'gray'
//                    },
                    defaults: {
                        xtype: 'button',
                        width: '100%',
                        height: 70,
                        cls: "main-menu-btn",
                        //overCls : 'main-menu-btn-over',
                        //pressedCls : 'main-menu-btn-pressed',                

                        //needs to be true to have the pressed cls show
                        toggleGroup : 'main-menu',
                        enableToggle : true,
                        allowDepress:false
                    },
                    items:
                    [

                    ]
                },
                {
                    xtype: 'panel',
                    region: 'south',
                    title: '',
                    height: 75,
                    defaults: {
                        xtype: 'button',
                        width: '100%',
                        height: 75,
                        cls: "logout-btn",
                        overCls : 'logout-btn-over'
                    },
                    items:
                    [
                        {
                            text: 'Logout',
                            iconCls: 'fa fa-power-off',
                            listeners: {
                                click: 'onClickLogoutButton'
                            }
                        }
                    ]
                }                
            ]
        },
        {
            xtype: 'panel',
            itemId: 'main-module-container',
            region: 'center',
            layout: 'fit',
            title: '',
            width: '100%',
            height: '100%',
            _current_module_code: '',
            bodyPadding: 10,
            items:
            [

            ]
        }
    ]
   
});