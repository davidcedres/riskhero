import { Redirect } from 'expo-router'
import { useState } from 'react'
import { useStore } from '../state/store'

export default () => {
    const [hydrating, setHydrating] = useState(false)
    const auth = useStore((store) => store.auth)

    useStore.persist.onFinishHydration(() => {
        setHydrating(true)
    })

    if (hydrating === false) return null
    if (auth.logged) return <Redirect href="/inspections" />
    return <Redirect href="/sign-in" />
}
