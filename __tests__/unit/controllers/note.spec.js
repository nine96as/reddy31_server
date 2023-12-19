const Note = require('../../../models/note');
const Token = require('../../../models/token');
const User = require('../../../models/user');
const noteController = require('../../../controllers/note');
const Subject = require('../../../models/subject');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();
const mockStatus = jest.fn((code) => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd
}));
const mockRes = { status: mockStatus };

describe('note controller', () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());

  it('is defined', () => {
    expect(noteController).toBeDefined();
  });

  describe('index', () => {
    it('should return notes with status code 200', async () => {
      const testNotes = [
        {
          _id: 'note1Id',
          title: 'note1title',
          content: 'note1content',
          userId: 'relatedUser1',
          subjectId: 'relatedSubject1'
        },
        {
          _id: 'note2Id',
          title: 'note2title',
          content: 'note2content',
          userId: 'relatedUser2',
          subjectId: 'relatedSubject2'
        }
      ];

      jest.spyOn(Note, 'find').mockResolvedValue(testNotes);

      await noteController.index(null, mockRes);

      expect(Note.find).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        count: testNotes.length,
        data: testNotes
      });
      expect(mockEnd).not.toHaveBeenCalled();
    });

    it('should send an error when failing to return Posts', async () => {
      jest
        .spyOn(Note, 'find')
        .mockRejectedValue(new Error('Something happened to your db'));

      await noteController.index(null, mockRes);
      expect(Note.find).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Something happened to your db'
      });
    });
  });

  describe('create', () => {
    it('should return created note with status code 201', async () => {
      const noteData = {
        title: 'a note',
        content: 'content'
      };

      const mockNote = {
        _id: 'noteId',
        title: 'a note',
        content: 'content',
        userId: 'userIdOne',
        subjectId: 'subjectIdOne'
      };

      const mockToken = {
        _id: 'tokenId',
        token: 'mockedToken',
        userId: 'userIdOne'
      };

      const mockSubject = {
        _id: 'subjectIdOne',
        name: 'subjectName'
      };

      const mockReq = {
        headers: { authorization: 'mockedToken' },
        body: noteData
      };

      jest.spyOn(Token, 'findOne').mockResolvedValue(mockToken);
      Subject.find = jest.fn().mockImplementationOnce(() => ({
        sort: jest.fn().mockImplementationOnce(() => ({
          limit: jest.fn().mockResolvedValueOnce([mockSubject])
        }))
      }));
      jest.spyOn(Note, 'create').mockResolvedValue(mockNote);

      await noteController.create(mockReq, mockRes);

      expect(Token.findOne).toHaveBeenCalledWith({ token: 'mockedToken' });
      expect(Note.create).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockSend).toHaveBeenCalledWith(mockNote);
    });

    it('should send an error when missing required fields', async () => {
      const noteData = {
        a: 'a note',
        b: 'content'
      };

      const mockToken = {
        _id: 'tokenId',
        token: 'mockedToken',
        userId: 'userIdOne'
      };

      const mockReq = {
        headers: { authorization: 'mockedToken' },
        body: noteData
      };

      jest.spyOn(Token, 'findOne').mockResolvedValue(mockToken);

      await noteController.create(mockReq, mockRes);

      expect(Token.findOne).toHaveBeenCalledWith({ token: 'mockedToken' });
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'You must send all required fields: title, author'
      });
    });

    it('should send an error upon fail', async () => {
      const noteData = {
        title: 'a note',
        content: 'content'
      };

      const mockToken = {
        _id: 'tokenId',
        token: 'mockedToken',
        userId: 'userIdOne'
      };

      const mockSubject = {
        _id: 'subjectIdOne',
        name: 'subjectName'
      };

      const mockReq = {
        headers: { authorization: 'mockedToken' },
        body: noteData
      };

      jest.spyOn(Token, 'findOne').mockResolvedValue(mockToken);
      Subject.find = jest.fn().mockImplementationOnce(() => ({
        sort: jest.fn().mockImplementationOnce(() => ({
          limit: jest.fn().mockResolvedValueOnce([mockSubject])
        }))
      }));
      jest
        .spyOn(Note, 'create')
        .mockRejectedValue(new Error('Error creating note'));

      await noteController.create(mockReq, mockRes);

      expect(Token.findOne).toHaveBeenCalledWith({ token: 'mockedToken' });
      expect(Note.create).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Error creating note'
      });
    });
  });

  describe('show', () => {
    let testNote, mockReq;
    beforeEach(() => {
      testNote = {
        _id: 'note1Id',
        title: 'a title',
        content: 'some content',
        userId: 'userId',
        subjectId: 'subjectId'
      };
      mockReq = { params: { id: 'note1Id' } };
    });

    it('should return a note with status code 200', async () => {
      jest.spyOn(Note, 'findById').mockResolvedValue(testNote);

      await noteController.show(mockReq, mockRes);

      expect(Note.findById).toHaveBeenCalledTimes(1);
      expect(Note.findById).toHaveBeenCalledWith('note1Id');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(testNote);
    });

    it('should send an error upon fail', async () => {
      jest
        .spyOn(Note, 'findById')
        .mockRejectedValue(new Error('Note not found'));

      await noteController.show(mockReq, mockRes);

      expect(Note.findById).toHaveBeenCalledTimes(1);
      expect(Note.findById).toHaveBeenCalledWith('note1Id');
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Note not found' });
    });
  });

  describe('update', () => {
    it('should return updated note with status code 200', async () => {
      const noteData = {
        title: 'a notee'
      };

      const mockNote = {
        _id: 'noteId',
        title: 'a note',
        content: 'content',
        userId: 'userId',
        subjectId: 'subjectId'
      };

      const mockUpdatedNote = {
        _id: 'noteId',
        title: 'a notee',
        content: 'content',
        userId: 'userId',
        subjectId: 'subjectId'
      };

      const mockToken = {
        _id: 'tokenId',
        token: 'mockedToken',
        userId: 'userId'
      };

      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const mockReq = {
        headers: { authorization: 'mockedToken' },
        body: noteData,
        params: { id: 'noteId' }
      };

      jest.spyOn(Token, 'findOne').mockResolvedValue(mockToken);
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(Note, 'findById').mockResolvedValue(mockNote);
      jest.spyOn(Note, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedNote);

      await noteController.update(mockReq, mockRes);

      expect(Token.findOne).toHaveBeenCalledWith({ token: 'mockedToken' });
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(Note.findById).toHaveBeenCalledTimes(1);
      expect(Note.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUpdatedNote);
    });

    it('should send an error when missing required fields', async () => {
      const noteData = {
        a: 'a notee'
      };

      const mockNote = {
        _id: 'noteId',
        title: 'a note',
        content: 'content',
        userId: 'userId',
        subjectId: 'subjectId'
      };

      const mockToken = {
        _id: 'tokenId',
        token: 'mockedToken',
        userId: 'userId'
      };

      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const mockReq = {
        headers: { authorization: 'mockedToken' },
        body: noteData,
        params: { id: 'noteId' }
      };

      jest.spyOn(Token, 'findOne').mockResolvedValue(mockToken);
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(Note, 'findById').mockResolvedValue(mockNote);

      await noteController.update(mockReq, mockRes);

      expect(Token.findOne).toHaveBeenCalledWith({ token: 'mockedToken' });
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(Note.findById).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'You must specify one of: title, content'
      });
    });

    it('should send an error if the user is not the note creator', async () => {
      const noteData = {
        title: 'a notee'
      };

      const mockNote = {
        _id: 'noteId',
        title: 'a note',
        content: 'content',
        userId: 'userIdTwo',
        subjectId: 'subjectId'
      };

      const mockToken = {
        _id: 'tokenId',
        token: 'mockedToken',
        userId: 'userId'
      };

      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const mockReq = {
        headers: { authorization: 'mockedToken' },
        body: noteData,
        params: { id: 'noteId' }
      };

      jest.spyOn(Token, 'findOne').mockResolvedValue(mockToken);
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(Note, 'findById').mockResolvedValue(mockNote);

      await noteController.update(mockReq, mockRes);

      expect(Token.findOne).toHaveBeenCalledWith({ token: 'mockedToken' });
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(Note.findById).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(403);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'You must be the note creator to update the note!'
      });
    });

    it('should send an error upon fail', async () => {
      const noteData = {
        title: 'a notee'
      };

      const mockToken = {
        _id: 'tokenId',
        token: 'mockedToken',
        userId: 'userId'
      };

      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const mockReq = {
        headers: { authorization: 'mockedToken' },
        body: noteData,
        params: { id: 'noteIdTwo' }
      };

      jest.spyOn(Token, 'findOne').mockResolvedValue(mockToken);
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(Note, 'findById')
        .mockRejectedValue(new Error('Note not found'));

      await noteController.update(mockReq, mockRes);

      expect(Token.findOne).toHaveBeenCalledWith({ token: 'mockedToken' });
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(Note.findById).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Note not found' });
    });
  });

  describe('destroy', () => {
    it('should return deleted note with status code 200', async () => {
      const mockNote = {
        _id: 'noteId',
        title: 'a title',
        content: 'some content',
        userId: 'userId',
        subjectId: 'subjectId'
      };

      const mockToken = {
        _id: 'tokenId',
        token: 'mockedToken',
        userId: 'userId'
      };

      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const mockReq = {
        headers: { authorization: 'mockedToken' },
        params: { id: 'noteId' }
      };

      jest.spyOn(Token, 'findOne').mockResolvedValue(mockToken);
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(Note, 'findById').mockResolvedValue(mockNote);
      jest.spyOn(Note, 'findByIdAndDelete').mockResolvedValue(mockNote);

      await noteController.destroy(mockReq, mockRes);

      expect(Token.findOne).toHaveBeenCalledWith({ token: 'mockedToken' });
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(Note.findById).toHaveBeenCalledTimes(1);
      expect(Note.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockNote);
    });

    it('should send an error if the user is not the note creator', async () => {
      const mockNote = {
        _id: 'noteId',
        title: 'a title',
        content: 'some content',
        userId: 'userIdTwo',
        subjectId: 'subjectId'
      };

      const mockToken = {
        _id: 'tokenId',
        token: 'mockedToken',
        userId: 'userId'
      };

      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const mockReq = {
        headers: { authorization: 'mockedToken' },
        params: { id: 'noteId' }
      };

      jest.spyOn(Token, 'findOne').mockResolvedValue(mockToken);
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(Note, 'findById').mockResolvedValue(mockNote);

      await noteController.destroy(mockReq, mockRes);

      expect(Token.findOne).toHaveBeenCalledWith({ token: 'mockedToken' });
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(Note.findById).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(403);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'You must be the note creator to delete the note!'
      });
    });

    it('should send an error upon fail', async () => {
      const mockToken = {
        _id: 'tokenId',
        token: 'mockedToken',
        userId: 'userId'
      };

      const mockUser = {
        _id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      const mockReq = {
        headers: { authorization: 'mockedToken' },
        params: { id: 'noteIdTwo' }
      };

      jest.spyOn(Token, 'findOne').mockResolvedValue(mockToken);
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(Note, 'findById')
        .mockRejectedValue(new Error('Note not found'));

      await noteController.destroy(mockReq, mockRes);

      expect(Token.findOne).toHaveBeenCalledWith({ token: 'mockedToken' });
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(Note.findById).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Note not found' });
    });
  });
});
