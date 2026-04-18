import { Suspense, useState } from "react"
import { Route, Routes } from "react-router-dom"
import { publicRoutes } from "./routes/publicRoutes"
import CustomOutlet from "./components/CustomOutlet"
import Loader from "./components/reusables/Loader"
import { privateRoutes } from "./routes/privateRoutes"
import SafeRoute from "./components/SafeRouter"
import { FileQuestionMark } from "lucide-react"
// import Loader from "./components/reusables/Loader"

function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("+995555594139");
      alert("ნომერი კოპირებულია კლიპბორდზე!");
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };
  return (
    <div className="relative">
      {/* <Link to={'/chat'} className="fixed z-50 right-5 md:bottom-5 bottom-20 w-20 aspect-square rounded-full flex justify-center items-center bg-gray-100 shadow-2xl cursor-pointer hover:-translate-y-2 transition-all">
        <Robot fontSize={40} />
      </Link> */}
      <Suspense fallback={<div><Loader /></div>}>
        <Routes>
          <Route element={<SafeRoute><CustomOutlet /></SafeRoute>}>
            {privateRoutes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
          {publicRoutes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </Suspense>
      <div onClick={() => setIsHelpOpen(true)} className="absolute flex items-center justify-center cursor-pointer z-400 right-5 bottom-5 rounded-full w-15 aspect-square bg-main-color">
        <FileQuestionMark color="white" width={40} height={40} />
      </div>
      {isHelpOpen && (
        <div onClick={() => setIsHelpOpen(false)} className="fixed z-50 top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-5 w-[90%] md:w-[500px]">
            <h2 className="text-xl font-semibold mb-4">დახმარება</h2>
            <p className="text-gray-700 text-xl">თუ გაქვთ რაიმე შეკითხვა ან პრობლემა, გთხოვთ დაგვიკავშირდეთ შემდეგ ნომერზე: <br /> <a href="tel:+995555594139" className="text-blue-500 underline">555 59 41 39</a></p>
            <p className="text-main-color text-xl cursor-pointer hover:underline" onClick={handleCopy}>
              ნომრის კოპირება
            </p>
            <p className="text-gray-700 text-xl mt-2">ჩვენი მხარდაჭერის გუნდი მზად არის დაგეხმაროთ ნებისმიერ საკითხში.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
