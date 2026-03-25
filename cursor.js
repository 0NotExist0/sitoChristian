const CursorManager = {
    init() {
        const dot = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        
        // Se gli elementi non esistono nella pagina, fermiamo lo script per evitare errori
        if (!dot || !ring) return;

        let ringX = 0, ringY = 0;
        let dotX = 0, dotY = 0;
        let raf;

        // Traccia la posizione reale del mouse
        document.addEventListener('mousemove', (e) => {
            dotX = e.clientX;
            dotY = e.clientY;
        });

        // Loop di animazione per il ritardo dell'anello (lerp)
        function animateCursor() {
            ringX += (dotX - ringX) * 0.14; // Il valore 0.14 gestisce la "lentezza" dell'anello
            ringY += (dotY - ringY) * 0.14;

            dot.style.left = dotX + 'px';
            dot.style.top = dotY + 'px';
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';

            raf = requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Elementi interattivi che faranno reagire il cursore
        const interactables = 'a, button, .product-card, .service-item, .about-card, .t-btn, input, textarea, select, .modal-img-container, .modal-close';
        
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactables)) {
                ring.classList.add('hovering');
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactables)) {
                ring.classList.remove('hovering');
            }
        });

        // Animazioni al click del mouse
        document.addEventListener('mousedown', () => {
            dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
            ring.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });
        
        document.addEventListener('mouseup', () => {
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
            ring.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
};

// Se nel tuo progetto inizializzavi il cursore chiamando CursorManager.init(), 
// ricordati di assicurarti che venga chiamato! (es. al DOMContentLoaded)