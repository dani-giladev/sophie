<?php

namespace base\core\controller;

use base\core\controller\cache;
use base\core\controller\token;
use base\core\model\config as configModel;

/**
 * Generic management of config files
 *
 * @author Default user
 * @author Dani Gilabert
 */

class config
{
    public $base;
    public $mod;
    
    protected $_cache;
    protected $_module;

    public function __construct($module = null)
    {
        $this->_cache = new cache();
        $this->_module = $module;
        
        // Load base config params
        $this->_loadConfig();
                
        if (!is_null($module) && $module !== 'base')
        {
            // Load modules config params
            $this->_loadConfig($module);
        }
    }
    
    /*
     * 
     * PRIVATE/PROTECTED METHODS
     * 
     */
    
    private function _loadConfig($module = null)
    {
        if (is_null($module) || $module === 'base')
        {
            $prop =  "base";
            $module = "base";
            $config_path =  __DIR__."/../../config.php";
        }
        else
        {
            $prop =  "mod";
            $config_path = __DIR__."/../../../modules/".$module."/config.php";
        }
        
        if (file_exists($config_path))
        {
            require($config_path);
            $this->$prop = (object) $config;
        }
        
        // Load params
        $this->_loadDBPARAMS($module);
    }
    
    private function _loadDBPARAMS($module = null)
    {
        if (is_null($module) || $module === 'base')
        {
            $prop =  "base";
            $module = "base";
        }
        else
        {
            $prop =  "mod";
        }
        
        $dbparams = array();
        if (isset($this->$prop->DBPARAMS))
        {
            $update_db = false;
            $update_cache = false;
        
            // Getting from cache
            $config_values = $this->_cache->get("sophie-dbparams-".$module);
            if (!isset($config_values))
            {
                // Getting from database
                //echo "Getting config from database. Module: $module".PHP_EOL;
                $config = $this->getConfig($module);
                $config_values = (isset($config))? $config['values'] : array();
                $update_cache = true;
            }
            
            // Check if all params (in db or cache) are valids?
            foreach ($config_values as $key => $values)
            {
                if (!isset($this->$prop->DBPARAMS[$key]))
                {
                    $update_db = true;
                    break;
                }
            }
            
            // Building params
            foreach ($this->$prop->DBPARAMS as $key => $values)
            {
                if (isset($config_values[$key]) && isset($config_values[$key]['value']))
                {
                    $dbparams[$key] = $config_values[$key];
                }
                else
                {
                    $values['value'] = $values['default_value'];
                    $dbparams[$key] = $values;
                    $update_db = true;
                }
            }
            
            if ($update_db)
            {
                $this->saveConfig($module, $dbparams, "system", "system");
            }
            
            if ($update_cache && !$update_db)
            {
                $this->_cache->set("sophie-dbparams-".$module, $dbparams);
            }
        }
        
        $this->$prop->DBPARAMS = $dbparams;
    }
    
    private function _getDBPARAM($key, $module)
    {
        $prop = (is_null($module) || $module === 'base')? "base" : "mod";
        
        if (!isset($this->$prop->DBPARAMS[$key]) || !isset($this->$prop->DBPARAMS[$key]['value']))
        {
            return null;
        }
        
        return $this->$prop->DBPARAMS[$key]['value'];
    }
    
    /*
     * 
     * PUBLIC METHODS
     * 
     */
    
    public function getBaseDBPARAM($key)
    {
        return $this->_getDBPARAM($key, "base");
    }
    
    public function getDBPARAM($key)
    {
        return $this->_getDBPARAM($key, $this->_module);
    }
    
    public function getConfig($module)
    {
        $configModel = new configModel();
        $id = "config-".$module;
        if (!$configModel->exist($id))
        {
            return null;
        }
        return $configModel->get($id)['data'];
    }
    
    public function saveConfig($module, $dbparams, $usercode = null, $username = null)
    {
        $configModel = new configModel();
        $id = "config-".$module;
        if ($configModel->exist($id))
        {
            $doc = $configModel->get($id)['data'];
        }
        else
        {
            $doc = array();
        }

        $doc['module'] = $module;
        $doc['values'] = $dbparams;
        
        // User
        $token_obj = new token();
        $userC = (is_null($usercode)) ? $token_obj->getUserCode() : $usercode;
        $userN = (is_null($username)) ? $token_obj->getUserName() : $username;
        $doc['modified_by_user'] = $userC;
        $doc['modified_by_user_name'] = $userN;
        $doc['last_modification_date'] = date("Y-m-d H:i");

        // Save to db
        $configModel->save($id, $doc);
        
        // Update cache
        $this->_cache->set("sophie-dbparams-".$module, $dbparams);        
    }
}
