export default (sequelize, type) => {
    return sequelize.define('organization', {
        id: {
            type: type.STRING(17),
            primaryKey: true,
        },
        json: type.JSONB
    })
}