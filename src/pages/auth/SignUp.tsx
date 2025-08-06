import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Stepper from "../../components/signup/Stepper";
import PersonalInfo from "../../components/signup/steps/PersonalInfo";
import Preferences from "../../components/signup/steps/Preferences";
import ProfilePicture from "../../components/signup/steps/ProfilePicture";
import AllSet from "../../components/signup/steps/AllSet";
import { SignUpFormData, stepLabels, steps } from "../../types/types";
import toast from "react-hot-toast";
import TikTok from "../../icons/brands/tiktok.svg?react";
import Facebook from "../../icons/brands/facebook.svg?react";
import Instagram from "../../icons/brands/instagram.svg?react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import SafeRoute from "../../components/SafeRouter";

export default function SignUp() {
    const [currentStep, setCurrentStep] = useState<steps>(steps.info);
    const { registerBasic, setPreference, isAuth, uploadAvatar } = useAuthStore();
    const nav = useNavigate();
    const methods = useForm<SignUpFormData>({
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            rePassword: "",
            profile: null,
            preferences: "red"
        },
    });

    useEffect(() => {
        if (isAuth) {
            setCurrentStep(steps.preferences)
        }
    }, [isAuth, nav])
    const {
        watch,
        handleSubmit,
        setError
    } = methods;

    const watchAuth = watch(["firstname", "lastname", "email", "password", "rePassword"]);
    const isAuthNextDisabled =
        !watchAuth[0] || !watchAuth[1] || !watchAuth[2] || !watchAuth[3] || !watchAuth[4];

    const onBack = () => {
        if (currentStep > steps.info) setCurrentStep((prev) => prev - 1);
    };

    const handleStepSubmit = async (data: SignUpFormData) => {
        if (currentStep === steps.info) {
            // Step 1: Register basic
            if (isAuthNextDisabled) {
                return toast.error("გთხოვთ, შეავსეთ ყველა აუცილებელი ველი.");
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                setError("email", { message: "გთხოვთ, შეიყვანოთ ვალიდური ელ-ფოსტა." });
                return toast.error("გთხოვთ, შეიყვანოთ ვალიდური ელ-ფოსტა.");
            }

            if (data.password !== data.rePassword) {
                setError("rePassword", { message: "პაროლები არ ემთხვევა." });
                return toast.error("პაროლები არ ემთხვევა.");
            }
            const success = await registerBasic({
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                password: data.password,
                rePassword: data.rePassword,
            });
            if (!success) return toast.error("რეგისტრაცია ვერ განხორციელდა.");
        }

        if (currentStep === steps.preferences) {
            // Step 2: Send preferences
            const success = await setPreference({ theme_color: data.preferences });
            if (!success) return toast.error("პრეფერენციები ვერ გაიგზავნა.");
        }

        if (currentStep === steps.profile) {
            // Step 3: Upload avatar
            if (!data.profile) {
                return toast.error("გთხოვთ, ატვირთოთ პროფილის ფოტო.");
            }

            const success = await uploadAvatar(data.profile);
            if (!success) return toast.error("ფოტოს ატვირთვა ვერ განხორციელდა.");
        }

        setCurrentStep((prev) => prev + 1);
    };

    return (
        <div className="w-full h-fit p-5 md:p-15">
            <FormProvider {...methods}>
                <div className="flex gap-x-3 flex-col md:flex-row">
                    {/* Stepper on small screens at the top, on larger screens on the side */}
                    <div className="w-full flex flex-col justify-between md:w-1/4 bg-dark-color md:h-[85dvh] text-texts-color p-6 rounded-t-3xl md:rounded-3xl">
                        <Stepper step={currentStep} />
                        <div className="hidden md:flex flex-col gap-y-3">
                            <div className="flex gap-x-3 fill-white">
                                <TikTok className="size-6" />
                                <Facebook className="size-6" />
                                <Instagram className="size-6" />
                            </div>
                            <div>
                                <h1>Sazrisi / საზრისი</h1>
                                <h1>ყველა უფლება დაცულია &copy;</h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-6 lg:p-10 min-h-fit h-[85dvh] bg-gray-100 rounded-b-3xl md:rounded-t-3xl">
                        <form
                            onSubmit={handleSubmit(handleStepSubmit)}
                            className="max-w-xl mx-auto flex flex-col gap-6"
                        >
                            <h2 className="text-2xl font-bold text-main-color mb-2">
                                Step {currentStep + 1}: {stepLabels[currentStep]}
                            </h2>

                            {currentStep === steps.info && <PersonalInfo />}
                            {currentStep === steps.preferences && <SafeRoute><Preferences /></SafeRoute>}
                            {currentStep === steps.profile && <SafeRoute><ProfilePicture /></SafeRoute>}
                            {currentStep === steps.success && <SafeRoute><AllSet /></SafeRoute>}

                            {currentStep < steps.success && (
                                <div className="flex flex-col md:flex-row justify-between mt-6">
                                    {currentStep > steps.info && (
                                        <button
                                            type="button"
                                            onClick={onBack}
                                            className="px-4 py-2 cursor-pointer text-sm font-medium bg-gray-200 rounded hover:bg-gray-300 mb-2 md:mb-0"
                                        >
                                            უკან
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium bg-dark-color text-white rounded cursor-pointer hover:bg-gray-800"
                                    >
                                        {currentStep === steps.info ? "რეგისტრაცია" : "შემდეგ"}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </FormProvider>
        </div>
    );
}
