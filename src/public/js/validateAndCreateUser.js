document.getElementById("user-form").addEventListener("submit", function(event) {
    let isValid = true;

    // Validar Nombres (solo letras)
    const name = document.getElementById("name").value.trim();
    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(name)) {
        document.getElementById("name-error").textContent = "Por favor, ingrese su nombre (solo letras).";
        document.getElementById("name").style.backgroundColor = "#ffcccc";
        document.getElementById("name").classList.add("shake");
        setTimeout(() => {
            document.getElementById("name").classList.remove("shake");
        }, 1000);
        isValid = false;
    } else {
        document.getElementById("name").style.backgroundColor = "#ffffff";
        document.getElementById("name-error").textContent = "";
    }

    // Validar Apellidos (solo letras)
    const lastName = document.getElementById("last_name").value.trim();
    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(lastName)) {
        document.getElementById("last-name-error").textContent = "Por favor, ingrese sus apellidos (solo letras).";
        document.getElementById("last_name").style.backgroundColor = "#ffcccc";
        document.getElementById("last_name").classList.add("shake");
        setTimeout(() => {
            document.getElementById("last_name").classList.remove("shake");
        }, 1000);
        isValid = false;
    } else {
        document.getElementById("last_name").style.backgroundColor = "#ffffff";
        document.getElementById("last-name-error").textContent = "";
    }

    // Validar Número de Identificación (solo números)
    const idNumber = document.getElementById("id-number").value.trim();
    if (!/^\d+$/.test(idNumber)) {
        document.getElementById("id-number-error").textContent = "Por favor, ingrese su número de identificación (solo números).";
        document.getElementById("id-number").style.backgroundColor = "#ffcccc";
        document.getElementById("id-number").classList.add("shake");
        setTimeout(() => {
            document.getElementById("id-number").classList.remove("shake");
        }, 1000);
        isValid = false;
    } else {
        document.getElementById("id-number").style.backgroundColor = "#ffffff";
        document.getElementById("id-number-error").textContent = "";
    }

    // Validar Correo Electrónico
    const email = document.getElementById("email").value;
    if (!/\S+@\S+\.\S+/.test(email)) {
        document.getElementById("email-error").textContent = "El correo electrónico es inválido.";
        document.getElementById("email").style.backgroundColor = "#ffcccc";
        document.getElementById("email").classList.add("shake");
        setTimeout(() => {
            document.getElementById("email").classList.remove("shake");
        }, 1000);
        isValid = false;
    } else {
        document.getElementById("email").style.backgroundColor = "#ffffff";
        document.getElementById("email-error").textContent = "";
    }

    // Validar Contraseña
    const password = document.getElementById("password").value;
    if (password.length < 8) {
        document.getElementById("password-error").textContent = "La contraseña debe tener al menos 8 caracteres.";
        document.getElementById("password").style.backgroundColor = "#ffcccc";
        document.getElementById("password").classList.add("shake");
        setTimeout(() => {
            document.getElementById("password").classList.remove("shake");
        }, 1000);
        isValid = false;
    } else {
        document.getElementById("password").style.backgroundColor = "#ffffff";
        document.getElementById("password-error").textContent = "";
    }

    // Validar Foto Personal (opcional)
    const photo = document.getElementById("photo").files.length;
    if (photo === 0) {
        document.getElementById("photo-error").textContent = "Por favor, cargue una foto personal.";
        document.getElementById("photo").style.backgroundColor = "#ffcccc";
        document.getElementById("photo").classList.add("shake");
        setTimeout(() => {
            document.getElementById("photo").classList.remove("shake");
        }, 1000);
        isValid = false;
    } else {
        document.getElementById("photo").style.backgroundColor = "#ffffff";
        document.getElementById("photo-error").textContent = "";
    }

    // Prevenir el envío del formulario si hay errores
    if (!isValid) {
        event.preventDefault();
    }
});