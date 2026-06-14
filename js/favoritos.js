/* Guardamos favoritos en localStorage */
var favoritos = [];

function cargarFavoritos() {
    var guardados = localStorage.getItem('ximkha-favoritos');
    if (guardados) {
        favoritos = JSON.parse(guardados);
    }
}

function guardarFavoritos() {
    localStorage.setItem('ximkha-favoritos', JSON.stringify(favoritos));
}

function esFavorito(id) {
    for (var i = 0; i < favoritos.length; i++) {
        if (favoritos[i].id === id) return true;
    }
    return false;
}

function agregarFavorito(datos) {
    if (!esFavorito(datos.id)) {
        favoritos.push(datos);
        guardarFavoritos();
    }
}

function quitarFavorito(id) {
    favoritos = favoritos.filter(function(f) {
        return f.id !== id;
    });
    guardarFavoritos();
}

function mostrarNotificacion(mensaje, tipo) {
    var nota = document.createElement('div');
    nota.className = 'notificacion ' + tipo;
    nota.textContent = mensaje;
    document.body.appendChild(nota);

    /* pequeño delay para que aparezca la animacion */
    setTimeout(function() {
        nota.classList.add('visible');
    }, 50);

    setTimeout(function() {
        nota.classList.remove('visible');
        setTimeout(function() { nota.remove(); }, 400);
    }, 2800);
}

function actualizarBoton(boton) {
    var id = boton.getAttribute('data-receta');
    if (esFavorito(id)) {
        boton.textContent = '❤️';
        boton.classList.add('favorito-activo');
    } else {
        boton.textContent = '🤍';
        boton.classList.remove('favorito-activo');
    }
}

function getDatosDesdeBoton(boton) {
    var tarjeta = boton.closest('.tarjeta-receta') || boton.closest('.contenedor-receta');
    var id = boton.getAttribute('data-receta');
    var titulo = '';
    var imagen = '';
    var enlace = window.location.href;

    if (tarjeta) {
        var h3 = tarjeta.querySelector('h3');
        var img = tarjeta.querySelector('img');
        var a = tarjeta.closest('a') || tarjeta.querySelector('a');
        if (h3) titulo = h3.textContent;
        if (img) imagen = img.src;
        if (a) enlace = a.href;
    } else {
        var h1 = document.querySelector('h1');
        var imgDet = document.querySelector('.imagen-receta img');
        if (h1) titulo = h1.textContent;
        if (imgDet) imagen = imgDet.src;
    }

    return { id: id, titulo: titulo, imagen: imagen, enlace: enlace };
}

function configurarBotones() {
    var botones = document.querySelectorAll('.btn-favorito-grande');
    botones.forEach(function(boton) {
        actualizarBoton(boton);

        /* clonar para limpiar listeners viejos */
        var nuevo = boton.cloneNode(true);
        boton.parentNode.replaceChild(nuevo, boton);
        actualizarBoton(nuevo);

        nuevo.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var datos = getDatosDesdeBoton(nuevo);
            if (esFavorito(datos.id)) {
                quitarFavorito(datos.id);
                mostrarNotificacion('Receta eliminada de favoritos', 'eliminar');
            } else {
                agregarFavorito(datos);
                mostrarNotificacion('Receta guardada en favoritos', 'agregar');
            }
            actualizarBoton(nuevo);
            actualizarContador();
            if (window.location.pathname.includes('favoritos.html')) {
                renderFavoritos();
            }
        });
    });
}

function actualizarContador() {
    var cont = document.getElementById('contador');
    if (cont) cont.textContent = favoritos.length;
}

function renderFavoritos() {
    var grid = document.getElementById('grid-favoritos');
    var vacio = document.getElementById('mensaje-vacio');
    var btnLimpiar = document.getElementById('btn-limpiar');
    if (!grid) return;

    actualizarContador();

    if (favoritos.length === 0) {
        vacio.style.display = 'block';
        grid.style.display = 'none';
        if (btnLimpiar) btnLimpiar.style.display = 'none';
        return;
    }

    vacio.style.display = 'none';
    grid.style.display = 'grid';
    if (btnLimpiar) btnLimpiar.style.display = 'inline-block';

    var html = '';
    for (var i = 0; i < favoritos.length; i++) {
        var r = favoritos[i];
        html += '<div class="tarjeta-receta">' +
            '<div class="tarjeta-imagen"><img src="' + r.imagen + '" alt="' + r.titulo + '" /></div>' +
            '<div class="info-receta">' +
            '<h3>' + r.titulo + '</h3>' +
            '<div style="margin-top:8px;display:flex;gap:10px;align-items:center;">' +
            '<a href="' + r.enlace + '" class="btn-ver-receta">Ver receta →</a>' +
            '<button class="btn-favorito-grande favorito-activo" data-receta="' + r.id + '">❤️</button>' +
            '</div></div></div>';
    }
    grid.innerHTML = html;
    configurarBotones();
}

/* Inicializar al cargar la pagina */
document.addEventListener('DOMContentLoaded', function() {
    cargarFavoritos();
    configurarBotones();
    actualizarContador();

    if (window.location.pathname.includes('favoritos.html')) {
        renderFavoritos();

        var btnLimpiar = document.getElementById('btn-limpiar');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', function() {
                if (confirm('¿Eliminar todos los favoritos?')) {
                    favoritos = [];
                    guardarFavoritos();
                    renderFavoritos();
                    mostrarNotificacion('Favoritos eliminados', 'eliminar');
                }
            });
        }
    }
});

/* Exponemos funciones para que otros scripts puedan usarlas */
window.gestorFavoritos = {
    configurarBotonesFavoritos: configurarBotones,
    actualizarAparienciaBoton: actualizarBoton,
    alternarFavorito: function(boton) {
        var datos = getDatosDesdeBoton(boton);
        if (esFavorito(datos.id)) {
            quitarFavorito(datos.id);
            mostrarNotificacion('Receta eliminada de favoritos', 'eliminar');
        } else {
            agregarFavorito(datos);
            mostrarNotificacion('Receta guardada en favoritos', 'agregar');
        }
        actualizarBoton(boton);
        actualizarContador();
    }
};