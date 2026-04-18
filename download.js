/**
 * DOWNLOAD MANAGER — Luxury Doors
 * Gestisce l'area download con anteprima interattiva (flipbook) e scaricamento PDF.
 */

const DownloadManager = {
    isInitialized: false,

    // 🎛️ CONFIGURAZIONE DOWNLOAD
    // Inserisci qui il link al PDF reale ("downloadUrl") che gli utenti scaricheranno.
    catalogs: [
        {
            title: "Pannelli Alluminio 1",
            previewUrl: "https://www.sfogliami.it/fl/322021/t618zm2s44f54xqpdxxpzyp3rtep2p",
            downloadUrl: "assets/catalogo_1.pdf" // Sostituisci con il percorso reale del tuo PDF
        },
        {
            title: "Pannelli Alluminio 2",
            previewUrl: "https://www.sfogliami.it/fl/322020/pp74s3m9g9g5pdrybcvpyxxtqqxzff77",
            downloadUrl: "assets/catalogo_2.pdf" // Sostituisci con il percorso reale del tuo PDF
        }
    ],

    init() {
        if (this.isInitialized) return;
        this.buildUI();
        this.injectStyles();
        this.isInitialized = true;
    },

    buildUI() {
        this.modal = document.createElement('div');
        this.modal.className = 'dl-modal';
        
        let gridHtml = '';
        this.catalogs.forEach((cat, index) => {
            gridHtml += `
                <div class="dl-card">
                    <div class="dl-card__preview">
                        <iframe src="${cat.previewUrl}" frameborder="0" allowfullscreen loading="lazy"></iframe>
                    </div>
                    <div class="dl-card__content">
                        <h3 class="dl-card__title">${cat.title}</h3>
                        <a href="${cat.downloadUrl}" download class="gold-btn dl-btn">
                            <span class="gold-btn__text">SCARICA PDF ⤓</span>
                        </a>
                    </div>
                </div>
            `;
        });

        this.modal.innerHTML = `
            <div class="dl-overlay"></div>
            <div class="dl-content">
                <button class="dl-close">✕ Chiudi</button>
                <div class="dl-header">
                    <p class="section-label centered">/ Area Documentazione</p>
                    <h2 class="dl-title">Download <em>Cataloghi</em></h2>
                    <p class="dl-subtitle">Sfoglia l'anteprima interattiva o scarica la versione PDF ad alta risoluzione.</p>
                </div>
                <div class="dl-grid">
                    ${gridHtml}
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);

        // Eventi di chiusura
        this.modal.querySelector('.dl-close').addEventListener('click', () => this.close());
        this.modal.querySelector('.dl-overlay').addEventListener('click', () => this.close());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) this.close();
        });
    },

    injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .dl-modal { position: fixed; inset: 0; z-index: 3000; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.4s ease; }
            .dl-modal.active { display: flex; opacity: 1; }
            .dl-overlay { position: absolute; inset: 0; background: rgba(5, 5, 5, 0.95); backdrop-filter: blur(15px); }
            .dl-content { position: relative; z-index: 1; width: 90%; max-width: 1200px; max-height: 90vh; overflow-y: auto; background: #0f0f12; border: 1px solid var(--border-lg); padding: 3rem; box-shadow: 0 30px 60px rgba(0,0,0,0.9); }
            .dl-close { position: absolute; top: 20px; right: 20px; background: none; border: none; color: var(--gold-lt); font-family: var(--ff-body); font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: 0.3s; }
            .dl-close:hover { color: #fff; text-shadow: 0 0 10px var(--gold); transform: scale(1.05); }
            .dl-header { text-align: center; margin-bottom: 3rem; }
            .dl-title { font-family: var(--ff-display); font-size: clamp(2.5rem, 4vw, 3.5rem); color: #fff; line-height: 1; margin-bottom: 1rem; text-transform: uppercase; }
            .dl-title em { color: var(--gold); font-style: normal; }
            .dl-subtitle { color: var(--text-dim); font-size: 0.9rem; letter-spacing: 1px; }
            .dl-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 3rem; }
            .dl-card { background: #1a1a1d; border: 1px solid var(--border); transition: 0.3s; display: flex; flex-direction: column; }
            .dl-card:hover { border-color: var(--gold); box-shadow: 0 10px 30px rgba(212,175,55,0.1); transform: translateY(-5px); }
            .dl-card__preview { width: 100%; aspect-ratio: 16 / 9; border-bottom: 1px solid var(--border); background: #000; }
            .dl-card__preview iframe { width: 100%; height: 100%; object-fit: cover; }
            .dl-card__content { padding: 2rem; display: flex; flex-direction: column; align-items: center; text-align: center; flex-grow: 1; justify-content: space-between; }
            .dl-card__title { font-family: var(--ff-body); font-size: 1.1rem; color: #fff; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1.5rem; }
            .dl-btn { width: 100%; max-width: 250px; text-decoration: none; padding: 12px 20px; }
            
            /* Scrollbar personalizzata per il modale */
            .dl-content::-webkit-scrollbar { width: 6px; }
            .dl-content::-webkit-scrollbar-track { background: #050505; }
            .dl-content::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

            @media (max-width: 768px) {
                .dl-content { padding: 2rem 1.5rem; }
                .dl-grid { grid-template-columns: 1fr; }
            }
        `;
        document.head.appendChild(style);
    },

    open() {
        if (!this.isInitialized) this.init();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

document.addEventListener("DOMContentLoaded", () => DownloadManager.init());
