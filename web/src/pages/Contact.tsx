import { Button, Image, Stack, TextInput, Title } from '@mantine/core'
import svg from '../assets/undraw_qa_engineers_dg-5-p.svg'

const Contact = () => {
    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <Stack align="flex-start">
                <Image src={svg} alt="Contact" w="150" />
                <Title order={1}>¿Necesitas asesoría personalizada?</Title>
                <TextInput w="100%" label="Email" name="email" required />
                <Button type="submit">Solicitar</Button>
            </Stack>
        </form>
    )
}

export default Contact
