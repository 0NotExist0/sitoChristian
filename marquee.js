/* ============================================================
   MARQUEE ENGINE — SISTEMA OLYMPUS (INTEGRATO CON DRIVE)
   ============================================================ */

class InfiniteMarquee {
    constructor(trackId, targetFolder = null) {
        this.track = document.getElementById(trackId);
        if (!this.track) return;

        this.resizeTimer = null;
        this.imgIndex    = 0;
        this.images      = []; // Verrà popolato da Drive
        this.targetFolder = targetFolder; // Nome cartella opzionale

        this.init();
    }

    /* ── Immagine dal Drive con gestione errore ── */
    nextImageTag() {
        const src = this.images[this.imgIndex % this.images.length];
        this.imgIndex++;

        return `<img
            src="${src}"
            class="marquee-img"
            loading="lazy"
            alt="Porta Nova Design"
            draggable="false"
            onerror="this.style.display='none'"
        >`;
    }

    /* ── Un segmento di contenuto ── */
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

    /* ── Misura la larghezza di un segmento ── */
    measureSegmentWidth() {
        const probe = document.createElement('div');
        probe.className   = 'marquee-content';
        probe.style.cssText = `
            visibility: hidden;
            position:   absolute;
            top:        -9999px;
            left:       0;
            display:    inline-flex;
            align-items: center;
            white-space: nowrap;
        `;
        probe.innerHTML = this.createSegment();
        document.body.appendChild(probe);
        const w = probe.scrollWidth || 600;
        document.body.removeChild(probe);
        return w;
    }

    /* ── Costruisce il marquee ── */
    buildMarquee() {
        this.track.innerHTML = '';
        this.imgIndex = 0;

        const segmentWidth = this.measureSegmentWidth();
        const copies = Math.ceil((window.innerWidth * 2) / segmentWidth) + 3;

        let html = '';
        for (let i = 0; i < copies; i++) html += this.createSegment();

        /* Blocco A */
        const blockA = document.createElement('div');
        blockA.className = 'marquee-content';
        blockA.innerHTML = html;

        /* Blocco B — clone identico per il loop seamless -50% */
        const blockB = blockA.cloneNode(true);
        blockB.setAttribute('aria-hidden', 'true');

        this.track.appendChild(blockA);
        this.track.appendChild(blockB);
    }

    /* ── Event listeners ── */
    addEventListeners() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.buildMarquee(), 250);
        });

        document.addEventListener('visibilitychange', () => {
            this.track.style.animationPlayState =
                document.hidden ? 'paused' : 'running';
        });
    }

    /* ── Inizializzazione asincrona con Drive ── */
    init() {
        // Se window.galleryData non è ancora pronto, riprova tra poco
        if (!window.galleryData) {
            setTimeout(() => this.init(), 100);
            return;
        }

        // Estrazione delle immagini tramite il DataEngine
        let dataNode = window.galleryData;
        if (this.targetFolder) {
            const foundData = DataEngine.findFolder(window.galleryData, this.targetFolder);
            if (foundData) dataNode = foundData;
        }

        this.images = DataEngine.extractImages(dataNode);

        // Fallback di sicurezza se non ci sono immagini nella cartella
        if (this.images.length === 0) {
            this.images = ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"];
        }

        this.buildMarquee();
        this.addEventListeners();
    }
}

/* ── Avvio ── */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dynamicMarquee')) {
        // Puoi passare null per usare tutte le immagini del Drive,
        // oppure una stringa (es. 'Rivestimenti in Legno') per una specifica cartella.
        new InfiniteMarquee('dynamicMarquee', null); 
    }
});
