const express = require('express')
const app = express()
const path = require("path");
const port = process.env.PORT || 3000
const sqlite3 = require('sqlite3').verbose();
const cors = require("cors");
app.use(express.static(path.join(__dirname, "public")));
app.use(cors())
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE word_pairs (id INTEGER PRIMARY KEY NOT NULL, finnish VARCHAR(255), english VARCHAR(255))");
    db.run("INSERT INTO word_pairs (finnish, english) VALUES('kissa', 'cat'), ('koira', 'dog'), ('lehmä', 'cow')");
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/words', async (req, res) => {
    try {
        const fetch = () => {
            return new Promise((resolve, reject) => {
                db.all(`SELECT * FROM word_pairs`, (err, words) => {
                    if (err) {
                        reject(err.message);
                        console.log(err.message)
                    } else {
                        console.log(words)
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

app.post('', async (req, res) => {
    try {
        const fetch = () => {
            return new Promise((resolve, reject) => {
                const query = `INSERT INTO word_pairs (finnish, english) VALUES (?, ?)`;
                db.run(query, ["", ""], (err, words) => {
                    if (err) {
                        reject(err.message);
                        console.log(err.message)
                    } else {
                        console.log("words: " + words)
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
    console.log(`Example app listening on port ${port}`)
})

