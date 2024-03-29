import { useState, useEffect, useCallback } from "react"
import "./App.css"

export default function App() {
  const [input, setInput] = useState(null)
  const [endpoint, setEndpoint] = useState("books")

  const [searchTerm, setSearchTerm] = useState("")
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
      <div
        key={data.id}
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        <span style={{ border: "1px solid black" }}>
          {data?.attributes?.[nameOrTitle]}
        </span>
        <span style={{ border: "1px solid black" }}>
          {data?.attributes[attribute]}
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
      <h3>Explore Potter DB website</h3>

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
        Name search
        <input onChange={handleSearchChange}></input>
      </p>
      <p>
        Attribute search
        <select onChange={handleAttributeChange}>
          {input?.data[0]?.attributes && availableAttributes()}
        </select>
      </p>

      <div className="">
        <p className="">{renderSearchResults}</p>
      </div>
    </>
  )
}
