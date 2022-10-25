<?php

namespace app\route\admin;

use modules\admin\controller\fileManager;

$app->group('/admin/fileManager/', function ()
{
    
    $this->map(['GET', 'POST'], 'getDir', function ($req, $res)
    {
        $um = new fileManager();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           //->getBody()
           ->write(
                $um->getDir(
                    $req->getParsedBody()
                )
        );
    });    
    
    $this->map(['GET', 'POST'], 'getFile', function ($req, $res)
    {
        $um = new fileManager();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getFile(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'newFolder', function ($req, $res)
    {
        $um = new fileManager();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->newFolder(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'deleteFolder', function ($req, $res)
    {
        $um = new fileManager();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->deleteFolder(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'deleteFile', function ($req, $res)
    {
        $um = new fileManager();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->deleteFile(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'uploadFile', function ($req, $res)
    {
        $um = new fileManager();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->uploadFile(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'showPDF', function ($req, $res)
    {
        $um = new fileManager();
        
        return $res
           ->withHeader('Content-type', 'application/pdf')
//           ->getBody()
           ->write(
                $um->showPDF(
                    $req->getParsedBody()
                )
        );
    });
    
    $this->map(['GET', 'POST'], 'downloadFile', function ($req, $res)
    {
        $um = new fileManager();
        
        return $res
//           ->withHeader('Content-type', 'application/pdf')
//           ->getBody()
           ->write(
                $um->downloadFile(
                    $req->getParsedBody()
                )
        );
    });
    
});
