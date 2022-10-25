<?php

namespace app\route\admin;

use modules\admin\controller\localization;

$app->group('/admin/localization/', function ()
{
    
    $this->get('getCountries', function ($req, $res, $args)
    {
        $um = new localization();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getCountries()
            )
        );
    });  
    
    $this->map(['GET', 'POST'], 'getProvinces', function ($req, $res)
    {
        $um = new localization();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getProvinces(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getLocations', function ($req, $res)
    {
        $um = new localization();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getLocations(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getLocalizationByPostalcode', function ($req, $res)
    {
        $um = new localization();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getLocalizationByPostalcode(
                    $req->getParsedBody()
                )
            )
        );
    });
    
});
