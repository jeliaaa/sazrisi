import { motion } from "framer-motion";
import { stepLabels, steps } from '../../types/types';

export default function Stepper({
    step,
}: {
    step: number,
}) {
    return (
        <div className="flex lg:flex-col items-start relative">
            {Object.values(steps)
                .filter((v) => typeof v === "number")
                // ❌ COMMENTED: render only the first step
                // .slice(0, -1)
                .slice(0, 1)
                .map((_, i) => {
                    const active = step === i;
                    const completed = step > i;

                    return (
                        <div key={i} className="flex lg:flex-col items-start relative">
                            <div className="flex flex-col lg:flex-row gap-3 items-center justify-center">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        backgroundColor: active
                                            ? "rgba(255, 255, 255, 0.3)"
                                            : completed
                                                ? "#FFFFFF"
                                                : "transparent",
                                        borderColor:
                                            active || completed ? "white" : "#979797",
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="w-[26px] flex justify-center items-center h-[26px] rounded-full border-2"
                                >
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            opacity: completed ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        +
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0.5 }}
                                    animate={{
                                        opacity: completed || active ? 1 : 0.5,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="text-[18px] hidden lg:block font-semibold text-[#FFFFFF]"
                                >
                                    {stepLabels[i as steps]}
                                </motion.div>
                            </div>

                            {/* ❌ COMMENTED: connector line to next steps */}
                            {/*
                            <div className="h-[26px] lg:h-auto lg:w-[26px] flex justify-center items-center">
                                {i !== steps.profile && (
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            backgroundColor:
                                                active || completed ? "white" : "#979797",
                                            borderColor:
                                                active || completed ? "white" : "#979797",
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white w-[26px] h-[2px] lg:h-[26px] mx-1 lg:mx-0 lg:my-1 lg:w-[2px]"
                                    />
                                )}
                            </div>
                            */}
                        </div>
                    );
                })}
        </div>
    );
}
