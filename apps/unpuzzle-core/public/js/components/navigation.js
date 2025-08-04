// Navigation component
const Navigation = {
    init() {
        this.setupMobileMenu();
    },

    setupMobileMenu() {
        const menuButton = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.nav-menu');

        if (menuButton && nav) {
            menuButton.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
        }
    }
};

export default Navigation; 