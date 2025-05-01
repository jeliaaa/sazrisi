import { useFormContext, useController } from "react-hook-form";
import { SignUpFormData } from "../../../types/types";


const ProfilePicture = () => {
    const { control } = useFormContext<SignUpFormData>();
    const {
        field: { onChange, ref },
    } = useController({ name: "profile", control });

    return (
        <div className="flex flex-col gap-4">
            <label className="text-lg font-medium text-gray-900">
                Upload Profile Picture
            </label>
            <input
                type="file"
                ref={ref}
                onChange={(e) => onChange(e.target.files?.[0] || null)}
                className="mt-2"
            />
        </div>
    );
};

export default ProfilePicture;