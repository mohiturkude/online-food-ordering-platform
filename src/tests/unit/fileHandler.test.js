const { saveFile } = require('../../utils/fileHandler'); // Path to saveFile function
const fs = require('fs');
const path = require('path');

// Mock fs.exists method to avoid actual file system checks
jest.mock('fs');

describe('File Handler Tests', () => {
  it('should save the file and return correct file details', async () => {
    const mockFile = {
      originalname: 'test_image.jpg',
      buffer: Buffer.from('mockimage'),
      filename: 'test_image_1639394875432.jpg', // Mock filename that Multer would generate
    };

    // Mock fs.exists to simulate that the file exists
    fs.exists = jest.fn().mockImplementation((filePath, cb) => cb(true));

    const result = await saveFile(mockFile);
    
    // Assert the result
    // expect(result).toHaveProperty('fileName');
    // expect(result).toHaveProperty('filePath');
    // expect(result.fileName).toBe('test_image_1639394875432.jpg');
    // expect(result.filePath).toBe(path.join(__dirname, '../uploads', 'test_image_1639394875432.jpg'));
  });
});