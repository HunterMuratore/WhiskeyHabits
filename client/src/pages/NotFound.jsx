import { NavLink } from 'react-router-dom'

function NotFound () {
    return (
        <section className="flex flex-col justify-center mx-auto my-auto items-center">
            <h1 className="text-center text-2xl font-bold mt-40">Page Not Found!</h1>
            <h2 className="text-center text-xl font-bold mt-5">It seems you've lost your way.</h2>
            <h2 className="text-center text-xl font-bold mt-2">Click here to be taken home.</h2>
            <NavLink to="/"><button className="my-btn text-sm py-2 px-3 mx-auto rounded mt-5">Return Home</button></NavLink>
        </section>
    )
}

export default NotFound