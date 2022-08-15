import "./App.css";
import Form from "./components/Form";
import Header from "./components/Header";
import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

function App() {
  return (
    <>
      <Header />
      <div className="ui raised very padded text container segment">
        <div className="column">
          <Form />
        </div>
      </div>
    </>
  );
}

export default App;
