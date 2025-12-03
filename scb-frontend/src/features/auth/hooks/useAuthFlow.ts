import { useState } from "react";

export default function useAuthFlow() {
    const [steps, setSteps] = useState<string[]>([]);
    const [index, setIndex] = useState<number>(0);

    return {
        steps,
        setSteps,
        index,
        nextStep: () => setIndex((index) => index + 1)
    };
}