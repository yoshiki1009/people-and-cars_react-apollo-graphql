import React from 'react'
import Title from '../layout/Title'
import People from '../lists/People'
import AddPerson from '../forms/AddPerson'

const Home = () => {
  return (
    <div className="App">
      <Title />
      <AddPerson />
      <People />
    </div>
  )
}

export default Home
