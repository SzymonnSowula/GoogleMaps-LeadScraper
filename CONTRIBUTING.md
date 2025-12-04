# Contributing to Google Maps Lead Scraper Pro

First off, thank you for considering contributing to Google Maps Lead Scraper Pro! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your Chrome version and OS**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### Pull Requests

- Fill in the required template
- Follow the coding standards
- Include screenshots for UI changes
- Update documentation as needed
- Add tests if applicable

---

## Development Setup

### Prerequisites

- Google Chrome (latest version)
- Git
- Text editor (VS Code recommended)

### Setup Steps

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/yourusername/google-maps-scraper.git
   cd google-maps-scraper
   ```

2. **Load the extension in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project directory

3. **Make your changes:**
   - Edit files in your favorite editor
   - Test changes by refreshing the extension

4. **Test thoroughly:**
   - Test on different Google Maps searches
   - Test all filters
   - Test CSV export
   - Check console for errors

---

## Coding Standards

### JavaScript

- **Use ES6+ features** (const, let, arrow functions, template literals)
- **Add JSDoc comments** for all functions
- **Use meaningful variable names** (descriptive, not abbreviated)
- **Keep functions small** (single responsibility principle)
- **Handle errors** (try-catch blocks, validation)
- **Escape HTML** (prevent XSS attacks)

**Example:**
```javascript
/**
 * Generates star rating visualization
 * @param {string} rating - Rating value (e.g., "4.5")
 * @returns {string} Star string (e.g., "★★★★☆")
 */
function generateStars(rating) {
  if (!rating || rating === "Brak") return "—";
  
  const ratingNum = parseFloat(rating.replace(',', '.'));
  if (isNaN(ratingNum)) return "—";
  
  // ... implementation
}
```

### HTML

- **Use semantic HTML5** (header, main, section, article)
- **Add ARIA labels** for accessibility
- **Include title attributes** for tooltips
- **Keep structure clean** (proper indentation, comments)

### CSS

- **Use CSS variables** for colors and spacing
- **Follow BEM naming** for complex components
- **Group related styles** with comments
- **Mobile-first approach** (if applicable)
- **Use flexbox/grid** for layouts

**Example:**
```css
/* ========================================================================
   BUTTONS
   ======================================================================== */

button {
  /* Base styles */
  padding: 10px 16px;
  border-radius: 6px;
  
  /* Typography */
  font-weight: 500;
  font-size: 14px;
  
  /* Transitions */
  transition: all 0.2s ease;
}
```

### File Organization

```
extensionapp/
├── popup.html          # Main UI
├── popup.js            # Main logic
├── manifest.json       # Extension config
├── icon.png            # Extension icon
├── README.md           # Documentation
├── CHANGELOG.md        # Version history
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(filters): add "No Website" filter

Add new filter to show only businesses without websites.
This is useful for lead generation agencies.

Closes #123
```

```bash
fix(scraping): improve phone number detection

Enhanced regex patterns to detect more Polish phone formats.
Now supports formats with parentheses and dashes.

Fixes #456
```

---

## Pull Request Process

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes:**
   - Write clean, documented code
   - Follow coding standards
   - Test thoroughly

3. **Commit your changes:**
   ```bash
   git commit -m "feat(feature): add amazing feature"
   ```

4. **Push to your fork:**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request:**
   - Use a clear title
   - Describe your changes
   - Reference related issues
   - Add screenshots for UI changes

6. **Code Review:**
   - Address review comments
   - Make requested changes
   - Keep the PR updated

7. **Merge:**
   - Once approved, your PR will be merged
   - Delete your feature branch

---

## Testing Checklist

Before submitting a PR, ensure:

- [ ] Extension loads without errors
- [ ] All features work as expected
- [ ] Filters work correctly
- [ ] CSV export works
- [ ] No console errors
- [ ] Code is documented
- [ ] README is updated (if needed)
- [ ] CHANGELOG is updated

---

## Questions?

Feel free to open an issue with the "question" label or contact the maintainers.

---

**Thank you for contributing! 🙏**
