/* whatsapp.js — Metodo Completo e Allineato al Form Originale */

document.addEventListener('DOMContentLoaded', function () {
  
  // --- 1. RIFERIMENTI UI ---
  const fab       = document.getElementById('wa-fab');
  const overlay   = document.getElementById('wa-overlay');
  const btnClose  = document.getElementById('wa-modal-close');
  const form      = document.getElementById('wa-form');
  const submitBtn = document.getElementById('wa-submit');
  const submitTxt = document.getElementById('wa-submit-text');
  const status    = document.getElementById('wa-status');
  const modalBox  = document.getElementById('wa-modal');

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhAPZVyp1vHgVcQQxCXDDc8UES1Jwn1WDkgdlqBoG-kRgSOVbUwODgz4c6GZoti8Y2/exec';

  if (!fab || !overlay || !form) return;

  // --- 2. FORZATURA RENDERING ---
  fab.style.zIndex = '999998';
  fab.style.pointerEvents = 'auto';

  overlay.style.display = 'none';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.zIndex = '999999';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  if (modalBox) {
    modalBox.style.position = 'relative';
    modalBox.style.zIndex = '1000000';
  }

  // --- 3. GESTIONE MODALE ---
  function openModal() {
    overlay.classList.add('open');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  fab.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && overlay.style.display !== 'none') closeModal(); });

  // --- 4. LOGICA DI RETE (Identica al tuo script funzionante) ---
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Stato iniziale: UI in caricamento
    if (submitBtn) submitBtn.disabled = true;
    if (submitTxt) {
        submitTxt.textContent = "Invio in corso...";
    } else if (submitBtn) {
        submitBtn.innerText = "Invio in corso...";
    }
    
    if (status) {
      status.innerHTML = "";
      status.className = "loading";
    }

    // Estraiamo i dati dal form in modo leggibile per Google Apps Script
    // Usiamo 'this' per coerenza con il tuo metodo
    const formData = new FormData(this);
    const dataParams = new URLSearchParams();
    for (const pair of formData) {
        dataParams.append(pair[0], pair[1]);
    }

    // Invio effettivo dei dati
    fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: dataParams
    })
    .then(response => {
      if (!response.ok) throw new Error("Errore di rete HTTP: " + response.status);
      return response.json();
    })
    .then(data => {
      if(data.status === "success") {
        if (status) {
          status.innerHTML = data.text;
          status.className = "success";
        }
        form.reset();
        setTimeout(closeModal, 2500); // Chiude dopo l'invio
      } else {
        if (status) {
          status.innerHTML = data.text;
          status.className = "error";
        }
      }
      
      // Ripristino pulsante
      if (submitBtn) submitBtn.disabled = false;
      if (submitTxt) {
          submitTxt.textContent = "Invia su WhatsApp";
      } else if (submitBtn) {
          submitBtn.innerText = "Invia su WhatsApp";
      }
    })
    .catch(error => {
      console.error("Dettaglio Errore:", error);
      if (status) {
        status.innerHTML = "Errore di connessione. Riprova.";
        status.className = "error";
      }
      if (submitBtn) submitBtn.disabled = false;
      if (submitTxt) {
          submitTxt.textContent = "Riprova";
      } else if (submitBtn) {
          submitBtn.innerText = "Riprova";
      }
    });
  });

});/* whatsapp.js — Script Isolato e Completo */

document.addEventListener('DOMContentLoaded', function () {
  
  // 1. Inizializzazione Riferimenti (Come il GetComponent)
  const fab       = document.getElementById('wa-fab');
  const overlay   = document.getElementById('wa-overlay');
  const btnClose  = document.getElementById('wa-modal-close');
  const form      = document.getElementById('wa-form');
  const submitBtn = document.getElementById('wa-submit');
  const submitTxt = document.getElementById('wa-submit-text');
  const status    = document.getElementById('wa-status');

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhAPZVyp1vHgVcQQxCXDDc8UES1Jwn1WDkgdlqBoG-kRgSOVbUwODgz4c6GZoti8Y2/exec';

  // 2. Controllo Null Reference (Fondamentale per la stabilità)
  if (!fab) { console.error("whatsapp.js: 'wa-fab' non trovato."); return; }
  if (!overlay) { console.error("whatsapp.js: 'wa-overlay' non trovato."); return; }
  if (!form) { console.error("whatsapp.js: 'wa-form' non trovato."); return; }

  // Nascondiamo l'overlay di default per sicurezza
  overlay.style.display = 'none';

  // 3. Logica di Apertura/Chiusura (UI Controller)
  function openModal() {
    overlay.classList.add('open');
    overlay.style.display = 'flex'; // Fallback di sicurezza in caso manchi nel CSS
    document.body.style.overflow = 'hidden'; // Blocca lo scroll della pagina
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.style.display = 'none';
    document.body.style.overflow = ''; // Sblocca lo scroll
  }

  // 4. Assegnazione Event Listener (Input Manager)
  fab.addEventListener('click', openModal);
  
  if (btnClose) {
    btnClose.addEventListener('click', closeModal);
  }
  
  overlay.addEventListener('click', function(e) {
    // Chiude solo se clicchi fuori dal box bianco del modale
    if (e.target === overlay) closeModal();
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.style.display !== 'none') {
      closeModal();
    }
  });

  // 5. Logica di Invio Dati (Network Manager)
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Feedback visivo immediato all'utente
    if (submitBtn) submitBtn.disabled = true;
    if (submitTxt) submitTxt.textContent = 'Invio in corso…';
    
    if (status) {
      status.innerHTML = '';
      status.className = 'loading';
    }

    // Preparazione pacchetto dati
    const formData   = new FormData(form);
    const dataParams = new URLSearchParams();
    for (const [k, v] of formData) {
      dataParams.append(k, v);
    }

    // Chiamata asincrona al server
    fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: dataParams
    })
    .then(res => {
      if (!res.ok) throw new Error('HTTP Error: ' + res.status);
      return res.json();
    })
    .then(data => {
      if (data.status === 'success') {
        if (status) {
          status.innerHTML = '✦ ' + data.text;
          status.className = 'wa-status--success';
        }
        form.reset(); // Pulisce i campi
        setTimeout(closeModal, 2500); // Chiude il modale in automatico dopo 2.5s
      } else {
        if (status) {
          status.innerHTML = data.text;
          status.className = 'wa-status--error';
        }
      }
    })
    .catch(err => {
      console.error("whatsapp.js Error:", err);
      if (status) {
        status.innerHTML = 'Errore di connessione. Riprova.';
        status.className = 'wa-status--error';
      }
    })
    .finally(() => {
      // Ripristina il bottone al termine, sia in caso di successo che di errore
      if (submitBtn) submitBtn.disabled = false;
      if (submitTxt) submitTxt.textContent = 'Invia su WhatsApp';
    });
  });

});/* whatsapp.js — Script Isolato e Completo */

document.addEventListener('DOMContentLoaded', function () {
  
  // 1. Inizializzazione Riferimenti (Come il GetComponent)
  const fab       = document.getElementById('wa-fab');
  const overlay   = document.getElementById('wa-overlay');
  const btnClose  = document.getElementById('wa-modal-close');
  const form      = document.getElementById('wa-form');
  const submitBtn = document.getElementById('wa-submit');
  const submitTxt = document.getElementById('wa-submit-text');
  const status    = document.getElementById('wa-status');

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhAPZVyp1vHgVcQQxCXDDc8UES1Jwn1WDkgdlqBoG-kRgSOVbUwODgz4c6GZoti8Y2/exec';

  // 2. Controllo Null Reference (Fondamentale per la stabilità)
  if (!fab) { console.error("whatsapp.js: 'wa-fab' non trovato."); return; }
  if (!overlay) { console.error("whatsapp.js: 'wa-overlay' non trovato."); return; }
  if (!form) { console.error("whatsapp.js: 'wa-form' non trovato."); return; }

  // Nascondiamo l'overlay di default per sicurezza
  overlay.style.display = 'none';

  // 3. Logica di Apertura/Chiusura (UI Controller)
  function openModal() {
    overlay.classList.add('open');
    overlay.style.display = 'flex'; // Fallback di sicurezza in caso manchi nel CSS
    document.body.style.overflow = 'hidden'; // Blocca lo scroll della pagina
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.style.display = 'none';
    document.body.style.overflow = ''; // Sblocca lo scroll
  }

  // 4. Assegnazione Event Listener (Input Manager)
  fab.addEventListener('click', openModal);
  
  if (btnClose) {
    btnClose.addEventListener('click', closeModal);
  }
  
  overlay.addEventListener('click', function(e) {
    // Chiude solo se clicchi fuori dal box bianco del modale
    if (e.target === overlay) closeModal();
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.style.display !== 'none') {
      closeModal();
    }
  });

  // 5. Logica di Invio Dati (Network Manager)
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Feedback visivo immediato all'utente
    if (submitBtn) submitBtn.disabled = true;
    if (submitTxt) submitTxt.textContent = 'Invio in corso…';
    
    if (status) {
      status.innerHTML = '';
      status.className = 'loading';
    }

    // Preparazione pacchetto dati
    const formData   = new FormData(form);
    const dataParams = new URLSearchParams();
    for (const [k, v] of formData) {
      dataParams.append(k, v);
    }

    // Chiamata asincrona al server
    fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: dataParams
    })
    .then(res => {
      if (!res.ok) throw new Error('HTTP Error: ' + res.status);
      return res.json();
    })
    .then(data => {
      if (data.status === 'success') {
        if (status) {
          status.innerHTML = '✦ ' + data.text;
          status.className = 'wa-status--success';
        }
        form.reset(); // Pulisce i campi
        setTimeout(closeModal, 2500); // Chiude il modale in automatico dopo 2.5s
      } else {
        if (status) {
          status.innerHTML = data.text;
          status.className = 'wa-status--error';
        }
      }
    })
    .catch(err => {
      console.error("whatsapp.js Error:", err);
      if (status) {
        status.innerHTML = 'Errore di connessione. Riprova.';
        status.className = 'wa-status--error';
      }
    })
    .finally(() => {
      // Ripristina il bottone al termine, sia in caso di successo che di errore
      if (submitBtn) submitBtn.disabled = false;
      if (submitTxt) submitTxt.textContent = 'Invia su WhatsApp';
    });
  });

});
