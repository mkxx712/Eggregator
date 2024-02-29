'use client'

import {NextUIProvider} from '@nextui-org/react'

export function Providers({children}: { children: React.ReactNode }) {
  console.log("providers.")
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  )
}
