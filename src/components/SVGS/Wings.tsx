import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const Wings = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      enableBackground: "new 0 0 122.88 121.46",
    }}
    width={props.width}
    height={props.width}
    viewBox="0 0 122.88 121.46"
    {...props}
  >
    <Path
      d="M12.35 121.46C4.34 111.74.43 102.17.04 92.75-.78 73.01 10.92 58.28 28.3 47.67c18.28-11.16 37.08-13.93 55.36-22.25C92.79 21.27 103.68 14.47 121.8 0c5.92 15.69-12.92 40.9-43.52 54.23 9.48.37 19.69-2.54 30.85-9.74-.76 19.94-16.46 32.21-51.3 36.95 7.33 2.45 16.09 2.58 27.27-.58-10.77 35.95-55.2 10.2-72.75 40.6z"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
      }}
    />
  </Svg>
)
export default Wings
