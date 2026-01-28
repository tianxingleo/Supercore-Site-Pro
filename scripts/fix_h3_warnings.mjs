import fs from 'fs';
import path from 'path';

const serverDir = './server';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
};

walk(serverDir, (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('statusMessage:')) {
            console.log(`Fixing ${filePath}`);
            let newContent = content.replace(/statusMessage:/g, 'message:');
            fs.writeFileSync(filePath, newContent, 'utf8');
        }
    }
});
