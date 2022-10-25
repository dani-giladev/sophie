<?php

namespace base\core\controller\socket;

/**
 * Network Communication class (by socket)
 *
 * @author Dani Gilabert
 * 
 */
class socket
{
    public $STX = '';
    public $ETX = '';
    public $CR = '';
    public $LF = '';
    
    protected $_address = "";
    protected $_port = 0;
    protected $_socket = null;
      
    
    public function __construct()
    {
        $this->STX = chr(2);
        $this->ETX = chr(3);
        $this->CR = chr(13);
        $this->LF = chr(10);
    }
    
    public function setIpAddress($address)
    {
        $this->_address = $address;
    }
    
    public function getIpAddress()
    {
        return $this->_address;
    }
    
    public function setPort($port)
    {
        $this->_port = $port;
    }
    
    public function getPort()
    {
        return $this->_port;
    }  
    
    public function closeConn()
    {
        socket_close($this->_socket);
    }
    
    public function sendData($data, $usleep_before = 0, $usleep_after = 0)
    {
        usleep($usleep_before);
        socket_write($this->_socket, $data, strlen($data));
        usleep($usleep_after);
    }
    
    public function sendACK()
    {
        $data = chr(6);
        socket_write($this->_socket, $data, strlen($data));
    }
    
    public function sendNACK()
    {
        $data = chr(21);
        socket_write($this->_socket, $data, strlen($data));
    }
    
    public function getData($length = 2048)
    {
        $buffer = '';
        
        $bytes = socket_recv($this->_socket, $buffer, $length, MSG_DONTWAIT);
        if ($bytes === false)
        {
            // no data available
            $error = socket_last_error($this->_socket);
            $msg = socket_strerror($error);
            if ($error !== 11 && $error !== 104)
            {
                socket_close($this->_socket);
                return false;                
            }
        }
        elseif ($bytes === 0)
        {
            // no data available          
        }
        else
        {
            $buffer = trim($buffer);
//            $len = strlen($buffer);
//            $char1 = ord(substr($buffer, $len-2, 1));
//            $char2 = ord(substr($buffer, $len-1, 1));
        }
        
        return $buffer;
    }
    
    public function encodeDataAscii($string)
    {
        $cod = '';
        $len = strlen($string);
        for ($i = 1; $i <= $len; $i++) {
            if ($i > 1) $cod .= '-';
            $cod .= ord(substr($string, $i-1, 1));
        }    
        return $cod;
    }
    
    public function ping($timeout=5)
    {
        /*
        $fsock = fsockopen($this->_address, $this->_port, $errno, $errstr, $timeout);
        if (!$fsock)
        {
            $ret = false;
        }
        else
        {
            $ret = true;
        }

        fclose($fsock);
        */
        
        $exec = "ping -c 1 ".$this->_address;
        $output = array();
        exec($exec, $output, $result);
        
        $ret = ($result == 0);
        
        return $ret;
    }    

}
