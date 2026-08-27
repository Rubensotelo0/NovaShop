import { Navigate} from "react-router-dom";

function ProtectedRoute({children}){
    const {user,loading} = useAuth();
/* Primera condicion para verificar si e usuario esta registrado */
    if (loading){
        return <p> Cargando...</p>;
    }
/* Segunda condicion si no existe un usuario se redirige al Login */
    if (!user){
        return<Navigate to='/login'/>
    }

    return(children)

}