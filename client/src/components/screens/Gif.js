import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import './Gif.css'

function Gif({setMessageState, usernameState, messageState, setShowGif, setGifModalOpen}) {
const [data, setData]= useState([]);
const [isloading, setIsLoading] = useState(false);
const [search, setSearch] = useState('');
//let URL =`api.giphy.com/v1/gifs/search?q=${title}&api_key=${API_KEY}&limit=10&offset=5`
useEffect(()=>{
    const fetchData = async() =>{
            setIsLoading(true);
            let API_KEY= 'IM6DimkCTEDPnuVZQ9gXJe97FJutUlIM';
            const results = await axios(`https://api.giphy.com/v1/gifs/search?q=${'study'}&api_key=${API_KEY}&limit=10&offset=5`)

            setData(results.data.data);

            setIsLoading(false);
    };
    fetchData();
},[]);

const handleGif= (el) =>{
    setMessageState({...messageState, username: usernameState, message: el.images.fixed_height.url});
    setGifModalOpen(false);
    //setShowGif(el.images.fixed_height.url)
    //console.log(el.images.fixed_height.url);
}


const renderGifs =() =>{
    if(isloading){
        return <div className="">Loading..</div>
    }
    return data.map((el) =>{
        return(
            <div onClick={() =>handleGif(el)} className="gif" key={el.id} >
                <img  src ={el.images.fixed_height.url}/>
            </div>
        )
    })
}
const HandleSeachChange =(event) =>{
    setSearch(event.target.value)
}

const handleSubmit = async (event) =>{
    event.preventDefault()
        setIsLoading(true);
        let API_KEY= 'IM6DimkCTEDPnuVZQ9gXJe97FJutUlIM';
        const results = await axios(`https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${API_KEY}&limit=10&offset=5`)

        setData(results.data.data);

        setIsLoading(false);
        }

    return (
        <div className="gif__body">
            <div className="search_gif">
                <form>
                    <input
                        value={search}
                        onChange={HandleSeachChange}
                        placeholder="Find Gif's"
                        type="text"
                    ></input>
                    <button
                        type="submit" 
                        className="gif__btn"
                        onClick ={handleSubmit}>Search</button>
                </form>
            </div>
            
            <div className="container__gif">{renderGifs()}</div>

        </div>
    )
}

export default Gif
