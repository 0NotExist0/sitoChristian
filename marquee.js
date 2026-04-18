/* ============================================================
   MARQUEE ENGINE — SISTEMA OLYMPUS (VERSIONE FINALE)
   ============================================================ */

class InfiniteMarquee {
    constructor(trackId) {
        this.track = document.getElementById(trackId);
        if (!this.track) return;

        /* ── CONFIGURA QUI I NOMI FILE ──────────────────────────
           Sostituisci con i nomi esatti delle tue immagini.
           Il percorso basePath deve corrispondere alla cartella
           dove si trovano i file sul server.
        ─────────────────────────────────────────────────────── */
        this.rivestimenti = [
            'legno-scuro.jpg',
            'alluminio-satinato.jpg',
            'noce-nazionale.jpg',
            'alluminio-titanio.jpg',
            'rovere-antico.jpg'
        ];

        /* Percorso relativo dalla radice del sito.
           Esempi validi:
             'assets/img/rivestimenti/'
             'img/rivestimenti/'
             'rivestimenti/'
        */
        this.basePath    = 'assets/img/rivestimenti/';
        this.resizeTimer = null;
        this.imgIndex    = 0;

        this.init();
    }

    /* ── Immagine con gestione errore ── */
    nextImageTag() {
        const name = this.rivestimenti[this.imgIndex % this.rivestimenti.length];
        const src  = `${this.basePath}${name}`;
        this.imgIndex++;

        /* onerror: se il file non esiste, l'immagine viene nascosta
           senza mostrare il broken-image con il testo alt */
        return `<img
            src="${src}"
            class="marquee-img"
            loading="lazy"
            alt=""
            draggable="false"
            onerror="this.classList.add('broken')"
        >`;
    }

    /* ── Un segmento di contenuto ── */
    createSegment() {
        return `
            <span>MADE IN ITALY</span><span class="sep">◈</span>
            ${this.nextImageTag()}<span class="sep">◈</span>
            <span>DESIGN ESCLUSIVO</span><span class="sep">◈</span>
            ${this.nextImageTag()}<span class="sep">◈</span>
            <span>Rivestimento</span><span class="sep">◈</span>
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

    init() {
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
