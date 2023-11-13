import { SessionContext } from './utils/useSession'
import { useEffect, useState } from 'react'
import { useLocalStorage } from '@mantine/hooks'
import Private from './pages/Private'
import Public from './pages/Public'

const App = () => {
    const [ready, setReady] = useState(false)

    const [jwt] = useLocalStorage({
        key: 'jwt'
    })

    const [user] = useLocalStorage({
        key: 'user'
    })

    useEffect(() => {
        setReady(true)
    }, [user, jwt])

    if (ready === false) return null

    if ([undefined, '_'].includes(jwt)) return <Public />

    return (
        <SessionContext.Provider value={JSON.parse(user!)}>
            <Private />
        </SessionContext.Provider>
    )
}

export default App
