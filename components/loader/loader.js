"use strict"

module.exports = async function (source)
{
    let loader = this
    let callback = loader.async()

    function resolve(path)
    {
        // Resolve require path to absolute path
        return new Promise((res, rej) => loader.resolve(loader.context, `./${path}`, function (error, path)
        {
            if (error) return rej(error)
            loader.addDependency(path) // Mark file as dependency

            res(path)
        }))
    }

    async function process(source)
    {
        // Find include statements
        let matches = source.matchAll(/#include "([.\/\w_-]+)"/g)
        for (let match of matches)
        {
            let statement = match[0]
            let path = await resolve(match[1])

            // Read and process file contents
            let content = await readFile(path)
            content = await process(content)

            // Replace include statement with processed content
            source = source.replace(statement, content)
        }

        return source
    }

    try
    {
        source = await process(source)
        callback(null, `export default ${JSON.stringify(source)}`)
    }
    catch (error)
    {
        callback(error)
    }
}

function readFile(path)
{
    // fs.readFile() but with promises
    return new Promise((res, rej) => fs.readFile(path, "utf-8", function (error, source)
    {
        if (error) return rej(error)
        res(source)
    }))
}
