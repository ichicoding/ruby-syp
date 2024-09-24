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
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);

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
            setFilteredResults(newResults);
          }
        })
        .catch((error) => {
          console.error('Error fetching price:', error);
          setError('An error occurred while fetching data.');
        });
    } else {
      setError('Please select both a product and a destination.');
    }
  };

  // Fetch deals when the "Deals" button is clicked
  const fetchDeals = () => {
    axios.get('http://localhost:3000/deals')
      .then(response => {
        if (response.data.length === 0) {
          setError('No deals available at the moment.');
        } else {
          setDeals(response.data);
          setFilteredDeals(response.data);
          setError('');
        }
      })
      .catch(error => {
        console.error('Error fetching deals:', error);
        setError('An error occurred while fetching deals.');
      });
  };

  // Clear search results and reset selections
  const clearResults = () => {
    setSelectedProduct('');
    setSelectedDestination('');
    setResults([]);
    setFilteredResults([]);
    setError('');
    setFilterType('');
    setDeals([]);
    setFilteredDeals([]);
  };

  // Function to extract the length from the product string
  const extractLength = (product) => {
    const match = product.match(/\d+$/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Function to extract the dimension (like '2x4') from the product string
  const extractDimension = (product) => {
    const match = product.match(/^\d+x\d+/);
    return match ? match[0] : '';
  };

  // Function to extract the grade (like '#1', '#2') from the product string
  const extractGrade = (product) => {
    const match = product.match(/#\d+/);
    return match ? match[0] : '';
  };

  // Filter results by product, mill, or grade
  const filterResults = (type, isDeals = false) => {
    const targetResults = isDeals ? deals : results;
    const setFiltered = isDeals ? setFilteredDeals : setFilteredResults;

    setFilterType(type);

    if (type === 'product') {
      const filtered = [...targetResults].sort((a, b) => {
        const dimensionA = extractDimension(a.product);
        const dimensionB = extractDimension(b.product);
        const dimensionCompare = dimensionA.localeCompare(dimensionB);
        if (dimensionCompare !== 0) return dimensionCompare;

        const gradeA = extractGrade(a.product);
        const gradeB = extractGrade(b.product);
        const gradeCompare = gradeA.localeCompare(gradeB);
        if (gradeCompare !== 0) return gradeCompare;

        const lengthA = extractLength(a.product);
        const lengthB = extractLength(b.product);
        return lengthA - lengthB;
      });
      setFiltered(filtered);
    } else if (type === 'mill') {
      const filtered = [...targetResults].sort((a, b) => {
        const millCompare = a.mill.localeCompare(b.mill);
        if (millCompare !== 0) return millCompare;

        const dimensionA = extractDimension(a.product);
        const dimensionB = extractDimension(b.product);
        const dimensionCompare = dimensionA.localeCompare(dimensionB);
        if (dimensionCompare !== 0) return dimensionCompare;

        const gradeA = extractGrade(a.product);
        const gradeB = extractGrade(b.product);
        const gradeCompare = gradeA.localeCompare(gradeB);
        if (gradeCompare !== 0) return gradeCompare;

        const lengthA = extractLength(a.product);
        const lengthB = extractLength(b.product);
        return lengthA - lengthB;
      });
      setFiltered(filtered);
    } else {
      setFiltered(targetResults);
    }
  };

  return (
    <div style={{ paddingTop: '20px', overflowY: 'auto', maxHeight: '90vh' }}> {/* Add styles to make the top buttons accessible */}
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

      <button onClick={fetchResults} style={{ marginTop: '10px' }}>Search</button>
      <button onClick={clearResults} style={{ marginTop: '10px', marginLeft: '10px' }}>Clear</button>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => filterResults('product')} style={{ padding: '10px 15px' }}>Filter by Product</button>
        <button onClick={() => filterResults('mill')} style={{ padding: '10px 15px' }}>Filter by Mill</button>
        <button
          onClick={fetchDeals}
          style={{
            padding: '10px 15px',
            backgroundColor: '#CFA73D',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          💰 Deals
        </button>
      </div>

      <div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
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

        {filteredDeals.length > 0 && (
          <>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => filterResults('product', true)} style={{ padding: '10px 15px' }}>Filter Deals by Product</button>
              <button onClick={() => filterResults('mill', true)} style={{ padding: '10px 15px' }}>Filter Deals by Mill</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Zone</th>
                  <th>Product Base Price</th>
                  <th>Print Base Price</th>
                  <th>Available Units</th>
                  <th>Mill</th>
                  <th>Price Difference</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal, index) => (
                  <tr key={index}>
                    <td>{deal.product}</td>
                    <td>{deal.zone}</td>
                    <td>{deal.product_base_price}</td>
                    <td>{deal.print_base_price}</td>
                    <td>{deal.available_units}</td>
                    <td>{deal.mill}</td>
                    <td>{deal.price_difference.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductSelector;
