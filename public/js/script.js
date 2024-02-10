'use strict'

// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = document.querySelectorAll('.needs-validation')

// Loop over them and prevent submission
Array.from(forms).forEach(form => {
  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    }

    form.classList.add('was-validated')
  }, false);
});


document.addEventListener('DOMContentLoaded', function () {
  var navbarToggler = document.querySelector('.navbar-toggler');
  var navbarCollapse = document.querySelector('.navbar-collapse');
  var signupLinks = document.querySelectorAll('.navbar-nav .nav-link[href="/signup"]');
  var loginLinks = document.querySelectorAll('.navbar-nav .nav-link[href="/login"]');
  var logoutLinks = document.querySelectorAll('.navbar-nav .nav-link[href="/logout"]');

  navbarToggler.addEventListener('click', function () {
    // Check if the screen width is 375px
    if (window.innerWidth === 375) {
      // Change the background color of the navbar
      navbarCollapse.style.backgroundColor = 'black'; // Replace with your desired color

      // Change the color of login, sign up, and logout links
      changeLinkColor(signupLinks, '#fff');
      changeLinkColor(loginLinks, '#ffffff');
      changeLinkColor(logoutLinks, '#ffffff');
    }
  });

  function changeLinkColor(links, color) {
    if (links) {
      links.forEach(function (link) {
        link.style.color = color;
      });
    }
  }
});

