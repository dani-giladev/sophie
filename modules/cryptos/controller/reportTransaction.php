<?php

namespace modules\cryptos\controller;

// Controllers
use base\core\controller\helpers;
use modules\cryptos\controller\transaction;

/**
 * reportTransaction controller
 *
 * @author Dani Gilabert
 */
class reportTransaction extends transaction
{
    
    public function getFiltered($params)
    {
        if (!isset($params['is_training']))
        {
            return helpers::resStruct(false, "Fuck you!");
        }
        
        $user_code_param = (isset($params['user_code']) && !empty($params['user_code'])) ? $params['user_code'] : $this->token->getUserCode();
        $all_users = (isset($params['all_users']) && ($params['all_users'] == 'on' || $params['all_users'] == true));
        $robot_code = isset($params['robot_code'])? $params['robot_code'] : null;
        $start_date = isset($params['start_date'])? ($params['start_date']." 00:00:00") : null;
        $end_date = isset($params['end_date'])? ($params['end_date']." 23:59:59") : null;
        $is_training = (isset($params['is_training']) && ($params['is_training'] == 'on' || $params['is_training'] == 'true'));
        
        // Get transactions
        if ($is_training)
        {
            // Get training transactions
            $this->model->setDB('cryptos-training');
        }
        $transactions = $this->_getTransactions($user_code_param, $robot_code, $start_date, $end_date);
        if (empty($transactions))
        {
            return helpers::resStruct(true);
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
        
        $data = array();
        foreach($transactions as $transaction)
        {
            $user_code = $transaction['user_code'];
            if (!$all_users && $user_code !== $user_code_param)
            {
                continue;
            }
            $robot_code = $transaction['robot_code'];
            $market_coin = $transaction['market_coin'];
            $total_profit = $transaction['total_profit'];

            // Set robot
            $robot = (isset($robots[$user_code.'-'.$robot_code]))? $robots[$user_code.'-'.$robot_code] : null;

            // Set some robot properties
            $this->_setDynamicProperties($transaction, $robot);
                
            // Real total profits
            $transaction['total_market_profit_btc'] = 0;
            $transaction['total_market_profit_eth'] = 0;
            $transaction['total_market_profit_bnb'] = 0;
            $transaction['total_market_profit_xrp'] = 0;
            $transaction['total_market_profit_usdt'] = 0;
            $total_market_profit_key = 'total_market_profit_'.strtolower($market_coin);
            $transaction[$total_market_profit_key] = $total_profit;
            $transaction['negative'] = ($total_profit < 0);

            // Clean item
            $this->model->clean($transaction);

            // Add item
            $data[] = $transaction;
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    protected function _setDynamicProperties(&$transaction, $robot)
    {
        // Set some robot properties
        $candlestick_interval = "";
        $group = "";
        $wt_group = "";
        if (!is_null($robot))
        {
            $candlestick_interval = $robot['candlestick_interval'];
            $group = $robot['group'];
            $wt_group = $robot['wt_group'];
        }
        $transaction['candlestick_interval'] = $candlestick_interval;
        $transaction['group'] = $group;
        $transaction['wt_group'] = $wt_group;

        // Grouping
        //$transaction['transaction_grouping'] = $transaction['robot_name'].", ".$transaction['user_name'];
        $transaction['transaction_grouping'] = $transaction['robot_name']." (".$transaction['robot_code'].")";
    }
        
    protected function _getTransactions($user_code, $robot_code, $start_date, $end_date, $order = 'ASC')
    {
        return parent::getTransactions($user_code, $robot_code, $start_date, $end_date, $order);
    }
    
    public function delete($id)
    {
        $id = $this->normalizeId($id);
        
        $doc = $this->model->get($id)['data'];
        if (!empty($doc))
        {
            return $this->model->delete($id);
        }
        
        $this->model->setDB('cryptos-training');
        $doc = $this->model->get($id)['data'];
        if (!empty($doc))
        {
            return $this->model->delete($id);
        }
        
        return helpers::resStruct(false, "The doc with id $id doesn't exist");
    }

}
