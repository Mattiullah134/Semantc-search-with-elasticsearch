import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import axios from "axios";
import { Skelton } from "./component/Skelton";

function App() {
  const [pagination, setPagination] = useState({
    itemperpage: 10,
    page: 1,
    totaldata: 1,
  });
  const [filter, setFilter] = useState({
    search: "",
    year: "",
    searchtype: "regular",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [yearWithCount, setYearWithCount] = useState([]);
  const [data, setData] = useState([]);
  const fetchedData = async (query) => {
    try {
      if (filter.searchtype === "regular") {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000?search=${query}&page=${pagination.page}&itemperpage=${pagination.itemperpage}&year=${filter.year}`
        );
        setLoading(false);
        return res.data;
      } else {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000/embedding?search=${query}&page=${pagination.page}&itemperpage=${pagination.itemperpage}&year=${filter.year}`
        );
        setLoading(false);
        return res.data;
      }
    } catch (error) {
      setLoading(false);
      console.log("errow", error);
    }
  };
  const fetchedYearData = async (query) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/v1/get_year_count?search=${query}`
      );
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);
      console.log("errow", error);
    }
  };
  useEffect(() => {
    let timeout = setTimeout(() => {
      setDebouncedSearch(filter.search);
    }, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [filter.search]);
  useEffect(() => {
    console.log("search value", filter.search);
    if (filter.search.length > 3) {
      (async () => {
        const res = await fetchedData(filter.search);
        const resyear = await fetchedYearData(filter.search);
        setYearWithCount(resyear.data);
        setData(res.data);
        handlePagination({ target: { name: "totaldata", value: res.count } });
      })();
    } else {
      (async () => {
        const res = await fetchedData("");
        const resyear = await fetchedYearData("");
        setYearWithCount(resyear.data);
        setData(res.data);
        handlePagination({ target: { name: "totaldata", value: res.count } });
      })();
    }
  }, [debouncedSearch, filter.year]);
  useEffect(() => {
    console.log("search value", filter.search);
    (async () => {
      const res = await fetchedData(filter.search);
      setData(res.data);
      handlePagination({ target: { name: "totaldata", value: res.count } });
    })();
  }, [pagination.page, pagination.itemperpage]);
  useEffect(() => {
    (async () => {
      const res = await fetchedData("");
      setData(res.data);
      handlePagination({ target: { name: "totaldata", value: res.count } });
    })();
  }, []);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handlePagination = (e) => {
    const { name, value } = e.target;
    setPagination((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  console.log("hi----------------", yearWithCount);

  return (
    <main className="my-22 w-full px-10">
      <div className="flex px-4 py-3 rounded-md border-2 border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 192.904 192.904"
          width="16px"
          className="fill-gray-600 mr-3 rotate-90"
        >
          <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
        </svg>
        <input
          type="text"
          name="search"
          value={filter.search}
          onChange={handleOnChange}
          placeholder="Search Something..."
          className="w-full outline-none bg-transparent text-gray-600 text-sm"
        />
      </div>
      <div className="flex justify-between my-5">
        <div className="flex gap-10 items-center justify-between">
          <select
            id="year"
            name="year"
            value={filter.year}
            onChange={handleOnChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5  "
          >
            <option selected>Choose a Year</option>

            {loading ? (
              <option value="">Loading...</option>
            ) : yearWithCount.length === 0 ? (
              <option value="">No Record Found..</option>
            ) : (
              yearWithCount.map((data) => {
                return (
                  <option key={data.key} value={data.key_as_string}>
                    {data.key_as_string}({data.doc_count})
                  </option>
                );
              })
            )}
          </select>

          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5  "
            name="itemperpage"
            value={pagination.itemperpage}
            onChange={handlePagination}
          >
            <option selected>Item per page</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
          </select>
          <select
            id="year"
            name="searchtype"
            value={filter.searchtype}
            onChange={handleOnChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5  "
          >
            <option selected>Choose a Search type</option>
            <option value={"regular"}>Regular</option>
            <option value={"semantic"}>Semantic</option>
          </select>
        </div>
        <div className="flex">
          <button
            className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${
              pagination.page === 1
                ? "opacity-[0.5] cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={pagination.page == 1}
            onClick={() =>
              handlePagination({
                target: { name: "page", value: pagination.page - 1 },
              })
            }
          >
            Previous
          </button>
          <a
            href="#"
            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 `}
          >
            {pagination.page}/
            {Math.ceil(pagination.totaldata / pagination.itemperpage)}
          </a>
          <button
            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 disabled:bg-blend-lighten cursor-pointer  rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
              pagination.page ===
              Math.ceil(pagination.totaldata / pagination.itemperpage)
                ? "opacity-[0.5] cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={
              pagination.page ===
              Math.ceil(pagination.totaldata / pagination.itemperpage)
            }
            onClick={() =>
              handlePagination({
                target: { name: "page", value: pagination.page + 1 },
              })
            }
          >
            Next
          </button>
        </div>
      </div>
      <div className="px-10 my-8 flex justify-around gap-5 items-center flex-wrap">
        {loading ? (
          <Skelton />
        ) : data.length > 0 ? (
          data.map((res) => {
            return <Card key={data["_id"]} {...res["_source"]} />;
          })
        ) : (
          <div>
            <p>No record found</p>
          </div>
        )}
      </div>
    </main>
  );
}
function Card({ date, title, explanation, image_url, authors }) {
  const [viewMore, setViewMore] = useState(false);
  const toggleViewMore = () => {
    setViewMore(!viewMore);
  };
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img className="w-full h-52 object-coer" src={image_url} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">
          {`${viewMore ? explanation : explanation.slice(0, 150)}...`}
          {viewMore ? (
            <span
              className="underline text-blue-500 cursor-pointer"
              onClick={toggleViewMore}
            >
              View Less
            </span>
          ) : (
            <span
              className="underline text-blue-500 cursor-pointer"
              onClick={toggleViewMore}
            >
              View More
            </span>
          )}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2 flex justify-between">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {authors}
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {date}
        </span>
      </div>
    </div>
  );
}

export default App;
