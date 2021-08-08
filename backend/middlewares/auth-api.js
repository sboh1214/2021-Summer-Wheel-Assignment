const secret = require('../utils/secret');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    //TODO: 요청의 어떤 헤더에 토큰이 담겨 있으면 추출하기 [network]
    //힌트: 토큰 기반 인증에서 자주 쓰이는 헤더, 한단어
    //원래는 <type> <token> 형식으로 받게 되면, type을 확인한 뒤 token을 분리해야 한다.
    const token = req.get('Authorization');

    if (token){
        //TODO: 주어진 token이 유효한지 확인 [security]
        //api는 항상 유효한 token이 같이 보내져야 요청 처리함, auth error 시 403 에러 리턴
        //비밀키는 secret에 있음
        //jwt 라이브러리 이용

        jwt.verify(token, secret, (err, decoded) => {
            if (err){
                console.log("Auth error: Token not found");
                res.status(403).json({
                    ok: false,
                    reason: 'not-logged-in'
                });
                return;
            }
            if(decoded && decoded.type === 'auth') {
                req.user_id = decoded.id;
                console.log('Auth success at api:', req.user_id);
                next();
            }
        });
    }
}

module.exports = auth;
