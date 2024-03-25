import { useMediaQuery } from 'react-responsive'
import { NavLink } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

import WhiskeyItem from './WhiskeyItem'

const WhiskeyTable = ({ data, sortByName, sortByScore, handleSortByName, handleSortByScore, perPage }) => {
  const isSmallScreen = useMediaQuery({ maxWidth: 800 })
  const isMedScreen = useMediaQuery({ maxWidth: 1000 })

  return (
    <>
      {isSmallScreen ? (
        <table className="whiskey-table table-auto min-w-full divide-y divide-gray-200">
          <colgroup>
            <col style={{ width: '50%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <thead>
            <tr>
              <th className="whitespace-nowrap px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Name
                <FontAwesomeIcon
                  icon={sortByName === 'asc' ? faCaretUp : faCaretDown}
                  onClick={handleSortByName}
                  className="ml-1 cursor-pointer"
                />
              </th>
              <th className="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="whitespace-nowrap px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
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
                <td className="whiskey-link px-3 py-2 whitespace-wrap text-sm font-medium text-gray-900">
                  <NavLink to={`/whiskeys/${whiskey._id}`}>{whiskey.name}</NavLink>
                </td>
                <td className="px-3 py-2 whitespace-wrap text-sm text-center text-gray-900">
                  {whiskey.type}
                </td>
                <td className="whiskey-link px-3 py-2 whitespace-wrap text-center text-sm text-gray-900">
                  {whiskey.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="whiskey-table table-auto min-w-full divide-y divide-gray-200">
          {isMedScreen ? (
            <colgroup>
              <col style={{ width: '35%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '5%' }} />
            </colgroup>
          ) : (
            <colgroup>
              <col style={{ width: '30%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '5%' }} />
            </colgroup>
          )}
          <thead>
            <tr>
              <th className="whitespace-nowrap px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
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
              <th className="whitespace-nowrap px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
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
      )}
    </>
  )
}

export default WhiskeyTable
