<?php

namespace modules\cryptos\model;

use modules\cryptos\model\robot;

/**
 *
 * @author Dani Gilabert
 *
 */
class historyRobotChanges extends robot
{
    public $type = 'cryptos_historyrobotchanges';

    public function __construct()
    {
        parent::__construct();        
        
        array_push($this->properties, 
            'date'
        );   
    }
}