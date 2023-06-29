"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';

export default function ClientDetail({ params }) {
    const [data,            setData]            = useState({});
    const [tapis,           setTapis]           = useState([]);
    const [isLoadingClient, setLoadingClient]   = useState(true);
    const [isLoadingTapis,  setLoadingTapis]    = useState(true);

    // Lorsque les clients sont chargées, retire le loader
    function loadingClientDone(data) {
        setData(data);
        setLoadingClient(false);
    }

    // Lorsque les tapis sont chargées, retire le loader
    function loadingTapisDone(data) {
        setTapis(data);
        setLoadingTapis(false);
    }

    useEffect(() => {
        // Affiche la page du client choisi (Ex : client avec l'id 1)
        fetch(`https://localhost:8000/api/clients/${params.clientid}`)
        .then( (response) => response.json() )
        .then( (data) => loadingClientDone(data) );

        // Affiche le(s) tapis liés au client sélectionné
        fetch(`https://localhost:8000/api/clients/${params.clientid}/tapis`)
        .then( (response) => response.json() )
        .then( (data) => loadingTapisDone(typeof data["hydra:member"] !== "undefined" ? data["hydra:member"] : []) );

    }, []);
    
    // Affiche un loader tant que isLoadingClient et isLoadingTapis ne sont pas chargés
    if (isLoadingClient || isLoadingTapis) 
    return  <div className="text-center">
                <div role="status">
                    <svg aria-hidden="true" className="inline w-20 h-20 m-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
    
    
    return  <div>
                {/*Bouton retour*/}
                <div className='ml-8 items-center'>
                    <button className='py-8'>
                        <Link   className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' 
                                href={`/clients/`}>Retour
                        </Link>
                    </button>
                </div>
                {/*Tableau qui affiche les datas récupérée de l'API*/}
                <table className='m-auto mt-8 bg-blue-900'>
                    <thead>
                        <tr>
                            <th className='px-4 py-2'>ID</th>
                            <th className='px-4 py-2'>Nom</th>
                            <th className='px-4 py-2'>Nombre de tapis</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {/*Récupération de l'id, du nom et du nombre de tapis*/}
                            <td className='border px-4 py-2'>{data.id}</td>
                            <td className='border px-4 py-2'>{data.nom}</td>
                            <td className='border px-4 py-2'>{data.nombreTapis}</td>
                        </tr>
                    </tbody>
                </table>
                <table className='m-auto mt-8 bg-blue-900'>
                    <thead>
                        <tr>
                            <th className='px-4 py-2'>ID</th>
                            <th className='px-4 py-2'>Nom du client</th>
                            <th className='px-4 py-2'>Longueur</th>
                            <th className='px-4 py-2'>Largeur</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            /* Parcours le tableau "Tapis" pour récupérer les éléments "tapi" en fonction du client sélectionné*/
                            tapis.map((tapi, index)=> {
                                return <tr key={index}>
                                            <td className='border px-4 py-2'>{tapi.id}</td>
                                            <td className='border px-4 py-2'>{data.nom}</td>
                                            <td className='border px-4 py-2'>{tapi.longueur}</td>
                                            <td className='border px-4 py-2'>{tapi.largeur}</td>
                                        </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        
    }
