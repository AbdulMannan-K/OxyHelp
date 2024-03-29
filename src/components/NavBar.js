import React from 'react';
import {useNavigate} from "react-router-dom";
import {getAuth} from "firebase/auth";
function NavBar(props) {
    const navigate = useNavigate();

    return (

        <nav className=" bg-white shadow border-gray-200 px-2 mb-10 sm:px-4 py-2.5 rounded dark:bg-gray-900 ">
            <div className="container flex flex-wrap items-center justify-between mx-auto">
                <a onClick={()=>navigate('/capsules')} className="flex items-center">
                    <img src="Oxyhelp_Logo.png" className="h-6 mr-3 sm:h-9"
                         alt="Oxyhelp Logo"/>
                </a>
                <button data-collapse-toggle="navbar-default" type="button"
                        className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clip-rule="evenodd"></path>
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <a onClick={()=>navigate('/consultations')}
                               className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white  cursor-pointer"
                               aria-current="page">Consultancy</a>
                        </li>
                        <li>
                            <a
                               onClick={()=>navigate('/clients')}
                               className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white cursor-pointer"
                               aria-current="page">Clients</a>
                        </li>
                        <li>
                            <a onClick={()=>navigate('/reports')}
                               className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white  cursor-pointer"
                               aria-current="page">Reports</a>
                        </li>
                        {localStorage.getItem('Role')=='Admin'?<li>
                            <a onClick={()=>navigate('/employees')}
                               className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white  cursor-pointer"
                               aria-current="page">Employees</a>
                        </li>:undefined}
                        <li>
                            <a href=''
                               onClick={()=>{
                                   localStorage.removeItem('Auth Token');
                                   localStorage.removeItem('employee')
                                   localStorage.removeItem('Role')
                                   const auth = getAuth();
                                   auth.signOut();
                                navigate('/login')
                               }
                               }
                               className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                               aria-current="page">{localStorage.getItem('employee')?'Logout,  '+localStorage.getItem('employee'):''}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;