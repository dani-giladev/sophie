<?php

namespace base\core\controller\socket;

// Controllers
use base\core\controller\socket\socket;

/**
 * Network Communication client class
 *
 * @author Dani Gilabert
 * 
 */
class client extends socket
{
    
    public function connect()
    {
        $socket = null;
        
        if ($this->isConnected())
        {
            return true;
        }
        
        set_time_limit(0);

        if(($socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) === false)
        {        
            $msg = "socket_create() error: " . socket_strerror(socket_last_error());
            $msg .= ' (' . $this->_address . ' : ' . $this->_port . ')';
            return false;
        }
        
        usleep(50000);
        
        $result = socket_connect($socket, $this->_address, $this->_port);
        if ($result === false)
        {
            $msg = "socket_connect() error: (". $result . ") - " . socket_strerror(socket_last_error($socket));
            $msg .= ' (' . $this->_address . ' : ' . $this->_port . ')';
            return false;
        }

        $this->_socket = $socket;   
        
        return true;
        
    }
    
    public function isConnected()
    {
        if (!isset($this->_socket))
        {
            return false;
        }
        
        $errorcode = socket_last_error();
        $errormsg = socket_strerror($errorcode);
        if ($errorcode === 0 || $errorcode === 11)
        {
            return true;
        }
        
        return false;
    }

}
