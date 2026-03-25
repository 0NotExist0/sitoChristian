/**
 * MAIN CONTROLLER - Luxury Doors
 * Gestisce il ciclo di vita dell'applicazione e il recupero dati.
 */
document.addEventListener("DOMContentLoaded", async () => {
    // URL unificato per Google Drive (GET) e Modulo Contatti (POST)
    const googleDriveApiUrl = "https://script.google.com/macros/s/AKfycbwGBlkpRAz2PD4pWrDwzY8TPDw25TsDCnPerlpAV13y3dRth1TmQFus3JxrPf7i7MbDeQ/exec";
    
    // 1. Inizializzazione Utility UI immediate
    if (typeof CursorManager !== 'undefined') CursorManager.init();
    if (typeof NavbarController !== 'undefined') NavbarController.init();
    if (typeof AnimationObserver !== 'undefined') AnimationObserver.init();

    try {
        // 2. Caricamento dati asincrono
        console.log("[Main] Recupero catalogo da Google Drive...");
        const response = await fetch(googleDriveApiUrl);
        
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        
        const driveData = await response.json();
        window.galleryData = driveData;
        console.log("[Main] Dati ricevuti con successo.");

    } catch (error) {
        console.error("Errore critico Drive:", error);
        // Fallback: se data.js è caricato, usa quello, altrimenti oggetto vuoto
        window.galleryData = window.galleryData || {};
    }

    // 3. Inizializzazione Manager Dipendenti dai Dati
    // Usiamo un ordine logico: prima il visualizzatore, poi chi genera i contenuti
    if (typeof Lightbox !== 'undefined') Lightbox.init();
    if (typeof WorksManager !== 'undefined') WorksManager.init();
    if (typeof CatalogManager !== 'undefined') CatalogManager.init();
    if (typeof MenuGalleriaManager !== 'undefined') MenuGalleriaManager.init();
    if (typeof MenuCatalogoManager !== 'undefined') MenuCatalogoManager.init();
    if (typeof FormManager !== 'undefined') FormManager.init();
});