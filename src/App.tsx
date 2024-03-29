import { useState, useEffect, useCallback } from "react"
import "./App.css"

export default function App() {
  const [input, setInput] = useState(null)
  const [endpoint, setEndpoint] = useState("books")

  const [searchTerm, setSearchTerm] = useState(null)
  const [attribute, setAttribute] = useState("slug")

  const fetchData = useCallback(async () => {
    const response = await fetch(`https://api.potterdb.com/v1/${endpoint}`)
    const result = await response.json()
    setInput(result)
  }, [endpoint])

  useEffect(() => {
    fetchData()
  }, [fetchData, endpoint])

  // search

  const handleEndpointChange = (e) => {
    setEndpoint((prev) => e.target.value)
  }

  const handleSearchChange = (e) => {
    setSearchTerm((prev) => e.target.value)
  }

  const handleAttributeChange = (e) => {
    setAttribute((prev) => e.target.value)
  }
  // Display

  const renderData = input?.data?.map((data) => {
    if (endpoint === "books" || endpoint === "movies") {
      return <li key={data.id}>{data?.attributes?.title}</li>
    }
    if (
      endpoint === "characters" ||
      endpoint === "potions" ||
      endpoint === "spells"
    ) {
      return <li key={data.id}>{data?.attributes?.name}</li>
    }
    return <li key={data.id}>{data?.id}</li>
  })

  const renderSearchResults = input?.data?.map((data) => {
    if (searchTerm === "") {
      return null
    }
    if (endpoint === "books" || endpoint === "movies") {
      return (
        data?.attributes?.title?.includes(searchTerm) && (
          <li key={data.id}>{data?.attributes?.title}</li>
        )
      )
    }
    if (
      endpoint === "characters" ||
      endpoint === "potions" ||
      endpoint === "spells"
    ) {
      return (
        data?.attributes?.name?.includes(searchTerm) && (
          <li key={data.id}>{data?.attributes?.name}</li>
        )
      )
    }
    return null
  })

  const renderSearchAttribute = input?.data?.map((data) => {
    if (searchTerm === "") {
      return  <li key={data.id}>{data?.attributes[attribute]}</li> 
    }
    if (endpoint === "books" || endpoint === "movies") {
      return (
        data?.attributes?.title?.includes(searchTerm) && (
          <li key={data.id}>{data?.attributes[attribute]}</li>
        )
      )
    }
    if (
      endpoint === "characters" ||
      endpoint === "potions" ||
      endpoint === "spells"
    ) {
      return (
        data?.attributes?.name?.includes(searchTerm) && (
          <li key={data.id}>{data?.attributes[attribute]}</li>
        )
      )
    }
    return null
  })

  const availableAttributes = () => {
    if (input.data[0].attributes) {
      return Object.getOwnPropertyNames(input?.data[0]?.attributes).map(
        (attribute) => (
          <option key={attribute} value={attribute}>
            {attribute}
          </option>
        )
      )
    }
    return null
  }

  return (
    <>
      <h3>Search Potter DB website</h3>

      <p className="">
        Endpoint <select onChange={handleEndpointChange}>
          <option value="books">books</option>
          <option value="characters">characters</option>
          <option value="movies">movies</option>
          <option value="potions">potions</option>
          <option value="spells">spells</option>
        </select>
      </p>
      <p className="">
        Search by Name {searchTerm}
        <input onChange={handleSearchChange}></input>
      </p>
      <p>
        Attribute <select onChange={handleAttributeChange}>{input?.data[0]?.attributes && availableAttributes()}</select>
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div className="">
          <p>{input && `Name`}</p>
          <p className="">{searchTerm ? renderSearchResults : renderData}</p>
        </div>
        <div className="">
          <p>Attribute: {attribute}</p>
          <p className="">{renderSearchAttribute}</p>
        </div>
      </div>
    </>
  )
}
