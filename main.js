/**
 * MAIN CONTROLLER - Luxury Doors
 * Gestisce il ciclo di vita dell'applicazione e il recupero dati.
 */
document.addEventListener("DOMContentLoaded", async () => {
    // URL unificato per Google Drive (GET)
    const googleDriveApiUrl = "https://script.google.com/macros/s/AKfycbwGBlkpRAz2PD4pWrDwzY8TPDw25TsDCnPerlpAV13y3dRth1TmQFus3JxrPf7i7MbDeQ/exec";
    
    // ============================================================
    // 1. PRE-LOADER (Fix FOUC per la sezione Card)
    // ============================================================
    // Accendiamo immediatamente il loader del Catalogo prima di fare la chiamata
    const catalogLoader = document.getElementById("catalogLoader");
    if (catalogLoader) {
        catalogLoader.style.display = "flex";
        
        // Opzionale: cambiamo il testo per far capire che stiamo scaricando i dati
        const loaderText = catalogLoader.querySelector('.divine-loader__text');
        if (loaderText) loaderText.textContent = "CONNESSIONE AL DRIVE...";
    }

    // ============================================================
    // 2. INIZIALIZZAZIONE UTILITY UI (Immediate)
    // ============================================================
    if (typeof CursorManager !== 'undefined') CursorManager.init();
    if (typeof NavbarController !== 'undefined') NavbarController.init();
    if (typeof AnimationObserver !== 'undefined') AnimationObserver.init();

    // ============================================================
    // 3. RECUPERO DATI ASINCRONO (Come un AssetBundle in Unity)
    // ============================================================
    try {
        console.log("[Main] Recupero catalogo da Google Drive...");
        const response = await fetch(googleDriveApiUrl);
        
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        
        const driveData = await response.json();
        window.galleryData = driveData;
        console.log("[Main] Dati ricevuti con successo.");

    } catch (error) {
        console.error("Errore critico Drive:", error);
        // Fallback in caso di assenza di rete
        window.galleryData = window.galleryData || {};
    }

    // ============================================================
    // 4. INIZIALIZZAZIONE MANAGER (Dipendenti dai Dati)
    // ============================================================
    // Questi script si occuperanno di spegnere i Loader ora che i dati ci sono
    if (typeof Lightbox !== 'undefined') Lightbox.init();
    if (typeof WorksManager !== 'undefined') WorksManager.init();
    if (typeof CatalogManager !== 'undefined') CatalogManager.init(); 
    if (typeof MenuGalleriaManager !== 'undefined') MenuGalleriaManager.init();
    
    // Fallback: se MenuCatalogoManager non si è inizializzato da solo, lo forziamo
    if (typeof MenuCatalogoManager !== 'undefined' && !document.querySelector('.nav__dropdown--cascading:not(.nav__dropdown--loader-state)')) {
        MenuCatalogoManager.init();
    }
    
    if (typeof FormManager !== 'undefined') FormManager.init();
});
