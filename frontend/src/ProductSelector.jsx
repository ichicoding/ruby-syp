import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductSelector() {
  const [products, setProducts] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('');

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
        .get(`http://localhost:3000/products?product=${encodeURIComponent(selectedProduct)}&destination=${encodeURIComponent(selectedDestination)}`)
        .then((response) => {
          if (response.data.error) {
            setError(response.data.error);
          } else {
            setError('');
            const newResults = [...results, ...response.data];
            setResults(newResults);
            setFilteredResults(newResults); // Reset the filtered results to include new results
          }
        })
        .catch((error) => {
          console.error('Error fetching price:', error);
          setError('An error occurred while fetching data.');
        });
    } else {
      // Set the error message only in one place
      setError('Please select both a product and a destination.');
    }
  };

  // Clear search results and reset selections
  const clearResults = () => {
    setSelectedProduct('');
    setSelectedDestination('');
    setResults([]);
    setFilteredResults([]);
    setError('');
    setFilterType('');
  };

  // Function to extract the length from the product string
  const extractLength = (product) => {
    const match = product.match(/\d+$/); // Match the last number in the product string
    return match ? parseInt(match[0], 10) : 0; // Return the number found, or 0 if none found
  };

  // Function to extract the dimension (like '2x4') from the product string
  const extractDimension = (product) => {
    const match = product.match(/^\d+x\d+/); // Match the dimension pattern at the start
    return match ? match[0] : '';
  };

  // Function to extract the grade (like '#1', '#2') from the product string
  const extractGrade = (product) => {
    const match = product.match(/#\d+/); // Match the grade pattern
    return match ? match[0] : '';
  };

  // Filter results by product, mill, or grade
  const filterResults = (type) => {
    setFilterType(type);
    if (type === 'product') {
      const filtered = [...results].sort((a, b) => {
        const dimensionA = extractDimension(a.product);
        const dimensionB = extractDimension(b.product);

        // First, sort by dimension
        const dimensionCompare = dimensionA.localeCompare(dimensionB);
        if (dimensionCompare !== 0) return dimensionCompare;

        // If dimensions are the same, sort by grade
        const gradeA = extractGrade(a.product);
        const gradeB = extractGrade(b.product);
        const gradeCompare = gradeA.localeCompare(gradeB);
        if (gradeCompare !== 0) return gradeCompare;

        // If grades are the same, sort by length
        const lengthA = extractLength(a.product);
        const lengthB = extractLength(b.product);
        return lengthA - lengthB;
      });
      setFilteredResults(filtered);
    } else if (type === 'mill') {
      const filtered = [...results].sort((a, b) => {
        // Sort by mill first
        const millCompare = a.mill.localeCompare(b.mill);
        if (millCompare !== 0) return millCompare;

        // If mill names are the same, sort by dimension
        const dimensionA = extractDimension(a.product);
        const dimensionB = extractDimension(b.product);
        const dimensionCompare = dimensionA.localeCompare(dimensionB);
        if (dimensionCompare !== 0) return dimensionCompare;

        // If dimensions are the same, sort by grade
        const gradeA = extractGrade(a.product);
        const gradeB = extractGrade(b.product);
        const gradeCompare = gradeA.localeCompare(gradeB);
        if (gradeCompare !== 0) return gradeCompare;

        // If grades are the same, sort by length
        const lengthA = extractLength(a.product);
        const lengthB = extractLength(b.product);
        return lengthA - lengthB;
      });
      setFilteredResults(filtered);
    } else {
      setFilteredResults(results); // If no filter type is selected, show all results
    }
  };

  return (
    <div>
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

      {/* Add a Clear button */}
      <button onClick={clearResults}>Clear</button>

      {/* Filter Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => filterResults('product')}>Filter by Product</button>
        <button onClick={() => filterResults('mill')}>Filter by Mill</button>
      </div>

      <div>
        {error && <div>{error}</div>}
        {filteredResults.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Mill</th>
                <th>Available</th>
                <th>Base Price</th>
                <th>Freight Cost</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.product}</td>
                  <td>{result.mill}</td>
                  <td>{result.available}</td>
                  <td>{result.base_price}</td>
                  <td>{result.freight_costs}</td>
                  <td>{result.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProductSelector;
