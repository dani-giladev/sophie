<?php

namespace modules\cryptos\robot;

// Controllers
use modules\cryptos\robot\common;
use modules\cryptos\controller\user as cryptosUser;
use modules\cryptos\controller\robotGroup;

/**
 *
 * @author Dani Gilabert
 * 
 */

class user extends common
{
    // Controllers
    private $_user_controller;
    private $_robot_group_controller;
    
    public function __construct()
    {
        parent::__construct();
        $this->_user_controller = new cryptosUser();
        $this->_robot_group_controller = new robotGroup();
    }
    
    public function getAvailableUsers($candlestick_interval, $current_available_users = array(), $api_is_required = false)
    {
        $user_docs_list = $this->_user_controller->getAll()['data'];
        if (empty($user_docs_list))
        {
            return array();
        }
        
        $users = array();
        foreach ($user_docs_list as $user_doc)
        {
            $user_code = $user_doc['code'];
            
            $user = $this->getUser($user_doc, $candlestick_interval, $current_available_users, $api_is_required);
            if (empty($user))
            {
                continue;
            }
            
            // Add or update user by code
            $users[$user_code] = $user;
        }
        
        return $users;
    }
    
    public function getUser($user_doc, $candlestick_interval, $current_available_users = array(), $api_is_required = false)
    {
        $user_code = $user_doc['code'];
        $is_new_user = (!isset($current_available_users[$user_code]));

        // Building user data
        $user = array();
        $user['userdata'] = $user_doc;

        // Get available robots by user
        $raw_robots = $this->_robot_controller->getFiltered(array(
            'user_code' => $user_code,
            'available' => true,
            'candlestick_interval' => $candlestick_interval
        ))['data'];
        if (empty($raw_robots))
        {
            return array();
        }
        
        // Get available symbols in order to set amount decimals
        $raw_symbols = $this->_symbol_controller->getFiltered(array(
            'available' => true
        ))['data'];
        $symbols = array();
        foreach ($raw_symbols as $symbol) {
            $symbols[$symbol['code']] = $symbol;
        }
        
        // Get robots groups in order to set fund
        $raw_robot_groups = $this->_robot_group_controller->getFiltered(array(
            'user_code' => $user_code
        ))['data'];
        $robot_groups = array();
        foreach ($raw_robot_groups as $robots_group) {
            $robot_groups[$robots_group['code']] = $robots_group;
        }
        
        // Set robots
        $robots = array();
        foreach ($raw_robots as $robot) {
            
            $this->_setPropertiesFromInheritRobot($robot);
            
            $robot_code = $robot['code'];
            $coinpair = $robot['coinpair'];
            $group = (isset($robot['group']))? $robot['group'] : null;
            
            // Set extra fields
            $robot['amount_decimals'] = (isset($symbols[$coinpair]))? $symbols[$coinpair]['decimals'] : 0;
            $robot['price_decimals'] = (isset($symbols[$coinpair]))? $symbols[$coinpair]['price_decimals'] : 0;
            $robot['fund'] = (!is_null($group) && isset($robot_groups[$group]) && !empty($robot_groups[$group]['fund']))? $robot_groups[$group]['fund'] : null;
            $robot['max_buying_price'] = (!is_null($group) && isset($robot_groups[$group]) && !empty($robot_groups[$group]['max_buying_price']))? $robot_groups[$group]['max_buying_price'] : null;
            $robot['commission'] = $user_doc['cryptos_commission'];
            $robot['commission_coin'] = $user_doc['cryptos_commission_coin'];
                    
            $robots[$robot_code] = $robot;
        }
        $user['robots'] = $robots;

        // Get Api data
        if ($is_new_user)
        {
            if ($api_is_required)
            {
                $api = $this->_binance_controller->getApi($user_code);
                if ($api === false)
                {
                    return array();
                }
                $user['api'] = $api;
            }
            else
            {
                $user['api'] = null;
            }
        }
        else
        {
            $user['api'] = $current_available_users[$user_code]['api'];
        }
        
        return $user;
    }
    
    public function getUserDoc($user_code)
    {
        $id = $this->_user_controller->normalizeId($this->_user_controller->model->type.'-'.$user_code);
        $doc = $this->_user_controller->model->get($id)['data'];
        return $doc;
    }
    
    private function _setPropertiesFromInheritRobot(&$robot)
    {
        if (!isset($robot['inherit_id']) || empty($robot['inherit_id']))
        {
            return;
        }
        
        $inherit_robot = $this->_robot_controller->get($robot['inherit_id'])['data'];
        if (empty($inherit_robot))
        {
            return;
        }
        
        foreach ($inherit_robot as $key => $value)
        {
            switch ($key) {
                case '_id':
                case '_rev':
                case 'code':
                case 'name':
                case 'group':
                case 'is_running':
                case 'is_training':
                case 'last_operation':
                case 'manual_operation':
                case 'amount':
                case 'amount_unit':
                case 'commission':
                case 'commission_coin':
                case 'last_modification_comesfrom_training':
                case 'last_training_code':
                case 'last_training_was_wild':
                case 'last_training_winner':
                case 'created_by_user':
                case 'created_by_user_name':
                case 'creation_date':
                case 'modified_by_user':
                case 'modified_by_user_name':
                case 'last_modification_date':
                    break;
                default:
                    $robot[$key] = $value;
                    break;
            }
        }
            
    }
    
    public function setForceRefreshUsers($value)
    {
        $filename = '/opt/tmp/robot-force-users';
        if ($value)
        {
            $myfile = fopen($filename, "w");
            fclose($myfile);            
        }
        else
        {
            $ret = unlink($filename);
        }
    }
    
    public function isTime2ForceRefreshUsers()
    {
        $filename = '/opt/tmp/robot-force-users';
        return file_exists($filename);
    }
    
}
