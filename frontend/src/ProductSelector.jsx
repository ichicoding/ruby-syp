import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductSelector() {
  const [products, setProducts] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [results, setResults] = useState([]);

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

  const fetchResults = () => {
    if (selectedProduct && selectedDestination) {
      axios.get(`http://localhost:3000/products?product=${selectedProduct}&destination=${selectedDestination}`)
        .then((response) => {
          setResults(response.data.results || []);
        })
        .catch((error) => console.error('Error fetching results:', error));
    }
  };

  return (
    <div>
      <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
        <option value="">Select Product</option>
        {products.map((product, index) => (
          <option key={index} value={product}>{product}</option>
        ))}
      </select>

      <select value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)}>
        <option value="">Select Destination</option>
        {destinations.map((destination, index) => (
          <option key={index} value={destination}>{destination}</option>
        ))}
      </select>

      {/* Add a Search button */}
      <button onClick={fetchResults}>Search</button>

      {/* Display sorted results */}
      <div>
        {results.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Available Units</th>
                <th>Base Price</th>
                <th>Freight Cost</th>
                <th>Total Price</th>
                <th>Mill</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.product}</td>
                  <td>{result.available_units}</td>
                  <td>{result.base_price.toFixed(2)}</td>
                  <td>{result.freight_cost.toFixed(2)}</td>
                  <td>{result.total_price.toFixed(2)}</td>
                  <td>{result.mill}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No matching options found.</div>
        )}
      </div>
    </div>
  );
}

export default ProductSelector;
