import useApp from "../App/hook/useApp";

type GameScreenProps = {
    children: React.ReactNode
};

const GameScreen = (props: GameScreenProps) => {

    const { gameScreen } = useApp()

    return <div id='gameScreen' style={ gameScreen }>{props.children}</div>    
    
};

export default GameScreen;