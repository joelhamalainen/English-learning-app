import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import Dropdown from 'react-bootstrap/Dropdown'
import FloatingLabel from 'react-bootstrap/FloatingLabel';

function TeacherView({ wordPairs, tags, setTags, setWordPairs, correctPassword, setCorrectPassword, setRole }) {
    const [changePassword, setChangePassword] = useState(false)
    const [showSavingMessage, setShowSavingMessage] = useState(false)
    const [showTagSavingMessage, setShowTagSavingMessage] = useState(false)
    const [passwordChangeMessage, setPasswordChangeMessage] = useState("")
    const [savingMessage, setSavingMessage] = useState("")
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [wrongPassword, setWrongPassword] = useState(false)

    const checkPassword = async () => {
        if (password === correctPassword) {
            setPassword("")
            try {
                await axios.put('http://localhost:3000/api/password',
                    {
                        password: newPassword
                    })
                setCorrectPassword(newPassword)
                setPasswordChangeMessage(<p style={{ marginTop: 10, color: 'green' }}>Password changed succesfully.</p>)
                setChangePassword(false)
                setTimeout(() => {
                    setPasswordChangeMessage(null)
                }, 3000);
            } catch (err) {
                setPasswordChangeMessage(<p style={{ color: 'red' }}>err.message</p>)
            }
        } else {
            setWrongPassword(true)
        }
    }

    const addRow = () => {
        let lastID = wordPairs[wordPairs.length - 1].id
        setWordPairs([...wordPairs, { id: lastID + 1, finnish: "", english: "", tag: "" }])
    }

    const addTagRow = () => {
        let lastID = tags[tags.length - 1].id
        setTags([...tags, { id: lastID + 1, name: "" }])
    }

    const save = async (table) => {
        let isEmptyFields = false
        let arr = [];

        if (table === "words") {
            setShowSavingMessage(true)
            arr = wordPairs;
        } else {
            setShowTagSavingMessage(true)
            arr = tags;
        }

        arr.forEach(row => {
            if (Object.values(row).some(value => value === '')) {
                isEmptyFields = true
            }
        });

        if (!isEmptyFields) {
            try {
                await axios.post(`http://localhost:3000/api/update/${table}`,
                    {
                        body: arr
                    }
                )
                setSavingMessage(<p style={{ color: 'green' }}>Saved successfully.</p>)
            } catch (err) {
                setSavingMessage(<p style={{ color: 'red' }}>{err.message}</p>)
            }
        } else {
            setSavingMessage(<p style={{ color: 'red' }}>Empty fields not allowed!</p>)
        }
    }

    const updateWords = (data, id, column) => {
        const newWordPairs = wordPairs.map(pair => {
            if (pair.id === id) {
                if (column === "finnish") {
                    return { ...pair, finnish: data };
                } else if (column === "english") {
                    return { ...pair, english: data }
                } else {
                    return { ...pair, tag: data }
                }
            }

            return pair;
        });
        setWordPairs(newWordPairs);
    }

    const updateTags = (data, id) => {
        const newTags = tags.map(tag => {
            if (tag.id === id) {
                return { ...tag, name: data }
            }
            return tag;
        });
        setTags(newTags);
    }

    const deleteRow = (id) => {
        setWordPairs(wordPairs.filter(row => row.id !== id));
    };

    const deleteTag = (id) => {
        setTags(tags.filter(tag => tag.id !== id));
    };
    return (
        <>
            <Dropdown style={{ textAlign: 'right' }}>
                <Dropdown.Toggle variant="secondary">
                    Menu
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setRole("")}>Switch role</Dropdown.Item>
                    <Dropdown.Item onClick={() => setChangePassword(true)}>Change password</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            {changePassword && (
                <>
                    <FloatingLabel
                        label="Password"
                        style={{ marginLeft: '20%', marginRight: '20%', color: 'grey' }}>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        label="New password"
                        style={{ marginLeft: '20%', marginRight: '20%', color: 'grey' }}>
                        <Form.Control
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </FloatingLabel>
                    {wrongPassword && (
                        <p style={{ color: 'red' }}>Wrong password. Try again.</p>
                    )}
                    <Button
                        variant="outline-secondary"
                        style={{ margin: 10 }}
                        onClick={checkPassword}
                        onBlur={() => setWrongPassword(false)}>
                        Enter
                    </Button>
                </>
            )}
            {passwordChangeMessage}
            <h2 style={{ margin: 10 }}>Teacher</h2>
            <Accordion defaultActiveKey="0" alwaysOpen style={{ margin: 20 }} >
                <Accordion.Item eventKey="0">
                    <Accordion.Header><h3>Words:</h3></Accordion.Header>
                    <Accordion.Body style={{ padding: 0 }}>
                        <Table className='custom-table' striped bordered hover size="sm" responsive>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Finnish</th>
                                    <th>English</th>
                                    <th>Tag id</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {wordPairs.map((pair, index) => (
                                    <tr key={pair.id}>
                                        <Row pair={pair} update={updateWords} deleteRow={deleteRow} />
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td id="foot" colSpan="1">
                                        <Button
                                            style={{ width: '50%', marginTop: 3, marginBottom: 2, color: 'black' }}
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={addRow}>
                                            +
                                        </Button>
                                    </td>
                                    <td colSpan="4"></td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <Button
                                            style={{ width: '50%', marginTop: 3, marginBottom: 2 }}
                                            variant="success"
                                            onClick={() => save("words")}
                                            onBlur={() => setShowSavingMessage(false)}>
                                            save
                                        </Button>
                                    </td>
                                    <td colSpan="3">{showSavingMessage ? savingMessage : null}</td>
                                </tr>
                            </tfoot>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header><h3>Tags:</h3></Accordion.Header>
                    <Accordion.Body style={{ padding: 0 }}>
                        <Table className='custom-table' striped bordered hover size="sm" responsive>
                            <thead>
                                <tr>
                                    <th style={{ width: 10 }}>Id</th>
                                    <th>Tag name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tags.map((tag, index) => (
                                    <TagRow key={tag.id} tag={tag} deleteTag={deleteTag} update={updateTags} />
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td id="foot" colSpan="1">
                                        <Button
                                            style={{ width: '30%', marginTop: 3, marginBottom: 2, color: 'black' }}
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={addTagRow}>
                                            +
                                        </Button>
                                    </td>
                                    <td colSpan="2"></td>
                                </tr>
                                <tr>
                                    <td colSpan="1">
                                        <Button
                                            style={{ width: '50%', marginTop: 3, marginBottom: 2 }}
                                            variant="success"
                                            onClick={() => save("tags")}
                                            onBlur={() => setShowTagSavingMessage(false)}>
                                            save
                                        </Button>
                                    </td>
                                    <td colSpan="2">{showTagSavingMessage ? savingMessage : null}</td>
                                </tr>
                            </tfoot>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion >
        </>
    )
}

const Row = ({ pair, update, deleteRow }) => {
    const [inputFinnishWord, setInputFinnish] = useState(pair.finnish)
    const [inputEnglishWord, setInputEnglish] = useState(pair.english)
    const [inputTag, setInputTag] = useState(pair.tag)

    const handleInputChangeFinnish = (event) => {
        setInputFinnish(event.target.value)
    }

    const handleInputChangeEnglish = (event) => {
        setInputEnglish(event.target.value)
    }

    const handleInputChangeTag = (event) => {
        setInputTag(event.target.value)
    }

    const handleBlurFinnish = () => {
        update(inputFinnishWord, pair.id, "finnish")
    }

    const handleBlurEnglish = () => {
        update(inputEnglishWord, pair.id, "english")
    }

    const handleBlurTag = () => {
        update(inputTag, pair.id, "tag")
    }

    return (
        <>
            <td>{pair.id}</td>
            <td>
                <Form.Control
                    style={{ width: '100%', borderRadius: 0 }}
                    type="text"
                    value={inputFinnishWord}
                    onChange={handleInputChangeFinnish}
                    onBlur={handleBlurFinnish}
                />
            </td>
            <td>
                <Form.Control
                    style={{ width: '100%', borderRadius: 0 }}
                    type="text"
                    value={inputEnglishWord}
                    onChange={handleInputChangeEnglish}
                    onBlur={handleBlurEnglish}
                />
            </td>
            <td>
                <Form.Control
                    style={{ width: '100%', borderRadius: 0 }}
                    type="number"
                    value={inputTag}
                    onChange={handleInputChangeTag}
                    onBlur={handleBlurTag}
                />
            </td >
            <td>
                <Button
                    style={{ width: '50%', height: 30, marginTop: 3, color: 'black' }}
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteRow(pair.id)}>
                    x
                </Button>
            </td>
        </>
    )
}

const TagRow = ({ tag, deleteTag, update }) => {
    const [inputName, setInputName] = useState(tag.name)

    const handleInputChangeName = (event) => {
        setInputName(event.target.value)
    }

    const handleBlurName = () => {
        update(inputName, tag.id)
    }

    return (
        <tr key={tag.id}>
            <td style={{ width: '20%' }}>
                {tag.id}
            </td>
            <td>
                <Form.Control
                    style={{ borderRadius: 0 }}
                    type="text"
                    value={inputName}
                    onChange={handleInputChangeName}
                    onBlur={handleBlurName}
                />
            </td>
            <td>
                <Button
                    style={{ width: '30%', height: 30, marginTop: 3, color: 'black' }}
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteTag(tag.id)}>
                    x
                </Button>
            </td>
        </tr>
    )
}

export default TeacherView