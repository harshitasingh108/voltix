import { useEffect, useState, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Sparkles, MapPin, Navigation, Battery, Search, RefreshCw, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

/* =====================================================
   CUSTOM LEAFLET MARKER ICONS
===================================================== */

const createCustomIcon = (emoji, bgColor = "#2563eb", isSelected = false) => {
    const size = isSelected ? 42 : 36;
    const ringStyle = isSelected ? "border: 3px solid #2563eb; ring: 4px rgba(37,99,235,0.4);" : "border: 2px solid #ffffff;";
    
    return L.divIcon({
        className: "custom-leaflet-marker",
        html: `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: ${size}px;
                height: ${size}px;
                background-color: ${bgColor};
                ${ringStyle}
                border-radius: 50%;
                box-shadow: 0 6px 16px rgba(0,0,0,0.3);
                font-size: ${isSelected ? 22 : 18}px;
                cursor: pointer;
                transition: transform 0.2s ease;
            ">
                ${emoji}
            </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
    });
};

const userIcon = createCustomIcon("📍", "#2563eb");
const destinationIcon = createCustomIcon("🎯", "#dc2626");
const stationIcon = createCustomIcon("🔌", "#0891b2");
const selectedStationIcon = createCustomIcon("⚡", "#2563eb", true);
const recommendedIcon = createCustomIcon("⭐", "#059669");

/* =====================================================
   HAVERSINE DISTANCE (in km)
===================================================== */

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/* =====================================================
   OSM METADATA DERIVATION FOR GENERALIZED ML MODEL
===================================================== */

const deriveChargerTypeFromOSM = (tags = {}) => {
    const output = (tags["charging_station:output"] || tags.output || "").toString().toLowerCase();
    const socketStr = JSON.stringify(tags).toLowerCase();

    if (
        output.includes("dc") ||
        output.includes("ccs") ||
        output.includes("chademo") ||
        output.includes("supercharger") ||
        output.includes("50kw") ||
        output.includes("100kw") ||
        output.includes("150kw") ||
        output.includes("250kw") ||
        socketStr.includes("ccs") ||
        socketStr.includes("chademo") ||
        socketStr.includes("dc") ||
        socketStr.includes("supercharger")
    ) {
        return 1; // Fast / DC
    }

    if (
        output.includes("ac") ||
        output.includes("7kw") ||
        output.includes("11kw") ||
        output.includes("22kw") ||
        output.includes("type2") ||
        socketStr.includes("type2") ||
        socketStr.includes("schuko") ||
        socketStr.includes("ac")
    ) {
        return 0; // Slow / AC
    }

    const numericKW = parseFloat(output);
    if (!isNaN(numericKW)) {
        return numericKW >= 40 ? 1 : 0;
    }

    return null;
};

const deriveLocationCategoryFromOSM = (tags = {}) => {
    const combinedStr = (
        (tags.location || "") + " " +
        (tags.parking || "") + " " +
        (tags.amenity || "") + " " +
        (tags.building || "") + " " +
        (tags.landuse || "") + " " +
        (tags.tourism || "") + " " +
        (tags.leisure || "") + " " +
        (tags.shop || "") + " " +
        (tags.operator || "") + " " +
        (tags.name || "")
    ).toLowerCase();

    if (combinedStr.includes("hotel") || combinedStr.includes("inn") || combinedStr.includes("lodge")) {
        return "hotel";
    }
    if (combinedStr.includes("apartment") || combinedStr.includes("residential") || combinedStr.includes("condo")) {
        return "apartment";
    }
    if (combinedStr.includes("restaurant") || combinedStr.includes("cafe") || combinedStr.includes("fast_food") || combinedStr.includes("diner")) {
        return "restaurant";
    }
    if (combinedStr.includes("resort")) {
        return "resort";
    }
    if (combinedStr.includes("parking") || combinedStr.includes("garage") || combinedStr.includes("car_park") || combinedStr.includes("multi-storey")) {
        return "public parking lot";
    }
    if (combinedStr.includes("company") || combinedStr.includes("office") || combinedStr.includes("tech") || combinedStr.includes("corp") || combinedStr.includes("commercial")) {
        return "company";
    }
    if (combinedStr.includes("court") || combinedStr.includes("townhall") || combinedStr.includes("gov") || combinedStr.includes("institution") || combinedStr.includes("public_building")) {
        return "public institution";
    }
    if (combinedStr.includes("supermarket") || combinedStr.includes("mall") || combinedStr.includes("market") || combinedStr.includes("bazaar") || combinedStr.includes("store")) {
        return "market";
    }
    if (combinedStr.includes("camp") || combinedStr.includes("caravan")) {
        return "camping";
    }
    if (combinedStr.includes("golf")) {
        return "golf";
    }
    if (combinedStr.includes("sightseeing") || combinedStr.includes("attraction") || combinedStr.includes("museum") || combinedStr.includes("viewpoint")) {
        return "sightseeing";
    }
    if (combinedStr.includes("bus")) {
        return "bus garage";
    }
    if (combinedStr.includes("accommodation") || combinedStr.includes("motel") || combinedStr.includes("hostel")) {
        return "accommodation";
    }
    if (combinedStr.includes("public") || tags.access === "public" || tags.fee === "yes" || tags.fee === "no") {
        return "public area";
    }

    return null;
};

/* =====================================================
   SMART RECOMMENDATION SCORING HELPERS
===================================================== */

const calculateMinMaxNormalized = (values) => {
    if (!values || values.length === 0) return [];
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (min === max) {
        return values.map(() => 0);
    }
    return values.map((val) => (val - min) / (max - min));
};

const computeStationRecommendationScores = (stationsList, predictionsMap) => {
    if (!stationsList || stationsList.length === 0) {
        return {
            scoredStations: [],
            recommendedStation: null,
            hasAiRecommendation: false
        };
    }

    const eligibleWithPredictions = stationsList.filter(
        (s) => predictionsMap[s.id]?.result !== null && predictionsMap[s.id]?.result !== undefined
    );

    if (eligibleWithPredictions.length === 0) {
        return {
            scoredStations: stationsList.map((s) => ({ ...s, smartScore: null })),
            recommendedStation: null,
            hasAiRecommendation: false
        };
    }

    const distances = eligibleWithPredictions.map((s) => s.distanceFromUser || 0);
    const demands = eligibleWithPredictions.map((s) => predictionsMap[s.id].result);

    const normDistances = calculateMinMaxNormalized(distances);
    const normDemands = calculateMinMaxNormalized(demands);

    const scoredMap = new Map();

    eligibleWithPredictions.forEach((station, idx) => {
        const normDist = normDistances[idx];
        const normDem = normDemands[idx];

        const distanceScore = 1 - normDist;
        const demandScore = 1 - normDem;
        const chargerScore = station.derivedChargerType === 1 ? 1.0 : 0.5;

        const finalScore = 0.40 * distanceScore + 0.40 * demandScore + 0.20 * chargerScore;
        const smartScore = Math.round(finalScore * 100);

        scoredMap.set(station.id, {
            smartScore,
            distanceScore,
            demandScore,
            chargerScore,
            predictedDemand: demands[idx]
        });
    });

    const allScored = stationsList.map((s) => {
        const scoring = scoredMap.get(s.id);
        if (scoring) {
            return {
                ...s,
                smartScore: scoring.smartScore,
                distanceScore: scoring.distanceScore,
                demandScore: scoring.demandScore,
                chargerScore: scoring.chargerScore,
                predictedDemand: scoring.predictedDemand
            };
        }
        return { ...s, smartScore: null };
    });

    const predictedRanked = allScored
        .filter((s) => s.smartScore !== null)
        .sort((a, b) => b.smartScore - a.smartScore);

    const unpredicted = allScored.filter((s) => s.smartScore === null);

    const rankedStations = [...predictedRanked, ...unpredicted];
    const recommendedStation = predictedRanked.length > 0 ? predictedRanked[0] : null;

    return {
        scoredStations: rankedStations,
        recommendedStation,
        hasAiRecommendation: recommendedStation !== null
    };
};

/* =====================================================
   SMART CHARGE COMPONENT
===================================================== */

const SmartCharge = () => {
    /* -------------------------------------------------
       STARTING LOCATION & GEOLOCATION
    ------------------------------------------------- */
    const [startLocationText, setStartLocationText] = useState("");
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);

    /* -------------------------------------------------
       DESTINATION
    ------------------------------------------------- */
    const [destination, setDestination] = useState("");
    const [destinationLocation, setDestinationLocation] = useState(null);
    const [destinationLoading, setDestinationLoading] = useState(false);

    /* -------------------------------------------------
       BATTERY
    ------------------------------------------------- */
    const [battery, setBattery] = useState("78");

    /* -------------------------------------------------
       STATION SELECTION & PREDICTIONS
    ------------------------------------------------- */
    const [selectedStationId, setSelectedStationId] = useState(null);
    const [stationPredictions, setStationPredictions] = useState({});

    /* -------------------------------------------------
       ROUTE & STATIONS
    ------------------------------------------------- */
    const [route, setRoute] = useState(null);
    const [routeLoading, setRouteLoading] = useState(false);
    const [stations, setStations] = useState([]);
    const [stationsLoading, setStationsLoading] = useState(false);

    /* -------------------------------------------------
       MAP REFS
    ------------------------------------------------- */
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const layerGroupRef = useRef(null);

    /* =================================================
       LEAFLET ROUTE COORDINATES
    ================================================= */
    const routeCoordinates = useMemo(() => {
        return (
            route?.geometry?.coordinates?.map(
                ([longitude, latitude]) => [latitude, longitude]
            ) || []
        );
    }, [route]);

    /* =================================================
       RECOMMENDATION CALCULATIONS
    ================================================= */
    const { scoredStations, recommendedStation, hasAiRecommendation } = useMemo(() => {
        return computeStationRecommendationScores(stations, stationPredictions);
    }, [stations, stationPredictions]);

    /* =================================================
       CURRENT LOCATION GEOLOCATION + REVERSE GEOCODE
    ================================================= */
    const getCurrentLocation = () => {
        setLocationLoading(true);

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser. Please type your starting location manually.");
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                let addressName = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

                try {
                    const revRes = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    if (revRes.ok) {
                        const revData = await revRes.json();
                        if (revData?.display_name) {
                            addressName = revData.display_name;
                        }
                    }
                } catch (e) {
                    console.warn("Reverse geocode warning:", e);
                }

                const newLocation = {
                    latitude,
                    longitude,
                    accuracy,
                    displayName: addressName
                };

                setLocation(newLocation);
                setStartLocationText(addressName);
                setLocationLoading(false);
            },
            (error) => {
                console.error("Location Error:", error);
                alert("Location access unavailable. Please enter your starting point manually.");
                setLocationLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    /* =================================================
       DEMAND PREDICTION HELPERS
    ================================================= */
    const ML_LIVE_URL = "https://voltix-rfy8.onrender.com/predict-demand";
    const ML_LOCAL_URL = "http://127.0.0.1:8000/predict-demand";

    const callPredictDemandApi = async (payload) => {
        const primaryUrl = import.meta.env.VITE_ML_API_URL
            ? `${import.meta.env.VITE_ML_API_URL.replace(/\/$/, '')}/predict-demand`
            : ML_LOCAL_URL;

        try {
            const response = await fetch(primaryUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (response.ok) return await response.json();
        } catch (_) {}

        const fallbackResponse = await fetch(ML_LIVE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!fallbackResponse.ok) {
            let errorText = "Unable to connect to the SmartCharge AI service.";
            try {
                const errData = await fallbackResponse.json();
                if (errData?.detail) errorText = errData.detail;
            } catch (_) {}
            throw new Error(errorText);
        }

        return await fallbackResponse.json();
    };

    const handlePredictStationDemand = async (station) => {
        if (!station.predictionAvailable) return;

        const stationId = station.id;
        setStationPredictions((prev) => ({
            ...prev,
            [stationId]: { loading: true, result: null, error: null }
        }));

        const currentIsoDatetime = new Date().toISOString();
        const payload = {
            Location: station.derivedLocation,
            ChargerType: station.derivedChargerType,
            target_datetime: currentIsoDatetime
        };

        try {
            const data = await callPredictDemandApi(payload);
            if (data && typeof data.predictedDemand === "number") {
                setStationPredictions((prev) => ({
                    ...prev,
                    [stationId]: { loading: false, result: data.predictedDemand, error: null }
                }));
            } else {
                throw new Error("Invalid prediction format received.");
            }
        } catch (error) {
            console.error("Demand Prediction Error:", error);
            setStationPredictions((prev) => ({
                ...prev,
                [stationId]: {
                    loading: false,
                    result: null,
                    error: error.message || "Unable to connect to the AI service."
                }
            }));
        }
    };

    const batchPredictStations = async (stationsList) => {
        const eligible = stationsList.filter((s) => s.predictionAvailable);
        if (eligible.length === 0) return;

        const currentIsoDatetime = new Date().toISOString();

        const initialStates = {};
        eligible.forEach((st) => {
            initialStates[st.id] = { loading: true, result: null, error: null };
        });
        setStationPredictions((prev) => ({ ...prev, ...initialStates }));

        const promises = eligible.map(async (station) => {
            const payload = {
                Location: station.derivedLocation,
                ChargerType: station.derivedChargerType,
                target_datetime: currentIsoDatetime
            };

            const data = await callPredictDemandApi(payload);
            if (data && typeof data.predictedDemand === "number") {
                return { id: station.id, predictedDemand: data.predictedDemand };
            } else {
                throw new Error("Invalid prediction format.");
            }
        });

        const results = await Promise.allSettled(promises);

        setStationPredictions((prev) => {
            const updated = { ...prev };
            results.forEach((res, idx) => {
                const stId = eligible[idx].id;
                if (res.status === "fulfilled") {
                    updated[stId] = { loading: false, result: res.value.predictedDemand, error: null };
                } else {
                    updated[stId] = {
                        loading: false,
                        result: null,
                        error: res.reason?.message || "Prediction request failed."
                    };
                }
            });
            return updated;
        });
    };

    /* =================================================
       RESOLVE START LOCATION COORDS
    ================================================= */
    const resolveStartLocation = async () => {
        if (location && startLocationText && startLocationText.trim() === location.displayName) {
            return location;
        }

        if (!startLocationText.trim()) {
            alert("Please enter a starting location or use your current location.");
            return null;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startLocationText)}&limit=1`
            );
            if (!response.ok) throw new Error("Starting location search failed");
            const data = await response.json();
            if (!data || data.length === 0) {
                alert("Starting location not found. Please try another address.");
                return null;
            }
            const res = data[0];
            const resolvedLoc = {
                latitude: Number(res.lat),
                longitude: Number(res.lon),
                displayName: res.display_name
            };
            setLocation(resolvedLoc);
            return resolvedLoc;
        } catch (error) {
            console.error("Start location error:", error);
            alert("Could not resolve starting location address.");
            return null;
        }
    };

    /* =================================================
       RESOLVE DESTINATION COORDS
    ================================================= */
    const resolveDestinationLocation = async () => {
        if (!destination.trim()) {
            alert("Please enter a destination.");
            return null;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`
            );
            if (!response.ok) throw new Error("Destination search failed");
            const data = await response.json();
            if (!data || data.length === 0) {
                alert("Destination address not found. Please try another location.");
                return null;
            }
            const res = data[0];
            const destLoc = {
                latitude: Number(res.lat),
                longitude: Number(res.lon),
                displayName: res.display_name
            };
            setDestinationLocation(destLoc);
            return destLoc;
        } catch (error) {
            console.error("Destination error:", error);
            alert("Could not resolve destination address.");
            return null;
        }
    };

    /* =================================================
       FIND CHARGING STATIONS & CALCULATE ROUTE HANDLER
    ================================================= */
    const handleFindStations = async () => {
        if (battery === "" || Number(battery) < 0 || Number(battery) > 100) {
            alert("Please enter a battery level between 0 and 100%.");
            return;
        }

        setRouteLoading(true);
        setStationsLoading(true);
        setRoute(null);
        setStations([]);
        setSelectedStationId(null);

        const startLoc = await resolveStartLocation();
        if (!startLoc) {
            setRouteLoading(false);
            setStationsLoading(false);
            return;
        }

        const destLoc = await resolveDestinationLocation();
        if (!destLoc) {
            setRouteLoading(false);
            setStationsLoading(false);
            return;
        }

        try {
            // OSRM Driving Route Request
            const url = `https://router.project-osrm.org/route/v1/driving/${startLoc.longitude},${startLoc.latitude};${destLoc.longitude},${destLoc.latitude}?overview=full&geometries=geojson`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Route request failed");
            const data = await response.json();

            if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
                alert("No driving route could be found between these locations.");
                setRouteLoading(false);
                setStationsLoading(false);
                return;
            }

            const selectedRoute = data.routes[0];
            const newRoute = {
                distance: selectedRoute.distance,
                duration: selectedRoute.duration,
                geometry: selectedRoute.geometry,
            };
            setRoute(newRoute);
            setRouteLoading(false);

            // Fetch Charging Stations along bounding box
            const coordinates = newRoute.geometry.coordinates;
            const longitudes = coordinates.map(([lng]) => lng);
            const latitudes = coordinates.map(([, lat]) => lat);

            const minLongitude = Math.min(...longitudes) - 0.02;
            const maxLongitude = Math.max(...longitudes) + 0.02;
            const minLatitude = Math.min(...latitudes) - 0.02;
            const maxLatitude = Math.max(...latitudes) + 0.02;

            const query = `
                [out:json][timeout:25];
                (
                    nwr["amenity"="charging_station"](${minLatitude},${minLongitude},${maxLatitude},${maxLongitude});
                );
                out center tags;
            `;

            const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                body: "data=" + encodeURIComponent(query),
            });

            if (!overpassRes.ok) throw new Error("Charging station search failed");
            const overpassData = await overpassRes.json();

            const stationList = (overpassData.elements || [])
                .map((element) => {
                    const lat = element.lat ?? element.center?.lat;
                    const lon = element.lon ?? element.center?.lon;
                    if (lat === undefined || lon === undefined) return null;

                    const tags = element.tags || {};
                    const distFromUser = calculateDistance(startLoc.latitude, startLoc.longitude, lat, lon);

                    const derivedType = deriveChargerTypeFromOSM(tags);
                    const derivedLoc = deriveLocationCategoryFromOSM(tags);

                    const rawName = tags.name || tags.operator || null;

                    return {
                        id: `${element.type}-${element.id}`,
                        name: rawName || "EV Charging Station",
                        hasGenuineName: Boolean(rawName),
                        operator: tags.operator || null,
                        latitude: lat,
                        longitude: lon,
                        capacity: tags.capacity || null,
                        chargerOutput: tags["charging_station:output"] || tags.output || null,
                        openingHours: tags.opening_hours || null,
                        distanceFromUser: distFromUser,
                        derivedChargerType: derivedType,
                        derivedLocation: derivedLoc,
                        chargerTypeAvailable: derivedType !== null,
                        locationCategoryAvailable: derivedLoc !== null,
                        predictionAvailable: derivedType !== null && derivedLoc !== null,
                        tags: tags
                    };
                })
                .filter(Boolean);

            const uniqueStations = Array.from(
                new Map(stationList.map((s) => [s.id, s])).values()
            );

            uniqueStations.sort((a, b) => a.distanceFromUser - b.distanceFromUser);

            setStations(uniqueStations);
            setStationsLoading(false);

            // Run batch ML prediction
            batchPredictStations(uniqueStations);
        } catch (error) {
            console.error("Search error:", error);
            alert("Something went wrong while retrieving stations. Please check your internet connection.");
            setRouteLoading(false);
            setStationsLoading(false);
        }
    };

    /* =================================================
       LEAFLET MAP EFFECT (FULL PRESERVATION OF ALL MARKERS)
    ================================================= */
    useEffect(() => {
        if (!route || !location || !destinationLocation) {
            if (mapRef.current) {
                try {
                    mapRef.current.remove();
                } catch (e) {
                    console.warn("Map removal warning:", e);
                }
                mapRef.current = null;
                layerGroupRef.current = null;
            }
            return;
        }

        if (!mapContainerRef.current) return;

        try {
            if (!mapRef.current) {
                if (mapContainerRef.current._leaflet_id) {
                    mapContainerRef.current._leaflet_id = null;
                }

                const map = L.map(mapContainerRef.current, {
                    center: [location.latitude, location.longitude],
                    zoom: 13,
                    scrollWheelZoom: true,
                });

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(map);

                const layerGroup = L.layerGroup().addTo(map);
                mapRef.current = map;
                layerGroupRef.current = layerGroup;
            }

            const map = mapRef.current;
            const layerGroup = layerGroupRef.current;

            if (layerGroup) {
                layerGroup.clearLayers();

                // 1. Starting Location Marker
                if (location.latitude && location.longitude) {
                    const userMarker = L.marker(
                        [location.latitude, location.longitude],
                        { icon: userIcon }
                    ).bindPopup(`
                        <div style="font-family: sans-serif; padding: 2px;">
                            <p style="font-weight: 700; color: #0f172a; margin: 0 0 4px 0; font-size: 13px;">📍 Starting Location</p>
                            <p style="color: #64748b; margin: 0; font-size: 11px;">${location.displayName || "Start Location"}</p>
                        </div>
                    `);
                    layerGroup.addLayer(userMarker);
                }

                // 2. Destination Marker
                if (destinationLocation.latitude && destinationLocation.longitude) {
                    const destMarker = L.marker(
                        [destinationLocation.latitude, destinationLocation.longitude],
                        { icon: destinationIcon }
                    ).bindPopup(`
                        <div style="font-family: sans-serif; padding: 2px; max-width: 200px;">
                            <p style="font-weight: 700; color: #0f172a; margin: 0 0 4px 0; font-size: 13px;">🎯 Destination</p>
                            <p style="color: #64748b; margin: 0; font-size: 11px;">${destinationLocation.displayName || ""}</p>
                        </div>
                    `);
                    layerGroup.addLayer(destMarker);
                }

                // 3. OSRM Route Polyline
                if (routeCoordinates.length > 0) {
                    const polyline = L.polyline(routeCoordinates, {
                        color: "#2563eb",
                        weight: 5,
                        opacity: 0.85,
                        lineCap: "round",
                        lineJoin: "round",
                    });
                    layerGroup.addLayer(polyline);
                }

                // 4. Charging Station Markers (ALL STATIONS PRESERVED AT ALL TIMES)
                scoredStations.forEach((station) => {
                    if (station.latitude && station.longitude) {
                        const isRecommended = recommendedStation?.id === station.id;
                        const isSelected = selectedStationId === station.id;

                        let iconToUse = stationIcon;
                        if (isRecommended) iconToUse = recommendedIcon;
                        if (isSelected) iconToUse = selectedStationIcon;

                        const distText = typeof station.distanceFromUser === "number"
                            ? station.distanceFromUser.toFixed(1)
                            : "N/A";

                        const stationMarker = L.marker(
                            [station.latitude, station.longitude],
                            { icon: iconToUse }
                        ).bindPopup(`
                            <div style="font-family: sans-serif; padding: 2px; min-width: 170px;">
                                <p style="font-weight: 700; color: #0f172a; margin: 0 0 4px 0; font-size: 13px;">
                                    ${isRecommended ? "⭐ " : isSelected ? "⚡ " : "🔌 "}
                                    ${station.name || "EV Charging Station"}
                                </p>
                                <div style="font-size: 11px; color: #475569; line-height: 1.5;">
                                    ${isRecommended ? '<p style="margin: 2px 0; color: #059669; font-weight: 700;">⭐ Top Recommended Station</p>' : ''}
                                    ${station.operator ? `<p style="margin: 2px 0;"><strong>Operator:</strong> ${station.operator}</p>` : ''}
                                    <p style="margin: 2px 0;"><strong>Distance:</strong> ${distText} km</p>
                                    ${station.smartScore !== null ? `<p style="margin: 2px 0; color: #0284c7; font-weight: 700;"><strong>Smart Score:</strong> ${station.smartScore}/100</p>` : ''}
                                </div>
                            </div>
                        `);

                        // Synchronized Marker Click Event
                        stationMarker.on("click", () => {
                            setSelectedStationId(station.id);
                            if (mapRef.current) {
                                mapRef.current.flyTo([station.latitude, station.longitude], 14, { animate: true });
                            }
                            const cardElement = document.getElementById(`station-card-${station.id}`);
                            if (cardElement) {
                                cardElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
                            }
                        });

                        layerGroup.addLayer(stationMarker);
                    }
                });

                // 5. Fit Map Bounds
                const boundsPoints = [];
                if (location.latitude && location.longitude) boundsPoints.push([location.latitude, location.longitude]);
                if (destinationLocation.latitude && destinationLocation.longitude) boundsPoints.push([destinationLocation.latitude, destinationLocation.longitude]);
                if (routeCoordinates.length > 0) boundsPoints.push(...routeCoordinates);

                if (boundsPoints.length > 0 && !selectedStationId) {
                    const bounds = L.latLngBounds(boundsPoints);
                    map.fitBounds(bounds, { padding: [40, 40] });
                }

                setTimeout(() => {
                    if (mapRef.current) {
                        try {
                            mapRef.current.invalidateSize();
                        } catch (e) {
                            console.warn("invalidateSize error:", e);
                        }
                    }
                }, 150);
            }
        } catch (error) {
            console.error("Map effect error:", error);
        }
    }, [route, location, destinationLocation, scoredStations, recommendedStation, selectedStationId, routeCoordinates]);

    // Cleanup map on component unmount
    useEffect(() => {
        return () => {
            if (mapRef.current) {
                try {
                    mapRef.current.remove();
                } catch (e) {
                    console.warn("Map unmount error:", e);
                }
                mapRef.current = null;
                layerGroupRef.current = null;
            }
        };
    }, []);

    /* =================================================
       CARD SELECTION & MAP CENTERING HANDLER
    ================================================= */
    const handleSelectStation = (station) => {
        setSelectedStationId(station.id);
        if (mapRef.current && station.latitude && station.longitude) {
            mapRef.current.flyTo([station.latitude, station.longitude], 14, { animate: true });
        }
    };

    /* =================================================
       RENDER
    ================================================= */
    return (
        <main className="min-h-screen bg-slate-50 pt-28 pb-16">
            <section className="mx-auto max-w-7xl px-6 py-12">
                {/* PAGE HEADER */}
                <div className="mb-10 text-center">
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 shadow-sm">
                        <Sparkles size={14} /> Smart EV Assistant
                    </span>

                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                        SmartCharge <span className="text-blue-600">AI</span>
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                        Plan your route intelligently. We evaluate station distance, expected demand, and charger type to recommend the optimal charging stop.
                    </p>
                </div>

                {/* MAIN SEARCH PANEL */}
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 md:p-8 shadow-xl shadow-slate-900/5">
                    <div className="grid gap-6 md:grid-cols-3">
                        
                        {/* STARTING LOCATION INPUT */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Starting Location *
                                </label>
                            </div>

                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    📍
                                </span>

                                <input
                                    type="text"
                                    value={startLocationText}
                                    onChange={(e) => setStartLocationText(e.target.value)}
                                    placeholder="e.g. Rithala, Delhi"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={locationLoading}
                                className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition hover:text-blue-700 disabled:opacity-50"
                            >
                                {locationLoading ? (
                                    <>
                                        <RefreshCw size={13} className="animate-spin" />
                                        <span>Getting your location...</span>
                                    </>
                                ) : (
                                    <>
                                        <Navigation size={13} />
                                        <span>Use my current location</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* DESTINATION INPUT */}
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                Destination *
                            </label>

                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    🎯
                                </span>

                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleFindStations();
                                    }}
                                    placeholder="e.g. Connaught Place, Delhi"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>
                        </div>

                        {/* BATTERY LEVEL */}
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                                Battery Level (%)
                            </label>

                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    🔋
                                </span>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={battery}
                                    onChange={(e) => setBattery(e.target.value)}
                                    placeholder="78"
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />

                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                    %
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={handleFindStations}
                            disabled={routeLoading || stationsLoading}
                            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {routeLoading || stationsLoading ? (
                                <>
                                    <RefreshCw size={16} className="animate-spin" />
                                    <span>
                                        {routeLoading ? "Planning your route..." : "Finding charging stations..."}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    <span>Find Smart Charging Stations →</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* ROUTE SUMMARY BADGE */}
                    {route && (
                        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 animate-in fade-in">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                        🚗
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Driving Route Found</p>
                                        <p className="text-xs text-slate-600">
                                            Road Distance: <strong>{(route.distance / 1000).toFixed(1)} km</strong> • Drive Time: <strong>{Math.round(route.duration / 60)} min</strong>
                                        </p>
                                    </div>
                                </div>

                                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold text-blue-700">
                                    Route Active
                                </span>
                            </div>
                        </div>
                    )}

                    {/* LEAFLET MAP CONTAINER */}
                    {route && location && destinationLocation && (
                        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
                            <div className="border-b border-slate-100 px-5 py-3 flex items-center justify-between bg-slate-50/50">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                    <span>🗺️</span> Interactive Route & Station Map
                                </p>
                                <span className="text-[11px] text-slate-500">
                                    Click any station marker or card to inspect
                                </span>
                            </div>

                            <div
                                ref={mapContainerRef}
                                style={{
                                    height: "450px",
                                    width: "100%",
                                    position: "relative",
                                    zIndex: 1,
                                    backgroundColor: "#e2e8f0",
                                }}
                            />
                        </div>
                    )}

                    {/* CHARGING STATIONS & RECOMMENDATION SECTION */}
                    {route && (
                        <div className="mt-8">
                            <div className="mb-6 flex items-end justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-cyan-600">
                                        Smart Charging Network
                                    </p>
                                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                        Charging Stations & AI Recommendations
                                    </h2>
                                </div>

                                <p className="text-xs font-semibold text-slate-500">
                                    {stations.length} {stations.length === 1 ? "station" : "stations"} found
                                </p>
                            </div>

                            {/* TOP RECOMMENDATION HIGHLIGHT BANNER */}
                            {!stationsLoading && stations.length > 0 && (
                                <div className="mb-6">
                                    {hasAiRecommendation && recommendedStation ? (
                                        <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-emerald-100/50 p-6 shadow-md">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-2xl text-white shadow-sm">
                                                        ⭐
                                                    </span>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-lg font-extrabold text-emerald-950">
                                                                Recommended Station
                                                            </h3>
                                                            <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                                                                Top Pick
                                                            </span>
                                                        </div>
                                                        <p className="mt-0.5 text-xs text-emerald-800">
                                                            Recommended based on route distance, predicted demand, and charger type.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm border border-emerald-200">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Smart Score</span>
                                                    <span className="text-2xl font-extrabold text-emerald-700">
                                                        {recommendedStation.smartScore}<span className="text-xs text-slate-400 font-semibold">/100</span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* EXPLAINABLE METRICS BREAKDOWN */}
                                            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4 rounded-xl bg-white/90 p-3.5 border border-emerald-100 text-xs">
                                                <div>
                                                    <span className="text-slate-400 font-medium">Station</span>
                                                    <p className="font-bold text-slate-900 truncate">{recommendedStation.name}</p>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 font-medium">Distance</span>
                                                    <p className="font-bold text-slate-900">{(recommendedStation.distanceFromUser || 0).toFixed(1)} km</p>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 font-medium">Predicted Demand</span>
                                                    <p className="font-bold text-emerald-700">
                                                        {recommendedStation.predictedDemand !== undefined ? `${recommendedStation.predictedDemand.toFixed(2)} kWh` : "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 font-medium">Charger Type</span>
                                                    <p className="font-bold text-blue-700">
                                                        {recommendedStation.derivedChargerType === 1 ? "Fast/DC (Weight: 1.0)" : "Slow/AC (Weight: 0.5)"}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="mt-3 text-[11px] font-medium text-emerald-900">
                                                💡 <strong>Explanation:</strong> Best overall balance of route distance, expected demand and charger type.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center text-xs font-semibold text-slate-600">
                                            ℹ️ No AI recommendation available for the current stations.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* LOADING STATE */}
                            {stationsLoading ? (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                                    <p className="text-sm font-semibold text-slate-600">
                                        Finding charging stations & evaluating AI recommendations...
                                    </p>
                                </div>
                            ) : stations.length === 0 ? (
                                
                                /* POLISHED NEUTRAL EMPTY SEARCH RESULT STATE */
                                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-600">
                                        ⚡
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        No charging stations found along this route
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500">
                                        We couldn't find mapped charging stations along your selected route. Charging station coverage depends on available OpenStreetMap data.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRoute(null);
                                            setStations([]);
                                        }}
                                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600"
                                    >
                                        Plan Another Route
                                    </button>
                                </div>

                            ) : (

                                /* STATION CARDS GRID */
                                <>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {scoredStations.slice(0, 9).map((station) => {
                                            const isRecommended = recommendedStation?.id === station.id;
                                            const isSelected = selectedStationId === station.id;

                                            const hasMetadata = Boolean(
                                                station.operator || station.capacity || station.chargerOutput || station.openingHours
                                            );

                                            return (
                                                <div
                                                    key={station.id}
                                                    id={`station-card-${station.id}`}
                                                    onClick={() => handleSelectStation(station)}
                                                    className={`relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                                                        isRecommended
                                                            ? "border-2 border-emerald-500 bg-gradient-to-b from-emerald-50/40 to-white shadow-md ring-2 ring-emerald-500/20"
                                                            : isSelected
                                                            ? "border-2 border-blue-500 bg-blue-50/20 shadow-md ring-2 ring-blue-500/20"
                                                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                                                    }`}
                                                >
                                                    {/* CARD TOP ROW */}
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            {isRecommended && (
                                                                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
                                                                    ⭐ Recommended
                                                                </span>
                                                            )}

                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-bold text-slate-900 text-base">
                                                                    {station.name}
                                                                </h3>
                                                                {!station.hasGenuineName && (
                                                                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">
                                                                        Map data
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 shrink-0">
                                                            {(station.distanceFromUser ?? 0).toFixed(1)} km
                                                        </span>
                                                    </div>

                                                    {/* METADATA FIELDS (ONLY DISPLAYED WHEN GENUINE OSM DATA EXISTS) */}
                                                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                                                        {station.operator && (
                                                            <p>
                                                                <span className="font-semibold text-slate-700">Operator:</span> {station.operator}
                                                            </p>
                                                        )}

                                                        {station.capacity && (
                                                            <p>
                                                                <span className="font-semibold text-slate-700">Capacity:</span> {station.capacity}
                                                            </p>
                                                        )}

                                                        {station.chargerOutput && (
                                                            <p>
                                                                <span className="font-semibold text-slate-700">Output:</span> {station.chargerOutput}
                                                            </p>
                                                        )}

                                                        {station.openingHours && (
                                                            <p>
                                                                <span className="font-semibold text-slate-700">Hours:</span> {station.openingHours}
                                                            </p>
                                                        )}

                                                        {!hasMetadata && (
                                                            <p className="text-[11px] italic text-slate-400">
                                                                Station details are limited in map data.
                                                            </p>
                                                        )}

                                                        {/* CHARGER TYPE & CATEGORY BADGES */}
                                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                                            {station.chargerTypeAvailable && (
                                                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-100">
                                                                    {station.derivedChargerType === 1 ? "Fast (DC)" : "Slow (AC)"}
                                                                </span>
                                                            )}
                                                            {station.locationCategoryAvailable && (
                                                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
                                                                    {station.derivedLocation}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* AI DEMAND PREDICTION SECTION */}
                                                    <div className="mt-4 border-t border-slate-100 pt-3">
                                                        {!station.predictionAvailable ? (
                                                            
                                                            /* SUBTLE SOFT INFORMATIONAL BADGE (NOT HARSH AMBER ALERT) */
                                                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-xs text-slate-500">
                                                                <p className="font-semibold text-slate-700">AI prediction unavailable</p>
                                                                <p className="mt-0.5 text-[11px] text-slate-500">
                                                                    Additional station metadata is missing.
                                                                </p>
                                                            </div>

                                                        ) : (
                                                            <div>
                                                                {(() => {
                                                                    const predState = stationPredictions[station.id];
                                                                    const isLoading = predState?.loading;
                                                                    const result = predState?.result;
                                                                    const error = predState?.error;

                                                                    if (isLoading) {
                                                                        return (
                                                                            <button
                                                                                type="button"
                                                                                disabled
                                                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2 text-xs font-semibold text-slate-500"
                                                                            >
                                                                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                                                                                Analyzing demand...
                                                                            </button>
                                                                        );
                                                                    }

                                                                    if (error) {
                                                                        return (
                                                                            <div className="space-y-1.5">
                                                                                <div className="rounded-xl border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                                                                                    <p className="font-semibold">⚠️ Prediction Error</p>
                                                                                    <p className="mt-0.5 text-[10px]">{error}</p>
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handlePredictStationDemand(station);
                                                                                    }}
                                                                                    className="w-full rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                                                >
                                                                                    Retry Prediction
                                                                                </button>
                                                                            </div>
                                                                        );
                                                                    }

                                                                    if (result !== null && result !== undefined) {
                                                                        return (
                                                                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
                                                                                <div className="flex items-center justify-between">
                                                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                                                                                        Predicted Demand
                                                                                    </p>
                                                                                    <span className="rounded-full bg-emerald-200/60 px-2 py-0.2 text-[9px] font-bold text-emerald-800">
                                                                                        ML Active
                                                                                    </span>
                                                                                </div>
                                                                                <div className="mt-1 flex items-baseline justify-between">
                                                                                    <p className="text-lg font-extrabold text-emerald-950">
                                                                                        {result.toFixed(2)} <span className="text-xs font-semibold text-emerald-700">kWh</span>
                                                                                    </p>
                                                                                    {station.smartScore !== null && (
                                                                                        <p className="text-xs font-extrabold text-emerald-800">
                                                                                            Score: <span className="text-sm font-black">{station.smartScore}</span>/100
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }

                                                                    return (
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handlePredictStationDemand(station);
                                                                            }}
                                                                            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white transition hover:bg-blue-600"
                                                                        >
                                                                            ⚡ Predict AI Demand
                                                                        </button>
                                                                    );
                                                                })()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* SYSTEM DISCLAIMER */}
                                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-3 text-xs text-slate-600 flex items-center gap-2">
                                        <span className="text-sm">ℹ️</span>
                                        <span>
                                            AI-assisted station recommendation based on predicted demand, route distance and charger type.
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default SmartCharge;