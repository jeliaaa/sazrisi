import { Link } from "react-router-dom";
import leaderboardImg from "../icons/leaderboard.png"
import { MainNewsComponent } from "./News";

const Main = () => {
  return (
    <div className="w-full min-h-screen box-border flex flex-col">
      <div className="p-5 flex flex-col ">
        <Link to="/imitated" className="w-full text-texts-color flex flex-col py-5 px-3 items-center gap-y-5 h-fit lg:h-[400px] bg-main-color cursor-pointer rounded-xl hover:scale-102 transition-all delay-200">
          <span className="text-center text-4xl md:text-7xl">დარეგისტრირდი იმიტირებულ გამოცდაზე!</span>
          <span className="text-center title">დააჭირე ბანერს იმიტირებულ გამოცდაზე რეგისტრაციის დასაწყებად.</span>
          <img src={leaderboardImg} alt="..." />
        </Link>
        <p className="mt-10 title text-dark-color">ახალი ამბები</p>
        <MainNewsComponent />
      </div>











      {/* ჯიპიტას ნაყლევები

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">ბოლო აქტივობები</h2>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex justify-between items-center">
            <span>✅ ტესტი 'მათემატიკა A' დასრულდა</span>
            <span className="text-xs text-gray-400">3 დღის წინ</span>
          </li>
          <li className="flex justify-between items-center">
            <span>📊 მიღწეული ქულა: 92%</span>
            <span className="text-xs text-gray-400">3 დღის წინ</span>
          </li>
          <li className="flex justify-between items-center">
            <span>📝 ახალი ტესტი დაემატა: 'ფიზიკა B'</span>
            <span className="text-xs text-gray-400">1 დღის წინ</span>
          </li>
        </ul>
      </div> */}
    </div >
  );
};




export default Main;


