import React, {useContext, useEffect, useState} from 'react'
import {observer} from "mobx-react-lite"
import {Context} from "../../../index";
import ButtonBlock from "./ButtonBlock/ButtonBlock";
import {Currency} from "../Currency";
import "./List.css"
import "../Loading.css"
// @ts-ignore
import loading_icon from '../../../image/loading_icon.svg'


const  WsList = new WebSocket(
        `wss://stream.binance.com:9443/stream?streams${(Currency?.map((i: any) =>
            (i === Currency[0]? '=':'/')+ i +'@ticker')).join('')}`
)


function List () {

    const {store} = useContext(Context)
    const [socketSelector, setSocketSelector] = useState(false)  // для того чтобы websocket не выключился, до его включения.
    const [search, setSearch] = useState('')                     // для поиска валюты.

    useEffect(() => {
        const RequestList  = async () => {
            try {             // websocket включается после сигнала об открытии списка валюты и начинает распределять информацию,
                if (store.DropList) {
                    WsList.onmessage = (e) => {
                        setSocketSelector(true);
                        let data = JSON.parse(e.data);
                        let PriceElement = document.getElementById(data?.data.s)!;
                        let PercentElement = document.getElementById(data?.data.s+'PR')!;
                        PriceElement.innerText = '$ ' + (parseFloat(data?.data.a).toFixed(2));
                        PercentElement.innerText = parseFloat((data?.data.P)).toFixed(2) + '%';
                        PercentElement.style.fontWeight='bolder';
                        if (data?.data.P < 0) {
                            PercentElement.style.color='red';
                        }else{
                            PercentElement.style.color='green';
                        }
                    }
                }                // websocket выключается после закрытия списка валюты.
                else if (!store.DropList && socketSelector) {
                    setSocketSelector(false)
                    WsList.close();
                    WsList.onclose = () => {
                        console.log("List Connection closed")
                    };
                }
            }
            catch (err) {
                console.log("Error", err);
            }
        }
        RequestList()
    }, [store.DropList]);

    return (
        <div className={!store.DropList? "ListContainer" : "ListContainer active"}>
            <input
                className='ListSearch'
                placeholder='Поиск валюты'
                value = {search}
                onChange={(e) => {setSearch(e.target.value)}}
            />
            <div className="ListCurrencyContainer">
                {Currency?.map((item, index) => (
                    <div
                        onClick={() => {store.setTempName(item.toUpperCase())}}
                        className={search &&
                        (search.slice(0, search.length).toUpperCase()
                            !== item.slice(0, search.length).toUpperCase())?
                        'ListCurrencyStr active' : 'ListCurrencyStr'}
                        key={index}>
                        <p>{item.slice(0, item.length-4).toUpperCase()}</p>
                        <p id={item.toUpperCase()}>
                            <img src={loading_icon} alt="Loading" className="loading-icon"/>
                        </p>
                        <p id={`${item.toUpperCase()}PR`}>
                            <img src={loading_icon} alt="Loading" className="loading-icon"/>
                        </p>
                    </div>
                ))}
            </div>
            <ButtonBlock/>
        </div>
    )
}


export default observer(List);