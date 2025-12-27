import AdvertisementBanner from '../components/home/AdvertisementBanner';
import NearbyCourts from '../components/home/NearbyCourts';
import FeaturedCourts from '../components/home/FeaturedCourts';

export default function HomePage() {
    return (
        <div>
            <AdvertisementBanner />
            <NearbyCourts />
            <FeaturedCourts />
        </div>
    );
}