<?php

namespace modules\cryptos\model;

use base\core\model\model;

/**
 *
 * @author Dani Gilabert
 *
 */
class prices extends model
{
    public $type = 'cryptos_prices';

    public function __construct()
    {
        $this->db = 'cryptos';

        $this->properties = array(
            '_id',
            
            // Main
            'prices',
            
            // Last modification
            'last_modification_date'
        );

        parent::__construct();
    }
}