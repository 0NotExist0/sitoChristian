const CursorManager = {

    cursor: null,
    isMobile: false,

    interactables: `
        a, button, input, textarea, select,
        .hero__cta, .gold-btn, .special-btn,
        .nav__link, .nav__dropdown-btn, .dropdown-link,
        .corridor__door, .collection-card, .work-item,
        .stat-card, .lightbox__btn, .lightbox__close,
        .lightbox__back-btn, .sidebar-card, .lightbox__subcard,
        #wa-fab, #wa-submit
    `,

    init() {
        this.cursor = document.getElementById('custom-cursor');
        if (!this.cursor) return;

        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
        window.matchMedia('(max-width: 768px)').addEventListener('change', (e) => {
            this.isMobile = e.matches;
            this.reset();
        });

        this.bindMouse();
        this.bindTouch();
    },

    move(x, y) {
        this.cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },

    show()        { this.cursor.style.opacity = '1'; },
    hide()        { this.cursor.style.opacity = '0'; },
    setHover(on)  { this.cursor.classList.toggle('is-hovering', on); },
    setClick(on)  { this.cursor.classList.toggle('is-clicking', on); },

    reset() {
        this.setHover(false);
        this.setClick(false);
        this.hide();
    },

    bindMouse() {
        document.addEventListener('mousemove', (e) => {
            if (this.isMobile) return;
            this.move(e.clientX, e.clientY);
        });

        document.addEventListener('mouseover', (e) => {
            if (this.isMobile) return;
            this.setHover(!!e.target.closest(this.interactables));
        });

        document.addEventListener('mouseout', (e) => {
            if (this.isMobile) return;
            if (e.target.closest(this.interactables)) this.setHover(false);
        });

        document.addEventListener('mousedown', () => {
            if (this.isMobile) return;
            this.setClick(true);
        });

        document.addEventListener('mouseup', () => {
            if (this.isMobile) return;
            this.setClick(false);
        });

        document.addEventListener('mouseleave', () => {
            if (this.isMobile) return;
            this.setClick(false);
            this.hide();
        });

        document.addEventListener('mouseenter', () => {
            if (this.isMobile) return;
            this.show();
        });
    },

    bindTouch() {
        document.addEventListener('touchstart', (e) => {
            if (!this.isMobile) return;
            const t = e.touches[0];
            this.move(t.clientX, t.clientY);
            this.show();
            this.setHover(true);
            this.setClick(true);
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!this.isMobile) return;
            const t = e.touches[0];
            this.move(t.clientX, t.clientY);
        }, { passive: true });

        document.addEventListener('touchend', () => {
            if (!this.isMobile) return;
            this.setClick(false);
            this.setHover(false);
            this.hide();
        });

        document.addEventListener('touchcancel', () => {
            if (!this.isMobile) return;
            this.reset();
        });
    }

};

document.addEventListener('DOMContentLoaded', () => CursorManager.init());
