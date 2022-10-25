<?php

namespace modules\cryptos\controller;

// Controllers
use base\core\controller\helpers;
use modules\cryptos\controller\reportTransaction;

/**
 * reportFiatProfit controller
 *
 * @author Dani Gilabert
 */
class reportFiatProfit extends reportTransaction
{
    
    public function getFiltered($params)
    {
        $start_date = (isset($params['start_date']) && !empty($params['start_date']))? $params['start_date'] : null;
        $end_date = (isset($params['end_date']) && !empty($params['end_date']))? $params['end_date'] : null;
        $is_training = (isset($params['is_training']) && ($params['is_training'] == 'on' || $params['is_training'] == 'true'));
        $user_code_param = (isset($params['user_code']) && !empty($params['user_code'])) ? $params['user_code'] : $this->token->getUserCode();
        
        if (!is_null($start_date) && is_null($end_date))
        {
            $end_date = "2999-31-12";
        }
        if (is_null($start_date) && !is_null($end_date))
        {
            $start_date = "1970-01-01";
        }        
        
        // Get FIAT Floating transactions
        $params['start_date'] = $start_date;
        $params['end_date'] = $end_date;
        $params['is_training'] = $is_training;
        $params['user_code'] = $user_code_param;
        $fiat_transactions = parent::getFiltered($params)['data'];
        if (empty($fiat_transactions))
        {
            return helpers::resStruct(true);
        }

        // Loop each transaction
        $data = array();
        foreach ($fiat_transactions as $transaction)
        {
            if ($transaction['is_old'])
            {
                continue;
            }
            
            // Add item
            $data[] = $transaction;  
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    protected function _getTransactions($user_code, $robot_code, $start_date, $end_date, $order = 'ASC')
    {
        return $this->getTransactionsConverted2Fiat($user_code, $robot_code, $start_date, $end_date, true);
    }
    
}
