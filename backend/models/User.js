const mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ["ADMIN", "USER"],
    message: '{VALUE} no es un role válido'
}

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El correo es necesario"],
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
    },
    role: {
        type: String,
        default: 'USER',
        required: [true],
        enum: rolesValidos,
    },

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],

    pending_friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],

    reputation: {
        type: Number,
        min: 0,
        required: true
    }
});

// Elimina la key password del objeto que retorna al momento de crear un usuario
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
 }


userSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

let UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;