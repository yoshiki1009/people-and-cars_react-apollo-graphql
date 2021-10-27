import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Form, Input, Button, Select, InputNumber } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { ADD_CAR, GET_CARS, GET_PEOPLE } from '../../queries'

const AddCar = () => {
  const [id] = useState(uuidv4())
  const [form] = Form.useForm()
  const [addCar] = useMutation(ADD_CAR)
  const [, forceUpdate] = useState()

  useEffect(() => {
    forceUpdate({})
  }, [])

  // get people for select box
  const { loading, error, data } = useQuery(GET_PEOPLE)
  if (loading) return 'Loading...'
  if (error) return `Errror! ${error.message}`

  const onFinish = (values) => {
    const { year, make, model, price, personId } = values

    addCar({
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
        addCar: {
          __typename: 'Car',
          id,
          year,
          make,
          model,
          price,
          personId,
        },
      },
      update: (proxy, { data: { addCar } }) => {
        //console.log(addCar)
        const data = proxy.readQuery({
          query: GET_CARS,
          variables: {
            personId: personId,
          },
        })
        // console.log(data)
        proxy.writeQuery({
          query: GET_CARS,
          variables: {
            personId: personId,
          },
          data: {
            ...data,
            cars: [...data.cars, addCar],
          },
        })
      },
    })
  }

  return (
    <Form
      form={form}
      name="add-car-form"
      layout="inline"
      onFinish={onFinish}
      size="large"
      style={{ marginBottom: '30px' }}
    >
      <Form.Item name="year" rules={[{ required: true, message: 'Please input a year !' }]}>
        <InputNumber placeholder="i.e. 2020" min={1900} step={1} />
      </Form.Item>
      <Form.Item name="make" rules={[{ required: true, message: 'Please input a maker !' }]}>
        <Input placeholder="i.e. Nissan" />
      </Form.Item>
      <Form.Item name="model" rules={[{ required: true, message: 'Please input a model !' }]}>
        <Input placeholder="i.e. GT-R" />
      </Form.Item>
      <Form.Item name="price" rules={[{ required: true, message: 'Please input a price of the car!' }]}>
        <InputNumber placeholder="i.e. 60000" min={0} step={100} style={{ minWidth: '120px' }} />
      </Form.Item>
      <Form.Item name="personId" rules={[{ required: true, message: 'Please select a person! ' }]}>
        <Select
          placeholder="select an owner"
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
            disabled={!form.isFieldsTouched(true) || form.getFieldsError().filter(({ errors }) => errors.length).length}
          >
            Add Car
          </Button>
        )}
      </Form.Item>
    </Form>
  )
}

export default AddCar
