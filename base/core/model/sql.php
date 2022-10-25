<?php

namespace base\core\model;

use base\core\controller\init;
use base\core\controller\config;
//use base\core\controller\helpers;

/**
 *
 * @author Dani Gilabert
 * 
 */

class sql
{
    private $_db;
    private $_database;
    private $_conn;
    private $_config;
   
    public function __construct($db) {
        
        $this->_db = $db;
        $init_controller = new init();
        $this->_database = $init_controller->getDatabase($this->_db);
        
        $driver = $this->_database['driver'];
        $host = $this->_database['host'];
        $port = $this->_database['port'];
        $user = $this->_database['user'];
        $password = $this->_database['password'];
        $dbname = $this->_database['dbname'];
        $ssl = $this->_database['ssl'];    
        
        $this->_config = new config();
        $adobb_path = $this->_config->getBaseDBPARAM("ADODB_PATH");
        require_once($adobb_path.'/adodb-exceptions.inc.php');
        require_once($adobb_path.'/adodb.inc.php');

        try 
        {
            //if (helpers::isPHP7() && $driver == 'mssql')
            //{
            $this->_conn = NewADOConnection("pdo");
            $conn = $this->_conn->Connect("dblib:host=$host:$port;dbname=$dbname", $user, $password);
            /*}
            else
            {
                $this->_conn = NewADOConnection($connParams['type']);
                $conn = $this->_conn->Connect($host, $user, $password, $dbname);
            }*/

            if ($conn === false)
            {
                return false;
            }
        } 
        catch (\Exception $e) 
        {
            return $e->getMessage();
        }              

        $this->_conn->SetFetchMode("ADODB_FETCH_ASSOC");

        if ($driver == 'mysql')
        {
            $this->_conn->Execute("SET NAMES UTF8");
        }
        
        return true;
    }
    
    public function execute($sql) 
    {
        return $this->_conn->execute($sql);
    }
    
    public function isDevelopment()
    {
        return ($this->_config->getBaseDBPARAM("DEVEL"));
    }
    
}
