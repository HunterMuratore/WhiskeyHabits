const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="flex justify-center mt-4">
        <button
          className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    )
  }
  
  export default Pagination