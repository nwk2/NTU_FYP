import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = props => (
  <ContentLoader 
    height={160}
    width={400}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <rect x="8" y="18" rx="3" ry="3" width="350" height="6.4" /> 
    <rect x="9" y="44.67" rx="3" ry="3" width="235.6" height="6.08" /> 
    <rect x="11" y="76.35" rx="3" ry="3" width="136.68" height="6.34" /> 
    <rect x="11" y="95.35" rx="3" ry="3" width="136.68" height="6.34" /> 
    <rect x="10" y="126.67" rx="3" ry="3" width="289.44" height="7.36" />
  </ContentLoader>
)

export default MyLoader