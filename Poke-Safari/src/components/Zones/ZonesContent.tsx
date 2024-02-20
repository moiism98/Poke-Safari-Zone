import { useContext } from "react"
import { Button } from "antd"
import { Context } from "src/context/AppContext"
import { useNavigate } from "react-router-dom"
import { EyeOutlined } from '@ant-design/icons';

const ZonesContent = () => {

    const { saveFile, options } = useContext(Context)

    const navigate = useNavigate()

    // console.log(saveFile)

    return(
        <div id="zones">
                {
                    saveFile ?
                        saveFile.safariZones.map(zone => (
                            <div key={zone.id} id='zone' style = {
                                { 
                                    backgroundImage: `url(${zone.portrait})`, 
                                    border: options.frame?.styles.border, 
                                    borderRadius: options.frame?.styles.borderRadius
                                }
                            }>
                                <div id='zone-content'>
                                    <h1>{zone.name}</h1>
                                    <Button style={{ fontFamily: options.appFont}} icon={ <EyeOutlined /> } onClick={ () => navigate(`${ zone.name.toLowerCase() }`)}>View zone details</Button>
                                </div>
                            </div>
                        ))
                    : null
                } 
            </div>    
    )
}

export default ZonesContent