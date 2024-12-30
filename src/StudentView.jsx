import { useState, useEffect } from 'react'
function StudentView({ words }) {
    const [answers, setAnswers] = useState([])

    /*
    useEffect(() => {
    }, [])
    */
    const rightAnswers = words.map((pair) => {
        return pair.english
    })

    const checkAnswers = () => {
        console.log(answers)
        console.log(rightAnswers)
        if (JSON.stringify(answers) === JSON.stringify(rightAnswers)) {
            console.log("All correct!")
        }
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
                                <p>{pair.finnish}</p>
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
                        <td colSpan="2"><button onClick={checkAnswers}>Check</button></td>
                    </tr>
                </tfoot>
            </table>
        </>
    )
}
export default StudentView