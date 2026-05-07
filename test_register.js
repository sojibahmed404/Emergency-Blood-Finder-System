const http = require('http');

const data = JSON.stringify({
  name: "Test Donor",
  email: "test.donor123@example.com",
  password: "password123",
  role: "DONOR",
  bloodGroup: "A+",
  location: "Dhaka",
  phone: "01711111111"
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let body = '';
  res.on('data', d => {
    body += d;
  });
  res.on('end', () => {
    console.log(body);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
