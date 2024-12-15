import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import words from './wordPairs.js'

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
      //console.error(err)
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
              <td>{pair.id}</td>
              <td>{pair.finnish}</td>
              <td>{pair.english}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td id="foot" colSpan="1"><button onClick={() => postIt()}>+</button></td>
          </tr>
        </tfoot>
      </table>
    </>
  )
}

export default App
