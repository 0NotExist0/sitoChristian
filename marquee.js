/* ============================================================
   MARQUEE ENGINE — PORTA NOVA (INTEGRAZIONE DATA ENGINE)
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
     * Trasforma i link Drive per renderli visibili (Necessario per i tag IMG)
     */
    formatDriveUrl(url) {
        if (!url || typeof url !== 'string') return '';
        let id = '';
        if (url.includes('/file/d/')) {
            id = url.split('/file/d/')[1].split('/')[0];
        } else if (url.includes('id=')) {
            const params = new URLSearchParams(url.split('?')[1]);
            id = params.get('id');
        }
        return id ? `https://drive.google.com/uc?export=view&id=${id}` : url;
    }

    /**
     * Funzione per mescolare l'array (Random)
     */
    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    nextImageTag() {
        if (this.images.length === 0) return '';

        const item = this.images[this.imgIndex % this.images.length];
        this.imgIndex++;

        // Usiamo la formattazione Drive per essere sicuri che si veda
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

    build() {
        if (this.images.length === 0) return;
        
        this.track.innerHTML = '';
        this.imgIndex = 0;

        // Creiamo il contenuto (abbastanza lungo da coprire lo scorrimento)
        let contentHtml = '';
        for (let i = 0; i < 10; i++) {
            contentHtml += this.createSegment();
        }

        const blockA = document.createElement('div');
        blockA.className = 'marquee-content';
        blockA.innerHTML = contentHtml;

        const blockB = blockA.cloneNode(true);
        blockB.setAttribute('aria-hidden', 'true');

        this.track.appendChild(blockA);
        this.track.appendChild(blockB);
    }

    init() {
        // 1. Aspettiamo che window.galleryData e DataEngine siano pronti
        if (!window.galleryData || typeof DataEngine === 'undefined') {
            setTimeout(() => this.init(), 500);
            return;
        }

        // 2. Usiamo il TUO DataEngine per trovare le cartelle esatte
        // Nomi presi dal tuo CatalogSchema:
        const foldersToSearch = [
            'Rivestimenti in alluminio + inseriti', 
            'Rivestimenti in Legno',
            'Pannelli in alluminio'
        ];

        let collectedImages = [];

        foldersToSearch.forEach(folderName => {
            const folderData = DataEngine.findFolder(window.galleryData, folderName);
            if (folderData) {
                // Usiamo la TUA funzione extractImages che funziona sicuramente
                const imgs = DataEngine.extractImages(folderData);
                collectedImages = collectedImages.concat(imgs);
            }
        });

        // 3. Se non ha trovato nulla con quei nomi, prende tutto come backup
        if (collectedImages.length === 0) {
            collectedImages = DataEngine.extractImages(window.galleryData);
        }

        // 4. Mescoliamo a caso e costruiamo
        this.images = this.shuffle(collectedImages);
        this.build();
    }
}

// Avvio dopo un piccolo delay per dare tempo al CatalogManager di caricare
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new InfiniteMarquee('dynamicMarquee');
    }, 1000);
});
