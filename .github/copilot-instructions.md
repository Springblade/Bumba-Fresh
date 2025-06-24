# Custom Instructions for Bumba Fresh Project

## Project Overview
Bumba Fresh is a React/TypeScript meal delivery service application that offers individual meals and subscription plans. The app features user authentication, shopping cart functionality, checkout process, and account management.

## Tech Stack
- **Frontend Framework**: React with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Context API (Auth, Cart)
- **Animations**: Framer Motion

## Project Structure
- components - Reusable UI components
- pages - Page-level components
- context - Context providers for global state
- features - Domain-specific features
- hooks - Custom React hooks
- utils - Helper functions
- types - TypeScript interfaces/types

## Key Features
- **Authentication**: Sign-in/sign-up flows
- **Shopping Experience**: Browse meals, add to cart
- **Subscriptions**: Configure meal plans and delivery schedules
- **Checkout Process**: Cart → Payment → Confirmation
- **Account Management**: Profile, orders, subscriptions

## Styling Conventions
- Primary color palette is green-based (`primary-*` classes)
- Secondary color palette is orange-based (`secondary-*` classes)
- Semantic colors for success, error, warning, and info
- Custom spacing and typography defined in tailwind.config.js

## Common Patterns
1. When creating new components:
   - Use TypeScript interfaces for props
   - Follow existing naming conventions
   - Use Tailwind classes for styling

2. For new pages:
   - Add route in App.tsx
   - Use appropriate layout components
   - Add error boundary wrappers

3. UI Components follow these patterns:
   - Accept className prop for style overrides
   - Use consistent variants (primary, outline, ghost)
   - Handle loading states where appropriate

4. For protected content:
   - Wrap routes in `<ProtectedRoute>` component
   - Check auth state with useAuth() hook

## Code Change Documentation
When modifying existing code, always:
- Add a comment above the changed section explaining WHAT was changed
- Include the date of the change (DD-MM-YYYY)
- Use the following format:
  ```
  /* 
   * CHANGE: [Brief description of the change]
   * DATE: DD-MM-YYYY
   */
  ```

## Development Process
Before providing solutions or generating code:
- Review the existing codebase and file structure carefully
- Match code style and patterns already present in the project
- Leverage existing utilities, hooks, and components rather than creating new ones
- Ensure new code fits seamlessly with existing architecture
- Consider performance implications of suggested implementations