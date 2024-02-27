const { Schema, model } = require('mongoose');
const { hash, compare } = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        // Validate email format using a regular expression
        validate: {
            validator(val) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(val)
            },
            message() {
                return 'You must use a valid email address'
            }
        }
    },
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: [3, 'Username must be at least 3 characters long'],
        maxLength: [16, 'Username must be under 16 characters long']
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'Password must be at least 6 characters long']
    },
    userCollection: [{
        type: Schema.Types.ObjectId,
        ref: 'UserCollection',
    }],
}, {
    timestamps: true,
    methods: {
        // Method to validate a password against the stored hash
        async validatePass(formPassword) {
            const is_valid = await compare(formPassword, this.password);

            return is_valid;
        }
    },
    toJSON: {
        transform(_, user) {
            // Remove version and password fields from the JSON representation
            delete user._v;
            delete user.password;
            return user;
        }
    }
});

// Middleware to hash the password before saving a new user
userSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Hash the password with bcrypt and a cost factor of 10
        this.password = await hash(this.password, 10);
    }

    next();
});

// Create the User model using the defined schema
const User = model('User', userSchema);

module.exports = User;
