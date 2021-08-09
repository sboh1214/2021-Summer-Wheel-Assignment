# sparcschat

## 관리

### 구성
서버에서 80, 443, 389 포트를 개방합니다.

### 백업
crontab -e
* * * * * sudo bash /home/ubuntu/2021-summer-wheel-assignment/backup.sh

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
