const Main = () => {

  return (
    <div className="w-full min-h-screen flex flex-col">
      <header className="w-full bg-main-color/80 p-5 flex items-center justify-center">
        <span className="title text-texts-color">მოგესალმებით!</span>
      </header>
      <div className="p-5 flex flex-col">
        <div className="w-full flex border-2 border-dark-color">
          <div className="w-1/2 h-[300px] bg-center bg-no-repeat bg-cover rounded-md" style={{ backgroundImage: `url(${'https://picsum.photos/300/100'})` }} />
          <div className="w-1/2 flex-col">
            <div className="w-full flex items-center justify-between plain-text">
              <span>გათამაშება</span>
              <span>22.08.2025</span>
            </div>
            <h1 className="title text-main-color text-center">ჩაერთე გათამაშებაში და მოიგე პრიზი!</h1>
            <div className="plain-text text-dark-color p-5">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, deserunt!</p>
              <br />
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi at accusamus omnis eligendi excepturi tenetur nihil asperiores minima quas ea?</p>
              <br />
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti asperiores officiis suscipit non optio eaque illo quaerat tempora. Voluptatem ad illo, ex placeat itaque ratione dolor commodi asperiores perferendis. Consequatur ipsa hic architecto officia ad.</p>
            </div>
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


