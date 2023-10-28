import { Player } from '@lottiefiles/react-lottie-player'
import relaxed from '../lotties/relaxed.json'

const Relaxed = () => (
    <Player
        autoplay
        loop
        src={relaxed}
        style={{ height: '300px', width: '300px' }}
    />
)

export default Relaxed
