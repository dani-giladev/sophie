<?php

namespace modules\cryptos\model;

use modules\cryptos\model\sample;

/**
 *
 * @author Dani Gilabert
 *
 */
class sampleTraining extends sample
{
    public $db = 'cryptos-training';

    public function __construct()
    {
        parent::__construct();        
        
        array_push($this->properties, 
            'user_code',
            'robot_code'
        );   
    }

}