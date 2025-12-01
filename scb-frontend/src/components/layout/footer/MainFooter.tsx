import { Facebook, Instagram, Zalo } from '@/components/ui/icons';
import styles from './MainFooter.module.css';

const SOCIAL_LINKS = [
    { id: 'facebook', icon: <Facebook />, link: 'https://www.facebook.com/scb-sport' },
    { id: 'instagram', icon: <Instagram />, link: 'https://www.instagram.com/scb-sport' },
    { id: 'zalo', icon: <Zalo />, link: 'https://www.twitter.com/scb-sport' }
];

function MainFooter() {
    return (
        <footer>
            <div className='container mx-auto max-w-[1200px]'>
                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <div className="logo" style={{ width: '100px', height: '50px', backgroundColor: '#fff'}}></div>
                        <p>Nền tảng đặt sân thể thao hiện đại giúp kết nối người chơi và chủ sân nhanh chóng, tiện lợi, hiệu quả.</p>
                        <div>
                            {SOCIAL_LINKS.map((link) => (
                                <a key={link.id} href={link.link} target="_blank" rel="noopener noreferrer">
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

                <div>
                    Copyright © 2025 SCB Sport. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default MainFooter;