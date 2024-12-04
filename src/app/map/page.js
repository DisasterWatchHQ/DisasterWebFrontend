//src/app/map/page.js
"use client";
import { useEffect, useRef } from "react";
export default function Map(){
    const mapref = useRef(null);

   useEffect(() => {
    import("leaflet").then((L) => {
        if(mapref.current && !mapref.current._leaflet_id) {
            const map = L.map(mapref.current).setView([51.505,-0.09], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        }
    });
   }, []);
    return(
        <div>
            <h1 className="text-x1 font-bold mb-4">Disaster Location Map</h1>
            <div ref={mapref} style={{ height:'500px', width:'100%'}}></div>
        </div>
    );
}