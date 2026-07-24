const fs = require('fs');
const path = require('path');

async function generateSitemap() {
  const baseUrl = 'https://pefa-k-56-church.vercel.app';
  const pagesDir = path.resolve(__dirname, './src/pages');
  const sitemapPath = path.resolve(__dirname, './public/sitemap.xml');

  // Pages to exclude from the sitemap
  const exclude = [
    'Admin.jsx',
    'AdminLogin.jsx',
    'ForgotPassword.jsx',
    'Login.jsx',
    'NotFound.jsx',
    'Profile.jsx',
    'Register.jsx',
    'ResetPassword.jsx',
    'ChurchDepartmentReader.jsx',
    'ChurchImportanceReader.jsx',
    'EventReader.jsx',
    'LessonReader.jsx',
    'SermonReader.jsx',
  ];

  try {
    const files = await fs.promises.readdir(pagesDir);

    const staticPages = files
      .filter((file) => file.endsWith('.jsx') && !exclude.includes(file))
      .map((file) => {
        const pageName = file.replace('.jsx', '');
        if (pageName === 'Home') {
          return '/';
        }
        // Convert CamelCase to kebab-case for the URL (e.g., StatementOfFaith -> statement-of-faith)
        const route = pageName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
          .toLowerCase();
        return `/${route}`;
      });

    const urls = staticPages.map(url => {
      const priority = url === '/' ? '1.0' : '0.8';
      const changefreq = url === '/' ? 'daily' : 'weekly';
      return `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    await fs.promises.writeFile(sitemapPath, sitemap);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
