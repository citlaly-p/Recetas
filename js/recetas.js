/* Carga las recetas del XML y las muestra en tarjetas con filtro y búsqueda */

var contenedor = document.getElementById('contenedor-recetas');
var sinResultados = document.getElementById('sin-resultados');
var todasLasTarjetas = []; /* guarda { elemento, nombre, categoria } de cada tarjeta */

function cargarRecetas() {
    var cargando = document.createElement('p');
    cargando.id = 'mensaje-carga';
    cargando.style.cssText = 'text-align:center;color:var(--texto-suave);padding:40px;';
    cargando.textContent = 'Cargando recetas...';
    contenedor.appendChild(cargando);

    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var msgCarga = document.getElementById('mensaje-carga');
        if (msgCarga) msgCarga.remove();
        mostrarTarjetas(xhttp.responseXML);
    };
    xhttp.open('GET', '../xml/recetas.xml');
    xhttp.send();
}

function mostrarTarjetas(xml) {
    var lista = xml.getElementsByTagName('receta');
    todasLasTarjetas = [];

    for (var i = 0; i < lista.length; i++) {
        var nombre = lista[i].getElementsByTagName('nombre')[0].childNodes[0].nodeValue;
        var categoria = lista[i].getElementsByTagName('categoria')[0].childNodes[0].nodeValue;
        var tiempo = lista[i].getElementsByTagName('tiempo')[0].childNodes[0].nodeValue;
        var dificultad = lista[i].getElementsByTagName('dificultad')[0].childNodes[0].nodeValue;
        var porciones = lista[i].getElementsByTagName('porciones')[0].childNodes[0].nodeValue;
        var calorias = lista[i].getElementsByTagName('calorias')[0].childNodes[0].nodeValue;
        var imagen = lista[i].getElementsByTagName('imagen')[0].childNodes[0].nodeValue;
        var slug = lista[i].getElementsByTagName('slug')[0].childNodes[0].nodeValue;

        var enlace = document.createElement('a');
        enlace.href = 'detalle.html?id=' + i;
        enlace.className = 'tarjeta-receta';
        enlace.innerHTML =
            '<div class="tarjeta-imagen">' +
                '<img src="' + imagen + '" alt="' + nombre + '" />' +
                '<span class="tarjeta-categoria">' + categoria + '</span>' +
                '<span class="tarjeta-badge">⏱ ' + tiempo + '</span>' +
                '<button class="btn-favorito-flotante btn-favorito-grande" data-receta="' + slug + '" onclick="event.preventDefault();event.stopPropagation();">🤍</button>' +
            '</div>' +
            '<div class="info-receta">' +
                '<h3>' + nombre + '</h3>' +
                '<div class="receta-meta">' +
                    '<span>📊 ' + dificultad + '</span>' +
                    '<span>👥 ' + porciones + '</span>' +
                    '<span>🔥 ' + calorias + '</span>' +
                '</div>' +
            '</div>';

        contenedor.appendChild(enlace);
        todasLasTarjetas.push({ el: enlace, nombre: nombre.toLowerCase(), categoria: categoria });
    }

    /* actualiza botones de favorito */
    if (window.gestorFavoritos) {
        window.gestorFavoritos.configurarBotonesFavoritos();
    }

    /* activa filtros una vez cargadas las tarjetas */
    iniciarFiltros();
}

var categoriaActiva = 'todos';
var textoBusqueda   = '';

function aplicarFiltros() {
    var visibles = 0;

    todasLasTarjetas.forEach(function(t) {
        var coincideCategoria = categoriaActiva === 'todos' || t.categoria === categoriaActiva;
        var coincideBusqueda  = t.nombre.includes(textoBusqueda);

        if (coincideCategoria && coincideBusqueda) {
            t.el.style.display = '';
            visibles++;
        } else {
            t.el.style.display = 'none';
        }
    });

    sinResultados.style.display = visibles === 0 ? 'block' : 'none';
}

function iniciarFiltros() {
    /* botones de categoría */
    var botones = document.querySelectorAll('.btn-categoria');
    botones.forEach(function(boton) {
        boton.addEventListener('click', function() {
            botones.forEach(function(b) { b.classList.remove('activo'); });
            boton.classList.add('activo');
            categoriaActiva = boton.getAttribute('data-categoria');
            aplicarFiltros();
        });
    });

    /* buscador */
    var input = document.getElementById('buscador');
    input.addEventListener('input', function() {
        textoBusqueda = input.value.trim().toLowerCase();
        aplicarFiltros();
    });
}

cargarRecetas();