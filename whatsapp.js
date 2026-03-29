<script>
  // Aspettiamo che tutto l'HTML sia caricato prima di eseguire lo script
  document.addEventListener('DOMContentLoaded', function () {
    
    // 1. Definiamo gli elementi del Modale
    const fab       = document.getElementById('wa-fab');
    const overlay   = document.getElementById('wa-overlay');
    const btnClose  = document.getElementById('wa-modal-close');
    
    // 2. Definiamo gli elementi del Form (Assicurati che nel tuo HTML l'id sia "wa-form")
    const form      = document.getElementById('wa-form');
    const submitBtn = document.getElementById('wa-submit');
    const submitTxt = document.getElementById('wa-submit-text');
    const status    = document.getElementById('wa-status');

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhAPZVyp1vHgVcQQxCXDDc8UES1Jwn1WDkgdlqBoG-kRgSOVbUwODgz4c6GZoti8Y2/exec';

    // Controllo di sicurezza: se mancano gli elementi principali, fermiamo lo script per evitare errori in console
    if (!fab || !overlay || !form) {
      console.error("Errore: Elementi del modale (wa-fab, wa-overlay) o del form (wa-form) non trovati nell'HTML.");
      return;
    }

    // --- LOGICA MODALE ---
    function openModal() {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Riusa il cursore custom del sito se presente
      if (typeof updateCursor === 'function') updateCursor();
    }

    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Assegnazione eventi per aprire e chiudere
    fab.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    
    // Chiudi cliccando fuori dal modale
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    
    // Chiudi premendo il tasto Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeModal();
      }
    });

    // --- LOGICA FORM E INVIO DATI ---
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Impedisce il ricaricamento della pagina

      // Stato di caricamento
      submitBtn.disabled = true;
      if (submitTxt) submitTxt.textContent = 'Invio in corso…';
      else submitBtn.innerText = 'Invio in corso…'; 
      
      status.innerHTML = '';
      status.className = 'loading'; // Classe generica per eventuale CSS

      // Estrazione dati dal form
      const formData   = new FormData(form);
      const dataParams = new URLSearchParams();
      for (const [k, v] of formData) {
        dataParams.append(k, v);
      }

      // Invio a Google Apps Script
      fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: dataParams
      })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP Error: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data.status === 'success') {
          status.innerHTML = '✦ ' + data.text;
          status.className = 'wa-status--success';
          form.reset(); // Svuota il form
          setTimeout(closeModal, 2400); // Chiude il modale dopo 2.4s
        } else {
          status.innerHTML = data.text;
          status.className = 'wa-status--error';
        }
      })
      .catch(function (err) {
        console.error("Dettaglio Errore Fetch:", err);
        status.innerHTML = 'Errore di connessione. Riprova.';
        status.className = 'wa-status--error';
      })
      .finally(function () {
        // Ripristina il bottone a prescindere dal risultato
        submitBtn.disabled = false;
        if (submitTxt) submitTxt.textContent = 'Invia su WhatsApp';
        else submitBtn.innerText = 'Invia su WhatsApp';
      });
    });

  });
</script>
