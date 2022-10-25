<?php

namespace base\core\controller\socket;

// Controllers
use base\core\controller\socket\socket;

/**
 * Network Communication server class
 *
 * @author Dani Gilabert
 * 
 */
class server extends socket
{
    
    public function waitConnection()
    {
        $socket = null;
        set_time_limit(0);

        if(($socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) === false)
        {        
            $msg = "socket_create() error: " . socket_strerror(socket_last_error());
            return false;
        }

//        if (!socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1)) 
//        {
//            $msg = "socket_set_option() error: " . socket_strerror(socket_last_error());
//            $msg .= ' (' . $this->_address . ' : ' . $this->_port . ')';
//            return false;
//        }

        if(socket_bind($socket, $this->_address, $this->_port) === false)
        {
            $msg = "socket_bind() error: " . socket_strerror(socket_last_error($socket)) . " - Try the connection again in 1 minute aprox!!!";
            $msg .= ' (' . $this->_address . ' : ' . $this->_port . ')';
            socket_close($socket);   
            return false;
        }

        if (socket_listen($socket, 5) === false)
        {
            $msg = "socket_listen() error: " . socket_strerror(socket_last_error($socket));
            $msg .= ' (' . $this->_address . ' : ' . $this->_port . ')';
            socket_close($socket);
            return false;
        }       
        
       $this->_socket = socket_accept($socket);
        if ($this->_socket === false)
        {
            $msg = "socket_accept() error: " . socket_strerror(socket_last_error($socket));
            $msg .= ' (' . $this->_address . ' : ' . $this->_port . ')';
            socket_close($socket);
            return false;
        }
             
//        socket_close($socket);
        return $this->_socket;         
        
    }
    
    public function getIpAddressFromClient()
    {
        $addr = '';
        if (!is_null($this->_socket))
        {
            socket_getpeername($this->_socket, $addr);
        }
        return $addr;
    }

}
