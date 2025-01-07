import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import StudentView from './StudentView'

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
        <input
          type="text"
          value={inputFinnishWord}
          onChange={handleInputChangeFinnish}
          onBlur={handleBlurFinnish}
        />
      </td>
      <td>
        <input
          type="text"
          value={inputEnglishWord}
          onChange={handleInputChangeEnglish}
          onBlur={handleBlurEnglish}
        />
      </td>
      <td>
        <input
          type="text"
          value={inputTag}
          onChange={handleInputChangeTag}
          onBlur={handleBlurTag}
        />
      </td>
      <td><button id='delete_button' onClick={() => deleteRow(pair.id)}>x</button></td>
    </>
  )
}

function App() {
  const [wordPairs, setWordPairs] = useState([])
  const [showSavingMessage, setShowSavingMessage] = useState(false)
  const [savingMessage, setSavingMessage] = useState("")
  const apiUrl = `http://localhost:3000/api/words`;

  const fetchIt = async () => {
    try {
      let res = await fetch(apiUrl)
      let data = await res.json()
      setWordPairs(data)
    } catch (err) {
      console.log(err.message)
      console.error(err)
    }
  }

  const addRow = () => {
    let lastID = wordPairs[wordPairs.length - 1].id
    setWordPairs([...wordPairs, { id: lastID + 1, finnish: "", english: "", tag: "" }])
  }

  const save = async () => {
    let isEmptyFields = false;
    setShowSavingMessage(true)
    wordPairs.forEach(row => {
      if (Object.values(row).some(value => value === '')) {
        isEmptyFields = true
      }
    });
    if (!isEmptyFields) {
      await axios.post(`http://localhost:3000/api/update`,
        {
          body: wordPairs
        }
      )
      setSavingMessage(<p style={{ color: 'green' }}>Saved successfully.</p>)
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

  const deleteRow = (id) => {
    setWordPairs(wordPairs.filter(row => row.id !== id));
  };

  useEffect(() => {
    fetchIt()
  }, [])


  return (
    <>
      <h1>Learn English</h1>
      <h2>Teacher's view</h2>
      <table border="7">
        <thead>
          <tr>
            <th>Id</th>
            <th>Finnish</th>
            <th>English</th>
            <th>Tag</th>
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
            <td id="foot" colSpan="1"><button id="plusbutton" onClick={addRow}>+</button></td>
            <td colSpan="3"></td>
          </tr>
          <tr>
            <td colSpan="2"><button onClick={save} onBlur={() => setShowSavingMessage(false)}>save</button></td>
            <td colSpan="2">{showSavingMessage ? savingMessage : null}</td>
          </tr>
        </tfoot>
      </table>
      <br />
      <StudentView words={wordPairs} />
    </>
  )
}
export default App
