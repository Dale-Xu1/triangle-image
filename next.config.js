const path = require("path")

module.exports = {
    reactStrictMode: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.glsl$/,
            use: [{ loader: path.resolve("components/loader/loader.js") }]
        })
        return config
    }
}
