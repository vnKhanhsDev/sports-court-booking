export default function AuthSideLayout({ children }: { children: React.ReactNode }) {
    const backgroundImage = 'https://i.pinimg.com/1200x/ec/03/e1/ec03e15d6cf1b556cc3bc28a51aff30d.jpg';

    return (
        <div style={{ backgroundColor: '#f1f5f9' }}>
            <div className='h-[600px]' style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>
                <div className='max-w-[1040px] min-h-[600px] mx-auto flex items-center justify-end'>
                    {children}
                </div>
            </div>
        </div>
    );
}