<?php

namespace modules\cryptos\controller;

use base\core\controller\controller;
use base\core\controller\helpers;

/**
 * robotGroup controller
 *
 * @author Dani Gilabert
 */
class robotGroup extends controller
{
    public function getAll()
    {
        $view = $this->model->getView("robotGroup");
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
            foreach($raw_data as $robot)
            {
                if (isset($user_code) && $user_code !== $robot['created_by_user'] && $user_code !== 'allusers')
                {
                    continue;
                }
                
                // Clean item
                $this->model->clean($robot);
                    
                // Add item
                $data[] = $robot; 
            }
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function save($params)
    {
        // Main
        $t = microtime(true);
        $micro = sprintf("%06d",($t - floor($t)) * 1000000);
        $code = (isset($params['code']))? $params['code'] : $code = date("YmdHjs").$micro;
        $name = (isset($params['name']))? $params['name'] : "";
        // Properties
        $market_coin = (isset($params['market_coin']))? $params['market_coin'] : "";
        $fund = (isset($params['fund']))? $params['fund'] : "";
        $max_buying_price = (isset($params['max_buying_price']))? $params['max_buying_price'] : "";
        $notes = (isset($params['notes']))? $params['notes'] : "";

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
            $id = strtolower('cryptos_robotgroup-'.$user_code.'-'.$code);
            if ($this->model->exist($id))
            {
                return helpers::resStruct(
                        false, 
                        $this->trans->mod->robotGroup['the_robotgroup_with_code']." '<b>".$code."</b>' ".$this->trans->mod->common['already_exists'], 
                        null);
            }
            
            $doc = array();
            $doc['code'] = $code;
            // Creation
            $doc['created_by_user'] = $this->token->getUserCode();
            $doc['created_by_user_name'] = $this->token->getUserName();
            $doc['creation_date'] = date("Y-m-d H:i"); 
        }
        
        // Main
        $doc['name'] = $name;
        
        // Properties
        $doc['market_coin'] = $market_coin;
        $doc['fund'] = $fund;
        $doc['max_buying_price'] = $max_buying_price;
        $doc['notes'] = $notes;
        
        // Last modification
        $doc['modified_by_user'] = $this->token->getUserCode();
        $doc['modified_by_user_name'] = $this->token->getUserName();
        $doc['last_modification_date'] = date("Y-m-d H:i");
        
        // Save
        $this->model->save($id, $doc);
            
        return helpers::resStruct(true, "", array('id' => $id));
    }
}
