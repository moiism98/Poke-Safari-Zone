import { Moves } from "src/interfaces/interfaces";

const setRandomMoveSet = (moves: Moves[] | undefined) => {

    if(moves)
    {
    
        let move = 0;

        console.log(moves);
        
        const pokeMoves: Moves[] = [];

        while(move < 4)
        {
            pokeMoves.push(moves[move])

            move++;
        }

        const randomMoveSet = pokeMoves.map(move => move.move.name).join(', ');

        return randomMoveSet;
    }
}

export default setRandomMoveSet