import { useContext } from "react"
import { Button } from "antd"
import { Context } from "src/context/AppContext"
import { useLocation, useNavigate } from "react-router-dom"
import { EyeFilled, PlayCircleFilled } from '@ant-design/icons';

const ZonesContent = () => {

    const { saveFile, options } = useContext(Context)

    const navigate = useNavigate()

    const { pathname } = useLocation();

    return(
        <div id="zones">
                {
                    saveFile ?
                        saveFile.safariZones.map(zone => (
                            <div key={ zone.id } id='zone' style = {
                                { 
                                    backgroundImage: `url(${zone.portrait})`, 
                                    border: options.frame?.styles.border, 
                                    borderRadius: options.frame?.styles.borderRadius
                                }
                            }>
                                <div id='zone-content'>
                                    <h1>{zone.name}</h1>
                                    {
                                        pathname == '/play' ? 
                                        <Button style={{ fontFamily: options.appFont }} icon={ <PlayCircleFilled /> } onClick={ () => navigate(`${ zone.name.toLowerCase() }`)}>Select zone</Button>

                                        :
                                        <Button style={{ fontFamily: options.appFont }} icon={ <EyeFilled /> } onClick={ () => navigate(`${ zone.name.toLowerCase() }`)}>View zone details</Button>
                                    }
                                </div>
                            </div>
                        ))
                    : null
                } 
            </div>    
    )
}

export default ZonesContent