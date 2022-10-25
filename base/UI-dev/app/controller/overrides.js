Ext.define('App.controller.overrides', {
    extend: 'Ext.app.Controller',
    
    setOverrides: function()
    {
        var globalAjaxOpsTimeout = 600000; // 10 minutes (1000 seg. * 60 * 10)
        Ext.Ajax.setTimeout(globalAjaxOpsTimeout);
        Ext.override( Ext.form.Basic, { 
            timeout: Ext.Ajax.getTimeout() / 1000
        });
        Ext.override(Ext.data.proxy.Server, { 
            constructor: function(config) {
                  var me=this;
                  config.timeout=Ext.Ajax.getTimeout();
                  me.callParent(arguments);
             }
         });
        Ext.override(Ext.data.Connection, { 
            constructor: function(config) {
                 var me=this;
                 config.timeout=Ext.Ajax.getTimeout();
                 me.callParent(arguments);
            }
        });          
      
        Ext.define('Utilities', {
            statics: {
                // Get back to previously selected record into grid after edit by a form
                selectPreviousRecord: function(grid, form_to_reload_record)
                {
                    var record_selected = grid.getSelectionModel().getSelection()[0];
                    if(record_selected)
                    {
                        var _id = record_selected.data.id;
                        if(!record_selected.data.id)
                        {
                            _id = record_selected.data._id;
                        }
                        var record_index = grid.getStore().indexOfId(_id);

                        grid.getStore().on('load', function()
                        {
                            // grid.getSelectionModel().select(grid.getStore().getCount() - 1);
                            grid.getSelectionModel().deselectAll(true);
                            grid.getSelectionModel().select(record_index);
                            if(form_to_reload_record)
                            {
                                form_to_reload_record.getForm().loadRecord(record_selected);
                            }
                        }/*, this, {single: true}*/);
                    }
                }
            }
        });
        
        Ext.define('App.ux.field.upload', {
            extend: 'Ext.form.field.File',
            alias: 'widget.multiUpload',
            xtype: 'multiUpload',
            /*iconCls: 'ux-mu-icon-action-browse',
            buttonText: 'Select File(s)',
            buttonOnly: false,*/
            initComponent: function () {
                this.on('afterrender', function () {
                    this.setMultiple();
                }, this);
                this.callParent(arguments);
            },
            reset: function () {
                this.callParent(arguments);
                this.setMultiple();
            },
            setMultiple: function (inputEl) {
                inputEl = inputEl || this.fileInputEl;
                inputEl.dom.setAttribute('multiple', 'multiple');
            }
        });

        // New field validation
        Ext.apply(Ext.form.field.VTypes, {
            IPAddress:  function(v) {
                return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(v);
            },
            IPAddressText: 'Must be a numeric IP address',
            IPAddressMask: /[\d\.]/i
        });

        // BUG: grid blank after reload store. You have to scroll down and up a little to get data in the grid.
        // solved in extjs 6.5
        Ext.define('extjsGridBug.view.TableLayout', {
            override: 'Ext.view.TableLayout',
            finishedLayout: function(ownerContext) {
                var me = this,
                    ownerGrid = me.owner.ownerGrid,
                    nodeContainer = Ext.fly(me.owner.getNodeContainer()),
                    scroller = this.owner.getScrollable(),
                    buffered;

                me.callSuper([ ownerContext ]);

                if (nodeContainer) {
                    nodeContainer.setWidth(ownerContext.headerContext.props.contentWidth);
                }

                buffered = me.owner.bufferedRenderer;
                if (buffered) {
                    buffered.afterTableLayout(ownerContext);
                }

                if (ownerGrid) {
                    ownerGrid.syncRowHeightOnNextLayout = false;
                }

                if (scroller && !scroller.isScrolling) {
                    if (buffered && buffered.nextRefreshStartIndex === 0) {
                        return;
                    }
                    scroller.restoreState();
                }
            }
        });
        
        // In order to fix axes charts
        Ext.define('CustomNumericAxis', {
            extend: 'Ext.chart.axis.Numeric',
            alias: 'axis.customnumeric',
            config: {
                fixedAxisWidth: undefined
            },
            getThickness: function () {
                var customWidth = this.getFixedAxisWidth();
                if( customWidth ) {
                    return customWidth;
                }
                else {
                    return this.callParent();
                }
            }
        });        
    }
});