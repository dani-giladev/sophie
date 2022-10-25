<?php

namespace modules\cryptos\model;

use base\core\model\model;

/**
 *
 * @author Dani Gilabert
 *
 */
class sample extends model
{
    public $db = 'cryptos-samples';
    public $type = 'cryptos_sample';

    public function __construct()
    {
        $this->properties = array(
            '_id',
            
            // Main
            'code',
            'candlestick_interval',
            
            // Values
            'sample_date',
            'samples_values',
            'robots_values',
            
            // Users snapshot
            'users',
            
            // Date/Time
            'date',
            'time',
            'date_time'
        );

        parent::__construct();
    }
}