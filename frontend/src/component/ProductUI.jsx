import { useState , useEffect } from "react";
import axios from "axios"
import ProductGrid from "./ProductGrid";
export default function ProductUI({search})
{
    const[products,setProducts]=useState([])
    // const fetchProducts=async()=>{
    //         try {
    //           const res = await axios.get(
    //             "http://localhost:3000/api/products/all"
    //           );
    //           setProducts(res.data);
    //         } catch (error) {
    //           console.error("Error fetching products:", error);
    //         }
    // }
    // useEffect(() => {
    //   fetchProducts();
    // }, []);

    // const filtered = products.filter((p) =>
    //   p.title.toLowerCase().includes(search.toLowerCase())
    // );

    const fetchProducts = async () => {
      try {
        const query = search.trim() ? `?search=${search.trim()}` : "";
        const res = await axios.get(
          `https://genzfashion-umr7.onrender.com/api/products${query}`
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    useEffect(() => {
      fetchProducts();
    }, [search]);

    return (
      <div style={{ padding: "20px" }}>
        {/* <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        /> */}
        <ProductGrid products={products} />
      </div>
    );
}