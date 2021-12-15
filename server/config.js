
const dev = {
    // socketio: {
    //     path: '/api/v1/socket.io',
    // },
};

const prod = {
    // socketio: {
    //     path: '/api/v1/socket.io'
    // },
};

console.log(`Loading config for env: ${process.env.NODE_ENV}`)

exports.config = process.env.NODE_ENV === 'production' ? prod : dev;
