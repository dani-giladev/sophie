Ext.define('App.view.maintenance.toolbar', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.maintenance-toolbar',
    _alias: 'maintenance-toolbar',
    
    requires: [
        
    ],
    
    height: 46,
    region: 'north',
    
    config: {},
    
    show_add_button: true,
    show_edit_button: true,
    show_delete_button: true,
    show_refresh_button: true,
    show_export_button: true,
    show_print_button: true,
    show_selectall_button: false,

    initComponent: function()
    {
        var me = this;
        
        me.itemId = me.config.itemId + '_toolbar';
        me.title = '';
        
        var trans = me.getMaintenanceController().getTrans('base').maintenance;
        var grants = me.getMaintenanceController().getGrants(me.config);
        //console.log(grants);
        
        // Set visibility in order to hidden buttons
        me.setButtonsVisibility();
        
        this.items = 
        [
            {
                xtype: 'panel',
                layout: 'hbox',
                border: false,
                frame: false,
                items:
                [
                    {
                        xtype: 'buttongroup',
                        itemId: me.config.itemId + '_toolbar_buttongroup',
                        border: false,
                        frame: false,
                        flex: 1,
                        items: 
                        [
                            {
                                itemId: me.config.itemId + '_add_button',
                                text: trans.new,
                                iconCls: 'x-fa fa-file-o',
                                handler: me.addRecord,
                                disabled: !grants.insert,
                                hidden: !me.show_add_button
                            },
                            {
                                itemId: me.config.itemId + '_edit_button',
                                text: trans.edit,
                                iconCls: 'x-fa fa-edit',
                                handler: me.editRecord,
                                hidden: !me.show_edit_button
                            },
                            {
                                itemId: me.config.itemId + '_delete_button',
                                text: trans.delete,
                                iconCls: 'x-fa fa-remove',
                                handler: me.deleteRecord,
                                disabled: !grants.remove,
                                hidden: !me.show_delete_button
                            },                    
                            {
                                text: trans.refresh,
                                handler: me.refresh,
                                iconCls: 'x-fa fa-refresh',
                                hidden: !me.show_refresh_button
                            },                    
                            {
                                text: trans.export,
                                iconCls: 'x-fa fa-sort-amount-asc',
                                hidden: !me.show_export_button,
                                menu: {
                                    items: [{
                                        text:   'Excel xlsx',
                                        handler: me.exportToXlsx
                                    }/*,{
                                        text: 'Excel xml',
                                        handler: me.exportToXml
                                    }*/,{
                                        text:   'CSV',
                                        handler: me.exportToCSV
                                    }/*,{
                                        text:   'TSV',
                                        handler: me.exportToTSV
                                    },{
                                        text:   'HTML',
                                        handler: me.exportToHtml
                                    }*/]
                                }
                            },
                            {
                                text: trans.print,
                                iconCls: 'x-fa fa-print',
                                handler: me.printGrid,
                                hidden: !me.show_print_button
                            },
                            {
                                text: trans.select_all,
                                iconCls: 'x-fa fa-check-square',
                                handler: me.selectAll,
                                hidden: !me.show_selectall_button
                            }
                            //
                            //
                            //
                            //,
                            //{ xtype: 'tbfill' },
                            /*,
                            {
                                html: '<label style="color: black; border:1; font-weight: bold; font-size: 20px; ">' + client_lang.common.select + '</label>',
                                //scale: 'large',
                                //border: 1,
                                style: 'background-color: green;',
                                margin: '5 0 0 0',
                                width: 200,
                                handler: me.selectRecs,
                                hidden: !me.config.enableSelectionMode
                            }*/            
                        ]
                    },
                    {
                        xtype: 'panel',
                        itemId: me.config.itemId + '_info_total_number_of_records',
                        border: false,
                        frame: false,
                        margin: '15 20 0 0',
                        style:{
                            'text-align': 'right'
                        },
                        html: ''
                    }
                ]
            }       
        ];
            
        this.callParent(arguments);
    },
    
    setButtonsVisibility: function()
    {
        var me = this;
        
        if (typeof me.config.buttonBar != 'undefined' && typeof me.config.buttonBar.visibility != 'undefined')
        {
            if (typeof me.config.buttonBar.visibility.addButton != 'undefined')
            {
                me.show_add_button = me.config.buttonBar.visibility.addButton;
            }  
            if (typeof me.config.buttonBar.visibility.editButton != 'undefined')
            {
                me.show_edit_button = me.config.buttonBar.visibility.editButton;
            }      
            if (typeof me.config.buttonBar.visibility.deleteButton != 'undefined')
            {
                me.show_delete_button = me.config.buttonBar.visibility.deleteButton;
            }        
            if (typeof me.config.buttonBar.visibility.refreshButton != 'undefined')
            {
                me.show_refresh_button = me.config.buttonBar.visibility.refreshButton;
            }        
            if (typeof me.config.buttonBar.visibility.exportButton != 'undefined')
            {
                me.show_export_button = me.config.buttonBar.visibility.exportButton;
            }         
            if (typeof me.config.buttonBar.visibility.printButton != 'undefined')
            {
                me.show_print_button = me.config.buttonBar.visibility.printButton;
            }  
        }
    },
    
    onRender: function()
    {
        
        this.callParent(arguments);
    },

    addRecord: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-toolbar]');
        me.getMaintenanceController().showForm(me.config, false, null);
    },

    editRecord: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-toolbar]');
        
        var selected = me.getMaintenanceController().getComponentQuery('grid', me.config).getSelectionModel().getSelection();
        if(!selected[0])
        {
            return false;
        }          
        me.getMaintenanceController().showForm(me.config, true, selected[0]);
    },

    deleteRecord: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-toolbar]');
        me.getMaintenanceController().deleteRecord(me.config);
    },

    refresh: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-toolbar]');
        me.getMaintenanceController().refresh(me.config);
    },

    exportToXlsx: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-toolbar]');
        me.getMaintenanceController().exportGrid('xlsx', me.config);
    },

    exportToXml: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-toolbar]');
        me.getMaintenanceController().exportGrid('xml', me.config);
    },

    exportToCSV: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-toolbar]');
        me.getMaintenanceController().exportGrid('csv', me.config);
    },

    exportToTSV: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-toolbar]');
        me.getMaintenanceController().exportGrid('tsv', me.config);
    },

    exportToHtml: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-toolbar]');
        me.getMaintenanceController().exportGrid('html', me.config);
    },

    printGrid: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-toolbar]');
        me.getMaintenanceController().printGrid(me.config);
    },
    
    selectAll: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-toolbar]');
        me.getMaintenanceController().selectAll(me.config);
    },

    selectRecs: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-toolbar]');
        var records = me.getMaintenanceController().getComponentQuery('grid', me.config).getSelectionModel().getSelection();
        me.getMaintenanceController().selectRecs(me.config, records);
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.controller.maintenance.maintenance');
        return controller;
    }
    
});