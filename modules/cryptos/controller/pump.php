<?php

namespace modules\cryptos\controller;

use base\core\controller\controller;
use base\core\controller\helpers;
use modules\cryptos\controller\symbol;

/**
 * pump controller
 *
 * @author Dani Gilabert
 */
class pump extends controller
{
    protected $_symbol_controller;
    
    public function __construct()
    {
        parent::__construct();
        $this->_symbol_controller = new symbol();
    }
    
    public function getAll()
    {
        $view = $this->model->getView("pumps");
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
    
    public function getPendingPumps($user_code)
    {
        $view = $this->model->getView("pumpsByUserAndCompleted");
        $view->setKey(array($user_code, false));   
        return $view->exec()['data'];       
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
        $amount = (isset($params['amount']))? $params['amount'] : 0;
        $amount_unit = (isset($params['amount_unit']))? $params['amount_unit'] : 'coin';
        $amount_decimals = (isset($params['amount_decimals']))? $params['amount_decimals'] : '';
        $price_decimals = (isset($params['price_decimals']))? $params['price_decimals'] : '';
        $commission = (isset($params['commission']))? $params['commission'] : 0;
        $commission_coin = (isset($params['commission_coin']))? $params['commission_coin'] : "";
        // Buying
        $buying_price = (isset($params['buying_price']))? $params['buying_price'] : "";
        $buying_order = (isset($params['buying_order']))? $params['buying_order'] : array();
        // Users
        $user_code = (isset($params['user_code']))? $params['user_code'] : $this->token->getUserCode();
        $user_name = (isset($params['user_name']))? $params['user_name'] : $this->token->getUserName();
        // Additional
        $completed = (isset($params['completed']))? $params['completed'] : false;
        $log = (isset($params['log']))? $params['log'] : array();
        $last_modification_date = (isset($params['last_modification_date']))? $params['last_modification_date'] : "";
        // Selling
        $selling_number_of_stoploss_orders = (isset($params['selling_number_of_stoploss_orders']))? $params['selling_number_of_stoploss_orders'] : 0;
        $selling_orders = (isset($params['selling_orders']))? $params['selling_orders'] : array();
        $selling_last_order = (isset($params['selling_last_order']))? $params['selling_last_order'] : array();
        $selling_pending_amount = (isset($params['selling_pending_amount']))? $params['selling_pending_amount'] : "";
        $selling_price = (isset($params['selling_price']))? $params['selling_price'] : "";
        
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
                        $this->trans->mod->manualTransaction['the_pump_with_code']." '<b>".$code."</b>' ".$this->trans->mod->common['already_exists'], 
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
        $doc['amount_decimals'] = $amount_decimals;
        $doc['price_decimals'] = $price_decimals;
        $doc['commission'] = $commission;
        $doc['commission_coin'] = $commission_coin;
        
        // Buying
        $doc['buying_price'] = $buying_price;
        $doc['buying_order'] = $buying_order;
        $doc['buying_order_filled'] = "";
        $doc['buying_commission_value'] = "";
        $doc['buying_commission_market'] = "";
            
        // Selling
        $doc['selling_number_of_stoploss_orders'] = $selling_number_of_stoploss_orders;
        $doc['selling_orders'] = $selling_orders;
        $doc['selling_last_order'] = $selling_last_order;
        $doc['selling_pending_amount'] = $selling_pending_amount;
        $doc['selling_price'] = $selling_price;
        $doc['selling_commission_value'] = "";
        $doc['selling_commission_market'] = "";
        
        // Additional
        $doc['completed'] = $completed;
        $doc['log'] = $log;
        $doc['last_modification_date'] = $last_modification_date;
        
        // Save
        $this->model->save($id, $doc);
            
        return helpers::resStruct(true, "", array(
            'id' => $id,
            'doc' => $doc
        ));
    }    
    
    public function setComplete($params)
    {
        if (!isset($params['order_code']))
        {
            return helpers::resStruct(true, "Fuck you!");
        }
        
        // Get doc
        $code = $params['order_code'];
        $id = $this->normalizeId($this->model->type.'-'.$code);
        $doc = $this->get($id)['data'];
        
        // Save
        $doc['completed'] = true;   
        $this->model->save($id, $doc);
        
        return helpers::resStruct(true);
    }
    
}
