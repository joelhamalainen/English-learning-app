import { useState, useEffect } from 'react'
import axios from 'axios'
import StudentView from './StudentView'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import TeacherView from './TeacherView';

function App() {
  const [role, setRole] = useState("")
  const [wordPairs, setWordPairs] = useState([])
  const [tags, setTags] = useState([])

  const apiUrl = `http://localhost:3000/api/`;

  const fetchIt = async () => {
    try {
      let res = await axios.get(apiUrl + "words")
      let data = res.data
      setWordPairs(data)

      res = await axios.get(apiUrl + "tags")
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
    <Container className="custom-container" style={{ maxWidth: 750 }}>
      {role === "" ? (
        <>
          <h3>Welcome to the Learn English application!</h3>
          <p style={{ margin: 0 }}>Select your role:</p>
          <Button variant="primary" className="m-2" onClick={() => setRole('teacher')}>Teacher</Button>
          <Button variant="primary" className="m-2" onClick={() => setRole('student')}>Student</Button>
        </>
      ) :
        <Button
          variant="outline-secondary"
          onClick={() => setRole("")}>
          Switch role
        </Button>}

      {role === "teacher" && (
        <TeacherView wordPairs={wordPairs} tags={tags} setWordPairs={setWordPairs} setTags={setTags} />
      )}

      {role === "student" && (
        <StudentView words={wordPairs} tags={tags} />
      )}
    </Container>
  )
}
export default App
