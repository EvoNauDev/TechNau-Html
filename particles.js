// particles.js
// Script d'effet de particules suivant la souris pour TechNau

// Création du canvas qui contiendra l'animation
function createParticlesCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none'; // Pour que le canvas ne bloque pas les interactions
  canvas.style.zIndex = '-1'; // Derrière le contenu
  
  document.body.appendChild(canvas);
  return canvas;
}

// Configuration de l'animation
const CONFIG = {
  particleCount: 80,         // Nombre de particules
  particleColor: '#1e88e5',  // Couleur des particules (bleu TechNau)
  lineColor: 'rgba(30, 136, 229, 0.15)', // Couleur des lignes (bleu semi-transparent)
  particleRadius: 1.5,       // Taille des particules
  lineWidth: 1,              // Épaisseur des lignes
  connectionDistance: 150,   // Distance maximale de connexion entre particules
  moveSpeed: 1,              // Vitesse de déplacement des particules
  mouseInfluenceDistance: 150, // Distance d'influence de la souris
  mouseInfluenceStrength: 5  // Force d'influence de la souris
};

// Initialisation de l'animation
function initParticlesAnimation() {
  const canvas = createParticlesCanvas();
  const ctx = canvas.getContext('2d');
  let width, height;
  let mousePosition = { x: null, y: null };
  let particles = [];
  
  // Redimensionner le canvas lors du redimensionnement de la fenêtre
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Recréer les particules après redimensionnement
    initParticles();
  }
  
  // Création des particules
  function initParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * CONFIG.moveSpeed * 2 - CONFIG.moveSpeed,
        vy: Math.random() * CONFIG.moveSpeed * 2 - CONFIG.moveSpeed,
        radius: CONFIG.particleRadius
      });
    }
  }
  
  // Dessiner une particule
  function drawParticle(particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.particleColor;
    ctx.fill();
  }
  
  // Dessiner les connexions entre particules
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < CONFIG.connectionDistance) {
          // Opacité basée sur la distance
          const opacity = 1 - distance / CONFIG.connectionDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = CONFIG.lineColor;
          ctx.lineWidth = CONFIG.lineWidth;
          ctx.stroke();
        }
      }
    }
  }
  
  // Mettre à jour la position des particules
  function updateParticles() {
    for (let i = 0; i < particles.length; i++) {
      // Appliquer la vélocité
      particles[i].x += particles[i].vx;
      particles[i].y += particles[i].vy;
      
      // Rebondir sur les bords
      if (particles[i].x < 0 || particles[i].x > width) {
        particles[i].vx = -particles[i].vx;
      }
      if (particles[i].y < 0 || particles[i].y > height) {
        particles[i].vy = -particles[i].vy;
      }
      
      // Influence de la souris
      if (mousePosition.x !== null && mousePosition.y !== null) {
        const dx = mousePosition.x - particles[i].x;
        const dy = mousePosition.y - particles[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < CONFIG.mouseInfluenceDistance) {
          const force = (CONFIG.mouseInfluenceDistance - distance) / CONFIG.mouseInfluenceDistance;
          const directionX = dx / distance || 0;
          const directionY = dy / distance || 0;
          
          particles[i].vx += directionX * force * CONFIG.mouseInfluenceStrength * 0.05;
          particles[i].vy += directionY * force * CONFIG.mouseInfluenceStrength * 0.05;
        }
      }
      
      // Limiter la vitesse
      const speed = Math.sqrt(particles[i].vx * particles[i].vx + particles[i].vy * particles[i].vy);
      if (speed > CONFIG.moveSpeed * 2) {
        particles[i].vx = (particles[i].vx / speed) * CONFIG.moveSpeed * 2;
        particles[i].vy = (particles[i].vy / speed) * CONFIG.moveSpeed * 2;
      }
    }
  }
  
  // Boucle d'animation
  function animate() {
    ctx.clearRect(0, 0, width, height);
    updateParticles();
    drawConnections();
    
    for (let i = 0; i < particles.length; i++) {
      drawParticle(particles[i]);
    }
    
    requestAnimationFrame(animate);
  }
  
  // Gestion des événements de la souris
  function handleMouseMove(e) {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
  }
  
  function handleMouseLeave() {
    mousePosition.x = null;
    mousePosition.y = null;
  }
  
  // Initialisation des événements
  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseLeave);
  
  // Démarrage
  resizeCanvas();
  animate();
}

// Démarrer l'animation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
  initParticlesAnimation();
});

document.addEventListener('DOMContentLoaded', function() {
  // Formulaire de contact
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
      // Générer un jeton CSRF lors du chargement de la page
      function generateCSRFToken() {
          return Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
      }
      
      // Stocker le jeton CSRF
      const csrfToken = generateCSRFToken();
      
      // Créer un champ caché pour le CSRF token
      const csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = 'csrf_token';
      csrfInput.value = csrfToken;
      contactForm.appendChild(csrfInput);
      
      // Créer un champ honeypot (anti-spam)
      const honeypotInput = document.createElement('input');
      honeypotInput.type = 'text';
      honeypotInput.name = 'honeypot';
      honeypotInput.style.display = 'none';
      honeypotInput.setAttribute('aria-hidden', 'true');
      honeypotInput.autocomplete = 'off';
      contactForm.appendChild(honeypotInput);
      
      // Validation et soumission du formulaire
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Vérification de base côté client
          const name = document.getElementById('name').value.trim();
          const email = document.getElementById('email').value.trim();
          const subject = document.getElementById('subject').value.trim();
          const message = document.getElementById('message').value.trim();
          const consent = document.getElementById('consent').checked;
          
          let isValid = true;
          const errorMessages = [];
          
          // Réinitialiser les styles d'erreur
          document.querySelectorAll('.form-control').forEach(field => {
              field.style.borderColor = '#ddd';
          });
          
          // Validation
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
          
          // Afficher les erreurs si le formulaire n'est pas valide
          if (!isValid) {
              showNotification('error', 'Erreur de validation', errorMessages.join('<br>'));
              return;
          }
          
          // Désactiver le bouton pendant l'envoi
          const submitButton = contactForm.querySelector('.submit-button');
          submitButton.disabled = true;
          submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
          
          // Préparation des données
          const formData = new FormData(contactForm);
          
          // Envoi des données via AJAX
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
              // Réinitialiser le formulaire
              contactForm.reset();
              
              // Réactiver le bouton
              submitButton.disabled = false;
              submitButton.innerHTML = 'Envoyer ma demande';
              
              // Afficher le message de succès
              showNotification('success', 'Message envoyé !', 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
              
              // Générer un nouveau jeton CSRF
              csrfInput.value = generateCSRFToken();
          })
          .catch(error => {
              // Réactiver le bouton
              submitButton.disabled = false;
              submitButton.innerHTML = 'Envoyer ma demande';
              
              // Afficher le message d'erreur
              showNotification('error', 'Erreur', error.message || 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer ou nous contacter par téléphone.');
              console.error('Erreur:', error);
          });
      });
  }
  
  // Fonction pour afficher les notifications
  window.showNotification = function(type, title, message) {
      // Supprimer toute notification existante
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
          existingNotification.remove();
      }
      
      // Créer la notification
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      
      // Ajouter l'icône en fonction du type
      let icon = '';
      if (type === 'success') {
          icon = '<i class="fas fa-check-circle"></i>';
      } else if (type === 'error') {
          icon = '<i class="fas fa-exclamation-circle"></i>';
      }
      
      // Structure de la notification
      notification.innerHTML = `
          ${icon}
          <div class="notification-content">
              <div class="notification-title">${title}</div>
              <div class="notification-message">${message}</div>
          </div>
      `;
      
      // Ajouter au corps du document
      document.body.appendChild(notification);
      
      // Afficher la notification avec un petit délai
      setTimeout(() => {
          notification.classList.add('show');
      }, 10);
      
      // Masquer la notification après 5 secondes
      setTimeout(() => {
          notification.classList.remove('show');
          
          // Supprimer du DOM après la transition
          setTimeout(() => {
              notification.remove();
          }, 500);
      }, 5000);
  };
});

document.addEventListener('DOMContentLoaded', function() {
  // Formulaire de contact
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
      // Créer un champ honeypot (anti-spam)
      const honeypotInput = document.createElement('input');
      honeypotInput.type = 'text';
      honeypotInput.name = 'honeypot';
      honeypotInput.style.display = 'none';
      honeypotInput.setAttribute('aria-hidden', 'true');
      honeypotInput.autocomplete = 'off';
      contactForm.appendChild(honeypotInput);
      
      // Validation et soumission du formulaire
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Vérification de base côté client
          const name = document.getElementById('name').value.trim();
          const email = document.getElementById('email').value.trim();
          const subject = document.getElementById('subject').value.trim();
          const message = document.getElementById('message').value.trim();
          const consent = document.getElementById('consent').checked;
          
          let isValid = true;
          const errorMessages = [];
          
          // Réinitialiser les styles d'erreur
          document.querySelectorAll('.form-control').forEach(field => {
              field.style.borderColor = '#ddd';
          });
          
          // Validation
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
          
          // Afficher les erreurs si le formulaire n'est pas valide
          if (!isValid) {
              showNotification('error', 'Erreur de validation', errorMessages.join('<br>'));
              return;
          }
          
          // Désactiver le bouton pendant l'envoi
          const submitButton = contactForm.querySelector('.submit-button');
          submitButton.disabled = true;
          submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
          
          // Préparation des données
          const formData = new FormData(contactForm);
          
          // Envoi des données via AJAX
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
              // Réinitialiser le formulaire
              contactForm.reset();
              
              // Réactiver le bouton
              submitButton.disabled = false;
              submitButton.innerHTML = 'Envoyer ma demande';
              
              // Afficher le message de succès
              showNotification('success', 'Message envoyé !', 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
          })
          .catch(error => {
              // Réactiver le bouton
              submitButton.disabled = false;
              submitButton.innerHTML = 'Envoyer ma demande';
              
              // Afficher le message d'erreur
              showNotification('error', 'Erreur', error.message || 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer ou nous contacter par téléphone.');
              console.error('Erreur:', error);
          });
      });
  }
});