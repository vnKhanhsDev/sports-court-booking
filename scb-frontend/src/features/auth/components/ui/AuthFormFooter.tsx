import { Google, Facebook } from "@/components/ui/icons";
import styles from './AuthFormFooter.module.css';

interface AuthFormFooterProps {
    type: 'register' | 'login';
    isLoading?: boolean;
    onForgotPassword?: () => void;
    onGoogleClick?: () => void;
    onFacebookClick?: () => void;
    onNavigateToLogin?: () => void;
    onNavigateToRegister?: () => void;
};

export default function AuthFormFooter({
    type,
    isLoading = false,
    onForgotPassword,
    onGoogleClick,
    onFacebookClick,
    onNavigateToLogin,
    onNavigateToRegister,
}: AuthFormFooterProps) {
    const isRegister = type === 'register';

    return (
        <div>
            <div className='h-[30px] flex items-center justify-start'>
                {!isRegister && (
                    <button
                        type="button" 
                        onClick={onForgotPassword} 
                        className={styles.forgotPassword}
                    >
                        Quên mật khẩu
                    </button>
                )}
            </div>

            <div className={styles.separator}>
                <span className={styles.separatorText}>Hoặc</span>
            </div>

            <div className='flex items-center justify-center gap-3'>
                <button type='button' className={styles.socialButton} onClick={onGoogleClick}>
                    <Google fontSize={18} /> <span>Google</span>
                </button>
                <button type='button' className={styles.socialButton} onClick={onFacebookClick}>
                    <Facebook fontSize={18} /> <span>Facebook</span>
                </button>
            </div>

            {isRegister && (
                <div className={styles.agreement}>
                    Bằng việc đăng ký, bạn đã đồng ý với Sân Đêy về<br />
                    <a href="#" target="_blank" rel="noopener noreferrer">Điều khoản dịch vụ</a>
                    &nbsp;&amp;&nbsp;
                    <a href="#" target="_blank" rel="noopener noreferrer">Chính sách bảo mật</a>
                </div>
            )}

            <p className={styles.navigation}>
                {isRegister ? (
                    <>
                        <span>Bạn đã có tài khoản?</span>{" "}
                        <button type="button" onClick={onNavigateToLogin}>Đăng nhập</button>
                    </>
                ) : (
                    <>
                        <span>Bạn chưa có tài khoản?</span>{" "}
                        <button type="button" onClick={onNavigateToRegister}>Đăng ký</button>
                    </>
                )}
            </p>
        </div>
    );
}