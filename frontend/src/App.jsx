import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import StudentView from './StudentView'
import Button from 'react-bootstrap/Button';
import TeacherView from './TeacherView';

function App() {
  const [role, setRole] = useState("")
  const [wordPairs, setWordPairs] = useState([])
  const [tags, setTags] = useState([])

  const apiUrl = `http://localhost:3000/api/words`;

  const fetchIt = async () => {
    try {
      let res = await axios.get(apiUrl)
      let data = res.data
      setWordPairs(data)

      res = await axios.get(`http://localhost:3000/api/tags`)
      data = res.data
      setTags(data)

    } catch (err) {
      console.log(err.message)
      console.error(err)
    }
  }

  useEffect(() => {
    fetchIt()
  }, [])


  return (
    <>
      {role === "" ? (
        <>
          <h1>Learn English</h1>
          <p>Select your role:</p>
          <button onClick={() => setRole('teacher')}>Teacher</button>
          <button onClick={() => setRole('student')}>Student</button>
        </>
      ) : <button onClick={() => setRole("")}>Switch role</button>}

      {role === "teacher" && (
        <TeacherView wordPairs={wordPairs} tags={tags} setWordPairs={setWordPairs} setTags={setTags} />
      )}

      {role === "student" && (
        <StudentView words={wordPairs} tags={tags} />
      )}
    </>
  )
}
export default App
