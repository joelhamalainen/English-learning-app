import { useState, useEffect } from 'react'
function StudentView({ words }) {
    const [answers, setAnswers] = useState([])
    const [rightAnswers, setRightAnswers] = useState([])
    const [isChecking, setChecking] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState("")
    const [correctAnswers, setCorrectAnswers] = useState([])
    const [isTableVisible, setIsTableVisible] = useState(false)
    const [isEnglishSelected, setisEnglishSelected] = useState(false)
    //const [isFinnishSelected, setisFinnishSelected] = useState(false)

    /*
    useEffect(() => {
    }, [])
    */

    const checkAnswers = () => {
        let points = 0;
        let newCorrectAnswers = [];
        rightAnswers.forEach((answer, index) => {
            if (answer === answers[index]) {
                points++;
                newCorrectAnswers.push(index)
            }
        })
        setCorrectAnswers(newCorrectAnswers)
        console.log("You got: " + points + "/" + rightAnswers.length + " points!")
        setFeedbackMessage("You got: " + points + "/" + rightAnswers.length + " points!")
        setChecking(true)
    }

    const handleInputChange = (event, id) => {
        const newAnswers = [...answers]
        newAnswers[id - 1] = event.target.value;
        setAnswers(newAnswers);
    }

    const toggleLanguage = (language) => {
        if (language === 'english') {
            setisEnglishSelected(true)
            let englishRightAnswers = words.map((pair) => {
                return pair.english
            })
            setRightAnswers(englishRightAnswers)
        } else {
            setisEnglishSelected(false)
            let finnishRightAnswers = words.map((pair) => {
                return pair.finnish
            })
            setRightAnswers(finnishRightAnswers)
        }
        setIsTableVisible(true)
    }

    return (
        <>
            <h1>Learn English</h1>
            <h2>Student view</h2>
            <p>Select which language you are writing in.</p>
            <button onClick={() => toggleLanguage("english")}>English</button>
            <button onClick={() => toggleLanguage("finnish")}>Finnish</button>
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
                        {words.map((pair, index) => (
                            <tr key={pair.id} style={{ color: isChecking ? (correctAnswers.includes(index) ? 'green' : 'red') : 'white' }}>
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
                        ))}
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