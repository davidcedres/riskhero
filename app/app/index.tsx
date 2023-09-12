import { Redirect } from 'expo-router'
import { useStore } from '../state/store'

export default () => {
    const logged = useStore((store) => store.auth.logged)

    if (logged) return <Redirect href="/inspections" />
    return <Redirect href="/sign-in" />
}
