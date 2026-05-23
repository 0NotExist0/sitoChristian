/**
 * CATALOG MANAGER — Versione Definitiva (Fix Bottoni PDF)
 * Luxury Doors — Porta Nova
 */

// ============================================================
// 🎛️ LUXURY DOORS CONFIGURATOR
// ============================================================
const CatalogSchema = [
    {
        id: 'porte_blindate',
        title: 'PORTE BLINDATE',
        type: 'gallery',
        subItems: [
            { driveFolder: 'Lisce', label: 'LISCE' },
            { driveFolder: 'Pannelli in alluminio', label: 'PANNELLI ALLUMINIO' },
            { driveFolder: 'Rivestimenti in alluminio + inseriti', label: 'PANNELLI ALLUMINIO + INS.' },
            { driveFolder: 'Rivestimenti in Legno', label: 'PANNELLI IN LEGNO' },
            { driveFolder: 'Pannelli in MDF', label: 'PANNELLI IN MDF LACCATI' }
        ]
    },
    // INIZIO NUOVA SEZIONE PORTE INTERNE
    {
        id: 'porte_interne',
        title: 'PORTE INTERNE',
        type: 'gallery',
        subItems: [
            { driveFolder: 'PorteInterne', label: 'PORTE LACCATE' }
        ]
    },
    // FINE NUOVA SEZIONE PORTE INTERNE
    {
        id: 'accessori',
        title: 'ACCESSORI',
        type: 'gallery',
        subItems: [
            { driveFolder: 'Serrature', label: 'SERRATURE' },
            { driveFolder: 'Cilindri', label: 'CILINDRI' },
            { driveFolder: 'Maniglioni', label: 'MANIGLIONI' },
            { driveFolder: 'Kit maniglie', label: 'KIT MANIGLIE' },
            { driveFolder: 'Serrature motorizzate', label: 'SERRATURE MOTORIZZATE' }
        ]
    },
    {
        id: 'certificazioni',
        title: 'CERTIFICAZIONI',
        type: 'gallery',
        subItems: [
            { driveFolder: 'Certificazioni Classe 3 e 4', label: 'CERTIFICAZIONI CLASSE 3 E 4' },
            { driveFolder: 'SchedeTecniche', label: 'SCHEDE TECNICHE' },
            { driveFolder: 'DisegniTecnici', label: 'DISEGNI TECNICI' }
        ]
    },
    {
        id: 'download',
        title: 'DOWNLOAD',
        type: 'pdf',
        subItems: [
            { id: 'sup1', label: 'Vedi Pannelli Allum. 1 📄', url: 'https://www.sfogliami.it/fl/322021/t618zm2s44f54xqpdxxpzyp3rtep2p' },
            { id: 'sup2', label: 'Vedi Pannelli Allum. 2 📄', url: 'https://www.sfogliami.it/fl/322020/pp74s3m9g9g5pdrybcvpyxxtqqxzff77' }
        ]
    }
];

// ============================================================
// 0. DATA ENGINE (Motore di ricerca per le cartelle Drive)
// ============================================================
const DataEngine = {
    normalize(str) {
        return str ? str.toLowerCase().replace(/[^a-z0-9]/gi, '') : '';
    },
    
    findFolder(dataNode, targetName) {
        const targetNorm = this.normalize(targetName);
        if (typeof dataNode !== 'object' || dataNode === null || Array.isArray(dataNode)) return null;
        
        for (const [key, val] of Object.entries(dataNode)) {
            if (this.normalize(key) === targetNorm) return val;
        }
        for (const [key, val] of Object.entries(dataNode)) {
            if (key !== '_images' && typeof val === 'object' && !Array.isArray(val)) {
                const found = this.findFolder(val, targetName);
                if (found) return found;
            }
        }
        return null;
    },

    extractImages(node) {
        let imgs = [];
        if (Array.isArray(node)) {
            imgs = [...node];
        } else if (typeof node === 'object' && node !== null) {
            for (const key in node) {
                imgs = imgs.concat(this.extractImages(node[key]));
            }
        }
        return imgs;
    }
};

// ============================================================
// 1. CATALOG MANAGER (Griglia delle Card)
// ============================================================
const CatalogManager = {
    init() {
        this.grid = document.querySelector(".collections__grid");
        this.sectionLoader = document.getElementById("catalogLoader");

        if (!this.grid || !window.galleryData) return;

        if (this.sectionLoader) {
            this.sectionLoader.style.display = "none";
        }

        this.grid.innerHTML = "";
        this.grid.style.opacity = "1";
        this.buildCards();
    },

    buildCards() {
        CatalogSchema.forEach(rootData => {
            const card = document.createElement("article");
            card.className = "collection-card";

            if (rootData.type === 'pdf') {
                card.innerHTML = `
                    <div class="collection-card__bg" style="background: radial-gradient(circle at center, #1a1a1d, #050505); display:flex; align-items:center; justify-content:center;">
                        <svg style="width: 100px; height: 100px; opacity: 0.15; color: #d4af37;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="collection-card__overlay"></div>
                    <div class="collection-card__content">
                        <h3 class="collection-card__name">${rootData.title}</h3>
                        <span class="card-cta">Vedi Area Download →</span>
                    </div>
                `;
                card.addEventListener("click", () => {
                    if (typeof DownloadManager !== 'undefined') {
                        DownloadManager.open();
                    } else {
                        CatalogModalManager.open(rootData.subItems[0].url);
                    }
                });
            } else {
                let allImages = [];
                const syntheticNode = {}; 

                rootData.subItems.forEach(subItem => {
                    const foundData = DataEngine.findFolder(window.galleryData, subItem.driveFolder);
                    if (foundData) {
                        syntheticNode[subItem.label] = foundData;
                        allImages = allImages.concat(DataEngine.extractImages(foundData));
                    }
                });

                if (allImages.length === 0) {
                    allImages = ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"]; 
                }

                card.innerHTML = `
                    <div class="divine-loader card-internal-loader">
                        <div class="divine-loader__icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <div class="collection-card__bg"></div>
                    <div class="collection-card__overlay"></div>
                    <div class="collection-card__content">
                        <h3 class="collection-card__name">${rootData.title}</h3>
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
                                if(loader) loader.style.opacity = "0";
                                setTimeout(() => { if(loader) loader.style.display = "none" }, 500);
                            }, 400);
                        }
                    };
                    bgContainer.appendChild(img);
                });

                card.addEventListener("click", () => Lightbox.open(syntheticNode, 0, rootData.title));
            }

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

// ============================================================
// 2. CATALOG MODAL MANAGER E GESTIONE CLICK BOTTONI D'ORO
// ============================================================
const CatalogModalManager = {
    _eventsBound: false,

    init() {
        this.modal   = document.getElementById("catalogModal");
        this.iframe  = document.getElementById("catalogIframe");
        this.overlay = document.getElementById("catalogModalOverlay");
        this.closeBtn = document.getElementById("catalogModalClose");
        this.loader  = document.querySelector(".catalog-modal__loader");

        if (this.closeBtn) this.closeBtn.addEventListener("click", () => this.close());
        if (this.overlay) this.overlay.addEventListener("click", () => this.close());
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.close();
        });

        // ASCOLTATORE UNIVERSALE PER I BOTTONI PDF
        if (!this._eventsBound) {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-action]');
                if (btn) {
                    const action = btn.getAttribute('data-action');
                    
                    if (action === 'sup1' || action === 'sup2') {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // APRE DIRETTAMENTE IL SINGOLO CATALOGO (Nessun DownloadManager qui)
                        const dlRoot = CatalogSchema.find(r => r.id === 'download');
                        const targetBtnConfig = dlRoot.subItems.find(b => b.id === action);
                        if (targetBtnConfig && this.modal) {
                            this.open(targetBtnConfig.url);
                        }
                    }
                }
            });
            this._eventsBound = true;
        }
    },

    open(url) {
        if (!this.modal) return; 
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
        if (!this.modal) return;
        this.modal.classList.remove("active");
        this.iframe.src = "";
        document.body.style.overflow = ""; 
    }
};

// ============================================================
// 3. MENU CATALOGO MANAGER (Navbar Dropdown)
// ============================================================
const MenuCatalogoManager = {
    init() {
        const targetLink = document.querySelector('.nav__links a[href="#collections"]');
        if (!targetLink || !window.galleryData) return;

        const parentLi = targetLink.parentElement;
        parentLi.classList.add('nav__item--has-dropdown');

        const oldMenus = parentLi.querySelectorAll('ul.nav__dropdown, .nav__dropdown--mega, .nav__dropdown--cascading');
        oldMenus.forEach(m => m.remove());

        const ul = document.createElement("ul");
        ul.className = "nav__dropdown--cascading dropdown-menu level-1";

        CatalogSchema.forEach(rootData => {
            const li = document.createElement("li");
            li.className = "dropdown-item has-submenu";
            
            const a = document.createElement("a");
            a.href = "#";
            a.className = "dropdown-link";
            a.innerHTML = `${rootData.title} <span class="submenu-indicator">›</span>`;
            li.appendChild(a);

            const subUl = document.createElement("ul");
            subUl.className = "dropdown-menu level-2";

            if (rootData.type === 'pdf') {
                const subLi = document.createElement("li");
                subLi.className = "dropdown-item static-pdf-item";
                const subA = document.createElement("a");
                subA.href = "#";
                subA.className = "dropdown-link special-link";
                subA.innerHTML = `AREA DOWNLOAD ⤓`;
                subA.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof DownloadManager !== 'undefined') {
                        DownloadManager.open();
                    } else {
                        CatalogModalManager.open(rootData.subItems[0].url);
                    }
                });
                subLi.appendChild(subA);
                subUl.appendChild(subLi);
            } else {
                rootData.subItems.forEach(subItem => {
                    const subLi = document.createElement("li");
                    subLi.className = "dropdown-item";
                    
                    const subA = document.createElement("a");
                    subA.href = "#";
                    subA.className = "dropdown-link";
                    subA.textContent = subItem.label;
                    
                    subA.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const foundData = DataEngine.findFolder(window.galleryData, subItem.driveFolder);
                        if (foundData && typeof Lightbox !== 'undefined') {
                            Lightbox.open(foundData, 0, subItem.label);
                        }
                    });

                    subLi.appendChild(subA);
                    subUl.appendChild(subLi);
                });
            }

            li.appendChild(subUl);
            ul.appendChild(li);
        });

        parentLi.appendChild(ul);
    }
};

// ============================================================
// BOOTSTRAP (Avvio dei controller)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    CatalogModalManager.init();
    CatalogManager.init();
    MenuCatalogoManager.init();
});
