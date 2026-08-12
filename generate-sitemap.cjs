const fs = require('fs');
const path = require('path');

async function generateSitemap() {
  const baseUrl = 'https://www.pefak56church.top';
  const pagesDir = path.resolve(__dirname, './src/pages');
  const academyPagesDir = path.resolve(__dirname, './src/pages/academy'); // Path for academy pages
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
    'BlogReader.jsx',
  ];

  // Helper function to convert CamelCase to kebab-case
  const toKebabCase = (str) => {
    if (str === 'Home') return ''; // Root path for Home
    const newStr = str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    return `/${newStr}`;
  };

  try {
    // Read main pages
    const mainFiles = await fs.promises.readdir(pagesDir);
    const staticPages = mainFiles
      .filter((file) => file.endsWith('.jsx') && !exclude.includes(file))
      .map((file) => {
        const pageName = file.replace('.jsx', '');
        const filePath = path.join(pagesDir, file);
        const route = toKebabCase(pageName);
        return { route, filePath };
      });

    // Read academy pages
    const academyFiles = await fs.promises.readdir(academyPagesDir);
    const academyPages = academyFiles
      .filter((file) => file.endsWith('.jsx') && !exclude.includes(file))
      .map((file) => {
        const pageName = file.replace('.jsx', '');
        const filePath = path.join(academyPagesDir, file);
        const route = `/academy${toKebabCase(pageName)}`;
        return { route, filePath };
      });

    // Combine all pages
    const allPages = [...staticPages, ...academyPages];

    const urls = await Promise.all(
      allPages.map(async ({ route, filePath }) => {
        const stats = await fs.promises.stat(filePath);
        const lastmod = stats.mtime.toISOString().split('T')[0];
        const isAcademy = route.startsWith('/academy');
        const priority = route === '/' ? '1.0' : isAcademy ? '0.9' : '0.8';
        const changefreq = route === '/' ? 'daily' : 'weekly';
        
        return `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      })
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    await fs.promises.writeFile(sitemapPath, sitemap);
    console.log('Sitemap generated successfully with correct dates!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
