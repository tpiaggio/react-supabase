import {useEffect, useState} from "react";
import {createClient} from "@supabase/supabase-js";

const supabase = createClient(
  "https://chkqmcqzbtcninwptkfz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoa3FtY3F6YnRjbmlud3B0a2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMzAwMDQsImV4cCI6MjA0NDYwNjAwNH0.QxgDPZ_FIhBw_l8HYvcunb7U1U_WAwNULoyTXDSzZ2A"
);

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState({
    name: "",
    code: "",
    continent: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    setCountry({...country, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {data, error} = await supabase
      .from("countries")
      .insert(country)
      .select("*");
    if (error) console.log("error", error);
    setSearchQuery("");
    setCountry({name: "", code: "", continent: ""});
    getCountries();
  };

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const {data} = await supabase.from("countries").select();
    setCountries(data);
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      getCountries();
      return;
    }

    const {data, error} = await supabase
      .from("countries")
      .select("*")
      .textSearch("name_code_continent", searchQuery);

    if (error) console.log("error", error);
    setCountries(data);
  };

  return (
    <>
      <h3>Create a Country</h3>
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={country.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="code">Code:</label>
          <input
            type="text"
            id="code"
            name="code"
            value={country.code}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="continent">Continent:</label>
          <input
            type="text"
            id="continent"
            name="continent"
            value={country.continent}
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSubmit}>Create Country</button>
      </form>
      <h3>Countries</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="searchQuery">Search:</label>
        <input
          type="text"
          id="searchQuery"
          name="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </form>
      <ul>
        {countries.map((country) => (
          <>
            <li key={country.name}>
              {country.name} | {country.code} | {country.continent}
            </li>
          </>
        ))}
      </ul>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </>
  );
}

export default App;
