const bcrypt = require('bcrypt');
const userController = require('../../../controllers/user');
const User = require('../../../models/user');
const Token = require('../../../models/token');


const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn((code) => ({ send: mockSend, json: mockJson }));
const mockRes = { status: mockStatus };

describe('user controller', () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());

  it('is defined', () => {
    expect(userController).toBeDefined();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const testUser = {
        _id: 'userId',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const mockReq = { body: userData };

      // Mock bcrypt.genSalt and bcrypt.hash
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('mockedSalt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      jest.spyOn(User, 'create').mockResolvedValue(testUser);

      await userController.register(mockReq, mockRes);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(
        parseInt(process.env.BCRYPT_SALT_ROUNDS)
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('hashedPassword', 'mockedSalt');
      expect(User.create).toHaveBeenCalledTimes(1);
      expect(User.create).toHaveBeenCalledWith(userData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(testUser);
    });

    it('should handle User creation failure', async () => {
      const userData = {
        username: 'testuser'
      };

      const mockReq = { body: userData };

      jest
        .spyOn(User, 'create')
        .mockRejectedValue(new Error('User creation failed'));

      await userController.register(mockReq, mockRes);

      expect(User.create).toHaveBeenCalledTimes(1);
      expect(User.create).toHaveBeenCalledWith(userData);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'User creation failed' });
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const testUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const mockReq = { body: userData };

      jest.spyOn(User, 'findOne').mockResolvedValue(testUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const mockToken = {
        token: 'mockedToken'
      };

      jest.spyOn(Token, 'create').mockResolvedValue(mockToken);

      await userController.login(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('hashedPassword', 'hashedPassword');
      expect(Token.create).toHaveBeenCalledWith({ token: expect.any(String), userId: 'userId' });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ authenticated: true, token: 'mockedToken' });
    });

    it('should handle login failure', async () => {
      const userData = {
        email: 'nonexistent@example.com',
        password: 'invalidPassword'
      };

      const mockReq = { body: userData };

      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      await userController.login(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
      expect(mockStatus).toHaveBeenCalledWith(403);
      expect(mockJson).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle incorrect credentials', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'invalidPassword'
      };

      const testUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const mockReq = { body: userData };

      jest.spyOn(User, 'findOne').mockResolvedValue(testUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await userController.login(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('invalidPassword', 'hashedPassword');
      expect(mockStatus).toHaveBeenCalledWith(403);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Incorrect credentials.' });
    });
  });
});
