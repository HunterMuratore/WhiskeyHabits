import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

function PerPage({ perPage, handlePerPageChange, page1, page2, page3 }) {
    const [perPageDropdownOpen, setPerPageDropdownOpen] = useState(false)
    const isMedScreen = useMediaQuery({ maxWidth: 600 })

    return (
        <div className="relative">
            <div className="flex items-center">
                <button
                    className={`${isMedScreen ? 'w-12' : 'w-14'} py-1 p-2 border whitespace-nowrap border-gray-300 rounded`}
                    onClick={() => setPerPageDropdownOpen(!perPageDropdownOpen)}
                >
                    {perPage} <FontAwesomeIcon icon={perPageDropdownOpen ? faCaretUp : faCaretDown} className="ml-1" />
                </button>
            </div>
            {perPageDropdownOpen && (
                <div className={`${isMedScreen ? 'w-12' : 'w-14'} absolute text-right right-auto mt-1  bg-white border border-gray-300 rounded`}>
                    <ul>
                        <li className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => {
                            handlePerPageChange(page1)
                            setPerPageDropdownOpen(false)
                        }}>{page1}</li>
                        <li className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => {
                            handlePerPageChange(page2)
                            setPerPageDropdownOpen(false)
                        }}>{page2}</li>
                        <li className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => {
                            handlePerPageChange(page3)
                            setPerPageDropdownOpen(false)
                        }}>{page3}</li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default PerPage
