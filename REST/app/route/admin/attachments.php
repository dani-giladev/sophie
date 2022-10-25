<?php

namespace app\route\admin;

use modules\admin\controller\attachments;

$app->group('/admin/attachments/', function ()
{
    
    $this->map(['GET', 'POST'], 'getAttachments', function ($req, $res)
    {
        $um = new attachments();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->getAttachments(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'uploadFile', function ($req, $res)
    {
        $um = new attachments();
        
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
    
    $this->map(['GET', 'POST'], 'removeFile', function ($req, $res)
    {
        $um = new attachments();
        
        return $res
           ->withHeader('Content-type', 'application/json')
           ->getBody()
           ->write(
            json_encode(
                $um->removeFile(
                    $req->getParsedBody()
                )
            )
        );
    });
    
    $this->map(['GET', 'POST'], 'showPDF', function ($req, $res)
    {
        $um = new attachments();
        
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
        $um = new attachments();
        
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
