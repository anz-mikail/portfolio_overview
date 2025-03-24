import {makeAutoObservable} from "mobx";


export default class Store {
    DropList = false;
    SelfCurrencyClick = false;
    TempName: string = "";
    TotalSum: number = 0;

    constructor() {
        makeAutoObservable(this);
    };
    setDropList(bool: boolean) {
        this.DropList = bool;
    }
    setSelfCurrencyClick(bool: boolean) {
        this.SelfCurrencyClick = bool;
    }
    setTempName(value: any) {
        this.TempName = value;
    }
    SetTotalSum(value: number) {
        this.TotalSum += Number(value);
    }
    TotalSumClear(){
        this.TotalSum = 0;
    }
    async info(CurrencyList: any) {
        try {
            const Response = await fetch('https://api.binance.com/api/v3/ticker/24hr')
            const ResponseData = await Response.json()
            // console.log(ResponseData)
            ResponseData.map((item: any) =>
                CurrencyList.map((i: any) => {switch(i.toUpperCase()) {
                    case item.symbol:
                        let number: number = Number(localStorage.getItem(item.symbol.toLowerCase()))
                        this.SetTotalSum(number * item.askPrice)
                }}
            ))
        } catch (error: any) {
            console.error(error.response?.data?.message);
        }
    }
}