Ext.define('App.view.login.login', {
    extend: 'Ext.panel.Panel',
    xtype: 'login',
    controller: 'login',
    
    requires: [
        'App.view.login.loginController',
        'Ext.form.Panel'
    ],

    fullscreen:true,
    width: '100%',
    height: '100%',
    closable: false,
    resizable: false,    
    header: false,
    frame: false,
    border: false,
    
    backgroundColor: '#F6F5F5', //'#FCFDFF',    
    labelColor: 'gray',
    
    initComponent: function() {
        
        var common_controller = App.app.getController('App.controller.controller');
        var lang_value = common_controller.getLang();
        var trans = common_controller.getLoginTrans();
        var languages = common_controller.getLanguages();
        var lang_data = [];
        Ext.each(languages, function(language)
        {
            lang_data.push({"code": language.code, "name": language.description});
        }); 
        
        
        this.title = '';

        this.bodyStyle = {
            'background-color': this.backgroundColor
        }; 
                                
        this.items = 
        [
            {
                xtype: 'panel',
                width: '100%',
                bodyStyle: {
                    'text-align': 'center',
                    'background-color': this.backgroundColor
                },
                renderTo: Ext.getBody(),
                items:
                [
                    {
                        xtype: 'image',
                        src: 'resources/img/logo.png',
                        alt: 'Sophie\'s Logo',
                        width: (184 * 1.5),
                        height: (110 * 1.5),
                        margin: '100 0 0 0',
                        renderTo: Ext.getBody()            
                    }
                ]
            },
            {
                xtype: 'panel',
                width: '100%',
                bodyStyle: {
                    'background-color': this.backgroundColor
                },
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'
                },                        
                renderTo: Ext.getBody(),
                items:
                [
                    {
                        xtype: 'form',
                        title: '',
                        frame: false,
                        border: false,
                        width: 300,
                        margin: '25 0 0 0',
                        bodyStyle: {
                            'background-color': this.backgroundColor
                        },
                        items: 
                        [
                            {
                                xtype: 'label',
                                text: trans.user,
                                style: 'color:' + this.labelColor + '; font-weight:bold'
                            },                                    
                            {
                                xtype: 'textfield',
                                name: 'login',
                                fieldLabel: '',
                                allowBlank: false,
                                blankText: trans.this_field_is_required,
                                anchor: '100%',
                                margin: '5 0 10 0',
                                listeners: {
                                    specialkey: 'onSpecialKey'
                                }
                            },
                            {
                                xtype: 'label',
                                text: trans.pass,
                                style: 'color:' + this.labelColor + '; font-weight:bold'
                            },
                            {
                                xtype: 'textfield',
                                name: 'pass',
                                inputType: 'password',
                                fieldLabel: '',
                                allowBlank: false,
                                blankText: trans.this_field_is_required,
                                anchor: '100%',
                                margin: '5 0 10 0',
                                listeners: {
                                    specialkey: 'onSpecialKey'
                                }
                            },
                            {
                                xtype: 'label',
                                text: trans.language,
                                style: 'color:' + this.labelColor + '; font-weight:bold'
                            },
                            {
                                xtype: 'combo',
                                name: 'lang',
                                fieldLabel: '',
                                displayField: 'name',
                                valueField: 'code',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['code', 'name'],
                                    data : lang_data
                                }),
                                value: lang_value,
                                submitValue: true,
                                editable: false,
                                allowBlank: false,
                                blankText: trans.this_field_is_required,
                                anchor: '100%',
                                margin: '5 0 30 0',
                                listeners: {
                                    change: 'onChangeLanguage'
                                }
                            },
                            {
                                xtype: 'panel',   
                                bodyStyle: {
                                    'background-color': this.backgroundColor
                                },                             
                                layout: {
                                    type: 'hbox',
                                    align: 'center',
                                    pack: 'center'
                                },
                                margin: '20 0 0 0',                        
                                renderTo: Ext.getBody(),
                                items:
                                [
                                    {
                                        xtype: 'button',
                                        text: trans.enter,
                                        formBind: true,
                                        disabled: true,
                                        width: 150,
                                        height: 40,
                                        listeners: {
                                            click: 'onFormSubmit'
                                        }
                                    }
                                ]
                            }                    
                        ],
                        listeners: {
                            afterrender: 'onAfterRenderForm'
                        }
                    }
                ]
            }            
        ];

        this.callParent(arguments);
    }

});