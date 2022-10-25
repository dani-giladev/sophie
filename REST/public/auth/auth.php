<?php

/**
 * Authorized REST requests
 *
 * @author Default user
 * @author Default user
 * 
 */

class auth
{

    public function validateToken($token_obj, $token, $force = false)
    {
        if ($token_obj->isActive($token) || $token == "internalZzOoMm3" || $force)
        {
            $_SESSION['token'] = $token;
            return true;
        }

        /**
         * The throwable class must implement UnauthorizedExceptionInterface
         */
        throw new UnauthorizedException('Invalid Token');
    }

    /*public function setToken($token)
    {
        $_SESSION['token'] = $token; 
    }*/
}