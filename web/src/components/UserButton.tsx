import { Group, Menu, Text, rem } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { IconChevronDown, IconLogout } from '@tabler/icons-react'
import { useContext } from 'react'
import { SessionContext } from '../utils/useSession'

const UserButton = () => {
    const session = useContext(SessionContext)

    const [, , removeJwt] = useLocalStorage({
        key: 'jwt'
    })

    const [, , removeUser] = useLocalStorage({
        key: 'user'
    })

    const onLogout = () => {
        removeJwt()
        removeUser()
    }

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Group style={{ cursor: 'pointer' }}>
                    <Text style={{ userSelect: 'none' }}>{session.name}</Text>
                    <IconChevronDown size={14} />
                </Group>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    onClick={onLogout}
                    leftSection={
                        <IconLogout
                            style={{
                                width: rem(14),
                                height: rem(14)
                            }}
                        />
                    }
                >
                    Cerrar sesión
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

export default UserButton
