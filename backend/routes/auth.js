const {exec} = require('child_process');
const jwt = require('jsonwebtoken');
const secret = require('../utils/secret')

function escape(str) {
    return str
        .replace(/\\/gi, '\\\\')
        .replace(/"/gi, '\\"')
        .replace(/\$/gi, '\\$');
}

module.exports = (req, res) => {
    let {id, password} = req.body;
    id=escape(id);
    password=escape(password);

    //TODO: ldapwhoami를 통해 유저 검색하기 [LDAP]
    //${id}, ${password}, ${process.env.SPARCS_LDAP_HOST} 포함해 명령어 구성
    //검색이 성공적으로 이루어지면 dn:uid=wheelseminar21,ou=People,dc=sparcs,dc=org 식의 문자열 출력하게 됨 => 로그인 성공
    //검색에 실패하면 오류가 나거나 문자열 출력 없음 => 로그인 실패
    //SPAPCS LDAP DN은 세미나 및 phpldapadmin.sparcs.org 참고
    //alias 대신 /usr/bin/ldapwhoami 바이너리를 직접 실행하기 (alpine linux 사용 위해)

    exec(`/usr/bin/ldapwhoami -x -D uid='${id}',ou=People,dc=sparcs,dc=org -H ${process.env.SPARCS_LDAP_HOST} -w '${password}'`, async (err, stdout, stderr) => {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
        if(err || stdout.length === 0 || stderr.length !== 0){
            res.status(403).json({
                ok: false,
                reason: 'no-such-user-or-wrong-password'
            });
        } else {
            const payload = { id, type: 'auth' };
            const token = await new Promise(resolve => {
                //TODO: payload와 비밀 키 secret으로부터 jwt 토큰 생성하기 [security]
                //만료 기간은 적당히 (6시간)
                //토큰과 함께 로그인 성공 알림
                //jwt 라이브러리 사용
                /*TODO*/ 
                jwt.sign(payload, secret, {expiresIn: "6h"}, (err, token) => {
                    if (err) {
                        resolve(null);
                        return;
                    }
                    resolve(token);
                });
            });

            console.log(token);

            res.json({
                ok: true,
                token
            });

        }
    });
}
