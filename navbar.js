const NavbarController = {
    init() {
        this.navbar = document.getElementById("nav");
        this.menuBtn = document.getElementById("menuBtn");
        this.mobileMenu = document.getElementById("mobileMenu");
        this.mobileLinks = document.querySelectorAll(".mobile-link");
        
        if (this.navbar) {
            window.addEventListener("scroll", () => this.handleScroll());
        }

        if (this.menuBtn && this.mobileMenu) {
            this.menuBtn.addEventListener("click", () => {
                this.mobileMenu.classList.toggle("open");
            });

            this.mobileLinks.forEach(link => {
                link.addEventListener("click", () => {
                    this.mobileMenu.classList.remove("open");
                });
            });
        }
    },
    
    handleScroll() {
        this.navbar.classList.toggle("scrolled", window.scrollY > 60);
    }
};