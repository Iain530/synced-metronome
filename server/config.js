
const dev = {
    socketio: {
        path: '/',
    },
};

const prod = {
    socketio: {
        path: '/api/v1/socket.io'
    },
};

exports.config = process.env.NODE_ENV === 'production' ? prod : dev;
