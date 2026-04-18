const CursorManager = {
    init() {
        const cursor = document.getElementById('custom-cursor');
        
        // Sicurezza: se per qualche motivo manca il div nell'HTML, lo script non crasha
        if (!cursor) {
            console.warn("CursorManager: Elemento #custom-cursor non trovato nel DOM.");
            return;
        }

        // 1. TRACCIAMENTO ISTANTANEO (Zero Lag, rapporto 1:1)
        // Usiamo translate3d per sfruttare l'accelerazione hardware della GPU
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        });

        // 2. GESTIONE HOVER (Tutte le tue classi interattive del tema Olympus)
        // Ho incluso bottoni d'oro, link della nav, input, porte 3D e icone di WhatsApp
        const interactables = `
            a, button, input, textarea, select, 
            .hero__cta, .gold-btn, .special-btn, 
            .nav__link, .nav__dropdown-btn, .dropdown-link,
            .corridor__door, .collection-card, .work-item, 
            .stat-card, .lightbox__btn, .lightbox__close, 
            .lightbox__back-btn, .sidebar-card, .lightbox__subcard,
            #wa-fab, #wa-submit
        `;
        
        document.addEventListener('mouseover', (e) => {
            // Verifica se il cursore è entrato in uno degli elementi interattivi o nei loro figli
            if (e.target.closest(interactables)) {
                cursor.classList.add('is-hovering');
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            // Verifica se il cursore è uscito dall'elemento interattivo
            if (e.target.closest(interactables)) {
                cursor.classList.remove('is-hovering');
            }
        });

        // 3. GESTIONE CLICK E RIDIMENSIONAMENTO
        document.addEventListener('mousedown', () => {
            cursor.classList.add('is-clicking');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('is-clicking');
        });
        
        // Fallback: se l'utente clicca e trascina il mouse fuori dalla finestra del browser
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('is-clicking');
            // Nascondiamo il cursore personalizzato se usciamo dalla finestra
            cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            // Riappare appena il mouse rientra nella finestra
            cursor.style.opacity = '1';
        });
    }
};

// Inizializza il sistema di cursore appena il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    CursorManager.init();
});
