// import { useFormContext } from "react-hook-form";
// import ControlledInput from "../SignUpInput";
// import { SignUpFormData } from "../../../types/types";
// import { useMemo } from "react";

// const PersonalInfo = () => {
//     const { control, watch } = useFormContext<SignUpFormData>();

//     const password = watch("password") || "";
//     const rePassword = watch("rePassword") || "";

//     const requirements = useMemo(() => {
//         return {
//             length: password.length >= 8,
//             special: /[@!?.]/.test(password),
//             letter: /[a-zA-Z]/.test(password),
//             match: password.length > 0 && password === rePassword,
//         };
//     }, [password, rePassword]);

//     return (
//         <div className="flex flex-col gap-4">
//             <ControlledInput<SignUpFormData>
//                 name="firstname"
//                 label="სახელი"
//                 control={control}
//             />
//             <ControlledInput<SignUpFormData>
//                 name="lastname"
//                 label="გვარი"
//                 control={control}
//             />
//             <ControlledInput<SignUpFormData>
//                 name="email"
//                 label="ელ.ფოსტა"
//                 type="email"
//                 control={control}
//             />
//             <ControlledInput<SignUpFormData>
//                 name="password"
//                 label="პაროლი"
//                 type="password"
//                 control={control}
//             />
//             <ControlledInput<SignUpFormData>
//                 name="rePassword"
//                 label="გაიმეორეთ პაროლი"
//                 type="password"
//                 control={control}
//             />

//             {/* Requirements list */}
//             <div className="text-sm mt-2 space-y-1">
//                 <p className={requirements.length ? "text-green-600" : "text-red-600"}>
//                     • მინიმუმ 8 სიმბოლო
//                 </p>
//                 <p className={requirements.special ? "text-green-600" : "text-red-600"}>
//                     • უნდა შეიცავდეს სპეციალურ სიმბოლოს (@, !, ., ?)
//                 </p>
//                 <p className={requirements.letter ? "text-green-600" : "text-red-600"}>
//                     • უნდა შეიცავდეს ერთ ასოს
//                 </p>
//                 <p className={requirements.match ? "text-green-600" : "text-red-600"}>
//                     • პაროლები უნდა ემთხვეოდეს
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default PersonalInfo;
import { useFormContext } from "react-hook-form";
import ControlledInput from "../SignUpInput";
import { SignUpFormData } from "../../../types/types";
import { useMemo, useState, useEffect } from "react";
import { useAuthStore } from "../../../stores/authStore";
import toast from "react-hot-toast";

const PersonalInfo = () => {
    const { control, watch } = useFormContext<SignUpFormData>();
    const { verifyCode } = useAuthStore();
    const [codeSent, setCodeSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const password = watch("password") || "";
    const rePassword = watch("rePassword") || "";
    const phone = watch("phone") || "";
    const verificationCode = watch("verification_code") || "";

    const requirements = useMemo(() => ({
        length: password.length >= 8,
        special: /[@!?.]/.test(password),
        letter: /[a-zA-Z]/.test(password),
        match: password.length > 0 && password === rePassword,
        code: /^\d{6}$/.test(verificationCode),
    }), [password, rePassword, verificationCode]);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleVerify = async () => {
        if (!phone) return;
        setIsSending(true);
        const result = await verifyCode(phone);
        if (result.isOk) {
            toast.success(result.detail);
            setCodeSent(true);
            setCountdown(60);
        } else {
            toast.error(`ვერ მოხერხდა კოდის გაგზავნა - ${result?.detail || "დაფიქსირდა შეცდომა"}`);
        }
        setIsSending(false);
    };

    return (
        <div className="flex flex-col gap-4">
            <ControlledInput<SignUpFormData>
                name="firstname"
                label="სახელი"
                control={control}
            />
            <ControlledInput<SignUpFormData>
                name="lastname"
                label="გვარი"
                control={control}
            />
            <ControlledInput<SignUpFormData>
                name="email"
                label="ელ.ფოსტა"
                type="email"
                control={control}
            />
            <ControlledInput<SignUpFormData>
                name="password"
                label="პაროლი"
                type="password"
                control={control}
            />
            <ControlledInput<SignUpFormData>
                name="rePassword"
                label="გაიმეორეთ პაროლი"
                type="password"
                control={control}
            />

            {/* Phone + Verify */}
            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    <ControlledInput<SignUpFormData>
                        name="phone"
                        label="ტელეფონის ნომერი"
                        type="tel"
                        control={control}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleVerify}
                    disabled={!phone || isSending || countdown > 0}
                    className="mb-[2px] px-4 py-2 text-sm font-medium rounded-md bg-dark-color cursor-pointer text-white hover:bg-dark-color/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                    {isSending
                        ? "..."
                        : countdown > 0
                            ? `${countdown}წმ`
                            : codeSent
                                ? "თავიდან გაგზავნა"
                                : "შემოწმება"}
                </button>
            </div>

            {/* Verification code field */}
            {codeSent && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <ControlledInput<SignUpFormData>
                        name="verification_code"
                        label="დამადასტურებელი კოდი"
                        type="text"
                        maxLength={6}
                        control={control}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        კოდი გაიგზავნა ნომერზე {phone}
                    </p>
                </div>
            )}

            {/* Requirements list */}
            <div className="text-sm mt-2 space-y-1">
                <p className={requirements.length ? "text-green-600" : "text-red-600"}>
                    • მინიმუმ 8 სიმბოლო
                </p>
                <p className={requirements.special ? "text-green-600" : "text-red-600"}>
                    • უნდა შეიცავდეს სპეციალურ სიმბოლოს (@, !, ., ?)
                </p>
                <p className={requirements.letter ? "text-green-600" : "text-red-600"}>
                    • უნდა შეიცავდეს ერთ ასოს
                </p>
                <p className={requirements.match ? "text-green-600" : "text-red-600"}>
                    • პაროლები უნდა ემთხვეოდეს
                </p>
                {codeSent && (
                    <p className={requirements.code ? "text-green-600" : "text-red-600"}>
                        • კოდი უნდა იყოს ზუსტად 6 ციფრი
                    </p>
                )}
            </div>
        </div>
    );
};

export default PersonalInfo;