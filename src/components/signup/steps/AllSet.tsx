import { Link } from "react-router-dom";

export default function AllSet() {
  return (
    <div className="text-center plain-text py-10">
      <h2 className="title font-bold text-green-600">🎉 You're all set!</h2>
      <p className="text-gray-600 mt-2">Thanks for completing the registration.</p>
      <Link to={'/'}>მთავარ გვერდზე გადასვლა</Link>
    </div>
  );
}
