<script>
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
