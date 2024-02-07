import { useState } from 'react';
import { Button } from 'react-bootstrap';
import '../../components/styles/GameScreen.css'

const Index = () =>
{
    const [count, setCount] = useState(0)

    return (
        <>
          <div className='container' id='gameScreen'>
            <h1 style={{fontFamily: 'pkmnfl'}}>Vite + React</h1>
            <div className="card">
              <Button variant='secondary' onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </Button>
              <p>
                Edit <code>src/App.tsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>
        </div>
        </>
    )
};

export default Index;