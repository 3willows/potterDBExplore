import { useState, useEffect, useCallback } from "react"
import "./App.css"

export default function App() {
  const [input, setInput] = useState(null)
  const [endpoint, setEndpoint] = useState("books")

  const [page, setPage] = useState("")
  // next page is "?page[number]=2"

  const [searchTerm, setSearchTerm] = useState("")
  const [attribute, setAttribute] = useState("slug")

  const fetchData = useCallback(async () => {
    const response = await fetch(
      `https://api.potterdb.com/v1/${endpoint}${page}`
    )
    const result = await response.json()
    console.log(`https://api.potterdb.com/v1/${endpoint}${page}`)
    setInput(result)
    availableAttributes()
  }, [endpoint, page])

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

  const handleAttributeChange = (e) => {
    setAttribute((prev) => e.target.value)
  }
  // Display

  const renderFormat = (data, nameOrTitle) => {
    return (
      <div key={data.id} style={{ display: "flex", width: "100%" }}>
        <span
          style={{
            border: "1px solid black",
            padding: "3px",
            fontWeight: "bold",
          }}
        >
          {data?.attributes?.[nameOrTitle]}
        </span>
        <span style={{ border: "1px solid black", padding: "3px" }}>
          {attribute === "cover" ||
          attribute === "poster" ||
          attribute === "image" ? (
            <img
              src={data?.attributes?.[attribute]}
              alt={data?.attributes?.[nameOrTitle]}
              width="50"
              height="60"
            ></img>
          ) : (
            data?.attributes[attribute]
          )}
        </span>
      </div>
    )
  }

  const renderSearchResults = input?.data?.map((data) => {
    if (endpoint === "books" || endpoint === "movies") {
      return (
        data?.attributes?.title?.includes(searchTerm) &&
        renderFormat(data, "title")
      )
    }
    if (
      endpoint === "characters" ||
      endpoint === "potions" ||
      endpoint === "spells"
    ) {
      return (
        data?.attributes?.name?.includes(searchTerm) &&
        renderFormat(data, "name")
      )
    }
    return null
  })

  return (
    <>
      <h3>
        Explore{" "}
        <a href="https://potterdb.com/" target="_ref">
          Potter DB
        </a>
        (WIP)
      </h3>

      <p className="">
        Endpoint{" "}
        <select onChange={handleEndpointChange}>
          <option value="books">books</option>
          <option value="characters">characters</option>
          <option value="movies">movies</option>
          <option value="potions">potions</option>
          <option value="spells">spells</option>
        </select>
      </p>
      <p className="">
        Name search <input onChange={handleSearchChange}></input>
      </p>
      <p>
        Attribute search{" "}
        <select onChange={handleAttributeChange}>
          {input?.data[0]?.attributes && availableAttributes()}
        </select>
      </p>

      <div className="">{renderSearchResults}</div>

      <div style={{ textAlign: "left" }}>
        <p>To do:</p>
        <p>
          Make sure I get all the characters, potions and spells, not just the
          ones closest to the start of the alphabet
        </p>
      </div>
    </>
  )
}
