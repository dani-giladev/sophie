<?php

namespace base\core\controller;

/**
 * Just a wrapper to make apc calls
 *
 * @author Default user
 */
class shapc {
    
    public static function exists($data)
    {
        return \apcu_exists($data);
    }
    
    public static function fetch($data)
    {
        return \apcu_fetch($data);
    }
    
    public static function store($id, $data)
    {
        return \apcu_store($id, $data);
    }
    
    public static function delete($data)
    {
        return \apcu_delete($data);
    }
}
