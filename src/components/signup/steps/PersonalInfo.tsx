import { useFormContext } from "react-hook-form";
import ControlledInput from "../SignUpInput";
import { SignUpFormData } from "../../../types/types";
import { useMemo } from "react";

const PersonalInfo = () => {
    const { control, watch } = useFormContext<SignUpFormData>();

    const password = watch("password") || "";
    const rePassword = watch("rePassword") || "";

    const requirements = useMemo(() => {
        return {
            length: password.length >= 8,
            special: /[@!?.]/.test(password),
            match: password.length > 0 && password === rePassword,
        };
    }, [password, rePassword]);

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

            {/* Requirements list */}
            <div className="text-sm mt-2 space-y-1">
                <p className={requirements.length ? "text-green-600" : "text-red-600"}>
                    • მინიმუმ 8 სიმბოლო
                </p>
                <p className={requirements.special ? "text-green-600" : "text-red-600"}>
                    • უნდა შეიცავდეს სპეციალურ სიმბოლოს (@, !, ., ?)
                </p>
                <p className={requirements.match ? "text-green-600" : "text-red-600"}>
                    • პაროლები უნდა ემთხვეოდეს
                </p>
            </div>
        </div>
    );
};

export default PersonalInfo;
