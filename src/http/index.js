import axios from "axios"
import store from "../store"

const http = axios.create({
    baseURL: "/api",
    headers: { "content-type": "application/json" },
})

http.interceptors.request.use(
    config => {
        const isAuthenticated = store.getters["isAuthenticated"]
        if (isAuthenticated) {
            //TODO: token이 client에 저장되어있으면 항상 요청보낼때 헤더에 토큰 정보 담아서 보내기 [network]
            //힌트: 토큰 기반 인증에서 자주 쓰이는 헤더, 한단어
            //원래는 token 앞에 Bearer 라는 키워드를 붙여서 <type> <token> 형식으로 보내는 것이 표준이다.
            config.headers.common["Authorization"] = store.getters["getAccessToken"]
        }
        return config
    },
    error => {
        // Do something with request error
        Promise.reject(error)
    }
)
http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"

export default http
