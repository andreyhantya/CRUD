let id = document.getElementById("userId");
let firstName = document.getElementById("userName");
let lastName = document.querySelector("#userLastName");
let age = document.querySelector("#userAge");
let selectUser; // Выбранный пользователь(для удаления его)
let dataBase = document.getElementById('selectDataBase');


//Отрисовка юзера в таблице
const fillUser = (obj) => {
    let newTr = document.createElement('tr');
    let table = document.querySelector('tbody');

    for (let key in obj) {
        newTr.innerHTML += `<td> ${obj[key]} </td>`
    }
    table.appendChild(newTr);
    clearFields();
    listener();
};

/*dataBase.addEventListener('change', (event) => {
    id.disabled = event.target.value === 'MySQL';           //спросить за эту строку
});*/

//Отчистка полей
const clearFields = () => {
    id.value = '';
    firstName.value = '';
    lastName.value = '';
    age.value = '';
};

//Обработка клика на таблице юзеров
const listener = () => {
    let tr = document.querySelectorAll('tr');

    for (let i = 0; i < tr.length; i++) {
        tr[i].addEventListener('click', (event) => {
            if (event.target.parentElement.cells[0].innerText === 'ID') {
                return null;
            } else {
                selectUser = event.target.parentElement;
                let td = event.target.parentElement.cells;
                id.value = td[0].innerText;
                firstName.value = td[1].innerText;
                lastName.value = td[2].innerText;
                age.value = td[3].innerText;
            }
        })
    }
};

//Удаление юзера
const deleteUser = () => {
    selectUser.remove();
    clearFields();
    alert('Пользователь успешно удалён!');
};

const sendJson = (db, method) => {
    console.log(db);
    let validation = true;
    let user = {
        id: id.value,
        userName: firstName.value,
        userLastNme: lastName.value,
        age: age.value,
    };
//Валидация на пустые поля
    for(let key in user){
        if(user[key] === ''){
            validation = false;
        }
    }
    if(validation && db !== 'Select Storage') {
        if (method === 'create') {
            const url = `http://localhost:3001/${db}_create`;
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    user: user,
                })
            })
                .then((response) => {
                    const data = response.json();
                    return data;
                })
                .then(data => {
                    fillUser(data[data.length - 1]);
                    console.log('Пользователь добавлен в базу данных');
                })
                .catch((err) => {
                    console.log(err)
                });

        } else if (method === 'update') {
            const url = `http://localhost:3001/${db}_update`;
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    user: user,
                })
            })
                .then((response) => {
                    const data = response.json();
                    return data;
                })
                .then(data => {
                    fillUser(data[data.length - 1]);
                    console.log('Пользователь добавлен в базу данных');
                })
                .catch((err) => {
                    console.log(err)
                });
        } else if (method === 'delete') {
            const url = `http://localhost:3001/${db}_delete`;

            fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    user: user,
                })
            })
                .then((response) => {
                    deleteUser();
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }else{
        alert('Заполните все поля!');
    }
    return false;
};
