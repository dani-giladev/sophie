<?php

namespace modules\cryptos\controller\trading;

// Controllers
use base\core\controller\helpers;
use modules\cryptos\controller\trading\chart;
use modules\cryptos\robot\user as robotUser; 

/**
 * trading controller
 *
 * @author Dani Gilabert
 */
class trading extends chart
{
    
    protected function _setDates($is_realtime, $period, $start_date)
    {
        if ($is_realtime)
        {
            $end_date = date('Y-m-d H:i');
            $start_date = date('Y-m-d H:i', strtotime("-$period hours", strtotime($end_date.':00'))).':00';
        }
        else
        {
            $start_date = date('Y-m-d H:i:s', strtotime($start_date));
            $end_date = date('Y-m-d H:i', strtotime("+$period hours", strtotime($start_date)));
        }
        $end_date .= ':59';
        
        $this->_start_date = $start_date;
        $this->_end_date = $end_date;
    }
    
    public function getRealTimeData($params)
    {
        $user_code = isset($params['user_code']) ? $params['user_code'] : null;
        $robot_code = isset($params['robot_code']) ? $params['robot_code'] : null;
        $is_realtime = ($params['is_realtime'] == 'true');
        $period = $params['period'];
        $start_date = $params['start_date'];
                        
        // Set dates
        $this->_setDates($is_realtime, $period, $start_date);
        
        // Get robot
        $id = $this->_robot_controller->normalizeId('cryptos_robot-'.$user_code.'-'.$robot_code);
        $robot = $this->_robot_controller->get($id)['data'];
        if (empty($robot))
        {
            return helpers::resStruct(false);
        }
        
        $candlestick_interval = $robot['candlestick_interval'];
        $coinpair = $robot['coinpair'];
        $coinpair_name = $robot['coinpair_name'];
        $coin = $robot['coin'];
        $market_coin = $robot['market_coin'];
        $is_running = $this->_robot_controller->isRunning($robot);
        $is_training = $this->_robot_controller->isTraining($robot);
        $status = $this->_robot_controller->getStatusName($robot);
        $last_operation = $this->_robot_controller->getLastOperation($robot);
        $amount = $robot['amount'];
        $amount_unit = $robot['amount_unit'];
        
        // Get last price
        $last_sample = $this->_sample_controller->getLastSample($candlestick_interval);
        if (empty($last_sample) || !isset($last_sample['samples_values'][$coinpair]))
        {
            $last_price = 0;
            $date_of_last_price = '';
        }
        else
        {
            $last_price = $last_sample['samples_values'][$coinpair]['close'];
            $date_of_last_price = $last_sample['sample_date'];
        }
        
        // Get history
        $history_transactions = 0;
        $history_profit = 0;
        $history_profit_usdt = 0;
        $history_working_seconds = 0;
        $history_working_time = '0h 0m';
        $history_resting_time = '0h 0m';
        $history = $this->_transaction_controller->getTransactions($user_code, $robot_code, $this->_start_date, $this->_end_date, "ASC");
        if (!empty($history))
        {
            $history_transactions = count($history);
            foreach ($history as $transaction)
            {
                if ($transaction['operation'] === 'buy')
                {
                    continue;
                }
                $history_profit += $transaction['total_profit'];
                $history_profit_usdt += $transaction['total_profit_usdt'];
                $history_working_seconds += $transaction['working_seconds'];
            }
            
            // Total time
            //$history_fisrt_datetime = reset($history)['date_time'];
            $history_last_datetime = date('Y-m-d H:i:s');
            $history_fisrt_datetime = date('Y-m-d H:i:s', strtotime("-24 hours", strtotime($history_last_datetime)));
            $history_total_seconds = strtotime($history_last_datetime) - strtotime($history_fisrt_datetime);
            
            // Working time
            $last_transaction = end($history);
            if ($last_transaction['operation'] === 'buy')
            {
                $last_transaction_date_time = $last_transaction['date_time'];
                $second_to_sum = strtotime($history_last_datetime) - strtotime($last_transaction_date_time);
                $history_working_seconds += $second_to_sum;
            }
            $wt = helpers::seconds2Time($history_working_seconds);
            $history_working_time = $wt['h'].'h '.$wt['m'].'m '.$wt['s'].'s';
            
            // Resting time
            $history_resting_seconds = $history_total_seconds - $history_working_seconds;
            $wt = helpers::seconds2Time($history_resting_seconds);
            $history_resting_time = $wt['h'].'h '.$wt['m'].'m '.$wt['s'].'s';
        }
        
        // Change values according to period
        $change_by_period_value_html = '';
        if ($is_realtime)
        {
            $first_sample = $this->_sample_controller->getSample($candlestick_interval, $this->_start_date);
            if (!empty($first_sample) && isset($first_sample['samples_values'][$coinpair]))
            {
                $first_price = $first_sample['samples_values'][$coinpair]['close'];
                $price_diff = $last_price - $first_price;
                $change_perc = ($price_diff / $first_price) * 100;

                $color = ($price_diff > 0)? 'green' : 'red';
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
                $change_by_period_value_html = $price_diff_html.$change_perc_html;
            }            
        }
        
        // Change values according to robot
        $change_by_robot_html = '';
        $change_by_robot_value_html = '';
        if ($is_realtime)
        {
            $first_price = $this->_robot_controller->getFirstPriceOfChangeValues($robot);
            $change_values = $this->_robot_controller->getChangeValues($robot, $first_price, $last_price);
            $change_by_robot_html = $change_values['change_by_robot_html'];
            $change_by_robot_value_html = $change_values['change_by_robot_value_html'];
        }
        
        $data = array(
            'coinpair' => $coinpair,
            'coinpair_name' => $coinpair_name,
            'coin' => $coin,
            'market_coin' => $market_coin,
            'last_price' => ((float) $last_price),
            'date_of_last_price' => date('H:i A', strtotime($date_of_last_price)),
            
            // Change values
            'change_by_period' => $period.'h',
            'change_by_period_value' => $change_by_period_value_html,
            'change_by_robot' => $change_by_robot_html,
            'change_by_robot_value' => $change_by_robot_value_html,
            
            'is_running' => $is_running,
            'is_training' => $is_training,
            'status' => $status,
            'last_operation' => $last_operation,
            'amount' => $amount." ".($amount_unit === 'usdt'? 'USDT' : $coin),
            
            // History
            'history_transactions' => $history_transactions,
            'history_profit' => $history_profit." ".$market_coin,
            'history_profit_usdt' => $history_profit_usdt." USDT",
            'history_working_time' => $history_working_time,
            'history_resting_time' => $history_resting_time
        );
    
        return helpers::resStruct(true, "", $data);
    }
    
    public function startStopRobot($params)
    {
        $user_code = isset($params['user_code']) ? $params['user_code'] : null;
        $robot_code = isset($params['robot_code']) ? $params['robot_code'] : null;
        $start = isset($params['start']) ? ($params['start'] == 'true') : null;
        if (is_null($start))
        {
            return helpers::resStruct(false);
        }
        
        // Get robot
        $id = $this->_robot_controller->normalizeId('cryptos_robot-'.$user_code.'-'.$robot_code);
        $robot = $this->_robot_controller->get($id)['data'];
        if (empty($robot))
        {
            return helpers::resStruct(false, "The robot with id: $id, doesn't exist");
        }
        
        $robot['is_running'] = $start;
        
        $this->_robot_controller->model->save($id, $robot);
    
        return helpers::resStruct(true);
    }
    
    public function buy($params)
    {
        $user_code = isset($params['user_code']) ? $params['user_code'] : null;
        $robot_code = isset($params['robot_code']) ? $params['robot_code'] : null;
        
        // Get robot
        $id = $this->_robot_controller->normalizeId('cryptos_robot-'.$user_code.'-'.$robot_code);
        $robot = $this->_robot_controller->get($id)['data'];
        if (empty($robot))
        {
            return helpers::resStruct(false, "The robot with id: $id, doesn't exist");
        }
        
        if (!$this->_robot_controller->isRunning($robot))
        {
            return helpers::resStruct(false, "The robot is not running");
        }
        
        $last_operation = $this->_robot_controller->getLastOperation($robot);
        if ($last_operation === 'buy')
        {
            return helpers::resStruct(false, "The last operation was 'buy'");
        }
        
        // Buy !!
        $robot['manual_operation'] = 'buy';
        $this->_robot_controller->model->save($id, $robot);
        
        // Force to refresh users (in robot process)
        $user_controller = new robotUser();
        $user_controller->setForceRefreshUsers(true);
        
        $title = "Buy now";
        $msg = "Fantàstic! Acabes de comprar. L'operació es realitzarà com a màxim en 1 minut. Tingui paciència.";
        
        return helpers::resStruct(true, "", array(
            'title' => $title,
            'msg' => $msg
        ));
    }
    
    public function sell($params)
    {
        $user_code = isset($params['user_code']) ? $params['user_code'] : null;
        $robot_code = isset($params['robot_code']) ? $params['robot_code'] : null;
        $action = isset($params['action']) ? $params['action'] : 'sell';
        
        // Get robot
        $id = $this->_robot_controller->normalizeId('cryptos_robot-'.$user_code.'-'.$robot_code);
        $robot = $this->_robot_controller->get($id)['data'];
        if (empty($robot))
        {
            return helpers::resStruct(false, "The robot with id: $id, doesn't exist");
        }
        
        if (!$this->_robot_controller->isRunning($robot))
        {
            return helpers::resStruct(false, "The robot is not running");
        }
        
        $last_operation = $this->_robot_controller->getLastOperation($robot);
        if ($last_operation === 'sell')
        {
            return helpers::resStruct(false, "The last operation was 'sell'");
        }

        // Sell !!
        $robot['manual_operation'] = $action;
        $this->_robot_controller->model->save($id, $robot);
        
        // Force to refresh users (in robot process)
        $user_controller = new robotUser();
        $user_controller->setForceRefreshUsers(true);
        
        if ($action === 'sell')
        {
            $title = "Sell now";
            $msg = "Fantàstic! Acabes de vendre!. L'operació es realitzarà com a màxim en 1 minut. Tingui paciència.";          
        }
        elseif ($action === 'sellAndStop')
        {
            $title = "Sell now & stop robot";
            $msg = "Fantàstic! Acabes de vendre!. L'operació es realitzarà com a màxim en 1 minut. Tingui paciència. Tot seguit, el robot s'aturarà";          
        }
        else
        {
            $title = "Sell calmly & stop robot";
            $msg = "El robot s'aturarà quan es realitzi la següent venda automàtica";
        }
        
        return helpers::resStruct(true, "", array(
            'title' => $title,
            'msg' => $msg
        ));
    }
    
    public function sellAndStop($params)
    {
        $params['action'] = 'sellAndStop';
        return $this->sell($params);
    }
    
    public function sellCalmlyAndStop($params)
    {
        $params['action'] = 'sellCalmlyAndStop';
        return $this->sell($params);
    }
    
    public function getHistory($params)
    {
        $user_code = isset($params['user_code']) ? $params['user_code'] : null;
        $robot_code = isset($params['robot_code']) ? $params['robot_code'] : null;
        $is_realtime = ($params['is_realtime'] == 'true');
        $period = $params['period'];
        $start_date = $params['start_date'];
                        
        // Set dates
        $this->_setDates($is_realtime, $period, $start_date);
        
        // Get history
        $history = $this->_transaction_controller->getTransactions($user_code, $robot_code, $this->_start_date, $this->_end_date, "DESC");
        if (empty($history))
        {
            return helpers::resStruct(true);
        }
        
        $data = array();
        
        foreach ($history as $transaction)
        {
            $profit = $transaction['profit'];
            $profit_usdt = $transaction['profit_usdt'];
            if ($transaction['operation'] === 'buy')
            {
                $profit = "";
                $profit_usdt = "";
            }
            
            $transaction['profit'] = $profit;
            $transaction['profit_usdt'] = $profit_usdt;
            
            $data[] = $transaction;
        }

        return helpers::resStruct(true, "", $data);
    }
    
}
