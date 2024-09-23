import flagSvg from "../../assets/flag.svg";

export default function Timer({ flags }) {
  return (
    <div className="flex items-center mr-4">
      <img src={flagSvg} className="icon mr-2" />
      {flags}
    </div>
  );
}
