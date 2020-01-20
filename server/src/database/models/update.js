export default (sequelize, type) => {
    return sequelize.define('update', {
        id: {
            type: type.STRING(17),
            primaryKey: true,
        },
        json: type.JSONB
    })
}