// App.tsx

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ClaimWithCode from './components/ClaimWithCode'
import ClaimForm from './components/ClaimForm'

const App = () => {
  const [step, setStep] = useState(0)
  const [code, setCode] = useState('')

  const handleCodeConfirmed = (confirmedCode: string) => {
    setCode(confirmedCode)
    setStep(1)
  }

  const handleBack = () => {
    setStep(0)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-xl bg-gray-800 p-6 shadow-lg"
        >
          {step === 0 ? (
            <ClaimWithCode onCodeConfirmed={handleCodeConfirmed} />
          ) : (
            <ClaimForm code={code} onBack={handleBack} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
