import FinancingForm from "@/components/FinancingForm";
import { CountryProvider } from "@/context/CountryProvider";

export default function Home() {
  return (
    <CountryProvider>
      <div className="bg-gray-600">
      <FinancingForm />
      </div>

    </CountryProvider>
  );
}
