
# Financing Request Form

This is a **Financing Request Form** built using **Next.js (App Router)**, **React**, **TypeScript**, **Context API**, and **Tailwind CSS**. It includes form validation, country selection using global context, and submission to an API using Axios.

## Features

- Real-time form validation
- Auto-fill currency based on OPEC country selection
- Global country list using React Context API
- Responsive and accessible UI
- Submission feedback (success or error) with modal notifications

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Context API
- Axios
- Tailwind CSS

## Project Structure

```

/app
└── /context
└── CountryProvider.tsx        # Provides countries globally via context

└── /components
└── FinancingForm.tsx          # The main financing form component

/services
└── api.ts                          # API calls for countries and form submission

/utils
├── constant.ts                     # OPEC countries list
├── Helper.ts                       # Helper functions (e.g., comma formatting)
├── types/FromTypes.ts              # TypeScript interfaces for form
└── Validation.ts                   # Form validation logic

````

## Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/your-project.git

# Install dependencies
npm install

# Run development server
npm run dev
````

## How It Works

### 1. Countries Context (`CountryProvider`)

The list of countries is fetched from an external API and provided globally using React Context. This allows any component (including the form) to access the country list without additional API calls.

```tsx
import { CountryProvider } from "@/context/CountryProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <CountryProvider>{children}</CountryProvider>;
}
```

### 2. Financing Form (`FinancingForm`)

The form collects the following information:

* Name
* Country (auto-suggested currency for OPEC members)
* Project Code
* Description
* Validity Start & End Dates (with date rules)
* Amount (with thousand separators)
* Currency

### 3. Validation Rules

* All fields are required.
* Project Code must match `ABCD-1234` format (no zero allowed in number).
* Start Date must be at least 15 days from today.
* End Date must be between 1 and 3 years after the Start Date.
* For OPEC countries, currency must be `USD` (auto-filled).

### 4. Form Submission

* When the form passes validation, the data is submitted via Axios to the backend.
* A success or error modal is shown based on the result.
* Modals automatically close after 3 seconds.

## Environment Variables

No environment variables are currently required since countries are fetched from a public API.

## Next Steps (Optional Future Features)

* Add currency list from a public API using the same Context approach
* Save submitted data to a real backend
* Add loading spinners for better UX

## License

MIT License.

---

Built with ❤️ by Adeleye Remi-Alarape

```
