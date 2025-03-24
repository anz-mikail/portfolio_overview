import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import ReduxStore from './redux/store'

import App from './App';
import Store from "./mob-x/store/store"


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

interface State {
    store: Store;
}
const store = new Store();
export const Context = createContext<State>({store});


root.render(
    <Context.Provider value={{ store }}>
        <React.StrictMode>
            <Provider store={ ReduxStore }>
                <App />
            </Provider>
         </React.StrictMode>
    </Context.Provider>

);

