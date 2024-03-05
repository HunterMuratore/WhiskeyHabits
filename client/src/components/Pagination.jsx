import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];

    // Generate page numbers
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
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
            <button
                className="mx-2"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                &lt;&lt;&lt;
            </button>
            {pageNumbers.slice(currentPage - 1, currentPage + 2).map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={`mx-1 px-3 py-2 ${
                        pageNumber === currentPage ? 'font-bold' : ''
                    }`}
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </button>
            ))}
            {currentPage + 2 < totalPages && <span className="mx-2">...</span>}
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
    );
};

export default Pagination;
