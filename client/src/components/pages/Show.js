import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Card, List } from 'antd'
import { useQuery } from '@apollo/client'
import { PERSON_WITH_CARS } from '../../queries'

const getStyles = () => ({
  card: {
    width: '500px',
  },
  list: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    marginBottom: '20px',
  },
})

const Show = () => {
  const history = useHistory()
  const { id } = useParams()
  const styles = getStyles()
  const { data, loading, error } = useQuery(PERSON_WITH_CARS, {
    variables: { id },
  })
  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`
  // console.log(data)

  return (
    <div className="App">
      <button
        style={styles.button}
        onClick={() => {
          history.goBack()
        }}
      >
        GO BACK HOME
      </button>
      <Card title={`${data.person.firstName} ${data.person.lastName}`} style={styles.card}>
        <List style={styles.list}>
          {data.cars.map(({ id, year, make, model, price }) => (
            <List.Item key={id}>
              <Card type="inner">
                Year: {year} / Make: {make} / Model: {model} / Price:
                {price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </Card>
            </List.Item>
          ))}
        </List>
      </Card>
    </div>
  )
}

export default Show
