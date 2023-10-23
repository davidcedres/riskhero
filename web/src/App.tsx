import { useLocalStorage } from '@mantine/hooks'
import Private from './pages/Private'
import Public from './pages/Public'

function App() {
    const [jwt] = useLocalStorage({
        key: 'jwt'
    })

    if (jwt === undefined || jwt.length === 0) {
        return <Public />
    }

    return <Private />
}

export default App
