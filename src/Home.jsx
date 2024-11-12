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
    image: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setCountry({...country, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let image_url = null;
    if (country.image) {
      const {data, error} = await supabase.storage
        .from("images")
        .upload(country.name, country.image);
      if (error) {
        console.error("Error uploading image:", error);
      } else {
        image_url = data.path;
      }
      delete country.image;
    }
    const {error} = await supabase
      .from("countries")
      .insert({...country, image_url})
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

  const handleMessage = async (e) => {
    e.preventDefault();
    const {data, error} = await supabase.functions.invoke("hello-world", {
      body: {name: name},
    });
    setMessage(data.message);
  };

  return (
    <>
      <h3>Say Hi!</h3>
      <form>
        <div>
          <label htmlFor="name">Message:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button onClick={handleMessage}>Say Hi</button>
      </form>
      {message && <p>{message}</p>}
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
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={(e) => setCountry({...country, image: e.target.files[0]})}
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
          <li key={country.name}>
            {country.image_url && (
              <img
                src={`https://chkqmcqzbtcninwptkfz.supabase.co/storage/v1/object/public/images/${country.image_url}`}
                alt={country.name}
                height={20}
              />
            )}
            {country.name} | {country.code} | {country.continent}
          </li>
        ))}
      </ul>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </>
  );
}

export default App;
