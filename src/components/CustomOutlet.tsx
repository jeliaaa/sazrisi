import { Outlet } from "react-router-dom"
import Navigation from "./Navigation"

function CustomOutlet() {
    return (
        <div className='w-full min-h-dvh items-center justify-center flex flex-col relative bg-gray-100'>
            <Navigation />
            <Outlet />
        </div>
    )
}

export default CustomOutlet