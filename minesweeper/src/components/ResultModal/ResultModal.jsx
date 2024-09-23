import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import refreshSvg from "../../assets/refresh.svg";

const ResultModal = forwardRef(function GameOver(
  { gameResult, handleResetGame },
  ref
) {
  console.log("game over");
  let gameOverRef = useRef();
  useImperativeHandle(
    ref,
    () => {
      return {
        open() {
          gameOverRef.current.showModal();
        },
        close() {
          gameOverRef.current.close();
        },
      };
    },
    []
  );

  return createPortal(
    <dialog
      ref={gameOverRef}
      className="p-3 h-32 w-60 p-3 h-32 w-60 bg-lime-500 rounded-lg "
    >
      {gameResult && (
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
      )}
    </dialog>,
    document.getElementById("modal")
  );
});

export default ResultModal;
