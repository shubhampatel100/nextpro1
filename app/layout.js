import './globals.css';

export const metadata = {
  title: 'LowPrice – Price History & Tracker | Compare prices across 100+ stores',
  description: 'Compare prices & track price drops across Amazon, Flipkart, Meesho and 100+ stores. Set price alerts, view price history charts, and save money every time you shop.',
  keywords: 'price comparison, price tracker, price history, amazon price drop, flipkart deals, best price',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%233B82F6'/><stop offset='100%25' stop-color='%237C3AED'/></linearGradient></defs><rect width='40' height='40' rx='10' fill='url(%23g)'/><text x='20' y='27' text-anchor='middle' fill='white' font-size='16' font-weight='900' font-family='Arial'>LP</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
