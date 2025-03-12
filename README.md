# DisasterWebFrontend

The web frontend of the DisasterWatch app - a comprehensive platform for real-time natural disaster monitoring and alerts.

## Description

DisasterWatch is a modern web application built with Next.js that provides real-time information and alerts about natural disasters. The platform helps users stay informed about ongoing disasters, access emergency resources, and contribute to community safety.

## Features

- 🌍 Real-time disaster alerts and monitoring
- 🗺️ Interactive maps with disaster zone visualization
- 👤 User profiles with customizable preferences
- 📱 Responsive design for all devices
- 🎨 Dark/Light theme support
- 📚 Comprehensive resource guides
- 🔔 Push notifications for critical alerts
- 🌐 Multi-language support (planned)

## Tech Stack

- **Framework**: Next.js 15.1.3
- **Language**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Maps**: Google Maps API (@react-google-maps/api)
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context
- **Data Fetching**: Axios
- **Charts**: Recharts
- **Markdown**: react-markdown with remark-gfm

## Project Structure

```
src/
├── app/              # Next.js app router pages and layouts
├── components/       # Reusable UI components
├── api/             # API route handlers
├── lib/             # Utility functions and constants
├── hooks/           # Custom React hooks
└── provider/        # Context providers
```

## Prerequisites

Before you begin, ensure you have:
- Node.js 18.x or higher
- npm 9.x or higher
- A Google Maps API key (for map functionality)

## Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/DisasterWatchHQ/DisasterWebFrontend.git
   cd DisasterWebFrontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   NEXT_PUBLIC_API_URL=your_backend_api_url
   ```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow the [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- Use functional components with hooks
- Implement proper error handling and loading states

### Component Structure
- Place reusable components in `src/components`
- Group related components in subdirectories
- Create barrel exports (index.ts) for clean imports
- Use proper TypeScript interfaces for props

### State Management
- Use React Context for global state
- Implement custom hooks for complex state logic
- Keep component state local when possible

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use CSS variables for theme values

## API Integration

The frontend communicates with the DisasterWatch API for:
- Disaster data and alerts
- User authentication
- Resource management
- Profile updates

Refer to the API documentation for endpoint details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Pull Request Guidelines
- Include a clear description of changes
- Add relevant tests
- Update documentation as needed
- Ensure all checks pass

## Deployment

The application is configured for deployment on Vercel:
1. Connect your Vercel account to the repository
2. Configure environment variables
3. Deploy using the Vercel dashboard or CLI

## Support

For support, please:
1. Check the [Issues](https://github.com/DisasterWatchHQ/DisasterWebFrontend/issues) page
2. Create a new issue if needed
3. Join our Discord community (link coming soon)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
```
