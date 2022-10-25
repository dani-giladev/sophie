Ext.define('App.modules.cryptos.UI.view.reportProfit.chart', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-reportProfit-chart',
    
    requires: [

    ],
    
    width: '100%',
    margin: '0 40 0 0',

    chart_height: 400,
    robots: [],
    is_training: null,
    start_date: null,
    end_date: null,
    series: [],
    property: null,
                    
    initComponent: function()
    {
        var me = this;
        
        me.title = '';

        me.tbar = [
            '->',
            {
                text: 'Switch markers',
                handler: function()
                {
                    var chart = me.down('chart');
                    me.getMaintenanceController().toggleMarkers(chart);
                }
            },
            {
                xtype: 'segmentedbutton',
                width: 350,
                defaults: {
                    ui: 'default-toolbar'
                },
                items: 
                [
                    {
                        text: 'Crosshair',
                        pressed: true
                    },
                    {
                        text: 'Pan'
                    },
                    {
                        text: 'Zoom'
                    },
                    {
                        text: 'Crosszoom'
                    }
                ],
                listeners: {
                    toggle: function (segmentedButton, button, pressed) {
                        var chart = me.down('chart');
                        var interactions = chart.getInteractions(),
                            crosshair = interactions[0],
                            panzoom = interactions[1],
                            crosszoom = interactions[2],
                            value = segmentedButton.getValue();

                        crosshair.setEnabled((value === 0));
                        panzoom.setEnabled((value === 1 || value === 2));
                        panzoom.setZoomOnPanGesture(value === 2);
                        crosszoom.setEnabled((value === 3));
                    }
                }
            },
            {
                text: 'Reset pan/zoom',
                handler: function () {
                    var chart = me.down('chart');
                    var axes = chart.getAxes();

                    axes[0].setVisibleRange([0, 1]);
                    axes[1].setVisibleRange([0, 1]);

                    chart.redraw();
                }
            },
            {
                text: 'Preview',
                handler: function () {
                    if (Ext.isIE8) {
                        Ext.Msg.alert('Unsupported Operation', 'This operation requires a newer version of Internet Explorer.');
                        return;
                    }
                    var chart = me.down('chart');
                    chart.preview();
                }
            }            
        ];
        
        me.series.push({
            type: 'line',
            title: 'Zero',
            xField: 'date',
            yField: 'zero',
            style: {
                lineWidth: 0.5,
                strokeStyle: 'red'
            },
            marker: {
                fillStyle: 'red'                            
            }                       
        });
        
        me.items = 
        [ 
            {
                xtype: 'cartesian',
                itemId: 'cryptos-reportProfit-cartesian-chart',
                width: '100%',
                height: me.chart_height,
                legend: {
                    type: 'sprite',
                    docked: 'bottom'
                },
                interactions:
                [
                    {
                        type: 'crosshair',
                        axes: {
                            label: {
                                fillStyle: 'white',
                                rotate: {
                                    degrees: 0
                                }
                            },
                            rect: {
                                fillStyle: '#344459',
                                opacity: 0.7,
                                radius: 5
                            }
                        }
                    },
                    {
                        type: 'panzoom',
                        enabled: false,
                        zoomOnPanGesture: false,
                        axes: {
                            left: {
                                allowPan: true,
                                allowZoom: true
                            },
                            bottom: {
                                allowPan: true,
                                allowZoom: true
                            }
                        }
                    },                    
                    {
                        type: 'crosszoom',
                        enabled: false,
                        zoomOnPanGesture: false
                    }
                ],
                animation: {
                    duration: 200
                },
                store: {
                    type: 'cryptos_reportProfitChart'
                },
                axes: 
                [
                    {
                        type: 'customnumeric',
                        fixedAxisWidth: 50,
                        position: 'left',
                        listeners: {
                            rangechange: function (axis, range) {
                                // this.lookupReference('chart') will fail here,
                                // as at the time of this call
                                // the chart is not yet in the component tree,
                                // so we have to use axis.getChart() instead.
                                
                                if (me.robots.length !== 1)
                                {
                                    return;
                                }
                                
                                var chart = axis.getChart(),
                                    store = chart.getStore(),
                                    sum = 0,
                                    mean;
                            
                                var robot = me.robots[0];
                                var yfield = robot.user_code + '-' + robot.robot_code + '-' + me.property;

                                store.each(function (rec) {
                                    sum += rec.get(yfield);
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
                        }
                    }
                ],
                series: me.series             
            }
        ];
        
        me.callParent(arguments); 
    },

    listeners: {
        afterrender: function () {
            var me = this;
            var chart = me.down('chart');
            
            // Hide markers
            me.getMaintenanceController().toggleMarkers(chart);
            
            var proxy = chart.store.getProxy();
            proxy.url = restpath + proxy.endpoint;
            chart.store.load({
                params: {
                    robots: Ext.encode(me.robots),
                    is_training: me.is_training,
                    start_date: me.start_date,
                    end_date: me.end_date,
                    property: me.property
                }
            });            
            
        }
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportProfit');
        return controller;
    }

});
