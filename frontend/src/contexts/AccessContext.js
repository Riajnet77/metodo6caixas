import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
const Context = createContext({checkout_url: null, support_email: process.env.REACT_APP_SUPPORT_EMAIL || 'riajnet77@gmail.com', password_recovery_available: false});
export function AccessProvider({children}) {
  const [config, setConfig] = useState({checkout_url: null, support_email: process.env.REACT_APP_SUPPORT_EMAIL || 'riajnet77@gmail.com', password_recovery_available: false, loading: true});
  useEffect(() => {
    let active = true;
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/public/config`, {timeout:70000})
      .then(({data}) => {if(active) setConfig({...data, loading:false});})
      .catch(() => {if(active) setConfig(c => ({...c, loading:false}));});
    return () => {active=false;};
  }, []);
  return <Context.Provider value={config}>{children}</Context.Provider>;
}
export const useAccess = () => useContext(Context);
export function SupportLink() {
  const {support_email} = useAccess();
  return <p className="text-sm text-gray-600 mt-4">Precisa de ajuda? {support_email ? <a className="underline" href={`mailto:${support_email}?subject=Ajuda%20com%20o%20Método%206%20Caixas`}>Falar com o suporte</a> : 'Fale com o responsável pela sua compra.'}</p>;
}
