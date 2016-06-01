<?php
header('Access-Control-Allow-Origin: *');

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

        //Set who the message is to be sent from
        $mail->setFrom('noreply@basejr.com.br', 'Base Jr. Website');

        //Set an alternative reply-to address
        $mail->addReplyTo('contato@basejr.com.br', 'Contato Base Jr.');

        //Set who the message is to be sent to
        $mail->addAddress('contato@basejr.com.br', 'Contato Base Jr.');

        //Set the subject line
        $mail->Subject = '[Website - Contato]';

        $mail->Body = ''
            . '<h3>Informações:</h3>'
            . '<ul>'
            . '<li>Nome: <b>' . $name . '</b></li>'
            . '<li>Email: <b>' . $email . '</b></li>'
            . '<li>Assunto: <b>' . $subject . '</b></li>'
            . '<li>Data: <b>' . date('H:i - d.m.Y') . '</b></li>'
            . '</ul>'
            . '<h3>Mensagem:</h3>'
            . '<p>' . $message . '</p>'
            . '<br />'
            . '<p style="font-style: italic">Esse email foi gerado automaticamente, por favor, não responda.</p>';

        $mail->AltBody = ''
            . '<h3>Informações:</h3>'
            . '<ul>'
            . '<li>Nome: <b>' . $name . '</b></li>'
            . '<li>Email: <b>' . $email . '</b></li>'
            . '<li>Assunto: <b>' . $subject . '</b></li>'
            . '<li>Data: <b>' . date('H:i - d.m.Y') . '</b></li>'
            . '</ul>'
            . '<h3>Mensagem:</h3>'
            . '<p>' . $message . '</p>'
            . '<br />'
            . '<p style="font-style: italic">Esse email foi gerado automaticamente, por favor, não responda.</p>';

        if ($mail->send()) {
            $status = 200;
        }
    }

    $newResponse = $response->withStatus($status);
    return $newResponse;
});

$app->run();
