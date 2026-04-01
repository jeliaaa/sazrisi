import { Link } from "react-router-dom";

export default function PaymentFail() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-10 flex flex-col items-center gap-6 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h1 className="title font-bold text-red-600">გადახდა ვერ განხორციელდა</h1>
          <p className="plain-text text-gray-500">
            გადახდა გაუქმდა ან ბანკმა უარი განაცხადა. თქვენი ანგარიშიდან თანხა არ ჩამოიჭრება.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left w-full">
          <p className="plain-text font-semibold text-gray-700 mb-2">შეამოწმეთ:</p>
          <ul className="plain-text text-sm text-gray-500 space-y-1">
            <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />ბარათის ვადა</li>
            <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />ანგარიშზე ბალანსი</li>
            <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />ონლაინ გადახდის ლიმიტი</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <Link
            to="/quizs"
            className="flex-1 py-3 rounded-xl bg-dark-color text-main-color plain-text font-bold text-center shadow hover:bg-gray-800 transition-all"
          >
            ხელახლა ცდა
          </Link>
          <Link
            to="/"
            className="flex-1 py-3 rounded-xl border border-gray-200 plain-text text-gray-600 text-center hover:bg-gray-50 transition-colors"
          >
            მთავარი
          </Link>
        </div>
      </div>
    </div>
  );
}
