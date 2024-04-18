function formartDate(isoDateString) {
    // Convertir la cadena ISO a un objeto Date
    let date = new Date(isoDateString);

    // Array con los nombres de los días en español
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Obtener el nombre del día
    let dayName = days[date.getUTCDay()];

    // Formatear la fecha
    // Puedes ajustar este formato según tus necesidades
    let formattedDate = `${dayName}, ${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;

    return formattedDate;
}

export{formartDate};