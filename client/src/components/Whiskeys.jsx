import { useState, useEffect, useRef } from 'react'

import { useQuery } from '@apollo/client'
import { GET_WHISKEYS } from '../utils/queries'

import LoadingSpinner from './LoadingSpinner'
import Pagination from './Pagination'
import WhiskeyTable from './WhiskeyTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons'

function Whiskeys() {
    const [searchTerm, setSearchTerm] = useState('')
    const [perPage, setPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortByName, setSortByName] = useState("asc")
    const [sortByScore, setSortByScore] = useState(null)
    const [searchActive, setSearchActive] = useState(false)
    const inputRef = useRef(null)

    const { loading, error, data, fetchMore, refetch } = useQuery(GET_WHISKEYS, {
        variables: { search: searchTerm, page: currentPage, perPage, sortByName, sortByScore },
    })

    const totalPages = Math.ceil(data?.whiskeys?.count / perPage) || 0

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
        refetch({ search: searchTerm, page: currentPage, perPage, sortByName, sortByScore })
    }, [searchTerm, sortByName, sortByScore])

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

    const handleSearch = () => {
        const value = inputRef.current.value
        setSearchTerm(value)
        setSearchActive(true)
    }

    const handleClearSearch = () => {
        setSearchTerm('')
        setSearchActive(false)
    }

    if (loading) return <LoadingSpinner />

    return (
        <section className="whiskeys">
            <div className="flex justify-between mb-4">
                {/* Search input */}
                <div>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        ref={inputRef}
                        className="p-1 border border-gray-300 rounded"
                    />
                    <button className="ml-2" onClick={handleSearch}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                    <button className="ml-2" onClick={handleClearSearch}>
                        <FontAwesomeIcon icon={faX} />
                    </button>
                    {searchActive && (
                        <div>
                            <p>Currently searching for: <span className='font-semibold'>{searchTerm}</span></p>
                        </div>
                    )}
                </div>
                <div>
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
            </div>
            {/* Table to display whiskeys */}
            <WhiskeyTable
                data={data}
                sortByName={sortByName}
                sortByScore={sortByScore}
                handleSortByName={handleSortByName}
                handleSortByScore={handleSortByScore}
                perPage={perPage}
                currentPage={currentPage}
            />
            {/* Pagination controls */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </section>
    )
}

export default Whiskeys
