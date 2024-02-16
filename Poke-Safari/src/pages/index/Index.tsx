import 'src/pages/index/Index.css'
import { useContext } from 'react';
import { Context } from 'src/context/AppContext';
import NewPlayer from 'src/components/NewPlayer/NewGame';
import GameScreen from 'src/components/GameScreen/GameScreen';
import IndexContainer from 'src/components/Index/IndexContainer';

const Index = () =>
{
    const { saveFile } = useContext(Context);

    return  saveFile != null ? <GameScreen> <IndexContainer/> </GameScreen> : <NewPlayer/>
    
};

export default Index;