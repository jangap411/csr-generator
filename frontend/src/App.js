import "./App.css";
import Form from "./components/Form";
import Header from "./components/Header";
import Step from "./components/Step";

function App() {
  return (
    <>
      <Header />
      <div className="ui raised very padded text container segment">
        <div className="column">
          {/* <Step /> */}
          <Form />
        </div>
      </div>
    </>
  );
}

export default App;
