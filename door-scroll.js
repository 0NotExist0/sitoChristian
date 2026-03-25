const DoorScrollManager = {
    init() {
        this.leftPanel = document.querySelector('.door__panel--left');
        this.rightPanel = document.querySelector('.door__panel--right');
        this.doorLight = document.querySelector('.door__light');
        
        // Selettori mancanti per evitare errori in altre pagine
        if (!this.leftPanel || !this.rightPanel) return;

        // 1. Rimuoviamo l'animazione CSS automatica (keyframe) per prenderne il controllo con JS
        this.leftPanel.style.animation = 'none';
        this.rightPanel.style.animation = 'none';

        // 2. Impostiamo le texture personalizzate per le ante (assicurati che l'estensione sia corretta, es. .jpg o .png)
        this.leftPanel.style.backgroundImage = "url('ante/as.jpg')"; // Anta Sinistra
        this.leftPanel.style.backgroundSize = "cover";
        this.leftPanel.style.backgroundPosition = "center right";
        this.leftPanel.style.border = "none"; // Rimuove il background scuro di default
        
        this.rightPanel.style.backgroundImage = "url('ante/ad.jpg')"; // Anta Destra
        this.rightPanel.style.backgroundSize = "cover";
        this.rightPanel.style.backgroundPosition = "center left";
        this.rightPanel.style.border = "none";

        // Variabili per l'interpolazione fluida (Lerp)
        this.targetProgress = 0;
        this.currentProgress = 0;
        
        // Rileva lo scroll per calcolare il target
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Inizializza il calcolo dello scroll al caricamento
        this.handleScroll();
        
        // Avvia il loop di animazione a 60fps
        this.animate();
    },

    handleScroll() {
        // Quanti pixel di scroll servono per aprire la porta completamente? (es. i primi 700px)
        const maxScroll = 700; 
        const scrollY = window.scrollY;
        
        // Calcola la percentuale di scroll (da 0.0 a 1.0)
        let progress = scrollY / maxScroll;
        
        // Limita il valore tra 0 e 1 per evitare che le porte girino all'infinito
        if (progress > 1) progress = 1;
        if (progress < 0) progress = 0;
        
        this.targetProgress = progress;
    },

    animate() {
        // Lerp: avvicina dolcemente il progresso attuale al progresso target
        this.currentProgress += (this.targetProgress - this.currentProgress) * 0.08;

        // Angolo massimo di apertura: 85 gradi
        const maxAngle = 85;
        const currentAngle = maxAngle * this.currentProgress;

        // Applica la rotazione 3D dinamica
        this.leftPanel.style.transform = `perspective(800px) rotateY(-${currentAngle}deg)`;
        this.rightPanel.style.transform = `perspective(800px) rotateY(${currentAngle}deg)`;

        // Gestione dell'illuminazione/fulmini interni: aumenta la luce e l'effetto "divino" man mano che si apre
        if (this.doorLight) {
            // La luce interna parte a 0 e arriva al 100% di opacità
            this.doorLight.style.opacity = this.currentProgress;
            // Un effetto scale per far "esplodere" la luce quando la porta si apre
            const scale = 1 + (this.currentProgress * 0.5); 
            this.doorLight.style.transform = `scale(${scale})`;
        }

        // Se la porta è aperta per più del 30%, forziamo l'effetto fulmini del background (Zeus) nel body
        if (this.currentProgress > 0.3) {
            document.body.style.setProperty('--lightning-opacity', (this.currentProgress - 0.3) * 1.5);
        } else {
            document.body.style.setProperty('--lightning-opacity', '0');
        }

        requestAnimationFrame(() => this.animate());
    }
};