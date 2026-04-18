/* ============================================================
   MARQUEE ENGINE — SISTEMA OLYMPUS (VERSIONE BLINDATA)
   ============================================================ */

class InfiniteMarquee {
    constructor(trackId, targetFolder = null) {
        this.track = document.getElementById(trackId);
        if (!this.track) return;

        this.resizeTimer = null;
        this.imgIndex    = 0;
        this.images      = [];
        this.targetFolder = targetFolder;

        this.init();
    }

    /**
     * Convertitore universale per Google Drive
     */
    formatDriveUrl(url) {
        if (!url || typeof url !== 'string') return '';
        
        // Se è già un link diretto o un placeholder, non toccarlo
        if (url.includes('googleusercontent.com') || url.includes('unsplash')) return url;

        // Estrazione ID per link tipo /file/d/ID/... o ?id=ID
        let id = '';
        if (url.includes('/file/d/')) {
            id = url.split('/file/d/')[1].split('/')[0].split('?')[0];
        } else if (url.includes('id=')) {
            const parts = url.split('id=')[1];
            id = parts.split('&')[0];
        }

        if (id) {
            // Formato più affidabile per il rendering diretto
            return `https://lh3.googleusercontent.com/d/${id}`;
        }
        
        return url;
    }

    nextImageTag() {
        // Se non ci sono immagini, usiamo un placeholder elegante invece di sparire
        const placeholder = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=300&auto=format&fit=crop";
        
        let rawUrl = placeholder;
        if (this.images.length > 0) {
            const item = this.images[this.imgIndex % this.images.length];
            rawUrl = (typeof item === 'string') ? item : (item.url || item.src || placeholder);
            this.imgIndex++;
        }

        const finalSrc = this.formatDriveUrl(rawUrl);

        // NOTA: Ho rimosso display='none' così i riquadri NON spariscono più
        return `<img
            src="${finalSrc}"
            class="marquee-img"
            loading="lazy"
            alt="Porta Nova"
            draggable="false"
            onerror="this.src='${placeholder}'; this.classList.add('broken-img');"
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

    measureSegmentWidth() {
        const probe = document.createElement('div');
        probe.className = 'marquee-content';
        probe.style.cssText = `visibility:hidden; position:absolute; top:-9999px; display:inline-flex; align-items:center; white-space:nowrap;`;
        probe.innerHTML = this.createSegment();
        document.body.appendChild(probe);
        const w = probe.scrollWidth || 800;
        document.body.removeChild(probe);
        return w;
    }

    buildMarquee() {
        this.track.innerHTML = '';
        this.imgIndex = 0;

        const segmentWidth = this.measureSegmentWidth();
        const copies = Math.ceil((window.innerWidth * 2) / segmentWidth) + 3;

        let html = '';
        for (let i = 0; i < copies; i++) html += this.createSegment();

        const blockA = document.createElement('div');
        blockA.className = 'marquee-content';
        blockA.innerHTML = html;

        const blockB = blockA.cloneNode(true);
        blockB.setAttribute('aria-hidden', 'true');

        this.track.appendChild(blockA);
        this.track.appendChild(blockB);
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.buildMarquee(), 250);
        });
    }

    init() {
        // Controllo se i dati esistono, altrimenti riprova
        if (!window.galleryData) {
            setTimeout(() => this.init(), 500);
            return;
        }

        // Estrazione immagini
        if (typeof DataEngine !== 'undefined') {
            let dataNode = window.galleryData;
            if (this.targetFolder) {
                const found = DataEngine.findFolder(window.galleryData, this.targetFolder);
                if (found) dataNode = found;
            }
            this.images = DataEngine.extractImages(dataNode);
        }

        console.log("Marquee caricato con", this.images.length, "immagini.");
        
        this.buildMarquee();
        this.addEventListeners();
    }
}

/* ── Avvio ── */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dynamicMarquee')) {
        new InfiniteMarquee('dynamicMarquee');
    }
});
