/* ============================================================
   MARQUEE ENGINE — SISTEMA OLYMPUS (VERSIONE DRIVE-READY)
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
     * Trasforma i link Drive standard in link diretti per i tag IMG
     */
    formatDriveUrl(url) {
        if (!url || typeof url !== 'string') return '';
        if (url.includes('drive.google.com') && (url.includes('/file/d/') || url.includes('id='))) {
            let id = '';
            if (url.includes('/file/d/')) {
                id = url.split('/file/d/')[1].split('/')[0];
            } else {
                const urlParams = new URLSearchParams(url.split('?')[1]);
                id = urlParams.get('id');
            }
            return `https://drive.google.com/uc?export=view&id=${id}`;
        }
        return url;
    }

    /**
     * Estrae l'URL pulito dall'item (che sia stringa o oggetto)
     */
    nextImageTag() {
        if (this.images.length === 0) return '';

        const item = this.images[this.imgIndex % this.images.length];
        this.imgIndex++;

        let rawUrl = "";
        if (typeof item === 'string') {
            rawUrl = item;
        } else if (item && typeof item === 'object') {
            rawUrl = item.url || item.src || item.link || "";
        }

        const finalSrc = this.formatDriveUrl(rawUrl);

        if (!finalSrc || finalSrc.includes('[object')) {
            return `<span style="display:none"></span>`;
        }

        return `<img
            src="${finalSrc}"
            class="marquee-img"
            loading="lazy"
            alt="Porta Nova Design"
            draggable="false"
            onerror="this.style.display='none'; this.parentElement.querySelectorAll('.sep').forEach(s => s.style.display='none')"
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
        const w = probe.scrollWidth || 600;
        document.body.removeChild(probe);
        return w;
    }

    buildMarquee() {
        if (this.images.length === 0) return;
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

        document.addEventListener('visibilitychange', () => {
            this.track.style.animationPlayState = document.hidden ? 'paused' : 'running';
        });
    }

    init() {
        // Aspetta che i dati di Drive siano caricati dal CatalogManager
        if (!window.galleryData || Object.keys(window.galleryData).length === 0) {
            setTimeout(() => this.init(), 200);
            return;
        }

        let dataNode = window.galleryData;
        
        // Se è stata specificata una cartella (es. 'Lisce'), cercala
        if (this.targetFolder && typeof DataEngine !== 'undefined') {
            const found = DataEngine.findFolder(window.galleryData, this.targetFolder);
            if (found) dataNode = found;
        }

        // Estrazione immagini tramite il tuo DataEngine esistente
        if (typeof DataEngine !== 'undefined') {
            this.images = DataEngine.extractImages(dataNode);
        }

        // Fallback se Drive è vuoto
        if (this.images.length === 0) {
            console.warn("Marquee: Nessuna immagine trovata in window.galleryData");
            this.images = ["https://images.unsplash.com/photo-1615873968403-89e068629275?q=80&w=600&auto=format&fit=crop"];
        }

        this.buildMarquee();
        this.addEventListeners();
    }
}

/* ── Avvio ── */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dynamicMarquee')) {
        // null = usa tutto il catalogo. Inserisci 'Lisce' o 'Rivestimenti in Legno' per filtrare.
        new InfiniteMarquee('dynamicMarquee', null);
    }
});
