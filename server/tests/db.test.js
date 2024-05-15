const User = require('../models/users');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('User Model Test', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should create and save a user successfully', async () => {
        const userData = { email: 'test@example.com', username: 'testuser', passwordHash: 'hash', firstName: 'Test', lastName: 'User' };
        const validUser = new User(userData);
        const savedUser = await validUser.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe(userData.email);
    });

    it('should not save a user without the required fields', async () => {
        const userWithInvalidField = new User({ email: 'test@example.com' });
        let err;
        try {
            const savedUserWithInvalidField = await userWithInvalidField.save();
            error = savedUserWithInvalidField;
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should update a user password', async () => {
        const user = await User.findOne({ email: 'test@example.com' });
        user.passwordHash = 'newhash';
        const updatedUser = await user.save();
        expect(updatedUser.passwordHash).toBe('newhash');
    });
});

