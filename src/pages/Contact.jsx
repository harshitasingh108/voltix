import { useState } from "react";

const SmartCharge = () => {
    // Current location
    const [location, setLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);

    // Destination
    const [destination, setDestination] = useState("");
    const [destinationLocation, setDestinationLocation] = useState(null);
    const [destinationLoading, setDestinationLoading] = useState(false);

    // Battery
    const [battery, setBattery] = useState("");

    // Route
    const [route, setRoute] = useState(null);
    const [routeLoading, setRouteLoading] = useState(false);

    // Get current location
    const getCurrentLocation = () => {
        setLocationLoading(true);

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setLocation({
                    latitude,
                    longitude,
                });

                setLocationLoading(false);
            },
            (error) => {
                console.log(error);

                alert(
                    "Unable to get your location. Please allow location access."
                );

                setLocationLoading(false);
            }
        );
    };

    // Search destination
    const searchDestination = async () => {
        if (!destination.trim()) {
            alert("Please enter a destination.");
            return;
        }

        setDestinationLoading(true);
        setDestinationLocation(null);
        setRoute(null);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    destination
                )}&limit=1`
            );

            if (!response.ok) {
                throw new Error("Failed to find destination");
            }

            const data = await response.json();

            if (data.length === 0) {
                alert("Destination not found. Try another name.");
                setDestinationLoading(false);
                return;
            }

            const result = data[0];

            setDestinationLocation({
                latitude: Number(result.lat),
                longitude: Number(result.lon),
                displayName: result.display_name,
            });
        } catch (error) {
            console.error(error);
            alert("Something went wrong while finding the destination.");
        }

        setDestinationLoading(false);
    };

    // Get road route
    const getRoute = async () => {
        if (!location) {
            alert("Please allow your current location first.");
            return;
        }

        if (!destinationLocation) {
            alert("Please search your destination first.");
            return;
        }

        setRouteLoading(true);
        setRoute(null);

        try {
            const startLongitude = location.longitude;
            const startLatitude = location.latitude;

            const destinationLongitude = destinationLocation.longitude;
            const destinationLatitude = destinationLocation.latitude;

            const url =
                `https://router.project-osrm.org/route/v1/driving/` +
                `${startLongitude},${startLatitude};` +
                `${destinationLongitude},${destinationLatitude}` +
                `?overview=full&geometries=geojson`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to calculate route");
            }

            const data = await response.json();

            if (data.code !== "Ok" || !data.routes.length) {
                alert("No route could be found.");
                setRouteLoading(false);
                return;
            }

            const selectedRoute = data.routes[0];

            setRoute({
                distance: selectedRoute.distance,
                duration: selectedRoute.duration,
                geometry: selectedRoute.geometry,
            });

            console.log("Route:", selectedRoute);
        } catch (error) {
            console.error(error);
            alert("Something went wrong while finding the route.");
        }

        setRouteLoading(false);
    };

    // Find stations
    const handleFindStations = async () => {
        if (!location) {
            alert("Please allow your current location first.");
            return;
        }

        if (!destinationLocation) {
            alert("Please search and select your destination first.");
            return;
        }

        if (battery === "") {
            alert("Please enter your battery level.");
            return;
        }

        await getRoute();
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-28">
            <section className="mx-auto max-w-7xl px-6 py-16">

                {/* Heading */}
                <div className="max-w-3xl">
                    <p className="font-semibold uppercase tracking-[0.25em] text-blue-600">
                        Smart EV Charging
                    </p>

                    <h1 className="mt-4 text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
                        Find Your
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            {" "}Smart Charging Stop
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                        Tell us where you're going and we'll help you find
                        charging stations that fit your journey.
                    </p>
                </div>

                {/* Main Card */}
                <div className="mt-14 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">

                    <div className="grid gap-6 md:grid-cols-3">

                        {/* Current Location */}
                        <div>
                            <label className="text-sm font-semibold text-slate-800">
                                Current Location
                            </label>

                            <button
                                onClick={getCurrentLocation}
                                className={`mt-3 flex min-h-[58px] w-full items-center gap-3 rounded-2xl border px-5 text-left transition-all duration-300 ${location
                                        ? "border-green-200 bg-green-50 text-green-700"
                                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-400 hover:bg-blue-50"
                                    }`}
                            >
                                <span className="text-xl">
                                    {location ? "✓" : "📍"}
                                </span>

                                <span className="font-medium">
                                    {locationLoading
                                        ? "Detecting location..."
                                        : location
                                            ? "Location detected"
                                            : "Use My Current Location"}
                                </span>
                            </button>

                            {location && (
                                <p className="mt-3 text-xs leading-5 text-slate-500">
                                    Lat: {location.latitude.toFixed(5)}
                                    <br />
                                    Lon: {location.longitude.toFixed(5)}
                                </p>
                            )}
                        </div>

                        {/* Destination */}
                        <div>
                            <label className="text-sm font-semibold text-slate-800">
                                Destination
                            </label>

                            <div className="mt-3 flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg">
                                        🎯
                                    </span>

                                    <input
                                        type="text"
                                        value={destination}
                                        onChange={(e) => {
                                            setDestination(e.target.value);
                                            setDestinationLocation(null);
                                            setRoute(null);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                searchDestination();
                                            }
                                        }}
                                        placeholder="e.g. Janakpuri"
                                        className="min-h-[58px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>

                                <button
                                    onClick={searchDestination}
                                    disabled={destinationLoading}
                                    className="min-h-[58px] rounded-2xl bg-slate-900 px-5 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {destinationLoading
                                        ? "..."
                                        : "Search"}
                                </button>
                            </div>

                            {destinationLocation && (
                                <div className="mt-3 rounded-xl bg-green-50 p-3 text-xs text-green-700">
                                    <p className="font-semibold">
                                        ✓ Destination found
                                    </p>

                                    <p className="mt-1">
                                        {destinationLocation.displayName}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Battery */}
                        <div>
                            <label className="text-sm font-semibold text-slate-800">
                                Battery Level
                            </label>

                            <div className="relative mt-3">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg">
                                    🔋
                                </span>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={battery}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        if (
                                            value === "" ||
                                            (Number(value) >= 0 &&
                                                Number(value) <= 100)
                                        ) {
                                            setBattery(value);
                                        }
                                    }}
                                    placeholder="Enter battery level"
                                    className="min-h-[58px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-16 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />

                                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
                                    %
                                </span>
                            </div>

                            {battery !== "" && (
                                <div className="mt-3">
                                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
                                            style={{
                                                width: `${battery}%`,
                                            }}
                                        />
                                    </div>

                                    <p className="mt-1 text-right text-xs font-medium text-slate-500">
                                        {battery}% battery
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Find Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleFindStations}
                            disabled={routeLoading}
                            className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {routeLoading
                                ? "Finding Route..."
                                : "Find Smart Charging Stations"}

                            {!routeLoading && (
                                <span className="ml-2">→</span>
                            )}
                        </button>
                    </div>

                    {/* Route Result */}
                    {route && (
                        <div className="mt-10 rounded-3xl border border-blue-100 bg-blue-50 p-6">

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                        Your Route
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                        Route Found ✓
                                    </h2>
                                </div>

                                <div className="text-3xl">
                                    🚗
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">

                                <div className="rounded-2xl bg-white p-5">
                                    <p className="text-sm text-slate-500">
                                        Road Distance
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-slate-900">
                                        {(route.distance / 1000).toFixed(1)} km
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white p-5">
                                    <p className="text-sm text-slate-500">
                                        Estimated Drive Time
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-slate-900">
                                        {Math.round(route.duration / 60)} min
                                    </p>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </section>
        </main>
    );
};

export default SmartCharge;