import ProgressBar from "../ui/ProgressBar";
import styles from './AuthFlowLayout.module.css';

interface AuthFlowLayoutProps {
    children: React.ReactNode;
    steps: string[];
    currentStep: number;
};

export default function AuthFlowLayout({
    children,
    steps,
    currentStep
}: AuthFlowLayoutProps) {
    return (
        <div>
            <div className="max-w-[1040px] mx-auto min-h-[600px] flex flex-col items-center justify-start">
                <ProgressBar steps={steps} currentStep={currentStep} />
                <section className={styles.flowForm}>
                    {children}
                </section>
            </div>
        </div>
    );
}