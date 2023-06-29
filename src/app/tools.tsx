import React from 'react'

export async function callAPI(path:string, page:number=1) {
    try {
        const res = await fetch(`https://localhost:8000/api/${path}?page=${page}`);
    
        return res.json();
    } catch (err) {
        console.log(err);
    }
};
