<?php

namespace modules\cryptos\model;

use base\core\model\model;

/**
 *
 * @author Dani Gilabert
 *
 */
class transaction extends model
{
    public $db = 'cryptos';
    
    public function __construct()
    {
        $this->type = 'cryptos_transaction';

        $this->properties = array(
            '_id',
            
            // Main
            'code',
            'user_code',
            'user_name',
            'robot_code',
            'robot_name',
            
            // Robot
            'coinpair',
            'coinpair_name',
            'coin',
            'market_coin',
            'amount',
            
            // Trading
            'operation',
            'is_manual_operation',
            'robot_track_value',
            'order',
            'last_transaction_id',            
            
            // Prices
            'price',
            'price_usdt',
            // Profit
            'profit',
            'profit_usdt',
            // Commission
            'commission_perc',
            'commission',
            'commission_coin',
            'commission_usdt',
            'commission_market',
            // Totals
            'total_commission',
            'total_commission_usdt',
            'total_commission_market',
            'total_profit',
            'total_profit_usdt',
            'total_profit_perc',
            
            // Working time
            'working_seconds',
            'working_time',
            
            // Date/Time
            'date',
            'time',
            'date_time',

            // Asynchronous  
            'asynchronous',
            'completed' ,
            'selling_order_activated',
            
            // FIAT Profits
            'buying_price',
            'fiat_buying_price',
            'fiat_current_price',
            'converted_to_fiat',
            'fiat_date',
            'fiat_time',
            'fiat_date_time',
            'fiat_order',
            'fiat_amount',
            'fiat_net_profit',
            'fiat_net_profit_perc',
            'fiat_coin',
            'fiat_commission_perc',
            'fiat_commission',
            'fiat_commission_coin',
            'fiat_commission_usdt',
            'fiat_commission_market',
            
            // Withdrawal
            'withdrawal',
            
            // Others
            'notes',
            'is_old' // Before 03/04/2020
        );

        parent::__construct();
    }
}