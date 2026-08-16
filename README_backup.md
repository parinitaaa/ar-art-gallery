# Immersive AR Art Marketplace

An immersive web-based full-stack MERN application where users can explore artworks in an interactive 3D gallery environment and purchase them online. Built with a modern dark-themed glassmorphic UI.

## Tech Stack
-   **Frontend:** React.js (Vite), Three.js (@react-three/fiber & @react-three/drei) for 3D visualization, Tailwind CSS 4.0 for styling, React Router Dom for navigation.
-   **Backend:** Node.js, Express.js.
-   **Database:** MongoDB with Mongoose.
-   **Authentication:** JWT-based user authentication & bcryptjs password hashing.

## Key Features
1.  **Immersive 3D Art Gallery:** A fully interactive virtual room to explore digital art with smooth navigation and simulated AR placement look and feel.
2.  **User Authentication:** Visitor, Artist, and Admin roles.
3.  **Artwork Preview System:** 3D viewing, simulated placement, and high-res image support.
4.  **Artist Dashboard:** Upload, manage listings, and view sales overview.
5.  **Modern UI/UX:** Responsive, dark-themed, glassmorphic styling, and engaging micro-interactions.

## Folder Structure
```text
AR-ART-GALLERY/
├── backend/
│   ├── models/            # Mongoose schemas (User.js, Artwork.js)
│   ├── node_modules/      # Backend Dependencies
│   ├── package.json       # Backend config
│   └── server.js          # Express app entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components (Navbar, etc.)
│   │   ├── pages/         # Page components (Home, Gallery, Details, Login, etc.)
│   │   ├── App.jsx        # Routing configuration
│   │   ├── index.css      # Core Tailwind & custom styles
│   │   └── main.jsx       # React DOM entry
│   ├── package.json       # Frontend config
│   └── vite.config.js     # Vite configuration
└── README.md              # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- Git (optional)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Backend Setup
1.  Navigate into the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Install all backend dependencies:
    ```bash
    npm install
    ```
3.  Start the Express server:
    ```bash
    npm start
    ```
    *(Note: You might need to configure `MONGO_URI` in an `.env` file.)*

### 2. Frontend Setup
1.  Navigate into the `frontend/` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
4.  Open the provided localhost address in your browser (usually `http://localhost:5173`).

### Seeding Data
Currently, mock data is used within the UI state (`Gallery.jsx` and `ArtworkDetails.jsx`). To connect fully to the DB, create specific `/api/artworks` seed routes in Express in the `server.js` file.
