import React, { useState } from 'react'
import { Card } from 'antd'
import { Link } from 'react-router-dom'
import Cars from '../lists/Cars'
import { EditOutlined } from '@ant-design/icons'
import RemovePerson from '../buttons/RemovePerson'
import UpdatePerson from '../forms/UpdatePerson'

const getStyles = () => ({
  card: {
    width: '500px',
  },
})

const Person = (props) => {
  const [id] = useState(props.id)
  const [firstName, setFirstName] = useState(props.firstName)
  const [lastName, setLastName] = useState(props.lastName)
  const [editMode, setEditMode] = useState(false)
  const styles = getStyles()

  const updateStateVariable = (variable, value) => {
    switch (variable) {
      case 'firstName':
        setFirstName(value)
        break
      case 'lastName':
        setLastName(value)
        break
      default:
        break
    }
  }

  const handleButtonClick = () => setEditMode(!editMode)

  return (
    <div>
      {editMode ? (
        <UpdatePerson
          id={props.id}
          firstName={props.firstName}
          lastName={props.lastName}
          onButtonClick={handleButtonClick}
          updateStateVariable={updateStateVariable}
        />
      ) : (
        <Card
          style={styles.card}
          actions={[
            <Link to={'/people/' + id}>LEARN MORE </Link>,
            <EditOutlined key="edit" onClick={handleButtonClick} />,
            <RemovePerson id={id} firstName={firstName} lastName={lastName} />,
          ]}
        >
          {firstName} {lastName}
          <Cars personId={id} />
        </Card>
      )}
    </div>
  )
}

export default Person
