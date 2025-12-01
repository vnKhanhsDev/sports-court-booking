import { Link } from "react-router-dom";
import { ShoppingCart, CartEmpty } from "@/components/ui/icons";
import styles from './Cart.module.css';

const Cart = () => {
    const bookings = [
        { id: 1, image: 'https://d26itsb5vlqdeq.cloudfront.net/image/98CE1963-0E26-F9B2-D4713C65A9683442', name: 'Booking 1', price: 300000 },
        { id: 2, image: 'https://d26itsb5vlqdeq.cloudfront.net/image/98CE1963-0E26-F9B2-D4713C65A9683442', name: 'Booking 2', price: 200000 },
        { id: 3, image: 'https://d26itsb5vlqdeq.cloudfront.net/image/98CE1963-0E26-F9B2-D4713C65A9683442', name: 'Booking 3', price: 300000 }
    ];

    return (
        <div className={`flex items-center justify-center ${styles.cart}`}>
            <div className={`relative flex items-center justify-center ${styles.cart__wrapper}`}>
                <Link to="/cart">
                    <ShoppingCart fontSize={35} />
                    {bookings.length > 0 && 
                        <span className={`absolute flex items-center justify-center ${styles.cart__count}`}>
                            {bookings.length}
                        </span>
                    }
                </Link>

                <div className={styles.cart__dropdown}>
                    {bookings.length > 0 ? (
                        <div className='flex flex-col gap-2'>
                            <p className='text-md text-gray-400'>Đơn đặt sân của bạn</p>
                            {bookings.map((booking) => (
                                <Link to={`/booking/${booking.id}`} key={booking.id}>
                                    <div className='flex items-start justify-between'>
                                        <div className='flex items-start gap-2'>
                                            <img src={booking.image} alt="court" style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0'}} />
                                            <p className='text-sm text-black'>{booking.name}</p>
                                        </div>
                                        <p className='text-sm text-black'>{booking.price}đ</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={`flex flex-col items-center justify-center gap-1`}>
                            <CartEmpty fontSize={130} />
                            <p className='text-center text-sm text-gray-400'>Không có đơn đặt sân nào</p>
                        </div>
                    )}

                    <div className='flex justify-end pt-2'>
                        <Link to="/cart" className={styles.cart__viewAllBtn}>xem tất cả</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;