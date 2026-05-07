const http = require('http');

const data = JSON.stringify({
  name: "New Test Donor",
  bloodGroup: "O+",
  location: "Sylhet",
  phone: "01722222222"
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/donors/quick-add',
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
