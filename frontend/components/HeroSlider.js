import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import api from '../utils/api';

export default function HeroSlider() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const { data } = await api.get('/slides');
                if (data.success) {
                    setSlides(data.slides);
                }
            } catch (error) {
                console.error('Error fetching slides:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[500px] bg-gray-100 animate-pulse flex items-center justify-center">
                <span className="text-gray-400">Loading slides...</span>
            </div>
        );
    }

    if (slides.length === 0) return null;

    return (
        <div className="hero-slider-container">
            <div className="w-full overflow-hidden">
                <Swiper
                    spaceBetween={0}
                    centeredSlides={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    effect={'fade'}
                    modules={[Autoplay, Pagination, Navigation, EffectFade]}
                    className="mySwiper"
                >
                    {slides.map((slide) => (
                        <SwiperSlide key={slide._id}>
                            <div className="relative w-full h-[700px] md:h-[90vh] min-h-[800px]">
                                {/* Background Image with Overlay */}
                                <div className="absolute inset-0 bg-black/40 z-10" />
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority={slide.order === 1}
                                    unoptimized={true}
                                />

                                {/* Content */}
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4">
                                    <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeInUp">
                                        {slide.title}
                                    </h2>
                                    {slide.subtitle && (
                                        <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fadeInUp delay-100">
                                            {slide.subtitle}
                                        </p>
                                    )}
                                    <Link
                                        href={slide.link}
                                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all transform hover:scale-105"
                                    >
                                        Explore Now
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style jsx global>{`
                .hero-slider-container {
                    width: 100vw;
                    position: relative;
                    left: 50%;
                    right: 50%;
                    margin-left: -50vw;
                    margin-right: -50vw;
                }
                .swiper-button-next,
                .swiper-button-prev {
                    color: white !important;
                }
                .swiper-pagination-bullet-active {
                    background: #dc2626 !important;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                
                .delay-100 {
                    animation-delay: 0.2s;
                }
            `}</style>
        </div>
    );
}
