import { useContext } from "react";
import { Button, Pagination, Popover } from "antd";
import { Context } from "src/context/AppContext";
import { EyeFilled, PlayCircleFilled } from '@ant-design/icons';
import useZones from "./hook/useZones";
import useApp from "../App/hook/useApp";

const ZonesContent = () => {

    const { options } = useContext(Context);

    const { FirstLetterToUpper } = useApp();

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
                                    <h1>{FirstLetterToUpper(zone.name)}</h1>
                                    {
                                        !zone.unlock ?
                                            pathname == '/play' ? 
                                            <Button style={{ fontFamily: options.appFont }} icon={ <PlayCircleFilled /> } onClick={ () => navigate(`${ zone.name.toLowerCase() }`)}>Select zone</Button>
                                            :
                                            <Button style={{ fontFamily: options.appFont }} icon={ <EyeFilled /> } onClick={ () => navigate(`${ zone.name.toLowerCase() }`)}>View zone details</Button>
                                        : 
                                        <Popover
                                            trigger='click'
                                            content={<span style={{ fontFamily: options.appFont }}>{ zone.unlock.description }</span>}
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