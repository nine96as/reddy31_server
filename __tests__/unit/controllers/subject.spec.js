const subjectController = require('../../../controllers/subject');
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

describe('subject controller', () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());

  it('is defined', () => {
    expect(subjectController).toBeDefined();
  });

  describe('index', () => {
    it('should return subjects with status code 200', async () => {
      const testSubjects = [
        {
          _id: 'subject1Id',
          name: 'subject1Name'
        },
        {
          _id: 'subject2Id',
          name: 'subject2Name'
        }
      ];

      jest.spyOn(Subject, 'find').mockResolvedValue(testSubjects);

      await subjectController.index(null, mockRes);

      expect(Subject.find).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        count: testSubjects.length,
        data: testSubjects
      });
      expect(mockEnd).not.toHaveBeenCalled();
    });

    it('should send an error when failing to return subjects', async () => {
      jest
        .spyOn(Subject, 'find')
        .mockRejectedValue(new Error('Something happened to your db'));

      await subjectController.index(null, mockRes);
      expect(Subject.find).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Something happened to your db'
      });
    });
  });

  describe('create', () => {
    it('should return created subject with status code 201', async () => {
      const subjectData = {
        name: 'a subject'
      };

      const mockSubject = {
        _id: 'subjectId',
        name: 'a subject'
      };

      const mockReq = { body: subjectData };

      jest.spyOn(Subject, 'create').mockResolvedValue(mockSubject);

      await subjectController.create(mockReq, mockRes);

      expect(Subject.create).toHaveBeenCalledWith(subjectData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockSubject);
    });

    it('should send an error upon fail', async () => {
      const subjectData = {
        a: 'a subject'
      };

      const mockReq = { body: subjectData };

      jest
        .spyOn(Subject, 'create')
        .mockRejectedValue({ error: 'Error creating subject' });

      await subjectController.create(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: undefined
      });
    });
  });

  describe('destroy', () => {
    it('should return deleted subject with status code 200', async () => {
      const mockSubject = {
        _id: 'subjectId',
        name: 'a subject'
      };

      const mockReq = {
        params: { id: 'subjectId' }
      };

      jest.spyOn(Subject, 'findByIdAndDelete').mockResolvedValue(mockSubject);

      await subjectController.destroy(mockReq, mockRes);

      expect(Subject.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockSubject);
    });

    it('should send an error if subject was not found', async () => {
      const mockReq = {
        params: { id: 'subjectId' }
      };

      jest.spyOn(Subject, 'findByIdAndDelete').mockResolvedValue(null);

      await subjectController.destroy(mockReq, mockRes);

      expect(Subject.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Subject not found' });
    });

    it('should send an error upon fail', async () => {
      const mockReq = {};

      await subjectController.destroy(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Cannot read properties of undefined (reading 'id')"
      });
    });
  });
});
