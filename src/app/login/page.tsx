"use client";
import { useEffect, useState, createContext } from 'react';
import Link from 'next/link';
import React from 'react';
import 'tailwindcss/tailwind.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Login() {

    const [password,  setPassword]  = useState("");
    const [adresse,   setAdresse]   = useState("");
    const router                    = useRouter();
    
    function login() {
        // Effectue une requête POST pour se connecter à l'URL spécifiée
        fetch("https://localhost:8000/auth", {
          method: "POST",
          body: JSON.stringify({
            'email': adresse,
            'password': password
          }),
          headers: {
            "content-type": "application/json",
          },
        })
        .then(response => response.json())
        .then(data => {
          // Récupère le JWT token de la réponse et le stocke dans un cookie
          if (data.token) {
            Cookies.set('token', data.token);
            router.push('/clients');
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          // Réinitialise le formulaire de connexion
          clearLoginForm();
        });
      }
      
      function clearLoginForm() {
        // Réinitialise les variables d'état 'password' et 'email'
        setPassword("");
        setAdresse(""); 
      }
      

    return  <div> 
                {/*Formulaire de connexion et empêche de le rechargement de la page*/}
                <form className='justify-center w-full' action="#" method="post"  
                    onSubmit={(e) => {
                        e.preventDefault();
                        login();
                    }
                }>
                    <div className="flex justify-center py-4">
                        <div>
                            <label  className='block font-bold md:text-left mb-1 md:mb-0 pr-4' htmlFor="nom">Email :</label>
                            <input  className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' 
                                    type="text" id="adresse" name="adresse"
                            // La valeur du champ est la variable d'état adresse 
                            // onChange est utilisé pour mettre à jour cette variable d'état lorsque la valeur du champ change.
                            value={adresse}
                            onChange={(e) => setAdresse(e.target.value)}/>
                        </div>
                    </div>

                    <div className="flex justify-center py-4">
                        <div>
                            <label  className='block font-bold md:text-left mb-1 md:mb-0 pr-4' htmlFor="adresse">Password :</label>
                            <input  className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' 
                                    type="password" id="password" name="password"
                            // La valeur du champ est la variable d'état password 
                            // onChange est utilisé pour mettre à jour cette variable d'état lorsque la valeur du champ change.
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </div>
                    <div>
                        <div>
                        </div>
                    </div>
                    <div className='py-8 flex justify-center'>
                        <button className='bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded' type="submit">Submit</button>
                    </div>
                </form>
            </div>
    
}
