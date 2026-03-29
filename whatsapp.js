/* whatsapp.js — Luxury Doors WhatsApp Widget */

(function () {
  const fab     = document.getElementById('wa-fab');
  const overlay = document.getElementById('wa-overlay');
  const btnClose= document.getElementById('wa-modal-close');
  const form    = document.getElementById('wa-form');
  const submit  = document.getElementById('wa-submit');
  const submitTxt = document.getElementById('wa-submit-text');
  const status  = document.getElementById('wa-status');

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxhAPZVyp1vHgVcQQxCXDDc8UES1Jwn1WDkgdlqBoG-kRgSOVbUwODgz4c6GZoti8Y2/exec';

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // riusa il cursore custom del sito se presente
    if (typeof updateCursor === 'function') updateCursor();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  fab.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    submit.disabled = true;
    submitTxt.textContent = 'Invio in corso…';
    status.innerHTML = '';
    status.className = '';

    const formData   = new FormData(form);
    const dataParams = new URLSearchParams();
    for (const [k, v] of formData) dataParams.append(k, v);

    fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: dataParams
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data.status === 'success') {
          status.innerHTML = '✦ ' + data.text;
          status.className = 'wa-status--success';
          form.reset();
          setTimeout(closeModal, 2400);
        } else {
          status.innerHTML = data.text;
          status.className = 'wa-status--error';
        }
      })
      .catch(function (err) {
        console.error(err);
        status.innerHTML = 'Errore di connessione. Riprova.';
        status.className = 'wa-status--error';
      })
      .finally(function () {
        submit.disabled = false;
        submitTxt.textContent = 'Invia su WhatsApp';
      });
  });
})();<script>
      document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const btn = document.getElementById('submitBtn');
        const status = document.getElementById('status');
        
        btn.disabled = true;
        btn.innerText = "Invio in corso...";
        status.innerHTML = "";
        status.className = "loading";

        // Il link esatto della tua Versione 6
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxhAPZVyp1vHgVcQQxCXDDc8UES1Jwn1WDkgdlqBoG-kRgSOVbUwODgz4c6GZoti8Y2/exec'; 
        
        // Estraiamo i dati dal form in modo leggibile per Google Apps Script
        const formData = new FormData(this);
        const dataParams = new URLSearchParams();
        for (const pair of formData) {
            dataParams.append(pair[0], pair[1]);
        }

        fetch(scriptURL, { 
            method: 'POST', 
            // Diciamo a Google esplicitamente che tipo di dati stiamo mandando
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: dataParams
        })
        .then(response => {
            if (!response.ok) throw new Error("Errore di rete HTTP: " + response.status);
            return response.json();
        })
        .then(data => {
            if(data.status === "success") {
              status.innerHTML = data.text;
              status.className = "success";
              document.getElementById('contactForm').reset();
            } else {
              status.innerHTML = data.text;
              status.className = "error";
            }
            btn.disabled = false;
            btn.innerText = "Invia su WhatsApp";
        })
        .catch(error => {
            console.error("Dettaglio Errore:", error);
            status.innerHTML = "Errore di connessione. Riprova.";
            status.className = "error";
            btn.disabled = false;
            btn.innerText = "Riprova";
        });
      });
    </script>
