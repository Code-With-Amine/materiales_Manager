import { Link } from "react-router-dom";
import homeIcon from "../assets/home-button.png";

function BackHome() {
  return (
    <Link to="/">
      <img
        src={homeIcon}
        className="backHome"
        alt="home icon"
        style={{ width: "30px", height: "30px" }}
      />
    </Link>
  );
}

export default BackHome;
