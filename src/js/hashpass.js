import bcrypt from 'bcrypt';

async function hashPassword(password) {
  const saltRounds = 10; // Puedes ajustar esto para ser más seguro
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error(error);
  }
};

async function checkPassword(inputPassword, storedHash) {
  try {
    // Compara la contraseña ingresada con el hash almacenado
    const match = await bcrypt.compare(inputPassword, storedHash);

    if (match) {
      // Las contraseñas coinciden
      return true;
    } else {
      // Las contraseñas no coinciden
      return false;
    }
  } catch (error) {
    console.error('Error al comparar la contraseña:', error);
  }
};

async function main() {
  let pas = '251207rd';
  let pas2 = '251207rd'
  
  // Generar hash y almacenarlo
  let guardada = await hashPassword(pas);

  // Espera de 2 segundos (opcional, solo para demostración)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Comparar contraseñas
  const resultado = await checkPassword(pas2, guardada);
  console.log('Resultado de la comparación:', resultado);
}

export{hashPassword,checkPassword}