# CU-Bytes Contribution Guide

Quick guide on maintaining and contributing to `cu-bytes`.

## Table Of Contents

1. [Filing Issues](#filing-issues)
2. [Making Pull Requests](#making-pull-requests)
3. [Version Updates](#version-updates)
4. [Style & Formatting](#style--formatting)

### Filing Issues

- Don't remember how to file an issue on GitHub? Read the [GitHub Docs on creating an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue).
- Search for any existing issues before opening a new one.
- Include your working environment in (OS, setup, application version).
- Describe expected vs. actual behavior.
- Add labels (e.g., `bug`, `enhancement`) and attach screenshots/logs if helpful.

### Making Pull Requests

- Don't remember how to make a PR on GitHub? Read the [GitHub Docs on creating a pull request](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue).

1) **Branch naming**

~~~bash
git checkout -b feature/section-description
~~~

- Prefix with your tracker ticket if applicable (e.g., `feature/frontend-update-homepage`).

2) **Commit messages** (Conventional Commits)

~~~text
feat: add new user authentication page
fix: correct model training data
chore: run pre-commit hooks on test cases
docs: update README with restaurant examples
~~~

3) **Open a PR**

- Target `main`.
- Clearly describe what changed and why; link the issue/ticket.
- Include before/after screenshots for report changes.
- Request reviewers and add labels.

### Version Updates

- We use **Git tags** to manage and release versions of `cu-bytes`. Tags follow [Semantic Versioning](https://semver.org/).

1. Make sure `main` is up to date:

~~~bash
git checkout main
git pull origin main
~~~

2. Create a new version tag:

~~~bash
git tag -a v0.2.0 -m "Release v0.0.0"
~~~

- `-a` creates an annotated tag
- Replace `v0.2.0` with the next versions
  - **MAJOR**: Breaking changes
  - **MINOR** New features (backwards compatible)
  - **PATCH**: Bug foxes/small improvements

3. Push the tag to GitHub

    ~~~bash
    git push origin v0.2.0
    ~~~

4. **GitHub Actions** will detect the tag and create a new release.

### Style & Formatting

- We follow [Google’s Python Style Guide](https://google.github.io/styleguide/pyguide.html) as a baseline for Python code. For TypeScript, we follow [Google's TypeScript Style Guide](https://google.github.io/styleguide/tsguide).

- Manual **Pre-commit** checks:

~~~bash
pre-commit run --all-files
~~~
