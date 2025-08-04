class CourseContentInterface {
    constructor() {
        this.dropdownButtons = document.querySelectorAll('.dropdown-button');
    }

    init = () =>{
      this.dropdownButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownWrapper = button.closest('.dropdown-wrapper');
            const dropdownDetails = dropdownWrapper.querySelector('.dropdown-details');
            dropdownWrapper.classList.toggle('open');
            dropdownDetails.classList.toggle('hidden');
        });
      });
    }
}

// init the course content interface
window.courseContentInterface = new CourseContentInterface();
window.courseContentInterface.init();