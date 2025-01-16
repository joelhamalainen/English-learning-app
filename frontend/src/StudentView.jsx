import { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function StudentView({ words, tags }) {
    const [answers, setAnswers] = useState([])
    const [activeTag, setActiveTag] = useState([])
    const [rightAnswers, setRightAnswers] = useState([])
    const [filteredRightAnswers, setFilteredRightAnswers] = useState([])
    const [isChecking, setChecking] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState("")
    const [correctAnswers, setCorrectAnswers] = useState([])
    const [isTableVisible, setIsTableVisible] = useState(false)
    const [isTagButtonsVisible, setIsTagButtonsVisible] = useState(false)
    const [isEnglishSelected, setIsEnglishSelected] = useState(false)
    const [showAll, setShowAll] = useState(false)
    //const [isFinnishSelected, setisFinnishSelected] = useState(false)

    /*
    useEffect(() => {
    }, [])
    */

    const checkAnswers = () => {
        let points = 0;
        let newCorrectAnswers = [];
        filteredRightAnswers.forEach((rightAnswer, index) => {
            if (rightAnswer.word === answers[rightAnswer.id - 1]) {
                points++;
                newCorrectAnswers.push(rightAnswer.id)
            }
        })
        setCorrectAnswers(newCorrectAnswers)
        setFeedbackMessage(
            <p style={{
                marginTop: 10,
                color: points === filteredRightAnswers.length ? 'green' : 'red'
            }}>
                You got: {points}/{filteredRightAnswers.length} points!
            </p>)
        setChecking(true)
    }

    const handleInputChange = (event, id) => {
        const newAnswers = [...answers]
        newAnswers[id - 1] = event.target.value;
        setAnswers(newAnswers);
    }

    const toggleLanguage = (language) => {
        if (language === 'english') {
            setIsEnglishSelected(true)
            let englishRightAnswers = words.map((pair) => {
                return { id: pair.id, word: pair.english, tag: pair.tag }
            })
            setRightAnswers(englishRightAnswers)
        } else {
            setIsEnglishSelected(false)
            let finnishRightAnswers = words.map((pair) => {
                return { id: pair.id, word: pair.finnish, tag: pair.tag }
            })
            setRightAnswers(finnishRightAnswers)
        }
        setIsTagButtonsVisible(true)
        setIsTableVisible(false)
    }

    const toggleTag = (tag) => {
        setActiveTag(tag)
        setIsTableVisible(true)
        setAnswers([])
        if (tag === 0) {
            setShowAll(true)
            setFilteredRightAnswers(rightAnswers)
        } else {
            let newRightAnswers = rightAnswers
            setFilteredRightAnswers(newRightAnswers.filter(word => Number(word.tag) === tag));
            setShowAll(false)
        }
    }

    return (
        <>
            <h2 style={{ margin: 10 }}>Student</h2>
            <p>Select which language you are writing in.</p>
            <Button variant="primary" className="m-2" onClick={() => toggleLanguage("english")}>English</Button>
            <Button variant="primary" className="m-2" onClick={() => toggleLanguage("finnish")}>Finnish</Button>
            {isTagButtonsVisible && (
                <div id='tagButtons'>
                    <p style={{ marginTop: 10 }}>Select the category you want, or select all.</p>
                    {tags.map((tag) => {
                        return (
                            <Button
                                key={tag.id}
                                variant="outline-secondary"
                                className="m-1"
                                onClick={() => toggleTag(tag.id)}>
                                {tag.name}
                            </Button>
                        )
                    })}
                    <Button variant="secondary" className="m-1" onClick={() => toggleTag(0)}>All</Button>
                </div>
            )}
            {isTableVisible && (
                <Table className='custom-table' id='studentTable' striped bordered hover size="sm" responsive>
                    <thead>
                        <tr>
                            {isEnglishSelected ?
                                <><th>Finnish</th><th>English</th></> :
                                <><th>English</th><th>Finnish</th></>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {words.map((pair, index) => {
                            if (Number(pair.tag) === activeTag || showAll) {
                                return (
                                    <tr key={pair.id}>
                                        <td>
                                            <p style={{
                                                color: isChecking ? (correctAnswers.includes(pair.id) ? 'green' : 'red') : 'black',
                                                margin: 0,
                                                marginTop: 6,
                                                fontWeight: 500
                                            }}>{isEnglishSelected ? pair.finnish : pair.english}</p>
                                        </td>
                                        <td>
                                            <Form.Control
                                                style={{
                                                    width: '100%',
                                                    color: isChecking ? (correctAnswers.includes(pair.id) ? 'green' : 'red') : 'black',
                                                    borderRadius: 0
                                                }}
                                                type="text"
                                                value={answers[pair.id - 1] || ''}
                                                onChange={(e) => handleInputChange(e, pair.id)}
                                            />
                                        </td>
                                    </tr>
                                )
                            }
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="1">
                                <Button
                                    style={{ width: 70, marginTop: 3, marginBottom: 2 }}
                                    variant="success"
                                    onClick={checkAnswers}
                                    onBlur={() => setChecking(false)}>
                                    Check
                                </Button>
                            </td>
                            <td
                                style={{ fontWeight: 500 }}>
                                {isChecking ? feedbackMessage : null}
                            </td>
                        </tr>
                    </tfoot>
                </Table >
            )
            }
        </>
    )
}
export default StudentView