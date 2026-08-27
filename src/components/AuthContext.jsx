import { createContext, useEffect, useState, useContext} from "react";

/* AuthContext es el contexto para compartir informacion de 
autenticacion entre componentes */
const AuthContext = createContext(null);

/*User va a ser null cuando nadie ha iniciado sesion */
function AuthProvider ({children}) { 
    /* Children es simplemente lo que va a estar dentro de este componente(App) */
    const[user, setUser] = useState(null);
    const[loading, setLoading]= useState(true);
    useEffect(()=>{
        const stored = localStorage.getItem('user');
        if(stored) setUser(JSON.parse(stored));
            setLoading(false);
    },[]);

    /* async sirve para conectar a la base de datos, dejamos preparada
    la funcion para cunado la conectemos reutilizar la funcion */
    const login = async (email, password) => {
    /* Data es un valor demo se tiene que elimnar para la base de datos 
    nomas es para comprobar que este funcionando bien */
    const data = { email, name: 'Usuario Demo' };
     setUser(data);
     /* Convierte tu objeto de Java a texto */
    localStorage.setItem('user', JSON.stringify(data));
};
    /* Borra el usuario y lo que habia dentro del cajon */
    const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
};

/* useAuth es una funcion que arregla usa el useContext en un componente
fuera de AuthProvider */
    function useAuth(){
        const ctx = useContext(AuthContext);
        if (!ctx) throw new Error ('useAuth debe usarse dentro de AuthProvider');
        return ctx;
    }

    return(
        <AuthContext.Provider value= {{user,loading,login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}