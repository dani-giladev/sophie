<?php

namespace modules\cryptos\controller;

use base\core\controller\helpers;
use modules\cryptos\controller\robot;

/**
 * Report robot controller
 *
 * @author Dani Gilabert
 */
class reportRobots extends robot
{
    
    public function getFiltered($params)
    {
        $get_charts = isset($params['get_charts']) ? $params['get_charts'] : null;
        
        $data = parent::getFiltered(array(
            'user_code' => 'allusers',
            'get_charts' => $get_charts
        ))['data'];
        return helpers::resStruct(true, "", $data);
    }
    
}
