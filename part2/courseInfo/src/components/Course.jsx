const Course = ({course}) => {

    const Header = (props) => {
        return (
            <>
                <h2>{props.name}</h2>           
            </>
        );
    };

    const Part = (props) => {
        return <p>{props.part}, {props.ex}</p>;
    };

    const Content = (props) => {
        console.log(props)
        return (
            <>  
                {props.parts.map(p => <Part part={p.name} ex={p.exercises} />)}
            </>
        );
    };

    const Total = (props) => {
        return (
            <>
                <p style={{ fontWeight: 'bold' }}>
                Total Exercises:{" "}
                {props.parts.reduce(
                    (acumulador, part) => acumulador + part.exercises,
                    0,
                )}
                </p>
            </>
        );
    };

    return (
        <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
        </div>
    );
};

export default Course;
