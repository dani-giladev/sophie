Ext.define('App.modules.cryptos.UI.view.dashboard.centerpanel', {
    extend: 'App.view.dashboard.centerpanel',
    alias: 'widget.cryptos-dashboard-centerpanel',
    
    requires: [
        'App.view.dashboard.centerpanel',
        'App.modules.cryptos.UI.view.dashboard.realBalanceChart',
        'App.modules.cryptos.UI.view.dashboard.floatingChart',
        'App.modules.cryptos.UI.view.dashboard.changeTimeChart',
        'App.modules.cryptos.UI.view.dashboard.changeTimeByMarketcoinChart'
    ],
    
    border: true,
    scrollable: true,
    bodyPadding: 10,
    
    getItems: function()
    {
        var me = this;
        
        return [
            {
                xtype: 'panel',
                title: '',
                layout: 'vbox',
                width: 1520,
                height: 664,
                border: false,
                frame: false,
                items:
                [
                    me.getLastRefresh(),
                    me.getTodaysProfitss(),
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items:
                        [
                            me.getRealBalance(),
                            me.getFloating(),
                            me.getChangeTime()
                        ]
                    }
                ]
            }
        ];

    },

    getLastRefresh: function()
    {
        return {
            xtype: 'panel',
            itemId: 'cryptos-dashboard-last_refresh',
            html: 'Last refresh at <b> ? </b>',
            margin: '5 0 10 0'
        };        
    },

    getTodaysProfitss: function()
    {
        var me = this;
        
        return {
            xtype: 'panel',
            itemId: 'cryptos-dashboard-today_profits',
            title: "Today's profits",
            width: '100%',
            border: false,
            frame: false,
            items:
            [
                {
                    xtype: 'panel',
                    border: true,
                    frame: false,
                    layout: {
                        type: 'table',
                        columns: 12,
                        tableAttrs: {
                            style: {
                                width: '100%',
                                'text-align': 'center'
                            }
                        }/*,
                        tdAttrs: {
                            style: {
                                border: '1px solid #ccc'
                            }
                        },*/
                    },
    //                        defaults: {
    //                            bodyPadding: 10,
    //                        },
                    items:
                    [

                        /*
                         * HEADER
                         */
                        {
                            html: 'Gross profit USDT',
                            bodyStyle: me.getBodyStyleCell(true, true),
                            style: me.getStyleCell(true, false)
                        },
                        {
                            html: 'Commission USDT',
                            bodyStyle: me.getBodyStyleCell(true, true),
                            style: me.getStyleCell(true, false)
                        },
                        {
                            html: 'Net profit USDT',
                            bodyStyle: me.getBodyStyleCell(true, true),
                            style: me.getStyleCell(true, false)
                        },
                        {
                            html: '% Profit',
                            bodyStyle: me.getBodyStyleCell(true, true),
                            style: me.getStyleCell(true, false)
                        },
                        {
                            html: 'Net profit USDT now!',
                            bodyStyle: me.getBodyStyleCell(true, true),
                            style: me.getStyleCell(true, false)
                        },
                        {
                            html: 'Net profit BTC',
                            bodyStyle: me.getBodyStyleCell(true, true),
                            style: me.getStyleCell(true, false)
                        },
                        {
                            html: 'Net profit ETH',
                            bodyStyle: me.getBodyStyleCell(true, true),
                            style: me.getStyleCell(true, false)
                        },
                        {
                            html: 'Net profit BNB',
                            bodyStyle: me.getBodyStyleCell(true, true),
                            style: me.getStyleCell(true, false)
                        },
                        {
                            html: 'Net profit XRP',
                            bodyStyle: me.getBodyStyleCell(true, true),
                            style: me.getStyleCell(true, false)
                        },
                        {
                            html: 'Net profit USDT',
                            bodyStyle: me.getBodyStyleCell(true, true),
                            style: me.getStyleCell(true, false)
                        },
                        {
                            html: 'Nº of buyings',
                            bodyStyle: me.getBodyStyleCell(true, true),
                            style: me.getStyleCell(true, false)
                        },
                        {
                            html: 'Nº of sellings',
                            bodyStyle: me.getBodyStyleCell(true, true),
                            style: me.getStyleCell(true, true)
                        },

                        /*
                         * ROW
                         */
                        {
                            html: '-',
                            itemId: 'cryptos-dashboard-sum_profit_usdt',
                            bodyStyle: me.getBodyStyleCell(false, false),
                            style: me.getStyleCell(false, false)
                        },
                        {
                            html: '-',
                            itemId: 'cryptos-dashboard-sum_total_commission_usdt',
                            bodyStyle: me.getBodyStyleCell(false, false),
                            style: me.getStyleCell(false, false)
                        },
                        {
                            html: '-',
                            itemId: 'cryptos-dashboard-sum_total_profit_usdt',
                            bodyStyle: me.getBodyStyleCell(false, true),
                            style: me.getStyleCell(false, false)
                        },
                        {
                            html: '-',
                            itemId: 'cryptos-dashboard-sum_total_profit_perc',
                            bodyStyle: me.getBodyStyleCell(false, true),
                            style: me.getStyleCell(false, false)
                        },
                        {
                            html: '-',
                            itemId: 'cryptos-dashboard-sum_total_profit_usdt_now',
                            bodyStyle: me.getBodyStyleCell(false, false),
                            style: me.getStyleCell(false, false)
                        },
                        {
                            html: '-',
                            itemId: 'cryptos-dashboard-sum_total_market_profit_btc',
                            bodyStyle: me.getBodyStyleCell(false, false),
                            style: me.getStyleCell(false, false)
                        },
                        {
                            html: '-',
                            itemId: 'cryptos-dashboard-sum_total_market_profit_eth',
                            bodyStyle: me.getBodyStyleCell(false, false),
                            style: me.getStyleCell(false, false)
                        },
                        {
                            html: '-',
                            itemId: 'cryptos-dashboard-sum_total_market_profit_bnb',
                            bodyStyle: me.getBodyStyleCell(false, false),
                            style: me.getStyleCell(false, false)
                        },
                        {
                            html: '-',
                            itemId: 'cryptos-dashboard-sum_total_market_profit_xrp',
                            bodyStyle: me.getBodyStyleCell(false, false),
                            style: me.getStyleCell(false, false)
                        },
                        {
                            html: '-',
                            itemId: 'cryptos-dashboard-sum_total_market_profit_usdt',
                            bodyStyle: me.getBodyStyleCell(false, false),
                            style: me.getStyleCell(false, false)
                        },
                        {
                            html: '-',
                            itemId: 'cryptos-dashboard-sum_buyings',
                            bodyStyle: me.getBodyStyleCell(false, false),
                            style: me.getStyleCell(false, false)
                        },
                        {
                            html: '-',
                            itemId: 'cryptos-dashboard-sum_trades',
                            bodyStyle: me.getBodyStyleCell(false, false),
                            style: me.getStyleCell(false, true)
                        }
                    ]                        
                }
            ]
        };        
    },

    getBodyStyleCell: function(is_header, is_bold)
    {
        var ret = {};
        
        if (is_header)
        {
            ret = {
                'background-color': 'lightskyblue',
                'color': 'white',
                'font-weight': 'bold'//,
                //'font-size': '14px'
            };
        }
        else
        {
            ret = {

            };
        }
        
        if (is_bold)
        {
            ret['font-weight'] = 'bold';
        }
        
        return ret;
    },

    getStyleCell: function(is_header, is_the_last_cell)
    {
        var ret = {};
        
        if (is_header)
        {
            ret = {
                'background-color': 'lightskyblue',
                'border-bottom': '1px solid #5fa2dd',
                'padding': '10px'
            };
        }
        else
        {
            ret = {
                'padding': '10px'
            };
        }
        
        if (!is_the_last_cell)
        {
            ret['border-right'] = '1px solid #5fa2dd';
        }
        
        return ret;
    },

    getRealBalance: function()
    {
        return {
            xtype: 'panel',
            itemId: 'cryptos-dashboard-realBalance',
            title: 'Real balance',
            margin: '10 0 0 0',
            width: 500,
            height: 500,    
            border: true,
            frame: false,        
            items: []
        };        
    },

    getFloating: function()
    {
        return {
            xtype: 'panel',
            itemId: 'cryptos-dashboard-floating',
            title: 'Floating',
            margin: '10 0 0 10',
            width: 500,
            height: 500,    
            border: true,
            frame: false,        
            items: []
        };        
    },

    getChangeTime: function()
    {
        return {
            xtype: 'panel',
            itemId: 'cryptos-dashboard-changeTime',
            title: 'Change time 24h',
            margin: '10 0 0 10',
            width: 500,
            height: 500,    
            border: true,
            frame: false,        
            items: []
        };        
    },

    getDashboardController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.dashboard');
        return controller;
    }

});