import React from 'react'

const className = 'cx-bg-white cx-p-4 cx-h-full cx-shadow-xs cx-overflow-y-overlay'

const MainLayout: React.FC = (props) => {
  return <div className={className}>{props.children}</div>
}

export default MainLayout
