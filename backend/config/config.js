var config = {
    sqlserver: {
        user: 'sa',
        password: '123456',
        server: '127.0.0.1', 
        database: 'test',
        port:1433,
        options: {
            encrypt: true, // Use this if you're on Windows Azure
            trustServerCertificate: true
        },
        pool: {
            min: 0,
            max: 10,
            idleTimeoutMillis: 3000
        }
    }
};

module.exports = config;