import { useState, useEffect } from 'react'
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
        console.log("You got: " + points + "/" + filteredRightAnswers.length + " points!")
        setFeedbackMessage("You got: " + points + "/" + filteredRightAnswers.length + " points!")
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
        if (tag === 0) {
            setShowAll(true)
            setFilteredRightAnswers(rightAnswers)
        } else {
            let newRightAnswers = rightAnswers
            setFilteredRightAnswers(newRightAnswers.filter(word => word.tag === tag));
            setShowAll(false)
        }
    }

    return (
        <>
            <h2>Student view</h2>
            <p>Select which language you are writing in.</p>
            <button onClick={() => toggleLanguage("english")}>English</button>
            <button onClick={() => toggleLanguage("finnish")}>Finnish</button>
            {isTagButtonsVisible && (
                <div id='tagButtons'>
                    <p>Select the category you want, or select all.</p>
                    {tags.map((tag) => {
                        return <button key={tag.id} onClick={() => toggleTag(tag.id)}>{tag.name}</button>
                    })}
                    <button onClick={() => toggleTag(0)}>All</button>
                </div>
            )}
            {isTableVisible && (
                <table border="7">
                    <thead>
                        <tr>
                            <th></th>
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
                                    <tr key={pair.id} style={{ color: isChecking ? (correctAnswers.includes(pair.id) ? 'green' : 'red') : 'white' }}>
                                        <td>{pair.id}</td>
                                        <td>
                                            <p>{isEnglishSelected ? pair.finnish : pair.english}</p>
                                        </td>
                                        <td>
                                            <input
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
                            <td colSpan="2"><button onClick={checkAnswers} onBlur={() => setChecking(false)}>Check</button></td>
                            <td>{isChecking ? feedbackMessage : null}</td>
                        </tr>
                    </tfoot>
                </table>
            )}
        </>
    )
}
export default StudentView