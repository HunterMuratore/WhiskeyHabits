import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { NavLink } from 'react-router-dom'

import { GET_WHISKEYS } from '../utils/queries'

import LoadingSpinner from './LoadingSpinner'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

function Whiskeys() {
    const [perPage, setPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortByName, setSortByName] = useState("asc")
    const [sortByScore, setSortByScore] = useState(null)

    const { loading, error, data, fetchMore, refetch } = useQuery(GET_WHISKEYS, {
        variables: { search: '', page: currentPage, perPage, sortByName, sortByScore },
    })

    const totalPages = Math.ceil(data?.whiskeys?.count / perPage)

    useEffect(() => {
        fetchMore({
            variables: {
                page: currentPage,
                perPage: perPage,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev
                return { ...prev, whiskeys: fetchMoreResult.whiskeys }
            },
        })
    }, [currentPage, perPage])

    useEffect(() => {
        refetch({ search: '', page: currentPage, perPage, sortByName, sortByScore })
    }, [sortByName, sortByScore])
    
    if (loading) return <LoadingSpinner />

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    const handlePerPageChange = (e) => {
        const newPerPage = parseInt(e.target.value)
        setPerPage(newPerPage)
        setCurrentPage(1)
    }      

    const handleSortByName = () => {
        const newSortByName = sortByName === 'asc' ? 'desc' : 'asc'
        setSortByName(newSortByName)
        setSortByScore(null)
        setCurrentPage(1)
    }

    const handleSortByScore = () => {
        const newSortByScore = sortByScore === 'highToLow' ? 'lowToHigh' : 'highToLow'
        setSortByScore(newSortByScore)
        setSortByName(null)
        setCurrentPage(1)
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
                            <FontAwesomeIcon
                                icon={sortByName === 'asc' ? faCaretUp : faCaretDown}
                                onClick={handleSortByName}
                                className="ml-1 cursor-pointer"
                            />
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
                            <FontAwesomeIcon
                                icon={sortByScore === 'highToLow' ? faCaretUp : faCaretDown}
                                onClick={handleSortByScore}
                                className="ml-1 cursor-pointer"
                            />
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.whiskeys.whiskeys.slice(0, perPage).map((whiskey, index) => (
                        <tr key={whiskey._id}>
                            <td className="whiskey-link px-6 py-4 whitespace-no-wrap">
                                <NavLink to={`/whiskey/${whiskey._id}`}>{whiskey.name}</NavLink>
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
