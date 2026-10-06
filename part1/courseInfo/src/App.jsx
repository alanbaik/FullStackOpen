const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const Header = (props) => {
    return <>
      <p>{props.course}</p>
      <br />
    </>
  }

  const Part = (props) => {
    return <p>{props.part}, {props.ex}</p>
  }

  const Content = (props) => {
    return <>
      <Part part={props.parts[0].name} ex={props.parts[0].exercises}/>
      <Part part={props.parts[1].name} ex={props.parts[1].exercises}/>
      <Part part={props.parts[2].name} ex={props.parts[2].exercises}/>
      <br />
    </>
  }

  const Total = (props) => {
    return <>
      <p>Total Exercises: {props.parts.reduce((acumulador, part) => acumulador + part.exercises, 0)}</p>
    </>
  }
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App