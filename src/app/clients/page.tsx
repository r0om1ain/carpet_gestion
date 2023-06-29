"use client";
import { useEffect, useState, createContext } from 'react';
import Link from 'next/link';
import React from 'react';
import Modal from 'react-modal';
import 'tailwindcss/tailwind.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Clients() {

    const [isLoading,   setLoading]     = useState(true);
    const [data,        setData]        = useState([]);
    const [showForm,    setShowForm]    = useState(false);
    const [nom,         setNom]         = useState("");
    const [adresse,     setAdresse]     = useState("");
    const [isOpen,      changeIsOpen]   = useState(false);
    const router                        = useRouter();
    
    function getClients() {
        fetch('https://localhost:8000/api/clients?page=1', {
            // Ce headers permet de stocker le token dans un cookie lors de la connexion
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        })
        .then( (response) => response.json() )
        .then( (data) => loadingClientDone(data) )
    };

    function loadingClientDone(data) {
        console.log(data);
        // Permet de savoir si "data" est un tableau avec des "data" à l'intérieur
        if(Array.isArray(data))
        {
            setData(data)
        // S'il y a une erreur 401 alors cela redirect vers la page de login
        }else if(data.hasOwnProperty("code") && data.code == 401){
            console.log("redirect to login");
            router.push('/login');
        // Si on est connecté mais qu'il n'y a pas de "data" cela met un tableau vide
        }else{
            setData([]);
        }
        setLoading(false);
    }

    // Ajoute les clients via le formulaire et remet les champs vide après l'ajout
    function sendClientForm() {
        getClients();
        setNom("");
        setAdresse("");
        toggleForm();
    };

    useEffect(() => {
        getClients();
    }, []);

    // Affiche ou non via un bouton le formulaire 
    const toggleForm = () => {
        setShowForm(show => !show);
    };
    
    // Fonction qui ajoute un client via le formulaire
    const addClient = () => {
        fetch("https://localhost:8000/api/clients", {
        method: "POST",
        body: JSON.stringify({
            nom,
            adresse
        }),
        // Ce headers permet de stocker le token dans un cookie lors de la connexion
        headers: {
            "content-type": "application/json",
            Accept: 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`
        },
        }).catch((e) => console.log(e)).then(() => sendClientForm());
    };

    // Fonction qui supprime le client sélectionné
    function deleteClient(client) {
        fetch(`https://localhost:8000/api/clients/${client.id}`, {
            method : `DELETE`,
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        }).catch((e) => console.log(e)).then(() => getClients());
        console.log(client);
    }

    // Loader
    if (isLoading) 
    return  <div className="text-center">
                <div role="status">
                    <svg aria-hidden="true" className="inline w-20 h-20 m-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
    
    return (
        <div>
            {/*Bouton retour*/}
            <div className='ml-8 items-center'>
                <button className='py-8'>
                    <Link   className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' 
                            href={`/tapis/`}>Voir les tapis
                    </Link>
                </button>
            </div>
            <div className='flex mb-4'>
                <table className='m-auto mt-8 bg-blue-900'>
                    <thead>
                        <tr>
                            <th className='px-4 py-2'>ID</th>
                            <th className='px-4 py-2'>Nom</th>
                            <th className='px-4 py-2'>Nombre de tapis</th>
                            <th className='px-4 py-2'></th>
                            <th className='px-4 py-2'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            /* Parcours le tableau "Clients" pour récupérer les éléments "client" */
                            data.map((client, index)=> {
                                return <tr key={index}>
                                            <td className='border px-4 py-2'>{client.id}</td>
                                            <td className='border px-4 py-2'>{client.nom}</td>
                                            <td className='border px-4 py-2'>{client.nombreTapis}</td>
                                            <td className='border px-4 py-2'>
                                                <Link   className='bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded' 
                                                        href={`/clients/${encodeURIComponent(client.id)}`}>Voir
                                                </Link>
                                            </td>
                                            <td className='border px-4 py-2'>
                                                <button className='bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded' 
                                                        onClick={() => deleteClient(client) }> Supprimer
                                                </button>
                                            </td>
                                        </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className='flex justify-center py-2'>
                <button className='bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded' onClick={toggleForm}>Show form</button>
            </div>
            <div className=''>
                {/* "ShowForm" est un boolean qui permet de montrer et cacher le formulaire d'ajout */}
                {showForm ? 
                    // Formulaire qui ajoute un client empêche de le rechargement de la page
                    <form className='justify-center w-full' action="#" method="post"  
                        onSubmit={(e) => {e
                            .preventDefault();
                            addClient();
                        }
                    }>
                        <div className="flex justify-center py-4">
                            <div>
                                <label  className='block font-bold md:text-left mb-1 md:mb-0 pr-4' htmlFor="nom">Name :</label>
                                <input  className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' 
                                        type="text" id="nom" name="nom" 
                                // La valeur du champ est la variable d'état nom 
                                // onChange est utilisé pour mettre à jour cette variable d'état lorsque la valeur du champ change.
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}/>
                            </div>
                        </div>

                        <div className="flex justify-center py-4">
                            <div>
                                <label  className='block font-bold md:text-left mb-1 md:mb-0 pr-4' htmlFor="adresse">Adresse :</label>
                                <input  className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' 
                                        type="text" id="adresse" name="adresse"
                                // La valeur du champ est la variable d'état adresse 
                                // onChange est utilisé pour mettre à jour cette variable d'état lorsque la valeur du champ change.
                                value={adresse}
                                onChange={(e) => setAdresse(e.target.value)}/>
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
                : ""}
            </div>
        </div>
    )
}
