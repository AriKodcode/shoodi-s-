import React from 'react'

// רקע + צבע לפי ה-value של כל כרטיס
const cardThemes = {
  // סוג ארוחה
  dairy:  { bg: 'linear-gradient(145deg, #FFF9F0 0%, #FFE8C2 100%)', accent: '#F59E0B', shadow: 'rgba(245,158,11,.25)' },
  vegan:  { bg: 'linear-gradient(145deg, #F0FDF4 0%, #BBF7D0 100%)', accent: '#22C55E', shadow: 'rgba(34,197,94,.25)'  },
  meat:   { bg: 'linear-gradient(145deg, #FFF1F2 0%, #FECDD3 100%)', accent: '#F43F5E', shadow: 'rgba(244,63,94,.25)'  },
  // זמן
  1:      { bg: 'linear-gradient(145deg, #FEFCE8 0%, #FEF08A 100%)', accent: '#EAB308', shadow: 'rgba(234,179,8,.25)'  },
  0.5:    { bg: 'linear-gradient(145deg, #FFF7ED 0%, #FED7AA 100%)', accent: '#F97316', shadow: 'rgba(249,115,22,.25)' },
  0:      { bg: 'linear-gradient(145deg, #FFF1F2 0%, #FECDD3 100%)', accent: '#F43F5E', shadow: 'rgba(244,63,94,.25)'  },
}

// fallback כשאין theme — ember
const defaultTheme = { bg: 'linear-gradient(145deg, #FFF8F0 0%, #FFD9C0 100%)', accent: '#FF5C1A', shadow: 'rgba(255,92,26,.22)' }

function getTheme(value) {
  return cardThemes[value] ?? defaultTheme
}

function Card({ item, state, set }) {
  return (
    <div className="cards">
      {item.map((card, index) => {
        const theme    = getTheme(card.value)
        const selected = state === card.value
        return (
          <div
            key={index}
            className={`one-card ${selected ? 'selected' : ''}`}
            style={{
              animationDelay: `${index * 0.08}s`,
              background: theme.bg,
              '--accent':  theme.accent,
              '--shadow':  theme.shadow,
            }}
            onClick={() => set(card.value)}
          >
            {/* הילה מאחורי האייקון */}
            <div className="icon-glow" style={{ background: theme.accent }} />

            <span className="icon">{card.icon}</span>
            <span className="card-label">{card.text}</span>

           
          </div>
        )
      })}
    </div>
  )
}

export default Card