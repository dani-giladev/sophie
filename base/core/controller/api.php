<?php

namespace base\core\controller;

require_once 'HTTP/Request2.php'; // Essential to run (reports doesn't inherit of controller)

use base\core\controller\token;
use base\core\controller\helpers;
use base\core\controller\config;

/**
 * REST requests easely
 *
 * @author Default user
 */
class api
{
    private static $_link;
    
    public static function ask($api_path, $params = array(), $api_method = "GET", $api_ask_disabled = false)
    {
        $config = new config();
        
        if ($api_ask_disabled || !$config->getBaseDBPARAM("ENABLE_REST_API_ASK"))
        {
            $api_path_pieces = explode('/', $api_path);
            $controller_class = "modules\\".$api_path_pieces[1]."\\controller\\".$api_path_pieces[2];
            if (\class_exists($controller_class))
            {
                $controller = new $controller_class();
                $method = $api_path_pieces[3];
                if ($api_method === "POST")
                {
                    return $controller->$method($params);
                }
                else
                {
                    if (isset($api_path_pieces[4]))
                    {
                        return $controller->$method($api_path_pieces[4]);
                    }
                    else
                    {
                        return $controller->$method();
                    }
                }
            }
        }
        
        self::$_link = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://".$_SERVER['HTTP_HOST']."/REST/public".$api_path;
        
        if($api_method == "GET")
        {
            $r = new \Http_Request2(self::$_link, \HTTP_Request2::METHOD_GET);
            $url = $r->getUrl();
            $url->setQueryVariables($params);
        }
        
        if($api_method == "POST")
        {
            $r = new \Http_Request2(self::$_link, \HTTP_Request2::METHOD_POST);
            $r->addPostParameter($params);
            // $r->addPostFile('image', $file, 'image/jpeg');
        }
        
        // REST API auth
        $token_obj = new token();
        $raw_token = $token_obj->getToken();
        if (!is_null($raw_token))
        {
            $token = $raw_token;
        }
        else 
        {
            $token = $token_obj->getTokenByCode('internalZzOoMm3'); 
        }
        
        $r->setHeader('authorization', 'Bearer '.$token);
        
        return self::_send($r);
    }
    
    private static function _send($r)
    {
        try
            {
                $res = $r->send();
                
                if ($res->getStatus() == 200)
                {
                    $r_data = \json_decode($res->getBody(), true);
                    if($r_data['success'])
                    {
                        return helpers::resStruct(true, "", $r_data['data']);
                    }
                    else
                    {
                        return $r_data;
                    }
                }
                else
                {
                    $msg = 'Unexpected HTTP status for: ' . self::$_link. " " . $res->getStatus() . ' ' .$res->getReasonPhrase();

                    return helpers::resStruct(false, $msg);
                }
            }
            catch (\HTTP_Request2_Exception $e)
            {
                return helpers::resStruct(false, $e->getMessage());
            }
    }
}
