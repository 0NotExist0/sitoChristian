/**
 * LIGHTBOX ENGINE — Luxury Doors Professional
 * Versione 3.2 — Integrated Divine Loader, Asset Management & Animated Caption
 */
const Lightbox = {
    // Configurazione per attivazione vista 3D
    foldersWith3D: ["Rivestimenti in alluminio + inseriti", "PorteGenerali", "Rivestimenti in Legno", "Pannelli in MDF"],
    
    // State Management
    history: [],
    currentNode: null,
    currentName: "",
    images: [],
    currentIndex: 0,
    isInitialized: false,

    /**
     * Inizializza il modulo e aggancia gli eventi al DOM.
     */
    init() {
        // --- GUARD CLAUSE ---
        if (this.isInitialized) return;

        // Selezione elementi base
        this.lightbox = document.getElementById("lightbox");
        this.layout = document.querySelector(".lightbox__layout");
        this.imgCol = document.querySelector(".lightbox__col--img");
        this.col3D = document.querySelector(".lightbox__col--3d");
        
        // Elementi Immagine e Navigazione
        this.imgElement = document.getElementById("lightboxImage");
        this.counter = document.getElementById("lightboxCounter");
        this.prevBtn = document.getElementById("lightboxPrev");
        this.nextBtn = document.getElementById("lightboxNext");
        
        // Riferimento al Divine Loader
        this.loader = document.getElementById("divineLoader");
        
        // Elementi 3D
        this.hinge = document.getElementById("door3DHinge");
        this.slider = document.getElementById("door3DSlider");
        this.frontFace = document.getElementById("door3DFront");
        
        this.closeBtn = document.getElementById("lightboxClose");
        this.overlay = document.getElementById("lightboxOverlay");

        if (!this.lightbox || !this.layout) {
            console.warn("[Lightbox] Elementi DOM critici non trovati.");
            return;
        }

        // Setup UI Dinamica (Sidebar e Tasto Indietro)
        this.setupDynamicUI();

        // --- INIEZIONE CSS DINAMICO PER LA DIDASCALIA ANIMATA ---
        if (!document.getElementById("didascaliaDivinaStyles")) {
            const style = document.createElement("style");
            style.id = "didascaliaDivinaStyles";
            style.innerHTML = `
                @keyframes goldSilverAnim {
                    0% { color: #aaaaaa; text-shadow: 0 0 5px rgba(170,170,170, 0.4); }
                    50% { color: #d4af37; text-shadow: 0 0 15px rgba(212,175,55, 0.9); }
                    100% { color: #aaaaaa; text-shadow: 0 0 5px rgba(170,170,170, 0.4); }
                }
                #lightboxCounter {
                    position: absolute !important;
                    bottom: 30px !important;
                    right: 30px !important;
                    z-index: 9999 !important; /* Forza la didascalia sopra l'immagine */
                    font-family: 'Cinzel', serif, sans-serif; /* Font elegante */
                    font-size: 1.2rem;
                    font-weight: bold;
                    letter-spacing: 1px;
                    pointer-events: none; /* Impedisce che blocchi i click sottostanti */
                    animation: goldSilverAnim 3.5s infinite ease-in-out;
                    background: rgba(0, 0, 0, 0.65); /* Sfondo scuro per far risaltare l'oro */
                    padding: 10px 20px;
                    border-radius: 6px;
                    border: 1px solid rgba(212,175,55, 0.3);
                    backdrop-filter: blur(4px);
                    margin: 0;
                }
            `;
            document.head.appendChild(style);
        }

        // Event Listeners
        this.closeBtn.addEventListener("click", () => this.close());
        this.prevBtn.addEventListener("click", () => this.prev());
        this.nextBtn.addEventListener("click", () => this.next());
        this.overlay.addEventListener("click", () => this.close());
        this.backBtn.addEventListener("click", () => this.goBack());
        document.addEventListener("keydown", (e) => this.handleKeyboard(e));
        
        // Controllo apertura porta 3D
        if (this.slider && this.hinge) {
            this.slider.addEventListener("input", (e) => {
                const angle = (e.target.value / 100) * 85;
                this.hinge.style.transform = `rotateY(-${angle}deg)`;
            });
        }

        this.isInitialized = true;
        console.log("[Lightbox v3.2] Engine inizializzato con Didascalia Animata.");
    },

    /**
     * Crea gli elementi UI dinamici (Sidebar & Breadcrumbs).
     */
    setupDynamicUI() {
        if (!document.querySelector(".lightbox__col--sidebar")) {
            this.sidebar = document.createElement("div");
            this.sidebar.className = "lightbox__col lightbox__col--sidebar";
            this.sidebar.style.display = "none";
            this.sidebar.innerHTML = `
                <h4 class="lightbox__sidebar-title" id="sidebarTitle">Esplora</h4>
                <div class="lightbox__sidebar-grid" id="sidebarGrid"></div>
            `;
            this.layout.insertBefore(this.sidebar, this.imgCol);
            this.sidebarGrid = document.getElementById("sidebarGrid");
            this.sidebarTitle = document.getElementById("sidebarTitle");
        }

        if (!document.querySelector(".lightbox__back-btn")) {
            this.backBtn = document.createElement("button");
            this.backBtn.className = "lightbox__back-btn";
            this.backBtn.innerHTML = "← Indietro";
            this.backBtn.style.display = "none";
            this.lightbox.appendChild(this.backBtn);
        }
    },

    /**
     * Apertura della galleria con gestione ricorsiva.
     */
    open(dataNode, startIndex = 0, categoryName = "", isBack = false) {
        if (!this.isInitialized) this.init();
        if (!dataNode) return;

        // Gestione History
        if (!isBack && this.currentNode) {
            this.history.push({ node: this.currentNode, name: this.currentName });
        }
        
        this.currentNode = dataNode;
        this.currentName = categoryName;

        if (this.backBtn) {
            this.backBtn.style.display = this.history.length > 0 ? "block" : "none";
        }
        
        // Whitelist per Vista 3D
        const nameUpper = categoryName.toUpperCase();
        const is3DAllowed = this.foldersWith3D.some(folder => folder.toUpperCase() === nameUpper);
        if (this.col3D) this.col3D.style.display = is3DAllowed ? "flex" : "none";

        // Reset Porta 3D
        if (this.slider && this.hinge) {
            this.slider.value = 0;
            this.hinge.style.transform = `rotateY(0deg)`;
        }

        // Parsing Dati
        const looseImages = [];
        const subFolders = {};

        if (Array.isArray(dataNode)) {
            dataNode.forEach(item => {
                if (typeof item === 'string') looseImages.push(item);
                else if (typeof item === 'object') Object.assign(subFolders, item);
            });
        } else if (typeof dataNode === 'object') {
            Object.entries(dataNode).forEach(([key, value]) => {
                if (key === '_images' && Array.isArray(value)) looseImages.push(...value);
                else if (typeof value === 'string') looseImages.push(value);
                else subFolders[key] = value;
            });
        }

        // Render Sidebar
        if (Object.keys(subFolders).length > 0) {
            this.sidebar.style.display = "flex";
            this.sidebarTitle.textContent = this.formatSafeName(categoryName);
            this.buildSidebar(subFolders);
        } else {
            this.sidebar.style.display = "none";
        }

        // Render Immagini
        if (looseImages.length > 0) {
            this.imgCol.style.display = "flex";
            this.images = looseImages;
            this.currentIndex = Math.min(startIndex, looseImages.length - 1);
            this.updateView();
        } else {
            this.imgCol.style.display = "none";
            this.images = [];
        }
        
        this.lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    },

    /**
     * Aggiorna l'immagine visualizzata con logica di caricamento divina.
     */
    async updateView() {
        if (!this.images.length || !this.imgElement) return;
        
        const currentImageSrc = this.images[this.currentIndex];
        
        // 1. Reset visivo immediato
        this.imgElement.style.opacity = "0";
        if (this.loader) {
            this.loader.style.display = "flex"; // Attiva il fulmine
        }

        // 2. Logica di pre-caricamento
        const tempImg = new Image();
        tempImg.src = currentImageSrc;

        tempImg.onload = () => {
            // Applichiamo la sorgente all'elemento reale del DOM
            this.imgElement.src = currentImageSrc;

            // 3. Delay "Divino": diamo tempo all'animazione di essere vista (es. 400ms)
            setTimeout(() => {
                if (this.loader) this.loader.style.display = "none";
                this.imgElement.style.opacity = "1";
            }, 400);
        };

        // Didascalia e Texture 3D (istantanei)
        const nomeFormattato = this.formatSafeName(this.currentName);
        this.counter.textContent = `${nomeFormattato} — ${this.currentIndex + 1} / ${this.images.length}`;
        
        if (this.frontFace) {
            this.frontFace.style.backgroundImage = `url('${currentImageSrc}')`;
        }
    },

    buildSidebar(subFolders) {
        if (!this.sidebarGrid) return;
        this.sidebarGrid.innerHTML = "";
        
        Object.entries(subFolders).forEach(([subKey, subData]) => {
            let coverImg = "";
            if (Array.isArray(subData)) coverImg = subData[0];
            else if (typeof subData === 'object') {
                const firstVal = Object.values(subData)[0];
                coverImg = typeof firstVal === 'string' ? firstVal : "";
            }

            const card = document.createElement("div");
            card.className = "sidebar-card";
            card.innerHTML = `
                <div class="sidebar-card__bg" style="background-image: url('${coverImg}')"></div>
                <div class="sidebar-card__overlay"></div>
                <h5 class="sidebar-card__title">📁 ${this.formatSafeName(subKey)}</h5>
            `;

            card.addEventListener("click", () => this.open(subData, 0, subKey));
            this.sidebarGrid.appendChild(card);
        });
    },

    formatSafeName(name) {
        if (!name) return "ESPLORA";
        return name.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
    },

    goBack() {
        if (this.history.length === 0) return;
        const previousState = this.history.pop();
        this.open(previousState.node, 0, previousState.name, true);
    },

    close() {
        if (!this.lightbox) return;
        this.lightbox.classList.remove("active");
        document.body.style.overflow = "";
        this.history = [];
        this.currentNode = null;
    },

    prev() {
        if (!this.images.length) return;
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateView();
    },

    next() {
        if (!this.images.length) return;
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateView();
    },

    handleKeyboard(e) {
        if (this.lightbox && this.lightbox.classList.contains("active")) {
            if (e.key === "ArrowLeft") this.prev();
            if (e.key === "ArrowRight") this.next();
            if (e.key === "Escape") this.close();
            if (e.key === "Backspace" && this.history.length > 0) this.goBack();
        }
    }
};

// Esposizione Globale
window.Lightbox = Lightbox;

// Inizializzazione al boot
document.addEventListener("DOMContentLoaded", () => Lightbox.init());