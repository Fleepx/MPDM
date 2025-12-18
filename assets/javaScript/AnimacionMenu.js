window.addEventListener('scroll', function() {
    var header = document.querySelector("header");
    header.classList.toggle("scrolled", scrollY > 0);
  });