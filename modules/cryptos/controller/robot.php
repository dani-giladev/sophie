<?php

namespace modules\cryptos\controller;

use base\core\controller\controller;
use base\core\controller\helpers;
use modules\cryptos\controller\symbol;
use modules\cryptos\controller\sample;
use modules\cryptos\controller\binance;
use modules\cryptos\controller\transaction;
use modules\cryptos\controller\transactionTraining;
use modules\cryptos\controller\historyRobotChanges;
use modules\cryptos\controller\robotGroup;
use modules\cryptos\controller\user;

/**
 * robot controller
 *
 * @author Dani Gilabert
 */
class robot extends controller
{
    protected $_symbol_controller;
    protected $_sample_controller;
    
    public function __construct()
    {
        parent::__construct();
        $this->_symbol_controller = new symbol();
        $this->_sample_controller = new sample();
    }
    
    public function getAll()
    {
        $view = $this->model->getView("robot");
        $data = $view->exec();
        return $data;
    }
    
    public function getFiltered($params)
    {
        $user_code = isset($params['user_code']) ? $params['user_code'] : $this->token->getUserCode();
        $available = isset($params['available']) ? ($params['available'] == 'true' || $params['available'] == 'on') : null;
        $candlestick_interval = isset($params['candlestick_interval']) ? $params['candlestick_interval'] : null;
        $get_funds = isset($params['get_funds']) ? ($params['get_funds'] == 'true' || $params['get_funds'] == 'on') : false;
        $get_charts = isset($params['get_charts']) ? ($params['get_charts'] == 'true' || $params['get_charts'] == 'on') : false;
        $prices = false;
        
        $raw_data = $this->getAll()['data'];
        if (empty($raw_data))
        {
            return helpers::resStruct(true);
        }

        if ($get_funds)
        {
            // Get from cache
            $cached_funds_data = $this->cache->get("sophie-cryptos-robot-funds");
            if (isset($cached_funds_data) && (strtotime($cached_funds_data['last_update']) < strtotime("-30 minutes") ))
            {
                $cached_funds_data = null;
            }
            if (!isset($cached_funds_data))
            {
                // Get real prices
                $prices = $this->getPrices($user_code);
                // Get robots groups in order to set funds
                $robot_group_controller = new robotGroup();
                $raw_robot_groups = $robot_group_controller->getFiltered(array())['data'];
                $robot_groups = array();
                foreach ($raw_robot_groups as $robots_group) {
                    $robot_groups[$robots_group['created_by_user']][$robots_group['code']] = $robots_group;
                }                
                $new_cached_funds_data = array(
                    'robots' => array(),
                    'last_update' => date('Y-m-d H:i:s')
                ); 
            }
        }
            
        $data = array();
        $candlestick_intervals = array();
        foreach($raw_data as $robot)
        {
            $robot_code = $robot['code'];
                
            if (isset($user_code) && $user_code !== $robot['created_by_user'] && $user_code !== 'allusers')
            {
                continue;
            }

            if (isset($available) && $available != $robot['available'])
            {
                continue;
            }

            if (isset($candlestick_interval) && $candlestick_interval !== $robot['candlestick_interval'])
            {
                continue;
            }

            // Set order
            if (!isset($robot['order']))
            {
                $robot['order'] = '100';
            }

            $robot['in_production'] = !$robot['is_training'];

            // Grouping
            $robot['robot_grouping'] = $robot['created_by_user_name'];
            
            // Calculate funds and percentage
            if ($get_funds)
            {
                if (!isset($cached_funds_data))
                {
                    $funds = $this->getFunds($robot, $prices, $robot_groups);
                    $new_cached_funds_data['robots'][$robot_code] = array(
                        'funds' => $funds
                    );                    
                }
                else
                {
                    $funds = (isset($cached_funds_data['robots'][$robot_code]))? $cached_funds_data['robots'][$robot_code]['funds'] : array();
                }
                $robot = array_merge($robot, $funds);
            }
            
            // Add 
            if (!in_array($robot['candlestick_interval'], $candlestick_intervals))
            {
                array_push($candlestick_intervals, $robot['candlestick_interval']);
            }
            
            // Clean item
            $this->model->clean($robot);

            // Add item
            $data[] = $robot; 
        }
        
        // Get charts
        if (!empty($data) && $get_charts)
        {
            // Get from cache
            $cached_charts_data = $this->cache->get("sophie-cryptos-robot-charts");
            if (isset($cached_charts_data) && (strtotime($cached_charts_data['last_update']) < strtotime("-30 minutes") ))
            {
                $cached_charts_data = null;
            }
            if (!isset($cached_charts_data))
            {
                if ($prices === false)
                {
                    // Get real prices
                    $prices = $this->getPrices($user_code);
                } 
                // Get samples
                $setting_prices_charts = $this->getSettingPricesCharts(array('user_code' => $user_code))['data'];
                $period = $setting_prices_charts['period']; // days
                $interval = $setting_prices_charts['interval']; // hours
                $samples_by_candlestick_interval = array();
                $times_a_days = 24 / $interval;
                $max = $times_a_days * $period;
                $max++;
                $start_date = date('Y-m-d H:i:s', strtotime("-$period days"));
                for($i=0; $i<$max; $i++)
                {
                    $hours = $i * $interval;
                    $date = date('Y-m-d H:i:s', strtotime("+$hours hours", strtotime($start_date)));
                    foreach ($candlestick_intervals as $candlestick_interval)
                    {
                        $sample = $this->_sample_controller->getSample($candlestick_interval, $date);
                        if (!empty($sample))
                        {
                            $samples_by_candlestick_interval[$candlestick_interval][] = $sample;
                        }
                    }                
                }
                $new_cached_charts_data = array(
                    'coinpairs' => array(),
                    'last_update' => date('Y-m-d H:i:s')
                );               
            }
        
            // Add charts to each robot
            foreach ($data as $data_key => $robot)
            {
                $robot_code = $robot['code'];
                $coinpair = $robot['coinpair'];
                /*if ($robot_code === 'celr-60')
                {
                    $test = true;
                }*/
                if (!isset($cached_charts_data))
                {
                    $candlestick_interval = $robot['candlestick_interval'];
                    $samples = isset($samples_by_candlestick_interval[$candlestick_interval])? $samples_by_candlestick_interval[$candlestick_interval] : array();
                    
                    // Add last sample and last price
                    if ($prices === false)
                    {
                        $sample = $this->_sample_controller->getLastSample($candlestick_interval);
                    }
                    else
                    {
                        $sample = array(
                            'samples_values' => array(
                                $coinpair => array(
                                    'close' => $prices[$coinpair]
                                )
                            ),
                            'sample_date' => date('Y-m-d H:i:s')
                        );
                    }
                    if (!empty($sample))
                    {
                        $samples[] = $sample;                   
                    }
                    
                    $chart_ret = $this->_getPriceChart($robot, $samples);
                    $chart_values = $chart_ret['values'];
                    $min_value = $chart_ret['min_value'];
                    $max_value = $chart_ret['max_value'];
                    $last_value = $chart_ret['last_value'];
                    $change_by_robot_html = $chart_ret['change_by_robot_html'];
                    $change_by_robot_basic_value_html = $chart_ret['change_by_robot_basic_value_html'];
                    
                    if ($min_value == 0)
                    {
                        $diff_min_value = 100;
                    }
                    else
                    {
                        $diff_min_value = (($last_value - $min_value) / $min_value) * 100;
                    }
                    if ($last_value == 0)
                    {
                        $diff_max_value = 100;
                    }
                    else
                    {
                        $diff_max_value = (($max_value - $last_value) / $last_value) * 100;
                    }
                    $chart_info = array(
                        'chart_min_value' => $min_value,
                        'chart_max_value' => $max_value,
                        'chart_last_value' => $last_value,
                        'chart_diff_min_value' => round($diff_min_value, 2),
                        'chart_diff_max_value' => round($diff_max_value * (-1), 2),
                        'period' => $period,
                        'interval' => $interval,
                        'change_by_robot_html' => $change_by_robot_html,
                        'change_by_robot_basic_value_html' => $change_by_robot_basic_value_html
                    );
                    $new_cached_charts_data['coinpairs'][$coinpair] = array(
                        'chart_values' => $chart_values,
                        'chart_info' => $chart_info
                    );
                }
                else
                {
                    $chart_values = (isset($cached_charts_data['coinpairs'][$coinpair]))? $cached_charts_data['coinpairs'][$coinpair]['chart_values'] : array();
                    $chart_info = (isset($cached_charts_data['coinpairs'][$coinpair]))? $cached_charts_data['coinpairs'][$coinpair]['chart_info'] : array();
                }
                
                $robot['chart'] = !empty($chart_values)? $chart_values : array(0, 0);
                $robot['chart_info'] = $chart_info;
                
                $data[$data_key] = $robot;
            }
            
            if (!isset($cached_charts_data))
            {
                // Save to cache
                $this->cache->set("sophie-cryptos-robot-charts", $new_cached_charts_data);                
            }
        }
        
        // Update funds on cache
        if (!empty($data) && $get_funds && !isset($cached_funds_data))
        {
            // Save to cache
            $this->cache->set("sophie-cryptos-robot-funds", $new_cached_funds_data);  
        }

        if (!empty($data))
        {
            $data = helpers::sortArrayByMultipleFields($data, array('order' => 'asc', 'wt_group' => 'asc'));
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function getSettingPricesCharts($params)
    {
        $user_code = isset($params['user_code']) ? $params['user_code'] : $this->token->getUserCode();
        
        // Get the user doc
        $user_controller = new user();
        $doc = $user_controller->getUserByCode($user_code);
        
        if (empty($doc) || !isset($doc['cryptos_setting_prices_charts']))
        {
            $data = array(
                'period' => '30',
                'interval' => '6'
            );            
        }
        else
        {
            $data = $doc['cryptos_setting_prices_charts'];
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function setSettingPricesCharts($params)
    {
        if (!isset($params['period']) || !isset($params['interval']))
        {
            return helpers::resStruct(false, "Fuck you!");
        }
        
        $user_code = isset($params['user_code']) ? $params['user_code'] : $this->token->getUserCode();
        $period = $params['period'];   
        $interval = $params['interval']; 
        
        // Get the user doc
        $user_controller = new user();
        $doc = $user_controller->getUserByCode($user_code);
        if (empty($doc))
        {
            return helpers::resStruct(false, "User with code '$user_code' does not exist");
        }
        
        $id = $doc['_id'];
        
        $doc['cryptos_setting_prices_charts'] = array(
            'period' => $period,
            'interval' => $interval
        );
          
        $user_controller->model->save($id, $doc);
        
        // Reset data on cache
        $this->cache->set("sophie-cryptos-robot-charts", null);          
        
        return helpers::resStruct(true);
    }
    
    protected function _getPriceChart($robot, $samples)
    {
        $coinpair = $robot['coinpair'];
        $change_time = $this->getValue($robot, 'change_time');
        
        $chart_values = array();
        $real_time_value = 0;
        $min_value = null;
        $max_value = null;
        $change_time_first_price = null;
        $change_by_robot_html = '';
        $change_by_robot_basic_value_html = '';
        
        //$last_sample_id = end($samples)['_id'];
        foreach($samples as $sample)
        {
            $samples_values = $sample['samples_values'];
            
            // Test
            /*if ($last_sample_id === $sample['_id'])
            {
                $test = true;
            }*/
                
            if (!isset($samples_values[$coinpair]))
            {
                continue;
            }
            
            $values = $samples_values[$coinpair];
            $real_time_value = $values['close']; 
            
            if (is_null($min_value) || $real_time_value < $min_value)
            {
                $min_value = $real_time_value;
            }
            if (is_null($max_value) || $real_time_value > $max_value)
            {
                $max_value = $real_time_value;
            }
            
            $chart_values[] = $real_time_value;
            
            // Change time
            if (!is_null($change_time) && is_null($change_time_first_price))
            {
                $sample_date = $sample['sample_date'];
                $end_date = date('Y-m-d H:i:s');
                $dt = date('Y-m-d H:i', strtotime("-$change_time hours", strtotime($end_date))).':00';
                if (strtotime($sample_date) >= strtotime($dt))
                {
                    $change_time_first_price = $real_time_value;
                }
            }
        }
        
        $last_value = $real_time_value;
        
        if (!is_null($change_time_first_price))
        {
            $change_values = $this->getChangeValues($robot, $change_time_first_price, $last_value);
            $change_by_robot_html = $change_values['change_by_robot_html'];
            $change_by_robot_basic_value_html = $change_values['change_by_robot_basic_value_html'];
        }
            
        return array(
            'values' => $chart_values,
            'min_value' => $min_value,
            'max_value' => $max_value,
            'last_value' => $last_value,
            'change_by_robot_html' => $change_by_robot_html,
            'change_by_robot_basic_value_html' => $change_by_robot_basic_value_html
        );
    }
    
    public function save($params)
    {
        if (!isset($params))
        {
            return helpers::resStruct(false, "Fuck you!");
        }
        
        // Main
        $t = microtime(true);
        $micro = sprintf("%06d",($t - floor($t)) * 1000000);
        $code = (isset($params['code']))? $params['code'] : $code = date("YmdHjs").$micro;
        $name = (isset($params['name']))? $params['name'] : "";
        $candlestick_interval = (isset($params['candlestick_interval']))? $params['candlestick_interval'] : "";
        $group = (isset($params['group']))? $params['group'] : "";
        $inherit_id = (isset($params['inherit_id']))? $params['inherit_id'] : "";
        // Properties
        $available = (isset($params['available']) && ($params['available'] == 'on' || $params['available'] == 'true'));
        $favourite = (isset($params['favourite']) && ($params['favourite'] == 'on' || $params['favourite'] == 'true'));
        $order = (isset($params['order']) && !empty($params['order']))? $params['order'] : "100";
        $notes = (isset($params['notes']))? $params['notes'] : "";
        // Coins
        $coinpair = (isset($params['coinpair']))? $params['coinpair'] : "";
        // Trading
        $is_training = (isset($params['is_training']) && ($params['is_training'] == 'on' || $params['is_training'] == 'true'));
        $amount = (isset($params['amount']))? $params['amount'] : 0;
        $amount_unit = (isset($params['amount_unit']))? $params['amount_unit'] : 'coin';
        //$commission = (isset($params['commission']))? $params['commission'] : 0;
        //$commission_coin = (isset($params['commission_coin']))? $params['commission_coin'] : "";
        // Scalping
        $filter_type = (isset($params['filter_type']))? $params['filter_type'] : "";
        $filter_factor = (isset($params['filter_factor']))? $params['filter_factor'] : "";
        // Buying parameters
        $enabled_to_buy = (isset($params['enabled_to_buy']) && ($params['enabled_to_buy'] == 'on' || $params['enabled_to_buy'] == 'true'));
        //$buying_candlestick_interval = (isset($params['buying_candlestick_interval']))? $params['buying_candlestick_interval'] : "";
        $takeoff = (isset($params['takeoff']))? $params['takeoff'] : 0;
        $takeoff_filter_type = (isset($params['takeoff_filter_type']))? $params['takeoff_filter_type'] : "";
        $takeoff_filter_factor = (isset($params['takeoff_filter_factor']))? $params['takeoff_filter_factor'] : "";
        $min_green_candle_size = (isset($params['min_green_candle_size']))? $params['min_green_candle_size'] : "";
        $number_of_samples_with_price_always_going_up = (isset($params['number_of_samples_with_price_always_going_up']))? $params['number_of_samples_with_price_always_going_up'] : "";        
        $change_min = (isset($params['change_min']))? $params['change_min'] : "";
        $change_max = (isset($params['change_max']))? $params['change_max'] : "";
        $change_max_disable_buy = (isset($params['change_max_disable_buy']))? $params['change_max_disable_buy'] : "";
        $change_time = (isset($params['change_time']))? $params['change_time'] : "";
        $perc_price_vs_robot_track = (isset($params['perc_price_vs_robot_track']))? $params['perc_price_vs_robot_track'] : "";
        $perc_skip_buying_if_price_is_close_to_last_selling = (isset($params['perc_skip_buying_if_price_is_close_to_last_selling']))? $params['perc_skip_buying_if_price_is_close_to_last_selling'] : "";
        $disable_buying_when_sell = (isset($params['disable_buying_when_sell']) && ($params['disable_buying_when_sell'] == 'on' || $params['disable_buying_when_sell'] == 'true'));        
        $disable_buying_when_buy = (isset($params['disable_buying_when_buy']) && ($params['disable_buying_when_buy'] == 'on' || $params['disable_buying_when_buy'] == 'true'));                
        // Selling parameters
        $enabled_to_sell = (isset($params['enabled_to_sell']) && ($params['enabled_to_sell'] == 'on' || $params['enabled_to_sell'] == 'true'));
        $takeprofit = (isset($params['takeprofit']))? $params['takeprofit'] : 0;
        $takeprofit_trailing = (isset($params['takeprofit_trailing']))? $params['takeprofit_trailing'] : 0;
        $takeprofit2 = (isset($params['takeprofit2']))? $params['takeprofit2'] : 0;
        $takeprofit2_trailing = (isset($params['takeprofit2_trailing']))? $params['takeprofit2_trailing'] : 0;
        $stoploss = (isset($params['stoploss']))? $params['stoploss'] : 0;
        $stoploss_filter_type = (isset($params['stoploss_filter_type']))? $params['stoploss_filter_type'] : "";
        $stoploss_filter_factor = (isset($params['stoploss_filter_factor']))? $params['stoploss_filter_factor'] : "";
        // Indicators
        // Moving Averages
        $ma_enabled_to_buy = (isset($params['ma_enabled_to_buy']) && ($params['ma_enabled_to_buy'] == 'on' || $params['ma_enabled_to_buy'] == 'true'));
        $ma_fast_filter_type = (isset($params['ma_fast_filter_type']))? $params['ma_fast_filter_type'] : "";
        $ma_fast_filter_factor = (isset($params['ma_fast_filter_factor']))? $params['ma_fast_filter_factor'] : "";
        $ma_slow_filter_type = (isset($params['ma_slow_filter_type']))? $params['ma_slow_filter_type'] : "";
        $ma_slow_filter_factor = (isset($params['ma_slow_filter_factor']))? $params['ma_slow_filter_factor'] : "";
        // MACD
        $macd_enabled_to_buy = (isset($params['macd_enabled_to_buy']) && ($params['macd_enabled_to_buy'] == 'on' || $params['macd_enabled_to_buy'] == 'true'));
        $macd_enabled_to_sell = (isset($params['macd_enabled_to_sell']) && ($params['macd_enabled_to_sell'] == 'on' || $params['macd_enabled_to_sell'] == 'true'));        
        $macd_macd1_filter_type = (isset($params['macd_macd1_filter_type']))? $params['macd_macd1_filter_type'] : "";
        $macd_macd1_filter_factor = (isset($params['macd_macd1_filter_factor']))? $params['macd_macd1_filter_factor'] : "";
        $macd_macd2_filter_type = (isset($params['macd_macd2_filter_type']))? $params['macd_macd2_filter_type'] : "";
        $macd_macd2_filter_factor = (isset($params['macd_macd2_filter_factor']))? $params['macd_macd2_filter_factor'] : "";
        $macd_signal_filter_type = (isset($params['macd_signal_filter_type']))? $params['macd_signal_filter_type'] : "";
        $macd_signal_filter_factor = (isset($params['macd_signal_filter_factor']))? $params['macd_signal_filter_factor'] : "";
        $macd_min_lowest_value = (isset($params['macd_min_lowest_value']))? $params['macd_min_lowest_value'] : "";
        $macd_max_lowest_value = (isset($params['macd_max_lowest_value']))? $params['macd_max_lowest_value'] : "";
        // RSI
        $rsi_enabled_to_buy = (isset($params['rsi_enabled_to_buy']) && ($params['rsi_enabled_to_buy'] == 'on' || $params['rsi_enabled_to_buy'] == 'true'));
        $rsi_periods = (isset($params['rsi_periods']))? $params['rsi_periods'] : "";
        $rsi_oversold = (isset($params['rsi_oversold']))? $params['rsi_oversold'] : "";
        $rsi_overbought = (isset($params['rsi_overbought']))? $params['rsi_overbought'] : "";
        $rsi_smoothed = (isset($params['rsi_smoothed']) && ($params['rsi_smoothed'] == 'on' || $params['rsi_smoothed'] == 'true'));
        $rsi_signal_filter_type = (isset($params['rsi_signal_filter_type']))? $params['rsi_signal_filter_type'] : "";
        $rsi_signal_filter_factor = (isset($params['rsi_signal_filter_factor']))? $params['rsi_signal_filter_factor'] : "";
        // OBV
        $obv_enabled_to_buy = (isset($params['obv_enabled_to_buy']) && ($params['obv_enabled_to_buy'] == 'on' || $params['obv_enabled_to_buy'] == 'true'));
        $obv_fast_filter_type = (isset($params['obv_fast_filter_type']))? $params['obv_fast_filter_type'] : "";
        $obv_fast_filter_factor = (isset($params['obv_fast_filter_factor']))? $params['obv_fast_filter_factor'] : "";
        $obv_slow_filter_type = (isset($params['obv_slow_filter_type']))? $params['obv_slow_filter_type'] : "";
        $obv_slow_filter_factor = (isset($params['obv_slow_filter_factor']))? $params['obv_slow_filter_factor'] : "";
        // Volume
        $volume_enabled_to_buy = (isset($params['volume_enabled_to_buy']) && ($params['volume_enabled_to_buy'] == 'on' || $params['volume_enabled_to_buy'] == 'true'));
        $volume_fast_filter_type = (isset($params['volume_fast_filter_type']))? $params['volume_fast_filter_type'] : "";
        $volume_fast_filter_factor = (isset($params['volume_fast_filter_factor']))? $params['volume_fast_filter_factor'] : "";
        $volume_slow_filter_type = (isset($params['volume_slow_filter_type']))? $params['volume_slow_filter_type'] : "";
        $volume_slow_filter_factor = (isset($params['volume_slow_filter_factor']))? $params['volume_slow_filter_factor'] : "";        
        $perc_volume_vs_average = (isset($params['perc_volume_vs_average']))? $params['perc_volume_vs_average'] : "";
        // Wild training (wt)
        $wt_enabled = (isset($params['wt_enabled']) && ($params['wt_enabled'] == 'on' || $params['wt_enabled'] == 'true'));
        $wt_group = (isset($params['wt_group']) && !empty($params['wt_group']))? $params['wt_group'] : "2";
        $wt_bcr_min_trades = (isset($params['wt_bcr_min_trades']))? $params['wt_bcr_min_trades'] : "";
        $wt_bcr_max_trades = (isset($params['wt_bcr_max_trades']))? $params['wt_bcr_max_trades'] : "";
        $wt_bcr_min_hits_perc = (isset($params['wt_bcr_min_hits_perc']))? $params['wt_bcr_min_hits_perc'] : "";
        // Red & White
        $rw_enabled = (isset($params['rw_enabled']) && ($params['rw_enabled'] == 'on' || $params['rw_enabled'] == 'true'));
        $rw_max_consecutive_failures = (isset($params['rw_max_consecutive_failures']))? $params['rw_max_consecutive_failures'] : "";
        // Strategies
        $strategy = (isset($params['strategy']))? $params['strategy'] : "basic-mode";
        // Asynchronous
        $asynchronous_enabled = (isset($params['asynchronous_enabled']) && ($params['asynchronous_enabled'] == 'on' || $params['asynchronous_enabled'] == 'true'));
        // Last training data
        $last_modification_comesfrom_training = (isset($params['last_modification_comesfrom_training']) && $params['last_modification_comesfrom_training']=='true')? true : false;
        $last_training_code = (isset($params['last_training_code']))? $params['last_training_code'] : null;
        $last_training_was_wild = (isset($params['last_training_was_wild']) && $params['last_training_was_wild']=='true')? true : false;
        $last_training_winner = (isset($params['last_training_winner']))? $params['last_training_winner'] : null;
        
        if ((isset($params['id']) && !empty($params['id'])))
        {
            // Edit
            $is_new = false;
            $id = strtolower($params['id']);
            $doc = $this->model->get($id)['data'];
            if (empty($doc))
            {
                return helpers::resStruct(false, "Robot $id inexistent");
            }
        }
        else
        {
            // New
            $is_new = true;
            $user_code = $this->token->getUserCode();
            $id = strtolower('cryptos_robot-'.$user_code.'-'.$code);
            if ($this->model->exist($id))
            {
                return helpers::resStruct(
                        false, 
                        $this->trans->mod->robot['the_robot_with_code']." '<b>".$code."</b>' ".$this->trans->mod->common['already_exists']);
            }
            
            $doc = array();
            $doc['code'] = $code;
            $doc['candlestick_interval'] = $candlestick_interval;
            // Coins
            $doc['coinpair'] = $coinpair;
            $doc['coinpair_name'] = $this->_symbol_controller->getCoinpairName($coinpair);
            $doc['coin'] = $this->_symbol_controller->getCoin($coinpair);
            $doc['market_coin'] = $this->_symbol_controller->getMarketCoin($coinpair);
            // Creation
            $doc['created_by_user'] = $user_code;
            $doc['created_by_user_name'] = $this->token->getUserName();
            $doc['creation_date'] = date("Y-m-d H:i");
            // Trading
            $doc['is_running'] = false;
            $doc['last_operation'] = '';
            $doc['manual_operation'] = '';
        }
        
        // Check heritage
        if (!$is_new && !empty($inherit_id))
        {
            // Get robot
            $inherit_robot = $this->get($inherit_id)['data'];
            if (empty($inherit_robot))
            {
                return helpers::resStruct(false, "Robot with id: '$inherit_id' inexistent");
            }
            if ($inherit_robot['coinpair'] !== $doc['coinpair'])
            {
                return helpers::resStruct(false, "Inherited robot must have the same 'coinpair'");
            }
            if ($inherit_robot['candlestick_interval'] !== $doc['candlestick_interval'])
            {
                return helpers::resStruct(false, "Inherited robot must have the same 'candlestick interval'");
            }
        }
        
        // Main
        $doc['name'] = $name;
        $doc['group'] = $group;
        $doc['inherit_id'] = $inherit_id;
        
        // Properties
        $doc['available'] = $available;
        $doc['favourite'] = $favourite;
        $doc['order'] = $order;
        $doc['notes'] = $notes;
        
        // Trading
        $doc['is_training'] = $is_training;
        $doc['amount'] = $amount;
        $doc['amount_unit'] = $amount_unit;
        //$doc['commission'] = $commission;
        //$doc['commission_coin'] = $commission_coin;
        
        // Scalping
        $doc['filter_type'] = $filter_type;
        $doc['filter_factor'] = $filter_factor;
        // Buying parameters
        if ($enabled_to_buy)
        {
            $doc['buying_deactivation_date'] = '';
            $doc['buying_deactivation_price'] = '';
        }
        else
        {
            if ($is_new || $enabled_to_buy !== $doc['enabled_to_buy'])
            {
                $doc['buying_deactivation_date'] = date('Y-m-d H:i:s');
                $doc['buying_deactivation_price'] = '';
            }
        }
        $doc['enabled_to_buy'] = $enabled_to_buy;
        //$doc['buying_candlestick_interval'] = $buying_candlestick_interval;
        $doc['takeoff'] = $takeoff;
        $doc['takeoff_filter_type'] = $takeoff_filter_type;
        $doc['takeoff_filter_factor'] = $takeoff_filter_factor;
        $doc['min_green_candle_size'] = $min_green_candle_size;
        $doc['number_of_samples_with_price_always_going_up'] = $number_of_samples_with_price_always_going_up;
        $doc['change_min'] = $change_min;
        $doc['change_max'] = $change_max;
        $doc['change_max_disable_buy'] = $change_max_disable_buy;
        $doc['change_time'] = $change_time;
        $doc['perc_price_vs_robot_track'] = $perc_price_vs_robot_track;
        $doc['perc_skip_buying_if_price_is_close_to_last_selling'] = $perc_skip_buying_if_price_is_close_to_last_selling;
        $doc['disable_buying_when_sell'] = $disable_buying_when_sell;
        $doc['disable_buying_when_buy'] = $disable_buying_when_buy;
        // Selling parameters
        $doc['enabled_to_sell'] = $enabled_to_sell;
        $doc['takeprofit'] = $takeprofit;
        $doc['takeprofit_trailing'] = $takeprofit_trailing;
        $doc['takeprofit2'] = $takeprofit2;
        $doc['takeprofit2_trailing'] = $takeprofit2_trailing;
        $doc['stoploss'] = $stoploss;
        $doc['stoploss_filter_type'] = $stoploss_filter_type;
        $doc['stoploss_filter_factor'] = $stoploss_filter_factor;
        
        // Indicators
        // Moving Averages
        $doc['ma_enabled_to_buy'] = $ma_enabled_to_buy;
        $doc['ma_fast_filter_type'] = $ma_fast_filter_type;
        $doc['ma_fast_filter_factor'] = $ma_fast_filter_factor;
        $doc['ma_slow_filter_type'] = $ma_slow_filter_type;
        $doc['ma_slow_filter_factor'] = $ma_slow_filter_factor;
        // MACD
        $doc['macd_enabled_to_buy'] = $macd_enabled_to_buy;
        $doc['macd_enabled_to_sell'] = $macd_enabled_to_sell;
        $doc['macd_macd1_filter_type'] = $macd_macd1_filter_type;
        $doc['macd_macd1_filter_factor'] = $macd_macd1_filter_factor;
        $doc['macd_macd2_filter_type'] = $macd_macd2_filter_type;
        $doc['macd_macd2_filter_factor'] = $macd_macd2_filter_factor;
        $doc['macd_signal_filter_type'] = $macd_signal_filter_type;
        $doc['macd_signal_filter_factor'] = $macd_signal_filter_factor;
        $doc['macd_min_lowest_value'] = $macd_min_lowest_value;
        $doc['macd_max_lowest_value'] = $macd_max_lowest_value;
        // RSI
        $doc['rsi_enabled_to_buy'] = $rsi_enabled_to_buy;
        $doc['rsi_periods'] = $rsi_periods;
        $doc['rsi_oversold'] = $rsi_oversold;
        $doc['rsi_overbought'] = $rsi_overbought;
        $doc['rsi_smoothed'] = $rsi_smoothed;
        $doc['rsi_signal_filter_type'] = $rsi_signal_filter_type;
        $doc['rsi_signal_filter_factor'] = $rsi_signal_filter_factor;
        // OBV
        $doc['obv_enabled_to_buy'] = $obv_enabled_to_buy;
        $doc['obv_fast_filter_type'] = $obv_fast_filter_type;
        $doc['obv_fast_filter_factor'] = $obv_fast_filter_factor;
        $doc['obv_slow_filter_type'] = $obv_slow_filter_type;
        $doc['obv_slow_filter_factor'] = $obv_slow_filter_factor;
        // Volume
        $doc['volume_enabled_to_buy'] = $volume_enabled_to_buy;
        $doc['volume_fast_filter_type'] = $volume_fast_filter_type;
        $doc['volume_fast_filter_factor'] = $volume_fast_filter_factor;
        $doc['volume_slow_filter_type'] = $volume_slow_filter_type;
        $doc['volume_slow_filter_factor'] = $volume_slow_filter_factor;
        $doc['perc_volume_vs_average'] = $perc_volume_vs_average;
        
        // Wild training (wt)
        $doc['wt_enabled'] = $wt_enabled;
        $doc['wt_group'] = $wt_group;
        $doc['wt_bcr_min_trades'] = $wt_bcr_min_trades;
        $doc['wt_bcr_max_trades'] = $wt_bcr_max_trades;
        $doc['wt_bcr_min_hits_perc'] = $wt_bcr_min_hits_perc;
        
        // Red & White
        $doc['rw_enabled'] = $rw_enabled;
        $doc['rw_max_consecutive_failures'] = $rw_max_consecutive_failures;

        // Strategies
        $doc['strategy'] = $strategy;
        
        // Asynchronous
        $doc['asynchronous_enabled'] = $asynchronous_enabled;
        
        // Last modification
        $doc['modified_by_user'] = $this->token->getUserCode();
        $doc['modified_by_user_name'] = $this->token->getUserName();
        $doc['last_modification_date'] = date("Y-m-d H:i");
        
        // Wild training (wt)
        $wt_properties = $this->model->wt_properties;
        foreach ($wt_properties as $wt_key)
        {
            if (!isset($params[$wt_key]))
            {
                continue;
            }
            $wt_value = $params[$wt_key];
            // Check format
            if (!empty($wt_value))
            {
                $wt_pieces = explode('/', $wt_value);
                $min = $wt_pieces[0];
                $max = $wt_pieces[1];                
                if (count($wt_pieces) !== 3 || $min >= $max)
                {
                    return helpers::resStruct(false, 
                        "At least, there is a 'wt' property with a wrong format".
                        " (".$wt_value.")".". ".
                        "The 'wt' should be, pex: 23/55/1");
                }
            }
            $doc[$wt_key] = $wt_value;
        }        

        /// Last training data
        $doc['last_modification_comesfrom_training'] = $last_modification_comesfrom_training;
        if ($last_modification_comesfrom_training)
        {
            $doc['last_training_code'] = $last_training_code;
            $doc['last_training_was_wild'] = $last_training_was_wild;
            $doc['last_training_winner'] = $last_training_winner;            
        }
        
        // Save
        $this->model->save($id, $doc);
        
        // Add history
        $history_robot_changes_controller = new historyRobotChanges();
        $history_robot_changes_controller->save($doc);
            
        return helpers::resStruct(true, "", array('id' => $id));
    }

    public function getCommissionInfo($params)
    {
        $user_code = isset($params['user_code']) ? $params['user_code'] : $this->token->getUserCode();
        $coinpair = isset($params['coinpair']) ? $params['coinpair'] : '';
        $amount = isset($params['amount']) ? $params['amount'] : 0;
        $amount_unit = isset($params['amount_unit']) ? $params['amount_unit'] : '';
        $commission_perc = isset($params['commission']) ? $params['commission'] : 0;
        $commission_coin = isset($params['commission_coin']) ? $params['commission_coin'] : '';
        
        if (empty($coinpair))
        {
            return helpers::resStruct(false, "Firstly, you should denote the coin pair or symbol");
        }        
        if (empty($amount))
        {
            return helpers::resStruct(false, "Firstly, you should denote the amount");
        }      
        if (empty($amount_unit))
        {
            return helpers::resStruct(false, "Firstly, you should denote the amount unit");
        }
        if (empty($commission_perc))
        {
            return helpers::resStruct(false, "Firstly, you should denote the value (%) of the commission");
        }
        if (empty($commission_coin))
        {
            return helpers::resStruct(false, "Firstly, you should denote the market coin in which the commission will be paid");
        }
    
        // Get real prices
        $prices = $this->getPrices($user_code);
        if ($prices === false)
        {
            return helpers::resStruct(false, "Error getting Binance api");
        }
        
        // Get symbol
        $symbol_id = strtolower($this->_symbol_controller->model->type.'-'.$coinpair);
        $symbol = $this->_symbol_controller->get($symbol_id)['data'];
        if (empty($symbol))
        {
            return helpers::resStruct(false, "Symbol $coinpair doesn't exist");
        }
        
        // Get coins
        $coin = $this->_symbol_controller->getCoin($coinpair);
        $market_coin = $this->_symbol_controller->getMarketCoin($coinpair);
        
        // Calculate final amount
        $final_amount = $this->getAmount(array(
            'amount' => $amount,
            'amount_unit' => $amount_unit,
            'coin' => $coin,
            'market_coin' => $market_coin,
            'amount_decimals' => $symbol['decimals']
        ), $prices);
            
        // Calculate commission
        $transaction_controller = new transaction();
        $commission_ret = $transaction_controller->getCommission($coin, $market_coin, $final_amount, $commission_perc, $commission_coin, $prices);

        $msg = 
            'Commission: '.$commission_ret['commission'].' '.$commission_coin.'<br>'.
            'Commission USDT: '.$commission_ret['commission_usdt'].' USDT'.'<br>'.
            'Commission market: '.$commission_ret['commission_market'].' '.$market_coin.'<br>'.
            '';

        return helpers::resStruct(true, $msg);
    }
    
    public function uploadConf($params)
    {
        if (!isset($params['robot_id']))
        {
            return helpers::resStruct(false, "Fuck you!");
        }
        
        $id = $params['robot_id'];
        
        if (!isset($_FILES) || empty($_FILES))
        {
            return helpers::resStruct(false, "No files to upload!");
        }
        
        $temp_filename = $_FILES['file']['tmp_name'];
        $original_filename = $_FILES['file']['name'];
        
        $doc = $this->model->get($id)['data'];
        if (empty($doc))
        {
            return helpers::resStruct(false, "Robot with id: $id is inexistant");
        }
        
        $json = file_get_contents($temp_filename);
        $new_robot = json_decode($json, true);
        
        unset($new_robot['_id']);
        unset($new_robot['code']);
        unset($new_robot['name']);
        unset($new_robot['candlestick_interval']);
        
        // Coins
        unset($new_robot['coinpair']);
        unset($new_robot['coinpair_name']);
        unset($new_robot['coin']);
        unset($new_robot['market_coin']);
        
        // Properties
        unset($new_robot['available']);
        unset($new_robot['favourite']);
        unset($new_robot['wt_enabled']);
        unset($new_robot['order']);
        unset($new_robot['notes']);
        
        // Trading
        unset($new_robot['is_running']);
        unset($new_robot['is_training']);
        unset($new_robot['amount']);
        unset($new_robot['amount_unit']);
        unset($new_robot['last_operation']);
        unset($new_robot['manual_operation']);
            
        // Scalping
        unset($new_robot['buying_deactivation_date']);
        unset($new_robot['buying_deactivation_price']);
        
        // Creation
        unset($new_robot['created_by_user']);
        unset($new_robot['created_by_user_name']);
        unset($new_robot['creation_date']);
        
        // Last modification
        $new_robot['modified_by_user'] = $this->token->getUserCode();
        $new_robot['modified_by_user_name'] = $this->token->getUserName();
        $new_robot['last_modification_date'] = date("Y-m-d H:i");

        foreach ($new_robot as $key => $value) {
            $doc[$key] = $value;
        }
        
        // Save
        $ret = $this->model->save($id, $doc);
            
        return helpers::resStruct(true, "", array('id' => $id));
    }
    
    public function switchLastOperation($params) 
    {
        if (!isset($params['data']))
        {
            return helpers::resStruct(false, "No robots to update");
        }
        
        $data = json_decode($params['data'], true);

        foreach ($data as $values)
        {
            $user_code = $values['user_code'];
            $robot_code = $values['robot_code'];

            // Get robot
            $id = $this->normalizeId('cryptos_robot-'.$user_code.'-'.$robot_code);
            $robot = $this->get($id)['data'];
            if (empty($robot))
            {
                return helpers::resStruct(false, "The robot with id: $id, doesn't exist");
            }

            $last_operation = $this->getLastOperation($robot);

            $robot['last_operation'] = ($last_operation === 'sell')? 'buy' : 'sell';

            // Save
            $ret = $this->model->save($id, $robot);            
        }
            
        return helpers::resStruct(true);
    }
    
    public function copyProperties($params)
    {
        if (!isset($params['robots']))
        {
            return helpers::resStruct(false, "No robots to update");
        }
        
        $robots = json_decode($params['robots'], true);
        $properties = json_decode($params['properties'], true);
        
        foreach ($robots as $id)
        {
            $doc = $this->model->get($id)['data'];
            if (empty($doc))
            {
                return helpers::resStruct(false, "Robot with id: $id is inexistant");
            }
            
            foreach ($properties as $values) {
                $key = $values['code'];
                $value = $values['value'];
                
                // Buying parameters
                if ($key === 'enabled_to_buy')
                {
                    if ($value)
                    {
                        $doc['buying_deactivation_date'] = '';
                        $doc['buying_deactivation_price'] = '';
                    }
                    else
                    {
                        if ($value !== $doc['enabled_to_buy'])
                        {
                            $doc['buying_deactivation_date'] = date('Y-m-d H:i:s');
                            $doc['buying_deactivation_price'] = '';
                        }
                    }                    
                }
                
                $doc[$key] = $value;
            }

            // Save
            $ret = $this->model->save($id, $doc); 
        
            // Add history
            $history_robot_changes_controller = new historyRobotChanges();
            $history_robot_changes_controller->save($doc);
        }
            
        return helpers::resStruct(true);
    }
    
    public function getChart($params)
    {
        if (!isset($params['property']))
        {
            return helpers::resStruct(false, 'Fuck you!');
        }
        
        $user_code = $params['user_code'];
        $robot_code = $params['robot_code'];
        $property = $params['property'];
        
        // Add history
        $history_robot_changes_controller = new historyRobotChanges();
        $history_robot_changes = $history_robot_changes_controller->getFiltered(array(
            'user_code' => $user_code,
            'robot_code' => $robot_code
        ))['data'];

        $data = array();
        foreach ($history_robot_changes as $values)
        {
            $item = array(
                "date" => $values['date'],
                "value" => (float) $values[$property]
            );
            
            // Add data
            $data[] = $item;            
        }
            
        $finaldata = helpers::sortArrayByField($data, "date");
        return helpers::resStruct(true, "", $finaldata);
    }
    
    public function getInherits($params)
    {
        if (!isset($params['coinpair']))
        {
            return helpers::resStruct(false, 'Fuck you!');
        }
        
        $user_code = $params['user_code'];
        $robot_code = $params['robot_code'];
        $coinpair = $params['coinpair'];
        $candlestick_interval = $params['candlestick_interval'];
        
        // Get all robots
        $raw_data = $this->getAll()['data'];
        if (empty($raw_data))
        {
            return helpers::resStruct(true);
        }
        
        $data = array();
        foreach($raw_data as $robot)
        {
            if (!$robot['available'])
            {
                continue;
            }

            if ($coinpair !== $robot['coinpair'])
            {
                continue;
            }

            if ($candlestick_interval !== $robot['candlestick_interval'])
            {
                continue;
            }

            if ($user_code == $robot['created_by_user'] && $robot_code == $robot['code'])
            {
                continue;
            }

            // Add item
            $data[] = array(
                '_id' => $robot['_id'],
                'name' => $robot['name'],
                'coinpair_name' => $robot['coinpair_name'],
                'created_by_user_name' => $robot['created_by_user_name']
            ); 
        }
            
        return helpers::resStruct(true, "", $data);
    }

    public function isRunning($robot)
    {
        return (isset($robot['is_running']) && $robot['is_running']);
    }

    public function isTraining($robot)
    {
        return (isset($robot['is_training']) && $robot['is_training']);
    }
    
    public function getTrainingMode($robot)
    {
        return (isset($robot['training_mode']))? $robot['training_mode'] : 'real-time';
    }
    
    public function isTrainingInModeRealtime($robot)
    {
        return ($this->isTraining($robot) && $this->getTrainingMode($robot) === 'real-time');
    }
    
    public function isTrainingInModeHistory($robot)
    {
        return ($this->isTraining($robot) && $this->getTrainingMode($robot) === 'history');
    }
    
    public function isTrainingInModeWild($robot)
    {
        return ($this->isTraining($robot) && $this->getTrainingMode($robot) === 'wild');
    }
    
    public function isRedAndWhite($robot)
    {
        return (isset($robot['rw_enabled']) && $robot['rw_enabled']);
    }
    
    public function isAsynchronous($robot)
    {
        return (isset($robot['asynchronous_enabled']) && $robot['asynchronous_enabled']);
    }

    public function isEnabledToBuy($robot)
    {
        return (isset($robot['enabled_to_buy']) && $robot['enabled_to_buy']);
    }

    public function isEnabledToSell($robot)
    {
        return (isset($robot['enabled_to_sell']) && $robot['enabled_to_sell']);
    }

    public function isDisableBuyingWhenSell($robot)
    {
        return (isset($robot['disable_buying_when_sell']) && $robot['disable_buying_when_sell']);
    }

    public function isDisableBuyingWhenBuy($robot)
    {
        return (isset($robot['disable_buying_when_buy']) && $robot['disable_buying_when_buy']);
    }
    
    public function getStatusName($robot)
    {
        $is_running = $this->isRunning($robot);
        $is_training = $this->isTraining($robot);
        
        if ($robot['available'])
        {
            if (!$is_running)
            {
                $status = 'RESTING';
            }
            else
            {
                $status = $is_training? 'TRAINING' : 'RUNNING';
            }
        }
        else
        {
            $status = 'NO AVAILABLE';
        }
        
        return $status;
    }

    public function getLastOperation($robot)
    {
        $ret = (isset($robot['last_operation']))? $robot['last_operation'] : '';
        return $ret;
    }

    public function getManualOperation($robot)
    {
        $ret = (isset($robot['manual_operation']))? $robot['manual_operation'] : '';
        return $ret;
    }

    public function getAmountUnit($robot)
    {
        $ret = (isset($robot['amount_unit']))? $robot['amount_unit'] : 'coin';
        return $ret;
    }
    
    public function getAmount($robot, $prices = null)
    {
        $amount = $robot['amount'];
        $amount_unit = $this->getAmountUnit($robot);
        
        if ($amount_unit === 'usdt' || $amount_unit === 'market-coin')
        {
            // Get real prices
            if (is_null($prices))
            {
                $prices = $this->getPrices($robot['created_by_user']);
                if ($prices === false) return 0;
            }
        
            $coin = $robot['coin'];
            $market_coin = $robot['market_coin'];
            
            if ($amount_unit === 'usdt')
            {
                if ($market_coin === "USDT")
                {
                    $amount = $amount / $prices[$coin.$market_coin];
                }
                else
                {
                    if (isset($prices[$market_coin."USDT"]))
                    {
                        $btc_price =  $prices[$market_coin."USDT"];
                    }
                    else
                    {
                        // Dani. 2019-01-25
                        // Això s'hauria de treure en un futur pròxim
                        $btc_price = 3500;
                    }
                    $btcs = $amount / $btc_price;
                    $amount = $btcs / $prices[$coin.$market_coin];
                }                   
            }
            else
            {
                $amount = $amount / $prices[$coin.$market_coin];
            }         
        }
        
        $ret = $this->normalizeAmount($robot, $amount);
        
        return $ret;
    }
    
    public function normalizeAmount($robot, $amount)
    {
        $decimals = $robot['amount_decimals'];
        $new_amount1 = round($amount, $decimals);
        $new_amount2 = number_format($new_amount1, $decimals, ".", "");
        return $new_amount2;
    }
    
    public function normalizePrice($robot, $price)
    {
        $decimals = $robot['price_decimals'];
        $new_price1 = round($price, $decimals);
        $new_price2 = number_format($new_price1, $decimals, ".", "");
        return $new_price2;
    }
    
    public function getPrices($user_code)
    {
        // Get real prices
        $binance_controller = new binance();       
        $api = $binance_controller->getApi($user_code);
        if ($api === false)
        {
            return false;
        }
        $prices = $api->prices();
        
        return $prices;
    }
    
    public function getValue($robot, $property)
    {
        if (isset($robot[$property]) && (!empty($robot[$property]) || $robot[$property] === false || $robot[$property] === "0" || $robot[$property] === 0))
        {
            return $robot[$property];
        }
        
        // Default values
        switch ($property) {
            
            case 'candlestick_interval':
                $default_value = "1";
                break;
            
            case 'filter_type':
                $default_value = 'ema';
                break;
            
            case 'filter_factor':
                $default_value = 6;
                break;
            
            case 'takeoff':
                $default_value = 0.02;
                break;
            
            case 'takeprofit':
                $default_value = 1;
                break;
            
            case 'takeprofit_trailing':
                $default_value = 0.2;
                break;
            
            case 'stoploss':
                $default_value = 1;
                break;
            
            case 'rsi_periods':
                $default_value = 14;
                break;
            
            case 'rsi_oversold':
                $default_value = 30;
                break;
            
            case 'rsi_overbought':
                $default_value = 70;
                break;
            
            case 'rsi_smoothed':
                $default_value = true;
                break;
            
            case 'strategy':
                $default_value = 'basic-mode';
                break;

            default:
                $default_value = null;
                break;
        }
        
        return $default_value;
    }

    public function getFilterValues($robot, $filter_key)
    {
        $filter_type = $robot['filter_type'];
        $filter_factor = $robot['filter_factor'];
        
        if (isset($robot[$filter_key.'_filter_type']) && !empty($robot[$filter_key.'_filter_type']))
        {
            $filter_type = $robot[$filter_key.'_filter_type'];
        }
        
        if (isset($robot[$filter_key.'_filter_factor']) && !empty($robot[$filter_key.'_filter_factor']))
        {
            $filter_factor = $robot[$filter_key.'_filter_factor'];
        }
        
        return array(
            'filter_type' => $filter_type,
            'filter_factor' => $filter_factor
        );
    }
    
    public function anyIndicatorEnabled($robot)
    {
        return (
            $this->isIndicatorEnabledToBuy($robot, 'ma') ||
            $this->isIndicatorEnabledToBuy($robot, 'macd') || $this->isIndicatorEnabledToSell($robot, 'macd') ||
            $this->isIndicatorEnabledToBuy($robot, 'rsi') ||
            $this->isIndicatorEnabledToBuy($robot, 'obv') ||
            $this->isIndicatorEnabledToBuy($robot, 'volume')
        );
    }

    public function getMaxFilterFactor($robot, $indicators = array())
    {
        $values = array();
        
        // General
        $candlestick_interval = $this->getValue($robot, 'candlestick_interval');
        
        // Scalping
        $default_filter_factor = $this->getValue($robot, 'filter_factor');
        $takeoff_filter_factor = $this->getValue($robot, 'takeoff_filter_factor');
        $stoploss_filter_factor = $this->getValue($robot, 'stoploss_filter_factor');
        array_push($values, $default_filter_factor, $takeoff_filter_factor, $stoploss_filter_factor);
        $change_time = $this->getValue($robot, 'change_time');
        if (!is_null($change_time))
        {
            $change_time_value = ($change_time * 60) / $candlestick_interval;
            $change_time_value += (60 / $candlestick_interval); // 1 hour more
            array_push($values, $change_time_value);
        }
        
        // Indicators
        if ((empty($indicators) || in_array('ma', $indicators)) && $this->isIndicatorEnabledToBuy($robot, 'ma'))
        {
            $ma_fast_filter_factor = $this->getFilterValues($robot, 'ma_fast')['filter_factor'];
            $ma_slow_filter_factor = $this->getFilterValues($robot, 'ma_slow')['filter_factor'];            
            array_push($values, $ma_fast_filter_factor, $ma_slow_filter_factor);
        }
        if ((empty($indicators) || in_array('macd', $indicators)) && ($this->isIndicatorEnabledToBuy($robot, 'macd') || $this->isIndicatorEnabledToSell($robot, 'macd')))
        {
            $macd_macd1_filter_factor = $this->getFilterValues($robot, 'macd_macd1')['filter_factor'];
            $macd_macd2_filter_factor = $this->getFilterValues($robot, 'macd_macd2')['filter_factor'];
            $macd_signal_filter_factor = $this->getFilterValues($robot, 'macd_signal')['filter_factor'];           
            array_push($values, $macd_macd1_filter_factor, $macd_macd2_filter_factor, $macd_signal_filter_factor);
        }
        if ((empty($indicators) || in_array('rsi', $indicators)) && $this->isIndicatorEnabledToBuy($robot, 'rsi'))
        {
            $rsi_periods = $this->getValue($robot, 'rsi_periods');
            $rsi_signal_filter_factor = $this->getFilterValues($robot, 'rsi_signal')['filter_factor'];
            array_push($values, $rsi_periods, $rsi_signal_filter_factor);
        }
        if ((empty($indicators) || in_array('obv', $indicators)) && $this->isIndicatorEnabledToBuy($robot, 'obv'))
        {
            $obv_fast_filter_factor = $this->getFilterValues($robot, 'obv_fast')['filter_factor'];
            $obv_slow_filter_factor = $this->getFilterValues($robot, 'obv_slow')['filter_factor'];            
            array_push($values, $obv_fast_filter_factor, $obv_slow_filter_factor);
        }
        if ((empty($indicators) || in_array('volume', $indicators)) && $this->isIndicatorEnabledToBuy($robot, 'volume'))
        {
            $volume_fast_filter_factor = $this->getFilterValues($robot, 'volume_fast')['filter_factor'];
            $volume_slow_filter_factor = $this->getFilterValues($robot, 'volume_slow')['filter_factor'];
            array_push($values, $volume_fast_filter_factor, $volume_slow_filter_factor);
        }
        
        if (empty($values))
        {
            return 0;
        }
        
        $max = max($values); // Number of samples
        $ret = $max * $candlestick_interval; // Minutes
            
        return $ret;
    }
    
    public function isIndicatorEnabledToBuy($robot, $key)
    {
        $property = $key."_enabled_to_buy";
        $value = $this->getValue($robot, $property);
        if (is_null($value)) return false;
        return $value;
    }
    
    public function isIndicatorEnabledToSell($robot, $key)
    {
        $property = $key."_enabled_to_sell";
        $value = $this->getValue($robot, $property);
        if (is_null($value)) return false;
        return $value;
    }
    
    public function getFunds($robot, $prices, $robot_groups)
    {
        $user_code = $robot['created_by_user'];
        $robot_code = $robot['code'];
        $coinpair = $robot['coinpair'];
        $group_code = $robot['group'];
        $is_training = $this->isTraining($robot);
        $last_operation = $this->getLastOperation($robot);
        
        $fund = 0;
        $balance = 0;
        $balance_perc = 0;
        $is_fund_full = false;
            
        // Get price
        if ($prices === false)
        {
            return array(
                'fund' => $fund,
                'balance' => $balance,
                'balance_perc' => $balance_perc,
                'is_fund_full' => $is_fund_full
            );
        }
        $price =  $prices[$coinpair];
        
        // Get fund
        if (!empty($group_code) && !empty($robot_groups) && isset($robot_groups[$user_code]) && isset($robot_groups[$user_code][$group_code]))
        {
            $fund = $robot_groups[$user_code][$group_code]['fund'];
        }
        
        // Get pending async. transactions
        if (!$is_training)
        {
            $transaction_controller = new transaction();
        }
        else
        {
            $transaction_controller = new transactionTraining();
        }
        $pending_asynchronous_transaction_ids = array();
        $pending_asynchronous_transactions = $transaction_controller->getPendingAsynchronousTransactions($user_code, $robot_code);
        foreach ($pending_asynchronous_transactions as $key => $transaction)
        {
            array_push($pending_asynchronous_transaction_ids, $transaction['_id']);
        }  
        
        // Get last buying transaction
        $last_buying_transactions = array();
        if (
            (($is_training && !$robot['in_production']) || (!$is_training && $robot['in_production'])) && 
            $last_operation === 'buy'
        )
        {
            $transaction = $transaction_controller->getLastTransaction($user_code, $robot_code, 'buy');
            if (!empty($transaction) && !in_array($transaction['_id'], $pending_asynchronous_transaction_ids))
            {
                $last_buying_transactions[] = $transaction;
            }            
        }
        
        // Merge all transactions
        $transactions = array_merge($pending_asynchronous_transactions, $last_buying_transactions);
        if (empty($transactions))
        {
            return array(
                'fund' => $fund,
                'balance' => $balance,
                'balance_perc' => $balance_perc,
                'is_fund_full' => $is_fund_full
            );
        }
        
        // Get balance
        $amount = 0;
        foreach ($transactions as $transaction)
        {
            $amount += $transaction['amount'];
        }
        $balance = $amount * $price;
        if ($fund > 0)
        {
            $balance_perc = ($balance * 100) / $fund;
            $is_fund_full = ($balance_perc > 100);
        }
        
        return array(
            'fund' => $fund,
            'balance' => round($balance, 4),
            'balance_perc' => round($balance_perc),
            'is_fund_full' => $is_fund_full
        );
        
    }
    
    public function updateCandlestick($params)
    {
        if (!isset($params['user_code']) || !isset($params['data']))
        {
            return helpers::resStruct(false, "No robots to update");
        }
        
        $user_code = $params['user_code'];
        $data = json_decode($params['data'], true);
        $echo = (isset($params['echo']) && $params['echo']);
        
        $symbols_by_candlestick = array();
        foreach ($data as $values)
        {
            $coinpair = $values['coinpair'];
            $candlestick = $values['candlestick_interval']."m";
        
            if (!isset($symbols_by_candlestick[$candlestick]))
            {
                $symbols_by_candlestick[$candlestick] = array();
            }
            
            if (in_array($coinpair, $symbols_by_candlestick[$candlestick]))
            {
                continue;
            }
            
            array_push($symbols_by_candlestick[$candlestick], $coinpair);
        }     
        
        // Get api
        $binance_controller = new binance();       
        $api = $binance_controller->getApi($user_code);               
        
        // Start loop
        $sample_controller = new sample();
        $days = 90;
        $minutes = 1000;
        $all_minutes = $days * 24 * 60;
        $loops = $all_minutes / $minutes;
        $any_update = false;
        
        foreach ($symbols_by_candlestick as $candlestick => $symbols)
        {
            $candlestick_interval = str_replace("m", "", $candlestick);
                
            // Set initial dates
            $start_date = date('Y-m-d H:i:s', strtotime("-$days days"));
            $end_date = date('Y-m-d H:i:s', strtotime($start_date." +$minutes minutes"));

            $loop = 1;
            do
            {
                $title = "Candlestick: ".$candlestick.". Loop: $loop/$loops";
                // Get charts
                if ($echo) echo "Getting binance charts... ".$title.PHP_EOL;
                $timestamp = strtotime($start_date) * 1000;
                $charts_by_symbols_and_date = [];
                $dates = array();
                foreach ($symbols as $symbol) 
                {
                    $charts = $api->candlesticks($symbol, $candlestick, $minutes, $timestamp);
                    $charts_by_symbols_and_date[$symbol] = [];
                    foreach ($charts as $ts => $values)
                    {
                        $date = date('Y-m-d H:i:s', $ts/1000);
                        $charts_by_symbols_and_date[$symbol][$date] = array(
                            'open' => $values['open'],
                            'high' => $values['high'],
                            'low' => $values['low'],
                            'close' => $values['close'],
                            'volume' => $values['volume']                
                        );
                        
                        if (!in_array($date, $dates))
                        {
                            array_push($dates, $date);
                        }
                    }
                    
                    sleep(2);
                }
                
                // Get samples
                if ($echo) echo "Getting db samples... ".$title.PHP_EOL;
                $samples = $sample_controller->getSamples($candlestick_interval, $start_date, $end_date);

                // Update samples
                if ($echo) echo "Updating samples... ".$title.PHP_EOL;
                foreach ($samples as $sample)
                {
                    $sample_id = $sample['_id'];
                    $sample_date = $sample['sample_date'];
                    $samples_values = $sample['samples_values'];

                    $update_sample = false;
                    foreach ($symbols as $symbol) 
                    {
                        if (isset($samples_values[$symbol]))
                        {
                            continue;
                        }

                        if (!isset($charts_by_symbols_and_date[$symbol][$sample_date]))
                        {
                            continue;
                        }

                        $s = $charts_by_symbols_and_date[$symbol][$sample_date];
                        $samples_values[$symbol] = $s;

                        $update_sample = true;
                    }

                    if (!$update_sample)
                    {
                        continue;
                    }

                    $doc = $sample_controller->get($sample_id)['data'];
                    if (empty($doc))
                    {
                        continue;
                    }

                    $doc['samples_values'] = $samples_values;

                    $ret = $sample_controller->model->save($sample_id, $doc);
                    $any_update = true;

                    if ($echo) echo "Updated sample with id: $sample_id. ".$title.PHP_EOL;
                }    

                if (strtotime($end_date) > strtotime('now'))
                {
                    break;
                }
                //$start_date = date('Y-m-d H:i:s', strtotime($end_date." +1 minute"));
                $start_date = $end_date;
                $end_date = date('Y-m-d H:i:s', strtotime($start_date." +$minutes minutes"));

                $loop++;

                if ($echo)
                {
                    echo PHP_EOL;
                    echo PHP_EOL;
                    echo PHP_EOL;
                }

            } while (true);           
        }
        
        if ($any_update)
        {
            // Reset data on cache
            $this->cache->set("sophie-cryptos-robot-charts", null);              
        }
        
        return helpers::resStruct(true);
    }
    
    public function getFirstPriceOfChangeValues($robot)
    {
        $coinpair = $robot['coinpair'];
        $candlestick_interval = $robot['candlestick_interval'];
        $end_date = date('Y-m-d H:i:s');
        
        $change_time = $this->getValue($robot, 'change_time');
        if (is_null($change_time))
        {
            return null;
        }
        
        $dt = date('Y-m-d H:i', strtotime("-$change_time hours", strtotime($end_date))).':00';
        $first_sample = $this->_sample_controller->getSample($candlestick_interval, $dt);
        if (empty($first_sample) || !isset($first_sample['samples_values'][$coinpair]))
        {
            return null;
        }
        
        $first_price = $first_sample['samples_values'][$coinpair]['close'];
        
        return $first_price;
    }
    
    public function getChangeValues($robot, $first_price, $last_price)
    {
        $change_by_robot_html = '';
        $change_by_robot_basic_value_html = '';
        $change_by_robot_value_html = '';
        
        $change_time = $this->getValue($robot, 'change_time');
        if (is_null($change_time) || is_null($first_price) || is_null($last_price))
        {
            return array(
                'change_by_robot_html' => $change_by_robot_html,
                'change_by_robot_basic_value_html' => $change_by_robot_basic_value_html,
                'change_by_robot_value_html' => $change_by_robot_value_html
            );
        }
        
        $change_by_robot_html = $change_time.'h';
        $change_min =  $this->getValue($robot, 'change_min');
        $change_max = $this->getValue($robot, 'change_max');
        
        $price_diff = $last_price - $first_price;
        $change_perc = ($price_diff / $first_price) * 100;

        if (!is_null($change_min) && !is_null($change_max))
        {   
            if ($change_perc >= $change_min && $change_perc <= $change_max)
            {
                $color = 'green';
            }
            else
            {
                //$color = ($price_diff > 0)? 'green' : 'red';
                $color = 'silver';
            }
            $change_min_max_html = " ($change_min/$change_max)";
        }
        else
        {
            $color = ($price_diff > 0)? 'green' : 'red';
            $change_min_max_html = "";
        }

        $sign = ($price_diff > 0)? '+' : '';
        $price_diff_rounded = round($price_diff, 2);
        if ($price_diff_rounded == 0)
        {
            $price_diff_html = '';
        }
        else
        {
            $price_diff_html = '<font color="'.$color.'">'.$sign.$price_diff_rounded.'</font>'.' ';
        }
        $change_perc_html = '<font color="'.$color.'">'.$sign.round($change_perc, 2).'%</font>';
        $change_by_robot_value_html = $price_diff_html.$change_perc_html.$change_min_max_html;   
        
        $color = ($change_perc > 0)? 'green' : 'red';
        $change_by_robot_basic_value_html = '<font color="'.$color.'">'.$sign.round($change_perc, 2).'%</font>';
        
        return array(
            'change_by_robot_html' => $change_by_robot_html,
            'change_by_robot_basic_value_html' => $change_by_robot_basic_value_html,
            'change_by_robot_value_html' => $change_by_robot_value_html
        );
    }
    
}
