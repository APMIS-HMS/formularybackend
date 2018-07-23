// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const Schema = mongooseClient.Schema;
    const users = new mongooseClient.Schema({
        email: { type: String, unique: true, required: true },
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        userRoleId: { type: Schema.Types.ObjectId, required: true },
        isActive: { type: Boolean, 'default': false }
    }, {
        timestamps: true
    });

    return mongooseClient.model('users', users);
};