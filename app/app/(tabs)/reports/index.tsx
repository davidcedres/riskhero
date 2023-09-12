import { ScrollView } from 'react-native'
import Typography from '../../../components/Typography'
import VStack from '../../../components/VStack'

const Reports = () => (
    <ScrollView style={{ backgroundColor: 'white' }}>
        <VStack style={{ padding: 16 }}>
            <Typography variant="title">Reportes</Typography>
        </VStack>
    </ScrollView>
)

export default Reports
