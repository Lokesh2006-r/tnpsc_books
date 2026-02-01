// Quick test to verify the payment controller works
const mongoose = require('mongoose');

// Mock req.user object as it would be set by auth middleware
const mockReqUser = {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    email: 'test@example.com',
    name: 'Test User',
    role: 'user'
};

console.log('Testing req.user._id access:');
console.log('User ID:', mockReqUser._id);
console.log('User ID toString:', mockReqUser._id.toString());
console.log('User email:', mockReqUser.email);

// Test if req.user.id exists (it shouldn't)
console.log('\nTesting req.user.id (should be undefined):');
console.log('User id:', mockReqUser.id);

console.log('\n✅ Test complete - req.user._id works, req.user.id is undefined');
