export default function CreatePasswordForm({ onNext }: { onNext: () => void }) {
    return (
        <div>
            <h1>CreatePasswordForm</h1>

            <button onClick={onNext}>Tiếp theo</button>
        </div>
    );
}