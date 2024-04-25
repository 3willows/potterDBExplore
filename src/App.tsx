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

  // use Effect
  const fetchData = useCallback(async () => {
    let response
    if (
      (searchTerm && endpoint == "characters") ||
      endpoint === "spells" ||
      endpoint === "potions"
    ) {
      response = await fetch(
        `https://api.potterdb.com/v1/${endpoint}?filter[name_cont]=${searchTerm}`
      )
    } else {
      response = await fetch(`https://api.potterdb.com/v1/${endpoint}${page}`)
    }

    const result = await response.json()
    setInput(result)
    availableAttributes()
  }, [endpoint, page, searchTerm])

  useEffect(() => {
    fetchData()
  }, [fetchData, endpoint])

  //change parameters

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
      <div
        key={data.id}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
      >
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

  //search

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
      <div style={{ textAlign: "left" }}>
        {(endpoint == "characters" ||
          endpoint === "spells" ||
          (endpoint === "potions" && !searchTerm)) &&
          "Only the first entries of characters, spells and potions are shown.  If you have specific queries, enter a search term."}
      </div>
      <p></p>
      <div>{renderSearchResults}</div>

      <div style={{ textAlign: "left" }}>
        <p>To do:</p>
        <ul></ul>
        <li>Refactor and add testing framework</li>
        <li>
          Make sure search terms are case-insensitive. ("Love potion" should
          appear when the search term is "love")
        </li>
        <li>
          Add debouncing so that search requests are not fired off character by
          character.
        </li>
      </div>
    </>
  )
}
