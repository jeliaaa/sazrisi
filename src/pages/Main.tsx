import { Link } from "react-router-dom";
import leaderboardImg from "../icons/leaderboard.png"

const Main = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="p-5 flex flex-col ">
        <div className="w-full text-texts-color flex flex-col py-5 px-3 items-center gap-y-5 h-fit lg:h-[400px] bg-main-color cursor-pointer rounded-xl hover:scale-102 transition-all delay-200">
          <span className="text-center text-7xl">გათამაშება უკვე დაიწყო!</span>
          <span className="text-center title">დააჭირეთ ბანერს დამატებითი ინფორმაციის მისაღებად</span>
          <img src={leaderboardImg} alt="..."  />
        </div>
        <div className="flex gap-x-3">
          <div className="flex flex-col">
            <span>22.08.2025</span>
            <img src="https://picsum.photos/300/200" className="w-full" />
            <span className="title">რა არის საზრისი?</span>
            <Link to={'/news'} className="text-gray-200 ">იხ. სრულად</Link>
          </div>
        </div>
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


