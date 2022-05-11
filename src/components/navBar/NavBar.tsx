import React from 'react';
import style from './NavBar.module.css'
import {NavLink} from 'react-router-dom'


export const NavBar = () => {
    return (
        <div className={'navbar'}>
            <ul className={style.list}>
                <li><NavLink to={'/'} className={(navData=>navData.isActive ? style.active:style.item)}>Profile</NavLink></li>
                <li><NavLink to={'/dialogs' }  className={(navData=>navData.isActive ? style.active:style.item)}>Messages</NavLink></li>
                <li><NavLink to={'/news'} className={(navData=>navData.isActive ? style.active:style.item)}>News</NavLink></li>
                <li><NavLink to={'/music'} className={(navData=>navData.isActive ? style.active:style.item)}>Music</NavLink></li>
                <li><NavLink to={'/setings'} className={(navData=>navData.isActive ? style.active:style.item)}>Settings</NavLink></li>
            </ul>
        </div>
    );
};
