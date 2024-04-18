document.addEventListener('DOMContentLoaded', function() {

    objectDom = {
        searchDocNumber: document.getElementById('serchDocumentNumber'),
        searchButton : document.getElementById('btnSerch'),
        nameForm : document.getElementById('name'),
        lastNameForm : document.getElementById('lastName'),
        emailForm : document.getElementById('email'),
        textForm : document.getElementById('values'),
        btnEdit : document.getElementById('editData'),
        btnDel : document.getElementById('deleteData'),
        inputPswd : document.getElementById('pswd'),
        imgUsr : document.getElementById('user-photo')
    };

    // Función que se llama cuando se hace clic en el botón de búsqueda
    function handleSearchClick() {

        const documentNumbervalue = objectDom.searchDocNumber.value.trim();

        fetch(`/vwusr/${documentNumbervalue}`)
            .then(response => response.json())
            .then(data => {
            if (data.success) {
                objectDom.searchDocNumber.readOnly = true;
                objectDom.searchButton.disabled = true;
                objectDom.btnEdit.disabled = false;
                objectDom.btnDel.disabled = false;

                const userInfo = data.data[0];
                objectDom.inputPswd.value = userInfo.user_id;
                objectDom.nameForm.value = userInfo.first_name ;
                objectDom.lastNameForm.value = userInfo.last_name;
                objectDom.emailForm.value = userInfo.email;
                objectDom.textForm.value = userInfo.contract_ids.replace(/,/g, '\n');
                objectDom.imgUsr.src = `/show_user_photo/${userInfo.personal_photo}`
            } else {
                console.log("ALERTA");
            }
            })
            .catch(error => {
                // Asegúrate de que userInfoDisplay esté definido en tu HTML
                console.error('Error:', error);
            });
    };

    function clickEdit() {

        const documentNumbervalue = objectDom.searchDocNumber.value.trim();
    
        fetch(`/vwusr/edit/${documentNumbervalue}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Usa la URL proporcionada por el servidor para redirigir
                window.location.href = data.redirectUrl;
            } else {
                // Manejar la situación en la que el documento no se encuentra
                console.error('Documento no encontrado o error en el servidor.');
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud fetch:', error);
        });
    };
    
    function clickDelete() {
        const idNumberValue = objectDom.inputPswd.value.trim();
    
        fetch('/deleteuser/' + idNumberValue, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/index'; // Redirigir al usuario
            } else {
                throw new Error('Error al eliminar el usuario');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
    
    

    objectDom.searchButton.addEventListener('click', handleSearchClick);
    objectDom.btnEdit.addEventListener('click', clickEdit);
    objectDom.btnDel.addEventListener('click', clickDelete);
});

const upload = multer({ 
    dest: 'uploads/', // directorio temporal para archivos cargados
    
  });