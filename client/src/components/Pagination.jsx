const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = []

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
    }

    return (
        <div className="pagination flex justify-center mx-auto mt-4">
            <button
                className="mr-2 my-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            {currentPage > 1 && (
                <>
                    <button
                        className="mx-2"
                        onClick={() => onPageChange(1)}
                    >
                        1
                    </button>
                    <button className="mx-2 inactive">...</button>
                </>
            )}
            {pageNumbers.slice(currentPage - 1, currentPage + 2).map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={`mx-1 px-2 py-2 ${
                        pageNumber === currentPage ? 'font-bold' : ''
                    }`}
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </button>
            ))}
            {currentPage + 2 < totalPages && <button className="mx-2 inactive">...</button>}
            {currentPage + 2 < totalPages && (
                <button
                    className="mx-2"
                    onClick={() => onPageChange(totalPages)}
                >
                    {totalPages}
                </button>
            )}
            <button
                className="ml-2 my-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    )
}

export default Pagination
