import { useState } from "react";

export default function Dimensions() {
  const [formValues, setFormValues] = useState({ rows: 1, cols: 2, minesCount: 1 });
  const [grid, setGrid] = useState({});
  function handleFormUpdate(event, identifier) {
    setFormValues((prev) => {
      const value = { ...prev, [identifier]: event.target.value };

      let obj = {};
      for (let i = 0; i < value.rows; i++) {
        for (let j = 0; j < value.cols; j++) {
          obj[i + "" + j] = false;
        }
      }

      for (let k = 0; k < value.minesCount; k++) {
        const randomKey = getRandomKey(obj);
        obj[randomKey] = true;
      }
      console.log(obj)
      setGrid(obj);
      return value;
    });
  }

  function getRandomKey(object) {
    const keys = Object.keys(object);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  }

  function handleCellUpdate(key) {
    console.log(key)
    setGrid(prev=>({...prev,[key]:'Yes'}))
    // obj[key]='Yes'
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className=" border-solid border-2 border-indigo-600 rounded-lg ">
        <div className="mt-10 p-5">
          <form className="flex">
            <div className="mr-4">
              <label
                htmlFor="rows"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Enter Rows
              </label>
              <div className="mt-2">
                <input
                  id="rows"
                  name="rows"
                  type="number"
                  required
                  min="1"
                  value={formValues.rows}
                  onChange={(event) => handleFormUpdate(event, "rows")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="mr-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="columns"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Enter Columns
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="columns"
                  name="columns"
                  type="number"
                  required
                  min="1"
                  value={formValues.cols}
                  onChange={(event) => handleFormUpdate(event, "cols")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="minesCount"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Enter Number of mines
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="minesCount"
                  name="minesCount"
                  type="number"
                  required
                  min="1"
                  value={formValues.minesCount}
                  onChange={(event) => handleFormUpdate(event, "minesCount")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </form>

          <div
            style={{
              gridTemplateColumns: `repeat(${formValues.cols}, minmax(0, 1fr))`,
              width: "500px",
              height: "500px",
            }}
            className="mt-10 grid place-content-center h-48"
          >
            {grid &&
              Object.keys(grid)
                .sort((a, b) => Number(a) - Number(b))
                .map((value, index) => (
                  <button key={index} className="GridCell border-solid border border-rose-600 rounded-sm" 
                  onClick={()=>handleCellUpdate(value)}>
                    {value}
                    {grid[value]}
                  </button>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
