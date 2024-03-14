import { NavLink } from 'react-router-dom'

const WhiskeyItem = ({ whiskey }) => {
  return (
    <tr key={whiskey._id}>
      <td className="whiskey-link px-6 py-4 whitespace-no-wrap">
        <NavLink to={`/whiskeys/${whiskey._id}`}>{whiskey.name}</NavLink>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap">
        <img src={whiskey.image} alt={whiskey.name} className="h-10" />
      </td>
      <td className="px-6 py-4 whitespace-no-wrap">{whiskey.type}</td>
      <td className="px-6 py-4 whitespace-no-wrap">{whiskey.stats.distiller}</td>
      <td className="px-6 py-4 whitespace-no-wrap">{whiskey.stats.abv}</td>
      <td className="px-6 py-4 whitespace-no-wrap">{whiskey.rating}</td>
    </tr>
  )
}

export default WhiskeyItem
