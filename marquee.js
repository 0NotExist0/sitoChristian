/* ============================================================
   MARQUEE ENGINE — SISTEMA OLYMPUS (VERSIONE DRIVE-RANDOM)
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
     * Converte i link di Google Drive in formati leggibili dal browser
     */
    formatDriveUrl(url) {
        if (!url || typeof url !== 'string') return '';
        let id = '';
        if (url.includes('/file/d/')) {
            id = url.split('/file/d/')[1].split('/')[0].split('?')[0];
        } else if (url.includes('id=')) {
            id = new URLSearchParams(url.split('?')[1]).get('id');
        }
        return id ? `https://drive.google.com/uc?export=view&id=${id}` : url;
    }

    /**
     * Mescola l'array delle immagini in modo casuale
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    nextImageTag() {
        // Se non ci sono immagini, usiamo un placeholder di design
        const placeholder = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=300&auto=format&fit=crop";
        
        if (this.images.length === 0) {
            return `<img src="${placeholder}" class="marquee-img">`;
        }

        const item = this.images[this.imgIndex % this.images.length];
        this.imgIndex++;

        const rawUrl = (typeof item === 'string') ? item : (item.url || item.src || "");
        const finalSrc = this.formatDriveUrl(rawUrl);

        return `<img
            src="${finalSrc}"
            class="marquee-img"
            loading="lazy"
            alt="Porta Nova"
            onerror="this.src='${placeholder}';"
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
        this.track.innerHTML = '';
        this.imgIndex = 0;

        // Creiamo abbastanza copie per coprire lo schermo
        const segmentHtml = this.createSegment();
        const container = document.createElement('div');
        container.className = 'marquee-content';
        
        // Generiamo circa 10 ripetizioni per sicurezza
        let totalHtml = '';
        for (let i = 0; i < 10; i++) totalHtml += segmentHtml;
        
        container.innerHTML = totalHtml;
        const blockB = container.cloneNode(true);

        this.track.appendChild(container);
        this.track.appendChild(blockB);
    }

    init() {
        // 1. Attendi che i dati siano pronti
        if (!window.galleryData || typeof DataEngine === 'undefined') {
            setTimeout(() => this.init(), 500);
            return;
        }

        console.log("Marquee: Analizzo cartelle per immagini...");

        // 2. Cerchiamo le cartelle specifiche nel tuo catalogo
        const folderNames = ["Rivestimenti in alluminio", "Rivestimenti in Legno"];
        let combinedImages = [];

        folderNames.forEach(name => {
            const folder = DataEngine.findFolder(window.galleryData, name);
            if (folder) {
                const imgs = DataEngine.extractImages(folder);
                combinedImages = combinedImages.concat(imgs);
                console.log(`Trovate ${imgs.length} immagini in: ${name}`);
            }
        });

        // 3. Mescoliamo a caso
        this.images = this.shuffle(combinedImages);

        // 4. Se non troviamo nulla, prendiamo tutto il catalogo come fallback
        if (this.images.length === 0) {
            console.warn("Cartelle specifiche non trovate, uso catalogo intero.");
            this.images = this.shuffle(DataEngine.extractImages(window.galleryData));
        }

        this.buildMarquee();
    }
}

/* Avvio automatico */
document.addEventListener('DOMContentLoaded', () => {
    new InfiniteMarquee('dynamicMarquee');
});
