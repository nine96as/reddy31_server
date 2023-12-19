// const request = require('supertest');
// const app = require('../../app'); 

// describe('Register Endpoint Integration Test', () => {
//     it('should register a user successfully', async () => {
//       const userData = {
//         username: 'testuser',
//         email: 'test@example.com',
//         password: 'password123'
//       };
  
//       const response = await request(app)
//         .post('/users/register')
//         .send(userData)
//         .expect(201);
  
//       expect(response.body).toHaveProperty('_id');
//       expect(response.body.username).toBe('testuser');
//       expect(response.body.email).toBe('test@example.com');
      
//     }, ); 
//   });