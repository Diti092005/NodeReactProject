const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// פונקציה לחישוב hash של קובץ
function fileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    stream.on('data', data => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

const ImageUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("Image is required");

    const uploadedFilePath = req.file.path;
    const uploadedFileHash = await fileHash(uploadedFilePath);

    // בדוק אם קובץ עם אותו hash כבר קיים
    const uploadsDir = 'uploads/';
    const files = fs.readdirSync(uploadsDir);

    for (let file of files) {
      const filePath = path.join(uploadsDir, file);
      if (filePath === uploadedFilePath) continue; // אל תשווה את הקובץ לעצמו
      const hash = await fileHash(filePath);
      if (hash === uploadedFileHash) {
        // מחק את הקובץ שהועלה כי הוא כפול
        fs.unlinkSync(uploadedFilePath);
        return res.status(409).send("Duplicate image exists on server");
      }
    }

   
    // אם לא נמצאה כפילות
    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: `/uploads/${req.file.filename}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = {ImageUpload};