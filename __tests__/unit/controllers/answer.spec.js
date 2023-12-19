const Answer = require('../../../models/answer');
const answerController = require('../../../controllers/answer');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn((code) => ({ send: mockSend, json: mockJson }));
const mockRes = { status: mockStatus };

describe('answer controller', () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());

  it('is defined', () => {
    expect(answerController).toBeDefined();
  });

  describe('showByQuestion', () => {
    it('should retrieve answers by question ID successfully', async () => {
      const expectedAnswers = [
        { _id: '1', text: 'Answer 1', isCorrect: false, questionId: '123' },
        { _id: '2', text: 'Answer 2', isCorrect: true, questionId: '123' }
      ];
      const mockReq = { params: { questionId: '123' } };

      jest.spyOn(Answer, 'find').mockResolvedValue(expectedAnswers);

      await answerController.showByQuestion(mockReq, mockRes);

      expect(Answer.find).toHaveBeenCalledWith({ questionId: '123' });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(expectedAnswers);
    });

    it('should handle errors', async () => {
      const mockReq = { params: { questionId: '123' } };

      jest
        .spyOn(Answer, 'find')
        .mockRejectedValue(new Error('Error fetching answers'));

      await answerController.showByQuestion(mockReq, mockRes);

      expect(Answer.find).toHaveBeenCalledWith({ questionId: '123' });
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Error fetching answers'
      });
    });
  });

  describe('create', () => {
    it('should create a new answer successfully', async () => {
      const newAnswer = {
        text: 'New Answer',
        isCorrect: true,
        questionId: '456'
      };

      const savedAnswer = { _id: '3', ...newAnswer };

      const mockReq = { body: newAnswer };

      jest.spyOn(Answer, 'create').mockResolvedValue(savedAnswer);

      await answerController.create(mockReq, mockRes);

      expect(Answer.create).toHaveBeenCalledWith(newAnswer);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(savedAnswer);
    });

    it('should handle errors during answer creation', async () => {
      const newAnswer = {
        text: 'New Answer',
        isCorrect: false,
        questionId: '456'
      };

      const mockReq = { body: newAnswer };

      jest
        .spyOn(Answer, 'create')
        .mockRejectedValue(new Error('Error creating answer'));

      await answerController.create(mockReq, mockRes);

      expect(Answer.create).toHaveBeenCalledWith(newAnswer);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Error creating answer' });
    });
  });
});
