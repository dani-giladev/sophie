<?php

namespace modules\cryptos\controller;

use base\core\controller\controller;
use base\core\controller\helpers;
use modules\cryptos\controller\robot;

/**
 * marketCoin controller
 *
 * @author Dani Gilabert
 */
class marketCoin extends controller
{
    private $_default_market_coins = array(
        "BTC" => array(
            "code" => "BTC",
            "name" => "Bitcoin"
        ),
        "ETH" => array(
            "code" => "ETH",
            "name" => "Ethereum"
        ),
        "BNB" => array(
            "code" => "BNB",
            "name" => "Binance Coin"
        ),
        "USDT" => array(
            "code" => "USDT",
            "name" => "Tether"
        ),
        "XRP" => array(
            "code" => "XRP",
            "name" => "Ripple"
        )
    );
    
    public function getAll()
    {
        $view = $this->model->getView("marketCoin");
        $data = $view->exec();
        return $data;
    }
    
    public function getFiltered($params) 
    {
        $user_code = isset($params['user_code']) ? $params['user_code'] : $this->token->getUserCode();
        $get_free_balance_usdt = (isset($params['get_free_balance_usdt']) && ($params['get_free_balance_usdt'] == 'on' || $params['get_free_balance_usdt'] == true));
        $exclude_market_coins = array();
        
        $raw_data = $this->getAll()['data'];
        if (empty($raw_data))
        {
            // Check defaults market coins
            $this->_addDefaultMarketCoins($user_code, $exclude_market_coins);
            return helpers::resStruct(true);
        }
    
        // Get real prices
        if ($get_free_balance_usdt)
        {
            $robot_controller = new robot();
            $prices = $robot_controller->getPrices($user_code);
        }
            
        $data = array();
        foreach($raw_data as $item)
        {
            array_push($exclude_market_coins, $item['code']);
            
            if (isset($user_code) && isset($item['created_by_user']) && $user_code !== $item['created_by_user'] && $user_code !== 'allusers')
            {
                continue;
            }
            
            // Add 'free_balance_usdt'
            $free_balance_usdt = '';
            if ($get_free_balance_usdt && $prices !== false)
            {
                if ($item['code'] === "USDT")
                {
                    $free_balance_usdt = $item['free_balance'];
                }
                else
                {
                    $price_key = strtoupper($item['code'])."USDT";
                    if (isset($prices[$price_key]))
                    {
                        $free_balance_usdt = $prices[$price_key] * $item['free_balance'];
                    }                    
                }
            }
            $item['free_balance_usdt'] = (float) $free_balance_usdt;
                    
            // Clean item
            $this->model->clean($item);

            // Add item
            $data[] = $item; 
        }
        
        // Check defaults market coins
        $this->_addDefaultMarketCoins($user_code, $exclude_market_coins);
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function getDefaultMarketCoins()
    {
        return $this->_default_market_coins;
    }
    
    private function _addDefaultMarketCoins($user_code, $exclude_market_coins)
    {
        foreach ($this->_default_market_coins as $code => $values)
        {
            if (in_array($code, $exclude_market_coins))
            {
                continue;
            }
            
            $name = $values['name'];
            
            $ret = $this->save(array(
                "code" => $code,
                "name" => $name,
                "user_code" => $user_code
            ));
        }
    }
    
    public function save($params)
    {
        // Main
        $t = microtime(true);
        $micro = sprintf("%06d",($t - floor($t)) * 1000000);
        $code = (isset($params['code']))? $params['code'] : $code = date("YmdHjs").$micro;
        $name = (isset($params['name']))? $params['name'] : "";
        // Initial buying
        $buying_amount = (isset($params['buying_amount']))? $params['buying_amount'] : "";
        $buying_fiat_coin = (isset($params['buying_fiat_coin']))? $params['buying_fiat_coin'] : "";
        $buying_price = (isset($params['buying_price']))? $params['buying_price'] : "";
        $buying_date = (isset($params['buying_date']))? $params['buying_date'] : "";
        // Properties
        $reserve = (isset($params['reserve']))? $params['reserve'] : "";
        $notes = (isset($params['notes']))? $params['notes'] : "";
        // Users
        $user_code = isset($params['user_code']) ? $params['user_code'] : $this->token->getUserCode();
        $user_name = isset($params['user_name']) ? $params['user_name'] : $this->token->getUserName();

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
            $user_code = $this->token->getUserCode();
            $id = strtolower('cryptos_marketcoin-'.$user_code.'-'.$code);
            if ($this->model->exist($id))
            {
                return helpers::resStruct(
                        false, 
                        $this->trans->mod->marketCoin['the_marketcoin_with_code']." '<b>".$code."</b>' ".$this->trans->mod->common['already_exists'], 
                        null);
            }
            
            $doc = array();
            $doc['code'] = $code;
            // Creation
            $doc['created_by_user'] = $user_code;
            $doc['created_by_user_name'] = $user_name;
            $doc['creation_date'] = date("Y-m-d H:i"); 
        }
        
        // Main
        $doc['name'] = $name;
        
        // Initial buying
        $doc['buying_amount'] = $buying_amount;
        $doc['buying_fiat_coin'] = $buying_fiat_coin;
        $doc['buying_price'] = $buying_price;
        $doc['buying_date'] = $buying_date;
        
        // Properties
        $doc['reserve'] = $reserve;
        $doc['notes'] = $notes;
        
        // Last modification
        $doc['modified_by_user'] = $user_code;
        $doc['modified_by_user_name'] = $user_name;
        $doc['last_modification_date'] = date("Y-m-d H:i");
        
        // Save
        $this->model->save($id, $doc);
            
        return helpers::resStruct(true, "", array('id' => $id));
    }
}
