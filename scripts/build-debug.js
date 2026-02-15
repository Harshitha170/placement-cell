try {
    const { execSync } = require('child_process');
    const output = execSync('npm run build', {
        cwd: 'C:\\Users\\jhars\\.gemini\\antigravity\\scratch\\placement-cell\\client',
        encoding: 'utf-8',
        stdio: 'pipe'
    });
    console.log(output);
} catch (error) {
    console.error('STDOUT:', error.stdout);
    console.error('STDERR:', error.stderr);
    console.error('ERROR:', error.message);
    process.exit(1);
}
