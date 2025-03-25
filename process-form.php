<?php
// Configuration
$recipient_email = "smeet.felix@gmail.com"; // Votre adresse Gmail
$website_name = "TechNau";

// Vérification de la méthode de requête
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    exit;
}

// Récupérer les données du formulaire
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$consent = isset($_POST['consent']) ? true : false;

// Validation des données
$errors = [];

if (empty($name)) {
    $errors[] = "Le nom est requis";
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Une adresse email valide est requise";
}

if (empty($subject)) {
    $errors[] = "L'objet du message est requis";
}

if (empty($message)) {
    $errors[] = "Le message est requis";
}

if (!$consent) {
    $errors[] = "Vous devez accepter la politique de confidentialité";
}

// Vérification anti-spam simple
if (isset($_POST['honeypot']) && !empty($_POST['honeypot'])) {
    // C'est probablement un bot
    sleep(2);
    echo json_encode(['status' => 'success', 'message' => 'Formulaire envoyé avec succès']);
    exit;
}

// Si des erreurs existent, renvoyer une réponse d'erreur
if (!empty($errors)) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['status' => 'error', 'message' => 'Erreurs de validation', 'errors' => $errors]);
    exit;
}

// Préparer l'email
$email_subject = "[$website_name] Nouveau message: $subject";

// En-têtes de l'email (utilisant l'email de l'expéditeur pour Reply-To)
$headers = [];
$headers[] = "From: $website_name <$recipient_email>"; // Utilise votre propre Gmail comme From
$headers[] = "Reply-To: $name <$email>";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/html; charset=UTF-8";

// Corps de l'email en HTML
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e88e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; }
        .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #777; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Nouveau message de contact</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <p class='label'>Nom:</p>
                <p>" . htmlspecialchars($name) . "</p>
            </div>
            <div class='field'>
                <p class='label'>Email:</p>
                <p><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></p>
            </div>";

// Ajouter le téléphone s'il est fourni
if (!empty($phone)) {
    $email_body .= "
            <div class='field'>
                <p class='label'>Téléphone:</p>
                <p>" . htmlspecialchars($phone) . "</p>
            </div>";
}

$email_body .= "
            <div class='field'>
                <p class='label'>Objet:</p>
                <p>" . htmlspecialchars($subject) . "</p>
            </div>
            <div class='field'>
                <p class='label'>Message:</p>
                <p>" . nl2br(htmlspecialchars($message)) . "</p>
            </div>
        </div>
        <div class='footer'>
            <p>Ce message a été envoyé depuis le formulaire de contact de votre site web " . htmlspecialchars($website_name) . ".</p>
            <p>Date: " . date('d/m/Y H:i:s') . "</p>
        </div>
    </div>
</body>
</html>
";

// Envoyer l'email
$mail_sent = mail($recipient_email, $email_subject, $email_body, implode("\r\n", $headers));

// Répondre au client
if ($mail_sent) {
    // Envoyer un email de confirmation au client (optionnel)
    if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $confirmation_subject = "[$website_name] Confirmation de votre message";
        $confirmation_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e88e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .button { display: inline-block; padding: 10px 20px; background-color: #1e88e5; color: white; text-decoration: none; border-radius: 5px; }
        .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #777; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Confirmation de réception</h2>
        </div>
        <div class='content'>
            <p>Bonjour " . htmlspecialchars($name) . ",</p>
            <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
            <p>Un technicien TechNau vous répondra dans les plus brefs délais.</p>
            <p>Récapitulatif de votre message :</p>
            <p><strong>Objet :</strong> " . htmlspecialchars($subject) . "</p>
            <p><strong>Message :</strong></p>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
            <p style='margin-top: 30px;'>Besoin d'une assistance immédiate ?</p>
            <p><a href='tel:+33600000000' class='button'>Appeler maintenant</a></p>
        </div>
        <div class='footer'>
            <p>© " . date('Y') . " TechNau - Tous droits réservés</p>
            <p>Ce message est envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
";
        
        mail($email, $confirmation_subject, $confirmation_body, implode("\r\n", $headers));
    }
    
    // Réponse JSON pour success
    echo json_encode(['status' => 'success', 'message' => 'Message envoyé avec succès']);
} else {
    // Réponse JSON pour erreur
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'envoi du message']);
}
?>