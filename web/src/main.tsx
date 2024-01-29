import '@fontsource/roboto-condensed/700.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/700.css'
import '@fontsource-variable/oswald'

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
    primaryColor: 'dark',
    defaultRadius: 4,
    fontFamily: 'Roboto, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: { fontFamily: 'Roboto Condensed, sans-serif' }
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
