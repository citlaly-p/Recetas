/* Maneja el perfil del usuario guardando datos en localStorage */

var userData = {};

function cargarDatos() {
    var guardados = localStorage.getItem('ximkha-usuario');
    if (guardados) {
        userData = JSON.parse(guardados);
    } else {
        /* valores por defecto para usuario nuevo */
        userData = {
            nombre: 'Usuario Anónimo',
            email: 'usuario@example.com',
            telefono: '',
            fechaNacimiento: '',
            bio: '',
            fechaRegistro: new Date().toLocaleDateString(),
            avatar: 'https://via.placeholder.com/150x150/0a0a0a/c8873a?text=👤',
            recetasCocinadas: 0,
            tiempoCocina: 0,
            preferencias: {
                notificaciones: true,
                newsletter: false,
                temaOscuro: false
            }
        };
    }
}

function guardarDatos() {
    localStorage.setItem('ximkha-usuario', JSON.stringify(userData));
}

function mostrarDatosEnPagina() {
    document.getElementById('nombre-usuario').textContent = userData.nombre;
    document.getElementById('email-usuario').textContent = userData.email;
    document.getElementById('fecha-registro').textContent = userData.fechaRegistro;
    document.getElementById('avatar-imagen').src = userData.avatar;

    document.getElementById('nombre').value = userData.nombre;
    document.getElementById('email').value = userData.email;
    document.getElementById('telefono').value = userData.telefono;
    document.getElementById('fecha-nacimiento').value = userData.fechaNacimiento;
    document.getElementById('bio').value = userData.bio;

    document.getElementById('notificaciones').checked = userData.preferencias.notificaciones;
    document.getElementById('newsletter').checked = userData.preferencias.newsletter;
    document.getElementById('tema-oscuro').checked = userData.preferencias.temaOscuro;
}

function actualizarEstadisticas() {
    var favs = JSON.parse(localStorage.getItem('ximkha-favoritos') || '[]');
    document.getElementById('total-favoritos').textContent = favs.length;
    document.getElementById('recetas-cocinadas').textContent = userData.recetasCocinadas;
    document.getElementById('tiempo-cocina').textContent = userData.tiempoCocina;
}

function mostrarNotificacion(mensaje, tipo) {
    var nota = document.createElement('div');
    nota.className = 'notificacion ' + tipo;
    nota.textContent = mensaje;
    document.body.appendChild(nota);
    setTimeout(function() { nota.classList.add('visible'); }, 100);
    setTimeout(function() {
        nota.classList.remove('visible');
        setTimeout(function() { document.body.removeChild(nota); }, 300);
    }, 3000);
}

function aplicarTema() {
    if (userData.preferencias.temaOscuro) {
        document.body.classList.add('tema-oscuro');
    } else {
        document.body.classList.remove('tema-oscuro');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    mostrarDatosEnPagina();
    actualizarEstadisticas();
    aplicarTema();

    /* guardar perfil */
    document.getElementById('form-perfil').addEventListener('submit', function(e) {
        e.preventDefault();
        userData.nombre = document.getElementById('nombre').value;
        userData.email = document.getElementById('email').value;
        userData.telefono = document.getElementById('telefono').value;
        userData.fechaNacimiento = document.getElementById('fecha-nacimiento').value;
        userData.bio = document.getElementById('bio').value;
        guardarDatos();
        mostrarDatosEnPagina();
        mostrarNotificacion('Perfil actualizado', 'success');
    });

    /* cancelar */
    document.getElementById('btn-cancelar').addEventListener('click', function() {
        mostrarDatosEnPagina();
    });

    /* cambiar avatar */
    document.getElementById('btn-cambiar-avatar').addEventListener('click', function() {
        var avatares = [
            'https://via.placeholder.com/150x150/0a0a0a/c8873a?text=👤',
            'https://via.placeholder.com/150x150/f093fb/ffffff?text=👨',
            'https://via.placeholder.com/150x150/43e97b/ffffff?text=👩',
            'https://via.placeholder.com/150x150/f6d365/ffffff?text=🧑'
        ];
        var actual = avatares.indexOf(userData.avatar);
        userData.avatar = avatares[(actual + 1) % avatares.length];
        guardarDatos();
        document.getElementById('avatar-imagen').src = userData.avatar;
    });

    /* preferencias */
    document.getElementById('notificaciones').addEventListener('change', function(e) {
        userData.preferencias.notificaciones = e.target.checked;
        guardarDatos();
    });
    document.getElementById('newsletter').addEventListener('change', function(e) {
        userData.preferencias.newsletter = e.target.checked;
        guardarDatos();
    });
    document.getElementById('tema-oscuro').addEventListener('change', function(e) {
        userData.preferencias.temaOscuro = e.target.checked;
        guardarDatos();
        aplicarTema();
    });

    /* botones de cuenta */
    document.querySelector('.btn-cambiar-password').addEventListener('click', function() {
        var nueva = prompt('Nueva contraseña:');
        if (nueva) mostrarNotificacion('Contraseña actualizada', 'success');
    });

    document.querySelector('.btn-exportar-datos').addEventListener('click', function() {
        var datos = {
            usuario: userData,
            favoritos: JSON.parse(localStorage.getItem('ximkha-favoritos') || '[]')
        };
        var blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'mis-datos-ximkha.json';
        a.click();
        URL.revokeObjectURL(url);
        mostrarNotificacion('Datos exportados', 'success');
    });

    document.querySelector('.btn-eliminar-cuenta').addEventListener('click', function() {
        if (confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('ximkha-usuario');
            localStorage.removeItem('ximkha-favoritos');
            window.location.href = 'index.html';
        }
    });
});