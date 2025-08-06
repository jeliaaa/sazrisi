import { useFormContext, useController } from "react-hook-form";
import { SignUpFormData } from "../../../types/types";
import { useState } from "react";


const ProfilePicture = () => {
    const { control } = useFormContext<SignUpFormData>();
    const {
        field: { onChange, ref },
    } = useController({ name: "profile", control });

    const [fileName, setFileName] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        onChange(file || null);
        setFileName(file?.name || "");
    };

    return (
        <div className="flex flex-col gap-4">
            <label className="text-lg font-medium text-gray-900">
                ატვირთეთ პროფილის სურათი
            </label>

            <div className="relative w-full h-[100px] border-dashed border-2 border-gray-300 flex items-center justify-center bg-white rounded cursor-pointer">
                <label htmlFor="profile-upload" className="cursor-pointer text-gray-600">
                    {fileName ? fileName : "დაამატეთ სურათი"}
                </label>
                <input
                    id="profile-upload"
                    type="file"
                    ref={ref}
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );
};

export default ProfilePicture;
