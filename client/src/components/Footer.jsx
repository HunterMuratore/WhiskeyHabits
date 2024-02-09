function Footer() {
    const date = new Date()

    return (
        <footer>
            <div className="w-full flex flex-col mt-auto mx-auto pt-10 p-3">
                <div className="flex flex-col text-sm items-center">
                    <p>&copy; {date.getFullYear()} Hunter Muratore</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer