import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { useAccount, useSignMessage } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { checkEmail } from '../services/checkEmail'
import { checkWallet } from '../services/checkWallet'
import { claimMocaId } from '../services/claim'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { toast } from 'react-toastify'

interface ClaimFormProps {
  code: string
  onBack: () => void
}

const ClaimForm = ({ code, onBack }: ClaimFormProps) => {
  const [email, setEmail] = useState('')
  const [buttonState, setButtonState] = useState<{ disabled: boolean; text: string }>({
    disabled: false,
    text: 'Claim Moca ID',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isClaimed, setIsClaimed] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const { openConnectModal } = useConnectModal()
  const { isConnected, isConnecting, address, connector } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { width, height } = useWindowSize()

  const disconnectWallet = async () => {
    if (connector?.disconnect) {
      await connector.disconnect()
    }
  }

  useEffect(() => {
    let isMounted = true

    const checkWalletStatus = async () => {
      if (address) {
        setButtonState({ disabled: true, text: 'Checking wallet...' })
        const { success, message } = await checkWallet(address)
        if (isMounted) {
          if (success) {
            setButtonState({ disabled: false, text: 'Claim Moca ID' })
            setErrorMessage('')
          } else {
            setButtonState({ disabled: true, text: 'Claim Moca ID' })
            setErrorMessage(message || 'An error occurred while checking the wallet.')
          }
        }
      }
    }

    void checkWalletStatus()

    return () => {
      isMounted = false
    }
  }, [address])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity()
      return
    }

    setButtonState({ disabled: true, text: 'Checking email...' })
    const { success: isEmailValid, message: emailError } = await checkEmail(email)
    if (!isEmailValid) {
      setButtonState({ disabled: false, text: 'Claim Moca ID' })
      toast.error(emailError)
      return
    }

    let signature = ''
    try {
      setButtonState({ disabled: true, text: 'Signing...' })
      signature = await signMessageAsync({ message: `Claim Moca ID\n\nCode: ${code}\nEmail: ${email}` })
    } catch (err) {
      console.error(err)
      setButtonState({ disabled: false, text: 'Claim Moca ID' })
      toast.error('Signing was cancelled or failed')
      return
    }

    setButtonState({ disabled: true, text: 'Claiming Moca ID...' })
    const { success, message } = await claimMocaId({
      code,
      email,
      wallet: address!,
      signature,
    })

    if (success) {
      setIsClaimed(true)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
      }, 2500)
    } else {
      console.error(message)
      toast.error(message)
      setButtonState({ disabled: false, text: 'Claim Moca ID' })
    }
  }

  return (
    <div className="text-white">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.3} />}
      <div className="flex items-center">
        <Button
          disableAnimation
          disableRipple
          isIconOnly
          variant="light"
          className="hover:bg-transparent"
          onClick={onBack}
        >
          <Icon icon="material-symbols:arrow-back" color="#FFFFFF" fontSize={24} />
        </Button>
      </div>

      {isClaimed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-2xl font-bold text-blue-500">Moca ID Claimed Successfully!</p>
          <p className="mt-4">
            <span className="font-semibold">Invite Code:</span> {code}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {email}
          </p>
          <p>
            <span className="font-semibold">Wallet Address:</span> {address}
          </p>
        </motion.div>
      ) : (
        <>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">
              Invite Code: <span className="text-blue-500">{code}</span>
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col">
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full rounded-md bg-gray-200 px-4 py-2 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
            />
            {isConnected && address ? (
              <>
                <div className="mt-4 text-center">
                  <p>Your Wallet:</p>
                  <p className="font-mono">{address}</p>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      disableAnimation
                      disableRipple
                      className="w-full bg-primary font-semibold text-white"
                      type="submit"
                      isDisabled={buttonState.disabled}
                    >
                      {buttonState.text}
                    </Button>
                  </motion.div>
                  <Button
                    disableAnimation
                    disableRipple
                    className="bg-red-500 font-semibold text-white"
                    onClick={disconnectWallet}
                  >
                    Disconnect
                  </Button>
                </div>
                {errorMessage && <div className="mt-2 text-center text-red-500">{errorMessage}</div>}
              </>
            ) : (
              <motion.div className="mt-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  disableAnimation
                  disableRipple
                  className="w-full bg-primary font-semibold text-white"
                  onClick={openConnectModal}
                  isDisabled={isConnecting}
                >
                  Connect Wallet
                </Button>
              </motion.div>
            )}
          </form>
        </>
      )}
    </div>
  )
}

export default ClaimForm
