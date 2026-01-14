# Daily Protein Planner

A cohesive, single-page web application built with Gatsby (React) and Tailwind CSS. This tool helps users calculate exactly how many grams of specific food sources they need to eat to hit their daily protein goals.

## Features

### User Inputs
- Body Weight Input: Toggle between lbs and kg.
- Protein Goal: Auto-calculated based on body weight (1g per lb) with manual override capability.

### Protein Source Selection
- Select from a list of common protein sources including Chicken Breast, Salmon, Tofu, Whey Protein, Egg Whites, and Greek Yogurt.
- Manage selections via a toggle interface.

### Smart Distribution Logic
- Adjust the percentage contribution of each selected protein source.
- Automatic validation ensures the total distribution equals 100%.
- Auto-fix functionality to normalize values if they do not sum to 100%.

### Dashboard
- Displays the exact raw weight in grams and ounces for each food source.
- Shows the protein contribution breakdown for each item.

## Tech Stack

- **Framework**: Gatsby (React)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Deployment**: GitHub Pages

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ryanson/hit-your-protein.git
   ```

2. Navigate to the project directory:
   ```bash
   cd hit-your-protein
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```
   The site will be available at `http://localhost:8000`.

## Deployment

This project is configured for deployment to GitHub Pages.

To deploy the application:

```bash
npm run deploy
```

This command builds the project with the correct path prefix and pushes the `public` directory to the `gh-pages` branch.

## License

This project is open source and available under the MIT License.
