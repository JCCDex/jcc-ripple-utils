module.exports = function(api) {
  api.cache(true);

  const presets = [
    ["@babel/env", {
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }]
  ]

  const plugins = [
    [
      "@babel/transform-runtime",
      {
        "regenerator": true
      }
    ]
  ]
  return {
    presets,
    plugins
  };
}