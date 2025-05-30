import { headers } from 'next/headers';

export default function HealthPage() {
  const headersList = headers();
  console.log('Headers:', headersList);
  const country = headersList.get('CloudFront-Viewer-Country'); // Case-sensitive!
  console.log('User country:', country);

  return (
    <div>
      <h1>Health Check</h1>
      <p>
        <pre>{JSON.stringify(Array.from(headersList.entries()), null, 2)}</pre>

        <span>{country ? `Country: ${country}` : 'Country: Not available'}</span>
      </p>
    </div>
  );
}
