# Security Policy

This document outlines the security measures in place for this project and provides guidance on how to maintain a secure environment.

## Supabase Security

### Row Level Security (RLS)

Row Level Security is enabled on all tables in the Supabase database. This means that, by default, all access to data is denied. Policies have been created to grant specific permissions for reading and writing data. It is crucial to maintain these policies and to create new ones with the principle of least privilege in mind.

### API Keys

The Supabase API keys should be treated as sensitive information. The `anon` key is publicly available and is safe to use in the client-side code. The `service_role` key, on the other hand, provides unrestricted access to the database and should never be exposed on the client-side. It should only be used in a secure server-side environment.

### Backups

Supabase provides daily backups of the database. It is recommended to familiarize yourself with the backup and restore process in case of data loss.

## Web Application Security

### Content Security Policy (CSP)

The website uses a Content Security Policy to prevent cross-site scripting (XSS) and other injection attacks. The CSP is defined in a `meta` tag in the `index.html` file. Any changes to the sources of content (e.g., adding a new font from a different domain) will require updating the CSP.

### Dependency Management

It is important to keep the project's dependencies up to date to avoid vulnerabilities. Regularly run `npm audit` to check for known vulnerabilities and update dependencies as needed.

### Secure Coding Practices

- **Input Validation:** Always validate and sanitize user input to prevent XSS and other injection attacks.
- **Error Handling:** Implement proper error handling to avoid leaking sensitive information.
- **Authentication and Authorization:** If you add authentication to the website, use a secure and well-tested authentication library. Implement proper authorization to ensure that users can only access the resources they are permitted to see.
