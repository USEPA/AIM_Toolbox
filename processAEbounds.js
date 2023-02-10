// Script for processing EPA Aquifer Exemptions using data exported from 
//   the geodatabase available at https://www.epa.gov/uic/aquifer-exemption-data
// Data must be exported to GeoJSON format (no newlines) in EPSG 3857 (pseudo-Mercator)
// The export file name is expected to be "AEbounds_2022.json", but you could change that in the script

const fs = require("fs");

const qual1 = "Precise Location"
const qual2 = "Less precise location and some attributes missing"
const qual3 = "Imprecise location or several attributes missing"
const qual4 = "County location available only"

const qualityMap = new Map([
    [qual1, 1],
    [qual2, 2],
    [qual3, 3],
    [qual4, 4],
]);

let dataType = "FeatureCollection";
let dataName = "Aquifer Exemptions";
let crs = "urn:ogc:def:crs:EPSG::3857";

// Change input file name as needed
const AEbounds = JSON.parse(
    fs.readFileSync("AEbounds_2022.json").toString()
);

let AEboundsFeatures = AEbounds.features.map(e => {
    let ep = e.properties;
    return {
        "type": "Feature",
        "geometry": e.geometry,
        "properties": {
            "id": ep.ID_1,
            "AEID": ep.ID_1,
            "WellID": ep.Injection_Well_ID === " " ? null : ep.Injection_Well_ID,
            "WellClass": ep.Well_Class === " " ? null : ep.Well_Class,
            "InjType": ep.Injection_Activity === " " ? null : ep.Injection_Activity,
            "State": ep.State === " " ? null : ep.State,
            "County": ep.County === " " ? null : ep.County,
            "Tribe": ep.Tribe === " " ? null : ep.Tribe,
            "Area": ep.AE_Area === " " ? null : ep.AE_Area,
            "AreaUnits": ep.AE_Area_Units === " " ? null : ep.AE_Area_Units,
            "Depth": ep.Depth === " " ? null : ep.Depth,
            "DepthUnits": ep.Depth_Units === " " ? null : ep.Depth_Units,
            "InjZone": ep.Injection_Zone === " " ? null : ep.Injection_Zone,
            "FormationThick": ep.Formation_Thickness === " " ? null : ep.Formation_Thickness,
            "Lithology": ep.Lithology === " " ? null : ep.Lithology,
            "AEDate": ep.Decision_Date === " " ? null : new Date(ep.Decision_Date).toISOString()
                                                            .replace("T"," ").replace("Z","")
                                                            .replace(".000","").replace(/-/g,"/"),
            "Qual": ep.Data_Quality_Category === " " ? null : qualityMap.get(ep.Data_Quality_Category),
        }
    }
});

// Split data into 8 files; some post processing will be needed to get files that are < 10MB each
let n = 8;
let k = Math.ceil(AEbounds.features.length / n);
let outputFileName = "AEbounds_";
let output;
for (let i = 0; i < n; i++) {
    output = {
        "type": dataType,
        "name": dataName,
        "crs":  crs,
        "features": AEboundsFeatures.slice(i*k,(i+1)*k),
    };

    fs.writeFileSync(`./${outputFileName}${i}.json`,JSON.stringify(output));
}
