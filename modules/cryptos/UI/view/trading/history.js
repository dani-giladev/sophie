Ext.define('App.modules.cryptos.UI.view.trading.history', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.cryptos-trading-history',
    itemId: 'cryptos-trading-history',
    
    requires: [
        'App.modules.cryptos.UI.store.trading.history'
    ],
        
    border: false,
    frame: false,
    height: 400,
    scrollable: true,
                
    user_code: null,
    robot_code: null,
    
    initComponent: function()
    {
        var me = this;
        
        //var trans = me.getMaintenanceController().getTrans('cryptos');
        
        Ext.apply(me, {
            title: 'History',
            store: {
                type: 'cryptos_trading_history'
            },
            multiSelect: false,
            viewConfig: 
            {
                deferEmptyText: false,
                enableTextSelection: true,
                getRowClass: function () {
                    return this.enableTextSelection ? 'x-selectable' : '';
                }
            },  
            columns: 
            [
                {
                    text: 'Date',
                    dataIndex: 'date_time',
                    width: 150,
                    align: 'center'
                },
                {
                    text: 'Operation',
                    dataIndex: 'operation',
                    width: 120,
                    align: 'center'
                },
                {
                    text: 'Manual',
                    dataIndex: 'is_manual_operation',
                    width: 90,
                    align: 'center',
                    renderer: function(value) {
                        return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                    }                    
                },
                {
                    text: 'Amount',
                    dataIndex: 'amount',
                    width: 180,
                    align: 'center',
                    renderer: function(value, meta, record) {
                        return value + " " + record.get('coin');
                    }
                },
                {
                    text: 'Price',
                    dataIndex: 'price',
                    width: 180,
                    align: 'center',
                    renderer: function(value, meta, record) {
                        return value + " " + record.get('market_coin');
                    }
                },
                {
                    text: 'Gross Profit',
                    dataIndex: 'profit',
                    width: 180,
                    align: 'center',
                    renderer: function(value, meta, record) {
                        if (record.get('operation') === 'buy')
                        {
                            return '';
                        }
                        var html = value + " " + record.get('market_coin');
                        if (record.get('market_coin') === "USDT") return html;
                        html += '<br>' + record.get('profit_usdt') + " USDT";
                        return html;
                    }
                },
                {
                    text: 'Commission',
                    dataIndex: 'total_commission',
                    width: 180,
                    align: 'center',
                    renderer: function(value, meta, record) {
                        if (record.get('operation') === 'buy')
                        {
                            return '';
                        }
                        var html = 
                                value + " " + record.get('commission_coin') + '<br>' +
                                record.get('total_commission_usdt') + " USDT";
                        return html;
                    }
                },
                {
                    text: 'Net Profit',
                    dataIndex: 'total_profit',
                    width: 180,
                    align: 'center',
                    renderer: function(value, meta, record) {
                        if (record.get('operation') === 'buy')
                        {
                            return '';
                        }
                        var html = 
                                value + " " + 
                                //Ext.util.Format.round(value, 2).toFixed(2) + " " + 
                                record.get('market_coin') + //" " + 
                                "";
                        if (record.get('market_coin') === "USDT") return html;
                        html += '<br>' + record.get('total_profit_usdt') + " USDT";
                        //html += '<br>' + Ext.util.Format.round(record.get('total_profit_usdt'), 2).toFixed(2) + " USDT";
                        return html;
                    }
                },
                {
                    text: 'Profit perc.',
                    dataIndex: 'total_profit_perc',
                    width: 180,
                    align: 'center',
                    renderer: function(value, meta, record) {
                        if (record.get('operation') === 'buy')
                        {
                            return '';
                        }
                        return value + "%";
                    }
                },
                {
                    text: 'Working-time',
                    dataIndex: 'working_time',
                    width: 200,
                    align: 'center'
                },
                {
                    text: 'Transaction id',
                    dataIndex: '_id',
                    width: 200,
                    align: 'center',
                    renderer: function(value, meta, record) {
                        return '<div style="font-size:10px;">' + value + "</div>";
                    }
                }
            ]            
        });
        
        me.callParent(arguments);        
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.trading.trading');
        return controller;
    }
});