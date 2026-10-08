const Form = ({ handleName, handleNum, handleAdd}) => {
  return (
    <form>
      <div>name: <input onChange={handleName}/></div>
      <div>number: <input onChange={handleNum}/></div>
      <div><button type="submit" onClick={handleAdd}>add</button></div>
    </form>
  )
}

export default Form