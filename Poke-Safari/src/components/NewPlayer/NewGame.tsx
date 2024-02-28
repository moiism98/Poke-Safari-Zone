import { Input, Button, Form, Select } from 'antd';
import { Image } from 'react-bootstrap';
import Modal from 'antd/es/modal';
import playerIcons from 'src/utils/NewPlayer/playerIcons';
import useNewGame from './useNewGame';

const NewGame = () => {

    const { openModal, onFinish } = useNewGame();

    const { icons } = playerIcons();
    
    const { Option } = Select;

    return(
        <Modal
            open = { openModal }
            footer =  { <></> }
            closeIcon = { false }
            title='Create a new game!'
        >
            <Form 
                onFinish={ onFinish }
            >

                <Form.Item<string>
                    label = "Player name: "
                    name = "playerName"
                    rules={[

                        { required: true, message: "Please don't forget to introduce a player's name!" }, 
                        { type: 'string', min: 3, message: "Player's name must be have at least 3 characters..." }
                    ]}
                >
                    <Input placeholder="Introduce a player's name..." allowClear/>
                </Form.Item>

                <Form.Item name="playerIcon" label="Player icon" rules={[{ required: true, message: 'Please select an icon!' }]}>
                    <Select
                        placeholder="Select an icon..."
                        allowClear
                    >
                        {
                            icons.map(icon => (
                                    
                                <Option key={ icon.id } value={ icon.name }>
                
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>{ icon.name }</span>
                                        <Image src={ icon.icon }/>
                                    </div>
                                
                                </Option>
                            ))
                        }

                    </Select>
                </Form.Item>

                <Form.Item style={{display:'flex', justifyContent: 'flex-end', paddingTop: '2em', margin: 0}}>
                    <Button type='primary' htmlType='submit'> BEGIN ! </Button>
                </Form.Item>

            </Form>
        </Modal>    
    )
}

export default NewGame