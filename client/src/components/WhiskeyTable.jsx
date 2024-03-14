import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

import WhiskeyItem from './WhiskeyItem'

const WhiskeyTable = ({ data, sortByName, sortByScore, handleSortByName, handleSortByScore, perPage }) => {
  return (
      <table className="whiskey-table min-w-full divide-y divide-gray-200">
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
  )
}

export default WhiskeyTable