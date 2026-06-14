/* Cambia entre el panel de login y registro */
function cambiarTab(cual) {
    var panelLogin = document.getElementById('panel-login');
    var panelRegistro = document.getElementById('panel-registro');
    var tabLogin = document.getElementById('tab-login');
    var tabRegistro = document.getElementById('tab-registro');

    if (cual === 'login') {
        panelLogin.classList.add('activo');
        panelRegistro.classList.remove('activo');
        tabLogin.classList.add('activo');
        tabRegistro.classList.remove('activo');
    } else {
        panelRegistro.classList.add('activo');
        panelLogin.classList.remove('activo');
        tabRegistro.classList.add('activo');
        tabLogin.classList.remove('activo');
    }

    /* limpiar mensajes al cambiar de tab */
    ocultarMensajes();
}

function mostrarError(id, texto) {
    var el = document.getElementById(id);
    el.textContent = texto;
    el.style.display = 'block';
}

function mostrarExito(id, texto) {
    var el = document.getElementById(id);
    el.textContent = texto;
    el.style.display = 'block';
}

function ocultarMensajes() {
    var msgs = document.querySelectorAll('.error-msg, .exito-msg');
    msgs.forEach(function(m) { m.style.display = 'none'; });
}

/* Login: busca el usuario en el XML de usuarios */
function iniciarSesion() {
    var email = document.getElementById('login-email').value.trim();
    var password = document.getElementById('login-password').value;

    ocultarMensajes();

    if (!email || !password) {
        mostrarError('error-login', 'Por favor llena todos los campos.');
        return;
    }

    /* primero revisar si hay usuarios registrados en localStorage */
    var registrados = JSON.parse(localStorage.getItem('ximkha-usuarios-registrados') || '[]');
    for (var i = 0; i < registrados.length; i++) {
        if (registrados[i].email === email && registrados[i].password === password) {
            guardarSesion(registrados[i]);
            return;
        }
    }

    /* si no está en localStorage, buscar en el XML */
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var xml = xhttp.responseXML;
        var lista = xml.getElementsByTagName('usuario');
        var encontrado = false;

        for (var j = 0; j < lista.length; j++) {
            var xmlEmail = lista[j].getElementsByTagName('email')[0].childNodes[0].nodeValue;
            var xmlPassword = lista[j].getElementsByTagName('password')[0].childNodes[0].nodeValue;

            if (xmlEmail === email && xmlPassword === password) {
                var nombre = lista[j].getElementsByTagName('nombre')[0].childNodes[0].nodeValue;
                var avatar = lista[j].getElementsByTagName('avatar')[0].childNodes[0].nodeValue;
                guardarSesion({ nombre: nombre, email: email, avatar: avatar });
                encontrado = true;
                break;
            }
        }

        if (!encontrado) {
            mostrarError('error-login', 'Correo o contraseña incorrectos.');
        }
    };

    xhttp.onerror = function() {
        mostrarError('error-login', 'No se pudo conectar. Intenta de nuevo.');
    };

    xhttp.open('GET', '../xml/usuarios.xml');
    xhttp.send();
}

/* Guarda la sesión y redirige al perfil */
function guardarSesion(usuario) {
    var datos = {
        nombre: usuario.nombre,
        email: usuario.email,
        avatar: usuario.avatar || '👤',
        fechaRegistro: new Date().toLocaleDateString(),
        telefono: '',
        fechaNacimiento: '',
        bio: '',
        recetasCocinadas: 0,
        tiempoCocina: 0,
        preferencias: {
            notificaciones: true,
            newsletter: false,
            temaOscuro: false
        }
    };

    localStorage.setItem('ximkha-usuario', JSON.stringify(datos));
    mostrarExito('exito-login', '¡Bienvenido, ' + usuario.nombre + '! Redirigiendo...');

    setTimeout(function() {
        window.location.href = 'usuario.html';
    }, 1200);
}

/* Registro: guarda el nuevo usuario en localStorage */
function registrarse() {
    var nombre = document.getElementById('reg-nombre').value.trim();
    var email = document.getElementById('reg-email').value.trim();
    var password  = document.getElementById('reg-password').value;
    var password2 = document.getElementById('reg-password2').value;

    ocultarMensajes();

    /* validaciones básicas */
    if (!nombre || !email || !password || !password2) {
        mostrarError('error-registro', 'Por favor llena todos los campos.');
        return;
    }

    if (password.length < 4) {
        mostrarError('error-registro', 'La contraseña debe tener al menos 4 caracteres.');
        return;
    }

    if (password !== password2) {
        mostrarError('error-registro', 'Las contraseñas no coinciden.');
        return;
    }

    /* revisar que el email no esté ya registrado */
    var registrados = JSON.parse(localStorage.getItem('ximkha-usuarios-registrados') || '[]');
    for (var i = 0; i < registrados.length; i++) {
        if (registrados[i].email === email) {
            mostrarError('error-registro', 'Ese correo ya tiene una cuenta.');
            return;
        }
    }

    /* guardar nuevo usuario */
    registrados.push({ nombre: nombre, email: email, password: password, avatar: '👤' });
    localStorage.setItem('ximkha-usuarios-registrados', JSON.stringify(registrados));

    mostrarExito('exito-registro', '¡Cuenta creada! Ahora puedes iniciar sesión.');

    /* limpiar campos */
    document.getElementById('reg-nombre').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-password2').value = '';

    /* cambiar al tab de login después de un momento */
    setTimeout(function() {
        cambiarTab('login');
        /* pre-llenar el email para comodidad */
        document.getElementById('login-email').value = email;
    }, 1500);
}

/* Al cargar: si ya hay sesión activa, mostrar botón de cerrar sesión */
document.addEventListener('DOMContentLoaded', function() {
    var sesion = localStorage.getItem('ximkha-usuario');
    if (sesion) {
        var datos = JSON.parse(sesion);
        /* mostrar mensaje de sesión activa */
        mostrarExito('exito-login', 'Ya tienes sesión iniciada como ' + datos.nombre);
        document.getElementById('exito-login').style.display = 'block';

        /* cambiar el botón para ir directo al perfil */
        var btnLogin = document.querySelector('.btn-auth');
        if (btnLogin) {
            btnLogin.textContent = 'Ir a mi perfil';
            btnLogin.onclick = function() {
                window.location.href = 'usuario.html';
            };
        }
    }
});