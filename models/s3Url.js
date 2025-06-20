import mongoose from 'mongoose';

const s3UrlSchema = new mongoose.Schema({
  link: {
    type: String,
    unique: true,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const S3Url = mongoose.model('S3Url', s3UrlSchema);

export default S3Url;
