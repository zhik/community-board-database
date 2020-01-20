export default (sequelize, type) => {
    return sequelize.define('contact', {
        id: {
            type: type.STRING(17),
            primaryKey: true,
        },
        json: type.JSONB
    })
}