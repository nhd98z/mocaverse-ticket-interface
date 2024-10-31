import { Button } from '@nextui-org/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useSignMessage } from 'wagmi'
import { FormEvent, useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { toast } from 'react-toastify'
import axios, { isAxiosError } from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

const CODE_REGEX = /^[A-Z0-9]{6}$/

export default function App() {
  const [code, setCode] = useState('')
  const [step, setStep] = useState(0)
  const [confirmingCode, setConfirmingCode] = useState(false)

  const [email, setEmail] = useState('')

  const { openConnectModal } = useConnectModal()
  const { isConnected, isConnecting, address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const [claimButton, setClaimButton] = useState<{ isDisable: boolean; text: string }>({
    isDisable: false,
    text: 'Claim Moca ID'
  })

  const onBack = () => {
    setStep(0)
    setClaimButton({ isDisable: false, text: 'Claim Moca ID' })
  }

  const onPressConfirmCode = async () => {
    setConfirmingCode(true)

    try {
      await axios.get('/api/verifyCode', { params: { code } })
      setStep(1)
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 400) {
          toast(`🔴 Invalid code!`)
          return
        }
        if (err.response?.status === 429) {
          toast(`🔴 Too many requests, please try again!`)
          return
        }
        toast(`🔴 Unknown HTTP error!`)
      } else {
        toast(`🔴 Unknown error!`)
      }
    } finally {
      setConfirmingCode(false)
    }
  }

  useEffect(() => {
    const fn = async () => {
      setClaimButton({ isDisable: true, text: 'Checking wallet...' })

      if (address) {
        try {
          await axios.get('/api/isWalletUsed', { params: { wallet: address } })
          setClaimButton({ isDisable: false, text: 'Claim Moca ID' })
        } catch (err) {
          console.error(err)
          if (isAxiosError(err)) {
            if (err.response?.status === 400) {
              setClaimButton({ isDisable: true, text: 'Wallet is used' })
              return
            }
            if (err.response?.status === 429) {
              setClaimButton({ isDisable: true, text: 'Server is busy' })
              return
            }
            setClaimButton({ isDisable: true, text: 'Unknown HTTP error' })
          } else {
            setClaimButton({ isDisable: true, text: 'Unknown error' })
          }
        }
      }
    }

    void fn()
  }, [address])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (e.currentTarget.checkValidity()) {
      try {
        setClaimButton({ isDisable: true, text: 'Checking email...' })

        await axios.get('/api/isEmailUsed', { params: { email } })
      } catch (err) {
        console.error(err)
        if (isAxiosError(err)) {
          if (err.response?.status === 400) {
            toast(`🔴 Email is used!`)
            setClaimButton({ isDisable: false, text: 'Claim Moca ID' })
          } else if (err.response?.status === 429) {
            setClaimButton({ isDisable: true, text: 'Server is busy' })
          } else {
            setClaimButton({ isDisable: true, text: 'Unknown HTTP error' })
          }
        } else {
          setClaimButton({ isDisable: true, text: 'Unknown error' })
        }
        return
      }

      let signature = ''
      try {
        setClaimButton({ isDisable: true, text: 'Signing...' })
        signature = await signMessageAsync({ message: `Claim Moca ID\n\nCode: ${code}\nEmail: ${email}` })
      } catch (err) {
        console.error(err)
        if (err instanceof Error && err?.message.includes('User rejected the request.')) {
          setClaimButton({ isDisable: false, text: 'Claim Moca ID' })
        } else {
          setClaimButton({ isDisable: true, text: 'Unknown error' })
        }
        return
      }

      try {
        setClaimButton({ isDisable: true, text: 'Claiming Moca ID...' })
        await axios({
          url: '/api/reserve',
          method: 'post',
          data: {
            code,
            email,
            wallet: address,
            signature
          }
        })
        toast(`🟢 Claimed Moca ID!`)
        setClaimButton({ isDisable: true, text: 'Claimed' })
      } catch (err) {
        console.error(err)
        if (isAxiosError(err)) {
          if (err.response?.status === 400) {
            toast(`🔴 Invalid signature!`)
          } else if (err.response?.status === 429) {
            toast(`🔴 Server is busy!`)
          } else {
            toast(`🔴 Unknown HTTP error!`)
          }
        } else {
          toast(`🔴 Unknown error!`)
        }
        setClaimButton({ isDisable: false, text: 'Claim Moca ID' })
        return
      }
    } else {
      e.currentTarget.reportValidity()
    }
  }

  return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-[rgb(14,22,39)]">
      <div className="flex min-w-[360px] flex-col items-center rounded-2xl bg-[rgb(10,31,55)] px-4 py-8">
        {step === 0 ? (
          <>
            <div className="text-[18px] font-medium text-white">Use My</div>
            <div className="text-[24px] font-semibold text-primary">Invite Code</div>
            <div className="text-white">Enter a Mocaverse distributed invite code</div>
            <div className="text-white">to claim your own exclusive Moca ID!</div>
            <input
              placeholder="Enter invite code"
              className="m-0 mt-2 w-full rounded-2xl px-4 py-2 text-[18px]"
              value={code}
              onChange={(e) => setCode(e.currentTarget.value)}
            />
            <Button
              disableAnimation
              disableRipple
              className="mt-4 bg-primary font-semibold"
              onPress={onPressConfirmCode}
              isDisabled={confirmingCode || !CODE_REGEX.test(code)}
            >
              Claim with Code!
            </Button>
          </>
        ) : (
          <>
            <div className="flex w-full items-center">
              <Button
                disableAnimation
                disableRipple
                isIconOnly
                variant="light"
                className="data-[hover]:bg-transparent"
                onPress={onBack}
              >
                <Icon icon="material-symbols:arrow-back" color="#FFFFFF" fontSize={24} />
              </Button>
            </div>
            <div className="mt-4 text-white">
              Invite Code: <span className="font-semibold text-primary">{code}</span>
            </div>
            <form onSubmit={onSubmit} className="flex w-full flex-col items-center">
              <input
                type="email"
                placeholder="Enter email address"
                className="m-0 mt-2 w-full rounded-2xl px-4 py-2 text-[18px]"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
              />
              {isConnected && address ? (
                <>
                  <div className="mt-4 text-white">{address.slice(0, 6) + '...' + address.slice(-4)}</div>

                  <Button
                    disableAnimation
                    disableRipple
                    className="mt-2 bg-primary font-semibold"
                    type="submit"
                    as="button"
                    isDisabled={claimButton.isDisable}
                  >
                    {claimButton.text}
                  </Button>
                </>
              ) : (
                <Button
                  disableAnimation
                  disableRipple
                  className="mt-4 bg-primary font-semibold"
                  onPress={openConnectModal}
                  isDisabled={isConnecting}
                >
                  Connect Wallet
                </Button>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  )
}

const mock = new AxiosMockAdapter(axios, { delayResponse: 1000 })

mock.onGet('/api/verifyCode').reply((config) => {
  if (config.params?.code === '123456') {
    return [
      200,
      {
        code: 0,
        message: 'successfully',
        data: null
      }
    ]
  }
  return [
    400,
    {
      code: 4000,
      message: 'invalid code',
      data: null
    }
  ]
})


mock.onGet('/api/isEmailUsed').reply((config) => {
  if (config.params?.email === 'alice@gmail.com') {
    return [
      200,
      {
        code: 0,
        message: 'successfully',
        data: null
      }
    ]
  }
  return [
    400,
    {
      code: 4000,
      message: 'email is used',
      data: null
    }
  ]
})

mock.onGet('/api/isWalletUsed').reply((config) => {
  if (config.params?.wallet === '0x32611756C2418eF400959e5C008134302fd389C9') {
    return [
      200,
      {
        code: 0,
        message: 'successfully',
        data: null
      }
    ]
  }
  return [
    400,
    {
      code: 4000,
      message: 'wallet is used',
      data: null
    }
  ]
})

mock.onPost('/api/reserve').reply((_config) => {
  // We are not mock verifying signature here.
  return [
    200,
    {
      code: 0,
      message: 'successfully',
      data: null
    }
  ]
})