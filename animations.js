const AnimationObserver = {
    observer: null,

    init() {
        this.observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add("visible");
                    }, 50);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        this.observeNewElements();
    },

    observeNewElements() {
        if (!this.observer) return;
        document.querySelectorAll('.fade-in:not(.visible), .reveal-up:not(.visible)').forEach(el => {
            this.observer.observe(el);
        });
    }
};