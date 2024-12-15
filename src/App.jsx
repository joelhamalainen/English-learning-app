import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

const Row = ({pair}) => {
  const [inputFinnishWord, setInputFinnish] = useState(pair.finnish)
  const [inputEnglishWord, setInputEnglish] = useState(pair.english)
  const [editingWord, setEditingWord] = useState(false);

  const handleInputChangeFinnish = (event) => {
    setInputFinnish(event.target.value)
  }

  const handleInputChangeEnglish = (event) => {
    setInputEnglish(event.target.value)
  }

  const putWords = async () => {
    await axios.put(`http://localhost:3000/` + pair.id,
      {
        finnish: inputFinnishWord,
        english: inputEnglishWord
      })
  }

  const toggleEditing = () => {
    setEditingWord(!editingWord)
    if(editingWord) {
      putWords();
    }
  }
  return (
    <>
      <td>{pair.id}</td>
      <td>
        <input
          type="text"
          value={inputFinnishWord}
          onChange={handleInputChangeFinnish}
          onBlur={toggleEditing}
          autoFocus
        />
      </td>
      <td>
        <input
          type="text"
          value={inputEnglishWord}
          onChange={handleInputChangeEnglish}
          onBlur={toggleEditing}
          autoFocus
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
  };

  const postIt = async () => {
    await axios.post(`http://localhost:3000/`)
    fetchIt();
  }

  useEffect(() => {
    fetchIt()
  }, [])


  return (
    <>
      <h1>Learn English</h1>

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
            <tr key={index}>
              <Row pair={pair} />
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td id="foot" colSpan="1"><button onClick={postIt}>+</button></td>
          </tr>
        </tfoot>
      </table>
    </>
  )
}

export default App
