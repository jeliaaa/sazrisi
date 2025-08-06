import { useFormContext } from "react-hook-form"
import ControlledInput from "../SignUpInput";
import { SignUpFormData } from "../../../types/types";

const PersonalInfo = () => {
    const { control } = useFormContext<SignUpFormData>();

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
        </div>
    );
};

export default PersonalInfo;