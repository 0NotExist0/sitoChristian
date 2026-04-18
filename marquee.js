/* ============================================================
   MARQUEE ENGINE — SISTEMA OLYMPUS (JS AGGIORNATO)
   Loop infinito seamless · Immagini a dimensione corretta
   ============================================================ */

class InfiniteMarquee {
    constructor(trackId) {
        this.track = document.getElementById(trackId);
        if (!this.track) return;

        this.rivestimenti = [
            'legno-scuro.jpg',
            'alluminio-satinato.jpg',
            'noce-nazionale.jpg',
            'alluminio-titanio.jpg',
            'rovere-antico.jpg'
        ];

        this.basePath    = 'assets/img/rivestimenti/';
        this.resizeTimer = null;
        this.imgIndex    = 0; // indice progressivo per non ripetere la stessa img di fila

        this.init();
    }

    /* ── Immagine sequenziale (evita ripetizioni consecutive) ── */
    nextImageTag() {
        const src = `${this.basePath}${this.rivestimenti[this.imgIndex % this.rivestimenti.length]}`;
        this.imgIndex++;
        return `<img src="${src}" class="marquee-img" loading="lazy" alt="Rivestimento" draggable="false">`;
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

    /* ── Misura la larghezza reale di un segmento ── */
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

        // Aspetta che le img carichino almeno il layout
        const w = probe.scrollWidth || probe.offsetWidth || 600;
        document.body.removeChild(probe);
        return w;
    }

    /* ── Costruisce il marquee ── */
    buildMarquee() {
        this.track.innerHTML = '';
        this.imgIndex = 0;

        const segmentWidth = this.measureSegmentWidth();
        const copies = Math.ceil((window.innerWidth * 2) / segmentWidth) + 3;

        // Blocco A
        const blockA = document.createElement('div');
        blockA.className = 'marquee-content';

        let html = '';
        for (let i = 0; i < copies; i++) html += this.createSegment();
        blockA.innerHTML = html;

        // Blocco B — clone esatto di A per il loop -50%
        const blockB = blockA.cloneNode(true);
        blockB.setAttribute('aria-hidden', 'true');

        this.track.appendChild(blockA);
        this.track.appendChild(blockB);

        /* 
         * L'animazione translateX(-50%) sul track funziona perché
         * blockA e blockB sono identici → il track è esattamente
         * il doppio di un blocco, quindi a metà l'occhio non vede stacchi.
         *
         * La durata è già definita in CSS con --marquee-speed.
         * Qui possiamo sovrascriverla dinamicamente se serve:
         */
        const speed = Math.max(20, Math.round(segmentWidth * copies / 30)); // ~30px/s
        this.track.style.setProperty('--marquee-speed-computed', `${speed}s`);
    }

    /* ── Event listeners ── */
    addEventListeners() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.buildMarquee(), 250);
        });

        // Pausa se la scheda è in background (risparmio CPU)
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

/* ── Avvio automatico ── */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dynamicMarquee')) {
        new InfiniteMarquee('dynamicMarquee');
    }
});
