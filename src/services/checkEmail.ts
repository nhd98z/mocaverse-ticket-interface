import { axiosClient } from '../mocks/axiosMocks'
import { isAxiosError } from 'axios'

export async function checkEmail(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    await axiosClient.get('/api/isEmailUsed', { params: { email } })
    return { success: true }
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.response?.status === 400) {
        return { success: false, message: 'Email is used!' }
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
