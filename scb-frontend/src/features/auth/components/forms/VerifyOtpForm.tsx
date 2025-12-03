export default function VerifyOtpForm({ onNext }: { onNext: () => void }) {
    return (
        <div>
            <h1>VerifyOtpForm</h1>

            <button onClick={onNext}>Tiếp theo</button>
        </div>
    );
}