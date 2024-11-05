import { axiosClient } from '../mocks/axiosMocks'
import { isAxiosError } from 'axios'

interface ClaimParams {
  code: string
  email: string
  wallet: string
  signature: string
}

export async function claimMocaId(params: ClaimParams): Promise<{ success: boolean; message?: string }> {
  try {
    await axiosClient.post('/api/reserve', params)
    return { success: true }
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.response?.status === 400) {
        return { success: false, message: 'Invalid signature!' }
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
