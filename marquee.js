/* ============================================================
   MARQUEE ENGINE — PORTA NOVA (VERSIONE ANTI-FLICKER)
   ============================================================ */

class InfiniteMarquee {
    constructor(trackId) {
        this.track = document.getElementById(trackId);
        if (!this.track) return;

        this.images = [];
        this.imgIndex = 0;
        this.isInitialized = false;
        this.init();
    }

    /**
     * Trasforma l'ID Drive in un link immagine ad alta compatibilità
     */
    formatDriveUrl(url) {
        if (!url || typeof url !== 'string') return '';
        let id = '';
        if (url.includes('/file/d/')) {
            id = url.split('/file/d/')[1].split('/')[0];
        } else if (url.includes('id=')) {
            const match = url.match(/id=([^&]+)/);
            id = match ? match[1] : '';
        }
        
        // Formato alternativo più stabile per evitare i blocchi di Google
        return id ? `https://lh3.googleusercontent.com/d/${id}` : url;
    }

    nextImageTag() {
        if (this.images.length === 0) return '';

        const item = this.images[this.imgIndex % this.images.length];
        this.imgIndex++;

        const finalSrc = this.formatDriveUrl(item);
        
        // Placeholder neutro (un rettangolo dorato sfumato) se l'immagine fallisce
        const fallback = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

        // RIMOSSO display='none'. Ora se c'è un errore mette il fallback ma NON sparisce.
        return `<img
            src="${finalSrc}"
            class="marquee-img"
            alt="Porta Nova"
            loading="eager" 
            onerror="this.onerror=null; this.src='${fallback}'; this.style.opacity='0.5';"
        >`;
    }

    createSegment() {
        // Aumentiamo i separatori per dare stabilità visiva
        return `
            <span>MADE IN ITALY</span><span class="sep">◈</span>
            ${this.nextImageTag()}<span class="sep">◈</span>
            <span>DESIGN ESCLUSIVO</span><span class="sep">◈</span>
            ${this.nextImageTag()}<span class="sep">◈</span>
            <span>RIVESTIMENTO</span><span class="sep">◈</span>
            ${this.nextImageTag()}<span class="sep">◈</span>
        `;
    }

    build() {
        if (this.images.length === 0 || this.isInitialized) return;
        
        this.track.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'marquee-content';

        // Generiamo una stringa lunga per evitare "salti" nell'animazione
        let htmlContent = '';
        for (let i = 0; i < 12; i++) {
            htmlContent += this.createSegment();
        }

        container.innerHTML = htmlContent;
        
        // Cloniamo per l'effetto infinito
        const clone = container.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');

        this.track.appendChild(container);
        this.track.appendChild(clone);
        
        this.isInitialized = true;
        console.log("Marquee: Build completata con " + this.images.length + " immagini.");
    }

    init() {
        // Aspettiamo che window.galleryData e DataEngine siano pronti
        if (!window.galleryData || typeof DataEngine === 'undefined') {
            setTimeout(() => this.init(), 300);
            return;
        }

        // Recuperiamo i file usando il TUO DataEngine
        // Cerchiamo in Alluminio e Legno come da tua richiesta
        const folders = ['Rivestimenti in alluminio + inseriti', 'Rivestimenti in Legno', 'Pannelli in alluminio'];
        let allImgs = [];

        folders.forEach(f => {
            const data = DataEngine.findFolder(window.galleryData, f);
            if (data) {
                allImgs = allImgs.concat(DataEngine.extractImages(data));
            }
        });

        // Se non trova nulla nelle cartelle specifiche, pesca ovunque
        if (allImgs.length === 0) {
            allImgs = DataEngine.extractImages(window.galleryData);
        }

        // Mescola a caso
        this.images = allImgs.sort(() => Math.random() - 0.5);

        if (this.images.length > 0) {
            this.build();
        }
    }
}

// Avvio rapido
document.addEventListener('DOMContentLoaded', () => {
    new InfiniteMarquee('dynamicMarquee');
});
