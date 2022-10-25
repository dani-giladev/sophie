Ext.define('App.modules.cryptos.UI.view.dashboard.changeTimeChart', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-dashboard-changeTimeChart',
    
    requires: [

    ],
    
    border: false,
    frame: false,
    layout: 'vbox',
    layoutConfig: {
        pack: 'center',
        align: 'center'
    },
           
    config: {},
    chart_store: null,
    change_time_chart_btc: false,
    change_time_chart_alts: false,
            
    initComponent: function()
    {
        var me = this;
        
        me.title = 'General';

        me.tbar = 
        [
            {
                xtype: 'checkboxfield',
                itemId: 'cryptos-dashboard-changeTimeChart-btc',
                fieldLabel: '',
                labelAlign: 'right',
                boxLabel: 'Bitcoin',
                labelWidth: 150,
                checked: me.change_time_chart_btc
            },
            {
                xtype: 'checkboxfield',
                itemId: 'cryptos-dashboard-changeTimeChart-alts',
                fieldLabel: '',
                labelAlign: 'right',
                boxLabel: 'Alts',
                labelWidth: 150,
                checked: me.change_time_chart_alts
            },
            '->',
            {
                text: 'Switch markers',
                handler: function()
                {
                    var chart = me.down('#cryptos-dashboard-changeTimeChart-chart');
                    me.getDashboardController().toggleMarkers(chart);
                }
            },
            {
                iconCls: 'x-fa fa-refresh',
                handler: function () {
                    me.getDashboardController().refreshChangeTimePanel(me.config);
                }
            }           
        ];

        me.items = 
        [ 
            {
                xtype: 'cartesian',
                itemId: 'cryptos-dashboard-changeTimeChart-chart',
                //margin: '30 0 0 0',
                width: '100%',
                height: 360,
                //innerPadding: 20,
                //insetPadding: 20,
                /*innerPadding: {
                    left: 40,
                    right: 40
                },*/
                animation: {
                    duration: 200
                },
                store: me.chart_store,
                axes: 
                [ 
                    {
                        type: 'customnumeric',
                        fixedAxisWidth: 50,
                        position: 'left',
                        fields: ['accumulated_value', 'accumulated_value_zero']
                    },
                    {
                        type: 'customnumeric',
                        fixedAxisWidth: 50,
                        position: 'right',
                        fields: ['diff_to_previous_value', 'diff_to_previous_value_zero'],
                        listeners: {
                            rangechange: function (axis, range) {
                                // this.lookupReference('chart') will fail here,
                                // as at the time of this call
                                // the chart is not yet in the component tree,
                                // so we have to use axis.getChart() instead.
                                var chart = axis.getChart(),
                                    store = chart.getStore(),
                                    sum = 0,
                                    mean;
                            
                                store.each(function (rec) {
                                    sum += rec.get('diff_to_previous_value');
                                });

                                mean = sum / store.getCount();

                                axis.setLimits({
                                    value: mean,
                                    line: {
                                        title: {
                                            text: 'Average BY DAY: ' + mean.toFixed(2)
                                        },
                                        lineDash: [2,2]
                                    }
                                });
                            }
                        }
                    },
                    {
                        type: 'category',
                        position: 'bottom',
                        fields: 'date',
                        label: {
                            rotate: {
                                degrees: -45
                            }
                        },
                        renderer: function (axis, label, layoutContext) {
                            // Custom renderer overrides the native axis label renderer.
                            // Since we don't want to do anything fancy with the value
                            // ourselves except appending a '%' sign, but at the same time
                            // don't want to loose the formatting done by the native renderer,
                            // we let the native renderer process the value first.
                            if (label.toLowerCase() === 'now')
                            {
                                return label;
                            }
                            var date = new Date(label);
                            //console.log(date);
                            var time = Ext.Date.format(date, 'd/m');
                            return layoutContext.renderer(time);
                        }
                    }
                ],
                series:
                [
                    {
                        type: 'line',
                        title: 'Accumulated',
                        xField: 'date',
                        yField: 'accumulated_value',
                        smooth: true,
                        style: {
                            lineWidth: 1,
                            strokeStyle: '#0066ff'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: '#0066ff'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date') + '<br>' + record.get('accumulated_value') + ' %');
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'Zero',
                        xField: 'date',
                        yField: 'accumulated_value_zero',
                        style: {
                            lineWidth: 0.25,
                            strokeStyle: '#0066ff'
                        }                   
                    },/*
                    {
                        type: 'line',
                        title: 'Diff to previous day',
                        xField: 'date',
                        yField: 'diff_to_previous_value',
                        style: {
                            lineWidth: 1,
                            strokeStyle: 'orange'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: 'orange'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date') + '<br>' + record.get('diff_to_previous_value') + ' %');
                            }
                        }                        
                    },*/
                    {
                        type: 'bar',
                        title: 'Diff to previous day',
                        xField: 'date',
                        yField: 'diff_to_previous_value',
                        style: {
                            opacity: 0.2,
                            fillStyle: 'dodgerblue',
                            strokeStyle: 'dodgerblue',
                            minGapWidth: 0
                        },                        
                        highlight: {
                            opacity: 0.6,
                            fillStyle: 'dodgerblue',
                            strokeStyle: 'black'
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date') + '<br>' + record.get('diff_to_previous_value') + ' %');
                            }
                        },
                        renderer: function (sprite, config, rendererData, index) {
                            var store = rendererData.store,
                                storeItems = store.getData().items,
                                currentRecord = storeItems[index],
                                changes = {};
                            
                            var diff_to_previous_value = -1;
                            if (currentRecord)
                            {
                                diff_to_previous_value = currentRecord.data['diff_to_previous_value'];
                            }
                            
                            var color = (diff_to_previous_value >= 0)? 'green' : 'red';
                            
                            changes.strokeStyle = color;
                            changes.fillStyle = color;

                            return changes;
                        }
                    },
                    {
                        type: 'line',
                        title: 'Zero',
                        xField: 'date',
                        yField: 'diff_to_previous_value_zero',
                        style: {
                            lineWidth: 0.25,
                            strokeStyle: 'black'
                        }                   
                    }
                ]
            }
        ];
        
        me.callParent(arguments); 
    },

    listeners: {
        afterrender: function () {
            var me = this;
            var chart = me.down('#cryptos-dashboard-changeTimeChart-chart');
            
            // Hide markers
            me.getDashboardController().toggleMarkers(chart);         
            
        }
    },

    getDashboardController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.dashboard');
        return controller;
    }

});
