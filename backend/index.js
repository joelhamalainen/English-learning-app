const express = require('express')
const app = express()
const path = require("path");
const port = process.env.PORT || 3000
const sqlite3 = require('sqlite3').verbose();
const cors = require("cors");
app.use(express.static(path.join(__dirname, "public")));
app.use(cors())
app.use(express.json());
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE words (id INTEGER PRIMARY KEY NOT NULL, finnish VARCHAR(255), english VARCHAR(255), tag INTEGER)");
    db.run("INSERT INTO words (finnish, english, tag) VALUES" +
        "('kissa', 'cat', 1), ('koira', 'dog', 1), ('lehmä', 'cow', 1), ('auto', 'car', 2), ('sininen', 'blue', 3)");

    db.run("CREATE TABLE tags (id INTEGER PRIMARY KEY NOT NULL, name VARCHAR(255))");
    db.run("INSERT INTO tags (name) VALUES('animals'), ('vehicles'), ('colors')");
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/api/update/:table', (req, res) => {
    try {
        const table = req.params.table;
        let createQuery = ""
        let insertQuery = ""
        let values = []
        if (table === "words") {
            createQuery = "CREATE TABLE words (id INTEGER PRIMARY KEY NOT NULL, finnish VARCHAR(255), english VARCHAR(255), tag INTEGER)"
            insertQuery = "INSERT INTO words (finnish, english, tag) VALUES(?, ?, ?)"
        } else {
            createQuery = "CREATE TABLE tags(id INTEGER PRIMARY KEY NOT NULL, name VARCHAR(255))"
            insertQuery = "INSERT INTO tags (name) VALUES(?)"
        }
        db.serialize(() => {
            db.run('DROP TABLE IF EXISTS ' + table)
                .run(createQuery, (err) => {
                    if (err) {
                        console.error(err)
                    }
                })
            let arr = req.body.body
            arr.forEach(element => {
                if (table === "words") {
                    values = [element.finnish, element.english, element.tag]
                } else {
                    values = [element.name]
                }
                db.run(insertQuery, values)
            })
            res.status(200).json();
        })
    } catch (err) {
        console.log(err)
        res.status(404).json(err);
    }
})

app.get('/api/:table', async (req, res) => {
    try {
        const table = req.params.table;
        const fetch = () => {
            return new Promise((resolve, reject) => {
                db.all(`SELECT * FROM ${table}`, (err, words) => {
                    if (err) {
                        reject(err.message);
                        console.log(err.message)
                    } else {
                        resolve(words);
                    }
                });
            });
        }
        res.send(await fetch());
    } catch (err) {
        console.error(err);
        res.status(404).json(err);
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

