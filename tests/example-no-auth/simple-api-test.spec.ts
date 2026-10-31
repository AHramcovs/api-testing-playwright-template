import { StatusCodes } from 'http-status-codes'
import { expect, test } from '@playwright/test'

test.describe('GET /product/{id}', () => {
  test('get product with correct id should receive code 200', async ({ request }) => {
    // Build and send a GET request to the server

    const response = await request.get('https://shop.tl-academy.ee/api/products/1')

    // parse raw response body to json
    const responseBody = await response.json()
    const statusCode = response.status()

    // Log the response status, body and headers
    console.log('response body:', responseBody)
    // Check if the response status is 200
    expect(statusCode).toBe(StatusCodes.OK)
  })

  test('get product with correct id should receive code 404', async ({ request }) => {
    // Build and send a GET request to the server
    const allProductResponse = await request.get('https://shop.tl-academy.ee/api/products/')
    const allProductBody = await allProductResponse.json()
    const lastProductId: number = allProductBody.length

    const oneProductResponse = await request.get(
      'https://shop.tl-academy.ee/api/products/' + lastProductId + 1,
    )

    // parse raw response body to json
    const oneProductResponseBody = await oneProductResponse.json()
    const oneProductStatusCode = oneProductResponse.status()

    // Log the response status, body and headers
    console.log('response body:', oneProductResponseBody)
    // Check if the response status is 404
    expect(oneProductStatusCode).toBe(StatusCodes.NOT_FOUND)
  })

  test('get product with incorrect id should receive code 400 ', async ({ request }) => {
    // Build and send a GET request to the server

    const response = await request.get('https://shop.tl-academy.ee/api/products/qwerty213')

    // parse raw response body to json
    const responseBody = await response.json()
    const statusCode = response.status()

    // Log the response status, body and headers
    console.log('response body:', responseBody)
    // Check if the response status is 400
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
  })

  test('get product with incorrect id should receive code 400 negative ', async ({ request }) => {
    // Build and send a GET request to the server

    const response = await request.get('https://shop.tl-academy.ee/api/products/-1')

    // parse raw response body to json
    const responseBody = await response.json()
    const statusCode = response.status()

    // Log the response status, body and headers
    console.log('response body:', responseBody)
    // Check if the response status is 400
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
  })
})

test.describe('POST /product', () => {
  test('post product with correct data should receive code 201', async ({ request }) => {
    // prepare request body
    const requestBody = {
      name: 'Orange',
      category: 'Fruit',
      price: 2.39,
      quantity: 10,
    }
    // Send a POST request to the server
    const response = await request.post('https://shop.tl-academy.ee/api/products', {
      data: requestBody,
    })
    const responseBody = await response.json()
    const statusCode = response.status()

    // Log the response status and body
    console.log('response status:', statusCode)
    console.log('response body:', responseBody)
    expect(statusCode).toBe(StatusCodes.CREATED)
    // check that body.name is string type
    expect(typeof responseBody.name).toBe('string')
    // check that body.price is number type
    expect(typeof responseBody.price).toBe('number')
  })

  test('post product with empty category data should receive code 400', async ({ request }) => {
    // prepare request body
    const requestBody = {
      name: 'Orange',
      category: '',
      price: 2.39,
      quantity: 10,
    }
    // Send a POST request to the server
    const response = await request.post('https://shop.tl-academy.ee/api/products', {
      data: requestBody,
    })
    const responseBody = await response.json()
    const statusCode = response.status()

    // Log the response status and body
    console.log('response status:', statusCode)
    console.log('response body:', responseBody)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    // check that body.name is string type
    expect(typeof responseBody.name).toBe('undefined')
    // check that body.price is number type
    expect(typeof responseBody.price).toBe('undefined')
  })

  test('post product with incorrect category data should receive code 400', async ({ request }) => {
    // prepare request body
    const requestBody = {
      name: 'Orange',
      category: '',
      price: 2.39,
      quantity: 10,
    }
    // Send a POST request to the server
    const response = await request.post('https://shop.tl-academy.ee/api/products', {
      data: requestBody,
    })
    const responseBody = await response.json()
    const statusCode = response.status()

    // Log the response status and body
    console.log('response status:', statusCode)
    console.log('response body:', responseBody)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
    // check that body.name is string type
    expect(typeof responseBody.name).toBe('undefined')
    // check that body.price is number type
    expect(typeof responseBody.price).toBe('undefined')
  })

  test('post product with incorrect price data should receive code 400', async ({ request }) => {
    // prepare request body
    const requestBody = {
      name: 'Milk',
      category: 'Dairy',
      price: 'aw1',
      quantity: 10,
    }
    // Send a POST request to the server
    const response = await request.post('https://shop.tl-academy.ee/api/products', {
      data: requestBody,
    })
    const responseBody = await response.json()
    const statusCode = response.status()

    // Log the response status and body
    console.log('response status:', statusCode)
    console.log('response body:', responseBody)
    expect(statusCode).toBe(StatusCodes.BAD_REQUEST)
  })
})
