/* ============================================================
   INFINITE MARQUEE ENGINE
   Gestisce il loop infinito della striscia di testo adattandosi
   dinamicamente alla larghezza dello schermo e allo zoom.
   ============================================================ */

class InfiniteMarquee {
    constructor(trackId) {
        this.track = document.getElementById(trackId);
        if (!this.track) return;

        // 1. La stringa base da ripetere (modifica i testi qui se serve)
        this.baseHTML = `
            <span>MADE IN ITALY</span><span class="sep">◈</span>
            <span>🇮🇹 🇮🇹 🇮🇹 🇮🇹</span><span class="sep">◈</span>
            <span>DESIGN ESCLUSIVO</span><span class="sep">◈</span>
            <span>🇮🇹 🇮🇹 🇮🇹 🇮🇹</span><span class="sep">◈</span>
        `;

        this.resizeTimer = null;
        this.init();
    }

    init() {
        this.buildMarquee();
        this.addEventListeners();
    }

    buildMarquee() {
        // Svuota la traccia prima di ogni ricalcolo per evitare duplicati
        this.track.innerHTML = '';
        
        // 2. Crea un nodo temporaneo invisibile per misurare lo spazio reale occupato dal testo
        const temp = document.createElement('div');
        temp.style.display = 'inline-flex';
        temp.style.visibility = 'hidden';
        temp.style.position = 'absolute';
        temp.className = 'marquee-content'; 
        temp.innerHTML = this.baseHTML;
        document.body.appendChild(temp);
        
        // Calcola la larghezza esatta al pixel del singolo blocco
        const blockWidth = temp.getBoundingClientRect().width;
        document.body.removeChild(temp);

        // Fallback di sicurezza: se il font/CSS non è ancora caricato, usa un valore base
        const safeBlockWidth = blockWidth > 0 ? blockWidth : 300;

        // 3. Calcola quante copie servono per coprire l'intero schermo 
        // Aggiungiamo +2 per garantire un margine di sicurezza abbondante fuori schermo
        const copiesNeeded = Math.ceil(window.innerWidth / safeBlockWidth) + 2;
        
        // Genera la stringa HTML completa ripetendo il blocco base
        let fullHTML = '';
        for(let i = 0; i < copiesNeeded; i++) {
            fullHTML += this.baseHTML;
        }

        // 4. Crea i due maxi-blocchi per l'animazione CSS (che traslerà da 0 a -50%)
        const content1 = document.createElement('div');
        content1.className = 'marquee-content';
        content1.innerHTML = fullHTML;

        const content2 = document.createElement('div');
        content2.className = 'marquee-content';
        content2.setAttribute('aria-hidden', 'true'); // Nasconde il duplicato agli screen reader
        content2.innerHTML = fullHTML;

        // Inserisce i blocchi nel DOM
        this.track.appendChild(content1);
        this.track.appendChild(content2);
    }

    addEventListeners() {
        // 5. Ricalcola tutto se l'utente ridimensiona o zooma la finestra
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            // Il Debounce (250ms) evita che lo script ricalcoli 100 volte al secondo durante il trascinamento della finestra
            this.resizeTimer = setTimeout(() => {
                this.buildMarquee();
            }, 250);
        });
    }
}

// Inizializza il motore quando il DOM è pronto
document.addEventListener("DOMContentLoaded", () => {
    new InfiniteMarquee('dynamicMarquee');
});
