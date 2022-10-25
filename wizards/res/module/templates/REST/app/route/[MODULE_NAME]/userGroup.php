<?php

namespace app\route\[MODULE_NAME];

use modules\[MODULE_NAME]\controller\userGroup;

$app->group('/[MODULE_NAME]/userGroup/', function ()
{
    
    $this->get('getAll', function ($req, $res, $args)
    {
        $um = new userGroup();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getAll()
            )
        );
    });
    
    $this->get('get/{id}', function ($req, $res, $args)
    {
        $um = new userGroup();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->get($args['id'])
            )
        );
    });
    
    $this->get('delete/{id}', function ($req, $res, $args)
    {
        $um = new userGroup();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->delete($args['id'])
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'save', function ($req, $res)
    {
        $um = new userGroup();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->save(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getGrantsByMenu', function ($req, $res)
    {
        $um = new userGroup();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getGrantsByMenu(
                    $req->getParsedBody()
                )
            )
        );
    });
    
});
