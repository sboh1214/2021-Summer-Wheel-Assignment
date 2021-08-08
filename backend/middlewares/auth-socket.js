const secret = require('../utils/secret');
const jwt = require('jsonwebtoken');

function auth(socket, next) {
    if (socket.handshake.query && socket.handshake.query.token){
        //TODO: 주어진 socket.handshake.query.token 인증하기 [security]
        //socket을 통한 통신은 항상 유효한 token이 같이 보내져야 이용 가능, auth error시 socket에 즉시 오류 전달, 프론트가 로그아웃시킴
        //비밀키는 secret에 있음
        //jwt 라이브러리 이용

        jwt.verify(socket.handshake.query.token, secret, (err, decoded) => {
            if (err){
                console.log("Auth error: verify failed");
                socket.emit('auth_error', {});
                return next();
            }
            if(decoded && decoded.type === 'auth'){
                socket.user_id = decoded.id;
                console.log('Auth success at socket:', socket.user_id)
                next();
            }
        });
    } else{
        console.log("Auth error: Token not found");
        socket.emit('auth_error', {});
        return next();
    }
}


module.exports = auth;
