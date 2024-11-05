import { axiosClient } from '../mocks/axiosMocks'
import { isAxiosError } from 'axios'

export async function verifyCode(code: string): Promise<{ success: boolean; message?: string }> {
  try {
    await axiosClient.get('/api/verifyCode', { params: { code } })
    return { success: true }
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.response?.status === 400) {
        return { success: false, message: 'Invalid code!' }
      }
      if (err.response?.status === 429) {
        return { success: false, message: 'Too many requests, please try again!' }
      }
      return { success: false, message: 'Unknown HTTP error!' }
    } else {
      return { success: false, message: 'Unknown error!' }
    }
  }
}
