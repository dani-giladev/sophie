<?php

namespace modules\cryptos\robot;

// Controllers
use base\core\controller\timer;
use modules\cryptos\controller\transactionTraining;
use modules\cryptos\controller\prices;
// Robot
use modules\cryptos\robot\common;
use modules\cryptos\robot\store;
use modules\cryptos\robot\user;
use modules\cryptos\robot\filtering;
use modules\cryptos\robot\trading\trading;
use modules\cryptos\robot\sampling;
use modules\cryptos\controller\marketCoin;

/**
 *
 * @author Dani Gilabert
 * 
 */
class launcher extends common
{
    private $_candlestick_interval = "15";
    private $_candlestick_interval_ws = "1";
    private $_is_main_candlestick_interval = false;
    private $_emulator = false;
    private $_initialized = false;
    private $_users = array();
    private $_symbols = array();
    private $_samples = array();
    private $_tmp_samples = array();
    private $_previous_date = null;
    private $_is_sampling_in_progress = false;
    private $_interval_to_break_websocket = 0; //(3600 * 6); // 6 hours
    private $_timer_to_break_websocket = null;
    private $_permission_for_refresh_users_flag = true;
    private $_interval_to_refresh_users = (60 * 5); // 5 minutes
    private $_timer_to_refresh_users = null;
    private $_interval_to_check_to_force_refresh_users = 30; // 30 seconds
    private $_timer_to_check_to_force_refresh_users = null;
    private $_interval_keep_alive = 20; // 20 seconds
    private $_timer_keep_alive = null;
    private $_interval_to_disable_keep_alive = (60 * 3); // 3 minutes
    private $_timer_to_disable_keep_alive = null;
    private $_emulator_now = "2019-04-11 00:00:00";
    // Controllers
    private $_user_controller;
    private $_filtering_controller; 
    private $_trading_controller; 
    private $_sampling_controller;  
    private $_prices_controller;
    private $_market_coin_controller;
    
    public function __construct($candlestick_interval, $emulator, $is_main_candlestick_interval = false)
    {
        parent::__construct();
        
        $this->_candlestick_interval = $candlestick_interval;
        $this->_is_main_candlestick_interval = $is_main_candlestick_interval;
        $this->_emulator = $emulator;
        
        $this->_user_controller = new user();
        $this->_filtering_controller = new filtering();
        $this->_trading_controller = new trading();
        $this->_sampling_controller = new sampling();
        $this->_prices_controller = new prices();
        $this->_market_coin_controller = new marketCoin();
    }
    
    public function run()
    {
        // Init robot
        $this->_init();
        
        $counter = 0;
        do {
            
            $counter++;
            echo "Starting new process... ($counter)".PHP_EOL;
            if (store::isEmulator())
            {
                echo "Emulator is enabled!".PHP_EOL;
            }
            
            // Set robot's watchdog (keep alive)
            $this->_setKeepAlive();
        
            // Set users
            if ($counter > 1)
            {
                $this->_setUsers();
            }
            if (empty($this->_users))
            {
                echo "Fuck! There aren't available users to get a valid Binance API!!".PHP_EOL;
                sleep(20);
                continue;
            }        

            // Call websocket function (asynchronous)
            $api = $this->getApi();
            $this->_listenWS($api);                
            
            echo PHP_EOL;
            
        } while (true);
         
        echo 'The end!'.PHP_EOL; 
    }
    
    private function _init()
    {
        echo "Initializing robot...".PHP_EOL;
        
        // Set robot's watchdog (keep alive)
        $this->_interval_to_disable_keep_alive = $this->_interval_to_disable_keep_alive * $this->_candlestick_interval_ws;
        $this->_setKeepAlive();
        
        // Set common vars
        store::setCandlestickInterval($this->_candlestick_interval);
        store::setEmulator($this->_emulator);
            
        // Set users
        $this->_setUsers();
        if (empty($this->_users))
        {
            return;
        }

        if (store::isEmulator())
        {
            echo "Deleting transactions to emulate...".PHP_EOL;
            $this->_deleteTransactionsForEmulating();         
        }
        
        echo "Getting previous samples...".PHP_EOL;

        // Get max filter factor
        $max_filter_factor = 0;
        foreach ($this->_users as $user_code => $user)
        {
            $robots = $user['robots'];
            foreach ($robots as $robot_code => $robot)
            {
                // Get max filter factor value
                $max = $this->_robot_controller->getMaxFilterFactor($robot);
                if ($max > $max_filter_factor)
                {
                    $max_filter_factor = $max;
                }
            }
        }     

        // Get samples
        if (store::isEmulator())
        {
            $end_date = $this->_emulator_now;
            $max_filter_factor = 10;
        }
        else
        {
            $end_date = date('Y-m-d H:i:s');
        }
        
        $max_filter_factor += (60 * 1); // 1 hour more
        $start_date = date('Y-m-d H:i:s', strtotime("-$max_filter_factor minutes", strtotime($end_date)));
        $samples = $this->_sample_controller->getSamples($this->_candlestick_interval, $start_date, $end_date);
        if (!empty($samples))
        {
            echo "Setting robot track and filters with previous samples...".PHP_EOL;

            // Add samples
            foreach ($samples as $sample)
            {
                $samples_values = $sample['samples_values'];
                $samples_values['date'] = $sample['sample_date'];
                store::setLastSampleWs($samples_values);
                store::addSample($samples_values);
                
                $this->_setKeepAlive();

                // Calculating filter values
                $this->_sampling($samples_values);

                // Add robots values
                $robots_values = store::getCurrentRobotsValues();
                store::addRobotsValues($robots_values);
            }
        } 

    }
    
    private function _setUsers()
    {
        echo "Refreshing users at ".date('H:i:s')."...";
        $current_available_users = store::getAvailableUsers();
        $this->_users = $this->_user_controller->getAvailableUsers($this->_candlestick_interval, $current_available_users, true);
        store::setAvailableUsers($this->_users);
        
        if (empty($this->_users))
        {
            return;
        }
        
        echo "Setting last transactions and adding pending asynchronous transactions...".PHP_EOL;
        store::resetPendingAsynchronousTransactions();
        foreach ($this->_users as $user_code => $user)
        {
            $robots = $user['robots'];
            foreach ($robots as $robot_code => $robot)
            {
                // Test
                /*if ($robot_code === 'fet-60')
                {
                    $test = true;
                }*/
                
                // Set last transactions
                $last_buying = $this->getTransactionController($robot)->getLastTransaction($user_code, $robot_code, 'buy');
                $this->setLastTransaction($user, $robot, 'buy', $last_buying);
                $last_selling = $this->getTransactionController($robot)->getLastTransaction($user_code, $robot_code, 'sell', false);
                $this->setLastTransaction($user, $robot, 'sell', $last_selling);
                
                // Add pending asynchronous transactions  
                $pending_asynchronous_transactions = $this->getTransactionController($robot)->getPendingAsynchronousTransactions($user_code, $robot_code);
                foreach ($pending_asynchronous_transactions as $transaction)
                {
                    store::addPendingAsynchronousTransaction($user_code, $robot_code, $transaction);
                }
            }
        }
        
        echo "Setting market coins (real free balances of each market coin)...".PHP_EOL;        
        foreach ($this->_users as $user_code => $user)
        {
            // Get market coins 
            $raw_market_coins = $this->_market_coin_controller->getFiltered(array(
                'user_code' => $user_code
            ))['data'];
            if (empty($raw_market_coins)) continue;
            $market_coins = array();
            foreach ($raw_market_coins as $market_coin) {
                $market_coins[$market_coin['code']] = $market_coin;
            } 
            
            // Get real balances
            $api = $user['api'];
            $account = $api->account();
            $real_balances = array();
            if (isset($account['balances']))
            {
                foreach ($account['balances'] as $values)
                {
                    $coin = $values['asset'];
                    $free = $values['free'];
                    $real_balances[$coin] = (float) $free;
                }                  
            }  
            
            // Set free balances for each market coin
            foreach ($market_coins as $coin => $values)
            {
                $free_balance = (isset($real_balances[$coin]))? $real_balances[$coin] : 0;
                $market_coins[$coin]['free_balance'] = $free_balance;
                
                // Update in db (to show on grid of maintenance)
                if ($this->_is_main_candlestick_interval)
                {
                    $id = $values['_id'];
                    $doc = $this->_market_coin_controller->get($id)['data'];
                    if (empty($doc))
                    {
                        continue;
                    }
                    $doc['free_balance'] = $free_balance;
                    $ret = $this->_market_coin_controller->model->save($id, $doc);
                }
            }
            
            // Set market coins
            store::setMarketCoins($user_code, $market_coins);
        } 
        
    }
    
    private function _listenWS($api)
    {
        // Init timers
        $this->_timer_to_break_websocket = new timer($this->_interval_to_break_websocket);
        $this->_timer_to_refresh_users = new timer($this->_interval_to_refresh_users);
        $this->_timer_to_check_to_force_refresh_users = new timer($this->_interval_to_check_to_force_refresh_users);
        
        // Get symbols (coin pairs)
        $this->_symbols = $this->getSymbols();
        
        if (store::isEmulator())
        {
            $this->_emulateWS();
            die ("End of emulating!");
        }        
                    
        // Kline mode
        $interval = $this->_candlestick_interval_ws.'m';
        $api->kline($this->_symbols, $interval, function($api, $symbol, $chart)
        {
            // Sampling in progress
            if ($this->_is_sampling_in_progress)
            {
                return;
            }
            
            // Is time to close the socket?
            if ($this->_timer_to_break_websocket->isExceeded())
            {
                echo "Closing socket: $symbol to refresh users and symbols...".PHP_EOL;
                // Disconnect and do loop again
                $endpoint = strtolower( $symbol ) . '@kline_' . $this->_candlestick_interval_ws.'m';
                $api->terminate( $endpoint );       
                return; 
            }
            
            // Set robot's watchdog (keep alive)
            if (is_null($this->_timer_to_disable_keep_alive))
            {
                $this->_timer_to_disable_keep_alive = new timer($this->_interval_to_disable_keep_alive);
            }
            if (!$this->_timer_to_disable_keep_alive->isExceeded())
            {
                $this->_setKeepAlive();
            }
            
            // Kline mode
            $timestamp = $chart->t;
            $sample = array(
                'open' => $chart->o,
                'high' => $chart->h,
                'low' => $chart->l,
                'close' => $chart->c,
                'volume' => $chart->v                
            );
            
            // Set date
            $date = date('Y-m-d H:i:s', $timestamp/1000);
            
            // Do the first time
            if (!$this->_initialized)
            {
                if (is_null($this->_previous_date))
                {
                    echo "Initializing... Waiting for next date".PHP_EOL;
                    $this->_previous_date = $date;
                }
                if ($date === $this->_previous_date)
                {
                    return;
                }
                echo "Starting to get data...".PHP_EOL;
                $this->_previous_date = $date;
                $this->_initialized = true;
            }
            
            // If this is a new date:
            if ($date !== $this->_previous_date && !isset($this->_samples[$symbol]) && isset($this->_tmp_samples[$symbol]))
            {               
                // Set samples to register
                $this->_samples[$symbol] = $this->_tmp_samples[$symbol];
                // Reset temporal samples
                unset($this->_tmp_samples[$symbol]);
            }
            
            // Test
//            if ($symbol === 'BTCUSDT')
//            {
//                $test = true;
//            }
            
            // Set temporal samples
            if (!isset($this->_tmp_samples[$symbol]))
            {
                $this->_tmp_samples[$symbol] = $sample;
            }
            else
            {
                // Update properties
                foreach ($sample as $sample_key => $sample_value)
                {
                    switch ($sample_key) {
                        case 'open':
                            break;
                        case 'high':
                            if ($sample_value > $this->_tmp_samples[$symbol]['high'])
                            {
                                $this->_tmp_samples[$symbol]['high'] = $sample_value;
                            }
                            break;
                        case 'low':
                            if ($sample_value < $this->_tmp_samples[$symbol]['low'])
                            {
                                $this->_tmp_samples[$symbol]['low'] = $sample_value;
                            }
                            break;
                        default:
                            $this->_tmp_samples[$symbol][$sample_key] = $sample_value;
                            break;
                    }
                }
            }
            
            if ($date === $this->_previous_date)
            {
                // Refresh users?
                $seconds = date('s');
                if ($this->_permission_for_refresh_users_flag && $seconds >= 40 && $seconds <= 50)
                {
                    $force_refresh = false;
                    if ($this->_timer_to_check_to_force_refresh_users->isExceeded())
                    {
                        $force_refresh = $this->_user_controller->isTime2ForceRefreshUsers();
                        if ($force_refresh)
                        {
                            $this->_user_controller->setForceRefreshUsers(false);
                        }
                        $this->_timer_to_check_to_force_refresh_users = new timer($this->_interval_to_check_to_force_refresh_users);
                    }                    
                    if ($this->_timer_to_refresh_users->isExceeded() || $force_refresh)
                    {
                        $this->_setUsers();
                        if (empty($this->_users))
                        {
                            echo PHP_EOL."Closed socket because there aren't available users".PHP_EOL;
                            // Disconnect and do loop again
                            $endpoint = strtolower( $symbol ) . '@kline_' . $this->_candlestick_interval_ws.'m';
                            $api->terminate( $endpoint );   
                            return;    
                        }
                        echo " Now, the data of users are cool!".PHP_EOL;
                        $this->_timer_to_refresh_users = new timer($this->_interval_to_refresh_users);
                    }
                    $this->_permission_for_refresh_users_flag = false;
                }
                return;
            }
            $this->_permission_for_refresh_users_flag = true;
            
            // Now, this is a new date!
            
            // All samples acquired?               
            $all_acquired = true;
            $not_adquired_symbols = array();
            foreach ($this->_symbols as $sym) {
                if (!isset($this->_samples[$sym]))
                {
                    $all_acquired = false;
                    //echo "Not adquired symbol: ".$sym.PHP_EOL;
                    //break;
                    $not_adquired_symbols[] = $sym;
                }
            }
            if (!$all_acquired)
            {
                $echo_text = "";
                foreach ($not_adquired_symbols as $sym) {
                    if (!empty($echo_text)) $echo_text .= ", ";
                    $echo_text .= $sym;
                }
                echo "Not adquired symbols: ".$echo_text.PHP_EOL;
                return;   
            }
            
            // Sampling in progress
            $this->_is_sampling_in_progress = true;
            
            // Add date
            $this->_samples['date'] = $date;
            
            // Add sample
            store::setLastSampleWs($this->_samples);
            $save_sample = $this->_shallWeSaveSample();
            if ($save_sample)
            {
                store::setDateSample($this->_previous_date);
                store::addSample($this->_samples);
                
                // Sampling
                $this->_sampling($this->_samples);
            }
            
            echo "Trading on date: $this->_previous_date at ".date("H:i:s").PHP_EOL;
            $this->_trade();           
            
            // Saving sample
            if ($save_sample)
            {
                echo "Saving sample on date: $this->_previous_date at ".date("H:i:s").PHP_EOL;
                $this->_sampling_controller->saveSample();                
                
                // Add robots values
                $robots_values = store::getCurrentRobotsValues();
                store::addRobotsValues($robots_values);                
            }
            
            // Save real prices each 1m
            // Disabled due to save prices on sellingTask script from pumps folder
            /*
            if ($this->_is_main_candlestick_interval)
            {
                $this->_saveLastPrices();
            }
            */
            
            // Reset last real prices
            $this->resetLastPrices(array());
            
            // Restore vars
            $this->_samples = array();
            $this->_previous_date = $date;
            $this->_is_sampling_in_progress = false;
            $this->_timer_to_disable_keep_alive = new timer($this->_interval_to_disable_keep_alive);
        });
    }
    
    private function _shallWeSaveSample()
    {
        $last_sample = store::getLastSample();
        
        if (empty($last_sample))
        {
            return true;
        }
        
        $now = date("Y-m-d H:i");
        $date_of_last_sample = date("Y-m-d H:i", strtotime($last_sample['date']));
        
        if (strtotime($date_of_last_sample.' + '.$this->_candlestick_interval.' minutes') <= strtotime($now))
        {
            return true;
        }
        
        return false;
    }
    
    private function _sampling($samples)
    {
        // For each user and robot...
        foreach ($this->_users as $user)
        {
            $robots = $user['robots'];
            foreach ($robots as $robot)
            {
                // Add sample to robot
                $this->addSample($user, $robot, $samples);

                // Filtering
                $this->_filtering_controller->calculateRobotTrack($user, $robot);
                $this->_filtering_controller->calculateIndicatorsValues($user, $robot);
            }
        }
        
    }
    
    private function _trade()
    {
        // For each user and robot...
        foreach ($this->_users as $user_code => $user)
        {
            $robots = $user['robots'];
            foreach ($robots as $robot_code => $robot)
            {
                // Test
                /*if ($robot_code !== 'fet-60')
                {
                    continue;
                }*/

                // Loop due to sell async. floating transactions
                do {
                    $break = true;

                    // Trade!
                    $trading_ret = $this->_trading_controller->trade($user, $robot);
                    if ($trading_ret !== false)
                    {
                        // Update robot values of user in memory
                        $this->_users[$user_code]['robots'][$robot_code] = $trading_ret['robot'];

                        $transaction = $trading_ret['transaction'];
                        if (!empty($transaction) && !$transaction['asynchronous'])
                        {
                            $this->setLastTransaction($user, $robot, $transaction['operation'], $transaction);
                        }

                        // Update balances
                        $this->_updateMarketCoinsBalances($user, $robot, $transaction);
                        
                        // Check if we must try to sell again with the same robot
                        if (!empty($transaction) && $transaction['operation'] === 'sell' && $transaction['asynchronous'])
                        {
                            $break = false;
                        }
                    }

                    if ($break) break;
                    
                } while (true);                

            }
        }
        
    }
    
    private function _updateMarketCoinsBalances($user, $robot, $transaction)
    {
        if (empty($transaction))
        {
            return;
        }
        
        /*if (store::isEmulator() || $this->_robot_controller->isTraining($robot))
        {
            return;
        }*/  
        
        $user_code = $user['userdata']['code'];
        $market_coins = store::getMarketCoins($user_code);
        if (empty($market_coins))
        {
            return;
        }    
        
        $market_coin = $robot['market_coin'];
        if (!isset($market_coins[$market_coin]))
        {
            return true;
        }
        
        $free_balance = $market_coins[$market_coin]['free_balance'];
                
        $operation = $transaction['operation'];
        $amount_market = $transaction['amount'] * $transaction['price'];
//        $commission_coin = $transaction['commission_coin'];
//        if ($market_coin === $commission_coin)
//        {
//            
//        }
//        else
//        {
//            
//        }
        
        if ($operation === 'sell')
        {
            $free_balance += $amount_market;
        }
        else
        {
            $free_balance -= $amount_market;
        }
        
        $market_coins[$market_coin]['free_balance'] = $free_balance;
        
        store::setMarketCoins($user_code, $market_coins);
    }
    
    private function _setKeepAlive()
    {
        if (is_null($this->_timer_keep_alive) || $this->_timer_keep_alive->isExceeded())
        {
            $this->_timer_keep_alive = new timer($this->_interval_keep_alive);
        }
        else
        {
            return;
        }
        
//        echo "Keep alive!".PHP_EOL;
                
        $what = 'robot'.$this->_candlestick_interval;
        $filename = '/opt/tmp/'.$what.'-watchdog';
        file_put_contents($filename, date('Y-m-d H:i:s').". I'm still alive! Yeah!!");
    }
    
    private function _emulateWS()
    {
        $start_date = $this->_emulator_now;
        $end_date = date('Y-m-d H:i:s');
        $samples = $this->_sample_controller->getSamples($this->_candlestick_interval, $start_date, $end_date);
        if (empty($samples))
        {
            die("No samples to emulate!");
        }

        echo "Emulating robot...".PHP_EOL;
        
        // Add samples
        $total_samples = count($samples);
        $counter = 1;
        foreach ($samples as $sample)
        {
            echo "Emulating $counter of $total_samples".PHP_EOL;
            $counter++;
            $sample_date = $sample['sample_date'];
            $samples_values = $sample['samples_values'];
            
            /*if ($sample_date === '2018-10-06 00:37:00')
            {
                $test = true;
            }*/
            
            // Add date
            $sample['date'] = $sample_date;
            
            // Add sample
            store::setLastSampleWs($samples_values);
            store::setDbSample($sample);
            store::setDateSample($sample_date);
            store::addSample($samples_values);

            // Sampling
            $this->_sampling($samples_values);
                
            // Trade!
            $this->_trade();   
            
            // Add robots values
            $robots_values = store::getCurrentRobotsValues();
            store::addRobotsValues($robots_values);     

            // Reset last real prices
            $this->resetLastPrices(array());            
        }
    }
    
    private function _deleteTransactionsForEmulating()
    {
        $transaction_controller = new transactionTraining();
        $start_date = $this->_emulator_now;
        $end_date = date('Y-m-d H:i:s');            
        $transactions = $transaction_controller->getTransactions(null, null, $start_date, $end_date);
        foreach ($transactions as $transaction)
        {
            $id = $transaction['_id'];
            $del_ret = $transaction_controller->model->delete($id);
            if ($del_ret['success'])
            {
                echo "Removed transaction: $id".PHP_EOL;
            }
            else
            {
                echo "Upps!! Error removing doc: $id".PHP_EOL;
            }
        }   
        
    }
    
    private function _saveLastPrices()
    {
        $prices = $this->getLastPrices(null, null);
        
        $id = $this->_prices_controller->normalizeId($this->_prices_controller->model->type); 
        if ($this->_prices_controller->model->exist($id))
        {
            $doc = $this->_prices_controller->model->get($id)['data'];
        }
        else
        {
            $doc = array();
        }

        $doc['prices'] = $prices;
        $doc['last_modification_date'] = date("Y-m-d H:i:s");
        $this->_prices_controller->model->save($id, $doc);

        echo "Saving prices at ".date("Y-m-d H:i:s").". BTC/USDT: ".$prices["BTCUSDT"].PHP_EOL;        
    }
    
}
