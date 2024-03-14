import { NavLink } from "react-router-dom"

function Home() {
    return (
        <div className="home">
            <h1 className='text-center my-5 font-bold'>WhiskeyHabits</h1>
            <h2 className="text-center my-5">
                Welcome to WhiskeyHabits, a passion project created by a full-stack developer and whiskey enthusiast.
            </h2>
            <h3 className="text-center my-5">
                As someone deeply passionate about both technology and whiskey, I often found myself struggling to keep track of the whiskeys I've tried, my personal ratings, and the ones I aspire to taste in the future. That's why I decided to build WhiskeyHabits.
            </h3>
            <h3 className="text-center my-5">
                With WhiskeyHabits, you can easily log and rate the whiskeys you've tried, organize them by type, distiller, or any other criteria you choose, and discover new favorites based on your own preferences. Whether you're a seasoned connoisseur or just starting your whiskey journey, WhiskeyHabits is designed to enhance your experience and help you explore the vast world of whiskey with ease.
            </h3>
            <h3 className="text-center my-5">
                This project is still in development and I am working to improve it everyday. You can find the repo at my GitHub here - <a className="link" href="https://github.com/HunterMuratore/WhiskeyHabits" target="_blank" rel="noopener noreferrer">github.com/HunterMuratore/WhiskeyHabits</a> - and if you have any suggestions or comments please feel free to reach out to me through the <NavLink to="/contact" className="link">Contact Page</NavLink>
            </h3>
            <div className="text-center my-10">
                <NavLink
                    to="/whiskeys"
                    className="my-btn"
                >
                    Explore Whiskeys!
                </NavLink>
            </div>
        </div>
    )
}

export default Home