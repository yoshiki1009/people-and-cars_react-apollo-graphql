import React from 'react'
import { useMutation } from '@apollo/client'
import { filter } from 'lodash'
import { GET_CARS, REMOVE_CAR } from '../../queries'
import { DeleteOutlined } from '@ant-design/icons'

const RemoveCar = ({ id, year, make, model, price, personId }) => {
  const [removeCar] = useMutation(REMOVE_CAR)
  const handleButtonClick = () => {
    let result = window.confirm('Are you sure you want to delete this car?')
    // console.log(removeCar)

    if (result) {
      removeCar({
        variables: {
          id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeCar: {
            __typename: 'Car',
            id,
            year,
            make,
            model,
            price,
            personId,
          },
        },
        update(cache, { data: { removeCar } }) {
          const { cars } = cache.readQuery({
            query: GET_CARS,
            variables: { personId },
          })
          cache.writeQuery({
            query: GET_CARS,
            data: { cars: filter(cars, (car) => car.id !== removeCar.id) },
            variables: { personId },
          })
        },
      })
    }
  }
  return <DeleteOutlined key="delete" onClick={handleButtonClick} style={{ color: 'red' }} />
}

export default RemoveCar
