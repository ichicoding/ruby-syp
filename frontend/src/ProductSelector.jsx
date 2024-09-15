import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductSelector() {
  const [products, setProducts] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  // Fetch products and destinations from backend
  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then((response) => {
        setProducts(response.data.products);
        setDestinations(response.data.destinations);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Fetch results when search button is clicked
  const fetchResults = () => {
    if (selectedProduct && selectedDestination) {
      axios
        .get(`http://localhost:3000/products?product=${selectedProduct}&destination=${selectedDestination}`)
        .then((response) => {
          if (response.data.error) {
            setError(response.data.error);
            setResults([]);
          } else {
            setError('');
            setResults(response.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching price:', error);
          setError('An error occurred while fetching data.');
        });
    }
  };

  return (
    <div>
      <h1>Select a Product and a Destination</h1>
      <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
        <option value="">Select Product</option>
        {products.map((product, index) => (
          <option key={index} value={product}>
            {product}
          </option>
        ))}
      </select>

      <select value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)}>
        <option value="">Select Destination</option>
        {destinations.map((destination, index) => (
          <option key={index} value={destination}>
            {destination}
          </option>
        ))}
      </select>

      {/* Add a Search button */}
      <button onClick={fetchResults}>Search</button>

      <div>
        {error && <div>{error}</div>}
        {results.length > 0 && (
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                Product: {result.product}, Available: {result.available}, Base Price: {result.base_price}, 
                Freight Cost: {result.freight_costs}, Mill: {result.mill}, Total Price: {result.total_price}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductSelector;
