<?php

namespace modules\cryptos\model;

use base\core\model\model;

/**
 *
 * @author Dani Gilabert
 *
 */
class marketCoin extends model
{

    public function __construct()
    {
        $this->db = 'cryptos';
        $this->type = 'cryptos_marketcoin';

        $this->properties = array(
            '_id',
            
            // Main
            'code',
            'name',
            
            // Initial buying
            'buying_amount',
            'buying_fiat_coin',
            'buying_price',
            'buying_date',
            
            // Properties
            'reserve',
            'free_balance',
            'free_balance_usdt',
            'notes',
            
            // Creation
            'created_by_user',
            'created_by_user_name',
            'creation_date', 

            // Last modification
            'modified_by_user',
            'modified_by_user_name',
            'last_modification_date'
        );

        parent::__construct();
    }
}