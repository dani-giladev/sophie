<?php

use \Slim\Middleware\TokenAuthentication\UnauthorizedExceptionInterface;

/**
 * Validate REST requests
 *
 * @author Default user
 */
class UnauthorizedException extends \Exception implements UnauthorizedExceptionInterface
{
    
}
