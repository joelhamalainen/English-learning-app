import { useState, useEffect } from 'react'
import axios from 'axios'
import StudentView from './StudentView'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import TeacherView from './TeacherView';
import { Form } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';


function App() {
  const [role, setRole] = useState("")
  const [authentication, setAuthentication] = useState(false)
  const [password, setPassword] = useState("")
  const [wrongPassword, setWrongPassword] = useState(false)
  const [correctPassword, setCorrectPassword] = useState("")
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

      res = await axios.get(apiUrl + "password")
      data = res.data
      setCorrectPassword(data[0].password)

    } catch (err) {
      console.log(err.message)
    }
  }

  const checkPassword = () => {
    if (password === correctPassword) {
      setRole("teacher")
      setAuthentication(false)
      setPassword("")
    } else {
      setWrongPassword(true)
    }
  }

  useEffect(() => {
    fetchIt()
  }, [])


  return (
    <Container className="custom-container" style={{ maxWidth: 750 }}>
      {role === "" && (
        <>
          <h3>Welcome to the Learn English application!</h3>
          <p style={{ margin: 0 }}>Select your role:</p>
          <Button variant="primary" className="m-2" onClick={() => setAuthentication(true)}>Teacher</Button>
          <Button variant="primary" className="m-2" onClick={() => { setRole('student'); setAuthentication(false) }}>Student</Button>
        </>
      )}

      {authentication && (
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

      {role === "teacher" && (
        <TeacherView
          wordPairs={wordPairs}
          tags={tags}
          setTags={setTags}
          setWordPairs={setWordPairs}
          correctPassword={correctPassword}
          setCorrectPassword={setCorrectPassword}
          setRole={setRole}
        />
      )}

      {role === "student" && (
        <StudentView words={wordPairs} tags={tags} />
      )}
    </Container>
  )
}
export default App
