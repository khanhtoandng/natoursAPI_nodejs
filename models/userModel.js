const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please tell us your name!']
    },
    email:{
        type: String,
        require: [true, 'Please tell us your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    photo:{
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'guide'],
        default: 'user'
    },
    password:{
        type: String,
        require: [true, 'Please provide a password!'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Please provide a password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: "Password are not the same!"
        }
    },
    passwordChangeAt: Date,
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangeAt) {
        const changedTimestamp = parseInt(this.passwordChangeAt.getTimestamp() / 10, 10);

        return JWTTimestamp < changedTimestamp;
    };

    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;