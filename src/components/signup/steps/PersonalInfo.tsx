import { useFormContext } from "react-hook-form"
import ControlledInput from "../SignUpInput";
import { SignUpFormData } from "../../../types/types";

const PersonalInfo = () => {
    const { control } = useFormContext<SignUpFormData>();

    return (
        <div className="flex flex-col gap-4">
            <ControlledInput<SignUpFormData>
                name="firstName"
                label="First Name"
                control={control}
            />
            <ControlledInput<SignUpFormData>
                name="lastName"
                label="Last Name"
                control={control}
            />
            <ControlledInput<SignUpFormData>
                name="email"
                label="Email"
                type="email"
                control={control}
            />
            <ControlledInput<SignUpFormData>
                name="password"
                label="password"
                type="password"
                control={control}
            />
            <ControlledInput<SignUpFormData>
                name="rePassword"
                label="rePassword"
                type="password"
                control={control}
            />
        </div>
    );
};

export default PersonalInfo;