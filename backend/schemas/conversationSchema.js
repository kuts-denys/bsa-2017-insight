const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  participants: [
    {
      _id: false,
      userType: String,
      user: { type: Schema.Types.ObjectId, refPath: 'participants.userType' },
    },
  ],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  open: Boolean,
  createdAt: Date,
  updatedAt: Date,
  appId: { type: Schema.Types.ObjectId, required: false }, // CHANGE TO "TRUE" LATER
  isReassigned: { type: Boolean, default: false },
});

module.exports = mongoose.model('Conversation', conversationSchema);
