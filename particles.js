document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    // Générer un jeton CSRF
    function generateCSRFToken() {
      return Math.random().toString(36).substring(2, 15) +
             Math.random().toString(36).substring(2, 15);
    }

    const csrfToken = generateCSRFToken();

    // Champ CSRF
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = 'csrf_token';
    csrfInput.value = csrfToken;
    contactForm.appendChild(csrfInput);

    // Champ honeypot (anti-spam)
    const honeypotInput = document.createElement('input');
    honeypotInput.type = 'text';
    honeypotInput.name = 'honeypot';
    honeypotInput.style.display = 'none';
    honeypotInput.setAttribute('aria-hidden', 'true');
    honeypotInput.autocomplete = 'off';
    contactForm.appendChild(honeypotInput);

    // Soumission du formulaire
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      const consent = document.getElementById('consent').checked;

      let isValid = true;
      const errorMessages = [];

      document.querySelectorAll('.form-control').forEach(field => {
        field.style.borderColor = '#ddd';
      });

      if (name === '') {
        document.getElementById('name').style.borderColor = '#f44336';
        errorMessages.push('Le nom est requis');
        isValid = false;
      }

      if (email === '') {
        document.getElementById('email').style.borderColor = '#f44336';
        errorMessages.push('L\'email est requis');
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('email').style.borderColor = '#f44336';
        errorMessages.push('Veuillez entrer une adresse email valide');
        isValid = false;
      }

      if (subject === '') {
        document.getElementById('subject').style.borderColor = '#f44336';
        errorMessages.push('L\'objet est requis');
        isValid = false;
      }

      if (message === '') {
        document.getElementById('message').style.borderColor = '#f44336';
        errorMessages.push('Le message est requis');
        isValid = false;
      }

      if (!consent) {
        document.getElementById('consent').parentElement.style.color = '#f44336';
        errorMessages.push('Vous devez accepter la politique de confidentialité');
        isValid = false;
      }

      if (!isValid) {
        showNotification('error', 'Erreur de validation', errorMessages.join('<br>'));
        return;
      }

      const submitButton = contactForm.querySelector('.submit-button');
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

      const formData = new FormData(contactForm);

      fetch('process-form.php', {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(data => {
              throw new Error(data.message || 'Une erreur est survenue');
            });
          }
          return response.json();
        })
        .then(data => {
          contactForm.reset();
          submitButton.disabled = false;
          submitButton.innerHTML = 'Envoyer ma demande';
          csrfInput.value = generateCSRFToken();
          showNotification('success', 'Message envoyé !', 'Votre message a bien été envoyé.');
        })
        .catch(error => {
          submitButton.disabled = false;
          submitButton.innerHTML = 'Envoyer ma demande';
          showNotification('error', 'Erreur', error.message || 'Une erreur est survenue lors de l\'envoi.');
          console.error('Erreur:', error);
        });
    });
  }

  // Fonction de notification
  window.showNotification = function (type, title, message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    const icon = type === 'success'
      ? '<i class="fas fa-check-circle"></i>'
      : '<i class="fas fa-exclamation-circle"></i>';

    notif.innerHTML = `
      ${icon}
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
    `;

    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add('show'), 10);
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 500);
    }, 5000);
  };
});
