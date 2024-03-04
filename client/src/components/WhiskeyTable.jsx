import { useState, useEffect } from 'react'

import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_WHISKEYS } from '../utils/queries'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

import LoadingSpinner from './LoadingSpinner'
import Search from './SearchWhiskey'
import Pagination from './Pagination'
import WhiskeyItem from './WhiskeyItem'

const WhiskeyTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [perPage, setPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortByName, setSortByName] = useState('asc')
  const [sortByScore, setSortByScore] = useState(null)

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

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

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

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  if (loading) return <LoadingSpinner />

  return (
    <section className="whiskeys">
      <div className="flex justify-between mb-4">
        <Search onSearch={handleSearch} />
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
            <WhiskeyItem key={whiskey._id} whiskey={whiskey} />
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </section>
  )
}

export default WhiskeyTable