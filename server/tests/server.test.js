const request = require('supertest');
const app = require('../server'); // Assuming this exports an instance of Express app

let server;

beforeAll((done) => {
    server = app.listen(8000, () => {
        console.log('Test server running on port 8000');
        done();
    });
});

afterAll((done) => {
    server.close(() => {
        console.log('Test server closed');
        done();
    });
});

describe('Express App Tests', () => {
    it('should respond to the GET method', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Hello World!');
    });

    it('should handle user registration', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'newuser@example.com',
                username: 'newuser',
                password: 'Test1234',
                verifyPassword: 'Test1234'
            });
        expect(response.status).toBe(200);
    });

    it('should return 401 for incorrect login credentials', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ email: 'fakeuser@example.com', password: 'wrongpassword' });
        expect(response.status).toBe(401);
    });
});

