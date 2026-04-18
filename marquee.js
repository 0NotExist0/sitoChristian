/* ============================================================
   MARQUEE ENGINE — SISTEMA OLYMPUS (VERSIONE DEEP-SCAN)
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
     * Trasforma i link Drive per renderli visibili
     */
    formatDriveUrl(url) {
        if (!url || typeof url !== 'string') return '';
        let id = '';
        if (url.includes('/file/d/')) {
            id = url.split('/file/d/')[1].split('/')[0];
        } else if (url.includes('id=')) {
            id = new URLSearchParams(url.split('?')[1]).get('id');
        }
        return id ? `https://drive.google.com/uc?export=view&id=${id}` : url;
    }

    /**
     * FUNZIONE CHIAVE: Scansiona tutte le cartelle e sottocartelle
     * per trovare ogni singolo file immagine.
     */
    deepExtractImages(node) {
        let results = [];
        if (!node) return results;

        // 1. Se è un file ed è un'immagine, lo prendiamo
        if (node.type === 'file' || (node.url && !node.children)) {
            const isImg = /\.(jpg|jpeg|png|webp|gif)$/i.test(node.name || node.url);
            if (isImg) results.push(node);
        }

        // 2. Se ha dei figli (cartella), entra dentro ognuno di essi (Ricorsione)
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => {
                results = results.concat(this.deepExtractImages(child));
            });
        }
        
        // Gestione se node è direttamente un array (il root)
        if (Array.isArray(node)) {
            node.forEach(item => {
                results = results.concat(this.deepExtractImages(item));
            });
        }

        return results;
    }

    nextImageTag() {
        // Placeholder se proprio non troviamo nulla (grigio neutro)
        const placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        
        if (this.images.length === 0) return `<img src="${placeholder}" class="marquee-img">`;

        const item = this.images[this.imgIndex % this.images.length];
        this.imgIndex++;

        const rawUrl = (typeof item === 'string') ? item : (item.url || item.link || "");
        const finalSrc = this.formatDriveUrl(rawUrl);

        return `<img
            src="${finalSrc}"
            class="marquee-img"
            loading="lazy"
            alt="Porta Nova Design"
            onerror="this.style.opacity='0';" 
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

        let totalHtml = '';
        for (let i = 0; i < 8; i++) totalHtml += this.createSegment();
        
        const container = document.createElement('div');
        container.className = 'marquee-content';
        container.innerHTML = totalHtml;
        
        this.track.appendChild(container);
        this.track.appendChild(container.cloneNode(true));
    }

    init() {
        if (!window.galleryData) {
            setTimeout(() => this.init(), 500);
            return;
        }

        console.log("Marquee: Avvio scansione profonda del catalogo...");

        // Cerchiamo le cartelle madri che hai indicato
        const targetFolders = ["Rivestimenti in alluminio", "Rivestimenti in Legno"];
        let allFoundFiles = [];

        targetFolders.forEach(folderName => {
            // Troviamo la cartella principale nel JSON
            const rootFolder = typeof DataEngine !== 'undefined' 
                ? DataEngine.findFolder(window.galleryData, folderName)
                : null;

            if (rootFolder) {
                const folderFiles = this.deepExtractImages(rootFolder);
                allFoundFiles = allFoundFiles.concat(folderFiles);
                console.log(`Trovate ${folderFiles.length} immagini in ${folderName} (incluse sottocartelle)`);
            }
        });

        // Se non troviamo nulla nelle cartelle specifiche, prendiamo TUTTO il Drive
        if (allFoundFiles.length === 0) {
            console.warn("Cartelle specifiche vuote o non trovate. Scansiono intero Drive...");
            allFoundFiles = this.deepExtractImages(window.galleryData);
        }

        // Mescoliamo a caso le porte trovate
        this.images = allFoundFiles.sort(() => Math.random() - 0.5);
        
        this.buildMarquee();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InfiniteMarquee('dynamicMarquee');
});
