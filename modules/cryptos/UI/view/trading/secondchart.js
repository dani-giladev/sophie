Ext.define('App.modules.cryptos.UI.view.trading.secondchart', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-trading-secondchart',
    
    requires: [

    ],
    
    width: '100%',
//    margin: '0 10 0 0',

    chart_height: 400,

    initComponent: function()
    {
        var me = this;
        
        me.title = '';

        me.items = 
        [ 
            {
                xtype: 'cartesian',
                itemId: 'cryptos-trading-cartesian-secondchart',
                width: '100%',
                height: me.chart_height,
                legend: {
                    type: 'sprite',
                    docked: 'right'
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
                    }
                ],
                animation: {
                    duration: 200
                },
                store: {
                    type: 'cryptos_trading_secondchart'
                },
                axes: 
                [
                    {
//                        type: 'numeric',
                        type: 'customnumeric',
                        fixedAxisWidth: 80,
                        position: 'left',
                        fields: ['macd', 'macd_signal', 'macdh']
                    }, 
                    {
//                        type: 'numeric',
                        type: 'customnumeric',
                        fixedAxisWidth: 50,
                        position: 'right',
//                        minimum: 0,
//                        maximum: 100,
                        fields: ['rsi', 'rsi_oversold', 'rsi_overbought', 'rsi_signal']
                    },                    
                    {
                        type: 'category',
                        position: 'bottom',
                        fields: 'date_time',
                        //grid: true,
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
                            var date = new Date(label);
                            //console.log(date);
                            var time = Ext.Date.format(date, 'H:i');
                            return layoutContext.renderer(time);
                        }
                    }
                ],
                series: 
                [
                    {
                        type: 'line',
                        title: 'MACD',
                        xField: 'date_time',
                        yField: 'macd',
                        style: {
                            lineWidth: 2,
                            strokeStyle: 'dodgerblue'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: 'dodgerblue'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('macd'));
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'MACD Signal',
                        xField: 'date_time',
                        yField: 'macd_signal',
                        style: {
                            lineWidth: 2,
                            strokeStyle: 'lightblue'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: 'lightblue'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('macd_signal'));
                            }
                        }                        
                    },
                    {
                        type: 'bar',
                        title: 'MACDh',
                        xField: 'date_time',
                        yField: 'macdh',
                        style: {
                            opacity: 0.2,
                            fillStyle: 'lightgreen',
                            strokeStyle: 'lightgreen'
                        },                        
                        highlight: {
                            opacity: 0.6,
                            fillStyle: 'lightgreen',
                            strokeStyle: 'black'
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('macdh'));
                            }
                        },
                        renderer: function (sprite, config, rendererData, index) {
                            var store = rendererData.store,
                                storeItems = store.getData().items,
                                currentRecord = storeItems[index],
                                changes = {};
                            
                            var macdh = 0;
                            if (currentRecord)
                            {
                                macdh = currentRecord.data['macdh'];
                            }
                            
                            var color = (macdh >= 0)? 'green' : 'red';
                            
                            changes.strokeStyle = color;
                            changes.fillStyle = color;

                            return changes;
                        }
                    },
                    {
                        type: 'line',
                        title: 'RSI',
                        xField: 'date_time',
                        yField: 'rsi',
                        smooth: true,
                        style: {
                            lineWidth: 2,
                            strokeStyle: '#ff9900'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: '#ff9900'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('rsi'));
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'RSI Signal',
                        xField: 'date_time',
                        yField: 'rsi_signal',
                        style: {
                            lineWidth: 2,
                            strokeStyle: 'gold'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: 'gold'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('rsi_signal'));
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'RSI Oversold',
                        xField: 'date_time',
                        yField: 'rsi_oversold',
                        smooth: true,
                        style: {
                            lineWidth: 1,
                            strokeStyle: 'red'
                        },
                        marker: {
                            fillStyle: 'red'                            
                        }                       
                    },
                    {
                        type: 'line',
                        title: 'RSI Overbought',
                        xField: 'date_time',
                        yField: 'rsi_overbought',
                        smooth: true,
                        style: {
                            lineWidth: 1,
                            strokeStyle: 'green'
                        },
                        marker: {
                            fillStyle: 'green'                            
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
            var chart = me.down('chart');
            
            // Hide markers
            me.getChartController().toggleMarkers(chart);
        }
    },
    
    getChartController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.trading.chart');
        return controller;
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.trading.trading');
        return controller;
    }

});
