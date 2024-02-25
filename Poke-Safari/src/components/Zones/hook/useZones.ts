import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "src/context/AppContext";
import { SafariZone } from "src/interfaces/interfaces";
import { useLocation, useNavigate } from "react-router-dom";


const useZones = () => {

    const { saveFile } = useContext(Context);

    const navigate = useNavigate();

    const { pathname } = useLocation();

    const zoneDisplayLimit = 2;

    const [ page, setPage ] = useState<number>();

    const [ pages, setPages ] = useState<number>();

    const [ offset, setOffset ] = useState<number>(0);

    const [ zones, setZones ] = useState<SafariZone[]>();

    const [ zonesCount, setZonesCount] = useState<number>();

    const PaginateZones = useCallback(() => {
        
        const zones: SafariZone[] = []

        if(saveFile && zonesCount)
        {
            let zone = offset;

            while( zone < zoneDisplayLimit + offset)
            {
                if(zone < zonesCount)
                    zones.push(saveFile.safariZones[zone]);
                else
                    zone = zonesCount;

                zone++;
            }
        }

        if(zones)
        {
            setZones(zones);
        }
        
    }, [ offset, saveFile, zonesCount ])

    useEffect(() => {
    
        // set total pages

        if(zonesCount)
        {
            setPages(Math.round(zonesCount / zoneDisplayLimit));
        }

        // set current page (depends on offset)

        setPage(( offset + zoneDisplayLimit ) / zoneDisplayLimit);

        // returns the current page's zones

        PaginateZones();

    }, [ offset, zonesCount, PaginateZones ])

    useEffect(() => {
        
        if(saveFile)
        {
            setZonesCount(saveFile.safariZones.length);
        }
    
    },[ saveFile ])

    useEffect(() => {
        
        setOffset(0)

    }, [ pathname, setOffset ])

    return {
        page,
        pages,
        zones,
        zoneDisplayLimit,
        navigate,
        pathname,
        setOffset
    }

}

export default useZones