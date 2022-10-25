Ext.define('App.modules.admin.UI.view.plugin.metacodePluginForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.admin-plugin-metacodePluginForm',
    
    requires: [

    ],
          
    accept: false,
    current_record: null,
    trans: null,
    
    border: false,
    frame: false,
    autoHeight: true,
    autoScroll: true,
    bodyPadding: 10,
    required_indication: '<font size="4" color="red">*</font>',

    initComponent: function() {
        var me = this;

        me.items = 
        [
            {
                xtype: 'fieldset',
                autoHeight: true,
                padding: 5,
                title: 'Databases', //me.trans.common.main,
                anchor: '100%',
                items: 
                [
                    {
                        xtype: 'checkboxfield',
                        name: 'db',
                        fieldLabel: me.current_record.get('code'),
                        labelAlign: 'right',
                        boxLabel: '',
                        checked: true,
                        anchor: '100%'
                    },
                    {
                        xtype: 'checkboxfield',
                        name: 'db-common',
                        fieldLabel: me.current_record.get('code') + '-common',
                        labelAlign: 'right',
                        boxLabel: '',
                        checked: true,
                        anchor: '100%'
                    }
                ]
            }
        ];
        
        me.dockedItems = [
            {
                xtype: 'toolbar',
                anchor: '100%',
                dock: 'bottom',
                items: 
                [
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'button',
                        text: me.trans.common.accept,
                        formBind: true,
                        disabled: true,
                        handler: this.acceptData
                    },
                    {
                        xtype: 'button',
                        text: me.trans.common.cancel,
                        handler: this.closeWindow
                    }
                ]
            }
        ];

        me.callParent(arguments);
    },

    closeWindow: function(button, eventObject)
    {
        button.up('window').close();
    },
    
    
    doLastValidation: function()
    {
//        var me = this;
//        var code = me.getForm().findField('code').getValue();
        
        return true;      
    },
    
    acceptData: function(button, eventObject)
    {
        var me = button.up('form');
        var title, msg;
        
        title = me.trans.plugin.new_module;
        
        if (!me.getForm().isValid())
        {
            return false;
        }
        
        // The last Validation
        if (!me.doLastValidation())
        {
            return false;
        }
        
        // Get values
//        var values = me.getForm().getValues();
//        console.log(values);
        var db = me.getForm().findField('db').getValue();
        var dbcommon = me.getForm().findField('db-common').getValue();

        Ext.MessageBox.show({
            title: title,
            msg: me.trans.plugin.are_you_sure_to_create_new_module,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn, text)
            {
                if (btn == 'yes')
                {
                    Ext.getBody().mask(me.trans.common.wait_please);

                    Ext.Ajax.request({
                        type: 'ajax',
                        method: 'POST',
                        url: restpath + 'admin/plugin/createModule',
                        params:
                        {
                            code: me.current_record.get('code'),
                            db: db,
                            dbcommon: dbcommon
                        },
                        success: function(result, request)
                        {
                            Ext.getBody().unmask();

                            var obj = Ext.JSON.decode(result.responseText);
                            if (obj.success)
                            {
                                me.accept = true;
                                
                                msg = me.trans.plugin.module_created_successfully;
                                Ext.MessageBox.show({
                                    title: title,
                                    msg: msg,
                                    buttons: Ext.MessageBox.OK
                                });
                                
                                me.up('window').close();      
                            }
                            else
                            {
                                Ext.MessageBox.show({
                                    title: title,
                                    msg: obj.msg,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            }
                        },
                        failure: function(result, request)
                        {
                            Ext.getBody().unmask();
                            me.up('window').close();      
                        }
                    });                       
                }
            }
        });     
        
        return true;
    }
        
});