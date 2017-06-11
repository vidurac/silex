<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

use Symfony\Component\Validator\Constraints as Assert;

use Sinergi\BrowserDetector\Browser;
use Sinergi\BrowserDetector\Os;
use Symfony\Component\Console\Helper\Table;

require_once __DIR__.'/models/guest.php';

//Request::setTrustedProxies(array('127.0.0.1'));

$app->get('/', function (Request $request) use ($app) {
    // some default data for when the form is displayed the first time
    $data = array(
        'name' => 'Your name',
        'address' => 'Your address',
        'email' => 'Your email',
        'message ' => 'Your message',
    );

    $form = $app['form.factory']->createBuilder(FormType::class, $data)
        ->add('name')
        ->add('address')
        ->add('email')
        ->add('message')
        ->add('button', SubmitType::class, [
            'label' => 'Save',
            'attr'=> array('class'=>'btn btn-info')
        ])
        ->getForm();

    $form->handleRequest($request);

    // display the form
    return $app['twig']->render('guestBook.html.twig', array('form' => $form->createView()));
});




$app->post('/', function () use ($app) {
    $recaptcha = new \ReCaptcha\ReCaptcha("6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe");
    $resp = $recaptcha->verify($_POST['g-recaptcha-response'], $_SERVER['REMOTE_ADDR']);
    if ($resp->isSuccess()) {
        // verified!
        // if Domain Name Validation turned off don't forget to check hostname field
        // if($resp->getHostName() === $_SERVER['SERVER_NAME']) {  }
    } else {
        $errors = $resp->getErrorCodes();
    }

    // display the form
    return $resp->getHostName();
});

$app->post('/addGuests', function (Request $request) use ($app) {

    $browser = new Browser();
    $os = new Os();

    //instantiate guest model
    $guest = new guest();
    $data = array(
                'name' => $request->get('name'),
                'address' => $request->get('address'),
                'email' => $request->get('email'),
                'message' => $request->get('message'),
                'browser' => $browser->getName(),
                'browser_version' => $browser->getVersion(),
                'platform' => $os->getName(),
                'ip_address' => $_SERVER['REMOTE_ADDR'],
            );
    //save data
    $save = $guest->save($app,$data);
    if($save)
    {
        return $app->json(array('success' => true, 'error' => false));
    }
});

$app->get('/getGuests', function () use ($app) {

    //instantiate guest model
    $guest = new guest();

    return $guest->getAllGuests($app);
});

$app->error(function (\Exception $e, Request $request, $code) use ($app) {
    if ($app['debug']) {
        return;
    }

    // 404.html, or 40x.html, or 4xx.html, or error.html
    $templates = array(
        'errors/'.$code.'.html.twig',
        'errors/'.substr($code, 0, 2).'x.html.twig',
        'errors/'.substr($code, 0, 1).'xx.html.twig',
        'errors/default.html.twig',
    );

    return new Response($app['twig']->resolveTemplate($templates)->render(array('code' => $code)), $code);
});
