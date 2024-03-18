import useApp from "src/components/App/hook/useApp";
import { Context } from "src/context/AppContext";
import { useState, useContext, useEffect } from "react";
import { valueType } from "antd/es/statistic/utils";
import { Item } from "src/interfaces/interfaces";

const useShop = () => {

    const { saveFile, player, options, bag, setBag, SaveGame } = useContext(Context);
    
    const { gameScreen, FirstLetterToUpper } = useApp();

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
            const saveFileCopy = saveFile;

            if(saveFileCopy && saveFileCopy.player)
            {
                // discount money and reset money to spent
    
                player.setMoney(oldMoney => oldMoney - moneyToSpent);
    
                saveFileCopy.player.money -= moneyToSpent;
    
                setMoneyToSpent(0);
    
                
                if(item)
                {
                    const bagItem: Item | undefined = saveFileCopy.bag.find(bagItem => bagItem.id == item.id);

                    if(bagItem)
                    {
                        bagItem.cuantity += purchase;
                    }
                    else
                    {
                        saveFileCopy.bag.push({
                            id: item.id,
                            icon: item.icon,
                            name: item.name,
                            cuantity: purchase,
                            price: item.price,
                            sellPrice: item.sellPrice
                        })
                    }
                }
    
                setBag(saveFileCopy.bag);
    
                // save game putting the bag state on it!
    
                SaveGame(saveFileCopy);
    
                setItem(null);
            }
        }

    }

    const sellItem = () => {
        
        if(sell)
        {
            const saveFileCopy = saveFile;

            if(saveFileCopy && saveFileCopy.player)
            {
                // discount money and reset money to spent
                
                if(item && item.sellPrice)
                {
                    const sellPrice: number = item.sellPrice * sell;
    
                    console.log(`Selling x${sell} ${item?.name}! total gain: ${sellPrice}$`);
    
                    player.setMoney(oldMoney => oldMoney + sellPrice); 

                    saveFileCopy.player.money += sellPrice;
    
                    // remove the amount of item sold from bag!
    
                    const bagItem: Item | undefined = saveFileCopy.bag.find(bagItem => bagItem.id == item.id);
    
                    if(bagItem && bagItem.cuantity)
                    {
                        bagItem.cuantity -= sell;    
                    }
    
                    // save game putting the bag state on it!
                    
                    setBag(saveFileCopy.bag);
                    
                    SaveGame(saveFileCopy);
    
                    setItem(null);
                }
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
        player,
        moneyToSpent,
        setMoneyToSpent,
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