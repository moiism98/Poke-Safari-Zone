import Modal from 'antd/es/modal';
import useNewPlayer from './hook/useNewPlayer';
import { Input, Button, Form, Select } from 'antd';
import { SaveFile, icon } from 'src/interfaces/interfaces';
import { useContext, useEffect, useState } from 'react';
import { Context } from 'src/context/AppContext';
import { Image } from 'react-bootstrap';

const NewGame = () => {

    const { setSaveFile, options } = useContext(Context);

    const { icons } = useNewPlayer()

    const { Option } = Select;

    const [ openModal, setOpenModal ] = useState<boolean>(true);

    const [ playerIcons ] = useState(icons)

    const onFinish = (data: { playerName: string, playerIcon: string }) => {

        let newSaveFile: SaveFile | null = null;

        const icon: icon | undefined = icons.find(icon => icon.name == data.playerIcon)

        if(icon)
        {
            newSaveFile = {
                seenPokemons: [],
                myPokemons: [],
                safariZones: [],
                options: {
                    font: 'pkmndp',
                    frame: options.frame_styles[0],
                    icon: icon
                },
                bag: [],
                player: {
                    name: data.playerName,
                    experience: 0,
                    level: 1
                }
            };
        }

        localStorage.setItem('saveFile', JSON.stringify(newSaveFile))

        setOpenModal(false);
    }

    // when we close the modal, we update the saveFile state (with the localStorage value) to reload the index component!

    useEffect(() => {
    
        console.log('New game created successfully!');

        const saveFile: string | null = localStorage.getItem('saveFile')

        if(saveFile)
        {
            setSaveFile(JSON.parse(saveFile))
        }

    }, [ openModal, setSaveFile ])

    return(
        <Modal
            open = { openModal }
            footer =  { <></> }
            closeIcon = { false }
            title='Create a new game!'
        >
            <Form 
                onFinish={onFinish}
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
                            playerIcons.map(icon => (
                                    
                                <Option key={icon.id} value={icon.name}>
                
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <span>{icon.name}</span>
                                        <Image src={icon.icon}/>
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