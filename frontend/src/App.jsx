import { useState, useEffect } from "react";
import axios from "axios";
import StudentView from "./StudentView";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import TeacherView from "./TeacherView";
import { Form } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";

/**
 * Main application component.
 * Handles user authentication and role-based views.
 * @component
 * @return {JSX.Element} The rendered component.
 */
function App() {
  const [role, setRole] = useState("");
  const [isAuthentication, setIsAuthentication] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);
  const [correctPassword, setCorrectPassword] = useState("");
  const [words, setWords] = useState([]);
  const [tags, setTags] = useState([]);
  const apiUrl = `/api/`;

  /**
   * Fetches words, tags, and the password from the API.
   * Updates the states with the fetched data.
   * @async
   * @function
   */
  const fetchData = async () => {
    try {
      let res = await axios.get(apiUrl + "words");
      let data = res.data;
      setWords(data);

      res = await axios.get(apiUrl + "tags");
      data = res.data;
      setTags(data);

      res = await axios.get(apiUrl + "password");
      data = res.data;
      setCorrectPassword(data[0].password);
    } catch (err) {
      console.log(err.message);
    }
  };

  /**
   * Validates the correctness of the password entered by the user.
   * Updates the state based on the validation result.
   * @function
   */
  const checkPassword = () => {
    if (password === correctPassword) {
      setRole("teacher");
      setIsAuthentication(false);
      setPassword("");
    } else {
      setIsPasswordWrong(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container className="custom-container" style={{ maxWidth: 750 }}>
      {/* Render role selection buttons if no role is selected */}
      {role === "" && (
        <>
          <h3>Welcome to the Learn English application!</h3>
          <p style={{ marginTop: 30, marginBottom: 0 }}>Select your role:</p>
          <Button
            className="m-2"
            style={{ borderColor: "black" }}
            onClick={() => setIsAuthentication(true)}
          >
            Teacher
          </Button>
          <Button
            className="m-2"
            style={{ borderColor: "black" }}
            onClick={() => {
              setRole("student");
              setIsAuthentication(false);
            }}
          >
            Student
          </Button>
        </>
      )}
      {/* Render password input if authentication is required */}
      {isAuthentication && (
        <>
          <FloatingLabel
            label="Password"
            style={{ marginLeft: "20%", marginRight: "20%", color: "grey" }}
          >
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>
          {isPasswordWrong && (
            <p style={{ color: "red" }}>Wrong password. Try again.</p>
          )}
          <Button
            variant="outline-secondary"
            style={{ margin: 10 }}
            onClick={checkPassword}
            onBlur={() => setIsPasswordWrong(false)}
          >
            Enter
          </Button>
        </>
      )}
      {role === "teacher" && (
        <TeacherView
          words={words}
          tags={tags}
          setTags={setTags}
          setWords={setWords}
          correctPassword={correctPassword}
          setCorrectPassword={setCorrectPassword}
          setRole={setRole}
        />
      )}
      {role === "student" && (
        <StudentView words={words} tags={tags} setRole={setRole} />
      )}
    </Container>
  );
}
export default App;
