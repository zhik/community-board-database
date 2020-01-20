//todo BelongsToMany
//https://khalilstemmler.com/articles/sequelize-tags-junction-pattern/

export default (sequelize, type, references) => {
    const model = sequelize.define('request', {
        id: {
            type: type.STRING(17),
            primaryKey: true,
        },
        organizations: {
            type: type.ARRAY({
                type: type.STRING(17),
                references: {
                    model: references.Organization,
                    key: 'id'
                },
                allowNull: false
            })
        },
        contacts: {
            type: type.ARRAY({
                type: type.STRING(17),
                references: {
                    model: references.Contact,
                    key: 'id'
                },
                allowNull: false
            })
        },
        updates: {
            type: type.ARRAY({
                type: type.STRING(17),
                references: {
                    model: references.Update,
                    key: 'id'
                },
                allowNull: false
            })
        },
        last_address: type.TEXT,
        address: type.TEXT,
        location: type.GEOMETRY('POINT', 4326),
        json: type.JSONB
    })

    model.prototype.getUpdates = async (database) => {
        return await database.Update.findAll({
            where: {
                id: this.getDataValue('updates')
            }
        })
    }


    return model;
}