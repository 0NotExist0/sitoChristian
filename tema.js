/**
 * PORTA NOVA - ThemeManager Pro
 * Gestisce l'alternanza tra il Regno di Zeus (Night) e Apollo (Day).
 */
const ThemeManager = {
    storageKey: "portanova_theme",

    init() {
        // 1. Recuperiamo il body solo quando init viene chiamato
        this.body = document.body;
        
        // 2. Controllo immediato del tema salvato
        const savedTheme = localStorage.getItem(this.storageKey);
        
        if (savedTheme === "day") {
            this.setDay();
        } else {
            this.setNight();
        }

        console.log(`[ThemeManager] Dominio attuale: ${savedTheme || 'night'}`);
        
        // 3. Agganciamo il listener al pulsante
        this.bindEvents();
    },

    bindEvents() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            // Rimuoviamo eventuali listener precedenti per evitare doppie attivazioni
            toggleBtn.replaceWith(toggleBtn.cloneNode(true));
            const newBtn = document.getElementById('themeToggle');
            newBtn.addEventListener('click', () => this.toggle());
        }
    },

    toggle() {
        // Usiamo classList.contains per la massima precisione
        if (this.body.classList.contains('day-theme')) {
            this.setNight();
        } else {
            this.setDay();
        }
    },

    setDay() {
        this.body.classList.add('day-theme');
        localStorage.setItem(this.storageKey, "day");
        this.updateUI("day");
    },

    setNight() {
        this.body.classList.remove('day-theme');
        localStorage.setItem(this.storageKey, "night");
        this.updateUI("night");
    },

    updateUI(mode) {
        const icon = document.querySelector('.theme-toggle-icon');
        if (icon) {
            icon.innerHTML = mode === "day" ? "🌙" : "☀️";
        }
        
        // OPZIONALE: Qui potresti aggiungere logica per cambiare 
        // filtri o colori specifici dei loader se necessario
    }
};

// Esecuzione sicura al caricamento del DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
    ThemeManager.init();
}