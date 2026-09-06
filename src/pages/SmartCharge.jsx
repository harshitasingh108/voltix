import { useEffect, useState, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* =====================================================
   CUSTOM LEAFLET MARKER ICONS
===================================================== */

const createCustomIcon = (emoji, bgColor = "#2563eb") => {
    return L.divIcon({
        className: "custom-leaflet-marker",
        html: `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                background-color: ${bgColor};
                border: 2px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                font-size: 18px;
                cursor: pointer;
            ">
                ${emoji}
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
    });
};

const userIcon = createCustomIcon("📍", "#2563eb");
const destinationIcon = createCustomIcon("🎯", "#dc2626");
const stationIcon = createCustomIcon("🔌", "#0891b2");

/* =====================================================
   HAVERSINE DISTANCE
===================================================== */

const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
) => {
    const R = 6371;

    const dLat =
        ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
        ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
        Math.cos(
            (lat1 * Math.PI) / 180
        ) *
        Math.cos(
            (lat2 * Math.PI) / 180
        ) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
};

/* =====================================================
   SMART CHARGE COMPONENT
===================================================== */

const SmartCharge = () => {
    /* -------------------------------------------------
       LOCATION
    ------------------------------------------------- */

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

    const [battery, setBattery] = useState("");

    /* -------------------------------------------------
       ROUTE
    ------------------------------------------------- */

    const [route, setRoute] = useState(null);
    const [routeLoading, setRouteLoading] = useState(false);

    /* -------------------------------------------------
       STATIONS
    ------------------------------------------------- */

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

    console.log("SMARTCHARGE RENDER", {
        route,
        location,
        destinationLocation,
        routeCoordinatesLength: routeCoordinates.length,
        stationsCount: stations.length
    });

    /* =================================================
       CURRENT LOCATION
    ================================================= */

    const getCurrentLocation = () => {
        setLocationLoading(true);

        setLocation(null);
        setRoute(null);
        setStations([]);

        if (!navigator.geolocation) {
            alert(
                "Geolocation is not supported by your browser."
            );
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                console.log(
                    "Current Location:",
                    latitude,
                    longitude
                );

                console.log(
                    "Accuracy:",
                    accuracy,
                    "meters"
                );

                setLocation({
                    latitude,
                    longitude,
                    accuracy,
                });

                setLocationLoading(false);
            },
            (error) => {
                console.error(
                    "Location Error:",
                    error
                );

                if (error.code === 1) {
                    alert(
                        "Location permission denied. Please allow location access."
                    );
                } else if (error.code === 2) {
                    alert(
                        "Unable to determine your location."
                    );
                } else if (error.code === 3) {
                    alert(
                        "Location request timed out. Please try again."
                    );
                } else {
                    alert(
                        "Unable to get your location."
                    );
                }

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
       SEARCH DESTINATION
    ================================================= */

    const searchDestination = async () => {
        if (!destination.trim()) {
            alert(
                "Please enter a destination."
            );
            return;
        }

        setDestinationLoading(true);
        setDestinationLocation(null);
        setRoute(null);
        setStations([]);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    destination
                )}&limit=5&addressdetails=1`
            );

            if (!response.ok) {
                throw new Error(
                    "Destination search failed"
                );
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                alert(
                    "Destination not found. Try another location."
                );
                setDestinationLoading(false);
                return;
            }

            const result = data[0];
            const latitude = Number(result.lat);
            const longitude = Number(result.lon);

            if (
                Number.isNaN(latitude) ||
                Number.isNaN(longitude)
            ) {
                throw new Error(
                    "Invalid destination coordinates"
                );
            }

            console.log(
                "Destination:",
                result
            );

            setDestinationLocation({
                latitude,
                longitude,
                displayName: result.display_name,
            });
        } catch (error) {
            console.error(error);

            alert(
                "Something went wrong while finding the destination."
            );
        }

        setDestinationLoading(false);
    };

    /* =================================================
       GET ROUTE
    ================================================= */

    const getRoute = async () => {
        if (!location) {
            alert(
                "Please detect your current location first."
            );
            return null;
        }

        if (!destinationLocation) {
            alert(
                "Please search your destination first."
            );
            return null;
        }

        setRouteLoading(true);
        setRoute(null);
        setStations([]);

        try {
            const url =
                `https://router.project-osrm.org/route/v1/driving/` +
                `${location.longitude},${location.latitude};` +
                `${destinationLocation.longitude},${destinationLocation.latitude}` +
                `?overview=full&geometries=geojson`;

            console.log(
                "OSRM URL:",
                url
            );

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    "Route request failed"
                );
            }

            const data = await response.json();

            console.log(
                "OSRM Response:",
                data
            );

            if (
                data.code !== "Ok" ||
                !data.routes ||
                data.routes.length === 0
            ) {
                alert(
                    "No driving route could be found."
                );
                setRouteLoading(false);
                return null;
            }

            const selectedRoute = data.routes[0];

            console.log(
                "Route Geometry:",
                selectedRoute.geometry
            );

            const newRoute = {
                distance: selectedRoute.distance,
                duration: selectedRoute.duration,
                geometry: selectedRoute.geometry,
            };

            setRoute(newRoute);
            setRouteLoading(false);

            return newRoute;
        } catch (error) {
            console.error(error);

            alert(
                "Something went wrong while finding the route."
            );

            setRouteLoading(false);
            return null;
        }
    };

    /* =================================================
       FIND CHARGING STATIONS
    ================================================= */

    const findChargingStations = async (routeData) => {
        if (!routeData?.geometry?.coordinates?.length) {
            console.log(
                "No route geometry available for stations."
            );
            return;
        }

        if (!location) {
            return;
        }

        setStationsLoading(true);
        setStations([]);

        try {
            const coordinates = routeData.geometry.coordinates;

            const longitudes = coordinates.map(([longitude]) => longitude);
            const latitudes = coordinates.map(([, latitude]) => latitude);

            const minLongitude = Math.min(...longitudes) - 0.02;
            const maxLongitude = Math.max(...longitudes) + 0.02;
            const minLatitude = Math.min(...latitudes) - 0.02;
            const maxLatitude = Math.max(...latitudes) + 0.02;

            const query = `
                [out:json][timeout:25];

                (
                    nwr["amenity"="charging_station"]
                    (${minLatitude},${minLongitude},${maxLatitude},${maxLongitude});
                );

                out center tags;
            `;

            const response = await fetch(
                "https://overpass-api.de/api/interpreter",
                {
                    method: "POST",
                    body: "data=" + encodeURIComponent(query),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Charging station request failed"
                );
            }

            const data = await response.json();

            const stationList = (data.elements || [])
                .map((element) => {
                    const latitude = element.lat ?? element.center?.lat;
                    const longitude = element.lon ?? element.center?.lon;

                    if (latitude === undefined || longitude === undefined) {
                        return null;
                    }

                    const tags = element.tags || {};

                    const distanceFromUser = calculateDistance(
                        location.latitude,
                        location.longitude,
                        latitude,
                        longitude
                    );

                    return {
                        id: `${element.type}-${element.id}`,
                        name: tags.name || tags.operator || "EV Charging Station",
                        operator: tags.operator || "Unknown operator",
                        latitude,
                        longitude,
                        capacity: tags.capacity || "Not available",
                        chargerOutput: tags["charging_station:output"] || "Not available",
                        openingHours: tags.opening_hours || "Not available",
                        distanceFromUser,
                    };
                })
                .filter(Boolean);

            const uniqueStations = Array.from(
                new Map(
                    stationList.map((station) => [station.id, station])
                ).values()
            );

            uniqueStations.sort(
                (a, b) => a.distanceFromUser - b.distanceFromUser
            );

            console.log(
                "Charging Stations:",
                uniqueStations
            );

            setStations(uniqueStations);
        } catch (error) {
            console.error("Overpass API Error:", error);
            // Do not block map rendering if station search fails
        }

        setStationsLoading(false);
    };

    /* =================================================
       FIND SMART CHARGING STATIONS HANDLER
    ================================================= */

    const handleFindStations = async () => {
        if (!location) {
            alert(
                "Please detect your current location first."
            );
            return;
        }

        if (!destinationLocation) {
            alert(
                "Please search your destination first."
            );
            return;
        }

        if (
            battery === "" ||
            Number(battery) < 0 ||
            Number(battery) > 100
        ) {
            alert(
                "Please enter a battery level between 0 and 100."
            );
            return;
        }

        const routeData = await getRoute();

        if (routeData) {
            await findChargingStations(routeData);
        }
    };

    /* =================================================
       LEAFLET MAP EFFECT
    ================================================= */

    useEffect(() => {
        console.log("MAP EFFECT RUNNING", {
            route,
            location,
            destinationLocation,
            routeCoordinatesLength: routeCoordinates.length,
            hasContainer: !!mapContainerRef.current,
            stationsCount: stations.length
        });

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

        if (!mapContainerRef.current) {
            console.log("MAP CONTAINER IS NULL");
            return;
        }

        console.log("MAP CONTAINER ELEMENT:", mapContainerRef.current);

        try {
            if (!mapRef.current) {
                // Clear existing _leaflet_id if present to prevent map container already initialized crash
                if (mapContainerRef.current._leaflet_id) {
                    mapContainerRef.current._leaflet_id = null;
                }

                console.log("Initializing map...");
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
                console.log("Map initialized successfully");
            }

            const map = mapRef.current;
            const layerGroup = layerGroupRef.current;

            if (layerGroup) {
                layerGroup.clearLayers();

                // 1. Current Location Marker
                if (location.latitude && location.longitude) {
                    const userMarker = L.marker(
                        [location.latitude, location.longitude],
                        { icon: userIcon }
                    ).bindPopup(`
                        <div style="font-family: sans-serif; padding: 2px;">
                            <p style="font-weight: 700; color: #0f172a; margin: 0 0 4px 0; font-size: 14px;">📍 Current Location</p>
                            <p style="color: #64748b; margin: 0; font-size: 12px;">Your detected location</p>
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
                        <div style="font-family: sans-serif; padding: 2px; max-width: 220px;">
                            <p style="font-weight: 700; color: #0f172a; margin: 0 0 4px 0; font-size: 14px;">🎯 Destination</p>
                            <p style="color: #64748b; margin: 0; font-size: 12px;">${destinationLocation.displayName || ""}</p>
                        </div>
                    `);
                    layerGroup.addLayer(destMarker);
                }

                // 3. Polyline Route
                if (routeCoordinates.length > 0) {
                    const polyline = L.polyline(routeCoordinates, {
                        color: "#2563eb",
                        weight: 6,
                        opacity: 0.85,
                        lineCap: "round",
                        lineJoin: "round",
                    });
                    layerGroup.addLayer(polyline);
                }

                // 4. Charging Station Markers
                console.log("Number of stations:", stations.length);
                stations.forEach((station) => {
                    if (station.latitude && station.longitude) {
                        const distText = typeof station.distanceFromUser === "number"
                            ? station.distanceFromUser.toFixed(1)
                            : "N/A";
                        const stationMarker = L.marker(
                            [station.latitude, station.longitude],
                            { icon: stationIcon }
                        ).bindPopup(`
                            <div style="font-family: sans-serif; padding: 2px; min-width: 180px;">
                                <p style="font-weight: 700; color: #0f172a; margin: 0 0 6px 0; font-size: 13px;">🔌 ${station.name || "Station"}</p>
                                <div style="font-size: 12px; color: #475569; line-height: 1.5;">
                                    <p style="margin: 2px 0;"><strong>Operator:</strong> ${station.operator || "Unknown"}</p>
                                    <p style="margin: 2px 0;"><strong>Distance:</strong> ${distText} km</p>
                                    <p style="margin: 2px 0;"><strong>Capacity:</strong> ${station.capacity || "N/A"}</p>
                                    <p style="margin: 2px 0;"><strong>Output:</strong> ${station.chargerOutput || "N/A"}</p>
                                    <p style="margin: 2px 0;"><strong>Hours:</strong> ${station.openingHours || "N/A"}</p>
                                </div>
                            </div>
                        `);
                        layerGroup.addLayer(stationMarker);
                    }
                });

                // 5. Fit Map Bounds
                const boundsPoints = [];
                if (location.latitude && location.longitude) {
                    boundsPoints.push([location.latitude, location.longitude]);
                }
                if (destinationLocation.latitude && destinationLocation.longitude) {
                    boundsPoints.push([destinationLocation.latitude, destinationLocation.longitude]);
                }
                if (routeCoordinates.length > 0) {
                    boundsPoints.push(...routeCoordinates);
                }

                if (boundsPoints.length > 0) {
                    const bounds = L.latLngBounds(boundsPoints);
                    map.fitBounds(bounds, { padding: [40, 40] });
                }

                // 6. Invalidate size after layout/render
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
            console.error("FATAL MAP ERROR INSIDE EFFECT:", error);
        }
    }, [route, location, destinationLocation, stations, routeCoordinates]);

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
       RENDER
    ================================================= */

    return (
        <main className="min-h-screen bg-slate-50 pt-28">

            {/* VERSION TEST MARKER ON TOP LEFT */}
            <div
                style={{
                    position: "fixed",
                    top: 100,
                    left: 10,
                    zIndex: 99999,
                    background: "red",
                    color: "white",
                    padding: "16px 24px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                }}
            >
                SMARTCHARGE COMPONENT VERSION TEST
            </div>

            <section className="mx-auto max-w-7xl px-6 py-16">
                {/* PAGE HEADER */}

                <div className="mb-10 text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
                        Smart EV Assistant
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                        SmartCharge
                        <span className="text-blue-600">
                            AI
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
                        Tell us where you're going and
                        we'll help you find charging
                        stations that fit your journey.
                    </p>
                </div>

                {/* MAIN CARD */}

                <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* CURRENT LOCATION */}

                        <div>
                            <label className="mb-3 block text-sm font-semibold text-slate-900">
                                Current Location
                            </label>

                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={locationLoading}
                                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${location
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                                    }`}
                            >
                                <span className="text-lg">
                                    {location ? "✓" : "📍"}
                                </span>

                                <span className="text-sm font-medium">
                                    {locationLoading
                                        ? "Detecting location..."
                                        : location
                                            ? "Location detected"
                                            : "Detect my location"}
                                </span>
                            </button>

                            {location && (
                                <div className="mt-3 space-y-1 text-xs text-slate-500">
                                    <p>
                                        Lat:{" "}
                                        {location.latitude.toFixed(5)}
                                    </p>
                                    <p>
                                        Lon:{" "}
                                        {location.longitude.toFixed(5)}
                                    </p>
                                    {location.accuracy && (
                                        <p>
                                            Accuracy:{" "}
                                            {Math.round(location.accuracy)}{" "}
                                            meters
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* DESTINATION */}

                        <div>
                            <label className="mb-3 block text-sm font-semibold text-slate-900">
                                Destination
                            </label>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) =>
                                        setDestination(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            searchDestination();
                                        }
                                    }}
                                    placeholder="e.g. Rithala, Delhi"
                                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />

                                <button
                                    type="button"
                                    onClick={searchDestination}
                                    disabled={destinationLoading}
                                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {destinationLoading ? "..." : "Search"}
                                </button>
                            </div>

                            {destinationLocation && (
                                <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3 text-xs text-emerald-700">
                                    <p className="mb-1 font-semibold">
                                        ✓ Destination found
                                    </p>
                                    <p>{destinationLocation.displayName}</p>
                                </div>
                            )}
                        </div>

                        {/* BATTERY */}

                        <div>
                            <label className="mb-3 block text-sm font-semibold text-slate-900">
                                Battery Level
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                    🔋
                                </span>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={battery}
                                    onChange={(e) =>
                                        setBattery(e.target.value)
                                    }
                                    placeholder="78"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-10 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />

                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                                    %
                                </span>
                            </div>

                            {battery !== "" && (
                                <div className="mt-3">
                                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        Number(battery)
                                                    )
                                                )}%`,
                                            }}
                                        />
                                    </div>

                                    <p className="mt-1 text-right text-xs text-slate-400">
                                        {battery}% battery
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* BUTTON */}

                    <div className="mt-10 flex justify-end">
                        <button
                            type="button"
                            onClick={handleFindStations}
                            disabled={routeLoading || stationsLoading}
                            className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {routeLoading
                                ? "Finding Route..."
                                : stationsLoading
                                    ? "Finding Charging Stations..."
                                    : "Find Smart Charging Stations →"}
                        </button>
                    </div>

                    {/* ROUTE RESULT */}

                    {route && (
                        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                        Your Route
                                    </p>

                                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                                        Route Found ✓
                                    </h2>
                                </div>

                                <span className="text-2xl">
                                    🚗
                                </span>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-xl bg-white p-4">
                                    <p className="text-xs text-slate-500">
                                        Road Distance
                                    </p>

                                    <p className="mt-1 text-xl font-bold text-slate-900">
                                        {route.distance ? (route.distance / 1000).toFixed(1) : "0.0"} km
                                    </p>
                                </div>

                                <div className="rounded-xl bg-white p-4">
                                    <p className="text-xs text-slate-500">
                                        Estimated Drive Time
                                    </p>

                                    <p className="mt-1 text-xl font-bold text-slate-900">
                                        {route.duration ? Math.round(route.duration / 60) : 0} min
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ROUTE SECTION CONTINUATION MARKER (TEST STEP 7) */}
                    {route && (
                        <div
                            style={{
                                background: "red",
                                color: "white",
                                padding: "30px",
                                marginTop: "30px",
                                borderRadius: "16px",
                                fontWeight: "bold",
                                fontSize: "20px"
                            }}
                        >
                            ROUTE SECTION CONTINUES HERE - MAP & STATIONS BELOW
                        </div>
                    )}

                    {/* =================================================
                        MAP
                    ================================================= */}

                    {route && location && destinationLocation && (
                        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                            {/* MAP HEADER */}

                            <div className="border-b border-slate-100 px-5 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                            Live Route Map
                                        </p>

                                        <h3 className="mt-1 text-lg font-bold text-slate-900">
                                            Your Journey
                                        </h3>
                                    </div>

                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                                        Route Ready
                                    </span>
                                </div>
                            </div>

                            {/* LEAFLET MAP CONTAINER */}

                            <div
                                ref={mapContainerRef}
                                style={{
                                    height: "500px",
                                    width: "100%",
                                    position: "relative",
                                    zIndex: 1,
                                    backgroundColor: "#e2e8f0",
                                }}
                            />
                        </div>
                    )}

                    {/* =================================================
                        CHARGING STATIONS
                    ================================================= */}

                    {route && (
                        <div className="mt-8">
                            <div className="mb-5 flex items-end justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-cyan-500">
                                        Charging Network
                                    </p>

                                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                        Charging Stations
                                    </h2>
                                </div>

                                <p className="text-sm text-slate-500">
                                    {stations.length} stations found
                                </p>
                            </div>

                            {stationsLoading ? (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                                    <p className="text-sm text-slate-500">
                                        Finding charging stations...
                                    </p>
                                </div>
                            ) : stations.length === 0 ? (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                                    <div className="mb-2 text-3xl">🔌</div>

                                    <p className="font-semibold text-slate-700">
                                        No charging stations found
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Try another route.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {stations.slice(0, 6).map((station) => (
                                        <div
                                            key={station.id}
                                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="mb-2 inline-flex rounded-lg bg-cyan-50 p-2 text-lg">
                                                        🔌
                                                    </div>

                                                    <h3 className="font-bold text-slate-900">
                                                        {station.name}
                                                    </h3>
                                                </div>

                                                <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                                                    {(station.distanceFromUser ?? 0).toFixed(1)} km
                                                </span>
                                            </div>

                                            <div className="mt-4 space-y-2 text-sm text-slate-500">
                                                <p>
                                                    <span className="font-medium text-slate-700">
                                                        Operator:
                                                    </span>{" "}
                                                    {station.operator}
                                                </p>

                                                <p>
                                                    <span className="font-medium text-slate-700">
                                                        Capacity:
                                                    </span>{" "}
                                                    {station.capacity}
                                                </p>

                                                <p>
                                                    <span className="font-medium text-slate-700">
                                                        Output:
                                                    </span>{" "}
                                                    {station.chargerOutput}
                                                </p>

                                                <p>
                                                    <span className="font-medium text-slate-700">
                                                        Hours:
                                                    </span>{" "}
                                                    {station.openingHours}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default SmartCharge;