<?php

namespace modules\cryptos\robot;

// Controllers
use base\core\controller\helpers;
use modules\cryptos\controller\training as cryptoTraining;
use modules\cryptos\controller\transactionTraining;
// Robot
use modules\cryptos\robot\common;
use modules\cryptos\robot\store;
use modules\cryptos\robot\trading\trading;
use modules\cryptos\robot\filtering;
use modules\cryptos\robot\samplingTraining;

/**
 *
 * @author Dani Gilabert
 * 
 */
class training extends common
{
    protected $_user;
    protected $_robot;
    protected $_start_date;
    protected $_end_date;
    protected $_record_samples;
    protected $_samples;
    protected $_training_code;
    protected $_wild;
    protected $_max_filter_factor;
    
    public function init($params)
    {
        $this->_user = $params['user'];
        $this->_robot = $params['robot'];
        $this->_start_date = $params['start_date'];
        $this->_end_date = $params['end_date'];
        $this->_record_samples = isset($params['record_samples'])? $params['record_samples'] : null;
        $this->_training_code = isset($params['training_code'])? $params['training_code'] : null;
        $this->_wild = isset($params['wild'])? $params['wild'] : true;
        
        // Reset storage
        store::resetSampling();
        store::resetTrading();
    }
    
    public function setMaxFilterFactor($value = null)
    {
        if (is_null($value))
        {
            $value = $this->_robot_controller->getMaxFilterFactor($this->_robot);
        }
        
        $this->_max_filter_factor = $value;        
    }
    
    public function getSmpls()
    {
        return $this->_samples;
    }
    
    public function setSmpls($value = null)
    {
        if (is_null($value))
        {
            $robot = $this->_robot;
            $candlestick_interval = $robot['candlestick_interval'];
            $value = $this->_getSamples($candlestick_interval, $this->_start_date, $this->_end_date, $this->_max_filter_factor);
        }
        
        $this->_samples = $value;
    }
    
    public function checkRequirements()
    {
        if (empty($this->_samples))
        {
            return helpers::resStruct(false, "No samples between dates");
        }
        
        return helpers::resStruct(true);
    }
    
    public function train()
    {
        $user = $this->_user;
        $user_code = $user['userdata']['code'];
        $robot = $this->_robot;
        $robot_code = $robot['code'];
        $coinpair = $robot['coinpair'];
        $start_date = $this->_start_date;
        $record_samples = $this->_record_samples;
        $samples = $this->_samples;
        $is_asynchronous = $this->_robot_controller->isAsynchronous($robot);
        
        // Init controllers
        $trading_controller = new trading();
        $filtering_controller = new filtering();
        $sampling_training_controller = new samplingTraining();
        $crypto_training_controller = new cryptoTraining();
        
        // Set up robot for training
        $robot['is_running'] = false; // Stop robot
        $robot['is_training'] = true;
        $robot['last_operation'] = '';
        $robot['manual_operation'] = '';
        
        // Update robot
        if ($this->_wild)
        {
            $is_asynchronous = false;
            $robot['rw_enabled'] = false;
            $robot['asynchronous_enabled'] = false;
        }
        else
        {
            $this->_robot_controller->model->save($robot['_id'], $robot);
        }
        
        // Trick to cheat robot daemon
        $robot['is_running'] = true;
        $robot['training_mode'] = ($this->_wild)? 'wild' : 'history';
        
        // Totals
        $total_profit_usdt = 0;
        $total_profit_perc = 0;
        $transactions = 0;
        $buyings = 0;
        $sellings = 0;
        $hits = 0;
        $update_training_counter = 0;
        
        // To avoid: Fatal error: Maximum execution time of 30 seconds exceeded
        set_time_limit(0);
        
        // For each sample...
        //$total_samples = count($samples);
        foreach($samples as $sample_key => $sample)
        {
            $sample_date = $sample['sample_date'];
            $samples_values = $sample['samples_values'];
            
            if (!isset($samples_values[$coinpair]))
            {
                continue;
            }
            
//            // Test
//            $test_time = '17:07'; // 2018-07-25
//            if (date('H:i', strtotime($sample_date)) == $test_time)
//            {
//                $test = true;
//            }
            //echo '  -> '."Analyzing sample ".($sample_key + 1)." of $total_samples"."\r";

            // Add sample
            store::setLastSampleWs($samples_values);
            store::setDbSample($sample);
            store::addSample($samples_values);
            store::setDateSample($sample_date);
            
            // Add sample to robot
            $this->addSample($user, $robot, $samples_values);
            
            // Filtering
            $filtering_controller->calculateRobotTrack($user, $robot);
            $filtering_controller->calculateIndicatorsValues($user, $robot);
            
            if (strtotime($sample_date) >= strtotime($start_date))
            {
                // Trade!
                $trading_ret = $trading_controller->trade($user, $robot);   
                if ($trading_ret !== false)
                {
                    // Update robot values of user in memory
                    $robot = $trading_ret['robot'];
                    //usleep(0.1 * 1000 * 1000);
                    
                    $transaction = $trading_ret['transaction'];
                    if (!empty($transaction))
                    {
                        $transactions++;
                        $operation = $transaction['operation'];
                        if ($operation === 'buy')
                        {
                            $buyings++;
                        }
                        else
                        {
                            $sellings++;
                            $total_profit_usdt += $transaction['total_profit_usdt'];
                            $total_profit_perc += $transaction['total_profit_perc'];
                            if ($transaction['total_profit_usdt'] > 0)
                            {
                                $hits++;
                            }
                        }
                        
                        if (!$transaction['asynchronous'])
                        {
                            $this->setLastTransaction($user, $robot, $transaction['operation'], $transaction);
                        }                        
                    }
                }
            }
            
            // Add robots values
            $robots_values = store::getCurrentRobotsValues();
            store::addRobotsValues($robots_values);

            // Sampling
            if (isset($record_samples) && $record_samples)
            {
                $sampling_training_controller->setCurrentValues($user, $robot);
                $sampling_training_controller->saveSample();
                //usleep(0.1 * 1000 * 1000);                 
            }

            // Reset last real prices
            $this->resetLastPrices(array());
            
            // Update training progress
            $update_training_counter++;
            if (isset($this->_training_code) && !$this->_wild && $update_training_counter > (60 * 60))
            {   
                $update_training_counter = 0;
                $training_id = $crypto_training_controller->normalizeId($crypto_training_controller->model->type.'-'.$this->_training_code);
                $crypto_training_doc = $crypto_training_controller->get($training_id)['data'];
                $crypto_training_doc['current_sample_date'] = $sample_date;
                $save_ret = $crypto_training_controller->model->save($training_id, $crypto_training_doc);
            }
        }
        
        $trades = $sellings;
        $total_profit_perc = ($trades == 0)? 0 : ($total_profit_perc / $trades);
        $hits_perc = ($buyings == 0)? 0 : (($hits * 100) / $buyings);
        
        // Check all async. buying and not completed
        $async_transactions = 0;
        $async_total_profit_usdt = 0;
        if ($is_asynchronous)
        {
            $pending_asynchronous_transactions = store::getPendingAsynchronousTransactions($user_code, $robot_code);            
            $async_transactions = count($pending_asynchronous_transactions);
            if ($async_transactions > 0)
            {
                $last_prices = $this->getLastPrices($user, $robot);
                $robot_track_value = $this->getRobotTrackValue($user, $robot);
                $transaction_controller = new transactionTraining();
                
                foreach ($pending_asynchronous_transactions as $async_transaction)
                {
                    $amount = $async_transaction['amount'];
                    $transaction_ret = $transaction_controller->save(array(
                        // Main
                        'user' => $user,
                        'robot' => $robot,
                        // Trading
                        'operation' => 'sell',
                        'is_manual_operation' => true,
                        'prices' => $last_prices,
                        'robot_track_value' => $robot_track_value,
                        'order' => array(),
                        'last_transaction' => $async_transaction,
                        'amount' => $amount,
                        'is_asynchronous_transaction' => true
                    ));
                    
                    $new_transaction = $transaction_ret['transaction'];
                    $async_total_profit_usdt += $new_transaction['total_profit_usdt'];
                    
                    // Complete async. buying transaction
                    $transaction_id = $async_transaction['_id'];
                    $transaction_doc = $transaction_controller->model->get($transaction_id)['data'];
                    $transaction_doc['completed'] = true;
                    // Save transaction
                    $transaction_controller->model->save($transaction_id, $transaction_doc);              
                }                   
            }
        }
        
        return helpers::resStruct(true, "", array(
            'total_profit_usdt' => $total_profit_usdt,
            'total_profit_perc' => $total_profit_perc,
            'transactions' => $transactions,
            'trades' => $trades,
            'hits' => $hits,
            'hits_perc' => $hits_perc,
            // Async
            'is_asynchronous' => $is_asynchronous,
            'async_transactions' => $async_transactions,
            'async_total_profit_usdt' => $async_total_profit_usdt
        ));
    }
    
    private function _getSamples($candlestick_interval, $start_date, $end_date, $max_filter_factor)
    {
        if (!is_null($max_filter_factor))
        {
            $start_date = date('Y-m-d H:i:s', strtotime("-$max_filter_factor minute", strtotime($start_date)));
        }
        
        return $this->_sample_controller->getSamples($candlestick_interval, $start_date, $end_date);
    }
    
}
