<?php

namespace app\route\admin;

use modules\admin\controller\config;

$app->group('/admin/config/', function ()
{
    
    $this->map(['GET', 'POST'], 'getParams', function ($req, $res)
    {
        $um = new config();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getParams(
                    $req->getParsedBody()
                )
            )
        );
    });  
    
    $this->map(['GET', 'POST'], 'save', function ($req, $res)
    {
        $um = new config();
        
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
    
    $this->get('delete/{id}', function ($req, $res, $args)
    {
        $um = new config();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->delete($args['id'])
            )
        );
    });
    
});
