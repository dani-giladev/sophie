<?php

namespace modules\cryptos\controller\trading;

// Controllers
use base\core\controller\helpers;
use modules\cryptos\controller\robot;
use modules\cryptos\controller\sample;
use modules\cryptos\controller\transaction;
// Robot
use modules\cryptos\robot\filtering;
use modules\cryptos\robot\store;
use modules\cryptos\robot\user;


/**
 * Chart trading controller
 *
 * @author Dani Gilabert
 */
class chart
{
    protected $_start_date;
    protected $_end_date;
    // Controllers
    protected $_robot_controller;
    protected $_sample_controller;
    protected $_transaction_controller;
    
    public function __construct() {
        $this->_robot_controller = new robot();
        $this->_sample_controller = new sample();
        $this->_transaction_controller = new transaction();       
    }
    
    public function getMainChartData($params)
    {
        if (!isset($params['user_code']) || !isset($params['robot_code']))
        {
            return helpers::resStruct(true);
        }
        
        $user_code = $params['user_code'];
        $robot_code = $params['robot_code'];
        $is_realtime = ($params['is_realtime'] == 'true');
        $period = $params['period'];
        $start_date = $params['start_date'];
        $custom_filter_type = (isset($params['custom_filter_type']))? $params['custom_filter_type']: "ema";
        $custom_filter_factor = (isset($params['custom_filter_factor']))? $params['custom_filter_factor']: 1;
        $custom_filter_value = null;
                        
        // Set dates
        $this->_setDates($is_realtime, $period, $start_date);
        
        // Init controllers
        $filtering_controller = new filtering();
        $user_controller = new user();
        
        // Get the user doc
        $user_doc = $user_controller->getUserDoc($user_code);
        if (empty($user_doc))
        {
            return helpers::resStruct(false, "User doesn't exist");
        }
        
        // Get robot
        $id = $this->_robot_controller->normalizeId('cryptos_robot-'.$user_code.'-'.$robot_code);
        $robot = $this->_robot_controller->get($id)['data'];
        if (empty($robot))
        {
            return helpers::resStruct(false, "Robot doesn't exist");
        }
        
        // Set robot properties
        $coinpair = $robot['coinpair'];
        $candlestick_interval = $this->_robot_controller->getValue($robot, 'candlestick_interval');
        
        // Get the user with robots
        $user = $user_controller->getUser($user_doc, $candlestick_interval);
        if (empty($user))
        {
            return helpers::resStruct(false, "User doesn't have available robots");
        }
        
        // Get max filter factor value
        $max_filter_factor = max(
            $this->_robot_controller->getMaxFilterFactor($robot, array('ma', 'obv', 'volume')),
            $custom_filter_factor
        );
        
        // Get samples
        $data_samples = array();
        $samples = $this->_getSamples($candlestick_interval, $max_filter_factor);
        if (!empty($samples))
        {
            foreach($samples as $sample)
            {
                $sample_date = $sample['sample_date'];
                $samples_values = $sample['samples_values'];
                
                if (!isset($samples_values[$coinpair]))
                {
                    continue;
                }
                
                $values = $samples_values[$coinpair];
                $real_time_value = $values['close']; 
                
                $robot_values = $this->_getRobotValues($sample, $user, $robot);
                if (empty($robot_values))
                {
                    $robot_values['robot_track_value'] = $real_time_value;
                }
                
                $robot_track_value = $robot_values['robot_track_value']; 

                // Add sample
                store::addSample($samples_values);
                $last_sample = store::getLastSample();
                
                // Filtering
                $filtering_controller->calculateIndicatorsValues($user, $robot, array('ma', 'obv', 'volume'), true);
                
                // Get filter values
                $custom_filter_value = $filtering_controller->filterSample($custom_filter_value, $last_sample, $coinpair, $custom_filter_type, $custom_filter_factor);
                
                // Add robots values
                //$robots_values = store::getCurrentRobotsValues();
                $robots_values = array();
                $robots_values[$user_code][$robot_code] = $robot_values;
                store::addRobotsValues($robots_values);

                if (\strtotime($sample_date) < \strtotime($this->_start_date))
                {
                    continue;
                }
 
                $ma_fast_filter_value = $filtering_controller->getFilterValues($user, $robot, 'ma_fast')['filter_value'];
                $ma_slow_filter_value = $filtering_controller->getFilterValues($user, $robot, 'ma_slow')['filter_value'];
                $obv_fast_filter_value = $filtering_controller->getFilterValues($user, $robot, 'obv_fast')['filter_value'];
                $obv_slow_filter_value = $filtering_controller->getFilterValues($user, $robot, 'obv_slow')['filter_value'];
                $volume_fast_filter_value = $filtering_controller->getFilterValues($user, $robot, 'volume_fast')['filter_value'];
                $volume_slow_filter_value = $filtering_controller->getFilterValues($user, $robot, 'volume_slow')['filter_value'];
                
                // Build sample
                $sam = array(
                    "date_time" => $sample_date, 
                    "real_time_value" => $real_time_value, 
                    "robot_track_value" => $robot_track_value,
                    
                    "open" => $values['open'],
                    "high" => $values['high'],
                    "low" => $values['low'],
                    "close" => $values['close'],
                    "volume" => $values['volume'],
                    
                    "ma_fast_filter" => (isset($ma_fast_filter_value)? ($ma_fast_filter_value) : 0),
                    "ma_slow_filter" => (isset($ma_slow_filter_value)? ($ma_slow_filter_value) : 0),
                    "obv_fast_filter" => (isset($obv_fast_filter_value)? $obv_fast_filter_value : 0),
                    "obv_slow_filter" => (isset($obv_slow_filter_value)? $obv_slow_filter_value : 0),
                    "volume_fast_filter" => (isset($volume_fast_filter_value)? $volume_fast_filter_value : 0),
                    "volume_slow_filter" => (isset($volume_slow_filter_value)? $volume_slow_filter_value : 0),
                    "custom_filter" => ($custom_filter_value)
                );
                
                // Add data sample
                $data_samples[] = $sam;
            }
        }     
        
        $is_working = false;
        
        // Get transactions
        $data_transactions = array();     
        $end_date = date('Y-m-d H:i:s', strtotime("+2 days", strtotime($this->_end_date)));
        $transactions = $this->_transaction_controller->getTransactions($user_code, $robot_code, $this->_start_date, $end_date);
        if (!empty($transactions))
        {
            $is_working = ($transactions[0]['operation'] !== 'buy');
            
            foreach($transactions as $transaction)
            {
                //$date_time = date('Y-m-d H:i', strtotime("-1 minute", strtotime($transaction['date_time']))).':00';
                $date_time = date('Y-m-d H:i:s', strtotime("-1 minute", strtotime($transaction['date_time'])));
                
                if (strtotime($date_time) > strtotime($this->_end_date))
                {
                    break;
                }
                
                $data_transactions[] = array(
                    "date_time" => $date_time, 
                    "transaction_price" => ($transaction['price']), 
                    "operation" => $transaction['operation']                   
                );                    
            }
        }
        
        // Merge and sort all data
        $data = array_merge($data_samples, $data_transactions);
        $sorted_data = helpers::sortArrayByField($data, 'date_time');
        
        // Build final data
        $last_sample = array();
        foreach ($sorted_data as $key => $values)
        {
            if (isset($values['operation']))
            {
                if (!empty($last_sample))
                {
                    $sorted_data[$key]['real_time_value'] = $last_sample['real_time_value'];
                    $sorted_data[$key]['robot_track_value'] = $last_sample['robot_track_value'];
                    
                    $sorted_data[$key]['open'] = $last_sample['open'];
                    $sorted_data[$key]['high'] = $last_sample['high'];
                    $sorted_data[$key]['low'] = $last_sample['low'];
                    $sorted_data[$key]['close'] = $last_sample['close'];
                    $sorted_data[$key]['volume'] = $last_sample['volume'];
                    
                    $sorted_data[$key]['ma_fast_filter'] = $last_sample['ma_fast_filter'];
                    $sorted_data[$key]['ma_slow_filter'] = $last_sample['ma_slow_filter'];
                    $sorted_data[$key]['obv_fast_filter'] = $last_sample['obv_fast_filter'];
                    $sorted_data[$key]['obv_slow_filter'] = $last_sample['obv_slow_filter'];
                    $sorted_data[$key]['volume_fast_filter'] = $last_sample['volume_fast_filter'];
                    $sorted_data[$key]['volume_slow_filter'] = $last_sample['volume_slow_filter'];
                    $sorted_data[$key]['custom_filter'] = $last_sample['custom_filter'];
                }
                else
                {
                    $sorted_data[$key]['real_time_value'] = $values['transaction_price'];
                    $sorted_data[$key]['robot_track_value'] = $values['transaction_price'];
                    
                    $sorted_data[$key]['open'] = $values['transaction_price'];
                    $sorted_data[$key]['high'] = $values['transaction_price'];
                    $sorted_data[$key]['low'] = $values['transaction_price'];
                    $sorted_data[$key]['close'] = $values['transaction_price'];
                    $sorted_data[$key]['volume'] = $values['transaction_price'];
                    
                    $sorted_data[$key]['ma_fast_filter'] = $values['transaction_price'];
                    $sorted_data[$key]['ma_slow_filter'] = $values['transaction_price'];
                    $sorted_data[$key]['obv_fast_filter'] = 0;
                    $sorted_data[$key]['obv_slow_filter'] = 0;
                    $sorted_data[$key]['volume_fast_filter'] = 0;
                    $sorted_data[$key]['volume_slow_filter'] = 0;
                    $sorted_data[$key]['custom_filter'] = $values['transaction_price'];
                }
                $is_working = ($values['operation'] === 'buy');
            }
            else
            {
                $sorted_data[$key]['is_working'] = $is_working;
                $last_sample = $values;
            }
        }
    
        return helpers::resStruct(true, "", $sorted_data);
    }
    
    public function getSecondChartData($params)
    {
        if (!isset($params['user_code']) || !isset($params['robot_code']))
        {
            return helpers::resStruct(true);
        }
        
        $user_code = $params['user_code'];
        $robot_code = $params['robot_code'];
        $is_realtime = ($params['is_realtime'] == 'true');
        $period = $params['period'];
        $start_date = $params['start_date'];
                        
        // Set dates
        $this->_setDates($is_realtime, $period, $start_date);  
        
        // Init controllers
        $filtering_controller = new filtering();
        $user_controller = new user();
        
        // Get the user doc
        $user_doc = $user_controller->getUserDoc($user_code);
        if (empty($user_doc))
        {
            return helpers::resStruct(false, "User doesn't exist");
        }
        
        // Get robot
        $id = $this->_robot_controller->normalizeId('cryptos_robot-'.$user_code.'-'.$robot_code);
        $robot = $this->_robot_controller->get($id)['data'];
        if (empty($robot))
        {
            return helpers::resStruct(false, "Robot doesn't exist");
        }
        
        // Set robot properties
        $coinpair = $robot['coinpair'];
        $candlestick_interval = $this->_robot_controller->getValue($robot, 'candlestick_interval');
        
        // Get the user with robots
        $user = $user_controller->getUser($user_doc, $candlestick_interval);
        if (empty($user))
        {
            return helpers::resStruct(false, "User doesn't have available robots");
        }
        
        // Get max filter factor value
        $max_filter_factor = $this->_robot_controller->getMaxFilterFactor($robot, array('macd', 'rsi'));
        
        // Params
        $rsi_oversold = $this->_robot_controller->getValue($robot, 'rsi_oversold');
        $rsi_overbought = $this->_robot_controller->getValue($robot, 'rsi_overbought');
        
        // Get samples
        $data = array();
        $samples = $this->_getSamples($candlestick_interval, $max_filter_factor);
        if (!empty($samples))
        {
            foreach($samples as $sample)
            {
                $sample_date = $sample['sample_date'];
                $samples_values = $sample['samples_values'];
                
                if (!isset($samples_values[$coinpair]))
                {
                    continue;
                }
                
                $values = $samples_values[$coinpair];
                $real_time_value = $values['close']; 
                
                $robot_values = $this->_getRobotValues($sample, $user, $robot);
                if (empty($robot_values))
                {
                    $robot_values['robot_track_value'] = $real_time_value;
                }               

                // Add sample
                store::addSample($samples_values);
                
                // Filtering
                $filtering_controller->calculateIndicatorsValues($user, $robot, array('macd', 'rsi'), true);
                
                // Add robots values
                //$robots_values = store::getCurrentRobotsValues();
                $robots_values = array();
                $robots_values[$user_code][$robot_code] = $robot_values;
                store::addRobotsValues($robots_values);
                
                if (\strtotime($sample_date) < \strtotime($this->_start_date))
                {
                    continue;
                }
 
                // MACD
                $macd_value = $filtering_controller->getRobotValue($user, $robot, 'macd');
                $macd_signal_value = $filtering_controller->getFilterValues($user, $robot, 'macd_signal')['filter_value'];
                $macdh_value = $filtering_controller->getRobotValue($user, $robot, 'macdh');
                
                // RSI
                $rsi_value = $filtering_controller->getRobotValue($user, $robot, 'rsi');
                $rsi_signal_value = $filtering_controller->getFilterValues($user, $robot, 'rsi_signal')['filter_value'];
                
//                // Test
//                if (isset($robot_values['macd_signal_filter_values']))
//                {
//                    $macd_value = $robot_values['macd'];
//                    $macd_signal_value = $robot_values['macd_signal_filter_values']['filter_value'];
//                }
//                else
//                {
//                    $macd_value = 0;
//                    $macd_signal_value = 0;
//                }

                // Build sample
                $sam = array(
                    "date_time" => $sample_date, 
                    
                    // MACD
                    "macd" => (isset($macd_value)? ($macd_value) : 0),
                    "macd_signal" => (isset($macd_signal_value)? ($macd_signal_value) : 0),
                    "macdh" => (isset($macdh_value)? ($macdh_value) : 0),
                    
                    // RSI
                    "rsi" => (isset($rsi_value)? $rsi_value : 0),
                    "rsi_oversold" => $rsi_oversold,
                    "rsi_overbought" => $rsi_overbought,
                    "rsi_signal" => (isset($rsi_signal_value)? $rsi_signal_value : 0)
                );
                
                // Add data sample
                $data[] = $sam;
            }
        }    
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function getDateOfSample($params)
    {
        $user_code = $params['user_code'];
        $robot_code = $params['robot_code'];
        $period = $params['period'];
        $start_date = $params['start_date'];
        $type = $params['type'];
        
        // Get robot
        $id = $this->_robot_controller->normalizeId('cryptos_robot-'.$user_code.'-'.$robot_code);
        $robot = $this->_robot_controller->get($id)['data'];
        if (empty($robot))
        {
            return helpers::resStruct(false, "Robot doesn't exist");
        }
        
        $candlestick_interval = $robot['candlestick_interval'];
        
        // Get sample
        switch ($type) {
            case 'fast-backward':
                $first_sample = $this->_sample_controller->getFirstSample($candlestick_interval);
                if (empty($first_sample))
                {
                    return helpers::resStruct(false, "No samples registered yet!");
                }
                $dt = $first_sample['sample_date'];                
                break;
            
            case 'step-backward':
                $dt = date('Y-m-d H:i:s', strtotime("-$period hours", strtotime($start_date)));
                break;
            
            case 'step-forward':
                $dt = date('Y-m-d H:i:s', strtotime("+$period hours", strtotime($start_date)));
                break;
            
            case 'fast-forward':
                $last_sample = $this->_sample_controller->getLastSample($candlestick_interval);
                if (empty($last_sample))
                {
                    return helpers::resStruct(false, "No samples registered yet!");
                }
                $last_date = $last_sample['sample_date'];
                $dt = date('Y-m-d H:i:s', strtotime("-$period hours", strtotime($last_date)));
                break;

            default:
                return helpers::resStruct(false, "Unknown option!");
        } 
        
        $data = array(
            'date_time' => $dt,
            'y' => substr($dt, 0, 4),
            'm' => substr($dt, 5, 2),
            'd' => substr($dt, 8, 2),
            'H' => substr($dt, 11, 2),
            'i' => substr($dt, 14, 2),
            's' => substr($dt, 17, 2),
        );
        
        return helpers::resStruct(true, "", $data);
    }
    
    protected function _getSamples($candlestick_interval, $max_filter_factor = null)
    {
        $start_date = $this->_start_date;
        if (!is_null($max_filter_factor))
        {
            $max_fc_start_date = date('Y-m-d H:i:s', strtotime("-$max_filter_factor minute", strtotime($start_date)));
            if (strtotime($max_fc_start_date) < strtotime($start_date))
            {
                $start_date = $max_fc_start_date;
            }
        }
        
        return $this->_sample_controller->getSamples($candlestick_interval, $start_date, $this->_end_date);
    }
    
    protected function _getRobotValues($sample, $user, $robot, $excluded_robots = array())
    {
        $coinpair = $robot['coinpair'];
        $user_code = $user['userdata']['code'];
        $robot_code = $robot['code'];
        
        if (isset($sample['robots_values'][$user_code]) && isset($sample['robots_values'][$user_code][$robot_code]))
        {
            return $sample['robots_values'][$user_code][$robot_code];
        }
        
        foreach ($user['robots'] as $robot_values)
        {
            if ($coinpair === $robot_values['coinpair'] && $robot_code !== $robot_values['code'] && !in_array($robot_values['code'], $excluded_robots))
            {
                array_push($excluded_robots, $robot_code);
                $robot_values = $this->_getRobotValues($sample, $user, $robot_values, $excluded_robots);
                if (!empty($robot_values))
                {
                    return $robot_values;
                }
            }
            
        }
        
        return array();
    }
  
}
