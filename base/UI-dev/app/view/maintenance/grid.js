Ext.define('App.view.maintenance.grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.maintenance-grid',
    _alias: 'maintenance-grid',
    
    requires: [

    ],
    
    region: 'center',
  //  autoWidth: true,
    border: false,
    frame: false,
    
    config: {},
    render_filterform_flag: false,
    
    initComponent: function()
    {
        var me = this;
        
        var trans = me.getMaintenanceController().getTrans('base').maintenance;
        me.itemId = me.config.itemId + '_grid';

        var store = me.getGridStore();
        
        Ext.apply(this, {
            cls: 'feed-grid',
            store: store,
            multiSelect: true,
            features: me.getGridFeatures(),
            selModel: me.getGridSelModel(),
            viewConfig: me.getGridViewConfig(),
            itemConfig: me.getItemConfig(),
            plugins: 'gridexporter', //'bufferedrenderer',
            columns: me.getDynamicFilterController().getGridColumns(store),
            dockedItems: 
            [
                Ext.create('Ext.toolbar.Toolbar', 
                {
                    dock: 'bottom',
                    hidden: !me.config.enableSelectionMode && !me.config.enableMultiSelectionMode,
                    items: 
                    [
                        { xtype: 'tbfill' },     
                        {
                            //text: trans.select,
                            html: '<label border:1; font-weight: bold; font-size: 20px; ">' + trans.select + '</label>',
                            handler: me.selectRecs
                        }                      
                    ]
                })
            ]              
        });

        this.callParent(arguments);
        
        me.store.on('datachanged', function(store, eOpts)
        {
            me.getMaintenanceController().setInfoTotalNumberOfRecords(me.config, store);
        }); 
        
    },
    
    getGridStore: function()
    {
        
    },
    
    getGridFeatures: function()
    {
        var ret = 
        [
            /*
            DEPRECATED
            {
                ftype: 'filters',
                encode: false,
                local: true,
                showMenu: false
            }            
            */
        ];
        
        return ret;
    },

    getItemConfig: function()
    {
        var me = this;

        return { };
    },

    getGridViewConfig: function()
    {
        var me = this;

        return {
            //emptyText: trans.norecords,
            deferEmptyText: false,
            enableTextSelection: true,
            preserveScrollOnReload: true,
            listeners:{
                itemkeydown:function(view, record, item, index, e){
                    if (e.getKey() === e.ENTER) {
                        if (me.config.enableSelectionMode)
                        {
                            var records = [record];
                            me.getMaintenanceController().selectRecs(me.config, records);
                        }
                        else
                        {
                            me.getMaintenanceController().showForm(me.config, true, record);
                        }
                    }
                },
                itemcontextmenu: function(view, record, item, index, e, eOpts)
                {
                    me.onContextMenu(view, record, item, index, e, eOpts);
                }
            }
        };

    },
        
    onContextMenu: function(view, record, item, index, e, eOpts)
    {
        
    },

    getGridSelModel: function()
    {
        var me = this;

        if(me.config.enableMultiSelectionMode)
        {
            return Ext.create('Ext.selection.CheckboxModel', {
                headerWidth: 60

            });
        }
        else
        {
            return {
                pruneRemoved: false
            };
        }
    },
    
    onRender: function(grid, options, norefresh)
    {
        var me = this; 
        
        me.store.on('load', me.onLoad, me);
        me.on('itemdblclick', me.onRowDblClick, me);
        me.on('selectionchange', me.onSelect, me);
        
        if (!norefresh)
        {
            me.render_filterform_flag = true;
            me.getMaintenanceController().refresh(me.config, true);
        }
        else
        {
            me.getDynamicFilterController().renderPanelFilter(me.config); 
        }
        
        this.callParent(arguments);
    },

    onLoad: function(store, records, success, operation, options)
    {
        var me = this;
        
        if (me.render_filterform_flag)
        {
            //console.log('onLoad');
            me.render_filterform_flag = false;
            /*var task = new Ext.util.DelayedTask(function() {
                //console.log('delayed task!');
                me.getDynamicFilterController().renderPanelFilter(me.config); 
            });        
            task.delay(200);*/
            me.getDynamicFilterController().renderPanelFilter(me.config); 
        }
        else
        {
            if (store.getCount() > 0)
            {
                this.getSelectionModel().select(0);
            }            
        }

        // Bring to front the windows (to fix extjs bug)
        var task = new Ext.util.DelayedTask(function() {
            var window = me.up('window');
            if (window) window.toFront();
        });        
        task.delay(200);        
        
    },
    
    onRowDblClick: function(view, record, item, index, e)
    {
        var me = this;

        if (me.config.enableSelectionMode)
        {
            var records = [record];
            
            me.getMaintenanceController().selectRecs(me.config, records);
        }
        else
        {
            if (me.config.anyForm)
            {
                me.getMaintenanceController().showForm(me.config, true, record);
            }
        }        
    },
    
    onSelect: function(model, selected, eOpts)
    {

    },

    selectRecs: function(button, eventObject)
    {
        var me = button.up('[_alias=maintenance-grid]');
        var records = me.getSelectionModel().getSelection();
        me.getMaintenanceController().selectRecs(me.config, records);
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.controller.maintenance.maintenance');
        return controller;
    },
        
    getDynamicFilterController: function()
    {
        var controller = App.app.getController('App.controller.maintenance.dynamicFilterForm');
        return controller;
    }
});