import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

export const axiosClient = axios.create()

const mock = new AxiosMockAdapter(axiosClient, { delayResponse: 1000 })

mock.onGet('/api/verifyCode').reply((config) => {
  if (config.params?.code === '123456') {
    return [200, { code: 0, message: 'successfully', data: null }]
  }
  return [400, { code: 4000, message: 'invalid code', data: null }]
})

mock.onGet('/api/isEmailUsed').reply((config) => {
  if (config.params?.email === 'alice@gmail.com') {
    return [200, { code: 0, message: 'successfully', data: null }]
  }
  return [400, { code: 4000, message: 'email is used', data: null }]
})

mock.onGet('/api/isWalletUsed').reply((config) => {
  if (config.params?.wallet === '0x32611756C2418eF400959e5C008134302fd389C9') {
    return [200, { code: 0, message: 'successfully', data: null }]
  }
  return [400, { code: 4000, message: 'wallet is used', data: null }]
})

mock.onPost('/api/reserve').reply(() => {
  return [200, { code: 0, message: 'successfully', data: null }]
})
