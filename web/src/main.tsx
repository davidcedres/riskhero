import '@fontsource/lato/100.css'
import '@fontsource/lato/300.css'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import '@fontsource/lato/900.css'
import '@fontsource-variable/space-grotesk'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import toast, { Toaster } from 'react-hot-toast'

import App from './App.tsx'

const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            onError: () => {
                toast.error('Oops')
            }
        }
    }
})

const myTheme = createTheme({
    primaryColor: 'indigo',
    defaultRadius: 4,
    fontFamily: 'Lato, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: { fontFamily: 'Space Grotesk Variable, sans-serif' }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={myTheme}>
                <App />
            </MantineProvider>
        </QueryClientProvider>
        <Toaster position="bottom-center" />
    </React.StrictMode>
)
