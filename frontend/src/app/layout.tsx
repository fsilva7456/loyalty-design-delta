import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { WorkflowProvider } from '@/contexts/WorkflowContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Loyalty Design Delta',
  description: 'Design and analyze loyalty programs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WorkflowProvider>
          {children}
          <Toaster position="top-right" />
        </WorkflowProvider>
      </body>
    </html>
  )
}
