import React, {useContext} from 'react'
import {observer} from "mobx-react-lite";
import "./Header.css"
import {Context} from "../../index";


function Header() {

    const {store} = useContext(Context)

    const handleList = () => {
        !store.DropList? store.setDropList(true) : store.setDropList(false)
        store.setTempName("")
    }

    return (
        <div className={!store.DropList?"Header": "Header active"}>
            <p>PORTFOLIO OVERVIEW</p>
            <button onClick={handleList}>{!store.DropList? "Добавить": "Убрать"}</button>
        </div>
    )
}


export default observer(Header);