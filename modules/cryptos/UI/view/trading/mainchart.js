Ext.define('App.modules.cryptos.UI.view.trading.mainchart', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-trading-mainchart',
    
    requires: [

    ],
    
    width: '100%',
    margin: '0 18 0 0',

    chart_height: 400,
                
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
                    me.getChartController().toggleMarkers(chart);
                    
                    var secondchart = Ext.ComponentQuery.query('#cryptos-trading-cartesian-secondchart')[0];
                    me.getChartController().toggleMarkers(secondchart);
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
            },
            {
                iconCls: 'x-fa fa-refresh',
                handler: function () {
                    me.getMaintenanceController().refreshChartsAndHistory();
                }
            }            
        ];
        
        me.items = 
        [ 
            {
                xtype: 'cartesian',
                itemId: 'cryptos-trading-cartesian-mainchart',
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
                    type: 'cryptos_trading_mainchart'
                },
//                insetPadding: 20,
                /*innerPadding: {
                    left: 40,
                    right: 40
                },*/
                axes: 
                [
                    {
//                        type: 'numeric',
                        type: 'customnumeric',
                        fixedAxisWidth: 80,
                        position: 'left',
                        fields: ['real_time_value', 'robot_track_value', 'open', 'high', 'low', 'close', 'transaction_price', 'ma_fast_filter', 'ma_slow_filter', 'custom_filter']
                        //grid: true,
                        //minimum: 0//
                        //maximum: 24
                        //,renderer: 'onAxisLabelRender'
                        /*,renderer: function (axis, label, layoutContext) {
                            // Custom renderer overrides the native axis label renderer.
                            // Since we don't want to do anything fancy with the value
                            // ourselves except appending a '%' sign, but at the same time
                            // don't want to loose the formatting done by the native renderer,
                            // we let the native renderer process the value first.
                            return layoutContext.renderer(label) + '%';
                        }*/
                    }, 
                    {
//                        type: 'numeric',
                        type: 'customnumeric',
                        fixedAxisWidth: 50,
                        position: 'right',
                        fields: ['obv_fast_filter', 'obv_slow_filter', 'volume', 'volume_fast_filter', 'volume_slow_filter']
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
                        title: 'Price',
                        xField: 'date_time',
                        yField: 'real_time_value',
                        style: {
                            lineWidth: 2,
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
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('real_time_value'));
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'Robot track',
                        xField: 'date_time',
                        yField: 'robot_track_value',
                        smooth: true,
                        //fill: true,
                        style: {
                            lineWidth: 2,
                            strokeStyle: '#ff9900'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            //lineWidth: 2,
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
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('robot_track_value'));
                            }
                        },
                        renderer: function (sprite, config, rendererData, index) {
                            var store = rendererData.store,
                                storeItems = store.getData().items,
                                currentRecord = storeItems[index],
                                previousRecord = (index > 0 ? storeItems[index-1] : currentRecord),
                                nextRecord = ((index+1) <= storeItems.length ? storeItems[index+1] : currentRecord),
                                current_is_working = currentRecord && currentRecord.data['is_working'],
                                previous_is_working = previousRecord && previousRecord.data['is_working'],
                                next_is_working = nextRecord && nextRecord.data['is_working'],
                                changes = {};
                            
                            var is_working;
                            
                            switch (config.type) {
                                case 'marker':
                                    is_working = (current_is_working || next_is_working || previous_is_working);
                                    changes.strokeStyle = (is_working ? 'green' : 'orange');
                                    changes.fillStyle = (is_working ? 'green' : 'orange');
                                    break;
                                case 'line':
                                    is_working = (current_is_working || previous_is_working);
                                    changes.strokeStyle = (is_working ? 'green' : 'orange');
                                    changes.fillStyle = (is_working ? 'green' : 'orange');
                                    break;
                            }

                            return changes;
                        }
                    },
                    {
                        type: 'scatter',
                        title: 'Transactions',
                        xField: 'date_time',
                        yField: 'transaction_price',
                        
                        /*style: {
                            strokeStyle: 'green',
                            lineWidth: 1
                        },
                        marker: { 
                            type: 'circle',
                            radius: 5
                        },
                        highlight: {
                            fillStyle: 'red',
                            lineWidth: 2
                        },*/
                        
                        highlightCfg: {
                            scale: 1.3
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fillStyle: 'green',
                            miterLimit: 1,
                            lineCap: 'butt',
                            lineWidth: 1,
                            animation: {
                                duration: 200
                            }
                        },
                        style: {
                            strokeStyle: 'green',
                            lineWidth: 1,
                            renderer: function (sprite, config, rendererData, index) {
                                var me = this,
                                    store = rendererData.store,
                                    storeItem = store.getData().items[index];
                                
                                if (!storeItem || !storeItem.data)
                                {
                                    return;
                                }
                                
                                if (storeItem.data.operation === 'buy')
                                {
                                    config.fill = "green";
                                }
                                else
                                {
                                    config.fill = "red";
                                }

                                config.radius = 6;
                                config.fillOpacity = 0.7;
                                config.stroke = config.fill;
                                config.lineWidth = 2;
                            }                            
                        },
                        
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('transaction_price'));
                            }
                        },
                        label: {
                            field: 'operation',
                            display: 'over',
                            fontSize: 10,
                            translateY: 2 // lower label closer to the marker
                        }
                    },
                    {
                        type: 'candlestick',
                        title: 'Candlestick',
                        xField: 'date_time',
                        openField: 'open',
                        highField: 'high',
                        lowField: 'low',
                        closeField: 'close',
                        style: {
                            barWidth: 10,
                            dropStyle: {
                                fill: 'red',
                                stroke: 'red'
                            },
                            raiseStyle: {
                                fill: 'green',
                                stroke: 'green'
                            }
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date_time') + 
                                        '<br>open: ' + record.get('open') + 
                                        '<br>high: ' + record.get('high')+ 
                                        '<br>low: ' + record.get('low')+ 
                                        '<br>close: ' + record.get('close')
                                );
                            }
                        }
                    },
                    {
                        type: 'line',
                        title: 'MA Fast',
                        xField: 'date_time',
                        yField: 'ma_fast_filter',
                        smooth: true,
                        style: {
                            lineWidth: 2,
                            strokeStyle: '#FA5858'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: '#FA5858'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('ma_fast_filter'));
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'MA Slow',
                        xField: 'date_time',
                        yField: 'ma_slow_filter',
                        smooth: true,
                        style: {
                            lineWidth: 2,
                            strokeStyle: 'pink'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: 'pink'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('ma_slow_filter'));
                            }
                        }                        
                    },
                    {
                        type: 'bar',
                        title: 'Volume',
                        xField: 'date_time',
                        yField: 'volume',
                        style: {
                            opacity: 0.2,
                            fillStyle: 'dodgerblue',
                            strokeStyle: 'dodgerblue'
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
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('volume'));
                            }
                        },
                        renderer: function (sprite, config, rendererData, index) {
                            var store = rendererData.store,
                                storeItems = store.getData().items,
                                currentRecord = storeItems[index],
                                changes = {};
                            
                            var dif = -1;
                            if (currentRecord)
                            {
                                var open = currentRecord.data['open'];
                                var close = currentRecord.data['close'];
                                dif = close - open;
                            }
                            
                            var color = (dif >= 0)? 'green' : 'red';
                            
                            changes.strokeStyle = color;
                            changes.fillStyle = color;

                            return changes;
                        }
                    },
                    {
                        type: 'line',
                        title: 'Volume Fast',
                        xField: 'date_time',
                        yField: 'volume_fast_filter',
                        smooth: true,
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
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('volume_fast_filter'));
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'Volume Slow',
                        xField: 'date_time',
                        yField: 'volume_slow_filter',
                        smooth: true,
                        style: {
                            lineWidth: 2,
                            strokeStyle: 'gray'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: 'gray'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('volume_slow_filter'));
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'OBV Fast',
                        xField: 'date_time',
                        yField: 'obv_fast_filter',
                        smooth: true,
                        style: {
                            lineWidth: 2,
                            strokeStyle: 'gray'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: 'gray'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('obv_fast_filter'));
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'OBV Slow',
                        xField: 'date_time',
                        yField: 'obv_slow_filter',
                        smooth: true,
                        style: {
                            lineWidth: 2,
                            strokeStyle: 'silver'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: 'silver'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('obv_slow_filter'));
                            }
                        }                        
                    },
                    {
                        type: 'line',
                        title: 'Custom filter',
                        xField: 'date_time',
                        yField: 'custom_filter',
                        smooth: true,
                        style: {
                            lineWidth: 2,
                            strokeStyle: 'violet'
                        },
                        marker: {
                            type: 'circle',
                            radius: 2,
                            fx: {
                                duration: 200,
                                easing: 'backOut'
                            },
                            fillStyle: 'violet'                            
                        },
                        highlightCfg: {
                            scaling: 2
                        },
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, record, item) {
                                if (!record) return;
                                tooltip.setHtml(record.get('date_time') + '<br>' + record.get('custom_filter'));
                            }
                        }                        
                    }
                ],
                listeners: {
                    //itemhighlightchange: 'onItemHighlightChange'
                    itemhighlightchange: function (chart, newHighlightItem, oldHighlightItem) {
//                        me.setSeriesLineWidth(newHighlightItem, 4);
//                        me.setSeriesLineWidth(oldHighlightItem, 2);
                    }/*,
                    render: function(field, eOpts)
                    {

                    }*/
                }                
                
            }
        ];

        me.bbar = 
        [
            {
                xtype: 'button',
                itemId: 'cryptos-trading-toolbar-realtime-button',
                text: 'Real-Time',
                iconCls: 'x-fa fa-question',
                enableToggle: true,
                pressed: true,
                margin: '0 0 0 45',
                toggleHandler: function(button, state)
                {
                    var mode = state? "real-time" : "history";
                    me.getMaintenanceController().setRealtimeButton(mode, true);
                }
            },
            {
                xtype: 'combobox',
                itemId: 'cryptos-trading-toolbar-period-combo',
                fieldLabel: 'Period',
                //labelSeparator: '',
                labelAlign: 'right',
                labelWidth: 60,
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "1",    "name": '1 hour'},
                        {"code": "2",    "name": "2 hours"},
                        {"code": "6",    "name": '6 hours'},
                        {"code": "12",   "name": '12 hours'},
                        {"code": "24",   "name": '24 hours'},
                        {"code": "48",   "name": '2 days'},
                        {"code": "168",  "name": '7 days'},
                        {"code": "360",  "name": '15 days'},
                        {"code": "720",  "name": '30 days'}
                    ]
                }),
                queryMode: 'local',
                valueField: 'code',
                displayField: 'name',
                //typeAhead: true,
                //forceSelection: true,
                editable: false,
                width: 180,
                value: "6",
                margin: '0 0 0 5',
                listeners: {
                    change: function(field, newValue, oldValue, eOpts)
                    {
                        me.getMaintenanceController().refreshChartsAndHistory();
                    }
                }
            },            
            {          
                xtype: 'panel',
                itemId: 'cryptos-trading-toolbar-from-wrapper',
                layout: 'hbox',
                border: false,
                frame: false,
                hidden: true,
                margin: 0,
                items:
                [
                    {
                        xtype: 'datefield',
                        itemId: 'cryptos-trading-toolbar-from-startdate',
                        name: 'start_date',
                        format: 'd/m/Y',
                        submitFormat: 'Y-m-d',
                        fieldLabel: 'From',
                        labelAlign: 'right',
                        labelWidth: 50,
                        allowBlank: false,
                        editable: false,
                        width: 180,
                        fieldStyle: {
                            'text-align': 'center'
                        },
                        value: new Date(),
                        maxValue: new Date(),
                        startDay: 1
                    },
                    {
                        xtype: 'timefield',
                        itemId: 'cryptos-trading-toolbar-from-starttime',
                        name: 'start_time',
                        submitFormat: 'H:i',
                        value: '12:00 AM',
                        allowBlank: false,
                        margin: '0 0 0 5',
                        /*minValue: '6:00 AM',
                        maxValue: '8:00 PM',
                        increment: 30,*/
                        width: 120                   
                    },
                    {
                        xtype: 'button',
                        iconCls: 'x-fa fa-fast-backward',
                        margin: '0 0 0 5',
                        ui: 'default-toolbar',
                        handler: function () {
                            me.getMaintenanceController().setDateOfSample('fast-backward');
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'x-fa fa-step-backward',
                        margin: '0 0 0 5',
                        ui: 'default-toolbar',
                        handler: function () {
                            me.getMaintenanceController().setDateOfSample('step-backward');
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'x-fa fa-step-forward',
                        margin: '0 0 0 5',
                        ui: 'default-toolbar',
                        handler: function () {
                            me.getMaintenanceController().setDateOfSample('step-forward');
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'x-fa fa-fast-forward',
                        margin: '0 0 0 5',
                        ui: 'default-toolbar',
                        handler: function () {
                            me.getMaintenanceController().setDateOfSample('fast-forward');
                        }
                    },            
                    {          
                        xtype: 'panel',
                        itemId: 'cryptos-trading-toolbar-from-train-wrapper',
                        layout: 'hbox',
                        border: false,
                        frame: false,
                        hidden: true,
                        margin: 0,
                        items:
                        [
                            {
                                xtype: 'button',
                                text: 'Train!',
                                iconCls: "x-fa fa-bicycle",
                                margin: '0 0 0 5',
                                handler: function() {
                                    me.getMaintenanceController().showTrainingForm();
                                }
                            },
                            {
                                xtype: 'checkboxfield',
                                itemId: 'cryptos-trading-toolbar-show-training-samples',
                                fieldLabel: '',
                                labelAlign: 'right',
                                margin: '0 0 0 5',
                                boxLabel: ''
                            },
                            {
                                html: '<span style="font-size: 10px;">Show training samples</span>',
                                margin: '0 0 0 5',
                                width: 80
                            }   
                        ]
                    }                  
                ]
            },           
            {
                iconCls: 'x-fa fa-refresh',
                margin: '0 0 0 5',
                handler: function () {
                    me.getMaintenanceController().refreshChartsAndHistory();
                }
            },
            '->',           
            {          
                xtype: 'panel',
                layout: 'hbox',
                border: false,
                frame: false,
                margin: '0 20 0 0',
                items:
                [
                    {
                        xtype: 'combobox',
                        itemId: 'cryptos-trading-toolbar-custom_filter-type',
                        fieldLabel: 'Custom filter',
                        labelAlign: 'right',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['code', 'name'],
                            data : 
                            [
                                {"code": "sma", "name": 'SMA'},
                                {"code": "ema", "name": "EMA"}
                            ]
                        }),
                        queryMode: 'local',
                        valueField: 'code',
                        displayField: 'name',
                        editable: false,
                        value: 'ema',
                        width: 190 + 50,
                        labelWidth: 150
                    },
                    {
                        xtype: 'numberfield',
                        itemId: 'cryptos-trading-toolbar-custom_filter-factor',
                        margin: '0 0 0 5',
                        allowBlank: true,
                        fieldLabel: '',
                        labelAlign: 'right',
                        width: 100,
                        value: '60',
                        //maxValue: 100,
                        decimalPrecision: 0,
                        enableKeyEvents : true
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
            
            // Hide series
            var seriesList = chart.getSeries();
            for (var i = 0; i < seriesList.length; i++) {
                var serie = seriesList[i];
                if (
                    serie.type === 'candlestick' || 
                    serie._yField === 'real_time_value' || 
                    serie._yField === 'ma_fast_filter' || 
                    serie._yField === 'ma_slow_filter' || 
                    serie._yField === 'obv_fast_filter' || 
                    serie._yField === 'obv_slow_filter' || 
                    serie._yField === 'volume_fast_filter' || 
                    serie._yField === 'volume_slow_filter' || 
                    serie._yField === 'custom_filter'
                )
                {
                    serie.setHidden(true);
                }
            }            
            
        }
    },

//    setSeriesLineWidth: function (item, lineWidth) {
//        if (item) {
//            item.series.setStyle({
//                lineWidth: lineWidth
//            });
//        }
//    },
    
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
