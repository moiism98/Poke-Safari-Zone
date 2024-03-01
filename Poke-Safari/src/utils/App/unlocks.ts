import { message } from "antd"

const unlocks = () => {

    const LevelUnlock = () => {
        message.info("SHOW LEVEL UNLOCK!");
    }

    return {
        LevelUnlock
    }
}

export default unlocks