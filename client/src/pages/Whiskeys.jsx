import { useState, useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'

import { useQuery } from '@apollo/client'
import { GET_WHISKEYS } from '../utils/queries'

import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'
import WhiskeyTable from '../components/WhiskeyTable'
import FiltersModal from '../components/FiltersModal'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faX, faFilter, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

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
    const [showFiltersModal, setShowFiltersModal] = useState(false)
    const [perPageDropdownOpen, setPerPageDropdownOpen] = useState(false)
    const inputRef = useRef(null)
    const isSmallScreen = useMediaQuery({ maxWidth: 410 })


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

    const handlePerPageChange = (value) => {
        setPerPage(value)
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

    const handleShowFiltersModal = () => {
        setShowFiltersModal(true)
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
        <section className="whiskeys mt-8 mb-4">
            <div className="whiskeys-filters flex flex-nowrap gap-1 items-center justify-between mb-2">

                {/* Search input */}
                <div className='search-input flex flex-nowrap'>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        ref={inputRef}
                        className="p-1 whitespace-nowrap border border-gray-300 rounded"
                        style={isSmallScreen ? { width: '100px', fontSize: 'x-small' } : { width: '150px' }}
                    />
                    <button className={`${isSmallScreen ? 'text-xs ml-1' : 'ml-2'}`} onClick={handleSearch}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                    <button className={`${isSmallScreen ? 'text-xs ml-1' : 'ml-2'}`} onClick={handleClearSearch}>
                        <FontAwesomeIcon icon={faX} />
                    </button>
                    {searchActive && (
                        <div>
                            <p>Currently searching for: <span className='font-semibold'>{searchTerm}</span></p>
                        </div>
                    )}
                </div>

                {/* Filters modal */}
                <div>
                    <button className="p-1 whitespace-nowrap" onClick={handleShowFiltersModal}>Filters <span className={`${isSmallScreen ? '' : 'ml-1'} text-gray-500 text-xs`}><FontAwesomeIcon icon={faFilter} /></span></button>

                    <FiltersModal
                        isOpen={showFiltersModal}
                        onClose={() => setShowFiltersModal(false)}
                        types={whiskeyTypes}
                        distillers={whiskeyDistillers}
                        selectedType={selectedType}
                        selectedDistiller={selectedDistiller}
                        onTypeChange={handleTypeChange}
                        onDistillerChange={handleDistillerChange}
                    />
                </div>

                {/* Per page dropdown */}
                <div className="relative">
                    <div className="flex w-16 items-center">
                        <button
                            className={`py-1 border border-gray-300 rounded ${isSmallScreen ? 'text-xs' : ''}`}
                            style={isSmallScreen ? { width: '55px' } : { width: '70px' }}
                            onClick={() => setPerPageDropdownOpen(!perPageDropdownOpen)}
                        >
                            {perPage} <FontAwesomeIcon icon={perPageDropdownOpen ? faCaretUp : faCaretDown} className="ml-1" />
                        </button>
                    </div>
                    {perPageDropdownOpen && (
                        <div className="absolute right-0 left-auto mt-1 w-12 bg-white border border-gray-300 rounded">
                            <ul>
                                <li className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => { handlePerPageChange(20); setPerPageDropdownOpen(false); }}>20</li>
                                <li className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => { handlePerPageChange(50); setPerPageDropdownOpen(false); }}>50</li>
                                <li className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => { handlePerPageChange(100); setPerPageDropdownOpen(false); }}>100</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Reset filters */}
            <div>
                <button className="reset text-xs sm:text-sm mb-2 mx-3" onClick={handleResetFilters}>
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
