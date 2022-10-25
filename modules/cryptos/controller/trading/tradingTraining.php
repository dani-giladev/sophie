<?php

namespace modules\cryptos\controller\trading;

// Controllers
use base\core\controller\helpers;
use modules\cryptos\controller\trading\trading;
use modules\cryptos\controller\transactionTraining;
use modules\cryptos\controller\sampleTraining;
use modules\cryptos\controller\training;

/**
 * Training trading controller
 *
 * @author Dani Gilabert
 */
class tradingTraining extends trading
{
    protected $_user_code;
    protected $_robot_code;
    protected $_using_sample_training_controller = false;
    
    public function __construct() {
        parent::__construct();
        $this->_transaction_controller = new transactionTraining();        
    }
    
    public function train($params)
    {
        if (!isset($params['user_code']) || !isset($params['robot_code']))
        {
            return helpers::resStruct(false, "Basic params are needed");
        }

        $user_code = $params['user_code'];
        $robot_code = $params['robot_code'];
        $period = $params['period'];
        $sdate = $params['start_date'];
        $record_samples = (isset($params['record_samples']) && ($params['record_samples'] == 'on' || $params['record_samples'] == 'true'));
        
        // Set dates
        $start_date = date('Y-m-d H:i:s', strtotime($sdate));
        $end_date = date('Y-m-d H:i:s', strtotime("+$period hours", strtotime($start_date)));
        
        $training_controller = new training();
        
        // Check if there is some pending training
        $trainings_in_progress = $training_controller->getTrainingsInProgress($user_code, $robot_code);
        if (!empty($trainings_in_progress))
        {
            return helpers::resStruct(false, "There is still some training in progress. Please, mark as finalized or remove it.");
        }
        
        // Create training
        $save_ret = $training_controller->save(array(
            'user_code' => $user_code,
            'robot_code' => $robot_code,
            
            'period' => $period,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'record_samples' => $record_samples
        ));
        
        $training_code = $save_ret['data']['training_code'];
        
        $is_debug = false;
        if ($is_debug)
        {
            $train_ret = $training_controller->train($training_code);
            if (!$train_ret['success'])
            {
                return helpers::resStruct(false, $train_ret['msg']);
            }
        }
        else
        {
            $command = "cd /var/www/html/sophie/ && php scripts/cryptos/trainingFork.php $training_code > /opt/tmp/trainingFork.output &";
            exec($command);              
        }
        
        return helpers::resStruct(true, "", array(
            'training_code' => $training_code
        ));
    }
    
    public function getTrainingProgress($params)
    {
        $training_code = $params['training_code'];
        
        $perc = 0;
        $any_error = false;
        $finalized = false;
        $msg = "";
        
        $training_controller = new training();
        
        $id = $training_controller->normalizeId($training_controller->model->type.'-'.$training_code);
        $doc = $training_controller->get($id)['data'];
        if (empty($doc))
        {
            $any_error = true;
            $finalized = true;
            $msg = "The training $training_code doesn't exist";            
        }
        else
        {
            $start_date = $doc['start_date'];
            $end_date = $doc['end_date'];
            $current_sample_date = $doc['current_sample_date'];
            $finalized = $doc['finalized'];
            
            if (!$finalized)
            {
                if (empty($current_sample_date))
                {
                    $msg = "Training not started yet! Wait please.";
                }
                else
                {
                    $total = strtotime($end_date) - strtotime($start_date);
                    $diff = strtotime($current_sample_date) - strtotime($start_date);
                    $perc = $diff / $total;   
                    $msg = "Training in progress...";                  
                }               
            }
            else
            {
                $perc = 1;
                
                $buyings = $doc['transactions'] - $doc['trades'];
                $msg = 
                        '<div>'.
                            'Transactions: <b>'.$doc['transactions'].'</b>'.'</br>'.
                            'Total profit USDT: <b>'.round($doc['total_profit_usdt'], 2).' USDT</b>'.'</br>'.
                            'Average profit perc.: <b>'.round($doc['total_profit_perc'], 2).' %</b>'.'</br>'.
                            'Hits: <b>'.$doc['hits'].'/'.$buyings.' ('.round($doc['hits_perc'], 2).'</b>%)'.
                        '';
                
                // Async
                if ($doc['is_asynchronous'])
                {
                    $grand_total_profit_usdt = $doc['total_profit_usdt'] + $doc['async_total_profit_usdt'];
                    $msg .= 
                            '</br></br>'.
                            'Async. transactions: '.$doc['async_transactions'].'</br>'.
                            'Async. total profit USDT: '.round($doc['async_total_profit_usdt'], 2).' USDT'.'</br>'.
                            '</br>'.
                            'Grand total profit USDT: <b>'.round($grand_total_profit_usdt, 2).' USDT</b>'.
                        '';
                    
                }
                $msg .= '</div>';
            }
        }
        
        return helpers::resStruct(true, $msg, array(
            'perc' => $perc,
            'any_error' => $any_error,
            'finalized' => $finalized
        ));
    }
    
    public function getMainChartData($params)
    {
        $this->_init($params);
        return parent::getMainChartData($params);
    }
    
    public function getRealTimeData($params)
    {
        $this->_init($params);
        return parent::getRealTimeData($params);
    }
    
    public function getDateOfSample($params)
    {
        $this->_init($params);
        return parent::getDateOfSample($params);
    }
    
    private function _init($params)
    {
        $is_training = ($params['is_training'] == 'true');
        $is_realtime = ($params['is_realtime'] == 'true');
        $show_training_samples = ($params['show_training_samples'] == 'true');
        
        $this->_user_code = $params['user_code'];
        $this->_robot_code = $params['robot_code'];
            
        if ($is_training && !$is_realtime && $show_training_samples)
        {
            $this->_using_sample_training_controller = true;
            $this->_sample_controller = new sampleTraining();
        }
    }
    
    protected function _getSamples($candlestick_interval, $max_filter_factor = null)
    {
        $start_date = $this->_start_date;
        if (!is_null($max_filter_factor))
        {
            $start_date = date('Y-m-d H:i:s', strtotime("-$max_filter_factor minute", strtotime($start_date)));
        }
        
        if ($this->_using_sample_training_controller)
        {
            return $this->_sample_controller->getSamplesByUserAndRobotAndIntervalAndDate($this->_user_code, $this->_robot_code, $candlestick_interval, $start_date, $this->_end_date);
        }
        
        return $this->_sample_controller->getSamples($candlestick_interval, $start_date, $this->_end_date);
    }
  
}
