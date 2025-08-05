# RaastaBuzz Frontend

A community-powered traffic monitoring web application for Bangladesh built with React, Material UI, and Leaflet maps.

## 🚗 About RaastaBuzz

RaastaBuzz is a platform where users can share and view real-time traffic updates to make traveling in Bangladeshi cities easier and more predictable. The app allows the community to report traffic conditions, vote on the accuracy of reports, and access live traffic information.

## 👥 User Roles

- **Spectator (Guest)**: View traffic reports and search routes without an account
- **Contributor**: Post traffic updates, vote on reports, save routes, and participate in forums
- **Community Moderator**: Trusted users with additional permissions to manage content

## ✨ Features

### Core Features
- 🗺️ **Interactive Map**: View real-time traffic reports on a Leaflet-powered map
- 📍 **Route Search**: Find optimal routes with traffic information
- 📢 **Traffic Reporting**: Submit traffic updates with categories, severity levels, and descriptions
- 👍 **Community Voting**: Verify report accuracy through upvoting/downvoting
- 🏠 **User Profiles**: Manage personal information, view stats, and track contributions
- 💬 **Community Forum**: Discuss traffic solutions and share tips

### User Management
- 🔐 **Authentication**: Login/Register with role-based access
- 📊 **Points System**: Earn points for helpful contributions
- 💾 **Saved Routes**: Store frequently used routes for quick access
- 🔔 **Notifications**: Get alerts for traffic on saved routes (planned)

## 🛠️ Technology Stack

- **Frontend**: React 18, Material UI 5, React Router 6
- **Maps**: Leaflet with React-Leaflet
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: Material UI with Emotion
- **Icons**: Material UI Icons

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd JavaFest
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Demo Credentials

For testing purposes, use these demo accounts:

**Contributor Account:**
- Email: `contributor@demo.com`
- Password: `demo123`

**Moderator Account:**
- Email: `moderator@demo.com`
- Password: `demo123`

## 📱 Usage

### For Guests (Spectators)
1. Open the application
2. Search for routes using the route finder
3. View traffic reports on the interactive map
4. Click on map markers to see detailed report information

### For Contributors
1. Sign up for an account or log in
2. All spectator features plus:
   - Click "Report Traffic Issue" to submit new reports
   - Vote on existing reports (thumbs up/down)
   - Access your profile to view stats and saved routes
   - Participate in community forum discussions

### For Moderators
1. Log in with moderator credentials
2. All contributor features plus:
   - Enhanced verification status on posts
   - Additional community management capabilities (planned)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   └── Navbar.jsx           # Navigation bar component
│   ├── Map/
│   │   └── TrafficMap.jsx       # Interactive Leaflet map
│   ├── Route/
│   │   └── RouteSearch.jsx      # Route search functionality
│   └── Traffic/
│       ├── TrafficReportDialog.jsx    # Form for creating reports
│       └── TrafficReportsList.jsx     # List of recent reports
├── context/
│   └── AuthContext.jsx         # Authentication context
├── data/
│   └── demoData.js             # Demo data for development
├── pages/
│   ├── Home.jsx                # Main dashboard page
│   ├── Login.jsx               # Login page
│   ├── Register.jsx            # Registration page
│   ├── Profile.jsx             # User profile page
│   └── Forum.jsx               # Community forum
├── App.jsx                     # Main app component
├── main.jsx                    # Application entry point
└── index.css                   # Global styles
```

## 🎯 Key Components

### TrafficMap
- Displays traffic reports as colored markers on a Leaflet map
- Click markers to view detailed report information
- Support for voting on reports (for authenticated users)

### RouteSearch
- Autocomplete search for Dhaka locations
- Current location detection (demo functionality)
- Route planning with traffic overlay

### TrafficReportDialog
- Form for submitting new traffic reports
- Category selection (Traffic Jam, Accident, Road Closed, etc.)
- Severity levels (Low, Medium, High)
- Location input with current location option

### Community Forum
- Categorized discussions (Tips, Safety, Feature Requests)
- User reputation system with points
- Top contributors leaderboard

## 📊 Demo Data

The application includes comprehensive demo data:
- 5 sample traffic reports across Dhaka
- 3 forum posts with different categories
- User profiles with different roles and point levels
- Popular Dhaka locations for route searching

## 🎨 UI/UX Features

- **Responsive Design**: Works on both desktop and mobile devices
- **Material Design**: Consistent UI using Material UI components
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Visual Feedback**: Color-coded severity levels and category icons

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables
Currently using demo data. For production:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_MAP_API_KEY` - Map service API key (if needed)

## 🚧 Future Enhancements

- **Photo Upload**: Add image support for traffic reports
- **Real-time Updates**: WebSocket integration for live updates
- **Push Notifications**: Browser notifications for saved routes
- **Advanced Filtering**: Filter reports by time, category, and severity
- **Route Optimization**: Integration with routing services
- **Mobile App**: React Native version
- **Analytics Dashboard**: Traffic pattern analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for the Bangladesh traffic community**
