import './Playground.css';
import useApp from "src/components/App/hook/useApp";
import GameScreen from "src/components/GameScreen/GameScreen";
import useZone from "src/components/Zones/hook/useZone";
import PlaygroundContent from 'src/components/Playground/PlaygroundContent';

const Playground = () => {

    const { gameScreen } = useApp();

    const { zone } = useZone();
    return(
        <GameScreen styles={ Object.assign({}, gameScreen, { backgroundImage: `url(${zone?.portrait})` }) }>
            <PlaygroundContent/>
        </GameScreen>    
    )

}

export default Playground;