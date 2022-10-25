Ext.define('App.modules.cryptos.UI.view.dashboard.floatingChart', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-dashboard-floatingChart',
    
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
    floating_showfree: false,
                    
    initComponent: function()
    {
        var me = this;
        
        me.title = '';

        var tb_items =
        [
            {
                xtype: 'checkboxfield',
                itemId: 'cryptos-dashboard-floatingChart-floating_showfree',
                fieldLabel: '',
                labelAlign: 'right',
                boxLabel: 'Show free',
                labelWidth: 150,
                checked: me.floating_showfree
            },
            '->',
            {
                iconCls: 'x-fa fa-refresh',
                handler: function () {
                    me.getDashboardController().refreshFloatingPanel(me.config);
                }
            }           
        ];
        
        /*
        var tbar = {
            xtype        : 'toolbar',
            layout       : 'hbox',
            items        : tb_items,        
            layoutConfig : {
                align : 'stretch'
            }
        };
        */
       
        me.tbar = tb_items;
//        me.tbar = tbar;

        me.items = 
        [ 
            {
                xtype: 'polar',
                itemId: 'cryptos-dashboard-floatingChart-chart',
                //margin: '20 0 0 0',
                width: '100%',
                height: 400,
                innerPadding: 20,
                //insetPadding: 0,
                interactions: ['rotate', 'itemhighlight'],
                series: [{
                    // Outer ring series
                    type: 'pie',
                    angleField: 'btcs',
                    donut: 80,
                    store: me.chart_store,
                    label: {
                        field: 'coin',
                        //display: 'rotate', 
                        fontSize: '8px'
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: function (tooltip, record, item) 
                        {
                            var btcs = Ext.util.Format.number(record.get('btcs'), '0.00000000').replace(',', '.');
                            var usdt = Ext.util.Format.number(record.get('usdt'), '0.00').replace(',', '.');
                            tooltip.setHtml(record.get('coin') + ': ' + btcs + ' BTC (' + usdt + ' USDT)');
                        }                        
                    },
                    renderer: function(sprite, config, rendererData, index) 
                    {
                        var record = rendererData.store.getData().items[index];
                        if (record.data.color)
                        {
                            return Ext.apply(rendererData, {
                                fillStyle: record.data.color
                            });                            
                        }
                    }    
                }],
                listeners: {
                    afterrender: function () {
                        var chart = me.down('#cryptos-dashboard-floatingChart-chart');
                        var series = chart.getSeries(),
                            outerSeries = series[0],
                            store = outerSeries.getStore(),
                            dataMap = {},
                            dataList = [],
                            rec, innerStore;

                        //store.sort('market_coin', 'DESC');
                        store.sort('market_coin_order', 'ASC');

                        store.each(function () {
                            var market_coin = this.get('market_coin'),
                                value = dataMap[market_coin];

                            if (!value) {
                                dataMap[market_coin] = value = {};
                                value.market_coin = market_coin;
                                value.btcs = this.get('btcs');
                                value.usdt = this.get('usdt');
                            } else {
                                value.btcs += this.get('btcs');
                                value.usdt += this.get('usdt');
                            }
                        });

                        for (rec in dataMap) {
                            dataList.push(dataMap[rec]);
                        }

                        innerStore = Ext.create('Ext.data.Store', {
                            data: dataList
                        });

                        chart.setSeries([{
                            type: 'pie',
                            angleField: 'btcs',
                            label: {
                                field: 'market_coin',
                                display: 'inside'
                            },
                            store: innerStore,
                            radiusFactor: 70,
                            donut: 20,
                            tooltip: {
                                trackMouse: true,
                                renderer: function (tooltip, record, item) {
                                    var btcs = Ext.util.Format.number(record.get('btcs'), '0.00000000').replace(',', '.');
                                    var usdt = Ext.util.Format.number(record.get('usdt'), '0.00').replace(',', '.');
                                    tooltip.setHtml(Ext.String.capitalize(record.get('market_coin'))
                                        + ': ' + btcs + ' BTC (' + usdt + ' USDT)');
                                }
                            }
                        }, outerSeries]);
                    }
                }        
            }
        ];
        
        me.callParent(arguments); 
    },

    getDashboardController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.dashboard');
        return controller;
    }

});
