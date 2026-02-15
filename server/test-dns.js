const dns = require('dns');

dns.lookup('careerbridge-cluster.evo6t5a.mongodb.net', (err, address, family) => {
    if (err) {
        console.error('DNS Lookup failed:', err.message);
    } else {
        console.log('DNS Lookup success:', address);
    }
});
