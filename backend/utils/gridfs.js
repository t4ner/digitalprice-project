const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let gridFSBucket;

const initGridFS = (db) => {
  gridFSBucket = new GridFSBucket(db, {
    bucketName: "logos",
  });
};

const uploadToGridFS = (buffer, filename, contentType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = gridFSBucket.openUploadStream(filename, {
      contentType,
    });

    uploadStream.on("error", reject);
    uploadStream.on("finish", () => {
      resolve({
        fileId: uploadStream.id,
        filename: filename,
        contentType: contentType,
      });
    });

    uploadStream.write(buffer);
    uploadStream.end();
  });
};

const getFileFromGridFS = (fileId) => {
  return gridFSBucket.openDownloadStream(fileId);
};

const deleteFromGridFS = async (fileId) => {
  try {
    await gridFSBucket.delete(fileId);
  } catch (error) {
    console.error("GridFS deletion error:", error);
    throw error;
  }
};

module.exports = {
  initGridFS,
  uploadToGridFS,
  getFileFromGridFS,
  deleteFromGridFS,
};
