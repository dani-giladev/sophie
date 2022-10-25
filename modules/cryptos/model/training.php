<?php

namespace modules\cryptos\model;

use base\core\model\model;

/**
 *
 * @author Dani Gilabert
 *
 */
class training extends model
{
    public $type = 'cryptos_training';

    public function __construct()
    {
        $this->db = 'cryptos-training';

        $this->properties = array(
            '_id',
            
            // Main
            'code',
            
            // User
            'user_code',
            'user_name',
            
            // Robot
            'robot_code',
            'robot_name',
            'coinpair',
            'coinpair_name',
            
            // Training
            'finalized',
            'period',
            'start_date',
            'end_date',
            'record_samples',
            
            // Result
            'error_msg',
            'current_sample_date',
            'number_of_trainings',
            'training_number',
            
            'robot',
            'total_profit_usdt',
            'total_profit_perc',
            'transactions',
            'trades',
            'hits',
            'hits_perc',
            'total_time',
            
            // Async
            'is_asynchronous',
            'async_transactions',
            'async_total_profit_usdt',
            
            // Creation
            'created_by_user',
            'created_by_user_name',
            'creation_date',
        );

        parent::__construct();
    }
}