export class Draggable {
    constructor(draggableClass='.draggable-scroll-x') {
        this.element = document.querySelectorAll(draggableClass);
        this.init();
    }

    init() {
        this.element.forEach(element => {
            let isDown = false;
            let startX;
            let scrollLeft;
        
            element.addEventListener('mousedown', (e) => {
                isDown = true;
                element.style.cursor = 'grabbing';
                startX = e.pageX - element.offsetLeft;
                scrollLeft = element.scrollLeft;
            });
        
            element.addEventListener('mouseleave', () => {
                isDown = false;
                element.style.cursor = 'grab';
            });
        
            element.addEventListener('mouseup', () => {
                isDown = false;
                element.style.cursor = 'grab';
            });
        
            element.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - element.offsetLeft;
                const walk = (x - startX);
                element.scrollLeft = scrollLeft - walk;
            });
        
            // Set initial cursor style
            element.style.cursor = 'grab';
        });
    }
}

