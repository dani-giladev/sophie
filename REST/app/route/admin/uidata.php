<?php

namespace app\route\admin;

use modules\admin\controller\loginuidata;
use modules\admin\controller\uidata;

$app->group('/admin/uidata/', function ()
{
 
    $this->get('getLoginUIData', function ($req, $res, $args)
    {
        $um = new loginuidata();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getLoginUIData()
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getUIData', function ($req, $res)
    {
        $um = new uidata();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getUIData(
                    $req->getParsedBody()
                )
            )
        );
    });

});
