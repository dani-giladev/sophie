<?php

if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}

$autoload_path = __DIR__ . '/../vendor/autoload.php';
require $autoload_path;

session_start();

// Config
use base\core\controller\config;
$config = new config();

// Token
use base\core\controller\token;
$token_obj = new token();

// Instantiate the app
$settings_path = __DIR__ . '/../src/settings.php';
$settings = require $settings_path;

// Logger settings
$settings['settings']['logger'] = array(
    'name' => $config->base->NAME."-".$config->base->VERSION,
    'path' => __DIR__ . '/../'.$config->getBaseDBPARAM("REST_LOG_PATH").'/'.$config->getBaseDBPARAM("REST_LOG_FILE"),
    // Your timezone
    'timezone' => $config->base->TIMEZONE,
    // Log level
    'level' => $config->getBaseDBPARAM("REST_LOG_LEVEL"),
    // List of Monolog Handlers you wanna use
    'handlers' => [],
);

$app = new \Slim\App($settings);

// REST AUTH
if (!$config->getBaseDBPARAM("REST_AUTH"))
{
    $devel_tokens = $config->getBaseDBPARAM("DEVEL_TOKENS");
    $token = (isset($devel_tokens[$_SERVER['REMOTE_ADDR']]))? ($devel_tokens[$_SERVER['REMOTE_ADDR']]) : null;
    setToken($token_obj, $token, true);
}
else
{
    if (\in_array($_SERVER['REMOTE_ADDR'], $config->getBaseDBPARAM("REST_AUTH_WHITE_LIST")))
    {
        setToken($token_obj, null, true);
    }
    else
    {
        $authenticator = function($request, \Slim\Middleware\TokenAuthentication $tokenAuth)
        {
            /**
             * Try find authorization token via header, parameters, cookie or attribute
             * If token not found, return response with status 401 (unauthorized)
             */
            $token = $tokenAuth->findToken($request);

            // Set token
            $token_obj = new token();
            setToken($token_obj, $token, false);
        };

        $auth_error = function($request, $response, \Slim\Middleware\TokenAuthentication $tokenAuth)
        {
            $output = array(
                'success'   => false,
                'msg'       => $tokenAuth->getResponseMessage(),
                'data'      => $tokenAuth->getResponseMessage()
            );

            return $response
                ->withHeader('Content-type', 'application/json')
                ->getBody()
                ->write(
                 json_encode(
                     $output
                 )
             );
        };

        $app->add(new \Slim\Middleware\TokenAuthentication([
            
            // 2018-03-01. Dani. Please, denote all routes manually.
            'path' => ['/admin'],
            
            'passthrough' => [
                '/admin/user/validate',
                '/admin/user/logout',
                '/admin/uidata/getLoginUIData',
                '/admin/attachments/*',
                '/admin/fileManager/*'
            ],
            'authenticator' => $authenticator,
            'secure' => !$config->getBaseDBPARAM("DEVEL"), // https not mandatory for development
            'relaxed' => ['sophie.dev', 'sophie.local', 'www.smartgolf.es'], // https not mandatory for this domain
            'error' => $auth_error,
                     
            // 2018-02-20 (Dani)
            'header' => 'Authorization',
            'regex' => '/Bearer\s+(.*)$/i',
            'parameter' => 'authorization',
            'cookie' => 'authorization',
            'argument' => 'authorization'                        
            ]) 
        );        
    }
}

// REST LOGS
if ($config->getBaseDBPARAM("REST_LOG"))
{
    $app->add(function ($req, $res, $next)
    {
        if ($req->hasHeader('authorization'))
        {
            $token = $req->getHeader('authorization')[0];
        }
        elseif (!empty($req->getQueryParams()['authorization']))
        {
            $token = $req->getQueryParams()['authorization'];
        }
        else
        {
            $token = null;
        }
        
        $token = str_replace("Bearer ", "", $token);
        
        $request = array(
            "token"     => $token,
            "method"    => $req->getMethod(),
            "uri"       => $req->getUri()->getPath(),
            "params"    => $req->getParams()
        );

        $data = $res->__toString();

        $response = array(
            "token"         => $token,
            "status"        => $res->getStatusCode(),
            "status_desc"   => $res->getReasonPhrase(),
            "data"          => array() //$data
        );

        $this->logger->info('Request', $request);
        $this->logger->info('Response', $response);

        return $next($req, $res);
    });
}

// Set up dependencies
require __DIR__ . '/../src/dependencies.php';

// Register middleware
require __DIR__ . '/../src/middleware.php';

// Register routes
require __DIR__ . '/../src/routes.php';

// Register my App
require __DIR__ . '/../app/app_loader.php';

// Run app
$app->run();

exit(0);

function setToken($token_obj, $token, $force = false)
{
    require_once("auth/auth.php");
    require_once("auth/unauthorizedException.php");        
    $auth = new auth();
    $auth->validateToken($token_obj, $token, $force);
}