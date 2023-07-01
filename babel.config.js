module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			[
				"module-resolver",
				{
					alias: {
						"@components": "./src/components",
						"@utils": "./src/utils",
            "@hooks": "./src/hooks",
            "@context": "./src/context",
            "@navigation": "./src/Navigation"
					},
					extensions: [".js", ".jsx", ".ts", ".tsx"],
				},
			],
		],
	};
};
