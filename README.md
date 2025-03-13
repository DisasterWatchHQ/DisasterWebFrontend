# DisasterWatch Web Application Documentation

## Overview

DisasterWatch is a modern web application built with Next.js that provides real-time information and alerts about natural disasters. This documentation will help you understand, set up, and maintain the application.

## Documentation Structure

- [Getting Started](./docs/getting-started.md)
  - Prerequisites
  - Installation
  - Environment Setup
  - Development Workflow

- [Architecture](./docs/architecture.md)
  - Project Structure
  - Technology Stack
  - Key Components
  - State Management

- [Authentication](./docs/authentication.md)
  - User Authentication Flow
  - Protected Routes
  - User Context
  - Security Considerations

- [Features](./docs/features.md)
  - Real-time Alerts
  - Interactive Maps
  - User Profiles
  - Resource Management
  - Notification System

- [API Documentation](./api/README.md)
  - API Endpoints
  - Request/Response Formats
  - Authentication
  - Error Handling

- [Deployment](./docs/deployment.md)
  - Build Process
  - Environment Configuration
  - Deployment Platforms
  - Monitoring

- [Contributing](./docs/contributing.md)
  - Development Guidelines
  - Code Style
  - Pull Request Process
  - Testing

## Quick Links

- [GitHub Repository](https://github.com/DisasterWatchHQ/DisasterWebFrontend)
- [Issue Tracker](https://github.com/DisasterWatchHQ/DisasterWebFrontend/issues)
- [API Documentation](./api/README.md)

## Support

For support, please:
1. Check the [Issues](https://github.com/DisasterWatchHQ/DisasterWebFrontend/issues) page
2. Create a new issue if needed
3. Join our Discord community (link coming soon)

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details. 
=======
# DisasterWebFrontend

The web frontend of the DisasterWatch app.

## Description

This repository contains the web frontend for the DisasterWatch app, a platform designed to provide real-time information and alerts about natural disasters.

## Features

- Real-time disaster alerts
- Interactive maps
- User profiles and resource pages
- Theming and customization options

## Project Structure

- `components/`: React components used throughout the app
- `pages/`: Next.js pages
- `public/`: Static assets
- `styles/`: CSS and Tailwind CSS styles

## Installation

To install the dependencies, run the following command:

```bash
npm install
```

## Scripts

- `dev`: Runs the app in development mode
- `build`: Builds the app for production
- `start`: Starts the production build of the app
- `lint`: Lints the codebase

You can run these scripts using:

```bash
npm run <script>
```

## Dependencies

The project uses several dependencies, including but not limited to:

- `@googlemaps/react-wrapper`
- `@hookform/resolvers`
- `@radix-ui/react-*`
- `next`
- `react`
- `tailwindcss`
- `zod`

For a complete list, refer to the [package.json](https://github.com/DisasterWatchHQ/DisasterWebFrontend/blob/main/package.json) file.

## Contributing

We welcome contributions from the community. To contribute:

1. Fork the repository.
2. Create a new branch with a descriptive name.
3. Make your changes.
4. Submit a pull request.

For detailed contribution guidelines, refer to [CONTRIBUTING.md](CONTRIBUTING.md) (if available).

## Recent Changes

Here are some of the recent notable commits:

- [feat: updated the resource page with more functionality](https://github.com/DisasterWatchHQ/DisasterWebFrontend/commit/a0f48a89f513e2565293252b4d2f7c6234b20d35)
- [feat: updated the profile page with shadcn ui elements](https://github.com/DisasterWatchHQ/DisasterWebFrontend/commit/e0524261931e6d70f184ade1c24fb65b5e567f43)
- [feat: updated the guides page with shadcn ui elements](https://github.com/DisasterWatchHQ/DisasterWebFrontend/commit/64c2023515afddb9faeda7ca060561775c67b76b)

For more commits, visit the [commit history](https://github.com/DisasterWatchHQ/DisasterWebFrontend/commits/main).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
