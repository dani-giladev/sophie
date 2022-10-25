<?php

namespace base\core\controller;

/**
 * Manage logged users
 *
 * @author Default user
 */

// Controllers
use base\core\controller\mail;
//use base\core\controller\config;

// Models
use modules\admin\model\user;

class token
{
    private $_tokens_path = null;
    private $_internal_user_code = "internalZzOoMm3";

    public function __construct()
    {
        $this->_tokens_path = __DIR__."/../../res/tokens_store/";

        // Making sure exist internal token
        $internal_token_path = $this->_getTokenPath($this->_internal_user_code);
        if (!\file_exists($this->_tokens_path) || !\file_exists($internal_token_path))
        {
            $this->_createInternalToken();
            
            $msg = "Directorio de tokens o fichero de internal token inexistente: ".$this->_tokens_path." - ".$internal_token_path;
            $this->_sendEmail($msg);
        }
    }

    private function _createInternalToken()
    {
        if (!\file_exists($this->_tokens_path))
        {
            \mkdir($this->_tokens_path);
        }

        $token = $this->getTokenByCode($this->_internal_user_code);
        $raw_internal = array(
            "token"         => $token,
            "code"          => "internalZzOoMm3",
            "login"         => "internalZzOoMm3",
            "name"          => 'Internal token',
            "is_super_user" => false,
            "time"          => \date("Y-m-d H:i:s"),
            "lang"          => "es"
        );
        $internal = \json_encode($raw_internal);

        \file_put_contents($this->_getTokenPath($this->_internal_user_code), $internal);
    }

    private function _getTokenPath($code = null, $token = null)
    {
        if(!\is_null($code) && \is_null($token))
        {
            $token = $this->getTokenByCode($code);
        }

        $path = $this->_tokens_path.$token.".json";

        return $path;
    }
    
    public function get($token = null)
    {
        if(\is_null($token))
        {
            $token = $this->getToken();
        }
        
        if($this->isActive($token))
        {
            $json_token_data = \file_get_contents($this->_getTokenPath(null, $token));
            return \json_decode($json_token_data, true);
        }

        return false;
    }

    public function isActive($token)
    {
        $res = \file_exists($this->_getTokenPath(null, $token));

        return $res;
    }

    public function getToken()
    {
        if(isset($_SESSION['token']))
        {
            return $_SESSION['token'];
        }

        // Xavi debugging purposes
        /*$config = new config();
        if($config->getBaseDBPARAM("DEVEL"))
        {
            return '21232f297a57a5a743894a0e4a801fc3';
        }*/

        return '';
    }
    
    public function getTokenByCode($code)
    {
        return \md5($code);
    }
    
    public function add($user, $lang)
    {
        $token = $this->getTokenByCode($user['code']);
        
        if ($this->isActive($token))
        {
            $this->remove($token);
        }
        
        $raw_new_token_data = array(
            "code"              => $user['code'],
            "token"             => $token,
            "login"             => $user['login'],
            "name"              => $user['name'],
            "is_super_user"     => $user['is_super_user'],
            "time"              => \date("Y-m-d H:i:s"),
            "lang"              => $lang
        );
        $new_token_data = \json_encode($raw_new_token_data);

        \file_put_contents($this->_getTokenPath(null, $token), $new_token_data);
        
        return $token;
    }
    
    public function remove($token = null)
    {
        $path = $this->_getTokenPath(null, $token);

        if(\file_exists($path))
        {
            \unlink($path);
        }
    }
    
    public function getActive()
    {
        $token_files = \scandir($this->_tokens_path);

        foreach($token_files as $k => $file)
        {
            $raw_token_data = \file_get_contents($this->_getTokenPath(null, $file));
            $token_data =  \json_decode($raw_token_data, true);
            $active_tokens[$file] = $token_data;
        }

        return $active_tokens;
    }
    
    public function getLang($token = null)
    {
        $token_data = $this->get($token);
        return (isset($token_data['lang'])) ? $token_data['lang'] : null;
    }
    
    public function getUser()
    {
        $user_code = $this->getUserCode();
        $user_obj = new user();
        $doc = $user_obj->get("app_user-".$user_code);

        return $doc;
    }
    
    public function getUserCode()
    {
        $user = $this->get();
        return (isset($user['code'])? $user['code'] : '');
    }
    
    public function getUserLogin()
    {
        $user = $this->get();
        return (isset($user['login'])? $user['login'] : '');
    }
    
    public function getUserName()
    {
        $user = $this->get();
        return (isset($user['name'])? $user['name'] : '');
    }

    public function getUserEmail()
    {
        $user = $this->get();
        return (isset($user['email'])? $user['email'] : '');
    }

    public function isSuperUser()
    {
        $user = $this->get();
        return (isset($user['is_super_user']) && $user['is_super_user']);
    }
    
    private function _sendEmail($msg)
    {
        $msg .= ". Usuario: ".$this->getUserCode()." - ".$this->getUserLogin()." - ".$this->getUserName()." - ".$this->getUserEmail();
        //$msg .= ". Raw tokens: ".$this->_raw_tokens;
        $mail = new mail();
        $mail->sendToAdmin("Problema en Sophie (tokens)", $msg);
    }
}
