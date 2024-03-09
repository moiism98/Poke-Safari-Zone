import useApp from "src/components/App/hook/useApp";
import GameScreen from "src/components/GameScreen/GameScreen";
import daycare from "src/assets/img/Zones/daycare.svg";

const DayCare = () => {

    const { gameScreen } = useApp();

    return(
        <GameScreen styles={ Object.assign({}, gameScreen, { backgroundImage: `url(${ daycare })` }) }>
            <>
                DAYCARE PAGE
            </>

        </GameScreen>    
    )
}

export default DayCare