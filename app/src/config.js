
const dev = {
    timesyncConfig: {
        // eslint-disable-next-line no-restricted-globals
        host: location.href.split("3000")[0] + "3000",
        serverPath: '/',
    },
};

const prod = {
    timesyncConfig: {
        // eslint-disable-next-line no-restricted-globals
        host: `https://${location.hostname}`,
        serverPath: '/api/v1/',
    },
};

export default process.env.NODE_ENV === 'production' ? prod : dev;