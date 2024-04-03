const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Create an array containing all page numbers from 1 to totalPages
    const pageNumbers = []

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
    }

    return (
        <div className="pagination flex justify-center mx-auto mt-4">
            {/* Previous page button */}
            <button
                className="mr-2 my-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {/* Render ellipsis and first page button if currentPage is greater than 1 */}
            {currentPage > 2 && (
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

            {/* Render page buttons */}
            {pageNumbers.slice(
                currentPage === 1 ? 0 : Math.max(currentPage - 2, 0), // If on page 1, start from index 0, otherwise ensure the start index is not less than 0
                Math.min(currentPage === 1 ? 3 : currentPage + 1, totalPages) // Ensure the end index is either 3 or currentPage + 1, whichever is smaller
            ).map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={`mx-1 px-2 py-2 ${pageNumber === currentPage ? 'font-bold' : ''}`}
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </button>
            ))}

            {/* Render ellipsis and last page button if currentPage is less than totalPages */}
            {currentPage < totalPages - 1 && (
                <>
                    <button className="mx-2 inactive">...</button>
                    <button
                        className="mx-2"
                        onClick={() => onPageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next page button */}
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
