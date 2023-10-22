import { Avatar, Menu, rem } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { IconLogout } from '@tabler/icons-react'

const UserButton = () => {
    const [, , removeJwt] = useLocalStorage({
        key: 'jwt'
    })

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Avatar />
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    onClick={removeJwt}
                    color="red"
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
