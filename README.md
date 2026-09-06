# 🌍 World Explorer

> A modern React + TypeScript application that explores countries around the world using the REST Countries API.

World Explorer allows users to browse country information, search for countries, and explore useful details such as flags, population, capital, region, and more.

---

## ✨ Features

- 🌎 Browse countries from around the world
- 🔍 Search countries by name
- 🏳️ Display country flags
- 👥 View population information
- 📍 View capital and region
- 📱 Responsive design
- ⚡ Fast development with Vite
- 🔄 Fetch real-time data from a REST API
- 🧩 Component-based React architecture
- 🔷 Built with TypeScript

---

## 🖥️ Preview

> 🚧 Project currently under development.

A live demo and screenshots will be added once the project reaches its first stable version.

---

## 🛠️ Technologies

| Technology | Purpose |
|------------|---------|
| React | User interface |
| TypeScript | Type safety |
| Vite | Development and build tool |
| REST API | Country data |
| CSS | Styling |
| Git | Version control |
| GitHub | Source code hosting |

---

## 🌐 API

This project uses the **REST Countries API** to retrieve country information.

The API provides structured information including:

- Country names
- Flags
- Capitals
- Population
- Regions
- Currencies
- Languages
- Time zones
- Borders
- And more

API documentation:

https://restcountries.com/docs

---

## 📂 Project Structure

```text
world-explorer/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── CountryCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── Header.tsx
│   │
│   ├── pages/
│   │   └── Home.tsx
│   │
│   ├── services/
│   │   └── countryApi.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/hossainahmad/world-explorer.git
```

### 2. Navigate to the project

```bash
cd world-explorer
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the local development URL provided by Vite.

---

## 📦 Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🧠 What I Learned From This Project

This project is being developed as a practical React learning project.

Through World Explorer, I am practicing:

- React components
- TypeScript with React
- Props
- State management
- `useState`
- `useEffect`
- API requests
- `fetch()`
- `async/await`
- Promises
- Loading states
- Error handling
- Conditional rendering
- Array methods such as `map()`, `filter()`, and `find()`
- Search functionality
- Component architecture
- Responsive UI development
- Git and GitHub workflow

---

## 🗺️ Roadmap

### Phase 1 — API Integration

- [x] Create React + TypeScript + Vite project
- [ ] Connect REST Countries API
- [ ] Fetch country data
- [ ] Handle loading state
- [ ] Handle API errors

### Phase 2 — Country UI

- [ ] Create Country Card
- [ ] Display country flag
- [ ] Display country name
- [ ] Display population
- [ ] Display capital
- [ ] Display region

### Phase 3 — Search & Filtering

- [ ] Search by country name
- [ ] Filter by region
- [ ] Sort countries
- [ ] Handle empty search results

### Phase 4 — Country Details

- [ ] Country details page
- [ ] React Router
- [ ] Border countries
- [ ] Currency information
- [ ] Language information
- [ ] Time zone information

### Phase 5 — Polish

- [ ] Responsive design
- [ ] Loading skeleton
- [ ] Error UI
- [ ] Dark mode
- [ ] Accessibility improvements
- [ ] Performance optimization
- [ ] Deploy live version

---

## 🎯 Project Goal

The goal of World Explorer is not only to build a country browsing application, but also to gain practical experience building a real-world React application that consumes external APIs.

The project focuses on writing clean, reusable, maintainable code while following modern frontend development practices.

---

## 👨‍💻 Author

**Hossain Ahmad**

Assistant Programmer & Aspiring Web Developer

- GitHub: [@hossainahmad](https://github.com/hossainahmad)

---

## ⭐ Support

If you find this project useful or interesting, consider giving it a ⭐ on GitHub.

---

## 📄 License

This project is open source and available under the MIT License.
