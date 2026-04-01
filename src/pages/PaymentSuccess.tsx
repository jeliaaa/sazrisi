import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiV1 } from "../utils/axios";

type Status = "loading" | "completed" | "pending" | "failed" | "error";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId        = searchParams.get("order_id") ?? "";

  const [status, setStatus]     = useState<Status>("loading");
  const [amount, setAmount]     = useState("");
  const [currency, setCurrency] = useState("GEL");
  const [retries, setRetries]   = useState(0);

  useEffect(() => {
    if (!orderId) { setStatus("error"); return; }
    pollStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const pollStatus = async () => {
    setStatus("loading");
    try {
      const res  = await apiV1.get(`/payment/status/${orderId}/`);
      const data = res.data;
      setAmount(data.amount);
      setCurrency(data.currency);

      if (data.status === "completed") {
        setStatus("completed");
      } else if (data.status === "failed") {
        setStatus("failed");
      } else {
        // Still pending — retry up to 5 times (webhook may not have fired yet)
        if (retries < 5) {
          setTimeout(() => { setRetries((r) => r + 1); pollStatus(); }, 2500);
        } else {
          setStatus("pending");
        }
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-10 flex flex-col items-center gap-6 text-center">

        {/* Icon */}
        {status === "loading" && (
          <div className="w-16 h-16 rounded-full border-3 border-gray-200 border-t-main-color animate-spin" />
        )}
        {status === "completed" && (
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        )}
        {(status === "failed" || status === "error") && (
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
        )}
        {status === "pending" && (
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
        )}

        {/* Heading */}
        {status === "loading" && (
          <>
            <h1 className="title font-bold text-dark-color">გადახდა მუშავდება...</h1>
            <p className="plain-text text-gray-500">გთხოვთ დაიცადოთ. ვადასტურებთ გადახდას.</p>
          </>
        )}
        {status === "completed" && (
          <>
            <h1 className="title font-bold text-green-700">გადახდა წარმატებულია!</h1>
            {amount && (
              <p className="plain-text text-gray-600">
                გადახდილია <strong>{amount} {currency}</strong>.
              </p>
            )}
            <p className="plain-text text-gray-500">ტესტზე წვდომა გააქტიურებულია 30 დღით.</p>
          </>
        )}
        {status === "pending" && (
          <>
            <h1 className="title font-bold text-yellow-600">დასტური მოიცდება</h1>
            <p className="plain-text text-gray-500">
              გადახდა მიმდინარეობს. თუ თანხა ჩამოიჭრა, წვდომა რამდენიმე წუთში გააქტიურდება.
            </p>
            <button
              onClick={() => { setRetries(0); pollStatus(); }}
              className="plain-text text-sm text-main-color underline"
            >
              განახლება
            </button>
          </>
        )}
        {(status === "failed" || status === "error") && (
          <>
            <h1 className="title font-bold text-red-600">გადახდა ვერ განხორციელდა</h1>
            <p className="plain-text text-gray-500">
              {status === "error"
                ? "სისტემური შეცდომა. სცადეთ თავიდან."
                : "გადახდა უარყოფილია. გთხოვთ სცადოთ სხვა ბარათი."}
            </p>
          </>
        )}

        {/* CTA */}
        <div className="flex gap-3 w-full mt-2">
          <Link
            to="/quizs"
            className="flex-1 py-3 rounded-xl bg-dark-color text-main-color plain-text font-bold text-center shadow hover:bg-gray-800 transition-all"
          >
            ტესტებზე გადასვლა
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
