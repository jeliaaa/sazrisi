const Chat = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-main-color text-white p-4 text-lg font-bold shadow">
        🤖 AI ჩათბოტი
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-start">
          <div className="w-full sm:w-fit max-w-[85%] md:max-w-[75%] px-4 py-2 rounded-xl text-sm shadow bg-white text-gray-800 rounded-bl-none">
            სალამი! რით შემიძლია დაგეხმარო?
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-full sm:w-fit max-w-[85%] md:max-w-[75%] px-4 py-2 rounded-xl text-sm shadow bg-main-color text-white rounded-br-none">
            როგორ გავიმეორო საგნები სწრაფად?
          </div>
        </div>

        <div className="flex justify-start">
          <div className="w-full sm:w-fit max-w-[85%] md:max-w-[75%] px-4 py-2 rounded-xl text-sm shadow bg-white text-gray-800 rounded-bl-none">
            გირჩევთ გამოიყენოთ ვიდეო გაკვეთილები და პრაქტიკული ტესტები.
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-full sm:w-fit max-w-[85%] md:max-w-[75%] px-4 py-2 rounded-xl text-sm shadow bg-main-color text-white rounded-br-none">
            კარგი, მადლობა!
          </div>
        </div>

        <div className="h-16" />
      </main>

      <footer className="p-4 bg-white shadow-inner">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-color"
            placeholder="დაწერე შეტყობინება..."
          />
          <button className="bg-main-color text-white px-4 py-2 rounded-xl hover:bg-main-color-dark transition">
            გაგზავნა
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
