import "./styles.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import COUNTRIES from "./Countries";

export default function App() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dataToShow, setDataToShow] = useState(undefined);
  const inputRef = useRef("");
  const timerRef = useRef(null);

  const fetchData = async () => {
    try {
      let res = await axios.get(
        `https://api.github.com/search/users?per_page=5&q=${inputRef.current.value}`
      );
      setDataToShow(res.data.items);
    } catch (e) {
      console.log("something went wrong");
    }
  };

  const onInputChange = (e) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      fetchData();
    }, 1000);
  };

  const setValueAndClear = () => {
    if (activeIndex !== -1) {
      setDataToShow([]);
    }
  };
  const handleKeyDown = (e) => {
    let newActiveindex;
    console.log("e", e);
    if (e.key === "ArrowDown") {
      newActiveindex = activeIndex === 4 ? 0 : activeIndex + 1;
      inputRef.current.value = dataToShow[newActiveindex].login;
      setActiveIndex(newActiveindex);
    }

    if (e.key === "ArrowUp") {
      newActiveindex = activeIndex === 0 ? 4 : activeIndex - 1;
      inputRef.current.value = dataToShow[newActiveindex].login;
      setActiveIndex(newActiveindex);
    }

    if (e.key === "Enter") {
      setValueAndClear();
    }
  };

  const onMouseEnter = (index) => {
    setActiveIndex(index);
    inputRef.current.value = dataToShow[index].login;
  };
  return (
    <div className="App">
      <h1>Type Ahead Mini Challenge</h1>
      <div className="type-ahead-container">
        <input
          type="search"
          className="input-container"
          placeholder="Search for country"
          ref={inputRef}
          onChange={(e) => onInputChange(e)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        {dataToShow && (
          <div className="results-container">
            {dataToShow.map((el, index) => {
              return (
                <div
                  className={`${index === activeIndex ? "active" : "result"}`}
                  key={index}
                  onMouseEnter={() => onMouseEnter(index)}
                  onClick={() => setValueAndClear()}
                >
                  {el.login}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
