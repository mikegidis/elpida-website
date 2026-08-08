

async function testPut() {
    // 1. Unauthenticated PUT
    const unauthRes = await fetch('http://localhost:5000/api/v1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site_name: 'Hacked' })
    });
    console.log("Unauthenticated PUT status:", unauthRes.status);

    // 2. Login as admin
    const loginRes = await fetch('http://localhost:5000/api/v1/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'password123' }) // The password hash matches password123 based on typical setups, let's see. Wait, I'll just check if unauthenticated works.
    });
    
    if (loginRes.ok) {
        const loginData = await loginRes.json();
        const token = loginData.token;
        
        // 3. Authenticated PUT
        const authRes = await fetch('http://localhost:5000/api/v1/settings', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ site_name: 'Elpida Authenticated' })
        });
        console.log("Authenticated PUT status:", authRes.status);
        const data = await authRes.json();
        console.log("Updated settings:", data.settings.site_name);
    } else {
        console.log("Login failed", loginRes.status);
    }
}

testPut();
