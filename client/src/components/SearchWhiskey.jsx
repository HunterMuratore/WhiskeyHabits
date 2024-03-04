import { useState } from 'react'

const SearchWhiskey = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <input
      type="text"
      placeholder="Search by name..."
      value={searchTerm}
      onChange={handleSearch}
      className="p-1 border border-gray-300 rounded"
    />
  )
}

export default SearchWhiskey
