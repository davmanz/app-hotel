// Esta función valida los datos del usuario y devuelve un objeto con el resultado
function validateUser(userData) {
    const errors = {};
    let isValid = true;
  
    // Validar Nombres (solo letras)
    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(userData['name'])) {
      errors.name = "Por favor, ingrese su nombre (solo letras).";
      isValid = false;
    }
  
    // Validar Apellidos (solo letras)
    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(userData['lastName'])) {
      errors.lastName = "Por favor, ingrese sus apellidos (solo letras).";
      isValid = false;
    }
  
    // Validar Número de Identificación (solo números)
    if (!/^\d+$/.test(userData['id_number'])) {
      errors.idNumber = "Por favor, ingrese su número de identificación (solo números).";
      isValid = false;
    }
  
    // Validar Correo Electrónico
    if (!/\S+@\S+\.\S+/.test(userData['email'])) {
      errors.email = "El correo electrónico es inválido.";
      isValid = false;
    }
  
    // Validar Contraseña
    if (userData['password'].length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres.";
      isValid = false;
    }
  
    return {
      success: isValid,
      errors
    };
  }

export {validateUser};