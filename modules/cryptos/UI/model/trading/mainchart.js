Ext.define('App.modules.cryptos.UI.model.trading.mainchart', {
    extend: 'Ext.data.Model',

    requires: [

    ],

    fields: [

        {name: 'date_time'},
        {name: 'real_time_value'},
        {name: 'robot_track_value'},
        
        {name: 'open'},
        {name: 'high'},
        {name: 'low'},
        {name: 'close'},
        {name: 'volume'},
        
        {name: 'transaction_price'},
        {name: 'operation'},
        
        {name: 'ma_fast_filter'},
        {name: 'ma_slow_filter'},
        {name: 'obv_fast_filter'},
        {name: 'obv_slow_filter'},
        {name: 'volume_fast_filter'},
        {name: 'volume_slow_filter'},
        {name: 'custom_filter'}

    ]
});