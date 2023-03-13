import { Provider } from "react-redux";
import { UsersList } from "./components/UsersList/UsersList";
import { store } from "./redux/store";

function App() {
  return (
  <Provider store={store}>
    <UsersList />
    </Provider>)
}

export default App;
