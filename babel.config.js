module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			[
				"module-resolver",
				{
					alias: {
						"@Components": "./src/components",
						"@Utils": "./src/utils",
					},
					extensions: [".js", ".jsx", ".ts", ".tsx"],
				},
			],
		],
	};
};
