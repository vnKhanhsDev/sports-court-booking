import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Carousel.module.css';
import clsx from 'clsx';

interface CarouselProps {
    slides: React.ReactNode[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showIndicators?: boolean;
    showNavigation?: boolean;
    loop?: boolean;
    className?: string;
    onSlideChange?: (index: number) => void;
}

export default function Carousel({
    slides,
    autoPlay = false,
    autoPlayInterval = 5000,
    showIndicators = true,
    showNavigation = true,
    loop = true,
    className = '',
    onSlideChange,
}: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    const totalSlides = slides.length;

    const goToSlide = useCallback((index: number) => {
        if (totalSlides === 0) return;
        
        let newIndex = index;
        if (loop) {
            if (index < 0) newIndex = totalSlides - 1;
            if (index >= totalSlides) newIndex = 0;
        } else {
            newIndex = Math.max(0, Math.min(index, totalSlides - 1));
        }
        
        setCurrentIndex(newIndex);
        onSlideChange?.(newIndex);
    }, [totalSlides, loop, onSlideChange]);

    const goToNext = useCallback(() => {
        goToSlide(currentIndex + 1);
    }, [currentIndex, goToSlide]);

    const goToPrevious = useCallback(() => {
        goToSlide(currentIndex - 1);
    }, [currentIndex, goToSlide]);

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay || isPaused || totalSlides <= 1) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = setInterval(() => {
            goToNext();
        }, autoPlayInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [autoPlay, autoPlayInterval, isPaused, totalSlides, goToNext]);

    // Touch/swipe handlers
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setIsPaused(true);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) {
            setIsPaused(false);
            return;
        }

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }

        setTouchStart(null);
        setTouchEnd(null);
        setIsPaused(false);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };

        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('keydown', handleKeyDown);
            return () => {
                carousel.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [goToNext, goToPrevious]);

    if (totalSlides === 0) {
        return null;
    }

    const canGoPrevious = loop || currentIndex > 0;
    const canGoNext = loop || currentIndex < totalSlides - 1;

    return (
        <div
            ref={carouselRef}
            className={`${styles.carousel} ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            role="region"
            aria-label="Carousel"
            tabIndex={0}
        >
            <div className={styles.slidesContainer}>
                <div
                    className={styles.slidesWrapper}
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={styles.slide}
                            aria-hidden={index !== currentIndex}
                        >
                            {slide}
                        </div>
                    ))}
                </div>
            </div>

            {showNavigation && totalSlides > 1 && (
                <>
                    <button
                        className={`${styles.navButton} ${styles.prevButton}`}
                        onClick={goToPrevious}
                        disabled={!canGoPrevious}
                        aria-label="Previous slide"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button
                        className={`${styles.navButton} ${styles.nextButton}`}
                        onClick={goToNext}
                        disabled={!canGoNext}
                        aria-label="Next slide"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </>
            )}

            {showIndicators && totalSlides > 1 && (
                <div className={styles.indicators} role="tablist" aria-label="Slide indicators">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={clsx(
                                styles.indicator,
                                index === currentIndex ? styles.active : ''
                            )}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-selected={index === currentIndex}
                            role="tab"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}