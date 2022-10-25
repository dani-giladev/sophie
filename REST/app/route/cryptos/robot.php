<?php

namespace app\route\cryptos;

use modules\cryptos\controller\robot;

$app->group('/cryptos/robot/', function ()
{
    
    $this->map(['GET', 'POST'], 'getFiltered', function ($req, $res)
    {
        $um = new robot();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getFiltered(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getAll', function ($req, $res)
    {
        $um = new robot();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getAll(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->get('get/{id}', function ($req, $res, $args)
    {
        $um = new robot();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->get($args['id'])
            )
        );
    });

    $this->map(['GET', 'POST'], 'delete/{id}', function ($req, $res, $args)
    {
        $um = new robot();
        
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
        $um = new robot();
        
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
    
    $this->map(['GET', 'POST'], 'getCommissionInfo', function ($req, $res)
    {
        $um = new robot();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getCommissionInfo(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'uploadConf', function ($req, $res)
    {
        $um = new robot();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->uploadConf(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'copyProperties', function ($req, $res)
    {
        $um = new robot();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->copyProperties(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getChart', function ($req, $res)
    {
        $um = new robot();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getChart(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getInherits', function ($req, $res)
    {
        $um = new robot();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getInherits(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'getSettingPricesCharts', function ($req, $res)
    {
        $um = new robot();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getSettingPricesCharts(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'setSettingPricesCharts', function ($req, $res)
    {
        $um = new robot();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->setSettingPricesCharts(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'updateCandlestick', function ($req, $res)
    {
        $um = new robot();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->updateCandlestick(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'switchLastOperation', function ($req, $res)
    {
        $um = new robot();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->switchLastOperation(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    
});
