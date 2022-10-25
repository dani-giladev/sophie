<?php

namespace modules\cryptos\model;

use modules\cryptos\model\training;

/**
 *
 * @author Dani Gilabert
 *
 */
class wildTraining extends training
{
    public $type = 'cryptos_wild_training';

    public function __construct()
    {
        parent::__construct();
    
        array_push($this->properties, 
            'original_robot'
            ,'original_robot_total_profit_usdt'
            ,'original_robot_total_profit_perc'
            ,'original_robot_transactions'
            ,'original_robot_trades'
            ,'original_robot_hits'
            ,'original_robot_hits_perc'
            ,'original_robot_total_time'
                
            // The best custom robot   
            ,'bcr'
            ,'bcr_total_profit_usdt'
            ,'bcr_total_profit_perc'
            ,'bcr_transactions'
            ,'bcr_trades'
            ,'bcr_hits'
            ,'bcr_hits_perc'
            ,'bcr_total_time'
            ,'bcr_training_number'
                
            ,'final_total_time'                    
            ,'validated'
            ,'winner'
            ,'max_time'
        );
                    
    }

}