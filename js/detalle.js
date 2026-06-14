/* Carga el detalle de una receta segun el id en la URL */

function cargarDetalle() {
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id')) || 0;

    var xhttp = new XMLHttpRequest();

    xhttp.onload = function() {
        var xml = xhttp.responseXML;
        var lista = xml.getElementsByTagName('receta');
        var nodo = lista[id];

        if (!nodo) {
            document.querySelector('main').innerHTML = '<p style="text-align:center;padding:60px;color:#888">Receta no encontrada.</p>';
            return;
        }

        /* datos basicos */
        var nombre = nodo.getElementsByTagName('nombre')[0].childNodes[0].nodeValue;
        var categoria = nodo.getElementsByTagName('categoria')[0].childNodes[0].nodeValue;
        var tiempo = nodo.getElementsByTagName('tiempo')[0].childNodes[0].nodeValue;
        var dificultad = nodo.getElementsByTagName('dificultad')[0].childNodes[0].nodeValue;
        var porciones = nodo.getElementsByTagName('porciones')[0].childNodes[0].nodeValue;
        var calorias = nodo.getElementsByTagName('calorias')[0].childNodes[0].nodeValue;
        var imagen = nodo.getElementsByTagName('imagen')[0].childNodes[0].nodeValue;
        var descripcion = nodo.getElementsByTagName('descripcion')[0].childNodes[0].nodeValue;
        var consejo = nodo.getElementsByTagName('consejo')[0].childNodes[0].nodeValue;
        var slug = nodo.getElementsByTagName('slug')[0].childNodes[0].nodeValue;

        /* nutricion */
        var grasas = nodo.getElementsByTagName('grasas')[0].childNodes[0].nodeValue;
        var proteina = nodo.getElementsByTagName('proteina')[0].childNodes[0].nodeValue;
        var carbohidratos = nodo.getElementsByTagName('carbohidratos')[0].childNodes[0].nodeValue;

        /* ingredientes */
        var nodosIng = nodo.getElementsByTagName('ingrediente');
        var htmlIng = '';
        for (var i = 0; i < nodosIng.length; i++) {
            htmlIng += '<li>' + nodosIng[i].childNodes[0].nodeValue + '</li>';
        }

        /* pasos */
        var nodosPasos = nodo.getElementsByTagName('paso');
        var htmlPasos = '';
        for (var j = 0; j < nodosPasos.length; j++) {
            htmlPasos += '<li>' + nodosPasos[j].childNodes[0].nodeValue + '</li>';
        }

        /* insertar en el HTML */
        document.title = nombre + ' | Ximkha';
        document.getElementById('detalle-imagen').src = imagen;
        document.getElementById('detalle-imagen').alt = nombre;
        document.getElementById('detalle-nombre').textContent = nombre;
        document.getElementById('detalle-categoria').textContent = categoria;
        document.getElementById('detalle-tiempo').textContent = tiempo;
        document.getElementById('detalle-dificultad').textContent = dificultad;
        document.getElementById('detalle-porciones').textContent = porciones;
        document.getElementById('detalle-calorias').textContent = calorias;
        document.getElementById('detalle-grasas').textContent = grasas;
        document.getElementById('detalle-proteina').textContent = proteina;
        document.getElementById('detalle-carbohidratos').textContent = carbohidratos;
        document.getElementById('detalle-descripcion').textContent = descripcion;
        document.getElementById('detalle-ingredientes').innerHTML = htmlIng;
        document.getElementById('detalle-pasos').innerHTML = htmlPasos;
        document.getElementById('detalle-consejo').textContent = consejo;

        /* numero de calorias sin el texto "kcal" */
        var soloNum = calorias.replace(/[^0-9]/g, '');
        var elCalNum = document.getElementById('detalle-calorias-num');
        if (elCalNum) elCalNum.textContent = soloNum;

        /* boton de favorito */
        var btnFav = document.getElementById('btn-favorito-detalle');
        if (btnFav && window.gestorFavoritos) {
            btnFav.setAttribute('data-receta', slug);
            window.gestorFavoritos.actualizarAparienciaBoton(btnFav);
            btnFav.addEventListener('click', function(e) {
                e.preventDefault();
                window.gestorFavoritos.alternarFavorito(btnFav);
            });
        }

        /* breadcrumb */
        var breadcrumb = document.getElementById('breadcrumb-receta');
        if (breadcrumb) breadcrumb.textContent = nombre;
    };

    xhttp.open('GET', '../xml/recetas.xml');
    xhttp.send();
}

cargarDetalle();