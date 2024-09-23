import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import refreshSvg from "../../assets/refresh.svg";

const ResultModal = function GameOver({ gameResult, handleResetGame }) {
  const gameResultRef = useRef(null);
  useEffect(() => {
    if (gameResultRef.current) {
      if (gameResult) {
        gameResultRef.current.showModal();
      } else {
        gameResultRef.current.close();
      }
    }
  }, [gameResult, gameResultRef.current]);

  return createPortal(
    <dialog
      ref={gameResultRef}
      onClose={handleResetGame}
      className="p-3 h-32 w-60 p-3 h-32 w-60 bg-lime-500 rounded-lg "
    >
      {
        <>
          <h2 className="font-bold text-center mt-2">{gameResult}</h2>

          <form
            method="dialog"
            className="flex justify-center text-center"
            onSubmit={handleResetGame}
          >
            <button className="mt-6 p-1  rounded-2 flex items-center mr-4">
              <img src={refreshSvg} className="icon mr-2" />
              Play again
            </button>
          </form>
        </>
      }
    </dialog>,
    document.getElementById("modal")
  );
};

export default ResultModal;
