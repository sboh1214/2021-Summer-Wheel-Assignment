const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const escape = require('../utils/escape.js');

class Comment extends Model {}
const interleave = (arr, thing) => [].concat(...arr.map(n => [n, thing])).slice(0, -1)

Comment.init({
    name: DataTypes.STRING,
    title: DataTypes.TEXT,
    subtitle: DataTypes.TEXT
}, {sequelize});

Comment.handlers = {
    addComment: async (data, name_by_auth) => {
        const title = data.title;
        const subtitle = data.subtitle;

        await Comment.create({
            name: name_by_auth, title, subtitle
        });

        return true;
    },

    deleteComment: async (data, name_by_auth) => {
        // TODO: name_by_auth가 wheel이면 들어온 항목 무조건 삭제, 그렇지 않으면 본인 확인 후 삭제 [DB]
        // 테이블 속성:
        // id - Comment 고유 id
        // name - 작성자 이름
        // title, subtitle, createdAt

        // Argument:
        // data: 프론트 측에서 삭제 요청과 함께 온 데이터. data.id에 삭제 버튼을 클릭한 Comment id 담겨있음
        // name_by_auth: 요청을 보낸 사람의 이름

        const comment = Comment.query.where({id: data.id})
        if (name_by_auth !== 'wheel' && name_by_auth !== comment.name) {
            return false;
        }

        const where = {where: {
            id: comment.id
          }} //Hint: 5줄 이하, ORM(sequelize)에서 삭제 조건 어떻게 주는지 찾아보기
        await Comment.destroy({where})
            .catch(err => {
                console.log(err);
            });

        return true;
    },

    getComments: async () => {
        const comments = await Comment.findAll({});
        let p = comments.map(({id, name, title, subtitle, createdAt}) => ({
            id,
            name: escape(name),
            title: escape(title),
            subtitle: escape(subtitle),
            info: new Date(createdAt).toLocaleTimeString() + "&nbsp;·&nbsp;" + escape(name)
        }));
        p=interleave(p, { divider: true, inset: true });
        p.push({ header: 'Recent comments'});
        return p.reverse();
    }
}

module.exports = Comment;
