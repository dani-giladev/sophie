<?php

namespace modules\cryptos\controller;

// Controllers
use base\core\controller\helpers;
use modules\cryptos\controller\transaction;

/**
 * reportProfit controller
 *
 * @author Dani Gilabert
 */
class reportProfit extends transaction
{
    
    public function getFiltered($params)
    {
        if (!isset($params['start_date']) || !isset($params['end_date']))
        {
            return helpers::resStruct(false, "Fuck you!");
        }
        
        $start_date = $params['start_date']." 00:00:00";
        $end_date = $params['end_date']." 23:59:59";
        $is_training = ($params['is_training'] == 'on' || $params['is_training'] == true);
        $wt_group_code = isset($params['wt_group_code']) ? $params['wt_group_code'] : null;
        $user_code_param = isset($params['user_code']) ? $params['user_code'] : $this->token->getUserCode();
        $all_users = (isset($params['all_users']) && ($params['all_users'] == 'on' || $params['all_users'] == true));
        $prices = isset($params['prices']) ? $params['prices'] : null;
        
        // Get transactions
        if ($is_training)
        {
            // Get training transactions
            $this->model->setDB('cryptos-training');
        }
        $raw_transactions = parent::getTransactions($user_code_param, null, $start_date, $end_date);
        if (empty($raw_transactions))
        {
            return helpers::resStruct(true);
        }
        
        $transactions_by_id = array();
        foreach($raw_transactions as $transaction)
        {
            $transaction_id = $transaction['_id'];
            $user_code = $transaction['user_code'];
            if (!$all_users && $user_code !== $user_code_param)
            {
                continue;
            }
            $transactions_by_id[$transaction_id] = $transaction;
        }
        
        // Get robots
        $raw_robots = $this->_robot_controller->getAll()['data'];        
        $robots = array();
        foreach ($raw_robots as $robot) {
            $user_code = $robot['created_by_user'];
            if (!$all_users && $user_code !== $user_code_param)
            {
                continue;
            }
            $robot_code = $robot['code'];
            $robots[$user_code.'-'.$robot_code] = $robot;
        }
        
        // Group transactions by user and robot
        $trades = array();
        foreach($transactions_by_id as $transaction_id => $transaction)
        {
            $user_code = $transaction['user_code'];
            $robot_code = $transaction['robot_code'];
            $key = $user_code.'-'.$robot_code;

            // Set robot
            $robot = (isset($robots[$key]))? $robots[$key] : null;

            if (isset($wt_group_code) && (is_null($robot) || $wt_group_code !== $robot['wt_group']))
            {
                continue;
            }

            if (!isset($trades[$key]))
            {
                $trades[$key] = $transaction;
                $trades[$key]['profit'] = 0;
                $trades[$key]['profit_usdt'] = 0;
                $trades[$key]['total_commission'] = 0;
                $trades[$key]['total_commission_market'] = 0;
                $trades[$key]['total_commission_usdt'] = 0;
                $trades[$key]['total_profit'] = 0;
                $trades[$key]['total_profit_usdt'] = 0;
                $trades[$key]['total_profit_perc'] = 0;
                $trades[$key]['transactions'] = 0;
                $trades[$key]['trades'] = 0;
                $trades[$key]['buyings'] = 0;
                $trades[$key]['sellings'] = 0;
                $trades[$key]['hits'] = 0;
                $trades[$key]['hits_perc'] = 0;
            }

            $trades[$key]['transactions']++;
            $operation = $transaction['operation'];
            if ($operation === 'buy')
            {
                $trades[$key]['buyings']++;
            }
            else
            {
                $trades[$key]['profit'] += $transaction['profit'];
                $trades[$key]['profit_usdt'] += $transaction['profit_usdt'];
                $trades[$key]['total_commission'] += $transaction['total_commission'];
                $trades[$key]['total_commission_market'] += $transaction['total_commission_market'];
                $trades[$key]['total_commission_usdt'] += $transaction['total_commission_usdt'];
                $trades[$key]['total_profit'] += $transaction['total_profit'];
                $trades[$key]['total_profit_usdt'] += $transaction['total_profit_usdt'];
                $trades[$key]['total_profit_perc'] += $transaction['total_profit_perc'];

                $trades[$key]['sellings']++;
                $trades[$key]['trades']++;
                if ($transaction['total_profit'] > 0)
                {
                    $trades[$key]['hits']++;
                }
            }
        }
        
        $data = array();
        if (!empty($trades))
        {
            if (is_null($prices))
            {
                // Get real prices
                $prices = $this->_robot_controller->getPrices($user_code_param);
                if ($prices === false)
                {
                    return helpers::resStruct(false, "Error getting Binance api");
                }                
            }
        
            foreach($trades as $trade)
            {
                $user_code = $trade['user_code'];
                $user_name = $trade['user_name'];
                $robot_code = $trade['robot_code'];
                $robot_name = $trade['robot_name'];
                $market_coin = $trade['market_coin'];
                
                // Set robot
                $robot = (isset($robots[$user_code.'-'.$robot_code]))? $robots[$user_code.'-'.$robot_code] : null;
                
                $trade['total_profit_perc'] = ($trade['trades'] == 0)? 0 : ($trade['total_profit_perc'] / $trade['trades']);
                $trade['positive'] = ($trade['total_profit_usdt'] > 0);
                $trade['hits_perc'] = ($trade['buyings'] == 0)? 0 : (($trade['hits'] * 100) / $trade['buyings']);
                
                // Set some robot properties
                $candlestick_interval = "";
                $group = "";
                $wt_group = "";
                $favourite = false;
                if (!is_null($robot))
                {
                    $candlestick_interval = $robot['candlestick_interval'];
                    $group = $robot['group'];
                    $wt_group = $robot['wt_group'];
                    $favourite = (isset($robot['favourite']))? $robot['favourite'] : false;
                }
                $trade['candlestick_interval'] = $candlestick_interval;
                $trade['group'] = $group;
                $trade['wt_group'] = $wt_group;
                $trade['favourite'] = $favourite;
                    
                // Grouping
                $trade['balance_grouping'] = $user_name;
                
                // Real total profits
                $trade['total_market_profit_btc'] = 0;
                $trade['total_market_profit_eth'] = 0;
                $trade['total_market_profit_bnb'] = 0;
                $trade['total_market_profit_xrp'] = 0;
                $trade['total_market_profit_usdt'] = 0;
                $total_market_profit_key = 'total_market_profit_'.strtolower($market_coin);
                $trade[$total_market_profit_key] = $trade['total_profit'];
                // Real total profit now!
                $trade['total_profit_bnb_now'] = $this->getBNBValue($trade['total_profit'], $market_coin, $prices);
                $trade['total_profit_btc_now'] = $this->getBTCValue($trade['total_profit'], $market_coin, $prices);
                $trade['total_profit_eth_now'] = $this->getETHValue($trade['total_profit'], $market_coin, $prices);
                $trade['total_profit_usdc_now'] = $this->getUSDCValue($trade['total_profit'], $market_coin, $prices);
                $trade['total_profit_usdt_now'] = $this->getUSDTValue($trade['total_profit'], $market_coin, $prices);
                $trade['total_profit_xrp_now'] = $this->getXRPValue($trade['total_profit'], $market_coin, $prices);
            
                // Real total commissions
                $trade['total_market_commission_btc'] = 0;
                $trade['total_market_commission_eth'] = 0;
                $trade['total_market_commission_bnb'] = 0;
                $trade['total_market_commission_xrp'] = 0;
                $trade['total_market_commission_usdt'] = 0; 
                $total_market_commission_key = 'total_market_commission_'.strtolower($market_coin);
                $trade[$total_market_commission_key] = $trade['total_commission_market'];
                // Real total commission now!
                $trade['total_commission_bnb_now'] = $this->getBNBValue($trade['total_commission_market'], $market_coin, $prices);
                $trade['total_commission_btc_now'] = $this->getBTCValue($trade['total_commission_market'], $market_coin, $prices);
                $trade['total_commission_eth_now'] = $this->getETHValue($trade['total_commission_market'], $market_coin, $prices);
                $trade['total_commission_usdc_now'] = $this->getUSDCValue($trade['total_commission_market'], $market_coin, $prices);
                $trade['total_commission_usdt_now'] = $this->getUSDTValue($trade['total_commission_market'], $market_coin, $prices);
                $trade['total_commission_xrp_now'] = $this->getXRPValue($trade['total_commission_market'], $market_coin, $prices);
                
                // Clean item
                $this->model->clean($trade);
                
                $data[] = $trade;
            }
            
            $data = helpers::sortArrayByField($data, "total_profit_usdt", SORT_DESC);
        }
        
        return helpers::resStruct(true, "", $data);
    }   
    
    public function getBalanceChart($params)
    {
        if (!isset($params['robots']))
        {
            return helpers::resStruct(false, 'Fuck you!');
        }
        
        $robots = json_decode($params['robots'], true);
        $start_date = $params['start_date']." 00:00:00";
        $end_date = $params['end_date']." 23:59:59";
        $is_training = ($params['is_training'] === 'on');
        $property = $params['property'];
        
        // Get transactions
        if ($is_training)
        {
            // Get training transactions
            $this->model->setDB('cryptos-training');
        }
        
        // Group transactions by date
        $trades = array();        
        foreach ($robots as $values)
        {
            $user_code = $values['user_code'];
            $robot_code = $values['robot_code'];
            $yfield = $user_code . '-' . $robot_code . '-' . $property;

            $transactions = parent::getTransactions($user_code, $robot_code, $start_date, $end_date);

            if (!empty($transactions))
            {
                foreach($transactions as $transaction)
                {
                    $date = $transaction['date'];

                    if (!isset($trades[$date]))
                    {
                        $trades[$date] = array();
                    }
                    if (!isset($trades[$date][$yfield]))
                    {
                        $trades[$date][$yfield] = 0;
                    }
                    
                    $trades[$date][$yfield] += $transaction[$property];
                }
            }
        }
        
        if (empty($trades))
        {
            return helpers::resStruct(true);
        }
        
        $data = array();
        $interval = helpers::getNumberOfDays($start_date, $end_date);
        for ($day=0; $day<$interval; $day++)
        {
            $date = date("Y-m-d", strtotime($start_date.' + '.$day.' days'));
            
            $item = array(
                "date" => $date, 
                "zero" => "0"
            );
            
            foreach ($robots as $values)
            {
                $user_code = $values['user_code'];
                $robot_code = $values['robot_code'];
                $yfield = $user_code . '-' . $robot_code . '-' . $property;
                
                if (isset($trades[$date][$yfield]))
                {
                    $item[$yfield] = $trades[$date][$yfield];
                }
                else
                {
                    $item[$yfield] = 0;
                }
            }
                
            // Add data
            $data[] = $item;
        }     
            
        $finaldata = helpers::sortArrayByField($data, "date");
    
        return helpers::resStruct(true, "", $finaldata);
    }
    
}
