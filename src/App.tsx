import { Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import { publicRoutes } from "./routes/publicRoutes"
import CustomOutlet from "./components/CustomOutlet"
import Main from "./pages/Main"
import Loader from "./components/reusables/Loader"
import { privateRoutes } from "./routes/privateRoutes"
// import Loader from "./components/reusables/Loader"

function App() {
  return (
    <div>
      <Suspense fallback={<div><Loader /></div>}>
        <Routes>
          <Route element={<CustomOutlet />}>
            <Route index path="/" element={<Main />} />
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
