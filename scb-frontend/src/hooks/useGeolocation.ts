import { useEffect, useState } from 'react';

interface UserLocation {
    lat: number;
    lng: number;
};

export function useGeolocation() {
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
                setLoading(false);
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) setError('User denied the request for Geolocation.');
                else if (error.code === error.POSITION_UNAVAILABLE) setError('Location information is unavailable.');
                else if (error.code === error.TIMEOUT) setError('The request to get user location timed out.');
                else setError('An unknown error occurred.');
                
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    }, []);

    return { location, loading, error };
};