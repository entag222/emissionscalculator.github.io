// import logo from "./logo.svg";
import "./App.css";
import UI from "./Components/UI"

function App() {
  return (
    <div className="App">
      {/* <div className="header">Cooper Union Energy Simulator</div> */}
      <div className="header">
        <div className="header-left">
          <img src={logo} alt="Cooper Logo" />
        </div>
        <div className="header-middle">
          <div className="title-text">Cooper Union Carbon Emissions Calculator</div>
          <div className="title-after"></div>
        </div>
        <div className="header-right"></div>
      </div>
      
      <UI />
    </div>
  );
}

export default App;