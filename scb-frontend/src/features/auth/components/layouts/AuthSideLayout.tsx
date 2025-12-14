import styles from './AuthSideLayout.module.css';

export default function AuthSideLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className={styles.authSide}>
            <div className={styles.authSide__background}>
                <div className={styles.authSide__container}>
                    <div className={styles.authSide__content}>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}