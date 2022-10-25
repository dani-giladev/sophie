<?php

namespace modules\cryptos\controller;

use base\core\controller\controller;
use base\core\controller\helpers;
use modules\cryptos\controller\robot;
use modules\cryptos\controller\symbol;
use modules\cryptos\controller\binance;
use modules\cryptos\controller\transaction;

/**
 * manualTransaction controller
 *
 * @author Dani Gilabert
 */
class manualTransaction extends controller
{
    protected $_robot_controller;
    protected $_symbol_controller;
    
    public function __construct()
    {
        parent::__construct();
        $this->_robot_controller = new robot();
        $this->_symbol_controller = new symbol();
    }
    
    public function getAll()
    {
        $view = $this->model->getView("manualTransaction");
        $data = $view->exec();
        return $data;
    }
    
    public function getFiltered($params)
    {
        $user_code = isset($params['user_code']) ? $params['user_code'] : $this->token->getUserCode();
        
        $raw_data = $this->getAll()['data'];

        $data = array();
        if (!empty($raw_data))
        {
            foreach($raw_data as $item)
            {
                if (isset($user_code) && $user_code !== $item['created_by_user'])
                {
                    continue;
                }
              
                // Clean item
                $this->model->clean($item);
                    
                // Add item
                $data[] = $item; 
            }

        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function save($params)
    {
        if (!isset($params['amount']))
        {
            return helpers::resStruct(false, "Fuck you!");
        }
        
        // Main
        $t = microtime(true);
        $micro = sprintf("%06d",($t - floor($t)) * 1000000);
        $code = (isset($params['code']))? $params['code'] : $code = date("YmdHjs").$micro;
        // Coins
        $coinpair = (isset($params['coinpair']))? $params['coinpair'] : "?";
        // Trading
        $is_test = (isset($params['is_test']))? $params['is_test'] : false;
        $amount = (isset($params['amount']))? $params['amount'] : 0;
        $amount_unit = (isset($params['amount_unit']))? $params['amount_unit'] : 'coin';
        $commission_perc = (isset($params['commission']))? $params['commission'] : 0;
        $operation = (isset($params['operation']))? $params['operation'] : "";
        // Prices
        $commission_coin = (isset($params['commission_coin']))? $params['commission_coin'] : "";
        // Users
        $user_code = (isset($params['user_code']))? $params['user_code'] : $this->token->getUserCode();
        $user_name = (isset($params['user_name']))? $params['user_name'] : $this->token->getUserName();
    
        // Get real prices
        $prices = $this->_robot_controller->getPrices($user_code);
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

        if ((isset($params['id']) && !empty($params['id'])))
        {
            // Edit
            $is_new = false;
            $id = strtolower($params['id']);
            $doc = $this->model->get($id)['data'];
        }
        else
        {
            // New
            $is_new = true;
            $id = strtolower($this->model->type.'-'.$code);
            if ($this->model->exist($id))
            {
                return helpers::resStruct(
                        false, 
                        $this->trans->mod->manualTransaction['the_manualtransaction_with_code']." '<b>".$code."</b>' ".$this->trans->mod->common['already_exists'], 
                        null);
            }
            
            $doc = array();
            $doc['code'] = $code;
            // Creation
            $doc['created_by_user'] = $user_code;
            $doc['created_by_user_name'] = $user_name;
            $doc['creation_date'] = date("Y-m-d H:i:s"); 
        }
        
        // Coins
        $doc['coinpair'] = $coinpair;
        $doc['coinpair_name'] = $this->_symbol_controller->getCoinpairName($coinpair);
        $coin = $this->_symbol_controller->getCoin($coinpair);
        $doc['coin'] = $coin;
        $market_coin = $this->_symbol_controller->getMarketCoin($coinpair);
        $doc['market_coin'] = $market_coin;
        
        // Trading
        $doc['amount'] = $amount;
        $doc['amount_unit'] = $amount_unit;
        $doc['amount_decimals'] = (isset($symbol['decimals']))? $symbol['decimals'] : 0;
        $doc['commission'] = $commission_perc;
        $doc['operation'] = $operation;
        
        // Calculate final amount
        $final_amount = $this->_robot_controller->getAmount($doc, $prices);
        $doc['amount'] = $final_amount;
        
        // Prices
        $price =  $prices[$coinpair];
        $transaction_controller = new transaction();
        $price_usdt = $transaction_controller->getUSDTValue($price, $market_coin, $prices);
        $doc['price'] = $price;
        $doc['price_usdt'] = $price_usdt;
        
        // Commission
        $commission_ret = $transaction_controller->getCommission($coin, $market_coin, $final_amount, $commission_perc, $commission_coin, $prices);
        $doc['commission_value'] = (string) $commission_ret['commission'];
        $doc['commission_coin'] = $commission_coin;
        $doc['commission_usdt'] = (string) $commission_ret['commission_usdt'];
        $doc['commission_market'] = (string) $commission_ret['commission_market'];
        
        // Finally
        if ($is_test)
        {
            $order = array();
        }
        else
        {
            $binance_controller = new binance();
            $api = $binance_controller->getApi($user_code);

            ob_start();
            if ($operation === 'buy')
            {
                $order = $binance_controller->buy($api, $coinpair, $final_amount);
            }
            else
            {
                $order = $binance_controller->sell($api, $coinpair, $final_amount);
            }
            ob_end_clean();
            
            if (!isset($order['orderId']))
            {
                $msg = $order['code']." ".$order['msg'];
                return helpers::resStruct(false, "Error executing order to Binance. Error: ".$msg);
            }            
        }

        $doc['order'] = $order;
        
        // Save
        $this->model->save($id, $doc);
            
        return helpers::resStruct(true, "", array(
            'id' => $id,
            'doc' => $doc
        ));
    }
}
