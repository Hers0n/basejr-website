<?php
header('Access-Control-Allow-Origin: http://localhost:9000');

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';

date_default_timezone_set('America/Sao_Paulo');

$app = new \Slim\App;

$app->post('/mail', function (Request $request, Response $response) {

    $status = 400;
    $list_file = 'data/email-list.json';
    $list = array();

    $list_temp = file_get_contents($list_file);

    if ($list_temp) {
        $list = json_decode($list_temp, true);

    } else {
        $newResponse = $response->withStatus(400);
        return $newResponse;
    }

    $email = $request->getParam('email');

    if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $is_new = true;

        if ($list && !empty($list)) {
            foreach ($list as $item) {
                if ($item == $email) {
                    $is_new = false;
                    break;
                }
            }
        }

        if ($is_new) {
            array_push($list, $email);

            if (file_put_contents($list_file, json_encode($list))) {
                $status = 200;
            }

        } else {
            $status = 202;
        }
    }

    $newResponse = $response->withStatus($status);
    return $newResponse;
});

$app->post('/contact', function (request $request, Response $response) {

    $status = 400;

    $name = $request->getParam('name');
    $email = $request->getParam('email');
    $subject = $request->getParam('subject');
    $message = $request->getParam('message');

    if ($name && $email && filter_var($email, FILTER_VALIDATE_EMAIL) && $subject && $message) {

        $mail = new PHPMailer;
        $mail->isSMTP();
        $mail->SMTPDebug = 0;
        $mail->Host = gethostbyname('smtp.gmail.com');
        $mail->Port = 587;
        $mail->SMTPSecure = 'tls';
        $mail->SMTPAuth = true;

        //Username to use for SMTP authentication - use full email address for gmail
        $mail->Username = "sitebasejr@gmail.com";

        //Password to use for SMTP authentication
        $mail->Password = "basebase";

        //Set who the message is to be sent from
        $mail->setFrom('contato@basejr.com.br', 'Contato Base Jr.');

        //Set an alternative reply-to address
        $mail->addReplyTo('contato@basejr.com.br', 'Contato Base Jr.');

        //Set who the message is to be sent to
        $mail->addAddress($email, $name);

        //Set the subject line
        $mail->Subject = $subject;

        $mail->Body = $message;

        if (!$mail->send()) {
            echo "Mailer Error: " . $mail->ErrorInfo;

        } else {
            echo "Message sent!";
            $status = 200;
        }
    }

    $newResponse = $response->withStatus($status);
    return $newResponse;
});

$app->get('/test', function (request $request, Response $response) {
    $mail = new PHPMailer;
    $mail->isSMTP();

    $mail->SMTPDebug = 2;
    $mail->Debugoutput = 'html';

    $mail->SMTPSecure = 'tls';
    $mail->Host = gethostbyname('smtp.gmail.com');
    $mail->Port = 587;

    $mail->SMTPAuth = true;

    //Username to use for SMTP authentication - use full email address for gmail
    $mail->Username = "sitebasejr@gmail.com";

    //Password to use for SMTP authentication
    $mail->Password = "basebase";

    //Set who the message is to be sent from
    $mail->setFrom('sitebasejr@gmail.com', 'Base Jr Website');

    //Set an alternative reply-to address
    $mail->addReplyTo('sitebasejr@gmail.com', 'Base Jr Website');

    //Set who the message is to be sent to
    $mail->addAddress('dallrigo@gmail.com', 'Base Jr Contato');

    //Set the subject line
    $mail->Subject = 'test subject';

    $mail->Body = 'test body';

    if (!$mail->send()) {
        echo "Mailer Error: " . $mail->ErrorInfo;

    } else {
        echo "Message sent!";
    }
});

$app->run();
