module.exports = {
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public',
            redirectToSlash: true,
            index: true
        }
    }
};
