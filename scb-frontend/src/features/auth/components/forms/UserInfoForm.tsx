export default function UserInfoForm({ onNext }: { onNext: () => void }) {
    return (
        <div>
            <h1>UserInfoForm</h1>

            <button onClick={onNext}>Tiếp theo</button>
        </div>
    );
}