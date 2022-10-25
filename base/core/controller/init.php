<?php

namespace base\core\controller;

/**
 * Management of init file
 *
 * @author Dani Gilabert
 */

class init
{
    public $config;
    
    public function __construct()
    {
        $init_path = __DIR__."/../../../init.php";
        include($init_path);
        $this->config = (object) $config;
    }
    
    public function getDatabases()
    {
        return $this->config->DATABASES;
    }
    
    public function getDatabase($db)
    {
        return $this->getDatabases()[$db];
    }
    
    public function getWebservices()
    {
        return $this->config->WEBSERVICES;
    }
    
    public function getWebservice($ws)
    {
        return $this->getWebservices()[$ws];
    }

    public function getDefuseCryptPassword()
    {
        return $this->config->DEFUSE_CRYPT_PASSWORD;
    }
    
}
