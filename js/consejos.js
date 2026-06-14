/* Filtra los consejos por categoria al hacer click en los botones */

document.addEventListener('DOMContentLoaded', function() {
    var botones  = document.querySelectorAll('.btn-categoria');
    var consejos = document.querySelectorAll('.tarjeta-consejo');

    botones.forEach(function(boton) {
        boton.addEventListener('click', function() {
            var categoria = this.getAttribute('data-categoria');

            /* quitar clase activo de todos y ponersela al que se hizo click */
            botones.forEach(function(b) { b.classList.remove('activo'); });
            boton.classList.add('activo');

            /* mostrar u ocultar tarjetas segun la categoria */
            consejos.forEach(function(c) {
                if (categoria === 'todos' || c.getAttribute('data-categoria') === categoria) {
                    c.style.display = 'block';
                    c.style.animation = 'fadeIn 0.4s ease';
                } else {
                    c.style.display = 'none';
                }
            });
        });
    });
});