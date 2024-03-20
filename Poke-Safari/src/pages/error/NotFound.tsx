import error from 'src/assets/img/Error/error-404.svg';
import { Button, Result } from 'antd';
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {

    const navigate = useNavigate();

    return(
        <Result
            icon={ <Image width={ 400 } height={ 400 } src={ error }/> }
            title={ <h2 style={{ color: 'red' }}>404</h2> }
            subTitle={ <h3>"Sorry, the page you visited does not exist."</h3> }
            extra={ <Button onClick={() => navigate('/')} type="primary">Back Home</Button> }
        />
    )
}

export default NotFound;