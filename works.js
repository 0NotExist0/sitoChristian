/**
 * WORKS MANAGER - Gestione galleria "I Nostri Lavori"
 */
/**
 * WORKS MANAGER - Versione 3.3 con Divine Section Loader
 */
const WorksManager = {
    init() {
        this.container = document.getElementById("works-container");
        this.loader = document.getElementById("worksLoader");
        
        if (!this.container || !window.galleryData || !window.galleryData['NostriLavori']) return;

        // 1. Mostra il loader e nascondi il container
        if (this.loader) this.loader.style.display = "flex";
        this.container.style.opacity = "0";

        // 2. Simuliamo un piccolo delay per caricare le texture (Pipeline Divina)
        setTimeout(() => {
            this.buildWorksCategories(window.galleryData['NostriLavori']);
            
            // 3. Nascondi loader e rivela container con effetto fade
            if (this.loader) this.loader.style.display = "none";
            this.container.style.opacity = "1";
        }, 800);
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

    buildWorksCategories(nostriLavoriData) {
        this.container.innerHTML = "";
        Object.entries(nostriLavoriData).forEach(([categoryName, dataNode]) => {
            const categoryImages = this.getAllImages(dataNode);
            if (categoryImages.length === 0) return;

            const displayName = this.formatName(categoryName);
            const coverImage = categoryImages[0];

            const item = document.createElement("div");
            item.className = "work-item fade-in"; 
            item.innerHTML = `
                <img src="${coverImage}" alt="${displayName}" loading="lazy">
                <div class="work-item__overlay">
                    <h3>${displayName}</h3>
                    <span class="work-cta">Vedi Galleria (${categoryImages.length} foto) ✦</span>
                </div>
            `;

            item.addEventListener("click", () => Lightbox.open(dataNode, 0, displayName));
            this.container.appendChild(item);
        });
    }
};

/**
 * MENU GALLERIA MANAGER - Gestisce il sottomenu dinamico nella Navbar
 */
const MenuGalleriaManager = {
    init() {
        const targetLink = document.querySelector('.nav__links a[href="#our-works"]');
        if (!targetLink || !window.galleryData['NostriLavori']) return;

        const parentLi = targetLink.parentElement;
        parentLi.classList.add('nav__item--has-dropdown');

        const dropdown = document.createElement("ul");
        dropdown.className = "nav__dropdown";

        // Crea dinamicamente le voci basandosi sulle cartelle in "NostriLavori"
        Object.keys(window.galleryData['NostriLavori']).forEach(catKey => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = "#";
            a.className = "nav__dropdown-link";
            a.textContent = WorksManager.formatName(catKey);

            a.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                Lightbox.open(window.galleryData['NostriLavori'][catKey], 0, a.textContent);
            });

            li.appendChild(a);
            dropdown.appendChild(li);
        });

        parentLi.appendChild(dropdown);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    WorksManager.init();
    MenuGalleriaManager.init();
});
