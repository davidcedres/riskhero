import '@fontsource/roboto-condensed/700.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/700.css'
import '@fontsource-variable/oswald'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import { ClerkProvider } from '@clerk/clerk-react'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AxiosError } from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { startCase } from 'lodash'

import App from './App.tsx'

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            onError: (error) => {
                if (!(error instanceof AxiosError)) {
                    toast.error('Oops')
                    return
                }

                // eslint-disable-next-line no-extra-semi
                ;(
                    error.response?.data[0].errors.issues as {
                        code: string
                        message: string
                        path: string[]
                    }[]
                ).forEach((issue) => {
                    toast.error(`${startCase(issue.path[0])}: ${issue.message}`)
                })
            }
        }
    }
})

const myTheme = createTheme({
    primaryColor: 'orange',
    defaultRadius: 0,
    fontFamily: 'Roboto, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: { fontFamily: 'Roboto Condensed, sans-serif' }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={myTheme}>
                <ClerkProvider publishableKey={clerkPubKey}>
                    <App />
                </ClerkProvider>
            </MantineProvider>
        </QueryClientProvider>
        <Toaster position="bottom-center" />
    </React.StrictMode>
)
