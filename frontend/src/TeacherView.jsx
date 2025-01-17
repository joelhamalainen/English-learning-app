import { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Dropdown from "react-bootstrap/Dropdown";
import FloatingLabel from "react-bootstrap/FloatingLabel";

/**
 * TeacherView component for managing word pairs and tags.
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.words - The list of words.
 * @param {Array} props.tags - The list of tags.
 * @param {Function} props.setTags - Function to update the tags state.
 * @param {Function} props.setWordPairs - Function to update the words state.
 * @param {string} props.correctPassword - The correct password for authentication.
 * @param {Function} props.setCorrectPassword - Function to update the correct password state.
 * @param {Function} props.setRole - Function to update the role state.
 * @return {JSX.Element} The rendered component.
 */
function TeacherView({
  words,
  tags,
  setTags,
  setWords,
  correctPassword,
  setCorrectPassword,
  setRole,
}) {
  const [changingPassword, setChangingPassword] = useState(false);
  const [showSavingMessage, setShowSavingMessage] = useState(false);
  const [showTagSavingMessage, setShowTagSavingMessage] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const [savingMessage, setSavingMessage] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);

  /**
   * Checks if the entered old password is correct and updates
   * the password with a new password to the server.
   * @async
   * @function
   */
  const checkPassword = async () => {
    if (password === correctPassword) {
      setPassword("");
      try {
        await axios.put("http://localhost:3000/api/password", {
          password: newPassword,
        });
        setCorrectPassword(newPassword);
        setPasswordChangeMessage(
          <p style={{ marginTop: 10, color: "green" }}>
            Password changed succesfully.
          </p>
        );
        setChangingPassword(false);
        setTimeout(() => {
          setPasswordChangeMessage(null);
        }, 3000);
      } catch (err) {
        setPasswordChangeMessage(<p style={{ color: "red" }}>err.message</p>);
      }
    } else {
      setWrongPassword(true);
    }
  };

  /**
   * Adds a new empty row to the words table.
   * @function
   */
  const addRow = () => {
    let lastID = words[words.length - 1].id;
    setWords([...words, { id: lastID + 1, finnish: "", english: "", tag: "" }]);
  };

  /**
   * Adds a new empty row to the tags table.
   * @function
   */
  const addTagRow = () => {
    let lastID = tags[tags.length - 1].id;
    setTags([...tags, { id: lastID + 1, name: "" }]);
  };

  /**
   * Saves the words or tags to the server.
   * @async
   * @function
   * @param {string} table - The table to save ("words" or "tags").
   */
  const save = async (table) => {
    let isEmptyFields = false;
    let arr = [];

    if (table === "words") {
      setShowSavingMessage(true);
      arr = words;
    } else {
      setShowTagSavingMessage(true);
      arr = tags;
    }

    // Checks if there are empty fields in the table.
    arr.forEach((row) => {
      if (Object.values(row).some((value) => value === "")) {
        isEmptyFields = true;
      }
    });

    if (!isEmptyFields) {
      try {
        await axios.post(`http://localhost:3000/api/update/${table}`, {
          body: arr,
        });
        setSavingMessage(<p style={{ color: "green" }}>Saved successfully.</p>);
      } catch (err) {
        setSavingMessage(<p style={{ color: "red" }}>{err.message}</p>);
      }
    } else {
      setSavingMessage(
        <p style={{ color: "red" }}>Empty fields not allowed!</p>
      );
    }
  };

  /**
   * Updates the words state with new data.
   * @function
   * @param {string} data - The new data.
   * @param {number} id - The ID of the row to update.
   * @param {string} column - The column to update ("finnish", "english", or "tag").
   */
  const updateWords = (data, id, column) => {
    const newWords = words.map((row) => {
      if (row.id === id) {
        if (column === "finnish") {
          return { ...row, finnish: data };
        } else if (column === "english") {
          return { ...row, english: data };
        } else {
          return { ...row, tag: data };
        }
      }
      return row;
    });
    setWords(newWords);
  };

  /**
   * Updates the tags state with new data.
   * @function
   * @param {string} data - The new data.
   * @param {number} id - The ID of the tag to update.
   */
  const updateTags = (data, id) => {
    const newTags = tags.map((tag) => {
      if (tag.id === id) {
        return { ...tag, name: data };
      }
      return tag;
    });
    setTags(newTags);
  };

  /**
   * Deletes a row from the words table.
   * @function
   * @param {number} id - The ID of the row to delete.
   */
  const deleteRow = (id) => {
    setWords(words.filter((row) => row.id !== id));
  };

  /**
   * Deletes a tag from the tags table.
   * @function
   * @param {number} id - The ID of the tag to delete.
   */
  const deleteTag = (id) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };
  return (
    <>
      <Dropdown style={{ textAlign: "right" }}>
        <Dropdown.Toggle variant="secondary">Menu</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setRole("")}>Switch role</Dropdown.Item>
          <Dropdown.Item onClick={() => setChangingPassword(true)}>
            Change password
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {changingPassword && (
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
          <FloatingLabel
            label="New password"
            style={{ marginLeft: "20%", marginRight: "20%", color: "grey" }}
          >
            <Form.Control
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FloatingLabel>
          {wrongPassword && (
            <p style={{ color: "red" }}>Wrong password. Try again.</p>
          )}
          <Button
            variant="outline-secondary"
            style={{ margin: 10 }}
            onClick={checkPassword}
            onBlur={() => setWrongPassword(false)}
          >
            Enter
          </Button>
        </>
      )}
      {passwordChangeMessage}
      <h2 style={{ margin: 10 }}>Teacher</h2>
      <Accordion defaultActiveKey="0" alwaysOpen style={{ margin: 20 }}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h3>Words:</h3>
          </Accordion.Header>
          <Accordion.Body style={{ padding: 0 }}>
            <Table
              className="custom-table"
              striped
              bordered
              hover
              size="sm"
              responsive
            >
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
                {words.map((pair, index) => (
                  <tr key={pair.id}>
                    <WordRow
                      pair={pair}
                      update={updateWords}
                      deleteRow={deleteRow}
                    />
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td id="foot" colSpan="1">
                    <Button
                      style={{
                        width: "50%",
                        marginTop: 3,
                        marginBottom: 2,
                        color: "black",
                      }}
                      variant="outline-secondary"
                      size="sm"
                      onClick={addRow}
                    >
                      +
                    </Button>
                  </td>
                  <td colSpan="4"></td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <Button
                      style={{ width: "50%", marginTop: 3, marginBottom: 2 }}
                      variant="success"
                      onClick={() => save("words")}
                      onBlur={() => setShowSavingMessage(false)}
                    >
                      save
                    </Button>
                  </td>
                  <td colSpan="3">
                    {showSavingMessage ? savingMessage : null}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <h3>Tags:</h3>
          </Accordion.Header>
          <Accordion.Body style={{ padding: 0 }}>
            <Table
              className="custom-table"
              striped
              bordered
              hover
              size="sm"
              responsive
            >
              <thead>
                <tr>
                  <th style={{ width: 10 }}>Id</th>
                  <th>Tag name</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag, index) => (
                  <TagRow
                    key={tag.id}
                    tag={tag}
                    deleteTag={deleteTag}
                    update={updateTags}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td id="foot" colSpan="1">
                    <Button
                      style={{
                        width: "30%",
                        marginTop: 3,
                        marginBottom: 2,
                        color: "black",
                      }}
                      variant="outline-secondary"
                      size="sm"
                      onClick={addTagRow}
                    >
                      +
                    </Button>
                  </td>
                  <td colSpan="2"></td>
                </tr>
                <tr>
                  <td colSpan="1">
                    <Button
                      style={{ width: "50%", marginTop: 3, marginBottom: 2 }}
                      variant="success"
                      onClick={() => save("tags")}
                      onBlur={() => setShowTagSavingMessage(false)}
                    >
                      save
                    </Button>
                  </td>
                  <td colSpan="2">
                    {showTagSavingMessage ? savingMessage : null}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

/**
 * WordRow component for displaying and editing words and tags in words table.
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.row - The row data: (id, finnish word, english word and tag).
 * @param {Function} props.update - Function to update the words state.
 * @param {Function} props.deleteRow - Function to delete the row.
 * @return {JSX.Element} The rendered component.
 */
const WordRow = ({ row, update, deleteRow }) => {
  const [inputFinnishWord, setInputFinnish] = useState(row.finnish);
  const [inputEnglishWord, setInputEnglish] = useState(row.english);
  const [inputTag, setInputTag] = useState(row.tag);

  /**
   * Handles the change event for the Finnish word input.
   * @param {Object} event - The change event.
   */
  const handleInputChangeFinnish = (event) => {
    setInputFinnish(event.target.value);
  };

  /**
   * Handles the change event for the English word input.
   * @param {Object} event - The change event.
   */
  const handleInputChangeEnglish = (event) => {
    setInputEnglish(event.target.value);
  };

  /**
   * Handles the change event for the tag input.
   * @param {Object} event - The change event.
   */
  const handleInputChangeTag = (event) => {
    setInputTag(event.target.value);
  };

  /**
   * Handles the blur event for the Finnish word input.
   */
  const handleBlurFinnish = () => {
    update(inputFinnishWord, row.id, "finnish");
  };

  /**
   * Handles the blur event for the English word input.
   */
  const handleBlurEnglish = () => {
    update(inputEnglishWord, row.id, "english");
  };

  /**
   * Handles the blur event for the tag input.
   */
  const handleBlurTag = () => {
    update(inputTag, row.id, "tag");
  };

  return (
    <>
      <td>{row.id}</td>
      <td>
        <Form.Control
          style={{ width: "100%", borderRadius: 0 }}
          type="text"
          value={inputFinnishWord}
          onChange={handleInputChangeFinnish}
          onBlur={handleBlurFinnish}
        />
      </td>
      <td>
        <Form.Control
          style={{ width: "100%", borderRadius: 0 }}
          type="text"
          value={inputEnglishWord}
          onChange={handleInputChangeEnglish}
          onBlur={handleBlurEnglish}
        />
      </td>
      <td>
        <Form.Control
          style={{ width: "100%", borderRadius: 0 }}
          type="number"
          value={inputTag}
          onChange={handleInputChangeTag}
          onBlur={handleBlurTag}
        />
      </td>
      <td>
        <Button
          style={{ width: "50%", height: 30, marginTop: 3, color: "black" }}
          variant="outline-danger"
          size="sm"
          onClick={() => deleteRow(row.id)}
        >
          x
        </Button>
      </td>
    </>
  );
};

/**
 * TagRow component for displaying and editing tags in tags table.
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.tag - The tag data.
 * @param {Function} props.deleteTag - Function to delete the tag.
 * @param {Function} props.update - Function to update the tags state.
 * @return {JSX.Element} The rendered component.
 */
const TagRow = ({ tag, deleteTag, update }) => {
  const [inputName, setInputName] = useState(tag.name);

  /**
   * Handles the change event for the tag name input.
   * @param {Object} event - The change event.
   */
  const handleInputChangeName = (event) => {
    setInputName(event.target.value);
  };

  /**
   * Handles the blur event for the tag name input.
   */
  const handleBlurName = () => {
    update(inputName, tag.id);
  };

  return (
    <tr key={tag.id}>
      <td style={{ width: "20%" }}>{tag.id}</td>
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
          style={{ width: "30%", height: 30, marginTop: 3, color: "black" }}
          variant="outline-danger"
          size="sm"
          onClick={() => deleteTag(tag.id)}
        >
          x
        </Button>
      </td>
    </tr>
  );
};

export default TeacherView;
