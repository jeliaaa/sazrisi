import { Outlet } from "react-router-dom"
import Navigation from "./Navigation"

function CustomOutlet() {
    return (
        <div className='w-full min-h-dvh items-center justify-center flex relative bg-gray-100'>
            <Navigation />
            <div className="w-[95dvw]">
                <Outlet />
            </div>
        </div>
    )
}

export default CustomOutlet