import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface DocContent {
  title: string;
  content: string;
  path: string;
}

export async function loadDocumentation(): Promise<string> {
  const docsDir = path.join(process.cwd(), '..', 'docs');
  const docContents: DocContent[] = [];

  function processDirectory(dirPath: string) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and hidden directories
        if (!item.startsWith('.') && item !== 'node_modules') {
          processDirectory(fullPath);
        }
      } else if (stat.isFile() && item.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const { data, content: markdownContent } = matter(content);
        
        docContents.push({
          title: data.title || path.basename(item, '.md'),
          content: markdownContent.trim(),
          path: path.relative(docsDir, fullPath)
        });
      }
    }
  }

  try {
    processDirectory(docsDir);
    
    // Format the documentation content for the AI
    const formattedDocs = docContents.map(doc => `
# ${doc.title}
Path: ${doc.path}

${doc.content}
`).join('\n\n---\n\n');

    return formattedDocs;
  } catch (error) {
    console.error('Error loading documentation:', error);
    return '';
  }
} 