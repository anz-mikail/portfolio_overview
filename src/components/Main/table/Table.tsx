import React, { useContext, useEffect, useState } from 'react'
import { observer } from "mobx-react-lite";
import { useDispatch, useSelector } from 'react-redux'
// @ts-ignore
import loading_icon from '../../../image/loading_icon.svg'
import "../Loading.css"
import "./Table.css"
import { Context } from "../../../index";
import {removeCurrency} from "../../../redux/store/slice";


function Table () {

    const {store} = useContext(Context)
    const dispatch = useDispatch()
    // @ts-ignore
    const CurrencyList = useSelector(state => state.Currency.currency)

    const [currencyDelete, setCurrencyDelete] = useState(false)

    const ws = new WebSocket(
        `wss://stream.binance.com:9443/stream?streams${(CurrencyList?.map((i: any) =>
            (i === CurrencyList[0]? '=':'/')+ i +'@ticker')).join('')}`
    )
    useEffect(() => {
        if (store.SelfCurrencyClick){
            // сохранение в куках списка выбранной валюты.
            localStorage.setItem('localCurrency', JSON.stringify(CurrencyList))
            console.log('5', localStorage.getItem('localCurrency'))
            store.setSelfCurrencyClick(false)
            // очистка предыдущей базы и новый запрос чтобы, вычислить стоимость всех активов.
            store.TotalSumClear()
            store.info(CurrencyList)
        }
    },[store.SelfCurrencyClick]);
            // Включаем websocket и распределяем с него информацию.
    useEffect(() => {
          if (CurrencyList){
              const RequestList  = async () => {
                  try {
                      ws.onmessage = (e) => {
                          const data = JSON.parse(e.data)
                          const name = (data?.data.s).toLowerCase()
                          const totalSum = Number((parseFloat((data?.data.a)) *
                              Number(localStorage.getItem(name))).toFixed(2));
                          const OnePriceElement = document.getElementById(data?.data.s + 'OnePRICE')!;
                          const SumPriceElement = document.getElementById(data?.data.s + 'SumPRICE')!;
                          const ChangeElement = document.getElementById(data?.data.s + 'Change')!;
                          const PercentElement = document.getElementById(data?.data.s + 'Percent')!;
                          OnePriceElement.innerText = '$ ' + (parseFloat(data?.data.a).toFixed(2));
                          SumPriceElement.innerText = '$ ' + totalSum
                          ChangeElement.innerText = parseFloat((data?.data.P)).toFixed(2) + '%';
                          // @ts-ignore
                          PercentElement.innerText = parseFloat(( Number(totalSum) / Number(store.TotalSum)) * 100).toFixed(2) + '%';
                          ChangeElement.style.fontWeight='bolder';
                          if (data?.data.P < 0) {
                              ChangeElement.style.color='red';
                          }else{
                              ChangeElement.style.color='green';
                          }

                          // для того чтобы длинные суммы разделялись пробелом
                          // выключил потому что конфликтует с logger
                          // const prices = document.getElementsByClassName('Price1');
                          // for(let x = 0; x < prices.length; x++)
                          //     prices[x].innerHTML = prices[x].innerHTML.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

                          // console.log(data.data.s, data);
                      }
                  }
                  catch (err) {
                      console.log("Error", err);
                  }
              }
              RequestList()
          }
    }  );
    // функция удаления элемента
    const DeleteMyCurrency = (name:string) => {
        localStorage.removeItem(name)
        dispatch(removeCurrency(name))
        setCurrencyDelete(true)
    }
    // сохранение в куках нового списка выбранной валюты после удаления,
    // и принудительная перезагрузка страницы для того чтобы websocket перезагрузить
    useEffect(() => {
        if (currencyDelete) {
            if (CurrencyList.length < 1) {
                localStorage.clear()
                document.location.reload();
            } else {
                localStorage.setItem('localCurrency', JSON.stringify(CurrencyList))
                document.location.reload();
            }
            setCurrencyDelete(false)
        }
    }, [currencyDelete]);
    if (CurrencyList.length < 1) {
        return (
            <>
                <h1>
                    Нет активов в вашем портфеле. Добавьте что-нибудь чтобы начать!!!
                </h1>
            </>
        )
    } else {
        return (
            <>
                <ul className='TableContainer'>
                    <li>Актив:</li>
                    <li>Количество:</li>
                    <li>Цена:</li>
                    <li>Общая стоимость:</li>
                    <li>Изм. за 24 ч.:</li>
                    <li>% портфеля:</li>
                </ul>
                {CurrencyList?.map((item: any, index: any) => (
                    <ul
                        className='TableContainer2'
                        key={index}
                        onClick={() => {
                            DeleteMyCurrency(item)
                        }
                        }
                    >
                        <li>{item.slice(0, item.length - 4).toUpperCase()}</li>
                        <li>{localStorage.getItem(item.toLowerCase())}</li>
                        <li id={`${item.toUpperCase()}OnePRICE`} className='Price1'>
                            <img src={loading_icon} alt="Loading" className="loading-icon"/>
                        </li>
                        <li id={`${item.toUpperCase()}SumPRICE`} className='Price1'>
                            <img src={loading_icon} alt="Loading" className="loading-icon"/>
                        </li>
                        <li id={`${item.toUpperCase()}Change`}>
                            <img src={loading_icon} alt="Loading" className="loading-icon"/>
                        </li>
                        <li id={`${item.toUpperCase()}Percent`}>
                            <img src={loading_icon} alt="Loading" className="loading-icon"/>
                        </li>
                    </ul>
                ))}
            </>
        )
    }
}


export default observer(Table);
