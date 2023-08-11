import * as React from "react";
import Svg, { SvgProps, Defs, G, Path } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: style */
const Spears = (props: SvgProps) => (
	<Svg
		xmlns='http://www.w3.org/2000/svg'
		xmlSpace='preserve'
		width={props.width}
		height={props.height}
		style={{
			shapeRendering: "geometricPrecision",
			textRendering: "geometricPrecision",
			imageRendering: "optimizeQuality",
			fillRule: "evenodd",
			clipRule: "evenodd",
		}}
		viewBox='0 0 2000 2000'
		{...props}
	>
		<Defs></Defs>
		<G id='Layer_x0020_1'>
			<Path
				d='m853 1053 63 62 42-42-63-62c0 39-6 42-42 42zm662-74h-138l-25 49c-4 9-13 15-23 15h-109l-109 109 414 414c51 51 15 140-58 140-22 0-43-9-58-24l-414-414-404 404c-32 32-84 32-116 0s-32-84 0-116l404-404-99-99H671c-10 0-19-6-23-15l-25-49H485c-10 0-19-6-24-15L149 342c-11-23 13-46 35-35l633 311c9 5 15 14 15 24v139l49 24c9 4 14 13 14 23v109l100 99 110-109V818c0-9 5-19 14-23l49-24V632c0-10 6-19 15-24l633-311c22-11 46 12 35 35l-312 632c-5 9-14 15-24 15zm-113-52h97l271-550-549 271v97l289-143c22-11 46 13 35 35l-143 290zm-255 116c-37 0-42-5-42-42l-593 592c-28 28 15 69 42 42l593-592zm46-52h120l151-308-307 152v119l124-124c24-25 61 12 37 36l-125 125zm-119 198-42 42 414 414c27 28 70-14 42-42l-414-414zM598 937 455 647c-11-22 13-46 35-35l289 143v-97L230 387l271 550h97zm-62-244 151 308h120L682 876c-24-24 13-61 37-36l124 124V845c-102-51-205-102-307-152z'
				style={{
					fill: props.color,
				}}
			/>
			<Path
				d='M1510 602c22-11 46 13 35 35l-143 290h97l271-550-549 271v97l289-143zM916 1115l42-42-63-62c0 39-6 42-42 42l63 62zM490 612l289 143v-97L230 387l271 550h97L455 647c-11-22 13-46 35-35z'
				className='fil1'
			/>
		</G>
	</Svg>
);
export default Spears;
