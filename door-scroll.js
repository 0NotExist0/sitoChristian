/**
 * DOOR INTERACTION CONTROLLER — Luxury Doors
 * Gestisce l'apertura delle ante tramite Scroll, Drag e Click.
 */

const DoorController = {
    init() {
        this.leftPanel = document.querySelector('.door__panel--left');
        this.rightPanel = document.querySelector('.door__panel--right');
        this.doorContainer = document.querySelector('.corridor__door');

        if (!this.leftPanel || !this.rightPanel || !this.doorContainer) return;

        // Variabili di stato (Il nostro Transform locale)
        this.currentAngle = 0;     // L'angolo visivo reale in questo momento
        this.targetAngle = 0;      // L'angolo a cui vogliamo arrivare
        this.maxAngle = 88;        // Apertura massima (poco meno di 90 per tenere la prospettiva)
        
        // Variabili per il Drag (Trascinamento)
        this.isDragging = false;
        this.startX = 0;
        this.startAngle = 0;
        this.dragDirectionModifier = 1;
        this.manualOverride = false; // Se true, lo scroll viene ignorato perché l'utente sta giocando con la porta

        this.bindEvents();
        this.render(); // Avvia il loop di animazione
    },

    bindEvents() {
        // 1. GESTIONE SCROLL
        window.addEventListener('scroll', () => {
            if (this.isDragging) return;
            
            const scrollY = window.scrollY;
            // Mappa i primi 600px di scroll all'angolo di apertura (0 -> 88 gradi)
            const scrollAngle = Math.min(this.maxAngle, (scrollY / 600) * this.maxAngle);

            // Se l'utente ha aperto la porta a mano, non forziamo la chiusura con lo scroll
            // a meno che non torni completamente in cima alla pagina.
            if (this.manualOverride) {
                if (scrollY < 50) this.manualOverride = false; // Reset
                return;
            }

            this.targetAngle = scrollAngle;
        });

        // 2. GESTIONE DRAG (MOUSE)
        this.doorContainer.addEventListener('mousedown', this.onDragStart.bind(this));
        window.addEventListener('mousemove', this.onDragMove.bind(this));
        window.addEventListener('mouseup', this.onDragEnd.bind(this));

        // 3. GESTIONE DRAG (TOUCH per Smartphone)
        this.doorContainer.addEventListener('touchstart', (e) => this.onDragStart(e.touches[0]), { passive: true });
        window.addEventListener('touchmove', (e) => this.onDragMove(e.touches[0]), { passive: true });
        window.addEventListener('touchend', this.onDragEnd.bind(this));

        // 4. GESTIONE CLICK RAPIDO (Toggle Apri/Chiudi)
        this.doorContainer.addEventListener('click', (e) => {
            // Se ho solo cliccato (non trascinato)
            if (Math.abs(this.targetAngle - this.startAngle) < 5) {
                this.manualOverride = true;
                // Se è mezza aperta la chiudo, altrimenti la spalanco
                this.targetAngle = this.targetAngle > 40 ? 0 : this.maxAngle;
            }
        });
    },

    onDragStart(e) {
        this.isDragging = true;
        this.manualOverride = true;
        this.startX = e.clientX || e.pageX;
        this.startAngle = this.targetAngle;
        document.body.style.userSelect = 'none'; // Evita di evidenziare testo mentre trascini

        // Calcola se stiamo trascinando l'anta destra o sinistra per invertire la matematica
        const screenCenter = window.innerWidth / 2;
        this.dragDirectionModifier = this.startX > screenCenter ? 1 : -1;
    },

    onDragMove(e) {
        if (!this.isDragging) return;
        
        const x = e.clientX || e.pageX;
        const deltaX = x - this.startX;

        // Se trasciniamo verso l'esterno, aggiungiamo gradi. Verso l'interno, li togliamo.
        const angleChange = deltaX * this.dragDirectionModifier * 0.4; // 0.4 è la sensibilità
        
        // Clamp (Limita l'angolo tra 0 e il massimo consentito)
        this.targetAngle = Math.max(0, Math.min(this.maxAngle, this.startAngle + angleChange));
    },

    onDragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        document.body.style.userSelect = '';
    },

    /**
     * IL RENDER LOOP
     * Viene eseguito 60 volte al secondo per calcolare l'interpolazione (Lerp)
     */
    render() {
        // LERP: Calcola la differenza tra dove siamo e dove vogliamo andare, e ne copre un 8% ad ogni frame.
        // Questo crea quell'effetto setoso e ammortizzato, tipico delle porte vere.
        this.currentAngle += (this.targetAngle - this.currentAngle) * 0.08;

        // Applica le rotazioni al DOM
        this.leftPanel.style.transform = `perspective(1200px) rotateY(-${this.currentAngle}deg)`;
        this.rightPanel.style.transform = `perspective(1200px) rotateY(${this.currentAngle}deg)`;

        // Richiama il loop al prossimo frame
        requestAnimationFrame(this.render.bind(this));
    }
};

// Avvio automatico quando la pagina è pronta
document.addEventListener("DOMContentLoaded", () => DoorController.init());
