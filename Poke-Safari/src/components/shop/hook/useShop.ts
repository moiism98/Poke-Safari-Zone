import useApp from "src/components/App/hook/useApp";
import { Context } from "src/context/AppContext";
import { useState, useContext, useEffect } from "react";
import { valueType } from "antd/es/statistic/utils";
import { Item } from "src/interfaces/interfaces";

const useShop = () => {

    const { saveFile, options, bag, setBag, SaveGame } = useContext(Context);
    
    const { gameScreen, FirstLetterToUpper } = useApp();

    const [ pokeMoney, setPokeMoney ] = useState<number>(50000);

    const [ moneyToSpent, setMoneyToSpent ] = useState<number>(0);

    const [ purchase, setPurchase ] = useState<number>(0);

    const [ sell, setSell ] = useState<number>(0);

    const [ isPurchasing, setIsPurchasing ] = useState<boolean>(false);

    const [ item, setItem ] = useState<Item | null>();

    const onStep = (cuantity: number, itemPrice: number | undefined, info: { offset: valueType, type: "up" | "down" }) => {
       
        if(itemPrice)
        {   
            if(isPurchasing)
            {
                switch(info.type)
                {
                    case 'up': setMoneyToSpent(oldPrice => oldPrice + itemPrice); break;
        
                    case 'down': setMoneyToSpent(oldPrice => oldPrice - itemPrice); break;
                }

                setPurchase(cuantity);
            }
            else
            {
                setSell(cuantity)
            }

        }
    }

    const purchaseItem = () => {
        
        if(purchase)
        {
            // discount money and reset money to spent

            setPokeMoney(oldMoney => oldMoney - moneyToSpent);

            setMoneyToSpent(0);

            // put the item in the bag

            const bagCopy: Item[] = bag; 

            const bagItem: Item | undefined = bagCopy.find(bagItem => bagItem.id == item?.id);

            if(item)
            {
                if(bagItem && bagItem.cuantity)
                {
                    bagItem.cuantity += purchase;
                }
                else
                {
                    bagCopy.push({
                        id: item.id,
                        icon: item.icon,
                        name: item.name,
                        cuantity: purchase,
                        price: item.price,
                        sellPrice: item.sellPrice
                    })
                }
            }

            setBag(bagCopy);

            // save game putting the bag state on it!

            const saveFileCopy = saveFile;

            if(saveFileCopy)
            {
                saveFileCopy.bag = bagCopy;

                SaveGame(saveFileCopy);
            }

            setItem(null);
        }

    }

    const sellItem = () => {
        
        if(sell)
        {
            
            // discount money and reset money to spent
            
            if(item && item.sellPrice)
            {
                const sellPrice: number = item.sellPrice * sell;

                console.log(`Selling x${sell} ${item?.name}! total gain: ${sellPrice}$`);

                setPokeMoney(oldMoney => oldMoney + sellPrice); 

                // remove the amount of item sold from bag!

                let bagCopy: Item[] = bag; 

                const bagItem: Item | undefined = bagCopy.find(bagItem => bagItem.id == item.id);

                if(bagItem && bagItem.cuantity)
                {
                    bagItem.cuantity -= sell;

                    if(bagItem.cuantity <= 0)
                    {
                        const newArray: Item[] = [];

                        bagCopy.forEach(item => item.cuantity ? item.cuantity > 0 ? newArray.push(item) : null : null);

                        bagCopy = newArray;
                    }

                }

                // save game putting the bag state on it!
                
                setBag(bagCopy);

                const saveFileCopy = saveFile;

                if(saveFileCopy)
                {
                    saveFileCopy.bag = bagCopy;

                    SaveGame(saveFileCopy);
                }     

                setItem(null)
            }
        }
    }

    useEffect(() => {
    
        if(!item)
        {
            setPurchase(1);

            setSell(1);
        } 

    }, [ item ])

    return{
        gameScreen,
        options,
        pokeMoney,
        moneyToSpent,
        saveFile,
        bag,
        item,
        isPurchasing,
        setItem,
        setIsPurchasing,
        onStep,
        purchaseItem,
        sellItem,
        FirstLetterToUpper
    }
}

export default useShop