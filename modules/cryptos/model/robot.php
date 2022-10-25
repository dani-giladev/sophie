<?php

namespace modules\cryptos\model;

use base\core\model\model;

/**
 *
 * @author Dani Gilabert
 *
 */
class robot extends model
{
    public $type = 'cryptos_robot';
    public $wt_properties = array();

    public function __construct()
    {
        $this->db = 'cryptos';

        $this->properties = array(
            '_id',
            
            // Main
            'code',
            'name',
            'candlestick_interval',
            'group',
            'inherit_id',
            
            // Coins
            'coinpair',
            'coinpair_name',
            'coin',
            'market_coin',
            
            // Properties
            'available',
            'favourite',
            'order',
            'notes',
            
            // Trading
            'is_running',
            'is_training',
            'last_operation',
            'manual_operation',
            'amount',
            'amount_unit',
            'commission',
            'commission_coin',
            
            // Scalping
            'filter_type',
            'filter_factor',
            // Buying parameters
            'enabled_to_buy',
            'buying_deactivation_date',
            'buying_deactivation_price',
            //'buying_candlestick_interval',
            'takeoff',
            'takeoff_filter_type',
            'takeoff_filter_factor',
            'min_green_candle_size',
            'number_of_samples_with_price_always_going_up',
            'change_min',
            'change_max',
            'change_max_disable_buy',
            'change_time',
            'perc_price_vs_robot_track',
            'perc_skip_buying_if_price_is_close_to_last_selling',
            'disable_buying_when_sell',
            'disable_buying_when_buy',
            // Selling parameters
            'enabled_to_sell',
            'takeprofit',
            'takeprofit_trailing',
            'takeprofit2',
            'takeprofit2_trailing',
            'stoploss',
            'stoploss_filter_type',
            'stoploss_filter_factor',
            
            // Indicators
            // Moving Averages
            'ma_enabled_to_buy',
            'ma_fast_filter_type',
            'ma_fast_filter_factor',
            'ma_slow_filter_type',
            'ma_slow_filter_factor',
            // MACD
            'macd_enabled_to_buy',
            'macd_enabled_to_sell',
            'macd_macd1_filter_type',
            'macd_macd1_filter_factor',
            'macd_macd2_filter_type',
            'macd_macd2_filter_factor',
            'macd_signal_filter_type',
            'macd_signal_filter_factor',
            'macd_min_lowest_value',
            'macd_max_lowest_value',
            // RSI
            'rsi_enabled_to_buy',
            'rsi_periods',
            'rsi_oversold',
            'rsi_overbought',
            'rsi_smoothed',
            'rsi_signal_filter_type',
            'rsi_signal_filter_factor',
            // OBV
            'obv_enabled_to_buy',
            'obv_fast_filter_type',
            'obv_fast_filter_factor',
            'obv_slow_filter_type',
            'obv_slow_filter_factor',
            // Volume
            'volume_enabled_to_buy',
            'volume_fast_filter_type',
            'volume_fast_filter_factor',
            'volume_slow_filter_type',
            'volume_slow_filter_factor',
            'perc_volume_vs_average',
            
            // Wild training (wt)
            'wt_enabled',
            'wt_group',
            'wt_bcr_min_trades',
            'wt_bcr_max_trades',
            'wt_bcr_min_hits_perc',
            
            // Red & White
            'rw_enabled',
            'rw_max_consecutive_failures',
            
            // Strategies
            'strategy',
            
            // Asynchronous
            'asynchronous_enabled',
            
            // Last training data
            'last_modification_comesfrom_training',
            'last_training_code',
            'last_training_was_wild',
            'last_training_winner',
            
            // Creation
            'created_by_user',
            'created_by_user_name',
            'creation_date', 

            // Last modification
            'modified_by_user',
            'modified_by_user_name',
            'last_modification_date'
        );

        // Wild training (wt)
        
        // Scalping
        $this->wt_scalping_properties = array(
            'wt_filter_factor',
            'wt_takeoff',
            'wt_takeoff_filter_factor',
            'wt_min_green_candle_size',
            'wt_number_of_samples_with_price_always_going_up',
            'wt_change_min',
            'wt_change_max',
            'wt_change_max_disable_buy',
            'wt_change_time',
            'wt_perc_price_vs_robot_track',
            'wt_perc_skip_buying_if_price_is_close_to_last_selling',
            'wt_stoploss',
            'wt_stoploss_filter_factor',
            'wt_takeprofit',
            'wt_takeprofit_trailing',
            'wt_takeprofit2',
            'wt_takeprofit2_trailing'
        );
        
        $this->wt_ma_properties = array(
            'wt_ma_fast_filter_factor',
            'wt_ma_slow_filter_factor'            
        );
        
        $this->wt_macd_properties = array(
            'wt_macd_macd1_filter_factor',
            'wt_macd_macd2_filter_factor',
            'wt_macd_signal_filter_factor',
            'wt_macd_min_lowest_value',
            'wt_macd_max_lowest_value'            
        );
        
        $this->wt_rsi_properties = array(
            'wt_rsi_periods',
            'wt_rsi_oversold',
            'wt_rsi_overbought',
            'wt_rsi_signal_filter_factor'            
        );
        
        $this->wt_obv_properties = array(
            'wt_obv_fast_filter_factor',
            'wt_obv_slow_filter_factor'            
        );
        
        $this->wt_volume_properties = array(
            'wt_volume_fast_filter_factor',
            'wt_volume_slow_filter_factor',
            'wt_perc_volume_vs_average'            
        );
        
        // Merge with Indicators
        $this->wt_properties = array_merge(
                $this->wt_scalping_properties, 
                $this->wt_ma_properties, 
                $this->wt_macd_properties, 
                $this->wt_rsi_properties, 
                $this->wt_obv_properties, 
                $this->wt_volume_properties
        );

        parent::__construct();
    }
}