# Getting Started with DisasterWatch

This guide will help you set up and run the DisasterWatch web application locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm 9.x or higher
- Git
- A code editor (VS Code recommended)
- A Google Maps API key (for map functionality)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/DisasterWebFrontend.git
   cd DisasterWebFrontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   NEXT_PUBLIC_API_URL=your_backend_api_url
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
   VAPID_PRIVATE_KEY=your_vapid_private_key
   ```

4. Generate VAPID keys for push notifications:
   ```bash
   npx web-push generate-vapid-keys
   ```

## Development Workflow

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

3. The application will automatically reload if you change any of the source files.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/              # Next.js app router pages and layouts
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── common/      # Common components
│   └── ...          # Feature-specific components
├── lib/             # Utility functions and constants
├── hooks/           # Custom React hooks
├── provider/        # Context providers
└── api/             # API route handlers
```

## Development Guidelines

1. **Code Style**
   - Follow the [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
   - Use TypeScript for type safety
   - Implement proper error handling

2. **Component Structure**
   - Place reusable components in `src/components`
   - Group related components in subdirectories
   - Create barrel exports (index.ts) for clean imports

3. **State Management**
   - Use React Context for global state
   - Implement custom hooks for complex state logic
   - Keep component state local when possible

4. **Styling**
   - Use Tailwind CSS utility classes
   - Follow mobile-first responsive design
   - Maintain consistent spacing and typography

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Clear the `.next` directory: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check for TypeScript errors: `npm run type-check`

2. **Environment Variables**
   - Ensure all required environment variables are set in `.env.local`
   - Restart the development server after updating environment variables

3. **API Connection Issues**
   - Verify the API URL in `.env.local`
   - Check network connectivity
   - Review API documentation for correct endpoints

### Getting Help

- Check the [Issues](https://github.com/yourusername/DisasterWebFrontend/issues) page
- Create a new issue with detailed information about your problem
- Join our Discord community for real-time support

## Next Steps

- Review the [Architecture](./architecture.md) documentation
- Learn about [Authentication](./authentication.md)
- Explore [Features](./features.md)
- Check the [API Documentation](./api/README.md) 