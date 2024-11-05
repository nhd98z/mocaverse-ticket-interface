import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@nextui-org/react'
import { toast } from 'react-toastify'
import { verifyCode } from '../services/verifyCode'

interface ClaimWithCodeProps {
  onCodeConfirmed: (code: string) => void
}

const CODE_REGEX = /^[A-Z0-9]{6}$/

const ClaimWithCode = ({ onCodeConfirmed }: ClaimWithCodeProps) => {
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleConfirmCode = async () => {
    const sanitizedCode = code.trim().toUpperCase()

    if (!CODE_REGEX.test(sanitizedCode)) {
      toast.error('Please enter a valid 6-character invite code (uppercase letters and numbers)', {
        style: { width: '400px' },
      })
      return
    }

    setIsVerifying(true)
    const { success, message } = await verifyCode(sanitizedCode)
    setIsVerifying(false)

    if (success) {
      onCodeConfirmed(sanitizedCode)
    } else {
      toast.error(message)
    }
  }

  return (
    <div className="text-white">
      <h1 className="text-center text-3xl font-bold">Use My Invite Code</h1>
      <p className="mt-2 text-center text-gray-300">
        Enter a Mocaverse distributed invite code to claim your own exclusive Moca ID!
      </p>
      <div className="mt-6">
        <input
          placeholder="Enter invite code"
          className="w-full rounded-md bg-gray-200 px-4 py-2 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={code}
          onChange={(e) => setCode(e.currentTarget.value)}
        />
        <motion.div className="mt-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            disableAnimation
            disableRipple
            className="w-full bg-primary text-lg font-semibold text-white"
            onClick={handleConfirmCode}
            isDisabled={isVerifying || !code.trim()}
          >
            {isVerifying ? 'Verifying...' : 'Claim with Code!'}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default ClaimWithCode
