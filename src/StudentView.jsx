import { useState, useEffect } from 'react'
function StudentView({ words }) {
    const [answers, setAnswers] = useState([])
    const [isChecking, setChecking] = useState(false)
    const [correctAnswers, setCorrectAnswers] = useState([])
    let points = 0;
    /*
    useEffect(() => {
    }, [])
    */
    const rightAnswers = words.map((pair) => {
        return pair.english
    })

    const checkAnswers = () => {
        let newCorrectAnswers = [];
        if (JSON.stringify(answers) === JSON.stringify(rightAnswers)) {
            console.log("All correct!")
            console.log("You got: " + rightAnswers.length + "/" + rightAnswers.length + " points!")
        } else {
            rightAnswers.forEach((answer, index) => {
                if (answer === answers[index]) {
                    points++;
                    newCorrectAnswers.push(index)
                }
            })
            setCorrectAnswers(newCorrectAnswers)
            console.log("You got: " + points + "/" + rightAnswers.length + " points!")
        }
        setChecking(true)
    }

    const handleInputChange = (event, id) => {
        const newAnswers = [...answers]
        newAnswers[id - 1] = event.target.value;
        setAnswers(newAnswers);
    }

    return (
        <>
            <h1>Learn English</h1>
            <h2>Student view</h2>
            <table border="7">
                <thead>
                    <tr>
                        <th></th>
                        <th>Finnish</th>
                        <th>English</th>
                    </tr>
                </thead>
                <tbody>
                    {words.map((pair, index) => (
                        <tr key={pair.id}>
                            <td>{pair.id}</td>
                            <td>
                                <p style={{ color: isChecking ? (correctAnswers.includes(index) ? 'green' : 'red') : 'white' }}>
                                    {pair.finnish}
                                </p>
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
                        <td id="foot" colSpan="1"><button id="plusbutton" onClick={checkAnswers}>+</button></td>
                        <td colSpan="2"><button onClick={checkAnswers} onBlur={() => setChecking(false)}>Check</button></td>
                    </tr>
                </tfoot>
            </table>
        </>
    )
}
export default StudentView