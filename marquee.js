/* ============================================================
   MARQUEE ENGINE AGGIORNATO (SISTEMA OLYMPUS)
   Analizza e utilizza i sistemi di rivestimento già implementati
   ============================================================ */

class InfiniteMarquee {
    constructor(trackId) {
        this.track = document.getElementById(trackId);
        if (!this.track) return;

        // Recupero l'elenco delle foto dai sistemi che abbiamo già definito
        // Se hai una cartella dedicata, lo script pescherà i nomi da qui
        this.rivestimenti = [
            'legno-scuro.jpg', 'alluminio-satinato.jpg', 
            'noce-nazionale.jpg', 'alluminio-titanio.jpg',
            'rovere-antico.jpg'
        ];
        
        this.basePath = 'assets/img/rivestimenti/'; // Il percorso che usiamo nel progetto
        this.resizeTimer = null;
        this.init();
    }

    init() {
        this.buildMarquee();
        this.addEventListeners();
    }

    // Funzione per generare un'immagine casuale dal set dei rivestimenti
    generateImageTag() {
        const imgName = this.rivestimenti[Math.floor(Math.random() * this.rivestimenti.length)];
        return `<img src="${this.basePath}${imgName}" class="marquee-img" loading="lazy" alt="Rivestimento">`;
    }

    buildMarquee() {
        this.track.innerHTML = '';
        
        // Struttura del blocco che alterna il Made in Italy alle foto reali
        const createSegment = () => `
            <span>MADE IN ITALY</span><span class="sep">◈</span>
            ${this.generateImageTag()}<span class="sep">◈</span>
            <span>DESIGN ESCLUSIVO</span><span class="sep">◈</span>
            ${this.generateImageTag()}<span class="sep">◈</span>
        `;

        // Calcolo della larghezza per il loop infinito (già testato nei tuoi codici precedenti)
        const temp = document.createElement('div');
        temp.className = 'marquee-content';
        temp.style.visibility = 'hidden';
        temp.style.position = 'absolute';
        temp.innerHTML = createSegment();
        document.body.appendChild(temp);
        const segmentWidth = temp.offsetWidth || 500;
        document.body.removeChild(temp);

        const copies = Math.ceil(window.innerWidth / segmentWidth) + 2;
        let finalHTML = "";
        for (let i = 0; i < copies; i++) {
            finalHTML += createSegment();
        }

        // Creazione dei due blocchi per il seamless loop (SISTEMA STANDARD)
        const content1 = document.createElement('div');
        content1.className = 'marquee-content';
        content1.innerHTML = finalHTML;

        const content2 = content1.cloneNode(true);
        content2.setAttribute('aria-hidden', 'true');

        this.track.appendChild(content1);
        this.track.appendChild(content2);
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.buildMarquee(), 250);
        });
    }
}

// Inizializzazione automatica
document.addEventListener("DOMContentLoaded", () => {
    if(document.getElementById('dynamicMarquee')) {
        new InfiniteMarquee('dynamicMarquee');
    }
});
