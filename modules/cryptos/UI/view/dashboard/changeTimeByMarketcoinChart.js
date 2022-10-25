Ext.define('App.modules.cryptos.UI.view.dashboard.changeTimeByMarketcoinChart', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-dashboard-changeTimeByMarketcoinChart',
    
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
            
    initComponent: function()
    {
        var me = this;
        
        me.title = 'By market coin';

        me.tbar = 
        [
            '->',
            {
                text: 'Switch markers',
                handler: function()
                {
                    var chart = me.down('#cryptos-dashboard-changeTimeByMarketcoinChart-chart');
                    me.getDashboardController().toggleMarkers(chart);
                }
            } ,
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
                itemId: 'cryptos-dashboard-changeTimeByMarketcoinChart-chart',
                //margin: '30 0 0 0',
                width: '100%',
                height: 360,
                legend: {
                    type: 'sprite',
                    docked: 'bottom'
                },
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
                        position: 'left'
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
                        title: 'BTC',
                        xField: 'date',
                        yField: 'accumulated_value_btc',
                        smooth: true,
                        style: {
                            lineWidth: 1,
                            strokeStyle: '#94ae0a'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: '#94ae0a'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date') + '<br>' + record.get('accumulated_value_btc') + ' %');
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'ETH',
                        xField: 'date',
                        yField: 'accumulated_value_eth',
                        smooth: true,
                        style: {
                            lineWidth: 1,
                            strokeStyle: '#115fa6'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: '#115fa6'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date') + '<br>' + record.get('accumulated_value_eth') + ' %');
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'BNB',
                        xField: 'date',
                        yField: 'accumulated_value_bnb',
                        smooth: true,
                        style: {
                            lineWidth: 1,
                            strokeStyle: '#a61120'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: '#a61120'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date') + '<br>' + record.get('accumulated_value_bnb') + ' %');
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'XRP',
                        xField: 'date',
                        yField: 'accumulated_value_xrp',
                        smooth: true,
                        style: {
                            lineWidth: 1,
                            strokeStyle: '#ff8809'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: '#ff8809'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date') + '<br>' + record.get('accumulated_value_xrp') + ' %');
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'USDT',
                        xField: 'date',
                        yField: 'accumulated_value_usdt',
                        smooth: true,
                        style: {
                            lineWidth: 1,
                            strokeStyle: '#ffd13e'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: '#ffd13e'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date') + '<br>' + record.get('accumulated_value_usdt') + ' %');
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
                            strokeStyle: 'red'
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
            var chart = me.down('#cryptos-dashboard-changeTimeByMarketcoinChart-chart');
            
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
