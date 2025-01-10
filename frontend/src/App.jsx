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
      <td>
        {tag.id}
      </td>
      <td>
        <input
          type="text"
          value={inputName}
          onChange={handleInputChangeName}
          onBlur={handleBlurName}
        />
      </td>
      <td>
        <button id='delete_button' onClick={() => deleteTag(tag.id)}>x</button>
      </td>
    </tr>
  )
}

function App() {
  const [wordPairs, setWordPairs] = useState([])
  const [tags, setTags] = useState([])
  const [inputTag, setInputTag] = useState([])
  const [showSavingMessage, setShowSavingMessage] = useState(false)
  const [savingMessage, setSavingMessage] = useState("")
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

  const addRow = () => {
    let lastID = wordPairs[wordPairs.length - 1].id
    setWordPairs([...wordPairs, { id: lastID + 1, finnish: "", english: "", tag: "" }])
  }

  const addTagRow = () => {
    let lastID = tags[tags.length - 1].id
    setTags([...tags, { id: lastID + 1, name: "" }])
  }

  const saveWords = async () => {
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

  const saveTags = async () => {
    let isEmptyFields = false;
    setShowSavingMessage(true)
    tags.forEach(tag => {
      if (Object.values(tag).some(value => value === '')) {
        isEmptyFields = true
      }
    });

    if (!isEmptyFields) {
      await axios.post(`http://localhost:3000/api/update/tags`,
        {
          body: tags
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
            <td id="foot" colSpan="1"><button id="plusbutton" onClick={addRow}>+</button></td>
            <td colSpan="3"></td>
          </tr>
          <tr>
            <td colSpan="2"><button onClick={saveWords} onBlur={() => setShowSavingMessage(false)}>save</button></td>
            <td colSpan="2">{showSavingMessage ? savingMessage : null}</td>
          </tr>
        </tfoot>
      </table>

      <table border="7">
        <thead>
          <tr>
            <th>Id</th>
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
            <td id="foot" colSpan="1"><button id="plusbutton" onClick={addTagRow}>+</button></td>
            <td colSpan="3"></td>
          </tr>
          <tr>
            <td colSpan="2"><button onClick={saveTags} onBlur={() => setShowSavingMessage(false)}>save</button></td>
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
