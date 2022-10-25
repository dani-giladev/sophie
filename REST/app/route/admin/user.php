<?php

namespace app\route\admin;

use modules\admin\controller\user;

$app->group('/admin/user/', function ()
{
    
    $this->get('getAll', function ($req, $res, $args)
    {
        $um = new user();
        
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
        $um = new user();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->get($args['id'])
            )
        );
    });
    
    $this->get('getByLogin/{login}', function ($req, $res, $args)
    {
        $um = new user();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getByLogin($args['login'])
            )
        );
    });
    
    $this->get('getByCode/{code}', function ($req, $res, $args)
    {
        $um = new user();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getByCode($args['code'])
            )
        );
    });
    
    $this->get('delete/{id}', function ($req, $res, $args)
    {
        $um = new user();
        
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
        $um = new user();
        
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
    
    // Post: login / pass / lang
    $this->map(['GET', 'POST'], 'validate', function ($req, $res)
    {
        $um = new user();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->withHeader('Access-Control-Allow-Origin', '*')
//           ->getBody()
           ->write(
            json_encode(
                $um->validate(
                    $req->getParsedBody()
                )
            )
        );
    });    
    
    $this->map(['GET', 'POST'], 'logout', function ($req, $res)
    {
        $um = new user();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->withHeader('Access-Control-Allow-Origin', '*')
//           ->getBody()
           ->write(
            json_encode(
                $um->logout(
                    $req->getParsedBody()
                )
            )
        );
    }); 
    
});
