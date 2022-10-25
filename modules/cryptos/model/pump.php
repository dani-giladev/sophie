<?php

namespace modules\cryptos\model;

use base\core\model\model;

/**
 *
 * @author Dani Gilabert
 *
 */
class pump extends model
{
    public $db = 'cryptos';
    public $type = 'cryptos_pump';

    public function __construct()
    {
        $this->properties = array(
            '_id',
            
            // Main
            'code',
            
            // Coins
            'coinpair',
            'coinpair_name',
            'coin',
            'market_coin',
            
            // Trading
            'amount',
            'amount_unit',
            'amount_decimals',  // Decimals for amount
            'price_decimals',   // Decimals for price (limit orders)
            'commission',
            'commission_coin',
            
            // Buying
            'buying_price',
            'buying_order',
            'buying_order_filled',
            'buying_commission_value',
            'buying_commission_market',
            
            // Selling
            'selling_number_of_stoploss_orders',
            'selling_orders',
            'selling_last_order',
            'selling_pending_amount',
            'selling_price',
            'selling_commission_value',
            'selling_commission_market',
            
            // Additional
            'completed',
            'log',
            'last_modification_date',
            
            // Creation
            'created_by_user',
            'created_by_user_name',
            'creation_date'
        );

        parent::__construct();
    }

}