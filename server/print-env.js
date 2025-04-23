require('dotenv').config();

console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set (value hidden for security)' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set (value hidden for security)' : 'Not set');

console.log('\nAll environment variables:');
Object.keys(process.env).forEach(key => {
  if (key === 'MONGODB_URI' || key === 'JWT_SECRET') {
    console.log(`${key}: Set (value hidden for security)`);
  } else {
    console.log(`${key}: ${process.env[key]}`);
  }
});
