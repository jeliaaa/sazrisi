import { useEffect, useState } from "react";
import Input from "../../components/reusables/Input";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";
import Loader from "../../components/reusables/Loader";

const Login = () => {
    const nav = useNavigate();
    const { login, loading, error, isAuth, sendResetCode, confirmResetPassword } = useAuthStore();
    const [hydrated, setHydrated] = useState(false);
    const [usePhone, setUsePhone] = useState(false);
    const [form, setForm] = useState({ login_id: "", password: "" });
    const [forgotMode, setForgotMode] = useState(false);
    const [resetForm, setResetForm] = useState({ phone: "", code: "", newPassword: "", rePassword: "" });
    const [codeSent, setCodeSent] = useState(false);

    useEffect(() => {
        useAuthStore.setState({ error: null });
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (isAuth) nav("/");
    }, [isAuth, nav]);

    useEffect(() => {
        setForm((prev) => ({ ...prev, login_id: "" }));
    }, [usePhone]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const login_id = usePhone ? `995${form.login_id}` : form.login_id;
        const success = await login(login_id, form.password);
        if (success) {
            nav("/");
        } else {
            toast.error("დაფიქსირდა შეცდომა!");
        }
    };

    const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setResetForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSendResetCode = async () => {
        const res = await sendResetCode(resetForm.phone);
        if (res.isOk) {
            toast.success(res.detail);
            setCodeSent(true);
        } else {
            toast.error(res.detail);
        }
    };

    const handleConfirmReset = async () => {
        if (resetForm.newPassword !== resetForm.rePassword) {
            toast.error("პაროლები არ ემთხვევა");
            return;
        }
        const success = await confirmResetPassword({
            phone: resetForm.phone,
            verification_code: resetForm.code,
            new_password: resetForm.newPassword,
            rePassword: resetForm.rePassword,
        });
        if (success) {
            toast.success("პაროლი წარმატებით შეიცვალა");
            setForgotMode(false);
            setCodeSent(false);
            setResetForm({ phone: "", code: "", newPassword: "", rePassword: "" });
        } else {
            toast.error("დაფიქსირდა შეცდომა!");
        }
    };

    if (!hydrated) return <Loader />;

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="bg-white text-dark-color flex-col md:w-1/2 h-[600px] rounded-xl shadow-2xl p-10 flex items-center justify-center">
                <div className="flex items-end gap-x-3">
                    <img src={logo} alt="logo" className="w-10" />
                    <span className="text-3xl text-dark-color">Sazrisi</span>
                </div>
                {!forgotMode ? (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-y-5 justify-center h-full w-full"
                    >
                        {/* Toggle */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className={!usePhone ? "font-semibold" : "text-gray-400"}>ელ.ფოსტა</span>
                            <button
                                type="button"
                                onClick={() => setUsePhone((p) => !p)}
                                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${usePhone ? "bg-main-color" : "bg-gray-300"}`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${usePhone ? "translate-x-5" : "translate-x-0"}`}
                                />
                            </button>
                            <span className={usePhone ? "font-semibold" : "text-gray-400"}>ტელეფონი</span>
                        </div>

                        <div className="flex flex-col gap-y-2">
                            {usePhone ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-[9px]">+995</span>
                                    <div className="flex-1">
                                        <Input
                                            label="ტელეფონის ნომერი"
                                            name="login_id"
                                            type="tel"
                                            value={form.login_id}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <Input
                                    label="ელ.ფოსტა"
                                    name="login_id"
                                    value={form.login_id}
                                    onChange={handleChange}
                                />
                            )}
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <Input
                                label="პაროლი"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>

                        {error && <span className="text-red-500">{error}</span>}

                        <button
                            disabled={loading}
                            className="mt-5 bg-dark-color text-gray-100 py-[10px] px-[35px] rounded-[10px] cursor-pointer transition-all delay-75 border-2 hover:border-dark-color hover:bg-transparent hover:text-dark-color"
                            type="submit"
                        >
                            {loading ? "იტვირთება..." : "შესვლა"}
                        </button>
                        <div className="flex justify-between">
                            <span>
                                არ გაქვს ანგარიში?{" "}
                                <Link className="text-main-color underline ml-2" to={"/register"}>
                                    დარეგისტრირდი
                                </Link>
                            </span>
                            <button
                                type="button"
                                onClick={() => setForgotMode(true)}
                                className="text-main-color underline"
                            >
                                დაგავიწყდა პაროლი?
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col gap-y-5 justify-center h-full w-full">
                        <h2 className="text-xl font-semibold">პაროლის აღდგენა</h2>
                        {!codeSent ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-[9px]">+995</span>
                                    <div className="flex-1">
                                        <Input
                                            label="ტელეფონის ნომერი"
                                            name="phone"
                                            type="tel"
                                            value={resetForm.phone}
                                            onChange={handleResetChange}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSendResetCode}
                                    disabled={loading}
                                    className="bg-main-color text-white py-[10px] px-[35px] rounded-[10px] cursor-pointer"
                                >
                                    {loading ? "იტვირთება..." : "კოდის გაგზავნა"}
                                </button>
                            </>
                        ) : (
                            <>
                                <Input
                                    label="ვერიფიკაციის კოდი"
                                    name="code"
                                    value={resetForm.code}
                                    onChange={handleResetChange}
                                />
                                <Input
                                    label="ახალი პაროლი"
                                    name="newPassword"
                                    type="password"
                                    value={resetForm.newPassword}
                                    onChange={handleResetChange}
                                />
                                <Input
                                    label="გაიმეორეთ პაროლი"
                                    name="rePassword"
                                    type="password"
                                    value={resetForm.rePassword}
                                    onChange={handleResetChange}
                                />
                                <button
                                    onClick={handleConfirmReset}
                                    disabled={loading}
                                    className="bg-main-color text-white py-[10px] px-[35px] rounded-[10px] cursor-pointer"
                                >
                                    {loading ? "იტვირთება..." : "პაროლის შეცვლა"}
                                </button>
                            </>
                        )}
                        {error && <span className="text-red-500">{error}</span>}
                        <button
                            type="button"
                            onClick={() => {
                                setForgotMode(false);
                                setCodeSent(false);
                                setResetForm({ phone: "", code: "", newPassword: "", rePassword: "" });
                            }}
                            className="text-gray-500 underline"
                        >
                            უკან დაბრუნება
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;