import { StatusCodes } from 'http-status-codes'
import { APIRequestContext, expect, test } from '@playwright/test'
import { AccountDTO } from '../../dto/AccountDTO'
import { DepositDTO } from '../../dto/DepositDTO'
import { TransferDTO } from '../../dto/TransferDTO'

const baseUrl = 'https://shop.tl-academy.ee'
const authHeader = { 'X-API-KEY': 'my-api-key' }

async function createAccount(request: APIRequestContext) {
  const account = new AccountDTO('Test Owner')
  const response = await request.post(baseUrl + '/api/accounts', {
    headers: authHeader,
    data: account,
  })
  const createdAccount: { id: number } = await response.json()
  return createdAccount.id
}

test.describe('api/accounts critical path', () => {
  test('TL-11-1 POST create account with valid data', async ({ request }) => {
    const account = new AccountDTO('Test Owner', 'EUR')
    const response = await request.post(baseUrl + '/api/accounts', {
      headers: authHeader,
      data: account,
    })

    expect.soft(response.status()).toBe(StatusCodes.CREATED)
  })

  test('TL-11-2 POST create account with unsupported currency', async ({ request }) => {
    const account = new AccountDTO('Test Owner', 'PLN')
    const response = await request.post(baseUrl + '/api/accounts', {
      headers: authHeader,
      data: account,
    })

    expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('TL-11-3 GET account list with valid key', async ({ request }) => {
    const response = await request.get(baseUrl + '/api/accounts', {
      headers: authHeader,
    })

    expect.soft(response.status()).toBe(StatusCodes.OK)
  })

  test('TL-11-4 GET account list without key', async ({ request }) => {
    const response = await request.get(baseUrl + '/api/accounts')

    expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED)
  })

  test('TL-11-5 GET existing account', async ({ request }) => {
    const id = await createAccount(request)
    const response = await request.get(baseUrl + '/api/accounts/' + id, {
      headers: authHeader,
    })

    expect.soft(response.status()).toBe(StatusCodes.OK)
  })

  test('TL-11-6 GET account with invalid id', async ({ request }) => {
    const response = await request.get(baseUrl + '/api/accounts/abc', {
      headers: authHeader,
    })

    expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('TL-11-7 POST deposit with valid amount', async ({ request }) => {
    const id = await createAccount(request)
    const deposit = new DepositDTO(25.5)
    const response = await request.post(baseUrl + '/api/accounts/' + id + '/deposit', {
      headers: authHeader,
      data: deposit,
    })

    expect.soft(response.status()).toBe(StatusCodes.OK)
  })

  test('TL-11-8 POST deposit with zero amount', async ({ request }) => {
    const id = await createAccount(request)
    const deposit = new DepositDTO(0)
    const response = await request.post(baseUrl + '/api/accounts/' + id + '/deposit', {
      headers: authHeader,
      data: deposit,
    })

    expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('TL-11-9 POST transfer with valid data', async ({ request }) => {
    const fromId = await createAccount(request)
    const toId = await createAccount(request)
    const deposit = new DepositDTO(100)
    await request.post(baseUrl + '/api/accounts/' + fromId + '/deposit', {
      headers: authHeader,
      data: deposit,
    })

    const transfer = new TransferDTO(toId, 50)
    const response = await request.post(baseUrl + '/api/accounts/' + fromId + '/transfer', {
      headers: authHeader,
      data: transfer,
    })

    expect.soft(response.status()).toBe(StatusCodes.OK)
  })

  test('TL-11-10 POST transfer with insufficient funds', async ({ request }) => {
    const sourceId = await createAccount(request)
    const targetId = await createAccount(request)
    const deposit = new DepositDTO(20)
    await request.post(baseUrl + '/api/accounts/' + sourceId + '/deposit', {
      headers: authHeader,
      data: deposit,
    })
    const transfer = new TransferDTO(targetId, 100)
    const response = await request.post(baseUrl + '/api/accounts/' + sourceId + '/transfer', {
      headers: authHeader,
      data: transfer,
    })
    expect.soft(response.status()).toBe(StatusCodes.CONFLICT)
  })
})
