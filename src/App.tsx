import { Suspense } from "react"
import { Link, Route, Routes } from "react-router-dom"
import { publicRoutes } from "./routes/publicRoutes"
import CustomOutlet from "./components/CustomOutlet"
import Loader from "./components/reusables/Loader"
import { privateRoutes } from "./routes/privateRoutes"
import Robot from "./icons/robot.svg?react"
// import Loader from "./components/reusables/Loader"

function App() {
  return (
    <div className="relative">
      <Link to={'/chat'} className="fixed z-50 right-5 md:bottom-5 bottom-20 w-20 aspect-square rounded-full flex justify-center items-center bg-gray-100 shadow-2xl cursor-pointer hover:-translate-y-2 transition-all">
        <Robot fontSize={40} />
      </Link>
      <Suspense fallback={<div><Loader /></div>}>
        <Routes>
          <Route element={<CustomOutlet />}>
            {privateRoutes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
          {publicRoutes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
