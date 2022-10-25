Ext.define('App.modules.admin.UI.view.user.modules.admin', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.admin-user-modules-admin',
    
    requires: [

    ],
    
    autoHeight: true,
    padding: 5,
    anchor: '100%',
    required_indication: '<font size="4" color="red">*</font>',
          
    trans: null,
    rendered_form: false,
    
    initComponent: function() 
    {
        var me = this;
        
        me.title = me.trans.user.plugin_grants + " " + me.trans.user.admin;
        
        me.items = 
        [
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: 
                [
                    {
                        xtype: 'combobox',
                        name: 'admin_grants_group',
                        fieldLabel: me.trans.user.group,
                        labelAlign: 'right',
                        store: {
                            type: 'adminUserGroup'
                        },
                        queryMode: 'local',
                        valueField: 'code',
                        displayField: 'name',
                        allowBlank: true,
                        //typeAhead: true,
                        //forceSelection: true,
                        editable: false,
                        width: 300,
                        //bug when allowBlank is true//emptyText: me.trans.user.select_group,
                        listeners: {
                            render: function(field, eOpts)
                            {
                                field.store.on('load', function(this_store, records, successful, eOpts)
                                {                                  
                                    field.forceSelection = true;
                                    field.typeAhead = true;
                                }, this, {single: true});   
                                var proxy = field.store.getProxy();
                                proxy.url = restpath + proxy.endpoint;   
                                field.store.load({
                                    params: {

                                    }
                                });                                        
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        margin: '0 0 0 5',
                        text: "X",
                        handler: function()
                        {
                            var field = me.up('form').getForm().findField('admin_grants_group');                        
                            field.setValue('');
                        }
                    }
                ]
            }    
        ];
        
        this.callParent(arguments);
        
        this.on('boxready', this.onBoxready, this);
    },
    
    onBoxready: function(thisForm, width, height, eOpts)
    {
        var me = this;
        var task = new Ext.util.DelayedTask(function(){
            me.is_box_ready = true;
        });        
        task.delay(100);
    },
    
    onRender: function(form, options)
    {   
        this.rendered_form = true;
        this.callParent(arguments);
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.admin.UI.controller.user');
        return controller;
    }
        
});