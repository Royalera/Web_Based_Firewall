const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');
const app = express();
const proxy = httpProxy.createProxyServer({});

// Firewall rules
const firewallRules = {
    allowedDomains: ['https://jsonplaceholder.typicode.com'],
    blockedDomains: ['https://malicious.com']
};

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Validate if the URL is correct and well-formed
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

function isDomainBlocked(url) {
    const domain = new URL(url).origin;
    return firewallRules.blockedDomains.includes(domain);
}

function isDomainAllowed(url) {
    const domain = new URL(url).origin;
    return firewallRules.allowedDomains.includes(domain);
}

// Route to validate the URL
app.get('/validate', (req, res) => {
    const target = req.query.target;

    if (!target || !isValidUrl(target)) {
        return res.json({ status: 'error', message: 'Invalid or missing target URL' });
    }

    if (isDomainBlocked(target)) {
        return res.json({ status: 'error', message: 'Blocked by Firewall' });
    }

    if (!isDomainAllowed(target)) {
        return res.json({ status: 'error', message: 'Domain not allowed' });
    }

    // URL is valid and allowed
    return res.json({ status: 'success', message: 'URL is valid and allowed' });
});

// Start the server on port 5500
app.listen(5500, () => {
    console.log('Firewall proxy server running on port 5500');
});
