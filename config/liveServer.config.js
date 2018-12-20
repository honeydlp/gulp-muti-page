module.exports = function (headerMiddleware, proxy) {
    return {
        port: 2222, // Set the server port. Defaults to 8080. 
        host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP. 
        root: "./app", // Set root directory that's being served. Defaults to cwd. 
        open: true, // When false, it won't load your browser by default. 
        ignore: '', // comma-separated string for paths to ignore 
        file: "", // When set, serve this file for every 404 (useful for single-page applications) 
        wait: 0, // Waits for all changes, before reloading. Defaults to 0 sec. 
        mount: [], // Mount a directory to a route. 
        logLevel: 2, // 0 = errors only, 1 = some, 2 = lots 
        cors: true,
        watch: './app', //=PATH - comma-separated string of paths to exclusively watch for changes (default: watch everything)
        proxy: proxy,
        // Takes an array of Connect-compatible middleware that are injected into the server middleware stack 
        middleware: [ headerMiddleware ]
    }
}