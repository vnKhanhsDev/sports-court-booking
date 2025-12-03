import React from 'react';
import { AUTH_STEPS } from "../../constants/flow";
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    steps: string[];
    currentStep: number;
};

export default function ProgressBar({
    steps,
    currentStep
}: ProgressBarProps) {
    return (
        <section className="w-full flex items-start justify-center py-10">
            {steps.map((step, index) => {
                const activeClass = index === currentStep ? styles.active : '';
                const completedClass = index < currentStep ? styles.completed : '';

                return (
                    <React.Fragment key={index}>
                        <div className={`${styles.stepItem} ${activeClass} ${completedClass}`}>
                            <div className={styles.stepCircle}>{index + 1}</div>
                            <div className={styles.stepLabel}>
                                {AUTH_STEPS[step as keyof typeof AUTH_STEPS].TITLE}
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
        </section>
    );
}