import { Moves, Ability } from "src/interfaces/interfaces";

const usePlayground = () => {

    const RandomProbability = (limit: number) => {
    
        return Math.floor(Math.random() * limit);
    }

    const SetRandomMoveSet = (moves: Moves[]) => {

        if(moves)
        {
        
            let move = 0;
            
            const pokeMoves: Moves[] = [];
    
            while(move < RandomProbability(4))
            {
                pokeMoves.push(moves[move])
    
                move++;
            }
    
            //const randomMoveSet = pokeMoves.map(move => move.move.name).join(', ');
    
            return pokeMoves;
        }
    }

    const SetRandomAbility = (abilities: Ability[]) => {
        
        let ability: Ability | null = null;

        if(abilities)
        {
            const random = RandomProbability(abilities.length);

            ability = abilities[random];
        }

        return ability;

    };

    return{
        RandomProbability,
        SetRandomMoveSet,
        SetRandomAbility
    }

}

export default usePlayground