<?php

namespace modules\cryptos\controller;

// Controllers
use base\core\controller\controller;
use base\core\controller\helpers;
use modules\cryptos\controller\robot;
use modules\cryptos\controller\fiatCoin;
use modules\cryptos\robot\store;

/**
 * transaction controller
 *
 * @author Dani Gilabert
 */
class transaction extends controller
{
    protected $_robot_controller;
    protected $_fiatcoin_controller;
    protected $_codes = array();
    
    public function __construct()
    {
        parent::__construct();
        $this->_robot_controller = new robot();
        $this->_fiatcoin_controller = new fiatCoin();
    }
    
    public function getAll()
    {
        $view = $this->model->getView("transactionsByUserAndRobot");
        $data = $view->exec();
        return $data;
    }
    
    public function getTransactions($user_code, $robot_code, $start_date, $end_date, $order = 'ASC')
    {
        if (isset($user_code) && isset($robot_code) && isset($start_date) && isset($end_date))
        {
            $view = $this->model->getView("transactionsByUserAndRobotAndDate");
            $view->setStartKey(array($user_code, $robot_code, $start_date));
            $view->setEndKey(array($user_code, $robot_code, $end_date));  
        }
        elseif (isset($user_code) && isset($robot_code) && !isset($start_date) && !isset($end_date))
        {
            $view = $this->model->getView("transactionsByUserAndRobot");
            $view->setStartKey(array($user_code, $robot_code));
            $view->setEndKey(array($user_code, $robot_code));  
        }
        elseif (isset($user_code) && !isset($robot_code) && !isset($start_date) && !isset($end_date))
        {
            $view = $this->model->getView("transactionsByUserAndRobot");
            $view->setStartKey(array($user_code));
            $view->setEndKey(array($user_code, array()));  
        }
        else
        {
            $view = $this->model->getView("transactionsByDate");
            if (isset($start_date) && isset($end_date))
            {
                $view->setStartKey(array($start_date));
                $view->setEndKey(array($end_date));  
            }
        }
        $data = $view->exec()['data'];
        
        if (!empty($data) && $order == 'DESC')
        {
            $data = helpers::sortArrayByField($data, 'date_time', SORT_DESC);
        }

        return $data;
    }
    
    public function getLastTransaction($user_code, $robot_code, $operation = null, $asynchronous = null)
    {
        if (is_null($operation))
        {
            $view = $this->model->getView("transactionsByUserAndRobot");
            $view->setKey(array($user_code, $robot_code));            
        }
        elseif (!is_null($operation) && is_null($asynchronous))
        {
            $view = $this->model->getView("transactionsByUserAndRobotAndOperation");
            $view->setKey(array($user_code, $robot_code, $operation));            
        }
        else
        {
            $view = $this->model->getView("transactionsByUserAndRobotAndOperationAndAsynchronous");
            $view->setKey(array($user_code, $robot_code, $operation, $asynchronous));  
        }

        $view->setLimit("1");
        $view->setDescending(true);
        $data = $view->exec()['data'];       
        
        if (empty($data))
        {
            return array();
        }
        
        return $data[0];
    }
    
    public function getPendingAsynchronousTransactions($user_code, $robot_code)
    {
        if (!is_null($user_code) && !is_null($robot_code))
        {
            $view = $this->model->getView("transactionsByUserAndRobotAndAsynchronousAndCompleted");
            $view->setStartKey(array($user_code, $robot_code, true, false));
            $view->setEndKey(array($user_code, $robot_code, true, false)); 
        }
        elseif (!is_null($user_code) && is_null($robot_code))
        {
            $view = $this->model->getView("transactionsByUserAndAsynchronousAndCompleted");
            $view->setStartKey(array($user_code, true, false));
            $view->setEndKey(array($user_code, true, false));
        }
        else
        {
            $view = $this->model->getView("transactionsByAsynchronousAndCompleted");
            $view->setStartKey(array(true, false));
            $view->setEndKey(array(true, false)); 
        }

        return $view->exec()['data'];
    }
    
    public function getTransactionsConverted2Fiat($user_code, $robot_code, $start_date, $end_date, $converted_to_fiat)
    {
        if (!is_null($user_code) && !is_null($robot_code) && !is_null($start_date) && !is_null($end_date))
        {
            $view_name = $converted_to_fiat? 'transactionsByUserAndRobotAndConvertedtofiatAndFiatdate' : 'transactionsByUserAndRobotAndConvertedtofiatAndDate';
            $view = $this->model->getView($view_name);
            $view->setStartKey(array($user_code, $robot_code, $converted_to_fiat, $start_date));
            $view->setEndKey(array($user_code, $robot_code, $converted_to_fiat, $end_date));
        }
        elseif (!is_null($user_code) && is_null($robot_code) && !is_null($start_date) && !is_null($end_date))
        {
            $view_name = $converted_to_fiat? 'transactionsByUserAndConvertedtofiatAndFiatdate' : 'transactionsByUserAndConvertedtofiatAndDate';            
            $view = $this->model->getView($view_name);
            $view->setStartKey(array($user_code, $converted_to_fiat, $start_date));
            $view->setEndKey(array($user_code, $converted_to_fiat, $end_date));
        }
        elseif (!is_null($user_code) && !is_null($robot_code) && (is_null($start_date) || is_null($end_date)))
        {
            $view = $this->model->getView("transactionsByUserAndRobotAndConvertedtofiat");
            $view->setStartKey(array($user_code, $robot_code, $converted_to_fiat));
            $view->setEndKey(array($user_code, $robot_code, $converted_to_fiat)); 
        }
        elseif (!is_null($user_code) && is_null($robot_code))
        {
            $view = $this->model->getView("transactionsByUserAndConvertedtofiat");
            $view->setStartKey(array($user_code, $converted_to_fiat));
            $view->setEndKey(array($user_code, $converted_to_fiat));
        }
        else
        {
            $view = $this->model->getView("transactionsByConvertedtofiat");
            $view->setStartKey(array($converted_to_fiat));
            $view->setEndKey(array($converted_to_fiat)); 
        }

        return $view->exec()['data'];
    }
    
    public function save($params)
    {
        // Main
        $user = $params['user'];
        $user_code = $user['userdata']['code'];
        $user_name = $user['userdata']['name'];
        
        // Robot
        $robot = $params['robot'];
        $robot_code = $robot['code'];
        $robot_name = $robot['name'];
        $coinpair = $robot['coinpair'];
        $coinpair_name = $robot['coinpair_name'];
        $coin = $robot['coin'];
        $market_coin = $robot['market_coin'];
        
        // Trading
        $operation = $params['operation'];
        $is_manual_operation = $params['is_manual_operation'];
        $robot_track_value = $params['robot_track_value'];
        $order = $params['order'];
        $last_transaction = $params['last_transaction'];
        $last_transaction_id = (!empty($last_transaction))? $last_transaction['_id'] : '';
        $amount = $params['amount'];
        $is_asynchronous_transaction = $params['is_asynchronous_transaction'];   
        
        // Prices
        $prices = $params['prices'];
        $commission = null;
        if (!empty($order) && isset($order['fills']) && !empty($order['fills']))
        {
            $quotient = 0;
            $dividend = 0;    
            $commission = 0;
            foreach ($order['fills'] as $fill)
            {
                $quotient += ($fill['price'] * $fill['qty']);
                $dividend += $fill['qty'];
                $commission += $fill['commission'];
            }
            $raw_price = $quotient / $dividend;
            $price = $this->_robot_controller->normalizePrice($robot, $raw_price);
            $notes = "Current price: ".$prices[$coinpair].". Transaction price: ".$price;
            if ($price == 0)
            {
                $price =  $prices[$coinpair];
                $notes .= ". Fuck, price=0! Review the symbol please. It could be disabled.";
            }
            $commission_coin = $order['fills'][0]['commissionAsset'];
        }
        else
        {
            $notes = "No order";
            $price =  $prices[$coinpair];
            $commission_coin = (!empty($robot['commission_coin']))? $robot['commission_coin'] : 'BNB';
        }
        $price_usdt = $this->getUSDTValue($price, $market_coin, $prices);
                
        // Profit
        $profit = '';
        $profit_usdt = '';
        // Commission
        $commission_perc = (!empty($robot['commission']))? $robot['commission'] : 0;
        $commission_ret = $this->getCommission($coin, $market_coin, $amount, $commission_perc, $commission_coin, $prices, $commission);
        $commission = $commission_ret['commission'];
        $commission_usdt = $commission_ret['commission_usdt'];
        $commission_market = $commission_ret['commission_market'];
        // Totals
        $total_commission = '';
        $total_commission_usdt = '';
        $total_commission_market = '';
        $total_profit = '';
        $total_profit_usdt = '';
        $total_profit_perc = '';
        
        // Working time
        $working_seconds = 0;
        $working_time = '';
        
        // Date/Time
        if (store::isEmulator() || $this->_robot_controller->isTrainingInModeHistory($robot) || $this->_robot_controller->isTrainingInModeWild($robot))
        {
            $db_sample = store::getDbSample();
            $date = $db_sample['date'];
            $time = $db_sample['time'];
            $date_time = $db_sample['date_time'];      
        }
        else
        {
            $date = date("Y-m-d");
            $time = date("H:i:s");
            $date_time = date("Y-m-d H:i:s");
        }

        // Calculate values
        if ($operation === 'sell')
        {
            if (!empty($last_transaction) && $last_transaction['operation'] === 'buy')
            {
                // Profit
                $last_price = $last_transaction['price'];
                $diff = $price - $last_price;
                $profit = $amount * $diff;
                $profit_usdt = $this->getUSDTValue($profit, $market_coin, $prices);
                
                // Totals
                $total_commission = $last_transaction['commission'] + $commission;
                $total_commission_market = $last_transaction['commission_market'] + $commission_market;
                //$total_commission_usdt = $last_transaction['commission_usdt'] + $commission_usdt;
                $total_commission_usdt = $this->getUSDTValue($total_commission_market, $market_coin, $prices);                
                $total_profit = $profit - $total_commission_market;
                $total_profit_usdt = $profit_usdt - $total_commission_usdt;
                // Perc
                $last_amount = $last_transaction['amount'];
                $investment = ($last_amount * $last_price);
                $total_profit_perc = ($total_profit * 100) / $investment;
                
                // Working time
                $last_date_time = $last_transaction['date_time'];
                $working_seconds = strtotime($date_time) - strtotime($last_date_time);
                $wt = helpers::seconds2Time($working_seconds);
                $working_time = $wt['d'].'d '.$wt['h'].'h '.$wt['m'].'m '.$wt['s'].'s';
            }
            else
            {
                $upss = true;
            }
        }
        
        // Add transaction
        $code = $this->_getNewCode();
        $id = $this->normalizeId($this->model->type.'-'.$user_code.'-'.$robot_code.'-'.$code);   

        // Main
        $doc = array();
        $doc['code'] = $code;
        $doc['user_code'] = $user_code;
        $doc['user_name'] = $user_name;
        $doc['robot_code'] = $robot_code;
        $doc['robot_name'] = $robot_name;
        
        // Robot
        $doc['coinpair'] = $coinpair;
        $doc['coinpair_name'] = $coinpair_name;
        $doc['coin'] = $coin;
        $doc['market_coin'] = $market_coin;
        $doc['amount'] = $amount;
        
        // Trading
        $doc['operation'] = $operation;
        $doc['is_manual_operation'] = $is_manual_operation;
        $doc['robot_track_value'] = $robot_track_value;
        $doc['order'] = $order;
        $doc['last_transaction_id'] = $last_transaction_id;
        
        // Prices
        $doc['price'] = $price;
        $doc['price_usdt'] = $price_usdt;
        // Profit
        $doc['profit'] = (string) $profit;
        $doc['profit_usdt'] = (string) $profit_usdt;
        // Commission
        $doc['commission_perc'] = (string) $commission_perc;
        $doc['commission'] = (string) $commission;
        $doc['commission_coin'] = $commission_coin;
        $doc['commission_usdt'] = (string) $commission_usdt;
        $doc['commission_market'] = (string) $commission_market;
        // Totals
        $doc['total_commission'] = (string) $total_commission;
        $doc['total_commission_usdt'] = (string) $total_commission_usdt;
        $doc['total_commission_market'] = (string) $total_commission_market;
        $doc['total_profit'] = (string) $total_profit;
        $doc['total_profit_usdt'] = (string) $total_profit_usdt;
        $doc['total_profit_perc'] = (string) $total_profit_perc;
        
        // Working time
        $doc['working_seconds'] = (string) $working_seconds;
        $doc['working_time'] = $working_time;

        // Date/Time
        $doc['date'] = $date;
        $doc['time'] = $time;
        $doc['date_time'] = $date_time;
        
        // Asynchronous
        $doc['asynchronous'] = $is_asynchronous_transaction;
        $doc['completed'] = $is_asynchronous_transaction;
        $doc['selling_order_activated'] = false;
        
        // FIAT Profits
        if ($operation === 'sell')
        {
            $converted_to_fiat = false;
            // If market coin is FIAT, then this transaction is not FIAT floating
            if ($this->_fiatcoin_controller->isFiat($market_coin))
            {
                $converted_to_fiat = true;
                // FIAT Profits properties
                $doc['buying_price'] = (!empty($last_transaction))? $last_transaction['price']: 0;
                $doc['fiat_buying_price'] = 0;
                $doc['fiat_current_price'] = 0;
                $doc['fiat_date'] = date("Y-m-d");
                $doc['fiat_time'] = date("H:i:s");
                $doc['fiat_date_time'] = date("Y-m-d H:i:s");
                $doc['fiat_order'] = $order;
                $doc['fiat_amount'] = $amount;
                $doc['fiat_net_profit'] = $total_profit;
                $doc['fiat_net_profit_perc'] = $total_profit_perc;
                $doc['fiat_coin'] = $market_coin;
                $doc['fiat_commission_perc'] = 0;
                $doc['fiat_commission'] = 0;
                $doc['fiat_commission_coin'] = '';
                $doc['fiat_commission_usdt'] = 0;
                $doc['fiat_commission_market'] = 0;        
            }             
            $doc['converted_to_fiat'] = $converted_to_fiat;
            
            // Withdrawal
            $doc['withdrawal'] = false;
        }
        
        // Others
        $doc['notes'] = $notes;
        $doc['is_old'] = false;
        
        // Save
        if ($this->_robot_controller->isTrainingInModeHistory($robot) || $this->_robot_controller->isTrainingInModeWild($robot))
        {
            // Update robot
            if (!$is_asynchronous_transaction)
            {
                $robot['last_operation'] = $operation;
            }
            $robot['manual_operation'] = '';
            
            if ($this->_robot_controller->isTrainingInModeHistory($robot))
            {
                // Save transaction
                $this->model->save($id, $doc);
            }
        }
        else
        {
            // Save transaction
            $this->model->save($id, $doc);
            
            // Update robot
            $robot_id = $robot['_id'];
            $robot_doc = $this->_robot_controller->get($robot_id)['data'];
            if (!$is_asynchronous_transaction)
            {
                $robot['last_operation'] = $operation;
                $robot_doc['last_operation'] = $operation;
            }
            if ($operation === 'sell' && 
               ($this->_robot_controller->getManualOperation($robot) === 'sellAndStop' || $this->_robot_controller->getManualOperation($robot) === 'sellCalmlyAndStop')
            )
            {
                $robot['is_running'] = false;
                $robot_doc['is_running'] = false;
            }
            $robot['manual_operation'] = '';
            $robot_doc['manual_operation'] = '';
            $ret_save = $this->_robot_controller->model->save($robot_id, $robot_doc);
        }
        
        // Add transaction id
        $doc['_id'] = $id;
        
        return array(
            'transaction' => $doc,
            'robot' => $robot
        );
    }
    
    public function getBNBValue($value, $coin, $prices)
    {
        return $this->getPriceInSpecificCoin($value, $coin, "BNB", $prices);
    }
    
    public function getBTCValue($value, $coin, $prices)
    {
        return $this->getPriceInSpecificCoin($value, $coin, "BTC", $prices);
    }
    
    public function getETHValue($value, $coin, $prices)
    {
        return $this->getPriceInSpecificCoin($value, $coin, "ETH", $prices);
    }
    
    public function getUSDCValue($value, $coin, $prices)
    {
        return $this->getPriceInSpecificCoin($value, $coin, "USDC", $prices);
    }
    
    public function getUSDTValue($value, $coin, $prices)
    {
        return $this->getPriceInSpecificCoin($value, $coin, "USDT", $prices);
    }
    
    public function getXRPValue($value, $coin, $prices)
    {
        return $this->getPriceInSpecificCoin($value, $coin, "XRP", $prices);
    }
    
    public function getPriceInSpecificCoin($value, $coin, $specific_coin, $prices)
    {
        if ($coin === $specific_coin)
        {
            return $value;
        }
        
        if (!isset($prices[$coin.$specific_coin]))
        {
            return null;
        }
        
        $market_price = $prices[$coin.$specific_coin];
        $ret = $value * $market_price;
        return $ret;
    }
    
    protected function _getNewCode()
    {
        //return date("YmdHis")."-".rand(100, 999);
        do {
            $t = microtime(true);
            //$micro = sprintf("%06d",($t - floor($t)) * 1000000);
            $micro = str_replace(".", "", $t);
            $code = date("YmdHis")."-".$micro;
            if (in_array($code, $this->_codes))
            {
                usleep(0.5 * 1000 * 1000);
                continue;
            }
            array_push($this->_codes, $code);
            return $code;
        } while (true);
    }
    
    public function getCommission($coin, $market_coin, $amount, $commission_perc, $commission_coin, $prices, $c = null, $fiat_coin = "USDT")
    {
        /*
         * Example:
         * 
         * m = (TRX / BTC)
         * n = (BNB / BTC)
         * 
         * a = (TRX / BNB) = m / n
         * b = a * amount
         * c = (b * 0.05) / 100
         * 
         * commission = c BNBs
         * 
         */
        if (!isset($prices[$coin.$market_coin]))
        {
            return array(
                'commission' => 0,
                'commission_usdt' => 0,
                'commission_market' => 0
            );
        }
        
        if (is_null($c))
        {
            if ($commission_coin === $market_coin || 
                !isset($prices[$coin.$market_coin]) || 
                !isset($prices[$commission_coin.$market_coin])
            )
            {
                $mc = ($commission_coin === 'BTC')? $fiat_coin : 'BTC'; 
                $m =  $prices[$coin.$mc];
                $n =  $prices[$commission_coin.$mc];
            }
            else
            {
                $m =  $prices[$coin.$market_coin];
                $n =  $prices[$commission_coin.$market_coin];
            }
            $a = $m / $n;
            $b = $a * $amount;
            $c = ($b * $commission_perc) / 100;            
        }
        
        if ($commission_coin === $market_coin)
        {
            $c_market = $c;
        }
        else
        {
            if (isset($prices[$commission_coin.$market_coin]))
            {
                $c_market = $c * $prices[$commission_coin.$market_coin];
            }
            else
            {
                // Problem with BNBXRP
                $c_market = $c / $prices[$market_coin.$commission_coin];
            }
        }
        
        if (isset($prices[$commission_coin.$fiat_coin]))
        {
            $c_usdt = $c * $prices[$commission_coin.$fiat_coin];
        }
        else
        {
            $c_usdt = $c_market * $prices[$market_coin.$fiat_coin];
        }
        
        return array(
            'commission' => abs($c),
            'commission_usdt' => abs($c_usdt),
            'commission_market' => abs($c_market)
        );
    }
    
    public function getFiatProfit($market_coin, $investment, $total_profit, $market_coins, $prices, $commission_perc, $commission_coin)
    {
        $fiat_net_profit = 0;
        $fiat_net_profit_perc = 0;
        $fiat_coin = '';
        
        if (empty($market_coins) || !isset($market_coins[$market_coin]))
        {
            return array(
                'fiat_net_profit' => $fiat_net_profit,
                'fiat_net_profit_perc' => $fiat_net_profit_perc,
                'fiat_coin' => $fiat_coin,
                'fiat_buying_price' => 0,
                'fiat_current_price' => 0,
                'mkc_total_amount' => 0,
                'fiat_commission_perc' => 0,
                'fiat_commission' => 0,
                'fiat_commission_coin' => $commission_coin,
                'fiat_commission_usdt' => 0,
                'fiat_commission_market' => 0
            );  
        }
        
        // Test
        /*if ($market_coin === 'USDT')
        {
            $test = true;
        }*/
        
        $market_coin_data = $market_coins[$market_coin];
        $buying_fiat_coin = $market_coin_data['buying_fiat_coin'];
        $fiat_buying_price = $market_coin_data['buying_price'];
 
        $mkc_total_amount = $investment + $total_profit;
        if (empty($fiat_buying_price))
        {
             $fiat_buying_price = 1;
             $buying_fiat_coin = $market_coin;
        }
        $real_buying_amount = $investment * $fiat_buying_price;
        $fiat_current_price = $this->getPriceInSpecificCoin(1, $market_coin, $buying_fiat_coin, $prices);
        $real_selling_amount = $mkc_total_amount * $fiat_current_price;
        
        // Get comissions
        $commission_ret = $this->getCommission($market_coin, $buying_fiat_coin, $total_profit, $commission_perc, $commission_coin, $prices, null, $buying_fiat_coin);
        $commission = $commission_ret['commission'];
        $commission_usdt = $commission_ret['commission_usdt'];
        $commission_market = $commission_ret['commission_market'];
        
        $fiat_net_profit = $real_selling_amount - $real_buying_amount - $commission_usdt;
        $fiat_net_profit_perc = ($fiat_net_profit * 100) / $real_buying_amount;
        $fiat_coin = $buying_fiat_coin;
        
        return array(
            'fiat_net_profit' => $fiat_net_profit,
            'fiat_net_profit_perc' => $fiat_net_profit_perc,
            'fiat_coin' => $fiat_coin,
            'fiat_buying_price' => $fiat_buying_price,
            'fiat_current_price' => $fiat_current_price,
            'mkc_total_amount' => $mkc_total_amount,
            'fiat_commission_perc' => $commission_perc,
            'fiat_commission' => $commission,
            'fiat_commission_coin' => $commission_coin,
            'fiat_commission_usdt' => $commission_usdt,
            'fiat_commission_market' => $commission_market
        );        
    }
    
}
