Ext.define('App.modules.cryptos.UI.model.transaction', {
    extend: 'Ext.data.Model',

    requires: [

    ],

    fields: [
        {name: '_id'},

        // Main
        {name: 'code'},
        {name: 'user_code'},
        {name: 'user_name'},
        {name: 'robot_code'},
        
        // Robot
        {name: 'coinpair'},
        {name: 'coinpair_name'},
        {name: 'coin'},
        {name: 'market_coin'},
        {name: 'filter_type'},
        {name: 'filter_factor'},
        {name: 'amount'},
        
        // Trading
        {name: 'operation'},
        {name: 'is_manual_operation'},
        {name: 'last_transaction_id'},
        
        // Prices
        {name: 'price'},
        {name: 'profit'},
        {name: 'price_usdt'},
        {name: 'profit_usdt'},
        // Totals
        {name: 'total_commission'},
        {name: 'total_commission_usdt'},
        {name: 'total_profit'},
        {name: 'total_profit_usdt'},
        {name: 'total_profit_perc'},
        
        // Working time
        {name: 'working_seconds'},
        {name: 'working_time'},
        
        // Date/Time
        {name: 'date'},
        {name: 'time'},
        {name: 'date_time'},
        
        // Others
        {name: 'notes'}
    ]
});