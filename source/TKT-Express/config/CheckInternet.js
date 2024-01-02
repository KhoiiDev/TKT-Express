const http = require('http');

const checkInternetConnection = (req, res, next) => {
    const options = {
        hostname: 'www.google.com',
        port: 80,
        path: '/',
        method: 'GET'
    };

    const request = http.request(options, (response) => {
        if (response.statusCode === 200) {
            // Nếu kết nối thành công, tiếp tục đến middleware tiếp theo
            next();
        } else {
            // Nếu kết nối không thành công, trả về lỗi
            res.status(404);
            // res.render("404", {
            //     layout: false,
            // });
        }
    });

    request.on('error', (error) => {
        // console.error(error);
        // res.render("404", {
        //     layout: false,
        // });
        res.status(404);
    });

    request.end();
};

module.exports = checkInternetConnection;