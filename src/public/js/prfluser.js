document.addEventListener("DOMContentLoaded", (event) => {

  const selectElement = document.getElementById("select_ctr");
  selectElement.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    handleSelectChange(selectedValue);
  });

  const selectMonth = document.getElementById("select_payment");
  selectMonth.addEventListener('change', (event) => {
    const selectedValueCrt = event.target.value;
    handleSelectContract(selectedValueCrt);
  });

});

function handleSelectChange(value) {
  fetch(`/vwctrt/${value}`)
    .then((response) => response.json())
    .then((info) => {
      if (info.success) {
        console.log(info.data)
        document.getElementById("contract_number").textContent =
          info.data.contract_id;
        document.getElementById("contract_status").textContent =
          info.data.active === 1 ? "Vigente" : "Vencido";
        document.getElementById("payment_date").textContent = (() => {
          const fechaCompleta = info.data.contract_start_date;
          const partesFecha = fechaCompleta.split(/, |\/| /); // Divide por coma y espacio, o barra, o espacio
          return partesFecha[1]; // Retorna el día, que es el tercer elemento en el array
        })();
        document.getElementById("due_date").textContent =
          info.data.contract_end_date;
        document.getElementById("wifi_status").textContent =
          info.data.has_wifi === 1 ? "Activo" : "Inactivo";
        document.getElementById("wifi_coste").textContent =
          info.data.wifi_cost !== null ? info.data.wifi_cost : "N/A";
      } else if (info.data.contract_id === None) {
        document.getElementById("contract_number").textContent = "";
      } else alert(info.message);
    })
    .catch((error) => console.error("Error:", error));
};

function handleSelectContract(value){
  fetch(`/pdmth/${value}`)
  .then((response) => response.json())
  .then((info) => {
    if(info.success){
      const endPaid = info.data.paid_date
      const objectDate = new Date();
      const monthToday = `${objectDate.getFullYear()}-${objectDate.getMonth() + 1}`
 
      function SerchMonthUnPaid(dateInit, dateEnd) {
        let init = new Date(dateInit);
        let end = new Date(dateEnd);
        init.setMonth(init.getMonth() + 1); // Ajustamos para no incluir el mes de la fecha Final
      
        let listMonth = [];
      
        while (init < end) {
          listMonth.push(`${init.getFullYear()}-${String(init.getMonth() + 1).padStart(2, '0')}`);
          init.setMonth(init.getMonth() + 1);
        }
      
        return listMonth;
      };

      const monthUnPaid = SerchMonthUnPaid(endPaid,monthToday);
      const selectMonth = document.getElementById("month");
      selectMonth.options.length = 0;
      monthUnPaid.forEach((x) => {
        const newOption = new Option(monthUnPaid, monthUnPaid);
        selectMonth.add(newOption);
      })
      

    } else alert(info.message);

  })
  .catch((error) => console.error("Error:", error))
};