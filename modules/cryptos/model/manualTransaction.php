<?php

namespace modules\cryptos\model;

use base\core\model\model;

/**
 *
 * @author Dani Gilabert
 *
 */
class manualTransaction extends model
{
    public $db = 'cryptos';
    public $type = 'cryptos_manualtransaction';

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
            'operation',
            'order',
            
            // Prices
            'price',
            'price_usdt',
            
            // Commission
            'commission_value',
            'commission_coin',
            'commission_usdt',
            'commission_market',
            
            // Creation
            'created_by_user',
            'created_by_user_name',
            'creation_date'
        );

        parent::__construct();
    }
}