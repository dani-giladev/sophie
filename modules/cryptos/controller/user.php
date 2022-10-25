<?php

namespace modules\cryptos\controller;

// Controllers
use base\core\controller\controller;
use base\core\controller\api;
use base\core\controller\helpers;

/**
 * cryptos user controller
 *
 * @author Dani Gilabert
 * 
 */
class user extends controller
{ 
    
    public function getAll()
    {
        $data = array();
        
        $plugin_id = "app_plugin-".$this->module;
        $plugin_data = api::ask("/admin/plugin/get/".$plugin_id)['data'];
        if (empty($plugin_data) || (isset($plugin_data['available']) && !$plugin_data['available']))
        {
            return helpers::resStruct(true, "", $data);
        }
                
        $raw_data = api::ask("/admin/user/getAll")['data'];
        if (empty($raw_data))
        {
            return helpers::resStruct(true, "", $data);
        }
            
        foreach($raw_data as $user)
        {
            if (!isset($user['granted_plugins']) || empty($user['granted_plugins']))
            {
                continue;
            }

            if (!in_array($plugin_id, $user['granted_plugins']))
            {
                continue;
            }

            // Add item
            $data[] = $user; 
        }     
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function save($params)
    {
        return api::ask("/admin/user/save", $params, "POST");
    }
    
    public function getUserByCode($user_code)
    {
        $id = $this->normalizeId($this->model->type.'-'.$user_code);
        $doc = $this->model->get($id)['data'];
        return $doc;
    }
    
}
