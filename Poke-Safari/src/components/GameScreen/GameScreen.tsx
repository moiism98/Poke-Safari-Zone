import useApp from "../App/hook/useApp";

type GameScreenProps = {
    children: React.ReactNode,
    styles?: React.CSSProperties
};

const GameScreen = (props: GameScreenProps) => {

    const { gameScreen } = useApp()

    return <div id='gameScreen' style={ props.styles ? props.styles : gameScreen }>{props.children}</div>    
    
};

export default GameScreen;