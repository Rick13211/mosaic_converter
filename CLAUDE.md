# Claude AI Guidelines

## 1. Code Style & Quality

- **TypeScript First**: Use TypeScript for all new code. Ensure type safety.
- **Functional Programming**: Prefer pure functions and immutability where practical.
- **Error Handling**: Use `try/catch` blocks. For API routes, return meaningful error messages with appropriate HTTP status codes.
- **Performance**: Optimize for speed and memory usage. Avoid unnecessary computations or data fetching.
- **Security**: Be mindful of security best practices. Sanitize inputs, handle secrets properly, and prevent XSS/CSRF attacks.

## 2. Project Structure

- **Components**: Place React components in the `components/` directory.
- **Pages**: Place Next.js pages in the `app/` directory.
- **Utilities**: Place helper functions in the `utils/` directory.
- **Types**: Define TypeScript types in the `types/` directory.
- **API Routes**: Place API endpoints in the `app/api/` directory.

## 3. Git & Version Control

- **Commit Messages**: Write clear, concise commit messages in the imperative mood (e.g., "Add user authentication" instead of "Added user authentication").
- **Branch Naming**: Use descriptive branch names (e.g., `feature/user-auth`, `fix/login-bug`).
- **PRs**: Create pull requests for all changes. Ensure PRs reference the relevant issue if applicable.

## 4. Testing

- **Unit Tests**: Write unit tests for utility functions and complex logic.
- **Integration Tests**: Test API endpoints and component interactions.
- **E2E Tests**: For critical user flows, consider end-to-end tests.

## 5. Documentation

- **Inline Comments**: Add comments for complex or non-obvious code.
- **README**: Keep the main `README.md` updated with setup instructions and project overview.
- **API Docs**: Document API endpoints in `app/api/` if they are complex.

## 6. Development Workflow

1. **Understand the Goal**: Clarify requirements and scope.
2. **Plan the Changes**: Outline the implementation approach.
3. **Implement**: Write the code following the guidelines above.
4. **Test**: Verify the changes work as expected.
5. **Document**: Update any necessary documentation.
6. **Commit**: Create a clear, descriptive commit message.
7. **PR**: Submit a pull request for review.

## 7. Handling Ambiguity

- **Ask Questions**: If requirements are unclear, ask for clarification before proceeding.
- **Propose Solutions**: If there are multiple ways to implement something, suggest the best approach and explain your reasoning.
- **Document Assumptions**: If you must make assumptions, document them clearly.

## 8. Code Review Checklist

Before merging/approving a PR, verify:

- [ ] Code follows TypeScript best practices
- [ ] Code follows the project structure
- [ ] No TypeScript errors or warnings
- [ ] Tests pass (if applicable)
- [ ] Code is readable and maintainable
- [ ] No security vulnerabilities
- [ ] Performance is acceptable
- [ ] Documentation is updated
- [ ] Commit message is clear and accurate

## 9. Environment Variables

- **Never commit secrets**: API keys, passwords, and other sensitive information should be stored in `.env` files and accessed via `process.env`.
- **Document required variables**: List all required environment variables in the `README.md`.

## 10. Third-Party Libraries

- **Evaluate necessity**: Only add new dependencies if they are truly needed.
- **Check licenses**: Ensure licenses are compatible with the project.
- **Security audit**: Be aware of potential security risks in third-party code.

## 11. Performance Monitoring

- **Monitor load times**: Keep an eye on page load times and API response times.
- **Optimize bottlenecks**: Address performance issues as they arise.
- **Use caching**: Implement caching where appropriate to improve performance.

## 12. Accessibility

- **Semantic HTML**: Use appropriate HTML5 elements.
- **ARIA labels**: Use ARIA labels where needed for accessibility.
- **Keyboard navigation**: Ensure all functionality is keyboard accessible.
- **Color contrast**: Maintain sufficient color contrast for readability.

## 13. Internationalization

- **i18n support**: Design with internationalization in mind.
- **Translation files**: Use translation files for all user-facing text.
- **RTL support**: Consider right-to-left language support if needed.

## 14. Browser Compatibility

- **Target browsers**: Define the browsers and versions to support.
- **Polyfills**: Use polyfills where needed for older browser support.
- **Feature detection**: Use feature detection instead of browser sniffing.

## 15. Mobile Responsiveness

- **Mobile-first**: Design with mobile devices in mind.
- **Responsive breakpoints**: Use appropriate breakpoints for different screen sizes.
- **Touch targets**: Ensure touch targets are large enough for mobile devices.

## 16. Error Boundaries

- **Component-level boundaries**: Use React error boundaries to prevent crashes.
- **Graceful degradation**: Provide fallback UI when errors occur.
- **Error reporting**: Implement error reporting to track issues.

## 17. Performance Budget

- **Bundle size**: Keep the JavaScript bundle size under a reasonable limit.
- **Image optimization**: Optimize images for web performance.
- **Code splitting**: Use code splitting to lazy-load components.

## 18. SEO

- **Meta tags**: Use appropriate meta tags for SEO.
- **Sitemap**: Generate a sitemap for search engine crawlers.
- **Robots.txt**: Configure `robots.txt` appropriately.

## 19. Analytics

- **Tracking events**: Track important user interactions.
- **Performance metrics**: Monitor page load times and other performance metrics.
- **User behavior**: Understand how users interact with the application.

## 20. Security Headers

- **Implement security headers**: Use headers like CSP, HSTS, X-Frame-Options, etc.
- **Regular audits**: Periodically review security headers for compliance.

## 21. Rate Limiting

- **API rate limiting**: Implement rate limiting on API endpoints.
- **Bot protection**: Use CAPTCHAs or other bot protection mechanisms.

## 22. Backup & Recovery

- **Database backups**: Implement regular database backups.
- **Disaster recovery**: Have a plan for disaster recovery.
- **Data retention**: Define data retention policies.

## 23. Compliance

- **GDPR**: Comply with GDPR requirements if applicable.
- **CCPA**: Comply with CCPA requirements if applicable.
- **Other regulations**: Be aware of any industry-specific regulations.

## 24. Performance Testing

- **Load testing**: Test with realistic load scenarios.
- **Stress testing**: Determine the breaking point of the application.
- **Benchmark testing**: Compare performance against benchmarks.

## 25. Code Quality Metrics

- **Cyclomatic complexity**: Keep complexity low in functions.
- **Code duplication**: Avoid code duplication.
- **Test coverage**: Aim for high test coverage.

## 26. Dependency Management

- **Regular updates**: Keep dependencies updated.
- **Vulnerability scanning**: Scan for security vulnerabilities in dependencies.
- **Deprecation tracking**: Track deprecated dependencies.

## 27. Performance Optimization

- **Lazy loading**: Implement lazy loading for components and images.
- **Code splitting**: Use code splitting to reduce bundle size.
- **Memoization**: Use memoization to prevent unnecessary re-renders.

## 28. Error Handling Best Practices

- **Specific error types**: Use specific error types instead of generic ones.
- **Error boundaries**: Implement error boundaries to handle component-level errors.
- **Error reporting**: Use error reporting to track and analyze errors.

## 29. API Design

- **RESTful principles**: Follow RESTful API design principles.
- **Consistent naming**: Use consistent naming conventions for endpoints and resources.
- **Versioning**: Implement API versioning.

## 30. Performance Monitoring

- **Real user monitoring**: Track real user performance metrics.
- **Synthetic monitoring**: Use synthetic monitoring to test performance.
- **Alerting**: Set up alerts for performance degradation.

## 31. Security Best Practices

- **Input validation**: Validate all user inputs.
- **Output encoding**: Encode all outputs to prevent XSS attacks.
- **Rate limiting**: Implement rate limiting on API endpoints.

## 32. Code Review Checklist

Before merging/approving a PR, verify:
