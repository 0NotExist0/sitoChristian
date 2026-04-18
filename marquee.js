/* ============================================================
   MARQUEE ENGINE — SISTEMA OLYMPUS (VERSIONE UNIVERSALE)
   ============================================================ */

class InfiniteMarquee {
    constructor(trackId) {
        this.track = document.getElementById(trackId);
        if (!this.track) return;

        this.imgIndex = 0;
        this.images   = [];
        this.init();
    }

    /**
     * Trasforma i link Drive per renderli visibili nei tag <img>
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
        return id ? `https://drive.google.com/uc?export=view&id=${id}` : url;
    }

    /**
     * SCANSIONE TOTALE: Cerca ogni immagine presente nel JSON
     * ignorando la struttura delle cartelle (trova tutto!)
     */
    findAllImages(obj) {
        let results = [];
        if (!obj) return results;

        const isImage = (str) => typeof str === 'string' && /\.(jpg|jpeg|png|webp)$/i.test(str);

        const search = (current) => {
            if (typeof current === 'string') {
                if (isImage(current)) results.push(current);
            } else if (Array.isArray(current)) {
                current.forEach(item => search(item));
            } else if (typeof current === 'object') {
                for (let key in current) {
                    // Prende il valore se è un URL immagine, o continua a scavare
                    if ((key === 'url' || key === 'link') && isImage(current[key])) {
                        results.push(current[key]);
                    } else {
                        search(current[key]);
                    }
                }
            }
        };

        search(obj);
        return results;
    }

    nextImageTag() {
        if (this.images.length === 0) return '';

        const item = this.images[this.imgIndex % this.images.length];
        this.imgIndex++;

        const finalSrc = this.formatDriveUrl(item);

        return `<img
            src="${finalSrc}"
            class="marquee-img"
            loading="lazy"
            alt="Porta Nova"
            onerror="this.style.display='none';"
        >`;
    }

    createSegment() {
        return `
            <span>MADE IN ITALY</span><span class="sep">◈</span>
            ${this.nextImageTag()}<span class="sep">◈</span>
            <span>DESIGN ESCLUSIVO</span><span class="sep">◈</span>
            ${this.nextImageTag()}<span class="sep">◈</span>
            <span>RIVESTIMENTO</span><span class="sep">◈</span>
            ${this.nextImageTag()}<span class="sep">◈</span>
        `;
    }

    buildMarquee() {
        if (this.images.length === 0) return;
        
        this.track.innerHTML = '';
        this.imgIndex = 0;

        // Mescoliamo le foto caricate
        this.images = this.images.sort(() => Math.random() - 0.5);

        let totalHtml = '';
        for (let i = 0; i < 8; i++) totalHtml += this.createSegment();
        
        const container = document.createElement('div');
        container.className = 'marquee-content';
        container.innerHTML = totalHtml;
        
        this.track.appendChild(container);
        this.track.appendChild(container.cloneNode(true));
    }

    init() {
        // Aspetta che i dati siano pronti
        if (!window.galleryData) {
            setTimeout(() => this.init(), 1000);
            return;
        }

        console.log("Marquee: Avvio scansione automatica...");
        
        // Cerca TUTTE le immagini in window.galleryData
        this.images = this.findAllImages(window.galleryData);
        
        console.log("Marquee: Trovate " + this.images.length + " immagini.");

        if (this.images.length > 0) {
            this.buildMarquee();
        }
    }
}

// Avvio
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new InfiniteMarquee('dynamicMarquee');
    }, 500);
});
