/**
 * FormManager - Gestione invio modulo contatti tramite Google Apps Script
 * Integra la logica di invio POST con il feedback visivo del sito Luxury Doors.
 */
const FormManager = {
    // Il tuo nuovo URL dello script Google
    scriptURL: 'https://script.google.com/macros/s/AKfycbwGBlkpRAz2PD4pWrDwzY8TPDw25TsDCnPerlpAV13y3dRth1TmQFus3JxrPf7i7MbDeQ/exec',

    init() {
        this.form = document.getElementById("contactForm");
        this.successMsg = document.getElementById("formSuccess");
        this.submitBtn = document.querySelector(".form-submit");
        this.btnText = this.submitBtn ? this.submitBtn.querySelector('.form-submit__text') : null;

        if (!this.form) return;

        this.setupEventListeners();
    },

    setupEventListeners() {
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    },

    async handleSubmit() {
        // 1. Stato di caricamento (UI feedback)
        this.setLoadingState(true);

        // 2. Preparazione dati per Google Apps Script
        // Trasformiamo i dati del form in URLSearchParams per compatibilità POST
        const formData = new FormData(this.form);
        const data = new URLSearchParams(formData);

        try {
            // 3. Invio della richiesta fetch
            await fetch(this.scriptURL, {
                method: 'POST',
                mode: 'no-cors', // Necessario per evitare blocchi CORS con Google Script
                body: data
            });

            // 4. Successo (Nota: con no-cors non leggiamo la risposta, ma l'invio è asincrono)
            this.handleSuccess();

        } catch (error) {
            console.error('Errore durante l\'invio:', error);
            alert('Si è verificato un errore di rete. Riprova più tardi.');
            this.setLoadingState(false);
        }
    },

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.style.opacity = "0.5";
            this.submitBtn.style.pointerEvents = "none";
            if (this.btnText) this.btnText.textContent = "Invio in corso...";
        } else {
            this.submitBtn.style.opacity = "1";
            this.submitBtn.style.pointerEvents = "all";
            if (this.btnText) this.btnText.textContent = "Invia il Messaggio";
        }
    },

    handleSuccess() {
        // Pulizia form e mostra messaggio di conferma
        this.form.reset();
        
        // Nascondiamo il pulsante e mostriamo il messaggio di successo (animato via CSS)
        if (this.submitBtn) this.submitBtn.style.display = "none";
        if (this.successMsg) {
            this.successMsg.classList.add("visible");
        }
    }
};

// Inizializzazione al caricamento del DOM
document.addEventListener('DOMContentLoaded', () => {
    FormManager.init();
});