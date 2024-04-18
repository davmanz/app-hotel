document.addEventListener('DOMContentLoaded', function() {

    objectDom = {
        serchContract: document.getElementById('serchContract'),
        btnSerch : document.getElementById('btnSearch'),
        nameForm : document.getElementById('name'),
        startDate : document.getElementById('start_date'),
        endDate : document.getElementById('end_date'),
        paymentDay : document.getElementById('payment_day'),
        rentAmount : document.getElementById('rent_amount'),
        warranty : document.getElementById('warranty'),
        hasWifi : document.getElementById('has_wifi'),
        wifiCost : document.getElementById('wifi_cost'),
        roomNumber : document.getElementById('room_number'),
        btnVwContract : document.getElementById('vwContract'),
        btnDel : document.getElementById('deleteData'),
        imgDwl : document.getElementById('imgDwl')
    };

    // Función que se llama cuando se hace clic en el botón de búsqueda
    function handleSearchClick() {

        const serchContractvalue = objectDom.serchContract.value.trim();

        fetch(`/vwctrt/${serchContractvalue}`)
            .then(response => response.json())
            .then(data => {
            if (data.success) {
                objectDom.serchContract.readonly = true;
                objectDom.btnSerch.disabled = true;
                objectDom.btnDel.disabled = false;
                
                dataContract = data.data;

                objectDom.nameForm.value = `${dataContract.first_name} ${dataContract.last_name}`;
                objectDom.startDate.value = dataContract.contract_start_date;
                objectDom.endDate.value = dataContract.contract_end_date;
                objectDom.paymentDay.value = dataContract.payment_day;
                objectDom.rentAmount.value = dataContract.rent_amount;
                objectDom.warranty.value = dataContract.warranty;
                objectDom.hasWifi.value = dataContract.hasWifi === 1 ? 'Si' : 'No' ;
                objectDom.wifiCost.value = dataContract.wifi_cost == undefined ? 'N/A' : dataContract.wifi_cost;
                objectDom.roomNumber.value = dataContract.number_room;
                objectDom.btnVwContract.disabled = dataContract.contract_photo == undefined ? true : false;
                objectDom.imgDwl.value = dataContract.contract_photo;

            } else {
                console.log("ALERTA");
            }
            })
            .catch(error => {
                // Asegúrate de que userInfoDisplay esté definido en tu HTML
                console.error('Error:', error);
            });
    };
    
    function clickDelete() {
        const serchContractvalue = objectDom.serchContract.value.trim();

        fetch('/deleteuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contract_id: serchContractvalue })
        })
        .then(response => {
            if (response.ok) {
                console.log('Usuario eliminado');
                window.location.href = '/index'; // Redirigir al usuario
            } else {
                throw new Error('Error al eliminar el usuario');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    function downloadImage(){
        const imageName = objectDom.imgDwl.value; // Asegúrate de obtener el valor correctamente
      
        // Actualiza la URL para incluir el nombre de la imagen como un parámetro
        window.location.href = `/dwlcontract?imageName=${imageName}`;
      };
      

    objectDom.btnSerch.addEventListener('click', handleSearchClick);
    //objectDom.btnDel.addEventListener('click', clickDelete);
    objectDom.btnVwContract.addEventListener('click',downloadImage)
});