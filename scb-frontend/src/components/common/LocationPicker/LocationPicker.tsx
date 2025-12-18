import React, { useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  type MapMouseEvent
} from '@vis.gl/react-google-maps';

// Định nghĩa Props: Component này cần gửi toạ độ ra ngoài cho Form cha
interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const API_KEY = 'AIzaSyAoKL9b-tVGar30Z6hVfmVifrOU16Niyag'; // Nên để trong .env: import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLat = 10.762622, // Mặc định: TP.HCM (hoặc set theo user location)
  initialLng = 106.660172
}) => {
  // State lưu vị trí hiện tại của Marker
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng });

  // Xử lý khi người dùng kéo thả marker
  const handleDragEnd = useCallback((e: MapMouseEvent) => {
    if (e.detail.latLng) {
      const { lat, lng } = e.detail.latLng;
      
      setPosition({ lat, lng });
      onLocationSelect(lat, lng);
    }
  }, [onLocationSelect]);

  // Xử lý khi người dùng click vào bản đồ
  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (e.detail.latLng) {
      const { lat, lng } = e.detail.latLng;
      
      setPosition({ lat, lng });
      onLocationSelect(lat, lng);
    }
  }, [onLocationSelect]);

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <APIProvider apiKey={API_KEY} onLoad={() => console.log('Map API has loaded.')}>
        <Map
          defaultCenter={position}
          defaultZoom={13}
          mapId="DEMO_MAP_ID" // Bạn cần tạo Map ID trên Google Console để dùng AdvancedMarker, hoặc dùng null nếu dùng Marker thường
          onClick={handleMapClick}
          gestureHandling={'greedy'} // Cho phép scroll chuột để zoom dễ dàng
          disableDefaultUI={false} // Giữ lại nút zoom, map type
        >
          {/* Marker có thể kéo thả được (draggable) */}
          <AdvancedMarker
            position={position}
            draggable={true}
            onDragEnd={handleDragEnd}
          >
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        </Map>
      </APIProvider>
      
      {/* Hiển thị toạ độ cho user thấy (Optional) */}
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        Đã chọn: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
      </div>
    </div>
  );
};

export default LocationPicker;