import { ChangeEvent, FormEvent, useState } from "react";
import Input from "../../components/reusables/Input";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"

const Register = () => {

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        repassword: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        repassword: "",

    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" }); // Clear errors when typing
    };

    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent page reload

        // Basic validation
        if (!form.username) {
            setErrors((prev) => ({ ...prev, username: "მომხმარებლის სახელი არასწორია" }));
        }
        if (!form.password) {
            setErrors((prev) => ({ ...prev, password: "პაროლი არასწორია" }));
        }
        if (!form.email) {
            setErrors((prev) => ({ ...prev, password: "პაროლი არასწორია" }));
        }

        if (form.username && form.password) {
            // Perform login request here (API call, authentication logic, etc.)
        }
    };

    return (
        <div className="w-full h-screen flex items-center flex-col justify-center">
            <h1 className="text-6xl mb-5 text-main-color text-center md:text-left">რეგისტრაცია დროებით არ არის ხელმისაწვდომი!</h1>
            <div className="bg-white text-dark-color flex-col w-[90%] md:w-1/2 md:h-[700px] rounded-xl shadow-2xl p-10 flex items-center justify-center">
                <div className='flex items-end gap-x-3'>
                    <img src={logo} alt="logo" className="w-10" />
                    <span className='text-3xl text-dark-color'>Sazrisi</span>
                </div>
                <form onSubmit={submitForm} className="flex flex-col mt-2 gap-y-5 justify-center h-full w-full">
                    <div className="flex gap-x-2 w-full flex-col md:flex-row box-border">
                        <div className="flex flex-col gap-y-2 md:w-1/2">
                            <Input label="მომხმარებლის სახელი" name="username" value={form.username} onChange={handleChange} />
                            {errors.username && <span className="text-red-500">{errors.username}</span>}
                        </div>
                        <div className="flex flex-col gap-y-2 md:w-1/2">
                            <Input label="მომხმარებლის მეილი" name="email" type="email" value={form.email} onChange={handleChange} />
                            {errors.username && <span className="text-red-500">{errors.email}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Input label="პაროლი" name="password" type="password" value={form.password} onChange={handleChange} />
                        {errors.password && <span className="text-red-500">{errors.password}</span>}
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Input label="გაიმეორეთ პაროლი" name="repassword" type="password" value={form.repassword} onChange={handleChange} />
                        {errors.password && <span className="text-red-500">{errors.repassword}</span>}
                    </div>
                    <button className="mt-5 bg-dark-color text-gray-100 py-[10px] px-[35px] rounded-[10px] cursor-pointer transition-all delay-75 border-2 hover: border-dark-color hover:bg-transparent hover:text-dark-color" type="submit">
                        რეგისტრაცია
                    </button>
                    <span>
                        გაქვს ანგარიში?{" "}
                        <Link className="text-main-color underline ml-2" to={"/app/login"}>
                            შესვლა
                        </Link>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default Register;
