import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../stores/authStore"; // adjust path

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    const { resetPassword, loading } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        // Only frontend check: new password matches confirm password
        if (newPassword !== confirmPassword) {
            const msg = "პაროლები არ ემთხვევა";
            setLocalError(msg);
            toast.error(msg);
            return;
        }

        // Call backend
        const result = await resetPassword({ currentPassword, newPassword });

        if (result.success) {
            toast.success("პაროლი წარმატებით შეიცვალა");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            setLocalError(result.message || "დაფიქსირდა შეცდომა");
            toast.error(result.message || "დაფიქსირდა შეცდომა");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-1">
                        შენი არსებული პაროლი
                    </label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-gray-100 p-3 rounded-xl outline-none text-sm"
                        placeholder="არსებული პაროლი"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">
                        შეცვალე პაროლი
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-gray-100 p-3 rounded-xl outline-none text-sm"
                        placeholder="ახალი პაროლი"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">
                        დაადასტურე პაროლი
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-100 p-3 rounded-xl outline-none text-sm"
                        placeholder="დაადასტურე"
                    />
                </div>
            </div>

            {localError && (
                <p className="text-red-500 text-sm">{localError}</p>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-48 bg-main-color cursor-pointer text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
                >
                    შენახვა
                </button>
            </div>
        </form>
    );
};

export default ChangePassword;
