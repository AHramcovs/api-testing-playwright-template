import { expect, test } from '@playwright/test'
import { Login } from '../../dto/login-dto'
import { createOrder, fetchJwt } from '../../helpers/api-helper'

export const baseUrl = process.env.DL_BASE_URL || 'https://backend.tallinn-learning.ee'
export const loginEndpoint = '/login/student'
export const ordersEndpoint = '/orders'

const username = process.env.DL_USERNAME
const password = process.env.DL_PASSWORD
const loginDto = new Login(username ?? '', password ?? '')

test.describe('Authorization flow', () => {
  test.skip(
    !username || !password,
    'Set DL_USERNAME and DL_PASSWORD to run the authorization tests',
  )

  test('should login and receive authorization token', async ({ request }) => {
    const response = await request.post(baseUrl + loginEndpoint, {
      data: loginDto,
    })

    expect(response.status()).toBe(200)
    const token = await response.text()
    expect(token.trim().length).toBeGreaterThan(0)
  })

  test('should reject login with an incorrect password', async ({ request }) => {
    const response = await request.post(baseUrl + loginEndpoint, {
      data: new Login(loginDto.username, `${loginDto.password}-invalid`),
    })

    expect(response.status()).toBe(401)
  })

  test('should create order', async ({ request }) => {
    const token = await fetchJwt(request, loginDto)
    const orderId = await createOrder(request, token)
    expect(orderId).toEqual(expect.any(Number))
    expect(orderId).toBeGreaterThan(0)
  })

  test('should get orders with authorization token', async ({ request }) => {
    const token = await fetchJwt(request, loginDto)

    const response = await request.get(baseUrl + ordersEndpoint, {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    })

    expect(response.status()).toBe(200)
    const orders = await response.json()
    expect(Array.isArray(orders)).toBe(true)
  })
})
