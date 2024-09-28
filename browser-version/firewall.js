const firewallRules = {
    allowedDomains: ['https://jsonplaceholder.typicode.com', 'https://api.example.com'],
    blockedDomains: ['https://malicious.com', 'https://untrusted.com']
};

function isDomainBlocked(url) {
    const domain = new URL(url).origin;
    return firewallRules.blockedDomains.includes(domain);
}

function isDomainAllowed(url) {
    const domain = new URL(url).origin;
    return firewallRules.allowedDomains.includes(domain);
}

// Override fetch to add our firewall logic
const originalFetch = window.fetch;

window.fetch = async function(url, options) {
    if (isDomainBlocked(url)) {
        console.error(`Request blocked to: ${url}`);
        return Promise.reject(new Error('Request Blocked by Firewall'));
    }

    if (!isDomainAllowed(url)) {
        console.warn(`Request not explicitly allowed to: ${url}`);
    }

    return originalFetch(url, options);
};

// Testing button to fetch data
document.getElementById('fetchData').addEventListener('click', async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        console.log('Data fetched:', data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
});
