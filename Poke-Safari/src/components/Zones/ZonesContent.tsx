import { useContext } from "react";
import { Button, Pagination, Popover } from "antd";
import { Context } from "src/context/AppContext";
import { EyeFilled, PlayCircleFilled } from '@ant-design/icons';
import useZones from "./hook/useZones";

const ZonesContent = () => {

    const { options } = useContext(Context)

    const { zones, page, pages, zoneDisplayLimit, navigate, pathname, setOffset } = useZones();

    return(
        <>
            <div id="zones">
                {
                    zones ?
                        zones.map(zone => (
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
                                        !zone.unlocked ?
                                            pathname == '/play' ? 
                                            <Button style={{ fontFamily: options.appFont }} icon={ <PlayCircleFilled /> } onClick={ () => navigate(`${ zone.name.toLowerCase() }`)}>Select zone</Button>
                                            :
                                            <Button style={{ fontFamily: options.appFont }} icon={ <EyeFilled /> } onClick={ () => navigate(`${ zone.name.toLowerCase() }`)}>View zone details</Button>
                                        : 
                                        <Popover
                                            trigger='click'
                                            content={<span>{ zone.unlocked.unlock }</span>}
                                        >
                                            <Button danger>??????????</Button>
                                        </Popover>
                                    }
                                </div>
                            </div>
                        ))
                        : null
                    } 
            </div>
            <Pagination 
                current={ page } 
                total={ pages ? pages * 10 : 50 } 
                onChange={ (page) => setOffset(page != 1 ? (page * zoneDisplayLimit) - zoneDisplayLimit : 0) }
                style={{margin: '1em'}}
                showSizeChanger={false}
                />
        </>
    )
}

export default ZonesContent