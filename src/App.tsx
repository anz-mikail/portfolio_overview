import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";

import './App.css';
import Header from "./components/Header/Header";
import {Context} from "./index";
import List from "./components/Main/list/List";
import Table from "./components/Main/table/Table";


function App() {

    const {store} = useContext(Context)

  return (
    <>
        <Header/>
        <div className={!store.DropList? "Body" : "Body active"}>
            <List/>
            <Table/>
        </div>
    </>
  );
}


export default observer(App);
