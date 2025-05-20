import Header from "./header";
import Main from "./main";
import Footer from "./footer";
import '../static/styles/global.css'
import { getUserType } from "../utils/get_user";
import React from "react";

function Body({ children }){

    const userType = getUserType();

    return(
        <>
        <Header userType = {userType} />
        <Main>{React.cloneElement(children, { userType })}</Main>
        <Footer/>
        </>
    )
}

export default Body