import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

const Row = ({ pair, update }) => {
  const [inputFinnishWord, setInputFinnish] = useState(pair.finnish)
  const [inputEnglishWord, setInputEnglish] = useState(pair.english)

  const handleInputChangeFinnish = (event) => {
    setInputFinnish(event.target.value)
  }

  const handleInputChangeEnglish = (event) => {
    setInputEnglish(event.target.value)
  }

  const handleBlurFinnish = () => {
    update(inputFinnishWord, pair.id, "finnish")
  }

  const handleBlurEnglish = () => {
    update(inputEnglishWord, pair.id, "english")
  }

  return (
    <>
      <td>{pair.id}</td>
      <td>
        <input
          type="text"
          value={inputFinnishWord}
          onChange={(e) => handleInputChangeFinnish(e, pair.id)}
          onBlur={(e) => handleBlurFinnish(e, pair.id)}
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
    </>
  )
}
function App() {
  const [wordPairs, setWordPairs] = useState([])
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
    setWordPairs([...wordPairs, { id: lastID + 1, finnish: "", english: "" }])
  }

  const save = async () => {
    await axios.post(`http://localhost:3000/api/update`,
      {
        body: wordPairs
      }
    )
  }

  const updateWords = (word, id, language) => {
    const newWordPairs = wordPairs.map(pair => {
      if (pair.id === id) {
        if (language === "finnish") {
          return { ...pair, finnish: word };
        } else {
          return { ...pair, english: word }
        }
      }
      return pair;
    });
    setWordPairs(newWordPairs);
  }

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
          </tr>
        </thead>
        <tbody>
          {wordPairs.map((pair, index) => (
            <tr key={pair.id}>
              <Row pair={pair} update={updateWords} />
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td id="foot" colSpan="1"><button id="plusbutton" onClick={addRow}>+</button></td>
            <td colSpan="2"><button onClick={save}>save</button></td>
          </tr>
        </tfoot>
      </table>
    </>
  )
}
export default App
