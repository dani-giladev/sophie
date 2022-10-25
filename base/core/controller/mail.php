<?php

namespace base\core\controller;

use base\core\controller\config;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * Override mailer class to determine config and some customization
 *
 * @author Dani Gilabert
 * 
 */
class mail //extends PHPMailer
{
    private $_config;
    private $_mailer = null;
    private $_error_message = null;

    public function __construct($params = array())
    {
        if (empty($params))
        {
            $this->_config = new config();
            $params = $this->_config->getBaseDBPARAM("MAIL");            
        }
        
//        require_once("base/libs/vendor/phpmailer/phpmailer/mailer/class.mailer.php");
//        require_once("libs/mailer/class.smtp.php");
        
        $this->_mailer = new PHPMailer();
        if($params['mailer'] == "smtp")
        {
            $this->_mailer->isSMTP();
        }
        $this->_mailer->Mailer = $params['mailer'];
        $this->_mailer->From = $params['from'];
        $this->_mailer->FromName = $params['fromname'];
        $this->_mailer->Host = $params['host'];
        $this->_mailer->Port = $params['port'];
        $this->_mailer->SMTPAuth = $params['smtpauth'];
        $this->_mailer->SMTPSecure = $params['secure'];
        $this->_mailer->Username = $params['username'];
        $this->_mailer->Password = $params['password'];
        
        $this->_mailer->SMTPAutoTLS = false;
    }

    public function sendToAdmin($subject = null, $body = null, $ishtml = true)
    {
        $result = null;
        $to = $this->_config->getBaseDBPARAM("ADMIN_EMAIL");
        if (!is_null($to))
        {
            $result = $this->sendEmail($to, $subject, $body, $ishtml);              
        }        

        return $result;
    }
    
    public function sendEmail($to = array(), $subject = null, $body = null, $ishtml = true, $from = null, $from_name = null, $attachments = array())
    {
        try
        {
            if(isset($to))
            {
                foreach($to as $name => $emailAddress)
                {
                    $this->_mailer->AddAddress($emailAddress);
                }
                
                if (!is_null($from))
                {
                    $this->_mailer->From = $from;
                }
                if (!is_null($from_name))
                {
                    $this->_mailer->FromName = $from_name;
                }
                
                $this->_mailer->Subject = $subject;
                $this->_mailer->Body = $body;
                $this->_mailer->IsHTML($ishtml);

                if (is_array($attachments) && !empty($attachments))
                {
                    foreach ($attachments as $attachment)
                    {
                        $file_path = $attachment['file_path'];
                        $file_name = $attachment['file_name'];
                        $this->_mailer->AddAttachment($file_path.$file_name);                        
                    }
                }
        
                // Just to avoid error messages
                //ob_start();
                    $result = $this->_mailer->Send();
                    $this->_error_message = $this->_mailer->ErrorInfo;
                //ob_end_clean();
            }
        }
        
        catch(mailerException $e)
        {
            $result = false;
            $this->_error_message .= json_encode($e);//$e->errorMessage();
        }
        catch (Exception $e)
        {
            $result = false;
            $this->_error_message .= json_encode($e);
        }
        
        $this->_mailer->ClearAddresses();
        $this->_mailer->ClearAttachments();
        
        return $result;
    }
    
    public function getErrorMsg()
    {
        return $this->_error_message;
    }
    
    public function ValidateAdress($emailAddress)
    {
        return $this->_mailer->ValidateAddress($emailAddress);
    }    
}