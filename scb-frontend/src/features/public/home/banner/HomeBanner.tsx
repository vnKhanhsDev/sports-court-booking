import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomeBanner.module.css';
import { AboutUs, ColorCourt, Community, Competition, FindTeam, Support } from '@/components/ui/icons';

interface CarouselSlide {
    id: number;
    image: string;
    title?: string;
    link?: string;
}

interface QuickLink {
    id: number;
    title: string;
    icon: React.ReactNode;
    link: string;
}

const HomeBanner = () => {
    // Carousel slides data
    const carouselSlides: CarouselSlide[] = [
        {
            id: 1,
            image: 'https://www.versacourt.com/cmss_files/imagelibrary/indoor-multisport.jpg',
            link: '/courts'
        },
        {
            id: 2,
            image: 'https://sportsmark.net/wp-content/uploads/2023/03/How-To-Set-Up-A-Badminton-Court-1182x591.jpg',
            link: '/promotions'
        },
        {
            id: 3,
            image: 'https://oct.vn/wp-content/uploads/2019/07/san-bong-co-nhan-tao-scaled.jpg',
            link: '/facilities'
        }
    ];

    // Promotional images data
    const promotionalImages: CarouselSlide[] = [
        { id: 1, image: '', link: '/promotions' },
        { id: 2, image: '', link: '/events' },
    ];

    const quickLinks: QuickLink[] = [
        { id: 1, title: 'Sân thể thao', icon: <ColorCourt />, link: '/courts' },
        { id: 2, title: 'Tìm bạn chơi', icon: <FindTeam />, link: '/courts' },
        { id: 3, title: 'Giải đấu', icon: <Competition />, link: '/courts' },
        { id: 4, title: 'Cộng đồng', icon: <Community />, link: '/courts' },
        { id: 5, title: 'Về chúng tôi', icon: <AboutUs />, link: '/courts' },
        { id: 6, title: 'Hỗ trợ', icon: <Support />, link: '/promotions' }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-rotate carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [carouselSlides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <div className='container mx-auto max-w-[1200px] py-8'>
            <div className={styles.homeBanner}>
                <section className={`${styles.bannerSection} flex gap-2`}>
                    <div className={styles.carouselContainer}>
                        <div className={styles.carouselWrapper}>
                            {carouselSlides.map((slide, index) => (
                                <Link
                                    key={slide.id}
                                    to={slide.link || '#'}
                                    className={`${styles.carouselSlide} ${index === currentSlide ? styles.active : ''}`}
                                >
                                    <img
                                        src={slide.image}
                                        alt={`Slide ${slide.id}`}
                                        className={styles.carouselImage}
                                    />
                                </Link>
                            ))}
                        </div>
                        {/* Carousel indicators */}
                        <div className={styles.carouselIndicators}>
                            {carouselSlides.map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className='flex flex-1 flex-col gap-2'>
                        {promotionalImages.map((promo) => (
                            <Link key={promo.id} to={promo.link || '#'} className={styles.promotionalImage}>
                                <img src={promo.image} alt={`Promotion ${promo.id}`} className={styles.promoImage} />
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Quick Links Section */}
                <div className={styles.quickLinks}>
                    {quickLinks.map((link) => (
                        <Link key={link.id} to={link.link} className={styles.quickLink}>
                            <div className={styles.quickLinkIcon}>{link.icon}</div>
                            <span className={styles.quickLinkTitle}>{link.title}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeBanner;