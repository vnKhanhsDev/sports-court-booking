import HomeBanner from './banner/HomeBanner';
import PublicCourtCard, { type Court } from '@/components/common/card/court/PublicCourtCard';
import HorizontalCardList from '@/components/common/HorizontalCardList/HorizontalCardList';

const sampleSoccerCourts: Court[] = [
    {
        id: 1,
        facilityName: 'Sân bóng Phoenix',
        sportType: 'Bóng đá',
        surfaceType: 'Cỏ nhân tạo',
        name: 'Sân 7A',
        priceFrom: '100.000',
        image: 'https://atsport.vn/wp-content/uploads/2021/08/kich-thuoc-san-bong-da-7-nguoi-co-nhan-tao-1-1-960x960-960x960-960x960.jpg',
        address: 'Quận Cầu Giấy, Hà Nội',
    },
    {
        id: 2,
        facilityName: 'Sân bóng Riverside',
        sportType: 'Bóng đá',
        surfaceType: 'Cỏ nhân tạo',
        name: 'Sân 5B',
        priceFrom: '120.000',
        image: 'https://atsport.vn/wp-content/uploads/2021/08/kich-thuoc-san-bong-da-7-nguoi-co-nhan-tao-1-1-960x960-960x960-960x960.jpg',
        address: 'Quận Nam Từ Liêm, Hà Nội',
    },
    {
        id: 3,
        facilityName: 'Sân bóng City Park',
        sportType: 'Bóng đá',
        surfaceType: 'Cỏ nhân tạo',
        name: 'Sân 7B',
        priceFrom: '150.000',
        image: 'https://atsport.vn/wp-content/uploads/2021/08/kich-thuoc-san-bong-da-7-nguoi-co-nhan-tao-1-1-960x960-960x960-960x960.jpg',
        address: 'Quận Hoàng Mai, Hà Nội',
    },
    {
        id: 4,
        facilityName: 'Sân bóng Green Field',
        sportType: 'Bóng đá',
        surfaceType: 'Cỏ nhân tạo',
        name: 'Sân 11A',
        priceFrom: '200.000',
        image: 'https://atsport.vn/wp-content/uploads/2021/08/kich-thuoc-san-bong-da-7-nguoi-co-nhan-tao-1-1-960x960-960x960-960x960.jpg',
        address: 'Quận Long Biên, Hà Nội',
    },
    {
        id: 5,
        facilityName: 'Sân bóng Star Sport',
        sportType: 'Bóng đá',
        surfaceType: 'Cỏ nhân tạo',
        name: 'Sân 5A',
        priceFrom: '90.000',
        image: 'https://atsport.vn/wp-content/uploads/2021/08/kich-thuoc-san-bong-da-7-nguoi-co-nhan-tao-1-1-960x960-960x960-960x960.jpg',
        address: 'Quận Hà Đông, Hà Nội',
    },
];

const HomePage = () => {
    return (
        <>
            <HomeBanner />

            <div className="bg-gray-100">
                <div className="container mx-auto max-w-[1200px] py-6">
                    <HorizontalCardList
                        title="Sân bóng đá"
                        viewAllLink="/courts"
                        items={sampleSoccerCourts}
                        renderItem={(court: Court) => <PublicCourtCard court={court} />}
                    />
                </div>
            </div>
        </>
    );
};

export default HomePage;