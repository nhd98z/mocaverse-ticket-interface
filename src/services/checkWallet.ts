import { axiosClient } from '../mocks/axiosMocks'
import { isAxiosError } from 'axios'

export async function checkWallet(address: string): Promise<{ success: boolean; message?: string }> {
  try {
    await axiosClient.get('/api/isWalletUsed', { params: { wallet: address } })
    return { success: true }
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.response?.status === 400) {
        return { success: false, message: 'Wallet is used!' }
      } else if (err.response?.status === 429) {
        return { success: false, message: 'Server is busy!' }
      } else {
        return { success: false, message: 'Unknown HTTP error!' }
      }
    } else {
      return { success: false, message: 'Unknown error!' }
    }
  }
}
