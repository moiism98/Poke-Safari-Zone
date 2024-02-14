import ash from 'src/assets/img/Navbar/player-icons/ash.svg';
import beauty from 'src/assets/img/Navbar/player-icons/beauty.svg';
import brock from 'src/assets/img/Navbar/player-icons/brock.svg';
import bugCatcher from 'src/assets/img/Navbar/player-icons/bug-catcher.svg';
import burglar from 'src/assets/img/Navbar/player-icons/burglar.svg';
import channeler from 'src/assets/img/Navbar/player-icons/channeler.svg';
import crushKin from 'src/assets/img/Navbar/player-icons/crush-kin.svg';
import cueBall from 'src/assets/img/Navbar/player-icons/cue-ball.svg';
import fisher from 'src/assets/img/Navbar/player-icons/fisher.svg';
import gary from 'src/assets/img/Navbar/player-icons/gary.svg';
import girlRanger from 'src/assets/img/Navbar/player-icons/girl-pokemon-ranger.svg';
import kimonoGirl from 'src/assets/img/Navbar/player-icons/kimono-girl.svg';
import lorelei from 'src/assets/img/Navbar/player-icons/lorelei.svg';
import misty from 'src/assets/img/Navbar/player-icons/misty.svg';
import painter from 'src/assets/img/Navbar/player-icons/painter.svg';
import parasolLady from 'src/assets/img/Navbar/player-icons/parasol-lady.svg';
import picknicker from 'src/assets/img/Navbar/player-icons/picnicker.svg';
import pokemaniac from 'src/assets/img/Navbar/player-icons/pokemaniac.svg';
import psychicWomen from 'src/assets/img/Navbar/player-icons/psychic-women.svg';
import teacher from 'src/assets/img/Navbar/player-icons/teacher.svg';
import teamRocket from 'src/assets/img/Navbar/player-icons/team-rocket.svg';
import youngCouple from 'src/assets/img/Navbar/player-icons/young-couple.svg';

const playerIcons = () => {

    const icons: {id: number, name: string, icon: string}[] = [
        {
            id: 1,
            name: 'Ash',
            icon: ash
        },
        {
            id: 2,
            name: 'Beauty',
            icon: beauty
        },
        {
            id: 3,
            name: 'Brock',
            icon: brock
        },
        {
            id: 4,
            name: 'Bug Catcher',
            icon: bugCatcher
        },
        {
            id: 5,
            name: 'Burglar',
            icon: burglar
        },
        {
            id: 6,
            name: 'Channeler',
            icon: channeler
        },
        {
            id: 7,
            name: 'Crush Kin',
            icon: crushKin
        },
        {
            id: 8,
            name: 'Cue Ball',
            icon: cueBall
        },
        {
            id: 9,
            name: 'Fisher',
            icon: fisher
        },
        {
            id: 10,
            name: 'Gary',
            icon: gary
        },
        {
            id: 11,
            name: 'Girl Ranger',
            icon: girlRanger
        },{
            id: 12,
            name: 'Kimono Girl',
            icon: kimonoGirl
        },{
            id: 13,
            name: 'Lorelei',
            icon: lorelei
        },{
            id: 14,
            name: 'Misty',
            icon: misty
        },{
            id: 15,
            name: 'Painter',
            icon: painter
        },
        {
            id: 16,
            name: 'Parasol Lady',
            icon: parasolLady
        },
        {
            id: 17,
            name: 'Picknicker',
            icon: picknicker
        },
        {
            id: 18,
            name: 'Pokemaniac',
            icon: pokemaniac
        },
        {
            id: 19,
            name: 'Psychic Woman',
            icon: psychicWomen
        },
        {
            id: 20,
            name: 'Teacher',
            icon: teacher
        },
        {
            id: 21,
            name: 'Team Rocket',
            icon: teamRocket
        },
        {
            id: 22,
            name: 'Young Couple',
            icon: youngCouple
        },
    ]

    return {
        icons
    }
}

export default playerIcons