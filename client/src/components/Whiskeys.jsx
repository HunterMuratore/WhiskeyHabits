import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_WHISKEYS } from '../utils/queries'
import LoadingSpinner from './LoadingSpinner'
// import Error from './Error' // Create error component

function Whiskeys() {
    const [perPage, setPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(1) // Track current page
    const { loading, error, data, fetchMore } = useQuery(GET_WHISKEYS, {
        variables: { search: '', page: 1, perPage: 20 },
    })

    const totalPages = Math.ceil(data?.whiskeys?.count / perPage)

    if (loading) return <LoadingSpinner />
    // if (error) return <Error message={error.message} />

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        fetchMore({
            variables: {
                page: newPage,
                perPage: perPage,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev
                return { ...prev, whiskeys: fetchMoreResult.whiskeys }
            },
        })
    }

    const handlePerPageChange = (e) => {
        const newPerPage = parseInt(e.target.value)
        setPerPage(newPerPage)
        setCurrentPage(1)
        fetchMore({
            variables: {
                page: 1,
                perPage: newPerPage,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev
                return { ...prev, whiskeys: fetchMoreResult.whiskeys }
            },
        })
    }

    return (
        <section className="whiskeys">
            <div className="flex justify-end mb-4">
                {/* Dropdown to select whiskeys per page */}
                <label htmlFor="perPage" className="mr-2">
                    Whiskeys per page:
                </label>
                <select
                    id="perPage"
                    className="p-1 border border-gray-300 rounded"
                    value={perPage}
                    onChange={handlePerPageChange}
                >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
            {/* Table to display whiskeys */}
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Image
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Distiller
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            ABV
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Score
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.whiskeys.whiskeys.slice(0, perPage).map((whiskey, index) => (
                        <tr key={whiskey._id}>
                            {/* {index === 0 && console.log(whiskey)} */}
                            <td className="px-6 py-4 whitespace-no-wrap">
                                {whiskey.name}
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                                <img src={whiskey.image} alt={whiskey.name} className="h-10" />
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                                {whiskey.type}
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                                {whiskey.stats.distiller}
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                                {whiskey.stats.abv}
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                                {whiskey.rating}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination controls */}
            <div className="flex justify-center mt-4">
                {/* Previous page button */}
                <button
                    className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {/* Current page number */}
                <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
                    Page {currentPage} of {totalPages}
                </span>
                {/* Next page button */}
                <button
                    className="ml-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </section>
    )
}

export default Whiskeys
