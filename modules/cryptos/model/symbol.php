<?php

namespace modules\cryptos\model;

use base\core\model\model;

/**
 *
 * @author Dani Gilabert
 *
 */
class symbol extends model
{

    public function __construct()
    {
        $this->db = 'cryptos';
        $this->type = 'cryptos_symbol';

        $this->properties = array(
            '_id',
            
            // Main
            'code',
            'name',
            
            // Properties
            'available',
            'decimals',         // Decimals for amount
            'price_decimals',   // Decimals for price (limit orders)
            'min_notional',
            'status',
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