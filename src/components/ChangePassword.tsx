import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";
const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { resetPassword, loading } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // basic validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("გთხოვთ, შეავსოთ ყველა ველი");
            toast.error("გთხოვთ, შეავსოთ ყველა ველი");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("პაროლები არ ემთხვევა");
            toast.error("პაროლები არ ემთხვევა");
            return;
        }

        if (newPassword.length < 8) {
            setError("პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო");
            toast.error("პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო");
            return;
        }

        try {
            await resetPassword({ currentPassword, newPassword });
            toast.success("პაროლი წარმატებით შეიცვალა");
            // optionally clear fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            // error handled in store
            toast.error(err as string || "შეცდომა მოხდა");
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-48 bg-main-color text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
                >
                    შენახვა
                </button>
            </div>
        </form>
    );
};

export default ChangePassword;
