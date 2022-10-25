<?php

namespace app\route\admin;

use modules\admin\controller\plugin;

$app->group('/admin/plugin/', function ()
{
 
    $this->get('getAll', function ($req, $res, $args)
    {
        $um = new plugin();
        
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
        $um = new plugin();
        
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
        $um = new plugin();
        
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
        $um = new plugin();
        
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
    
    $this->get('getConfig/{module_id}', function ($req, $res, $args)
    {
        $um = new plugin();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getConfig($args['module_id'])
            )
        );
    });
    
    $this->get('getMenu/{module_id}', function ($req, $res, $args)
    {
        $um = new plugin();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getMenu($args['module_id'])
            )
        );
    });
    
    $this->get('getTrans/{module_id}', function ($req, $res, $args)
    {
        $um = new plugin();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getTrans($args['module_id'])
            )
        );
    });
    
    $this->get('getGrants/{module_id}', function ($req, $res, $args)
    {
        $um = new plugin();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getTrans($args['module_id'])
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'createModule', function ($req, $res)
    {
        $um = new plugin();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->createModule(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'createMaintenance', function ($req, $res)
    {
        $um = new plugin();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->createMaintenance(
                    $req->getParsedBody()
                )
            )
        );
    });

    $this->map(['GET', 'POST'], 'createField', function ($req, $res)
    {
        $um = new plugin();

        return $res
            ->withHeader('Content-type', 'application/json')
            ->getBody()
            ->write(
                json_encode(
                    $um->createField(
                        $req->getParsedBody()
                    )
                )
            );
    });

    $this->map(['GET', 'POST'], 'getAllMaintenance', function ($req, $res)
    {
        $um = new plugin();

        return $res
            ->withHeader('Content-type', 'application/json')
            ->getBody()
            ->write(
                json_encode(
                    $um->getAllMaintenance(
                        $req->getParsedBody()
                    )
                )
            );
    });

});
