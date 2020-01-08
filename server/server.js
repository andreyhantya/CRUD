const http = require('http');
const path = require('path');
const fs = require('fs');
let mysql = require('mysql');
let mock = [];
let json = [];


const server = http.createServer(requestHandler);

function requestHandler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.writeHead(200, {"Content-Type": "application/json"});

    let data = '';
    req.on('data', chunk => {
        data += chunk.toString();
    });

    req.on('end', () => {

        if (req.url === '/Mock_create') {
            mock = [...mock, JSON.parse(data).user];
            console.log('mock: ', mock);

            const response = JSON.stringify(mock);
            console.log('Mock response: ' + response);

            res.write(response);
            res.end();

        } else if (req.url === '/JSON_create') {
            json = [...json, JSON.parse(data).user];
            console.log('json: ', json);

            const response = JSON.stringify(json);
            console.log('JSON response: ' + response);
            fs.writeFile(path.join(__dirname, 'person.json'), `${response}`, (err) => {
                if (err) throw err;
                console.log('Файл был записан!');
            });
            res.write(response);
            res.end();

        } else if (req.url === '/MySQL_create') {
            let con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'crud'
            });

            json = [...json, JSON.parse(data).user];
            //Подключение к БД
            con.connect(function (err) {
                if (err) throw err;
                console.log("Connected!");
                let sql = `INSERT INTO users (id, Name, lastName, Age)
                      VALUES ('${json[0].id}','${json[0].userName}','${json[0].userLastNme}','${json[0].age}')`;
                //Отправка записи в БД
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Запись добавилась в базу данных");
                });
            });
            const response = JSON.stringify(json);
            //console.log('JSON response: ' + response);
            res.write(response);
            res.end();
        } else if (req.url === '/MySQL_delete') {
            console.log("УДАЛИТЬ");
            let con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'crud'
            });

            json = [...json, JSON.parse(data).user];
            //Подключение к БД
            con.connect(function (err) {
                if (err) throw err;
                var sql = `DELETE FROM users WHERE (id, Name, lastName, Age) = 
                    ('${json[0].id}', '${json[0].userName}', '${json[0].userLastNme}', '${json[0].age}')`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Удалённых пользователей: " + result.affectedRows);
                });
            });

            const response = JSON.stringify(json);
            //console.log('JSON response: ' + response);
            res.write(response);
            res.end();
        } else if (req.url === '/MySQL_update') {
            let con = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'crud'
            });

            json = [...json, JSON.parse(data).user];
            //Подключение к БД
            con.connect(function (err) {
                if (err) throw err;
                var sql = "UPDATE users SET (id, Name, lastName, Af) = 'Canyon 123' WHERE address = 'Valley 345'";
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log(result.affectedRows + " record(s) updated");
                });
                const response = JSON.stringify(json);
                console.log('JSON response: ' + response);
                res.write(response);
                res.end();

            })
        }

    })
}


server.listen(3001, () => {
    console.log('Server is running')
});


