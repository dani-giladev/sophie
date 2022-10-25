<?php

namespace modules\cryptos\controller;

// Controllers
use base\core\controller\helpers;
use modules\cryptos\controller\reportTransaction;
use modules\cryptos\controller\marketCoin;
use modules\cryptos\controller\binance;

/**
 * FIAT Floating controller
 *
 * @author Dani Gilabert
 */
class fiatFloating extends reportTransaction
{
    
    public function getFiltered($params)
    {
        $start_date = (isset($params['start_date']) && !empty($params['start_date']))? $params['start_date'] : null;
        $end_date = (isset($params['end_date']) && !empty($params['end_date']))? $params['end_date'] : null;
        $is_training = (isset($params['is_training']) && ($params['is_training'] == 'on' || $params['is_training'] == 'true'));
        $user_code_param = (isset($params['user_code']) && !empty($params['user_code'])) ? $params['user_code'] : $this->token->getUserCode();
        $prices = isset($params['prices'])? json_decode($params['prices'], true) : null;
        
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
        $fiat_floating_transactions = parent::getFiltered($params)['data'];
        if (empty($fiat_floating_transactions))
        {
            return helpers::resStruct(true);
        }
        
        // Get market coins
        $market_coins = $this->_getMarketCoins($user_code_param);
        
        // Get real prices
        if (is_null($prices))
        {
            $prices = $this->_robot_controller->getPrices($user_code_param);
            if ($prices === false)
            {
                return helpers::resStruct(false, "Error getting Binance api");
            }            
        }

        // Loop each transaction
        $data = array();
        foreach ($fiat_floating_transactions as $transaction)
        {
            // If market coin is FIAT, then this transaction is not FIAT floating
            if ($this->_fiatcoin_controller->isFiat($transaction['market_coin']))
            {
                continue;
            }
            
            $this->_updateTransactionWithFiatProfits($transaction, $market_coins, $prices);
            
            // Add item
            $data[] = $transaction;  
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    private function _getMarketCoins($user_code)
    {
        $market_coin_controller = new marketCoin();
        $raw_market_coins = $market_coin_controller->getFiltered(array(
            'user_code' => $user_code
        ))['data'];
        
        $market_coins = array();
        foreach ($raw_market_coins as $market_coin) {
            $market_coins[$market_coin['code']] = $market_coin;
        }
        
        return $market_coins;
    }
    
    private function _getSymbols()
    {
        $symbol_controller = new symbol();
        $raw_symbols = $symbol_controller->getAll()['data'];
        
        $symbols = array();
        foreach ($raw_symbols as $symbol) {
            $symbols[$symbol['code']] = $symbol;
        }
        
        return $symbols;
    }
    
    private function _updateTransactionWithFiatProfits(&$transaction, $market_coins, $prices)
    {
        $market_coin = $transaction['market_coin'];
        $amount = (float) $transaction['amount'];
        $total_profit = $transaction['total_profit'];
        $commission_perc = isset($transaction['commission_perc'])? $transaction['commission_perc'] : 0.075;
        $commission_coin = $transaction['commission_coin'];
        $last_transaction_id = $transaction['last_transaction_id'];
        $buying_price = 0;

        // Get buying transaction
        $buying_transaction = $this->get($last_transaction_id)['data'];
        if (!empty($buying_transaction))
        {
            $buying_price = $buying_transaction['price'];
        }
            
        // Totals
        $investment = ($amount * $buying_price);

        // FIAT profit Now! (if you sell now!)
        $fiat_profit_ret = $this->getFiatProfit($market_coin, $investment, $total_profit, $market_coins, $prices, $commission_perc, $commission_coin);

        // Set calculated fields
        $transaction['buying_price'] = $buying_price;
        $transaction['buying_transaction'] = $buying_transaction;
        $transaction['fiat_net_profit'] = $fiat_profit_ret['fiat_net_profit'];
        $transaction['fiat_net_profit_perc'] = $fiat_profit_ret['fiat_net_profit_perc'];
        $transaction['fiat_coin'] = $fiat_profit_ret['fiat_coin'];
        $transaction['fiat_buying_price'] = $fiat_profit_ret['fiat_buying_price'];
        $transaction['fiat_current_price'] = $fiat_profit_ret['fiat_current_price'];
        $transaction['mkc_total_amount'] = $fiat_profit_ret['mkc_total_amount'];
        $transaction['fiat_commission_perc'] = $fiat_profit_ret['fiat_commission_perc'];
        $transaction['fiat_commission'] = $fiat_profit_ret['fiat_commission'];
        $transaction['fiat_commission_coin'] = $fiat_profit_ret['fiat_commission_coin'];
        $transaction['fiat_commission_usdt'] = $fiat_profit_ret['fiat_commission_usdt'];
        $transaction['fiat_commission_market'] = $fiat_profit_ret['fiat_commission_market'];
    }
    
    protected function _getTransactions($user_code, $robot_code, $start_date, $end_date, $order = 'ASC')
    {
        return $this->getTransactionsConverted2Fiat($user_code, $robot_code, $start_date, $end_date, false);
    }
    
    public function convert2Fiat($params)
    {
        if (!isset($params['data']))
        {
            return helpers::resStruct(false, "Fuck you!");
        }
        
        $user_code = (isset($params['user_code']))? $params['user_code'] : $this->token->getUserCode();
        $data = json_decode($params['data'], true);
        $first_transacction = $data[0];
        $is_training = (isset($first_transacction['is_training']) && ($first_transacction['is_training'] === 'on'|| $first_transacction['is_training'] === 'true'));
        $msg_errors = '';
        
        if ($is_training)
        {
            // Set training db
            $this->model->setDB('cryptos-training');
        }
        
        // Get api and real prices
        $binance_controller = new binance();       
        $api = $binance_controller->getApi($user_code);
        if ($api === false)
        {
            return helpers::resStruct(false, "Error getting Binance api");
        }
        $prices = $api->prices();

        // Get market coins
        $market_coins = $this->_getMarketCoins($user_code);
        
        // Get symbols
        $symbols_by_code = $this->_getSymbols();
        
        // Get available transactions and sort by coinpair to convert
        $available_transactions = array();
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
            
            if ($doc['operation'] !== 'sell')
            {
                if (!empty($msg_errors)) $msg_errors .= '</br>';
                $msg_errors .= "Operation must be 'sell' ($transaction_id)";
                continue;
            }
            
            if ($doc['converted_to_fiat'] === true)
            {
                if (!empty($msg_errors)) $msg_errors .= '</br>';
                $msg_errors .= "It's already converted to FIAT ($transaction_id)";
                continue;
            }
            
            // Update transaction
            $transaction = $doc;
            $this->_updateTransactionWithFiatProfits($transaction, $market_coins, $prices);
            
            $market_coin = $transaction['market_coin'];
            $coinpair_to_convert = $market_coin.$transaction['fiat_coin'];
            if (!isset($symbols_by_code[$coinpair_to_convert]))
            {
                if (!empty($msg_errors)) $msg_errors .= '</br>';
                $msg_errors .= "Symbol $coinpair_to_convert does not exist ($transaction_id)";
                continue;
            }
            $symbol = $symbols_by_code[$coinpair_to_convert];
            
            // Set auxiliar props.
            $transaction['coinpair_to_convert'] = $coinpair_to_convert;
            $transaction['amount_decimals'] = $symbol['decimals'];
            $amount_to_convert = $transaction['total_profit']; // Amount to convert (mkc)
            $amount_to_convert_fiat = $transaction['fiat_net_profit']; // Amount to convert (FIAT)
            $transaction['doc'] = $doc;
            
            if (!isset($available_transactions[$coinpair_to_convert]))
            {
                $available_transactions[$coinpair_to_convert] = array(
                    'amount_to_convert' => 0,
                    'amount_to_convert_fiat' => 0,
                    'coin' => $market_coin,
                    'market_coin' => $transaction['fiat_coin'],
                    'amount_decimals' => $transaction['amount_decimals'],
                    'transactions' => array(),
                );                
            }
            $available_transactions[$coinpair_to_convert]['amount_to_convert'] += $amount_to_convert;
            $available_transactions[$coinpair_to_convert]['amount_to_convert_fiat'] += $amount_to_convert_fiat;
            $available_transactions[$coinpair_to_convert]['transactions'][] = $transaction;
        }
        
        foreach ($available_transactions as $coinpair_to_convert => $available_transactions_values)
        {
            $coin = $available_transactions_values['coin'];
            $market_coin = $available_transactions_values['market_coin'];
            $amount_decimals = $available_transactions_values['amount_decimals'];
            $symbol = $symbols_by_code[$coinpair_to_convert];
            $min_notional = $symbol['min_notional'];            
            $amount_to_convert = $available_transactions_values['amount_to_convert'];
            $amount_to_convert_fiat = $available_transactions_values['amount_to_convert_fiat'];
            
            if ($amount_to_convert_fiat < $min_notional)
            {
                if (!empty($msg_errors)) $msg_errors .= '</br>';
                $msg_errors .= "MIN_NOTIONAL is not enough in $coinpair_to_convert transactions ($amount_to_convert_fiat < $min_notional)";
                continue;
            }
        
            // Calculate final amount
            $final_amount = $this->_robot_controller->getAmount(array(
                'amount' => $amount_to_convert,
                'amount_unit' => 'coin',
                'coin' => $coin,
                'market_coin' => $market_coin,
                'amount_decimals' => $amount_decimals
            ), $prices);    
            
            // Launch order
            ob_start();
            $order = $binance_controller->sell($api, $coinpair_to_convert, $final_amount);
            ob_end_clean();
            
            if (!isset($order['orderId']))
            {
                if (!empty($msg_errors)) $msg_errors .= '</br>';
                $msg = $order['code']." ".$order['msg'];
                $msg_errors .= "Error executing order to Binance. Error: ".$msg." in $coinpair_to_convert transactions";
                continue;
            }
//            $order = array(); // Test
            
            // Update transactions
            $transactions = $available_transactions_values['transactions'];
            foreach ($transactions as $transaction)
            {
                $transaction_id = $transaction['_id'];
                $mkc = $transaction['market_coin'];
                $doc = $transaction['doc'];
            
                // Calculate final amount
                $total_profit = $transaction['total_profit']; // Theorical amount to convert into FIAT
                $final_amount = $this->_robot_controller->getAmount(array(
                    'amount' => $total_profit,
                    'amount_unit' => 'coin',
                    'coin' => $mkc,
                    'market_coin' => $transaction['fiat_coin'],
                    'amount_decimals' => $transaction['amount_decimals']
                ), $prices); 

                // FIAT Profits properties
                $doc['buying_price'] = $transaction['buying_price'];
                $doc['fiat_buying_price'] = $transaction['fiat_buying_price'];
                $doc['fiat_current_price'] = $transaction['fiat_current_price'];
                $doc['converted_to_fiat'] = true;
                $doc['fiat_date'] = date("Y-m-d");
                $doc['fiat_time'] = date("H:i:s");
                $doc['fiat_date_time'] = date("Y-m-d H:i:s");
                $doc['fiat_order'] = $order;
                $doc['fiat_amount'] = $final_amount;
                $doc['fiat_net_profit'] = $transaction['fiat_net_profit'];
                $doc['fiat_net_profit_perc'] = $transaction['fiat_net_profit_perc'];
                $doc['fiat_coin'] = $transaction['fiat_coin'];
                $doc['fiat_commission_perc'] = $transaction['fiat_commission_perc'];
                $doc['fiat_commission'] = $transaction['fiat_commission'];
                $doc['fiat_commission_coin'] = $transaction['fiat_commission_coin'];
                $doc['fiat_commission_usdt'] = $transaction['fiat_commission_usdt'];
                $doc['fiat_commission_market'] = $transaction['fiat_commission_market'];

                // Save
                $ret_save = $this->model->save($transaction_id, $doc);  
                if (!$ret_save['success'])
                {
                    if (!empty($msg_errors)) $msg_errors .= '</br>';
                    $msg_errors .= "Error saving transaction ($transaction_id)";
                    continue;
                }                 
            }
        }
        
        $success = (empty($msg_errors));
        return helpers::resStruct($success, $msg_errors);
    }
    
    public function delete($id)
    {
        $id = $this->normalizeId($id);
        
        $doc = $this->model->get($id)['data'];
        if (empty($doc))
        {
            return helpers::resStruct(false, "The doc with id $id doesn't exist");
        }
        
        if (!isset($doc['last_transaction_id']) || empty($doc['last_transaction_id']))
        {
            return helpers::resStruct(false, "The transaction with id $id doesn't set the 'last transaction' property assigned");
        }
        
        $last_transaction_id = $doc['last_transaction_id'];
        
        $ret_last_t = $this->model->delete($last_transaction_id);
        if (!$ret_last_t['success'])
        {
            return helpers::resStruct(false, "The last transaction with id $last_transaction_id has not been removed");
        }
        return $this->model->delete($id);
    }

}
