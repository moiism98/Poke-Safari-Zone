import playerIcons from "src/utils/NewPlayer/playerIcons"

const useNewPlayer = () => {

    const { icons } = playerIcons()

    return {
        icons
    }
}

export default useNewPlayer