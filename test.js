const fecha = new Date();
const hoy = fecha.getDate();
const mes = fecha.getMonth() + 1; 
const año = fecha.getFullYear();


function monthUnPaid(fechaInicio, fechaFin) {
  let inicio = new Date(fechaInicio);
  let fin = new Date(fechaFin);
  inicio.setMonth(inicio.getMonth() + 1); // Ajustamos para no incluir el mes de la fecha final

  let listaMeses = [];

  while (inicio < fin) {
    listaMeses.push(`${inicio.getFullYear()}-${String(inicio.getMonth() + 1).padStart(2, '0')}`);
    inicio.setMonth(inicio.getMonth() + 1);
  }

  return listaMeses;
}


// Ejemplo de uso:
const endA = '2024-03';
const hoyA = '2024-06';

const mesesIntermedios = monthUnPaid(endA, hoyA);
console.log(mesesIntermedios);
