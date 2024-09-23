import { useCallback, useEffect, useRef, useState } from "react";
import Timer from "../Timer/Timer";
import Flags from "../Flags/Flags";
import flagSvg from "../../assets/flag.svg";
import mineSvg from "../../assets/mine.svg";
import ResultModal from "../ResultModal/ResultModal";

export default function Dimensions() {
  const colors = [
    "fill-red-600",
    "fill-blue-600",
    "fill-pink-600",
    "fill-yellow-600",
    "fill-green-600",
    "fill-orange-600",
  ];
  const bgColors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-pink-400",
    "bg-yellow-400",
    "bg-green-400",
  ];
  const [formValues, setFormValues] = useState({
    rows: 10,
    cols: 8,
    minesCount: 10,
  });
  const [grid, setGrid] = useState({});
  const [isFirstClick, setFirstClick] = useState(true);
  const [gameResult, setGameResult] = useState("");
  const [mines, setMines] = useState([]);
  const [stopTimer, setStopTimer] = useState(false);
  const [flags, setFlags] = useState(10);

  let resultModalRef = useRef(null);
  useEffect(() => {
    if (formValues) {
      createGrid(formValues);
    }
  }, [formValues]);

  function handleFormUpdate(event, identifier) {
    setFormValues((prev) => ({
      ...prev,
      [identifier]: event.target.value,
    }));
  }

  function createGrid({ rows, cols, minesCount }) {
    if (rows >= 4 && cols >= 4 && minesCount >= 1 && minesCount < rows * cols) {
      let obj = {};
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          obj[i + " " + j] = false;
        }
      }

      setGrid(obj);
    }
  }

  function updateGridOnFirstClick(key) {
    let nearestPositions = getNearestPositionsCount(key);

    while (
      nearestPositions.filter((position) => {
        const [i, j] = position.split(" ").map(Number);
        return (
          i === 0 ||
          j === 0 ||
          i === formValues.row - 1 ||
          j === formValues.cols - 1
        );
      }).length < 4
    ) {
      let x = Math.floor(Math.random() * nearestPositions.length);
      const positions = getNearestPositionsCount(nearestPositions[x]);
      nearestPositions.push(...positions);
    }
    const cellsSet = new Set(nearestPositions);
    nearestPositions = Array.from(cellsSet);
    const x = nearestPositions.map((cell) => Number(cell.split(" ")[0]));
    const y = nearestPositions.map((cell) => Number(cell.split(" ")[1]));
    const minX = Math.min(...x);
    const maxX = Math.max(...x);
    const minY = Math.min(...y);
    const maxY = Math.max(...y);
    const borderPoints = nearestPositions.filter((cell) => {
      const point = cell.split(" ");
      return (
        Number(point[0]) === minX ||
        Number(point[0]) === maxX ||
        Number(point[1]) === minY ||
        Number(point[1]) === maxY
      );
    });
    let finalPositions = [];
    console.log(borderPoints);
    for (let i = 0; i < borderPoints.length; i++) {
      finalPositions.push(...getNearestPositionsCount(borderPoints[i]));
    }
    finalPositions = finalPositions.filter(
      (position) =>
        !nearestPositions.includes(position) && !borderPoints.includes(position)
    );
    console.log(new Set(finalPositions));
    let obj = {},
      k = 0;
    if (
      formValues.minesCount <
      formValues.rows * formValues.cols - finalPositions.length
    ) {
      while (Object.keys(obj).length < formValues.minesCount) {
        let randomkey = Math.floor(Math.random() * finalPositions.length);
        console.log(finalPositions[randomkey]);
        obj[finalPositions[randomkey]] = true;
        setMines((prev) => [...prev, finalPositions[randomkey]]);
      }
    }

    for (const value of nearestPositions) {
      let count = 0;
      getNearestPositionsCount(value).forEach((position) => {
        if (obj[position] === true) {
          count++;
        }
      });
      // if (count !== 0) {
      obj[value] = count;
      // }
    }

    console.log(obj);
    setGrid((prev) => ({ ...prev, ...obj }));
  }

  function handleCellUpdate(key) {
    if (gameResult) {
      return;
    }
    console.log(key);
    if (isFirstClick) {
      updateGridOnFirstClick(key);
      setFirstClick(false);
      return;
    }
    if (grid[key] === true) {
      setStopTimer(true);
      setGameResult("You lost!!");
      resultModalRef.current.open();
      return;
    }
    if (grid[key]) {
      return;
    }

    setGrid((prev) => {
      const nearestPositions = getNearestPositionsCount(key);
      const hasFalseValues = Object.values(prev).filter(
        (value) => value === false
      );
      if (hasFalseValues.length === 1) {
        setStopTimer(true);
        setGameResult("You Won!!");
        resultModalRef.current.open();
      }
      let count = 0;
      nearestPositions.forEach((position) => {
        if (grid[position] === true) {
          count++;
        }
      });
      return { ...prev, [key]: count };
    });
  }

  function handleRightClick(event, key) {
    event.preventDefault();
    setGrid((prev) => {
      if (prev[key] === "flag") {
        setFlags((prevFlags) => prevFlags + 1);
        if (mines.includes(key)) {
          console.log(key);
          return { ...prev, [key]: true };
        }
        return { ...prev, [key]: false };
      }
      setFlags((prevFlags) => prevFlags - 1);
      return { ...prev, [key]: "flag" };
    });
  }

  function getNearestPositionsCount(key) {
    const [i, j] = key.split(" ");
    const arr = [
      i - 1 + " " + (j - 1),
      i - 1 + " " + j,
      i - 1 + " " + (-(-j) + 1),
      i + " " + (j - 1),
      i + " " + j,
      i + " " + (-(-j) + 1),
      -(-i) + 1 + " " + (j - 1),
      -(-i) + 1 + " " + j,
      -(-i) + 1 + " " + (-(-j) + 1),
    ];
    const nearestPositions = arr.filter((position) => {
      const [x, y] = position.split(" ");
      if (
        Number(x) >= 0 &&
        Number(x) < Number(formValues.rows) &&
        Number(y) >= 0 &&
        Number(y) < Number(formValues.cols) &&
        x + " " + y !== key
      ) {
        return true;
      } else {
        return false;
      }
    });

    return nearestPositions;
  }

  const handleResetGame = useCallback(() => {
    resultModalRef.current.close();
    console.log("here");
    setGrid({});
    setFormValues({
      rows: 10,
      cols: 8,
      minesCount: 10,
    });
    setFirstClick(true);
    setGameResult("");
    setMines([]);
    setStopTimer(false);
    setFlags(10);
  });

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
                  min="8"
                  value={formValues?.rows}
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
                  min="10"
                  value={formValues?.cols}
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
                  min="8"
                  value={formValues?.minesCount}
                  onChange={(event) => handleFormUpdate(event, "minesCount")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </form>

          <div
            className="flex items-center text-white bg-lime-800 mt-10 p-2 h-full"
            style={{
              width: "570px",
            }}
          >
            <Flags flags={flags} />
            <Timer stopTimer={stopTimer} isFirstClick={isFirstClick} />
          </div>

          <ResultModal
            gameResult={gameResult}
            handleResetGame={handleResetGame}
            ref={resultModalRef}
          />
          <div
            style={{
              gridTemplateColumns: `repeat(${formValues?.cols}, minmax(0, 1fr))`,
              width: "570px",
              height: "500px",
            }}
            className="grid place-content-center h-48"
          >
            {grid &&
              Object.keys(grid)
                .sort((a, b) => {
                  const num1 = a.split(" ");
                  const num2 = b.split(" ");
                  return num1[0] - num2[0];
                })
                .map((value, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellUpdate(value)}
                    onContextMenu={(event) => handleRightClick(event, value)}
                  >
                    <div
                      className="grid-cell"
                      style={{
                        backgroundColor: `${
                          (Number(value.split(" ")[0]) +
                            Number(value.split(" ")[1])) %
                            2 ===
                          0
                            ? (grid[value] || grid[value] === 0) &&
                              grid[value] !== true &&
                              grid[value] !== "flag"
                              ? "#cca97c"
                              : "rgb(163 230 53)"
                            : (grid[value] || grid[value] === 0) &&
                              grid[value] !== true &&
                              grid[value] !== "flag"
                            ? "burlywood"
                            : "rgb(190 242 100)"
                        }`,
                      }}
                    >
                      {grid[value] !== false &&
                        grid[value] !== 0 &&
                        grid[value] !== "flag" &&
                        grid[value] !== true && (
                          <div className="GridEmpty font-extrabold flex justify-center items-center ">
                            {grid[value]}
                          </div>
                        )}
                      {gameResult && grid[value] === true && (
                        <div
                          style={{
                            backgroundColor: `${
                              colors[Math.floor(Math.random() * colors.length)]
                            }`,
                          }}
                          className={`flex justify-center cell-size content-center ${
                            bgColors[
                              Math.floor(Math.random() * bgColors.length)
                            ]
                          }`}
                        >
                          <img src={mineSvg} className="h-4" />
                        </div>
                      )}
                      {grid[value] === "flag" && (
                        <div className="flex justify-center cell-size content-center">
                          <img src={flagSvg} className="cell-icon" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
