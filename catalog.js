/**
 * CATALOG MANAGER E MENU - Versione Definitiva
 * Luxury Doors
 */

const CatalogManager = {
    init() {
        this.grid = document.querySelector(".collections__grid");
        this.sectionLoader = document.getElementById("catalogLoader");
        
        if (!this.grid || !window.galleryData) return;

        // 1. Pulizia e preparazione griglia
        this.grid.innerHTML = "";
        this.grid.style.opacity = "1";

        // 2. Avvio costruzione card
        this.buildCards();
    },

    formatName(rawName) {
        return rawName.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
    },

    getAllImages(node) {
        let imgs = [];
        if (Array.isArray(node)) {
            imgs = [...node];
        } else if (typeof node === 'object' && node !== null) {
            for (const key in node) {
                imgs = imgs.concat(this.getAllImages(node[key]));
            }
        }
        return imgs;
    },

    buildCards() {
        const categories = Object.entries(window.galleryData);
        
        categories.forEach(([categoryKey, dataNode]) => {
            if (categoryKey === 'NostriLavori') return;

            const allImages = this.getAllImages(dataNode);
            if (allImages.length === 0) return;

            const displayName = this.formatName(categoryKey);
            const card = document.createElement("article");
            card.className = "collection-card";

            card.innerHTML = `
                <div class="divine-loader card-internal-loader">
                    <div class="divine-loader__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <p class="divine-loader__text">In attesa del lusso</p>
                </div>
                <div class="collection-card__bg"></div>
                <div class="collection-card__overlay"></div>
                <div class="collection-card__content">
                    <h3 class="collection-card__name">${displayName}</h3>
                    <span class="card-cta">Esplora →</span>
                </div>
            `;

            const bgContainer = card.querySelector(".collection-card__bg");
            const loader = card.querySelector(".card-internal-loader");

            const previewImages = allImages.slice(0, 3);
            let primaryImageLoaded = false;

            previewImages.forEach((src, idx) => {
                const img = new Image();
                img.src = src;
                img.className = `slide-img ${idx === 0 ? 'active' : ''}`;
                img.loading = "lazy";

                img.onload = () => {
                    img.classList.add('loaded');
                    
                    if (idx === 0 && !primaryImageLoaded) {
                        primaryImageLoaded = true;
                        setTimeout(() => {
                            loader.style.opacity = "0";
                            setTimeout(() => loader.style.display = "none", 500);
                        }, 400); 
                    }
                };

                bgContainer.appendChild(img);
            });

            card.addEventListener("click", () => Lightbox.open(dataNode, 0, displayName));
            this.grid.appendChild(card);
        });

        this.startSlideshows();
        if (typeof AnimationObserver !== 'undefined') AnimationObserver.observeNewElements();
    },

    startSlideshows() {
        document.querySelectorAll('.collection-card').forEach(card => {
            const images = card.querySelectorAll('.slide-img');
            if (images.length <= 1) return;
            
            let current = 0;
            setInterval(() => {
                const nextIndex = (current + 1) % images.length;
                if (images[nextIndex].classList.contains('loaded')) {
                    images[current].classList.remove('active');
                    current = nextIndex;
                    images[current].classList.add('active');
                }
            }, 4000 + Math.random() * 1000);
        });
    }
};

/**
 * CATALOG MODAL MANAGER
 */
const CatalogModalManager = {
    init() {
        this.modal = document.getElementById("catalogModal");
        this.iframe = document.getElementById("catalogIframe");
        this.overlay = document.getElementById("catalogModalOverlay");
        this.closeBtn = document.getElementById("catalogModalClose");
        this.loader = document.querySelector(".catalog-modal__loader");

        if (!this.modal) return;

        this.closeBtn.addEventListener("click", () => this.close());
        this.overlay.addEventListener("click", () => this.close());
        
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.close();
        });
    },

    open(url) {
        document.body.style.overflow = "hidden";
        this.modal.classList.add("active");
        if (this.loader) this.loader.style.display = "block";
        this.iframe.classList.remove("loaded");
        this.iframe.src = url;

        this.iframe.onload = () => {
            if (this.loader) this.loader.style.display = "none";
            this.iframe.classList.add("loaded");
        };
    },

    close() {
        this.modal.classList.remove("active");
        this.iframe.src = "";
        document.body.style.overflow = "";
    }
};

/**
 * MENU CATALOGO MANAGER
 * Versione corretta con anti-duplicazione del DOM e degli eventi
 */
const MenuCatalogoManager = {
    // Flag interno: serve a ricordarsi se abbiamo già attivato i click
    _eventsBound: false, 

    init() {
        const targetLink = document.querySelector('.nav__links a[href="#collections"]');
        if (!targetLink || !window.galleryData) return;

        const parentLi = targetLink.parentElement;
        parentLi.classList.add('nav__item--has-dropdown');

        // ==========================================
        // 1. FIX DOM: DISTRUZIONE VECCHIA UI
        // ==========================================
        const existingMenu = parentLi.querySelector('.nav__dropdown--mega');
        if (existingMenu) {
            existingMenu.remove(); // Distrugge il clone vecchio
        }

        const megaMenu = document.createElement("div");
        megaMenu.className = "nav__dropdown--mega";

        // Costruzione Colonna Sinistra (Categorie)
        const colLeft = document.createElement("div");
        colLeft.className = "mega-col-left";
        Object.keys(window.galleryData).forEach(catKey => {
            if (catKey === 'NostriLavori') return;
            const btn = document.createElement("button");
            btn.className = "nav__dropdown-btn";
            
            // Rimuovo gli underscore visivamente dal nome nel bottone
            btn.textContent = catKey.replace(/_/g, ' ').toUpperCase();
            
            // Usiamo i data-attribute per tracciare la categoria
            btn.setAttribute("data-category", catKey);
            colLeft.appendChild(btn);
        });

        // Costruzione Colonna Destra (CTA e Supercataloghi)
        const colRight = document.createElement("div");
        colRight.className = "mega-col-right";
        colRight.innerHTML = `
            <a href="#contact" class="special-btn special-btn--dark">Richiedi Info</a>
            <button class="special-btn special-btn--outline" id="btnSup1" data-action="sup1">Vedi Catalogo Pannelli 1</button>
            <button class="special-btn special-btn--outline" id="btnSup2" data-action="sup2">Vedi Catalogo Pannelli 2</button>
        `;

        megaMenu.appendChild(colLeft);
        megaMenu.appendChild(colRight);
        parentLi.appendChild(megaMenu);

        CatalogModalManager.init();

        // ==========================================
        // 2. FIX EVENTI: EVENT DELEGATION PROTETTA
        // ==========================================
        // Se _eventsBound è true, ignora questo blocco. Evita doppi click fantasma.
        if (!this._eventsBound) {
            document.addEventListener('click', (e) => {
                
                // Intercetta SuperCatalogo 1
                if (e.target.id === 'btnSup1' || e.target.closest('#btnSup1') || e.target.dataset.action === 'sup1') {
                    e.preventDefault();
                    CatalogModalManager.open("https://www.sfogliami.it/fl/322021/t618zm2s44f54xqpdxxpzyp3rtep2p");
                }
                
                // Intercetta SuperCatalogo 2
                if (e.target.id === 'btnSup2' || e.target.closest('#btnSup2') || e.target.dataset.action === 'sup2') {
                    e.preventDefault();
                    CatalogModalManager.open("https://www.sfogliami.it/fl/322020/pp74s3m9g9g5pdrybcvpyxxtqqxzff77");
                }

                // Intercetta l'apertura delle categorie in colLeft
                if (e.target.classList.contains('nav__dropdown-btn') && e.target.hasAttribute('data-category')) {
                    e.preventDefault();
                    const catKey = e.target.getAttribute('data-category');
                    
                    // Apriamo la lightbox usando il catKey pulito per la UI
                    if (typeof Lightbox !== 'undefined' && window.galleryData[catKey]) {
                        Lightbox.open(window.galleryData[catKey], 0, catKey.replace(/_/g, ' '));
                    }
                }
            });
            
            // Segna gli eventi come attivati per evitare loop futuri
            this._eventsBound = true; 
        }
    }
};

// --- BOOTSTRAP ---
document.addEventListener("DOMContentLoaded", () => {
    CatalogManager.init();
    MenuCatalogoManager.init();
});/**
 * MENU CATALOGO MANAGER
 * Versione corretta con anti-duplicazione del DOM e degli eventi
 */
const MenuCatalogoManager = {
    // Flag interno: serve a ricordarsi se abbiamo già attivato i click
    _eventsBound: false, 

    init() {
        const targetLink = document.querySelector('.nav__links a[href="#collections"]');
        if (!targetLink || !window.galleryData) return;

        const parentLi = targetLink.parentElement;
        parentLi.classList.add('nav__item--has-dropdown');

        // ==========================================
        // 1. FIX DOM: DISTRUZIONE VECCHIA UI
        // ==========================================
        const existingMenu = parentLi.querySelector('.nav__dropdown--mega');
        if (existingMenu) {
            existingMenu.remove(); // Distrugge il clone vecchio
        }

        const megaMenu = document.createElement("div");
        megaMenu.className = "nav__dropdown--mega";

        // Costruzione Colonna Sinistra (Categorie)
        const colLeft = document.createElement("div");
        colLeft.className = "mega-col-left";
        Object.keys(window.galleryData).forEach(catKey => {
            if (catKey === 'NostriLavori') return;
            const btn = document.createElement("button");
            btn.className = "nav__dropdown-btn";
            
            // Rimuovo gli underscore visivamente dal nome nel bottone
            btn.textContent = catKey.replace(/_/g, ' ').toUpperCase();
            
            // Usiamo i data-attribute per tracciare la categoria
            btn.setAttribute("data-category", catKey);
            colLeft.appendChild(btn);
        });

        // Costruzione Colonna Destra (CTA e Supercataloghi)
        const colRight = document.createElement("div");
        colRight.className = "mega-col-right";
        colRight.innerHTML = `
            <a href="#contact" class="special-btn special-btn--dark">Richiedi Info</a>
            <button class="special-btn special-btn--outline" id="btnSup1" data-action="sup1">Vedi Catalogo Pannelli 1</button>
            <button class="special-btn special-btn--outline" id="btnSup2" data-action="sup2">Vedi Catalogo Pannelli 2</button>
        `;

        megaMenu.appendChild(colLeft);
        megaMenu.appendChild(colRight);
        parentLi.appendChild(megaMenu);

        CatalogModalManager.init();

        // ==========================================
        // 2. FIX EVENTI: EVENT DELEGATION PROTETTA
        // ==========================================
        // Se _eventsBound è true, ignora questo blocco. Evita doppi click fantasma.
        if (!this._eventsBound) {
            document.addEventListener('click', (e) => {
                
                // Intercetta SuperCatalogo 1
                if (e.target.id === 'btnSup1' || e.target.closest('#btnSup1') || e.target.dataset.action === 'sup1') {
                    e.preventDefault();
                    CatalogModalManager.open("https://www.sfogliami.it/fl/322021/t618zm2s44f54xqpdxxpzyp3rtep2p");
                }
                
                // Intercetta SuperCatalogo 2
                if (e.target.id === 'btnSup2' || e.target.closest('#btnSup2') || e.target.dataset.action === 'sup2') {
                    e.preventDefault();
                    CatalogModalManager.open("https://www.sfogliami.it/fl/322020/pp74s3m9g9g5pdrybcvpyxxtqqxzff77");
                }

                // Intercetta l'apertura delle categorie in colLeft
                if (e.target.classList.contains('nav__dropdown-btn') && e.target.hasAttribute('data-category')) {
                    e.preventDefault();
                    const catKey = e.target.getAttribute('data-category');
                    
                    // Apriamo la lightbox usando il catKey pulito per la UI
                    if (typeof Lightbox !== 'undefined' && window.galleryData[catKey]) {
                        Lightbox.open(window.galleryData[catKey], 0, catKey.replace(/_/g, ' '));
                    }
                }
            });
            
            // Segna gli eventi come attivati per evitare loop futuri
            this._eventsBound = true; 
        }
    }
};

/**
 * CATALOG MODAL MANAGER
 */
const CatalogModalManager = {
    init() {
        this.modal = document.getElementById("catalogModal");
        this.iframe = document.getElementById("catalogIframe");
        this.overlay = document.getElementById("catalogModalOverlay");
        this.closeBtn = document.getElementById("catalogModalClose");
        this.loader = document.querySelector(".catalog-modal__loader");

        if (!this.modal) return;

        this.closeBtn.addEventListener("click", () => this.close());
        this.overlay.addEventListener("click", () => this.close());
        
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.close();
        });
    },

    open(url) {
        document.body.style.overflow = "hidden";
        this.modal.classList.add("active");
        if (this.loader) this.loader.style.display = "block";
        this.iframe.classList.remove("loaded");
        this.iframe.src = url;

        this.iframe.onload = () => {
            if (this.loader) this.loader.style.display = "none";
            this.iframe.classList.add("loaded");
        };
    },

    close() {
        this.modal.classList.remove("active");
        this.iframe.src = "";
        document.body.style.overflow = "";
    }
};

/**
 * MENU CATALOGO MANAGER
 */
const MenuCatalogoManager = {
    init() {
        const targetLink = document.querySelector('.nav__links a[href="#collections"]');
        if (!targetLink) return;

        const parentLi = targetLink.parentElement;
        parentLi.classList.add('nav__item--has-dropdown');

        const megaMenu = document.createElement("div");
        megaMenu.className = "nav__dropdown--mega";

        // Costruzione Colonna Sinistra (Categorie)
        const colLeft = document.createElement("div");
        colLeft.className = "mega-col-left";
        Object.keys(window.galleryData).forEach(catKey => {
            if (catKey === 'NostriLavori') return;
            const btn = document.createElement("button");
            btn.className = "nav__dropdown-btn";
            btn.textContent = catKey.toUpperCase();
            
            // Usiamo i data-attribute per tracciare la categoria anziché l'onclick diretto
            btn.setAttribute("data-category", catKey);
            colLeft.appendChild(btn);
        });

        // Costruzione Colonna Destra (CTA e Supercataloghi)
        const colRight = document.createElement("div");
        colRight.className = "mega-col-right";
        colRight.innerHTML = `
            <a href="#contact" class="special-btn special-btn--dark">Richiedi Info</a>
            <button class="special-btn special-btn--outline" id="btnSup1" data-action="sup1">Vedi Catalogo Pannelli 1</button>
            <button class="special-btn special-btn--outline" id="btnSup2" data-action="sup2">Vedi Catalogo Pannelli 2</button>
        `;

        megaMenu.appendChild(colLeft);
        megaMenu.appendChild(colRight);
        parentLi.appendChild(megaMenu);

        CatalogModalManager.init();

        // --- EVENT DELEGATION PATTERN ---
        // Ascoltiamo i click a livello di intero documento. 
        // Questo sopravvive a qualsiasi clone, distruzione o rigenerazione della Navbar.
        document.addEventListener('click', (e) => {
            
            // Intercetta SuperCatalogo 1
            if (e.target.id === 'btnSup1' || e.target.closest('#btnSup1') || e.target.dataset.action === 'sup1') {
                e.preventDefault();
                CatalogModalManager.open("https://www.sfogliami.it/fl/322021/t618zm2s44f54xqpdxxpzyp3rtep2p");
            }
            
            // Intercetta SuperCatalogo 2
            if (e.target.id === 'btnSup2' || e.target.closest('#btnSup2') || e.target.dataset.action === 'sup2') {
                e.preventDefault();
                CatalogModalManager.open("https://www.sfogliami.it/fl/322020/pp74s3m9g9g5pdrybcvpyxxtqqxzff77");
            }

            // Intercetta l'apertura delle categorie in colLeft (proteggiamo anche loro dallo stesso bug)
            if (e.target.classList.contains('nav__dropdown-btn') && e.target.hasAttribute('data-category')) {
                e.preventDefault();
                const catKey = e.target.getAttribute('data-category');
                Lightbox.open(window.galleryData[catKey], 0, catKey);
            }
        });
    }
};

// --- BOOTSTRAP ---
document.addEventListener("DOMContentLoaded", () => {
    CatalogManager.init();
    MenuCatalogoManager.init();
});
