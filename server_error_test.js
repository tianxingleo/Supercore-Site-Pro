fetch('http://localhost:3001/api/products/admin/9')
    .then(res => res.text().then(text => console.log(res.status, text)))
    .catch(console.error);
