import { FormData } from '@/utli/types/FromTypes';
import axios from 'axios';

export const fetchAllCountries = async () => {
  const response = await axios.get(' https://restcountries.com/v3.1/all?fields=name,currencies');
  return response.data;
};

export async function submitRequest(data: FormData) {
  const response = await axios.post(
    "http://test-noema-api.azurewebsites.net/api/requests",
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}
