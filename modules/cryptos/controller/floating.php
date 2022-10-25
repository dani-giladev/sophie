<?php

namespace modules\cryptos\controller;

// Controllers
use base\core\controller\helpers;
use modules\cryptos\controller\reportTransaction;
use modules\cryptos\controller\user;
use modules\cryptos\controller\robot;
use modules\cryptos\controller\marketCoin;
use modules\cryptos\robot\user as robotUser; 

/**
 * Floating controller
 *
 * @author Dani Gilabert
 */
class floating extends reportTransaction
{
    
    public function getFiltered($params)
    {
        $start_date = (isset($params['start_date']) && !empty($params['start_date']))? ($params['start_date']." 00:00:00") : null;
        $end_date = (isset($params['end_date']) && !empty($params['end_date']))? ($params['end_date']." 23:59:59") : null;
        $is_training = (isset($params['is_training']) && ($params['is_training'] == 'on' || $params['is_training'] == 'true'));
        $user_code_param = (isset($params['user_code']) && !empty($params['user_code'])) ? $params['user_code'] : $this->token->getUserCode();
        $calculate_profits = isset($params['calculate_profits'])? $params['calculate_profits'] : true;
        $prices = isset($params['prices'])? json_decode($params['prices'], true) : null;
        
        // Get pending async. transactions
        $params['user_code'] = $user_code_param;
        $pending_asynchronous_transaction_ids = array();
        $pending_asynchronous_transactions = parent::getFiltered($params)['data'];
        foreach ($pending_asynchronous_transactions as $key => $transaction)
        {
            $transaction['is_pending_asynchronous'] = true;
            $pending_asynchronous_transactions[$key] = $transaction;
            array_push($pending_asynchronous_transaction_ids, $transaction['_id']);
        }
        
        // Get last buying transactions of each robot
        $last_buying_transactions = array();
        $user_controller = new user();
        $robot_controller = new robot();
        if (!is_null($user_code_param))
        {
            $users = array(array(
                'code' => $user_code_param
            ));
        }
        else
        {
            $users = $user_controller->getAll()['data'];
        }
        if (!empty($users))
        {
            foreach ($users as $user)
            {
                $user_code = $user['code'];
                // Get available robots by user
                $robots = $robot_controller->getFiltered(array(
                    'user_code' => $user_code,
                    'available' => true
                ))['data'];
                if (empty($robots))
                {
                    continue;
                }
                foreach ($robots as $robot)
                {
                    $robot_code = $robot['code'];
                    if (($is_training && $robot['in_production']) || (!$is_training && !$robot['in_production']))
                    {
                        continue;
                    }
                    if ($robot['last_operation'] !== 'buy')
                    {
                        continue;
                    }
                    $transaction = $this->getLastTransaction($user_code, $robot_code, 'buy');
                    if (empty($transaction))
                    {
                        continue;
                    }
                    if (in_array($transaction['_id'], $pending_asynchronous_transaction_ids))
                    {
                        continue;
                    }
                    // Set some robot properties
                    $this->_setDynamicProperties($transaction, $robot);
                    $transaction['is_pending_asynchronous'] = false;
                    $last_buying_transactions[] = $transaction;
                }
            }   
        }
        
        // Merge all transactions
        $transactions = array_merge($pending_asynchronous_transactions, $last_buying_transactions);
        if (empty($transactions))
        {
            return helpers::resStruct(true);
        }
        
        /*
         * Calculate profits
         */
        if (!$calculate_profits)
        {
            return helpers::resStruct(true, "", $transactions);
        }
        
        // Get real prices
        if (is_null($prices))
        {
            $prices = $this->_robot_controller->getPrices($user_code_param);
            if ($prices === false)
            {
                return helpers::resStruct(false, "Error getting Binance api");
            }            
        }
        
        // Get market coins
        $market_coin_controller = new marketCoin();
        $raw_market_coins = $market_coin_controller->getFiltered(array(
            'user_code' => $user_code_param
        ))['data'];
        $market_coins = array();
        foreach ($raw_market_coins as $market_coin) {
            $market_coins[$market_coin['code']] = $market_coin;
        }         
        
        // Calculate profits
        $data = array();
        foreach ($transactions as $transaction)
        {
            $coinpair = $transaction['coinpair'];
            $coin = $transaction['coin'];
            $market_coin = $transaction['market_coin'];
            $amount = (float) $transaction['amount'];
            $commission_perc = isset($transaction['commission_perc'])? $transaction['commission_perc'] : 0.075;
            $commission_coin = $transaction['commission_coin'];
            //$date = $transaction['date'];
            $date_time = $transaction['date_time'];
            
            // Filter by date
            if (!is_null($start_date))
            {
                if (strtotime($date_time) < strtotime($start_date))
                {
                    continue;
                }
            }
            if (!is_null($end_date))
            {
                if (strtotime($date_time) > strtotime($end_date))
                {
                    continue;
                }
            }
            
            // Prices
            $current_price =  $prices[$coinpair];
            $current_price_usdt = $this->getUSDTValue($current_price, $market_coin, $prices);

            // Amount
            $amount_usdt = $amount * $transaction['price_usdt'];
            $current_amount_usdt = $this->getUSDTValue(($amount*$current_price), $market_coin, $prices);
            
            // Commissions
            $commission_ret = $this->getCommission($coin, $market_coin, $amount, $commission_perc, $commission_coin, $prices);
            $commission = $commission_ret['commission'];
            $commission_usdt = $commission_ret['commission_usdt'];
            $commission_market = $commission_ret['commission_market'];
   
            // Profit
            $last_price = $transaction['price'];
            $diff = $current_price - $last_price;
            $profit = $amount * $diff;
            $profit_usdt = $this->getUSDTValue($profit, $market_coin, $prices);

            // Totals
            $total_commission = $transaction['commission'] + $commission;
            $total_commission_market = $transaction['commission_market'] + $commission_market;
            //$total_commission_usdt = $transaction['commission_usdt'] + $commission_usdt;
            $total_commission_usdt = $this->getUSDTValue($total_commission_market, $market_coin, $prices); 
            $total_profit = $profit - $total_commission_market;
            $total_profit_usdt = $profit_usdt - $total_commission_usdt;
            // Perc
            $investment = ($amount * $last_price);
            $total_profit_perc = ($total_profit * 100) / $investment;
            
            // Net profit vs Amount USDT
            $amount_usdt = $amount * $transaction['price_usdt'];
            $total_profit_usdt_vs_amount_usdt = $current_amount_usdt - $amount_usdt - $total_commission_usdt;
            
            // Real total profit USDT Now! (if you sell now!)
            $fiat_profit_ret = $this->getFiatProfit($market_coin, $investment, $total_profit, $market_coins, $prices, $commission_perc, $commission_coin);
            $fiat_net_profit = $fiat_profit_ret['fiat_net_profit'];
            $fiat_net_profit_perc = $fiat_profit_ret['fiat_net_profit_perc'];
            $fiat_coin = $fiat_profit_ret['fiat_coin'];
                    
            // Set calculated fields
            $transaction['amount'] = $amount;
            $transaction['amount_usdt'] = $amount_usdt;
            $transaction['current_amount_usdt'] = $current_amount_usdt;
            $transaction['current_price'] = $current_price;
            $transaction['current_price_usdt'] = $current_price_usdt;
            $transaction['total_profit'] = $total_profit;
            $transaction['total_profit_usdt'] = $total_profit_usdt;
            $transaction['total_profit_perc'] = $total_profit_perc;
            $transaction['is_training'] = ($params['is_training'] === 'on');
                
            // Real total profits
            $transaction['total_market_profit_btc'] = 0;
            $transaction['total_market_profit_eth'] = 0;
            $transaction['total_market_profit_bnb'] = 0;
            $transaction['total_market_profit_xrp'] = 0;
            $transaction['total_market_profit_usdt'] = 0;
            $total_market_profit_key = 'total_market_profit_'.strtolower($market_coin);
            $transaction[$total_market_profit_key] = $total_profit;
            $transaction['total_profit_usdt_vs_amount_usdt'] = $total_profit_usdt_vs_amount_usdt;
            $transaction['fiat_net_profit'] = $fiat_net_profit;
            $transaction['fiat_net_profit_perc'] = $fiat_net_profit_perc;
            $transaction['fiat_coin'] = $fiat_coin;
            
            // Add item
            $data[] = $transaction;            
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    protected function _getTransactions($user_code, $robot_code, $start_date, $end_date, $order = 'ASC')
    {
        return $this->getPendingAsynchronousTransactions($user_code, $robot_code);
    }
    
    public function sellPendingTransactions($params)
    {
        if (!isset($params['data']))
        {
            return helpers::resStruct(false, "Fuck you!");
        }
        
        $data = json_decode($params['data'], true);
        $first_transacction = $data[0];
        $is_training = ($first_transacction['is_training'] === 'on'|| $first_transacction['is_training'] === 'true');
        
        if ($is_training)
        {
            // Set training db
            $this->model->setDB('cryptos-training');
        }
        
        $robot_controller = new robot();
        $msg_errors = '';
        $robots_collection = array();
        $robots_to_give_sell_order = array();
        
        foreach ($data as $values)
        {
            $transaction_id = $values['transaction_id'];
            
            $doc = $this->model->get($transaction_id)['data'];
            if (empty($doc))
            {
                if (!empty($msg_errors)) $msg_errors .= '</br>';
                $msg_errors .= "Inexistent transaction ($transaction_id)";
                continue;
            }
            
            $user_code = $doc['user_code'];
            $robot_code = $doc['robot_code'];
            $asynchronous = $doc['asynchronous'];
            
            if ($doc['operation'] !== 'buy')
            {
                if (!empty($msg_errors)) $msg_errors .= '</br>';
                $msg_errors .= "Operation must be 'buy' ($transaction_id)";
                continue;
            }
            
            // Save
            if ($asynchronous)
            {
                $doc['selling_order_activated'] = true;
                $ret_save = $this->model->save($transaction_id, $doc);                
            }
            else
            {
                // No async. (normal buying)
                $mark_sell_in_robot = true;
            }
            
            // Disable buying
            $robot_id = $robot_controller->normalizeId('cryptos_robot-'.$user_code.'-'.$robot_code);
            if (isset($robots_collection[$robot_id]))
            {
                $robot = $robots_collection[$robot_id];
            }
            else
            {
                $robot = $this->get($robot_id)['data'];
                if (empty($robot))
                {
                    continue;
                }
                $robots_collection[$robot_id] = $robot;
            }
            
            $last_operation = $robot_controller->getLastOperation($robot);
//            $enabled_to_buy = $robot_controller->isEnabledToBuy($robot);
            
            if (!in_array($robot_id, $robots_to_give_sell_order) && !$asynchronous && $last_operation === 'buy')
            {
                array_push($robots_to_give_sell_order, $robot_id);
            }
        }
        
        // Update robots
        foreach ($robots_collection as $doc) {
            
            $robot_id = $doc['_id'];
            
            $doc['enabled_to_buy'] = false;
            if (in_array($robot_id, $robots_to_give_sell_order))
            {
                $doc['manual_operation'] = 'sell';
            }
            
            $ret_save = $robot_controller->model->save($robot_id, $doc);
        }
        
        // Force to refresh users (in robot process)
        $user_controller = new robotUser();
        $user_controller->setForceRefreshUsers(true);

        $success = (empty($msg_errors));
        return helpers::resStruct($success, $msg_errors);
    }

}
