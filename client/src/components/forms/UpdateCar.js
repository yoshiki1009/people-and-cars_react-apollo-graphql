import React, { useEffect, useState } from 'react'
import { filter } from 'lodash'
import { Form, Input, Select, Button } from 'antd'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CARS, GET_PEOPLE, UPDATE_CAR } from '../../queries'

const UpdateCar = (props) => {
  const [id] = useState(props.id)
  const [year, setYear] = useState(props.year)
  const [make, setMake] = useState(props.make)
  const [model, setModel] = useState(props.model)
  const [price, setPrice] = useState(props.price)
  const [personId, setPersonId] = useState(props.personId)
  const [updateCar] = useMutation(UPDATE_CAR)
  const [form] = Form.useForm()
  const [, forceUpdate] = useState()

  useEffect(() => {
    forceUpdate({})
  }, [])

  // get people for select box
  const { loading, error, data } = useQuery(GET_PEOPLE)
  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  const updateStateVariable = (variable, value) => {
    props.updateStateVariable(variable, value)
    switch (variable) {
      case 'year':
        setYear(value)
        break
      case 'make':
        setMake(value)
        break
      case 'model':
        setModel(value)
        break
      case 'price':
        setPrice(value)
        break
      case 'personId':
        setPersonId(value)
        break
      default:
        break
    }
  }

  const onFinish = (values) => {
    //new values
    const { year, make, model, price, personId } = values

    updateCar({
      variables: {
        id,
        year,
        make,
        model,
        price,
        personId,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateCar: {
          __typename: 'Car',
          id,
          year,
          make,
          model,
          price,
          personId,
        },
      },
      update: (cache, { data: { updateCar } }) => {
        if (personId !== props.personId) {
          const { cars } = cache.readQuery({
            query: GET_CARS,
            variables: { personId: props.personId },
          })
          cache.writeQuery({
            query: GET_CARS,
            variables: { personId: props.personId },
            data: { cars: filter(cars, (car) => car.id !== updateCar.id) },
          })
          //add car to new owner
          const data = cache.readQuery({
            query: GET_CARS,
            variables: { personId },
          })
          cache.writeQuery({
            query: GET_CARS,
            variables: { personId },
            data: {
              ...data,
              cars: [...data.cars, updateCar],
            },
          })
        }
      },
    })

    props.onButtonClick()
  }

  return (
    <Form
      form={form}
      name="update-car-form"
      layout="inline"
      onFinish={onFinish}
      initialValues={{ year: year, make: make, model: model, price: price, personId: personId }}
      size="large"
    >
      <Form.Item name="year" rules={[{ required: true, message: 'Please input a car year!' }]}>
        <Input onChange={(e) => updateStateVariable('year', e.target.value)} />
      </Form.Item>
      <Form.Item name="make" rules={[{ required: true, message: 'Please input a car make!' }]}>
        <Input onChange={(e) => updateStateVariable('make', e.target.value)} />
      </Form.Item>
      <Form.Item name="model" rules={[{ required: true, message: 'Please input a car model!' }]}>
        <Input onChange={(e) => updateStateVariable('model', e.target.value)} />
      </Form.Item>
      <Form.Item name="price" rules={[{ required: true, message: 'Please input a car price!' }]}>
        <Input onChange={(e) => updateStateVariable('price', e.target.value)} />
      </Form.Item>
      <Form.Item name="personId" rules={[{ required: true, message: 'Please select car person! ' }]}>
        <Select
          loading={loading}
          options={data.people.map(({ id, firstName, lastName }) => ({
            label: `${firstName} ${lastName}`,
            value: id,
          }))}
        />
      </Form.Item>
      <Form.Item shouldUpdate={true}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              (!form.isFieldTouched('year') &&
                !form.isFieldTouched('make') &&
                !form.isFieldTouched('model') &&
                !form.isFieldTouched('price') &&
                !form.isFieldTouched('personId')) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Update
          </Button>
        )}
      </Form.Item>
      <Button onClick={props.onButtonClick}>Cancel</Button>
    </Form>
  )
}

export default UpdateCar
