import { useState, useEffect, useRef } from 'react'

import { useQuery } from '@apollo/client'
import { GET_WHISKEYS } from '../utils/queries'

import LoadingSpinner from './LoadingSpinner'
import Pagination from './Pagination'
import WhiskeyTable from './WhiskeyTable'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons'

const whiskeyTypes = [
    { value: '', label: 'All Types' },
    { value: 'bourbon', label: 'Bourbon' },
    { value: 'rye', label: 'Rye' },
    { value: 'scotch', label: 'Scotch' },
    { value: 'american', label: 'American' },
    { value: 'canadian', label: 'Canadian' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'irish', label: 'Irish' },
    { value: 'blended', label: 'Blended' },
    { value: 'world', label: 'World' },
]

const whiskeyDistillers = [
    { value: '', label: 'All Distillers' },
    { value: 'Jack Daniel\'s', label: 'Jack Daniel\'s' },
    { value: 'Heaven Hill', label: 'Heaven Hill' },
    { value: 'MGP', label: 'MGP' },
    { value: 'Buffalo Trace', label: 'Buffalo Trace' },
    { value: 'Wild Turkey', label: 'Wild Turkey' },
    { value: 'Maker\'s Mark', label: 'Maker\'s Mark' },
    { value: 'Four Roses', label: 'Four Roses' },
    { value: 'Barton', label: 'Barton' },
    { value: 'Willet', label: 'Willet' },
    { value: 'Brown-Forman', label: 'Brown-Forman' },
    { value: 'Bruichladdich', label: 'Bruichladdich' },
    { value: 'Glenlivet', label: 'Glenlivet' },
    { value: 'Glenmorangie', label: 'Glenmorangie' },
    { value: 'Laphroaig', label: 'Laphroaig' },
    { value: 'Ardbeg', label: 'Ardbeg' },
]

function Whiskeys() {
    const [searchTerm, setSearchTerm] = useState('')
    const [perPage, setPerPage] = useState(20)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortByName, setSortByName] = useState("asc")
    const [sortByScore, setSortByScore] = useState(null)
    const [selectedType, setSelectedType] = useState('')
    const [selectedDistiller, setSelectedDistiller] = useState('')
    const [searchActive, setSearchActive] = useState(false)
    const inputRef = useRef(null)

    const { loading, error, data, fetchMore, refetch } = useQuery(GET_WHISKEYS, {
        variables: { search: searchTerm, page: currentPage, perPage, sortByName, sortByScore, selectedType, selectedDistiller },
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
        refetch({ search: searchTerm, page: currentPage, perPage, sortByName, sortByScore, selectedType, selectedDistiller })
    }, [searchTerm, sortByName, sortByScore, selectedType, selectedDistiller])

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

    const handleTypeChange = (e) => {
        const value = e.target.value
        setSelectedType(value)
        setCurrentPage(1)
    }

    const handleDistillerChange = (e) => {
        const value = e.target.value
        setSelectedDistiller(value)
        setCurrentPage(1)
    }

    const handleResetFilters = () => {
        setSearchTerm('')
        setSelectedType('')
        setSelectedDistiller('')
        setCurrentPage(1)
        setPerPage(20)
        setSortByName('asc')
        setSortByScore(null)
    }

    if (loading) return <LoadingSpinner />

    return (
        <section className="whiskeys">
            <div className="flex justify-between mb-2">
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
                    {/* Dropdown type filters */}
                    <select
                        className="p-1 border border-gray-300 rounded"
                        value={selectedType}
                        onChange={handleTypeChange}
                    >
                        {whiskeyTypes.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    {/* Dropdown distiller filters */}
                    <select
                        className="p-1 border border-gray-300 rounded"
                        value={selectedDistiller}
                        onChange={handleDistillerChange}
                    >
                        {whiskeyDistillers.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    {/* Dropdown to select whiskeys per page */}
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
            <div>
                {/* Reset filters */}
                <button className="reset text-sm mb-2 mx-3" onClick={handleResetFilters}>
                    Reset Filters
                </button>
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
            <div className='mt-1'>
                <p className='text-sm'>Currently viewing {data?.whiskeys?.count} whiskeys</p>
            </div>
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
