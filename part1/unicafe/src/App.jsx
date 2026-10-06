import { useState } from 'react'

const Title = ({text}) => {
  return <h1>{text}</h1>
}

const Button = ({text, onClick}) => {
  return <button onClick={onClick}>{text}</button>
}

const StatisticLine = ({text, stat}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{stat}</td>
    </tr>
  )
}
const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good/all)*100

  if (all > 0) {
    return <table>
      <tbody>
        <StatisticLine text='good' stat={good}/>
        <StatisticLine text='neutral' stat={neutral}/>
        <StatisticLine text='bad' stat={bad}/>
        <StatisticLine text='all' stat={all}/>
        <StatisticLine text='average' stat={average}/>
        <StatisticLine text='positive' stat={positive}/>
      </tbody>
    </table>
  } else {
    return <p>No feedback given</p>
  }
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    const newGood = good + 1
    setGood(newGood);
  }
  const handleNeutral = () => {
    const newNeutral = neutral + 1
    setNeutral(newNeutral);
  }
  const handleBad = () => {
    const newBad = bad + 1
    setBad(newBad);
  }

  return (
    <div>
      <Title text='give feedback'/>
      <Button text='good' onClick={handleGood} />
      <Button text='neutral' onClick={handleNeutral} />
      <Button text='bad' onClick={handleBad} />
      <Title text='statistics'/>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App