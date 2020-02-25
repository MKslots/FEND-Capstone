const request = require('supertest')
const server = require('../src/server/index.js')

test('server status', () => {
    const res = request(server)
        .get('/')
        .then(res => {
            expect(res.statusCode).toBe(200)
        })
})