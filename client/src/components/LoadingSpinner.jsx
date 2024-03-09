function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center h-full">
        <svg
          className="animate-spin h-10 w-10 text-amber-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8 8 0 0012 20v4c-4.418 0-8-3.582-8-8h4zm10-2A8 8 0 0020 12h4c0 4.418-3.582 8-8 8v-4zm-2-10.373A8 8 0 0112 4V0c4.418 0 8 3.582 8 8h-4z"
          ></path>
        </svg>
      </div>
    )
  }
  
  export default LoadingSpinner