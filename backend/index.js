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
                        //console.log(words)
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
app.put('/:id', async (req, res) => {

    const { finnish, english } = req.body
    const id = req.params.id;
    console.log("put: " + finnish)
    console.log("put: " + english)
    try {
        const fetch = () => {
            return new Promise((resolve, reject) => {
                const query = `INSERT OR REPLACE INTO word_pairs (id, finnish, english) VALUES (?, ?, ?)`;
                db.run(query, [id, finnish, english], (err, words) => {
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


});

app.patch("/:myId([0-9]+)", async (req, res) => {
    console.log("patch: " + req.body)
    const id = parseInt(req.params.myId);
    const {finnish, english} = req.body;
    try {
        return new Promise((resolve, reject) => {
            const query =
                "UPDATE word_pairs SET finnish = ?, english = ? WHERE id = ?"
            db.all(
                "SELECT * FROM word_pairs WHERE id = ?", [id], (err, result) => {
                    if (err) {
                        reject(err);
                    } else if (result.length === 0) {
                        reject({ error: "ID not found" });
                    } else {
                        db.run(query, [finnish, english, id], (err, result) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            },
                        );
                    }
                },
            );
        });
    } catch (err) {
        console.error(err);
        res.status(404).json(err);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

