# GYMISCTIC - Professional Fitness Management Platform

## Overview

GYMISCTIC is a comprehensive, modern fitness management platform designed as a Progressive Web App (PWA) with white-label capabilities. Built using React + TypeScript for the frontend and Node.js + Express for the backend, it provides a complete fitness ecosystem with workout planning, nutrition tracking, progress monitoring, and gamification features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Animations**: Framer Motion for smooth animations
- **Forms**: React Hook Form with Zod validation
- **Charts**: Chart.js with React wrappers for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: OpenID Connect (OIDC) with Replit Auth
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful API with JSON responses
- **File Processing**: Built-in PDF generation for progress reports

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Comprehensive fitness-focused schema including:
  - Users with gamification fields (points, level, streaks)
  - Workout plans and sessions
  - Meal plans and nutrition logs
  - Progress tracking entries
  - Achievements and user achievements
  - Motivation quotes
  - Brand configuration for white-labeling

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions
- **Authorization**: Role-based access control with admin privileges
- **Security**: HTTP-only cookies with secure flags

### Workout Management
- **Workout Plans**: Pre-built and custom workout routines
- **Session Tracking**: Real-time workout session management
- **Exercise Library**: Comprehensive exercise database with muscle group targeting
- **Progress Monitoring**: Completion tracking and performance analytics

### Nutrition System
- **Meal Planning**: Budget-based meal recommendations
- **Goal-Oriented**: Weight loss, muscle gain, or maintenance plans
- **Macro Tracking**: Calories, protein, carbs, and fats monitoring
- **Meal Logging**: User food intake tracking

### Gamification Engine
- **Points System**: Activity-based point accumulation
- **Levels**: Progressive user advancement system
- **Achievements**: Unlockable badges and rewards
- **Streaks**: Workout consistency tracking
- **Leaderboards**: Competitive elements for motivation

### Progress Analytics
- **Visual Charts**: Interactive progress visualization
- **BMI Tracking**: Body composition monitoring
- **Goal Setting**: Customizable fitness targets
- **Report Generation**: PDF export functionality

### White-Label Features
- **Brand Customization**: Color schemes, logos, and styling
- **Multi-tenant**: Support for multiple client configurations
- **Custom CSS**: Injectable styling for complete customization
- **Admin Panel**: Brand configuration management interface

## Data Flow

1. **User Authentication**: OIDC flow with Replit Auth provider
2. **Session Management**: Server-side session storage in PostgreSQL
3. **API Communication**: RESTful endpoints with JSON payloads
4. **Real-time Updates**: TanStack Query for optimistic updates
5. **Data Persistence**: Drizzle ORM handles all database operations
6. **File Generation**: Server-side PDF creation for reports

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: Replit Auth service
- **UI Components**: Radix UI primitives
- **Charts**: Chart.js for data visualization
- **Animations**: Framer Motion for smooth transitions

### Development Tools
- **Build Tool**: Vite for fast development and building
- **Type Checking**: TypeScript for type safety
- **Database Migrations**: Drizzle Kit for schema management
- **Code Quality**: ESLint and Prettier (implied)

### PWA Features
- **Service Worker**: Custom caching strategies
- **Manifest**: Complete PWA configuration
- **Offline Support**: Cache-first approach for static assets
- **Installable**: Native app-like experience

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied during deployment
4. **Assets**: Static files served from build directory

### Environment Configuration
- **Database**: PostgreSQL connection via `DATABASE_URL`
- **Auth**: OIDC configuration through environment variables
- **Sessions**: Secure session secret management
- **Domains**: Multi-domain support for white-labeling

### Performance Optimizations
- **Code Splitting**: Automatic chunk splitting with Vite
- **Caching**: Service worker implements cache-first for static assets
- **Database**: Connection pooling with Neon serverless
- **CDN Ready**: Static assets can be served from CDN

### Security Measures
- **HTTPS Only**: Secure cookie settings
- **CSRF Protection**: Built into session management
- **Input Validation**: Zod schemas for all user inputs
- **Authentication**: OIDC standard implementation
- **Authorization**: Role-based access control

The application is designed to be fully self-contained while supporting extensive customization for fitness professionals and gym owners who want to white-label the platform for their clients.