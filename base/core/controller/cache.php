<?php

namespace base\core\controller;

use base\core\controller\shapc;

/*
 * Generic class to manage cache system
 */

/**
 * Generic class to manage cache system
 *
 * @author Default user
 */
class cache {
    
    public function get($id)
    {
        if (!shapc::exists($id))
        {
            return null;
        }
        
        return shapc::fetch($id);
    }
    
    public function exists($id)
    {
        return shapc::exists($id);
    }
    
    public function set($id, $data)
    {
        return shapc::store($id, $data);
    }
    
    public function delete($id)
    {
        return shapc::delete($id);
    }
    
    public function indexData($data)
    {
        $ret = array();
        foreach ($data as $values)
        {
            $ret[$values['_id']] = $values;
        }  
        return $ret;
    }
    
    public function deIndexData($data)
    {
        $ret = array();
        foreach ($data as $values)
        {
            $ret[] = $values;
        }
        return $ret;
    }
    
    public function updateItem($cache_id, $item_id, $item_data)
    {
        $cached_data = $this->get($cache_id);
        if (!isset($cached_data))
        {
            return false;
        }
        
        /*$old_item = $cached_data[$item_id];
        if (!isset($cached_data[$item_id]))
        {
            $test = true;
        }*/
        
        $cached_data[$item_id] = $item_data;
        
        $ret_set = $this->set($cache_id, $cached_data);
        
        return $ret_set;
    }
    
    public function deleteItem($cache_id, $item_id)
    {
        $cached_data = $this->get($cache_id);
        if (!isset($cached_data))
        {
            return false;
        }
        
        unset($cached_data[$item_id]);
        
        $ret_set = $this->set($cache_id, $cached_data);
        
        return $ret_set;
    }    
}
