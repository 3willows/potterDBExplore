import { useState, useEffect, useCallback, ChangeEvent } from "react"
import "./App.css"

interface DataItem {
  id: string
  attributes: {
    [key: string]: string
  }
}

interface ApiResponse {
  data: DataItem[]
}

export default function App() {
  const [input, setInput] = useState<ApiResponse | null>(null)
  const [endpoint, setEndpoint] = useState<string>("books")
  const [page] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [attribute, setAttribute] = useState<string>("slug")

  const fetchData = useCallback(async () => {
    const response = await fetch(
      `https://api.potterdb.com/v1/${endpoint}${page}`
    )
    const result = await response.json()
    setInput(result)
    availableAttributes()
  }, [endpoint, page])

  useEffect(() => {
    fetchData()
  }, [fetchData, endpoint])

  // search

  const handleEndpointChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEndpoint(e.target.value)
  }

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setSearchTerm(e.target.value)
  }

  const availableAttributes = () => {
    if (input!.data[0].attributes) {
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

  const handleAttributeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAttribute(e.target.value)
  }
  // Display

  const renderFormat = (data: DataItem, nameOrTitle: string) => {
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
