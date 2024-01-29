export const FRONTEND_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://ssst.io'
        : 'http://localhost:5173'
