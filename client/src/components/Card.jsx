import { useContext } from 'react'
import '../style/SelectFood.css'
function Card({ item, state, set }) {

  return (
    <div className="cards">
      {item.map((item) => (
        
        <div className="one-card" onClick={() => { set(item.value)}}>
          <p className='type'>{item.text}</p>
          <p className='icon'>{item?.icon}</p>
        </div>
      ))}
    </div>
  )
}

export default Card
