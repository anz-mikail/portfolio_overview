import React, { useContext, useEffect, useState } from 'react'
import { observer } from "mobx-react-lite"
import { useDispatch} from "react-redux";
import { addCurrency, copyCurrency, filterCurrency } from '../../../../redux/store/slice'

import { Context } from "../../../../index";

import './ButtonBlock.css'


function ButtonBlock() {

    const {store} = useContext(Context)
    const dispatch = useDispatch()
    // @ts-ignore

    const [sumCurrency, setSumCurrency] = useState<number>()
    const [error, setError] = useState('')            // ошибка если количество валюты не валидно.
    const [click, setClick] = useState<boolean>(false)// для того чтобы валюту нельзя было добавить если есть ошибка по валидности.

    // проверка валидности введенного количества валюты.
    useEffect(() => {
            if (sumCurrency && (sumCurrency < 1 || sumCurrency >1000)
                || Number(localStorage.getItem(store.TempName.toLowerCase())) +
                Number(sumCurrency) > 1000)
                { setError("Вы ввели недопустимое значение!")}
            else if (!sumCurrency) {setError("Обязательное поле")}
            else if (!Number(sumCurrency)) {setError("Введите число!")}
            else {setError('')
            }
    });
    // кнопка сохранения выбранной валюты
    const handleButtonClick = () => {
        if (error) {
            setClick(true)
        }else {
            const name = store.TempName.toLowerCase()
            // сохранение количества валюты в куки
            // @ts-ignore
            localStorage.setItem( name, Number(sumCurrency) + Number(localStorage.getItem(name)))
            setSumCurrency(1)
            // сохранение списка валюты в redux и её фильтрация на дубликат
            dispatch(addCurrency(name))
            dispatch(filterCurrency())
            store.setSelfCurrencyClick(true)
            setClick(false)
        }
    }
    // записывается список выбранной валюты из куков
    // обратно в redux после обновления страницы
    // и отрабатывает запрос на стоимость всех активов,
    useEffect(() => {
        if (localStorage.getItem('localCurrency')){
            // @ts-ignore
            dispatch(copyCurrency(JSON.parse(localStorage.getItem('localCurrency'))))
            // @ts-ignore
            store.info(JSON.parse(localStorage.getItem('localCurrency')))
        }
        // localStorage.clear()
    }, []);
    return(
        <div className={!store.TempName ? "ListButtonContainer" : "ListButtonContainer active"}>
            <div>{`${store.TempName.slice(0, store.TempName.length - 4)}`}</div>
            <input
                className={click && error ? 'ListSum active' : 'ListSum'}
                placeholder='Количество от 1 до 1000'
                value={sumCurrency}
                onChange={(e) => {
                    // @ts-ignore
                    setSumCurrency(e.target.value);
                }}
            >
            </input>
            <div className={"ListError"}>
                <p style={!click ? {display: 'none'} : {display: 'block'}}>
                    {error}
                </p>
            </div>
            <div>
                <button
                    className='ListButton'
                    onClick={handleButtonClick}
                >Добавить
                </button>
                <button
                    className='ListButton'
                    onClick={() => {
                        store.setDropList(false)
                        store.setTempName("")
                    }}
                >Отмена
                </button>
            </div>
        </div>
    )
}


export default observer(ButtonBlock);