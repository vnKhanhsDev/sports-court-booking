import React from "react";
import { Link } from "react-router-dom";

const AuthHeader = React.memo(({ title }: { title: string }) => {
    return (
        <header className="w-full h-21 shadow-md">
            <div className="max-w-[1200px] h-full mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link to="/">
                        <img src="/logo.png" alt="logo" className="w-10 h-10" />
                    </Link>
                    <h1 className="text-2xl">{title}</h1>
                </div>

                <a href="" style={{ color: 'var(--primary-color)' }}>Bạn cần hỗ trợ?</a>
            </div>
        </header>
    );
});

export default AuthHeader;