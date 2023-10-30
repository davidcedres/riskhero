import axios from 'axios'
import { useStore } from '../state/store'

const baseURL = process.env.EXPO_PUBLIC_API_URL!

if (baseURL === undefined) throw new Error('EXPO_PUBLIC_API not defined')

const api = axios.create({
    baseURL
})

api.interceptors.request.use(
    (config) => {
        // Logger
        const pieces = []
        pieces.push(config.method?.toUpperCase())
        pieces.push(`${config.baseURL}${config.url}`)
        if (config.data) pieces.push(JSON.stringify(config.data))
        console.log(pieces.join(' '))

        const jwt = useStore.getState().auth.token
        if (jwt === undefined) return config

        config.headers['Authorization'] = `Bearer ${jwt}`
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api
