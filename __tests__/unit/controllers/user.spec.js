const bcrypt = require('bcrypt');
const { register } = require('../../../controllers/user');
const User = require('../../../models/user');

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn()
}));

describe('Register Function', () => {
  it('should register a user successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    bcrypt.genSalt.mockResolvedValue('mockedSalt');
    bcrypt.hash.mockResolvedValue('hashedPassword');

    User.create = jest.fn().mockImplementation((data) => Promise.resolve({
      _id: 'mockedUserId',
      username: data.username,
      email: data.email
    }));

    const req = { body: userData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await register(req, res);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(expect.any(Number));
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mockedSalt');
    expect(User.create).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'mockedUserId',
      username: 'testuser',
      email: 'test@example.com'
    });
  });

  it('should handle User creation failure', async () => {
    User.create.mockRejectedValue(new Error('User creation failed'));
  
    const req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }
    };
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  
    await register(req, res);
  
    expect(bcrypt.genSalt).toHaveBeenCalledWith(expect.any(Number));
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', expect.any(String));
  

    expect(User.create).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: expect.any(String) 
    });
  
    expect(res.status).toHaveBeenCalledWith(400); 
    expect(res.json).toHaveBeenCalledWith({ error: 'User creation failed' }); 
  });  
  

});


